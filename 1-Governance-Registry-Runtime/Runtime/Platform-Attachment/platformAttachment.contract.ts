/**
 * Platform Attachment Contract
 * Domain: Business Law Accounting
 *
 * Defines the contract interface for domain-to-platform attachment.
 * This contract specifies all supported operations between the sovereign
 * domain and the 30-validkernel-platform infrastructure layer.
 */

import type {
  PlatformConfig,
  PlatformResponse,
  TrustBoundaryRequest,
  TrustBoundaryResult,
  DomainReceipt,
  ReplayRequest,
  ReplayResult,
  TypedPromotionRequest,
  TypedPromotionResult
} from './platformClient';

// --- Attachment Status ---

export type AttachmentStatus = 'CONNECTED' | 'DISCONNECTED' | 'DEGRADED' | 'INITIALIZING';

export interface AttachmentState {
  status: AttachmentStatus;
  domain_id: string;
  platform_url: string;
  api_version: string;
  connected_at?: string;
  last_heartbeat?: string;
  capabilities: PlatformCapabilitySummary[];
}

export interface PlatformCapabilitySummary {
  capability: string;
  available: boolean;
  used: boolean;
}

// --- Contract Operations ---

/**
 * IPlatformAttachment defines the full contract between
 * the Business Law Accounting domain and the shared platform.
 *
 * The domain is sovereign over truth; the platform provides infrastructure.
 */
export interface IPlatformAttachment {
  // --- Lifecycle ---
  initialize(config: PlatformConfig): Promise<AttachmentState>;
  getStatus(): AttachmentState;
  disconnect(): Promise<void>;

  // --- Trust Boundary ---
  evaluateTrustBoundary(request: TrustBoundaryRequest): Promise<PlatformResponse<TrustBoundaryResult>>;

  // --- Receipt Emission ---
  emitReceipt(receipt: DomainReceipt): Promise<PlatformResponse<{ receipt_id: string }>>;
  emitBatchReceipts(receipts: DomainReceipt[]): Promise<PlatformResponse<{ receipt_ids: string[] }>>;

  // --- Replay ---
  requestReplay(request: ReplayRequest): Promise<PlatformResponse<ReplayResult>>;
  getReplayStatus(replay_id: string): Promise<PlatformResponse<ReplayResult>>;

  // --- Typed Promotion ---
  requestTypedPromotion(request: TypedPromotionRequest): Promise<PlatformResponse<TypedPromotionResult>>;
  getPromotionStatus(promotion_id: string): Promise<PlatformResponse<TypedPromotionResult>>;

  // --- Health ---
  healthCheck(): Promise<PlatformResponse<{ healthy: boolean; latency_ms: number }>>;
}

// --- Domain Event Types for Receipt Emission ---

export type DomainEventType =
  | 'matter.created'
  | 'matter.updated'
  | 'matter.closed'
  | 'entity.created'
  | 'entity.updated'
  | 'contract.signed'
  | 'contract.amended'
  | 'obligation.created'
  | 'obligation.fulfilled'
  | 'transaction.recorded'
  | 'transaction.reconciled'
  | 'invoice.attached'
  | 'tax-posture.assessed'
  | 'decision-bundle.assembled'
  | 'constraint.evaluated'
  | 'voice-intake.received'
  | 'voice-intake.reviewed'
  | 'advisory-packet.generated';

export interface DomainEvent {
  event_type: DomainEventType;
  domain: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'cross-domain' | 'voice-language';
  entity_type: string;
  entity_id: string;
  payload: Record<string, unknown>;
  timestamp: string;
  correlation_id?: string;
}

// --- Trust Level Definitions ---

export type TrustLevel = 'UNTRUSTED' | 'PARTIALLY_TRUSTED' | 'TRUSTED' | 'SOVEREIGN';

export interface TrustLevelTransition {
  from: TrustLevel;
  to: TrustLevel;
  requires_evidence: boolean;
  requires_human_review: boolean;
  allowed: boolean;
}

/**
 * Valid trust level transitions within the domain.
 * SOVEREIGN level cannot be reached through platform promotion alone.
 */
export const TRUST_LEVEL_TRANSITIONS: TrustLevelTransition[] = [
  { from: 'UNTRUSTED', to: 'PARTIALLY_TRUSTED', requires_evidence: true, requires_human_review: false, allowed: true },
  { from: 'PARTIALLY_TRUSTED', to: 'TRUSTED', requires_evidence: true, requires_human_review: true, allowed: true },
  { from: 'TRUSTED', to: 'SOVEREIGN', requires_evidence: true, requires_human_review: true, allowed: false },
  { from: 'UNTRUSTED', to: 'TRUSTED', requires_evidence: true, requires_human_review: true, allowed: false },
  { from: 'UNTRUSTED', to: 'SOVEREIGN', requires_evidence: false, requires_human_review: false, allowed: false },
  { from: 'PARTIALLY_TRUSTED', to: 'SOVEREIGN', requires_evidence: false, requires_human_review: false, allowed: false }
];
