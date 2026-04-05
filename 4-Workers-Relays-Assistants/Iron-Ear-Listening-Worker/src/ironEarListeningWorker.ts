/**
 * Iron-Ear-Listening-Worker
 *
 * Manages listening session lifecycle. Extracts obligation candidates,
 * deadline candidates, routing hints. Creates advisory packets. All outputs
 * require practitioner review before becoming domain truth.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ListeningSessionStatus = 'active' | 'processing' | 'complete' | 'error';

export interface ListeningSession {
  session_id: string;
  status: ListeningSessionStatus;
  started_at: string;
  ended_at?: string;
  transcript_text: string;
  participants?: string[];
  context?: string;
  metadata?: Record<string, unknown>;
}

export interface ObligationCandidate {
  candidate_id: string;
  session_id: string;
  text_excerpt: string;
  obligation_type_hint: string;
  party_hint?: string;
  deadline_hint?: string;
  confidence: number;
}

export interface DeadlineCandidate {
  candidate_id: string;
  session_id: string;
  text_excerpt: string;
  date_hint: string;
  context: string;
  confidence: number;
}

export interface RoutingHint {
  hint_id: string;
  session_id: string;
  target_kernel: 'business' | 'law' | 'accounting';
  reason: string;
  confidence: number;
}

export interface AdvisoryPacket {
  packet_id: string;
  session_id: string;
  obligation_candidates: ObligationCandidate[];
  deadline_candidates: DeadlineCandidate[];
  routing_hints: RoutingHint[];
  summary: string;
  is_advisory: true;
  requires_practitioner_review: true;
  created_at: string;
  receipt_id: string;
}

export interface ListeningReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'listening_session';
  source_kernel: 'voice';
  entity_type: 'listening_session';
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// ---------------------------------------------------------------------------
// Extraction logic (advisory / heuristic)
// ---------------------------------------------------------------------------

function extractObligationCandidates(sessionId: string, text: string): ObligationCandidate[] {
  const candidates: ObligationCandidate[] = [];
  const patterns = [
    { regex: /(?:need|have|must|should|shall|agree)\s+to\s+(\w[\w\s]{5,60})/gi, type: 'general' },
    { regex: /(?:pay|payment|invoice|bill)\s+(?:of\s+)?(\$?[\d,]+(?:\.\d{2})?)/gi, type: 'payment' },
    { regex: /(?:deliver|provide|submit)\s+([\w\s]{5,60})/gi, type: 'delivery' },
  ];

  for (const { regex, type } of patterns) {
    let match: RegExpExecArray | null;
    regex.lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      const start = Math.max(0, match.index - 30);
      const end = Math.min(text.length, match.index + match[0].length + 30);
      candidates.push({
        candidate_id: generateId('OBC'),
        session_id: sessionId,
        text_excerpt: text.substring(start, end).trim(),
        obligation_type_hint: type,
        confidence: 0.5,
      });
    }
  }

  return candidates;
}

function extractDeadlineCandidates(sessionId: string, text: string): DeadlineCandidate[] {
  const candidates: DeadlineCandidate[] = [];
  const datePatterns = [
    /(?:by|before|due|deadline)\s+(\w+\s+\d{1,2},?\s+\d{4})/gi,
    /(?:by|before|due|deadline)\s+(\d{1,2}\/\d{1,2}\/\d{2,4})/gi,
    /(?:within|in)\s+(\d+)\s+(days?|weeks?|months?)/gi,
  ];

  for (const pattern of datePatterns) {
    let match: RegExpExecArray | null;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(text)) !== null) {
      const start = Math.max(0, match.index - 30);
      const end = Math.min(text.length, match.index + match[0].length + 30);
      candidates.push({
        candidate_id: generateId('DLC'),
        session_id: sessionId,
        text_excerpt: text.substring(start, end).trim(),
        date_hint: match[1],
        context: match[0],
        confidence: 0.5,
      });
    }
  }

  return candidates;
}

function extractRoutingHints(sessionId: string, text: string): RoutingHint[] {
  const hints: RoutingHint[] = [];
  const lower = text.toLowerCase();

  const lawKeywords = ['contract', 'legal', 'compliance', 'regulatory', 'liability', 'indemnify', 'litigation'];
  const accountingKeywords = ['invoice', 'payment', 'tax', 'financial', 'ledger', 'reconcil', 'billing'];
  const businessKeywords = ['strategy', 'operations', 'client', 'market', 'revenue', 'growth', 'partnership'];

  if (lawKeywords.some((kw) => lower.includes(kw))) {
    hints.push({
      hint_id: generateId('RTH'),
      session_id: sessionId,
      target_kernel: 'law',
      reason: 'Legal terminology detected in session',
      confidence: 0.6,
    });
  }

  if (accountingKeywords.some((kw) => lower.includes(kw))) {
    hints.push({
      hint_id: generateId('RTH'),
      session_id: sessionId,
      target_kernel: 'accounting',
      reason: 'Financial terminology detected in session',
      confidence: 0.6,
    });
  }

  if (businessKeywords.some((kw) => lower.includes(kw))) {
    hints.push({
      hint_id: generateId('RTH'),
      session_id: sessionId,
      target_kernel: 'business',
      reason: 'Business terminology detected in session',
      confidence: 0.6,
    });
  }

  return hints;
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class IronEarListeningWorker {
  private sessions: Map<string, ListeningSession> = new Map();
  private receipts: ListeningReceipt[] = [];

  /**
   * Start a listening session.
   */
  startSession(sessionId: string, context?: string, participants?: string[]): ListeningSession {
    const session: ListeningSession = {
      session_id: sessionId,
      status: 'active',
      started_at: new Date().toISOString(),
      transcript_text: '',
      participants,
      context,
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Append transcript text to an active session.
   */
  appendTranscript(sessionId: string, text: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);
    if (session.status !== 'active') throw new Error(`Session is not active: ${sessionId}`);
    session.transcript_text += (session.transcript_text.length > 0 ? '\n' : '') + text;
  }

  /**
   * Complete a listening session and produce an advisory packet.
   * All outputs are advisory only and require practitioner review.
   */
  async completeSession(sessionId: string): Promise<AdvisoryPacket> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session not found: ${sessionId}`);

    session.status = 'processing';
    session.ended_at = new Date().toISOString();

    const now = new Date().toISOString();
    const receiptId = generateId('RCT');

    // Extract candidates (all advisory)
    const obligationCandidates = extractObligationCandidates(sessionId, session.transcript_text);
    const deadlineCandidates = extractDeadlineCandidates(sessionId, session.transcript_text);
    const routingHints = extractRoutingHints(sessionId, session.transcript_text);

    // Build summary
    const summary = [
      `Listening session ${sessionId} completed.`,
      `Found ${obligationCandidates.length} obligation candidate(s),`,
      `${deadlineCandidates.length} deadline candidate(s),`,
      `${routingHints.length} routing hint(s).`,
      'All outputs are advisory and require practitioner review.',
    ].join(' ');

    session.status = 'complete';

    // Emit receipt
    const receipt: ListeningReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'listening_session',
      source_kernel: 'voice',
      entity_type: 'listening_session',
      entity_id: sessionId,
      details: {
        obligation_candidates: obligationCandidates.length,
        deadline_candidates: deadlineCandidates.length,
        routing_hints: routingHints.length,
        transcript_length: session.transcript_text.length,
        participants: session.participants ?? [],
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    return {
      packet_id: generateId('APK'),
      session_id: sessionId,
      obligation_candidates: obligationCandidates,
      deadline_candidates: deadlineCandidates,
      routing_hints: routingHints,
      summary,
      is_advisory: true,
      requires_practitioner_review: true,
      created_at: now,
      receipt_id: receiptId,
    };
  }

  getSession(sessionId: string): ListeningSession | undefined {
    return this.sessions.get(sessionId);
  }

  getReceipts(): ListeningReceipt[] {
    return [...this.receipts];
  }
}
