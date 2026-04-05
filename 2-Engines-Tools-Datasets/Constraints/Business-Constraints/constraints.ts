/**
 * Business Constraint Family
 * Domain: Business Law Accounting — Business Kernel
 */

export type ConstraintResult = 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';

export interface ConstraintEvaluation {
  constraint_id: string;
  constraint_name: string;
  result: ConstraintResult;
  message: string;
  details?: Record<string, unknown>;
  evaluated_at: string;
}

export function evaluateMissingEntity(entityId: string | null): ConstraintEvaluation {
  return {
    constraint_id: 'BUS-001',
    constraint_name: 'missing-entity',
    result: entityId ? 'PASS' : 'HALT',
    message: entityId ? 'Entity reference present' : 'Matter has no associated entity — cannot proceed',
    evaluated_at: new Date().toISOString()
  };
}

export function evaluateIncompleteMatter(matter: { title?: string; description?: string; client_id?: string; matter_type?: string }): ConstraintEvaluation {
  const missing = [];
  if (!matter.title) missing.push('title');
  if (!matter.description) missing.push('description');
  if (!matter.client_id) missing.push('client_id');
  if (!matter.matter_type) missing.push('matter_type');

  return {
    constraint_id: 'BUS-002',
    constraint_name: 'incomplete-matter',
    result: missing.length === 0 ? 'PASS' : missing.length <= 1 ? 'WARNING' : 'HALT',
    message: missing.length === 0 ? 'Matter is complete' : `Matter missing: ${missing.join(', ')}`,
    details: { missing_fields: missing },
    evaluated_at: new Date().toISOString()
  };
}

export function evaluateUnvalidatedVendor(vendor: { verified: boolean; tax_id?: string }): ConstraintEvaluation {
  if (vendor.verified && vendor.tax_id) return { constraint_id: 'BUS-003', constraint_name: 'unvalidated-vendor', result: 'PASS', message: 'Vendor validated', evaluated_at: new Date().toISOString() };
  if (vendor.verified) return { constraint_id: 'BUS-003', constraint_name: 'unvalidated-vendor', result: 'WARNING', message: 'Vendor verified but missing tax ID', evaluated_at: new Date().toISOString() };
  return { constraint_id: 'BUS-003', constraint_name: 'unvalidated-vendor', result: 'HALT', message: 'Vendor not validated', evaluated_at: new Date().toISOString() };
}

export function evaluateBusinessRiskThreshold(riskScore: number): ConstraintEvaluation {
  return {
    constraint_id: 'BUS-004',
    constraint_name: 'business-risk-threshold',
    result: riskScore <= 0.3 ? 'PASS' : riskScore <= 0.7 ? 'WARNING' : 'HALT',
    message: `Business risk score: ${riskScore}`,
    details: { risk_score: riskScore },
    evaluated_at: new Date().toISOString()
  };
}
