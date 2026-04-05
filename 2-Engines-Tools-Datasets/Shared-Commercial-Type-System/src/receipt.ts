/**
 * Receipt Types
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Receipt types for domain operations and platform attachment.
 */

import { ID, Timestamp, KernelSource, ActorType, DomainObject } from './base';

export type ReceiptType =
  | 'state_change'
  | 'kernel_evaluation'
  | 'orchestrator_routing'
  | 'platform_emission'
  | 'trust_boundary'
  | 'typed_promotion'
  | 'advisory_intake'
  | 'voice_session'
  | 'language_normalization'
  | 'decision_bundle_assembly'
  | 'practitioner_review'
  | 'cross_domain_routing';

export interface DomainReceipt extends DomainObject {
  receipt_type: ReceiptType;
  operation: string;
  description: string;
  actor: string;
  actor_type: ActorType;
  target_id: ID;
  target_type: string;
  source_kernel: KernelSource;
  previous_state: string | null;
  new_state: string | null;
  payload_hash: string;
  parent_receipt_id: ID | null;
  related_receipt_ids: ID[];
  timestamp: Timestamp;
  replay_sequence: number;
  idempotency_key: string;
  status: 'emitted' | 'confirmed' | 'replayed' | 'voided';
}

export interface PlatformReceipt {
  platform_receipt_id: ID;
  domain_receipt_id: ID;
  domain: 'business-law-accounting';
  ledger_sequence: number;
  ledger_hash: string;
  confirmed_at: Timestamp;
}

export interface ReceiptChain {
  root_receipt_id: ID;
  receipts: DomainReceipt[];
  chain_length: number;
  chain_valid: boolean;
  validated_at: Timestamp;
}
