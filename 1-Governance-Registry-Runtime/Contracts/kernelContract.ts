/**
 * Kernel Contract
 * Domain: Business Law Accounting
 *
 * Contract interface that all three kernels (Business, Law, Accounting)
 * must implement. Defines the standard evaluation, validation, assessment,
 * and constraint operations.
 */

export type KernelName = 'business' | 'law' | 'accounting';
export type ConstraintOutput = 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';

export interface EvaluationRequest {
  object_id: string;
  object_type: string;
  payload: Record<string, unknown>;
  evaluation_context: {
    matter_id: string | null;
    requesting_kernel: KernelName | 'orchestrator';
    priority: 'critical' | 'high' | 'medium' | 'low';
    timestamp: string;
  };
}

export interface EvaluationResult {
  kernel: KernelName;
  object_id: string;
  evaluation_type: string;
  outcome: ConstraintOutput;
  findings: {
    finding_id: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    recommendation: string;
  }[];
  constraints_evaluated: string[];
  receipt_id: string;
  evaluated_at: string;
}

export interface ValidationRequest {
  object_id: string;
  object_type: string;
  payload: Record<string, unknown>;
  validation_rules: string[];
}

export interface ValidationResult {
  kernel: KernelName;
  object_id: string;
  valid: boolean;
  violations: {
    rule: string;
    description: string;
    severity: ConstraintOutput;
    field: string | null;
  }[];
  receipt_id: string;
  validated_at: string;
}

export interface AssessmentRequest {
  matter_id: string;
  assessment_type: string;
  scope: Record<string, unknown>;
  include_recommendations: boolean;
}

export interface AssessmentResult {
  kernel: KernelName;
  matter_id: string;
  assessment_type: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  recommendations: string[];
  constraints: {
    constraint_name: string;
    output: ConstraintOutput;
    description: string;
  }[];
  confidence: number;
  receipt_id: string;
  assessed_at: string;
}

export interface KernelConstraint {
  constraint_name: string;
  description: string;
  applies_to: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  evaluation_fn: string;
}

/**
 * KernelContract is the interface that all three domain kernels must implement.
 * This ensures consistent interaction patterns across Business, Law, and Accounting.
 */
export interface KernelContract {
  /**
   * Returns the kernel identity.
   */
  readonly name: KernelName;
  readonly version: string;

  /**
   * Evaluate an object against this kernel's domain rules.
   */
  evaluate(request: EvaluationRequest): Promise<EvaluationResult>;

  /**
   * Validate an object against this kernel's validation rules.
   */
  validate(request: ValidationRequest): Promise<ValidationResult>;

  /**
   * Produce a domain assessment for a matter.
   */
  assess(request: AssessmentRequest): Promise<AssessmentResult>;

  /**
   * Get all constraints this kernel enforces.
   */
  getConstraints(): KernelConstraint[];

  /**
   * Get the list of object types this kernel owns.
   */
  getOwnedTypes(): string[];

  /**
   * Check if this kernel can handle a given object type.
   */
  canHandle(objectType: string): boolean;
}
