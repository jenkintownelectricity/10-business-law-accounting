// ──────────────────────────────────────────────────────────────
//  Domain Object: Obligation
//  Tracks legal, financial, and operational obligations arising
//  from contracts, matters, or regulatory requirements.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain, Priority, TrustLevel } from './matter.js';

export type ObligationType =
  | 'payment'
  | 'delivery'
  | 'performance'
  | 'reporting'
  | 'compliance'
  | 'confidentiality'
  | 'indemnification'
  | 'notification'
  | 'regulatory_filing'
  | 'other';

export type ComplianceStatus =
  | 'compliant'
  | 'at_risk'
  | 'non_compliant'
  | 'waived'
  | 'disputed'
  | 'pending_review';

export type ObligationStatus =
  | 'identified'
  | 'confirmed'
  | 'active'
  | 'fulfilled'
  | 'breached'
  | 'waived'
  | 'expired'
  | 'disputed';

export interface FinancialImpact {
  amount: number;
  currency: string;
  impact_type: 'cost' | 'revenue' | 'penalty' | 'contingent_liability' | 'tax_obligation';
  recurring: boolean;
  recurrence_period?: 'monthly' | 'quarterly' | 'annually';
  notes?: string;
}

export interface ObligationEvidence {
  evidence_id: string;
  relationship: 'source' | 'supporting' | 'fulfillment_proof' | 'breach_proof';
  added_at: string;
  added_by: string;
}

export interface Obligation {
  id: string;
  title: string;
  description: string;
  obligation_type: ObligationType;
  source_contract_id?: string;
  source_matter_id?: string;
  source_regulation?: string;
  obligor_entity_id: string;
  obligee_entity_id: string;
  assigned_kernel: KernelDomain;
  due_date?: string;
  recurring: boolean;
  recurrence_schedule?: string;
  financial_impact: FinancialImpact | null;
  compliance_status: ComplianceStatus;
  obligation_status: ObligationStatus;
  evidence: ObligationEvidence[];
  deadline_ids: string[];
  priority: Priority;
  trust_level: TrustLevel;
  escalation_path?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
}
