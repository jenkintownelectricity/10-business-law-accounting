/**
 * Constraint Types
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Base constraint types with standard output values.
 */

import { ID, KernelName } from './base';

/**
 * Constraint evaluation outputs:
 * - PASS: Object satisfies the constraint.
 * - WARNING: Object satisfies the constraint but with concerns.
 * - HALT: Object fails the constraint; operation should not proceed.
 * - UNSUPPORTED: This kernel cannot evaluate this constraint for this object type.
 * - PARTIAL: Object partially satisfies the constraint; some conditions unmet.
 */
export type ConstraintOutput = 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';

export interface ConstraintDefinition {
  constraint_name: string;
  description: string;
  owner_kernel: KernelName;
  applies_to: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  halt_on_fail: boolean;
}

export interface ConstraintEvaluationResult {
  constraint_name: string;
  output: ConstraintOutput;
  description: string;
  details: string | null;
  evaluated_by: KernelName;
  evaluated_at: string;
  receipt_id: ID | null;
}

export interface ConstraintSet {
  set_id: ID;
  constraints: ConstraintDefinition[];
  owner_kernel: KernelName;
  version: string;
}

/**
 * Aggregate result from evaluating multiple constraints.
 */
export interface ConstraintEvaluationSummary {
  total_constraints: number;
  pass_count: number;
  warning_count: number;
  halt_count: number;
  unsupported_count: number;
  partial_count: number;
  overall_output: ConstraintOutput;
  results: ConstraintEvaluationResult[];
  can_proceed: boolean;
}

/**
 * Computes the overall constraint output from individual results.
 */
export function computeOverallOutput(results: ConstraintEvaluationResult[]): ConstraintOutput {
  if (results.some(r => r.output === 'HALT')) return 'HALT';
  if (results.some(r => r.output === 'WARNING')) return 'WARNING';
  if (results.some(r => r.output === 'PARTIAL')) return 'PARTIAL';
  if (results.every(r => r.output === 'UNSUPPORTED')) return 'UNSUPPORTED';
  return 'PASS';
}

/**
 * Determines if operations can proceed given constraint results.
 */
export function canProceed(results: ConstraintEvaluationResult[]): boolean {
  return !results.some(r => r.output === 'HALT');
}
