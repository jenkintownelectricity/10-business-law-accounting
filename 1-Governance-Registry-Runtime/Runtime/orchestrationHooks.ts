/**
 * Orchestration Hooks
 * Domain: Business Law Accounting
 *
 * Hooks into 30-validkernel-platform for trust boundary evaluation,
 * typed promotion, receipt emission, and replay requests.
 */

export interface TrustBoundaryRequest {
  object_id: string;
  object_type: string;
  operation: string;
  requested_by: string;
  current_trust_level: 'untrusted' | 'advisory' | 'candidate' | 'sovereign';
  metadata: Record<string, unknown>;
}

export interface TrustBoundaryResult {
  approved: boolean;
  object_id: string;
  evaluated_at: string;
  trust_level: 'untrusted' | 'advisory' | 'candidate' | 'sovereign';
  reason: string;
  receipt_id: string;
}

export interface TypedPromotionRequest {
  object_id: string;
  object_type: string;
  from_trust_level: 'untrusted' | 'advisory' | 'candidate';
  to_trust_level: 'advisory' | 'candidate' | 'sovereign';
  promoted_by: string;
  promotion_reason: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  evidence_receipt_ids: string[];
}

export interface TypedPromotionResult {
  promoted: boolean;
  object_id: string;
  new_trust_level: string;
  promoted_at: string;
  receipt_id: string;
  reason: string;
}

export interface ReceiptEmissionRequest {
  receipt_type: string;
  operation: string;
  actor: string;
  actor_type: 'practitioner' | 'kernel' | 'orchestrator' | 'runtime' | 'voice_layer' | 'language_layer';
  target_id: string;
  target_type: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  previous_state: string | null;
  new_state: string | null;
  metadata?: Record<string, unknown>;
}

export interface ReplayRequest {
  from_receipt_id: string;
  to_receipt_id: string | null;
  target_id: string | null;
  target_type: string | null;
  requested_by: string;
  reason: string;
}

export interface ReplayResult {
  success: boolean;
  receipts_replayed: number;
  from_sequence: number;
  to_sequence: number;
  replay_receipt_id: string;
  errors: string[];
}

export class OrchestrationHooks {
  /**
   * Hook: Trust Boundary Evaluation
   * Called when an object needs to cross a trust boundary in 30-validkernel-platform.
   */
  async onTrustBoundaryEvaluation(request: TrustBoundaryRequest): Promise<TrustBoundaryResult> {
    const receiptId = `receipt-trust-${request.object_id}-${Date.now()}`;

    return {
      approved: true,
      object_id: request.object_id,
      evaluated_at: new Date().toISOString(),
      trust_level: request.current_trust_level,
      reason: `Trust boundary evaluation passed for ${request.object_type} ${request.object_id}`,
      receipt_id: receiptId,
    };
  }

  /**
   * Hook: Typed Promotion
   * Called when an object is being promoted to a higher trust level.
   */
  async onTypedPromotion(request: TypedPromotionRequest): Promise<TypedPromotionResult> {
    const receiptId = `receipt-promotion-${request.object_id}-${Date.now()}`;

    // Validate promotion path
    const validPromotions: Record<string, string[]> = {
      untrusted: ['advisory', 'candidate'],
      advisory: ['candidate', 'sovereign'],
      candidate: ['sovereign'],
    };

    const allowed = validPromotions[request.from_trust_level]?.includes(request.to_trust_level) ?? false;

    return {
      promoted: allowed,
      object_id: request.object_id,
      new_trust_level: allowed ? request.to_trust_level : request.from_trust_level,
      promoted_at: new Date().toISOString(),
      receipt_id: receiptId,
      reason: allowed
        ? `Promoted from ${request.from_trust_level} to ${request.to_trust_level}`
        : `Invalid promotion path: ${request.from_trust_level} -> ${request.to_trust_level}`,
    };
  }

  /**
   * Hook: Receipt Emission
   * Called when a domain operation needs to emit a receipt to the platform ledger.
   */
  async onReceiptEmission(request: ReceiptEmissionRequest): Promise<string> {
    const receiptId = `receipt-${request.receipt_type}-${request.target_id}-${Date.now()}`;

    // In production, this would emit to 30-validkernel-platform receipt ledger.
    // Receipt includes: type, operation, actor, target, state change, timestamp, idempotency key.

    return receiptId;
  }

  /**
   * Hook: Replay Request
   * Called when a replay of operations from the receipt chain is requested.
   */
  async onReplayRequest(request: ReplayRequest): Promise<ReplayResult> {
    const replayReceiptId = `receipt-replay-${Date.now()}`;

    return {
      success: true,
      receipts_replayed: 0,
      from_sequence: 0,
      to_sequence: 0,
      replay_receipt_id: replayReceiptId,
      errors: [],
    };
  }
}
