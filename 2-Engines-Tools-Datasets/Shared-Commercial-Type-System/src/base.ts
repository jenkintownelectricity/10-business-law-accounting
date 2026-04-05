/**
 * Base Types
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Foundational types used across all kernels, orchestrator, and layers.
 */

/** Branded string type for unique identifiers. */
export type ID = string;

/** ISO 8601 timestamp string. */
export type Timestamp = string;

/** Standard status values across the domain. */
export type Status =
  | 'draft'
  | 'pending'
  | 'active'
  | 'in_progress'
  | 'completed'
  | 'on_hold'
  | 'cancelled'
  | 'archived';

/** The three sovereign kernels plus orchestrator. */
export type KernelSource = 'business' | 'law' | 'accounting' | 'orchestrator';

/** Kernel name without orchestrator. */
export type KernelName = 'business' | 'law' | 'accounting';

/** Trust levels in ascending order of authority. */
export type TrustLevel = 'untrusted' | 'advisory' | 'candidate' | 'sovereign';

/** Actor types that can perform operations in the domain. */
export type ActorType = 'practitioner' | 'kernel' | 'orchestrator' | 'runtime' | 'voice_layer' | 'language_layer';

/** Priority levels for work items. */
export type Priority = 'critical' | 'high' | 'medium' | 'low';

/** Risk levels for assessments. */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

/** Currency code (ISO 4217). */
export type CurrencyCode = string;

/** Base interface that all domain objects share. */
export interface DomainObject {
  id: ID;
  created_at: Timestamp;
  updated_at: Timestamp;
  source_kernel: KernelSource;
}

/** Metadata attached to any domain operation. */
export interface OperationMetadata {
  operation_id: ID;
  actor: string;
  actor_type: ActorType;
  timestamp: Timestamp;
  receipt_id: ID | null;
}
