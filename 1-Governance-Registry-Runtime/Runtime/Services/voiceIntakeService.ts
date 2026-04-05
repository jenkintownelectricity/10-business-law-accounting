// ──────────────────────────────────────────────────────────────
//  VoiceIntakeService — Voice Intake Processing (NON-SOVEREIGN)
//  Handles dictation sessions, spoken commands, transcript
//  envelopes, and spoken note routing.
//  ALL outputs go to the review queue — nothing executes directly.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  TranscriptEnvelope,
  TranscriptSegment,
  TranscriptSourceType,
  SpokenCommandCandidate,
  SpokenNoteEnvelope,
  VoiceSessionState,
  VoiceSessionMode,
  KernelDomain,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Types ──────────────────────────────────────────────────────

export interface StartDictationRequest {
  mode: VoiceSessionMode;
  matter_id?: string;
  started_by: string;
}

export interface DictationSession {
  session_id: string;
  state: VoiceSessionState;
  started_at: string;
}

export interface ProcessSpokenCommandRequest {
  session_id: string;
  raw_text: string;
  confidence: number;
  processed_by: string;
}

export interface SpokenCommandResult {
  candidate: SpokenCommandCandidate;
  routed_to_review: true;
  review_item_id: string;
  receipt: Receipt;
}

export interface CreateTranscriptEnvelopeRequest {
  session_id: string;
  transcript_text: string;
  segments: TranscriptSegment[];
  source_type: TranscriptSourceType;
  language: string;
  duration_seconds: number;
  overall_confidence: number;
  matter_id?: string;
  created_by: string;
}

export interface RouteSpokenNoteRequest {
  session_id: string;
  raw_text: string;
  suggested_kernel?: KernelDomain;
  matter_id?: string;
  created_by: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class VoiceIntakeService {
  private sessions: Map<string, VoiceSessionState> = new Map();
  private transcripts: Map<string, TranscriptEnvelope> = new Map();
  private receiptSequence = 0;

  // ── Dictation Sessions ─────────────────────────────────────

  async startDictationSession(request: StartDictationRequest): Promise<ServiceResult<DictationSession>> {
    const now = new Date().toISOString();
    const sessionId = `voice_session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const state: VoiceSessionState = {
      id: `vss_${Date.now()}`,
      session_id: sessionId,
      status: 'listening',
      mode: request.mode,
      active_since: now,
      paused_at: null,
      total_active_duration_ms: 0,
      transcript_buffer: [],
      pending_candidates: [],
      matter_id: request.matter_id,
      error_state: null,
      last_activity_at: now,
      created_at: now,
      updated_at: now,
    };

    this.sessions.set(sessionId, state);

    const receipt = this.emitReceipt({
      operation: 'voice.session_started',
      description: `Dictation session started: mode=${request.mode}`,
      actor: request.started_by,
      target_id: sessionId,
      target_type: 'voice_session',
    });

    return {
      success: true,
      data: { session_id: sessionId, state, started_at: now },
      receipt,
    };
  }

  async endDictationSession(sessionId: string, endedBy: string): Promise<ServiceResult<VoiceSessionState>> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: `Voice session ${sessionId} not found` };
    }

    const now = new Date().toISOString();
    session.status = 'idle';
    session.total_active_duration_ms = session.active_since
      ? Date.now() - new Date(session.active_since).getTime()
      : session.total_active_duration_ms;
    session.active_since = null;
    session.last_activity_at = now;
    session.updated_at = now;

    const receipt = this.emitReceipt({
      operation: 'voice.session_ended',
      description: `Dictation session ended. Duration: ${session.total_active_duration_ms}ms. Pending candidates: ${session.pending_candidates.length}`,
      actor: endedBy,
      target_id: sessionId,
      target_type: 'voice_session',
    });

    return { success: true, data: { ...session }, receipt };
  }

  // ── Spoken Command Processing ──────────────────────────────

  async processSpokenCommand(request: ProcessSpokenCommandRequest): Promise<ServiceResult<SpokenCommandResult>> {
    const session = this.sessions.get(request.session_id);
    if (!session) {
      return { success: false, error: `Voice session ${request.session_id} not found` };
    }

    const now = new Date().toISOString();

    // Parse intent from raw text — produces a CANDIDATE, never executes
    const candidate: SpokenCommandCandidate = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      session_id: request.session_id,
      raw_text: request.raw_text,
      parsed_intent: {
        action: this.inferAction(request.raw_text),
        domain: this.inferDomain(request.raw_text),
        parameters: {},
        inferred_context: [],
      },
      confidence: request.confidence,
      target_action: {
        action_type: 'other',
        description: `Candidate action from spoken command: "${request.raw_text}"`,
        affected_object_ids: [],
        reversible: true,
        requires_elevated_review: false,
      },
      requires_review: true,
      review_status: 'pending_review',
      created_at: now,
      created_by: request.processed_by,
    };

    // Add to pending candidates
    session.pending_candidates.push({
      candidate_id: candidate.id,
      candidate_type: 'command',
      summary: request.raw_text,
      confidence: request.confidence,
      created_at: now,
    });
    session.last_activity_at = now;
    session.updated_at = now;

    const reviewItemId = `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const receipt = this.emitReceipt({
      operation: 'voice.command_processed',
      description: `Spoken command candidate created: "${request.raw_text}" — routed to review queue`,
      actor: request.processed_by,
      target_id: candidate.id,
      target_type: 'spoken_command',
    });

    return {
      success: true,
      data: {
        candidate,
        routed_to_review: true,
        review_item_id: reviewItemId,
        receipt,
      },
      receipt,
    };
  }

  // ── Transcript Envelopes ───────────────────────────────────

  async createTranscriptEnvelope(request: CreateTranscriptEnvelopeRequest): Promise<ServiceResult<TranscriptEnvelope>> {
    const now = new Date().toISOString();
    const id = `transcript_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const envelope: TranscriptEnvelope = {
      id,
      session_id: request.session_id,
      transcript_text: request.transcript_text,
      segments: request.segments,
      speaker_attributions: [],
      overall_confidence: request.overall_confidence,
      source_type: request.source_type,
      language: request.language,
      duration_seconds: request.duration_seconds,
      review_status: 'pending_review',
      routed_to_kernel: null,
      matter_id: request.matter_id,
      trust_level: 'UNTRUSTED',
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
    };

    this.transcripts.set(id, envelope);

    const receipt = this.emitReceipt({
      operation: 'voice.transcript_created',
      description: `Transcript envelope created: ${request.source_type}, confidence: ${request.overall_confidence}`,
      actor: request.created_by,
      target_id: id,
      target_type: 'transcript_envelope',
    });

    return { success: true, data: envelope, receipt };
  }

  // ── Spoken Note Routing ────────────────────────────────────

  async routeSpokenNote(request: RouteSpokenNoteRequest): Promise<ServiceResult<SpokenNoteEnvelope>> {
    const now = new Date().toISOString();
    const id = `spoken_note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const envelope: SpokenNoteEnvelope = {
      id,
      session_id: request.session_id,
      raw_text: request.raw_text,
      structured_draft: {
        title: this.generateDraftTitle(request.raw_text),
        summary: request.raw_text.slice(0, 200),
        key_points: this.extractKeyPoints(request.raw_text),
        referenced_entities: [],
        referenced_dates: [],
        referenced_amounts: [],
        suggested_tags: [],
        suggested_kernel: request.suggested_kernel ?? null,
      },
      routed_kernel: request.suggested_kernel ?? null,
      review_status: 'pending_review',
      matter_id: request.matter_id,
      editable_title: this.generateDraftTitle(request.raw_text),
      editable_content: request.raw_text,
      editable_tags: [],
      practitioner_corrections: [],
      trust_level: 'UNTRUSTED',
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
    };

    const receipt = this.emitReceipt({
      operation: 'voice.note_routed',
      description: `Spoken note routed to review: kernel hint = ${request.suggested_kernel ?? 'none'}`,
      actor: request.created_by,
      target_id: id,
      target_type: 'spoken_note',
    });

    return { success: true, data: envelope, receipt };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private inferAction(text: string): string {
    const lower = text.toLowerCase();
    if (lower.includes('create') || lower.includes('new')) return 'create';
    if (lower.includes('update') || lower.includes('change')) return 'update';
    if (lower.includes('show') || lower.includes('display')) return 'query';
    if (lower.includes('search') || lower.includes('find')) return 'search';
    if (lower.includes('note') || lower.includes('dictate')) return 'add_note';
    return 'other';
  }

  private inferDomain(text: string): KernelDomain | 'cross-domain' {
    const lower = text.toLowerCase();
    const lawTerms = ['contract', 'legal', 'clause', 'regulation', 'compliance', 'indemnif', 'liability'];
    const acctTerms = ['invoice', 'payment', 'tax', 'accounting', 'financial', 'ledger', 'expense', 'revenue'];
    const bizTerms = ['business', 'strategy', 'client', 'vendor', 'operation', 'commercial'];

    const lawScore = lawTerms.filter(t => lower.includes(t)).length;
    const acctScore = acctTerms.filter(t => lower.includes(t)).length;
    const bizScore = bizTerms.filter(t => lower.includes(t)).length;

    if (lawScore === 0 && acctScore === 0 && bizScore === 0) return 'cross-domain';
    if (lawScore >= acctScore && lawScore >= bizScore) return 'law';
    if (acctScore >= lawScore && acctScore >= bizScore) return 'accounting';
    return 'business';
  }

  private generateDraftTitle(text: string): string {
    const words = text.split(/\s+/).slice(0, 8).join(' ');
    return words.length < text.length ? `${words}...` : words;
  }

  private extractKeyPoints(text: string): string[] {
    // Simple extraction: split on sentence boundaries
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .slice(0, 5);
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
      receipt_type: 'voice_session',
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
