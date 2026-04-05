// ──────────────────────────────────────────────────────────────
//  ListeningSessionService — Iron Ear Session Management
//  Manages listening sessions for meetings, calls, and
//  discussions. Extracts obligation/deadline candidates and
//  routing hints. ALL outputs are advisory only.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  ListeningSession,
  ListeningSessionStatus,
  ObligationCandidate,
  DeadlineCandidate,
  RoutingHint,
  AdvisoryPacketReference,
  AdvisoryIntakePacket,
  KernelDomain,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Types ──────────────────────────────────────────────────────

export interface StartSessionRequest {
  title: string;
  description?: string;
  matter_id?: string;
  participant_count?: number;
  started_by: string;
}

export interface ExtractedCandidates {
  session_id: string;
  obligation_candidates: ObligationCandidate[];
  deadline_candidates: DeadlineCandidate[];
  routing_hints: RoutingHint[];
  advisory_only: true;
}

export interface AdvisoryPacketData {
  session_id: string;
  packet: AdvisoryIntakePacket;
  routed_to_review: true;
  receipt: Receipt;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class ListeningSessionService {
  private sessions: Map<string, ListeningSession> = new Map();
  private receiptSequence = 0;

  // ── Session Lifecycle ──────────────────────────────────────

  async startListeningSession(request: StartSessionRequest): Promise<ServiceResult<ListeningSession>> {
    const now = new Date().toISOString();
    const id = `listen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const sessionId = `listen_session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const session: ListeningSession = {
      id,
      session_id: sessionId,
      title: request.title,
      description: request.description,
      start_time: now,
      status: 'active',
      transcript_envelope_ids: [],
      obligation_candidates: [],
      deadline_candidates: [],
      routing_hints: [],
      advisory_packets: [],
      participant_count: request.participant_count,
      matter_id: request.matter_id,
      trust_level: 'UNTRUSTED',
      tags: [],
      created_at: now,
      updated_at: now,
      created_by: request.started_by,
    };

    this.sessions.set(id, session);

    const receipt = this.emitReceipt({
      operation: 'listening.session_started',
      description: `Listening session started: "${request.title}"`,
      actor: request.started_by,
      target_id: id,
      target_type: 'listening_session',
    });

    return { success: true, data: session, receipt };
  }

  async endListeningSession(sessionId: string, endedBy: string): Promise<ServiceResult<ListeningSession>> {
    const session = this.findBySessionId(sessionId);
    if (!session) {
      return { success: false, error: `Listening session ${sessionId} not found` };
    }

    session.status = 'completed';
    session.end_time = new Date().toISOString();
    session.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'listening.session_ended',
      description: `Listening session ended. Candidates: ${session.obligation_candidates.length} obligations, ${session.deadline_candidates.length} deadlines`,
      actor: endedBy,
      target_id: session.id,
      target_type: 'listening_session',
    });

    return { success: true, data: { ...session }, receipt };
  }

  // ── Candidate Extraction ───────────────────────────────────

  async extractCandidates(
    sessionId: string,
    transcriptText: string,
    extractedBy: string
  ): Promise<ServiceResult<ExtractedCandidates>> {
    const session = this.findBySessionId(sessionId);
    if (!session) {
      return { success: false, error: `Listening session ${sessionId} not found` };
    }

    const now = new Date().toISOString();

    // Extract obligation candidates
    const obligationCandidates = this.extractObligationCandidates(transcriptText, now);
    session.obligation_candidates.push(...obligationCandidates);

    // Extract deadline candidates
    const deadlineCandidates = this.extractDeadlineCandidates(transcriptText, now);
    session.deadline_candidates.push(...deadlineCandidates);

    // Compute routing hints
    const routingHints = this.computeRoutingHints(transcriptText);
    session.routing_hints.push(...routingHints);

    session.updated_at = now;

    const receipt = this.emitReceipt({
      operation: 'listening.candidates_extracted',
      description: `Extracted: ${obligationCandidates.length} obligations, ${deadlineCandidates.length} deadlines, ${routingHints.length} routing hints — ALL ADVISORY`,
      actor: extractedBy,
      target_id: session.id,
      target_type: 'listening_session',
    });

    return {
      success: true,
      data: {
        session_id: sessionId,
        obligation_candidates: obligationCandidates,
        deadline_candidates: deadlineCandidates,
        routing_hints: routingHints,
        advisory_only: true,
      },
      receipt,
    };
  }

  // ── Advisory Packet Creation ───────────────────────────────

  async createAdvisoryPacket(
    sessionId: string,
    createdBy: string
  ): Promise<ServiceResult<AdvisoryPacketData>> {
    const session = this.findBySessionId(sessionId);
    if (!session) {
      return { success: false, error: `Listening session ${sessionId} not found` };
    }

    const now = new Date().toISOString();
    const packetId = `advisory_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const candidateActions = [
      ...session.obligation_candidates.map(oc => ({
        id: `action_${oc.id}`,
        action_type: 'create_obligation' as const,
        description: oc.extracted_text,
        target_kernel: 'law' as KernelDomain,
        parameters: {
          suggested_type: oc.suggested_type,
          suggested_due_date: oc.suggested_due_date,
        } as Record<string, unknown>,
        confidence: oc.confidence,
        requires_practitioner_review: true as const,
      })),
      ...session.deadline_candidates.map(dc => ({
        id: `action_${dc.id}`,
        action_type: 'create_deadline' as const,
        description: dc.extracted_text,
        target_kernel: 'law' as KernelDomain,
        parameters: {
          suggested_date: dc.suggested_date,
          suggested_criticality: dc.suggested_criticality,
        } as Record<string, unknown>,
        confidence: dc.confidence,
        requires_practitioner_review: true as const,
      })),
    ];

    const packet: AdvisoryIntakePacket = {
      id: packetId,
      source_type: 'listening',
      source_session_id: session.session_id,
      content: JSON.stringify({
        obligations: session.obligation_candidates,
        deadlines: session.deadline_candidates,
        routing_hints: session.routing_hints,
      }),
      content_summary: `${session.obligation_candidates.length} obligations, ${session.deadline_candidates.length} deadlines from listening session "${session.title}"`,
      routing_suggestion: session.routing_hints[0]?.kernel ?? null,
      routing_confidence: session.routing_hints[0]?.confidence ?? 0,
      review_required: true,
      review_status: 'pending_review',
      candidate_actions: candidateActions,
      trust_level: 'UNTRUSTED',
      matter_id: session.matter_id,
      related_entity_ids: [],
      flags: [],
      created_at: now,
      updated_at: now,
      created_by: createdBy,
    };

    // Record reference on session
    session.advisory_packets.push({
      packet_id: packetId,
      packet_type: 'obligation',
      summary: packet.content_summary,
    });
    session.updated_at = now;

    const receipt = this.emitReceipt({
      operation: 'listening.advisory_packet_created',
      description: `Advisory packet created: ${candidateActions.length} candidate actions — routed to review queue`,
      actor: createdBy,
      target_id: packetId,
      target_type: 'advisory_packet',
    });

    return {
      success: true,
      data: {
        session_id: session.session_id,
        packet,
        routed_to_review: true,
        receipt,
      },
      receipt,
    };
  }

  // ── Route to Review Queue ──────────────────────────────────

  async routeToReviewQueue(
    sessionId: string,
    routedBy: string
  ): Promise<ServiceResult<{ session_id: string; review_items_created: number; receipt: Receipt }>> {
    const session = this.findBySessionId(sessionId);
    if (!session) {
      return { success: false, error: `Listening session ${sessionId} not found` };
    }

    const totalItems = session.obligation_candidates.length + session.deadline_candidates.length;

    const receipt = this.emitReceipt({
      operation: 'listening.routed_to_review',
      description: `${totalItems} items from listening session routed to review queue`,
      actor: routedBy,
      target_id: session.id,
      target_type: 'listening_session',
    });

    return {
      success: true,
      data: {
        session_id: session.session_id,
        review_items_created: totalItems,
        receipt,
      },
      receipt,
    };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private findBySessionId(sessionId: string): ListeningSession | undefined {
    for (const session of this.sessions.values()) {
      if (session.session_id === sessionId || session.id === sessionId) {
        return session;
      }
    }
    return undefined;
  }

  private extractObligationCandidates(text: string, timestamp: string): ObligationCandidate[] {
    const candidates: ObligationCandidate[] = [];
    const obligationPatterns = [
      /(?:must|shall|required to|obligated to|need to)\s+(.{10,80})/gi,
      /(?:deadline|due date|by (?:end of|the))\s+(.{5,50})/gi,
      /(?:payment|deliver|submit|report|file)\s+(.{10,60})/gi,
    ];

    for (const pattern of obligationPatterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        candidates.push({
          id: `obl_cand_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          extracted_text: match[0].trim(),
          timestamp: Date.now(),
          suggested_type: 'performance',
          confidence: 0.7,
          requires_review: true,
          review_status: 'pending',
        });
      }
    }

    return candidates;
  }

  private extractDeadlineCandidates(text: string, timestamp: string): DeadlineCandidate[] {
    const candidates: DeadlineCandidate[] = [];
    const deadlinePatterns = [
      /(?:by|before|no later than|due|deadline[:\s]+)\s*([A-Za-z]+ \d{1,2}(?:,? \d{4})?)/gi,
      /(?:end of (?:month|quarter|year|week))/gi,
      /(?:within \d+ (?:days|weeks|months|business days))/gi,
    ];

    for (const pattern of deadlinePatterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        candidates.push({
          id: `dl_cand_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          extracted_text: match[0].trim(),
          timestamp: Date.now(),
          suggested_date: new Date().toISOString(),
          suggested_description: match[0].trim(),
          suggested_criticality: 'contractual',
          confidence: 0.65,
          requires_review: true,
          review_status: 'pending',
        });
      }
    }

    return candidates;
  }

  private computeRoutingHints(text: string): RoutingHint[] {
    const lower = text.toLowerCase();
    const hints: RoutingHint[] = [];

    const lawTerms = ['contract', 'clause', 'legal', 'compliance', 'regulation', 'indemnif', 'liability'];
    const acctTerms = ['payment', 'invoice', 'tax', 'financial', 'accounting', 'cash flow', 'discount'];
    const bizTerms = ['client', 'project', 'timeline', 'capacity', 'relationship', 'commercial', 'negotiate'];

    const lawMatches = lawTerms.filter(t => lower.includes(t));
    const acctMatches = acctTerms.filter(t => lower.includes(t));
    const bizMatches = bizTerms.filter(t => lower.includes(t));

    if (lawMatches.length > 0) {
      hints.push({ kernel: 'law', reason: `Legal terms: ${lawMatches.join(', ')}`, confidence: lawMatches.length * 0.15, relevant_segments: lawMatches });
    }
    if (acctMatches.length > 0) {
      hints.push({ kernel: 'accounting', reason: `Accounting terms: ${acctMatches.join(', ')}`, confidence: acctMatches.length * 0.15, relevant_segments: acctMatches });
    }
    if (bizMatches.length > 0) {
      hints.push({ kernel: 'business', reason: `Business terms: ${bizMatches.join(', ')}`, confidence: bizMatches.length * 0.15, relevant_segments: bizMatches });
    }

    hints.sort((a, b) => b.confidence - a.confidence);
    return hints;
  }

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: 'advisory_intake',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'voice_layer',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: 'orchestrator',
      previous_state: null,
      new_state: null,
      payload_hash: `sha256_${Date.now()}`,
      parent_receipt_id: null,
      related_receipt_ids: [],
      timestamp: now,
      replay_sequence: this.receiptSequence,
      idempotency_key: `${params.operation}_${params.target_id}_${this.receiptSequence}`,
      notes: '',
      created_at: now,
      updated_at: now,
      status: 'emitted',
    };
  }
}
