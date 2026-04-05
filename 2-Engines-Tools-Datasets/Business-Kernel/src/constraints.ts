export type ConstraintResult = 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';

export interface ConstraintEvaluation {
  constraint_id: string;
  constraint_name: string;
  result: ConstraintResult;
  message: string;
  evaluated_at: string;
}

export function evaluateMissingEntity(entityId: string | undefined | null): ConstraintEvaluation {
  return {
    constraint_id: 'BUS-001',
    constraint_name: 'missing-entity',
    result: entityId ? 'PASS' : 'HALT',
    message: entityId ? 'Entity reference present' : 'Matter has no associated entity',
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateIncompleteVendor(vendor: { verified: boolean; tax_id?: string }): ConstraintEvaluation {
  if (vendor.verified && vendor.tax_id) return { constraint_id: 'BUS-003', constraint_name: 'unvalidated-vendor', result: 'PASS', message: 'Vendor validated', evaluated_at: new Date().toISOString() };
  if (vendor.verified) return { constraint_id: 'BUS-003', constraint_name: 'unvalidated-vendor', result: 'WARNING', message: 'Vendor verified but missing tax ID', evaluated_at: new Date().toISOString() };
  return { constraint_id: 'BUS-003', constraint_name: 'unvalidated-vendor', result: 'HALT', message: 'Vendor not validated', evaluated_at: new Date().toISOString() };
}

export function evaluateCommercialMatterCompleteness(matter: { title?: string; description?: string; entity_id?: string; matter_type?: string }): ConstraintEvaluation {
  const missing: string[] = [];
  if (!matter.title) missing.push('title');
  if (!matter.description) missing.push('description');
  if (!matter.entity_id) missing.push('entity_id');
  if (!matter.matter_type) missing.push('matter_type');
  return {
    constraint_id: 'BUS-002',
    constraint_name: 'incomplete-matter',
    result: missing.length === 0 ? 'PASS' : missing.length <= 1 ? 'WARNING' : 'HALT',
    message: missing.length === 0 ? 'Matter complete' : `Matter missing: ${missing.join(', ')}`,
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateBusinessRiskLevel(riskScore: number): ConstraintEvaluation {
  return {
    constraint_id: 'BUS-004',
    constraint_name: 'business-risk-threshold',
    result: riskScore <= 0.3 ? 'PASS' : riskScore <= 0.7 ? 'WARNING' : 'HALT',
    message: `Business risk score: ${riskScore}`,
    evaluated_at: new Date().toISOString(),
  };
}
