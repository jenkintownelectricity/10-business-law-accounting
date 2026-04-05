// ──────────────────────────────────────────────────────────────
//  Domain Object: CommercialDecisionBundle
//  The cross-domain decision artifact assembled by the
//  Commercial Orchestrator from kernel assessments.
// ──────────────────────────────────────────────────────────────

import type { FollowUpAction, KernelDomain } from './matter.js';

export type DecisionBundleStatus = 'draft' | 'under_review' | 'approved' | 'rejected' | 'superseded';
export type ImpactLevel = 'high' | 'medium' | 'low';

export interface Risk {
  id: string;
  category: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelihood: 'almost_certain' | 'likely' | 'possible' | 'unlikely' | 'rare';
  mitigation: string;
  owning_kernel: KernelDomain;
}

export interface ConstraintEvaluation {
  constraint_id: string;
  constraint_name: string;
  result: 'satisfied' | 'violated' | 'partially_satisfied' | 'not_applicable';
  details: string;
  evaluated_at: string;
}

export interface UnresolvedConstraint {
  constraint_id: string;
  constraint_name: string;
  reason: string;
  blocking: boolean;
  suggested_resolution: string;
}

export interface KernelReceipt {
  receipt_id: string;
  kernel: KernelDomain;
  operation: string;
  timestamp: string;
  status: 'success' | 'failure' | 'partial';
  hash?: string;
}

export interface AdvisoryReceipt {
  receipt_id: string;
  source: string;
  advisory_type: string;
  timestamp: string;
  content_summary: string;
  trust_level: 'TRUSTED' | 'UNTRUSTED';
}

export interface BusinessAssessment {
  kernel: 'business';
  summary: string;
  impact_level: ImpactLevel;
  risks: Risk[];
  recommendations: string[];
  constraints_evaluated: ConstraintEvaluation[];
  commercial_impact_narrative: string;
  strategic_alignment: 'aligned' | 'neutral' | 'misaligned';
  stakeholder_impacts: string[];
}

export interface LegalAssessment {
  kernel: 'law';
  summary: string;
  impact_level: ImpactLevel;
  risks: Risk[];
  recommendations: string[];
  constraints_evaluated: ConstraintEvaluation[];
  regulatory_implications: string[];
  compliance_status: 'compliant' | 'at_risk' | 'non_compliant';
  jurisdictional_considerations: string[];
  precedent_references: string[];
}

export interface AccountingAssessment {
  kernel: 'accounting';
  summary: string;
  impact_level: ImpactLevel;
  risks: Risk[];
  recommendations: string[];
  constraints_evaluated: ConstraintEvaluation[];
  financial_impact_amount: number;
  financial_impact_currency: string;
  tax_implications: string[];
  reporting_period_impact: string[];
  classification_guidance: string;
}

export interface CommercialDecisionBundle {
  id: string;
  matter_id: string;
  business_assessment: BusinessAssessment | null;
  legal_assessment: LegalAssessment | null;
  accounting_assessment: AccountingAssessment | null;
  combined_recommendation: string;
  open_risks: Risk[];
  unresolved_constraints: UnresolvedConstraint[];
  follow_up_actions: FollowUpAction[];
  source_kernel_receipts: KernelReceipt[];
  advisory_support_receipts: AdvisoryReceipt[];
  generated_at: string;
  generated_by_surface: string;
  status: DecisionBundleStatus;
  version: number;
  supersedes_bundle_id?: string;
  practitioner_notes?: string;
  approved_by?: string;
  approved_at?: string;
}
