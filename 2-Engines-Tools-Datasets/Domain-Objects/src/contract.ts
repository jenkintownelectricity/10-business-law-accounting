// ──────────────────────────────────────────────────────────────
//  Domain Object: Contract
//  Full contract model including parties, terms, obligations,
//  financial value, risk assessment, and evidence references.
// ──────────────────────────────────────────────────────────────

import type { Priority, TrustLevel } from './matter.js';

export type ContractStatus =
  | 'draft'
  | 'under_negotiation'
  | 'pending_review'
  | 'active'
  | 'suspended'
  | 'expired'
  | 'terminated'
  | 'renewed'
  | 'archived';

export type ContractType =
  | 'service_agreement'
  | 'purchase_order'
  | 'employment'
  | 'lease'
  | 'license'
  | 'nda'
  | 'partnership'
  | 'settlement'
  | 'loan'
  | 'consulting'
  | 'other';

export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low' | 'negligible';

export interface ContractParty {
  entity_id: string;
  role: 'principal' | 'counterparty' | 'guarantor' | 'witness' | 'beneficiary';
  name: string;
  signatory_name?: string;
  signed_at?: string;
}

export interface ContractTerm {
  id: string;
  clause_reference: string;
  summary: string;
  term_type: 'payment' | 'performance' | 'confidentiality' | 'indemnity' | 'limitation' | 'termination' | 'renewal' | 'governing_law' | 'dispute_resolution' | 'other';
  key_dates?: string[];
  financial_value?: number;
  currency?: string;
  obligations_generated: string[];
}

export interface ContractRiskAssessment {
  id: string;
  risk_category: string;
  severity: RiskSeverity;
  description: string;
  mitigation_recommendation: string;
  assessed_by: string;
  assessed_at: string;
}

export interface ContractFinancialSummary {
  total_value: number;
  currency: string;
  payment_schedule: PaymentScheduleEntry[];
  annual_value?: number;
  contingent_amounts: ContingentAmount[];
}

export interface PaymentScheduleEntry {
  due_date: string;
  amount: number;
  description: string;
  status: 'scheduled' | 'invoiced' | 'paid' | 'overdue' | 'waived';
}

export interface ContingentAmount {
  description: string;
  estimated_amount: number;
  trigger_condition: string;
  probability: 'likely' | 'possible' | 'unlikely';
}

export interface Contract {
  id: string;
  title: string;
  contract_type: ContractType;
  status: ContractStatus;
  parties: ContractParty[];
  effective_date: string;
  expiration_date?: string;
  renewal_date?: string;
  auto_renew: boolean;
  governing_law: string;
  terms: ContractTerm[];
  financial_summary: ContractFinancialSummary;
  risk_assessments: ContractRiskAssessment[];
  obligation_ids: string[];
  matter_ids: string[];
  evidence_ids: string[];
  document_hash?: string;
  source_document_path?: string;
  tags: string[];
  trust_level: TrustLevel;
  priority: Priority;
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
}
