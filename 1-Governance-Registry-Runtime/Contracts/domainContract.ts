/**
 * Domain Contract
 * Domain: Business Law Accounting
 *
 * Base contract interface for all domain interactions.
 * Every domain operation must conform to this contract.
 */

export type TrustLevel = 'untrusted' | 'advisory' | 'candidate' | 'sovereign';
export type KernelSource = 'business' | 'law' | 'accounting' | 'orchestrator';
export type ActorType = 'practitioner' | 'kernel' | 'orchestrator' | 'runtime' | 'voice_layer' | 'language_layer';

export interface DomainOperation {
  operation_id: string;
  operation_type: string;
  actor: string;
  actor_type: ActorType;
  source_kernel: KernelSource;
  target_id: string;
  target_type: string;
  trust_level: TrustLevel;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface DomainOperationResult {
  operation_id: string;
  success: boolean;
  result: Record<string, unknown>;
  receipt_id: string;
  errors: string[];
  warnings: string[];
  trust_level: TrustLevel;
  timestamp: string;
}

export interface DomainQuery {
  query_id: string;
  query_type: string;
  requester: string;
  requester_type: ActorType;
  target_type: string;
  filters: Record<string, unknown>;
  timestamp: string;
}

export interface DomainQueryResult {
  query_id: string;
  results: Record<string, unknown>[];
  total_count: number;
  timestamp: string;
}

/**
 * DomainContract defines the base interface for all domain interactions.
 * All kernels, the orchestrator, and assist layers must conform to this contract
 * when participating in domain operations.
 */
export interface DomainContract {
  /**
   * Execute a domain operation. Returns a result with receipt.
   */
  execute(operation: DomainOperation): Promise<DomainOperationResult>;

  /**
   * Query domain state. Read-only, no receipts emitted.
   */
  query(query: DomainQuery): Promise<DomainQueryResult>;

  /**
   * Validate whether an operation would succeed without executing it.
   */
  validate(operation: DomainOperation): Promise<{
    valid: boolean;
    constraints: string[];
    warnings: string[];
  }>;

  /**
   * Returns the domain identity of the implementing component.
   */
  getIdentity(): {
    name: string;
    version: string;
    kernel: KernelSource;
    trust_level: TrustLevel;
    capabilities: string[];
  };
}
