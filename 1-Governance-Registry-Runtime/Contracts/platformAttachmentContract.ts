/**
 * Platform Attachment Contract
 * Domain: Business Law Accounting
 *
 * Defines the attachment contract between this domain (10-business-law-accounting)
 * and the platform (30-validkernel-platform). Covers trust boundary requests,
 * receipt emission, and replay requests.
 */

export type TrustLevel = 'untrusted' | 'advisory' | 'candidate' | 'sovereign';
export type KernelSource = 'business' | 'law' | 'accounting' | 'orchestrator';

/**
 * Request to evaluate an object at a platform trust boundary.
 */
export interface PlatformTrustBoundaryRequest {
  domain: 'business-law-accounting';
  object_id: string;
  object_type: string;
  current_trust_level: TrustLevel;
  requested_trust_level: TrustLevel;
  source_kernel: KernelSource;
  operation: string;
  evidence_receipt_ids: string[];
  requested_by: string;
  timestamp: string;
}

/**
 * Platform response to a trust boundary evaluation.
 */
export interface PlatformTrustBoundaryResponse {
  approved: boolean;
  object_id: string;
  granted_trust_level: TrustLevel;
  platform_receipt_id: string;
  reason: string;
  constraints: string[];
  evaluated_at: string;
}

/**
 * Request to emit a receipt to the platform receipt ledger.
 */
export interface PlatformReceiptEmissionRequest {
  domain: 'business-law-accounting';
  receipt_type: string;
  operation: string;
  actor: string;
  actor_type: string;
  source_kernel: KernelSource;
  target_id: string;
  target_type: string;
  previous_state: string | null;
  new_state: string | null;
  payload_hash: string;
  idempotency_key: string;
  parent_receipt_id: string | null;
  timestamp: string;
}

/**
 * Platform confirmation of receipt emission.
 */
export interface PlatformReceiptEmissionResponse {
  receipt_id: string;
  replay_sequence: number;
  confirmed_at: string;
  ledger_hash: string;
}

/**
 * Request to replay operations from the platform receipt ledger.
 */
export interface PlatformReplayRequest {
  domain: 'business-law-accounting';
  from_sequence: number;
  to_sequence: number | null;
  target_id: string | null;
  target_type: string | null;
  requested_by: string;
  reason: string;
  timestamp: string;
}

/**
 * Platform response to a replay request.
 */
export interface PlatformReplayResponse {
  success: boolean;
  receipts: {
    receipt_id: string;
    sequence: number;
    operation: string;
    timestamp: string;
    payload_hash: string;
  }[];
  from_sequence: number;
  to_sequence: number;
  total_receipts: number;
  replay_receipt_id: string;
}

/**
 * Platform Attachment Contract interface.
 * This domain must implement these methods to attach to 30-validkernel-platform.
 */
export interface PlatformAttachmentContract {
  /**
   * Request trust boundary evaluation from the platform.
   */
  requestTrustBoundaryEvaluation(
    request: PlatformTrustBoundaryRequest
  ): Promise<PlatformTrustBoundaryResponse>;

  /**
   * Emit a receipt to the platform receipt ledger.
   */
  emitReceipt(
    request: PlatformReceiptEmissionRequest
  ): Promise<PlatformReceiptEmissionResponse>;

  /**
   * Request a replay of operations from the platform receipt ledger.
   */
  requestReplay(
    request: PlatformReplayRequest
  ): Promise<PlatformReplayResponse>;

  /**
   * Register this domain with the platform.
   */
  registerDomain(): Promise<{
    registered: boolean;
    domain_id: string;
    platform_version: string;
    capabilities_granted: string[];
  }>;

  /**
   * Health check for platform connectivity.
   */
  healthCheck(): Promise<{
    connected: boolean;
    latency_ms: number;
    platform_status: string;
    last_receipt_sequence: number;
  }>;
}
