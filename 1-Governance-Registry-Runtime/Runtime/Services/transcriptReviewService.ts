// ──────────────────────────────────────────────────────────────
//  TranscriptReviewService — Transcript Review & Promotion
//  Handles the review workflow for transcripts: fetch, approve
//  (promote to TRUSTED), reject, edit, and link to matters.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  TranscriptEnvelope,
  TranscriptReviewStatus,
  TrustLevel,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Types ──────────────────────────────────────────────────────

export interface TranscriptReviewFilter {
  review_status?: TranscriptReviewStatus;
  source_type?: string;
  matter_id?: string;
  trust_level?: TrustLevel;
  limit?: number;
  offset?: number;
}

export interface ApproveTranscriptRequest {
  transcript_id: string;
  approved_by: string;
  promote_to_domain_record?: boolean;
  target_matter_id?: string;
  notes?: string;
}

export interface ApproveTranscriptResult {
  transcript: TranscriptEnvelope;
  promoted: boolean;
  domain_record_id?: string;
  domain_record_type?: string;
  receipt: Receipt;
}

export interface RejectTranscriptRequest {
  transcript_id: string;
  rejected_by: string;
  reason: string;
}

export interface EditTranscriptRequest {
  transcript_id: string;
  edited_text: string;
  editor: string;
  edit_reason: string;
}

export interface LinkTranscriptRequest {
  transcript_id: string;
  matter_id: string;
  linked_by: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class TranscriptReviewService {
  private transcripts: Map<string, TranscriptEnvelope> = new Map();
  private receiptSequence = 0;

  // Allow external indexing of transcripts
  indexTranscript(transcript: TranscriptEnvelope): void {
    this.transcripts.set(transcript.id, transcript);
  }

  // ── Review Operations ──────────────────────────────────────

  async getTranscriptsForReview(filter: TranscriptReviewFilter = {}): Promise<ServiceResult<TranscriptEnvelope[]>> {
    let results = Array.from(this.transcripts.values());

    if (filter.review_status) results = results.filter(t => t.review_status === filter.review_status);
    if (filter.source_type) results = results.filter(t => t.source_type === filter.source_type);
    if (filter.matter_id) results = results.filter(t => t.matter_id === filter.matter_id);
    if (filter.trust_level) results = results.filter(t => t.trust_level === filter.trust_level);

    // Default: show pending_review first
    if (!filter.review_status) {
      results.sort((a, b) => {
        if (a.review_status === 'pending_review' && b.review_status !== 'pending_review') return -1;
        if (b.review_status === 'pending_review' && a.review_status !== 'pending_review') return 1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
    }

    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 50;
    results = results.slice(offset, offset + limit);

    return { success: true, data: results };
  }

  async approveTranscript(request: ApproveTranscriptRequest): Promise<ServiceResult<ApproveTranscriptResult>> {
    const transcript = this.transcripts.get(request.transcript_id);
    if (!transcript) {
      return { success: false, error: `Transcript ${request.transcript_id} not found` };
    }

    const previousStatus = transcript.review_status;
    const previousTrust = transcript.trust_level;

    // Promote to TRUSTED
    transcript.review_status = 'approved';
    transcript.trust_level = 'TRUSTED';
    transcript.reviewed_by = request.approved_by;
    transcript.reviewed_at = new Date().toISOString();
    transcript.updated_at = new Date().toISOString();

    if (request.target_matter_id) {
      transcript.matter_id = request.target_matter_id;
    }

    let domainRecordId: string | undefined;
    let domainRecordType: string | undefined;

    if (request.promote_to_domain_record) {
      domainRecordId = `domain_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      domainRecordType = 'matter_note';
    }

    const receipt = this.emitReceipt({
      operation: 'transcript.approved',
      description: `Transcript approved by ${request.approved_by}. Trust: ${previousTrust} -> TRUSTED${domainRecordId ? `. Promoted to ${domainRecordType}` : ''}`,
      actor: request.approved_by,
      target_id: request.transcript_id,
      target_type: 'transcript_envelope',
      previous_state: `${previousStatus}/${previousTrust}`,
      new_state: 'approved/TRUSTED',
      receipt_type: 'typed_promotion',
    });

    return {
      success: true,
      data: {
        transcript: { ...transcript },
        promoted: !!domainRecordId,
        domain_record_id: domainRecordId,
        domain_record_type: domainRecordType,
        receipt,
      },
      receipt,
    };
  }

  async rejectTranscript(request: RejectTranscriptRequest): Promise<ServiceResult<TranscriptEnvelope>> {
    const transcript = this.transcripts.get(request.transcript_id);
    if (!transcript) {
      return { success: false, error: `Transcript ${request.transcript_id} not found` };
    }

    const previousStatus = transcript.review_status;
    transcript.review_status = 'rejected';
    transcript.reviewed_by = request.rejected_by;
    transcript.reviewed_at = new Date().toISOString();
    transcript.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'transcript.rejected',
      description: `Transcript rejected by ${request.rejected_by}: ${request.reason}`,
      actor: request.rejected_by,
      target_id: request.transcript_id,
      target_type: 'transcript_envelope',
      previous_state: previousStatus,
      new_state: 'rejected',
    });

    return { success: true, data: { ...transcript }, receipt };
  }

  async editTranscript(request: EditTranscriptRequest): Promise<ServiceResult<TranscriptEnvelope>> {
    const transcript = this.transcripts.get(request.transcript_id);
    if (!transcript) {
      return { success: false, error: `Transcript ${request.transcript_id} not found` };
    }

    const previousText = transcript.transcript_text;
    transcript.transcript_text = request.edited_text;
    transcript.review_status = 'under_review';
    transcript.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'transcript.edited',
      description: `Transcript edited by ${request.editor}: ${request.edit_reason}`,
      actor: request.editor,
      target_id: request.transcript_id,
      target_type: 'transcript_envelope',
      previous_state: previousText.slice(0, 100),
      new_state: request.edited_text.slice(0, 100),
    });

    return { success: true, data: { ...transcript }, receipt };
  }

  async linkTranscriptToMatter(request: LinkTranscriptRequest): Promise<ServiceResult<TranscriptEnvelope>> {
    const transcript = this.transcripts.get(request.transcript_id);
    if (!transcript) {
      return { success: false, error: `Transcript ${request.transcript_id} not found` };
    }

    const previousMatter = transcript.matter_id;
    transcript.matter_id = request.matter_id;
    transcript.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'transcript.linked_to_matter',
      description: `Transcript linked to matter ${request.matter_id}`,
      actor: request.linked_by,
      target_id: request.transcript_id,
      target_type: 'transcript_envelope',
      previous_state: previousMatter ?? null,
      new_state: request.matter_id,
    });

    return { success: true, data: { ...transcript }, receipt };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
    previous_state?: string | null;
    new_state?: string | null;
    receipt_type?: Receipt['receipt_type'];
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: params.receipt_type ?? 'state_change',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'practitioner',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: 'orchestrator',
      previous_state: params.previous_state ?? null,
      new_state: params.new_state ?? null,
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
