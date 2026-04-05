/**
 * Commercial Decision Bundle
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Full typing for decision bundles assembled by the Commercial Orchestrator
 * from individual kernel assessments.
 */

import { ID, Timestamp, KernelName, KernelSource, RiskLevel, Priority, DomainObject } from './base';

export interface KernelAssessment {
  kernel: KernelName;
  risk_level: RiskLevel;
  summary: string;
  recommendation: string;
  constraints: {
    constraint_name: string;
    output: 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';
    description: string;
  }[];
  confidence: number;
  receipt_id: ID;
  assessed_at: Timestamp;
}

export interface Risk {
  risk_id: ID;
  description: string;
  severity: RiskLevel;
  source_kernel: KernelName;
  mitigation_suggestion: string | null;
}

export interface Constraint {
  constraint_id: ID;
  constraint_name: string;
  description: string;
  source_kernel: KernelName;
  output: 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';
  resolution_action: string;
}

export interface Action {
  action_id: ID;
  description: string;
  assigned_kernel: KernelName | 'orchestrator';
  assigned_practitioner: string | null;
  due_date: Timestamp | null;
  priority: Priority;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export interface CommercialDecisionBundle extends DomainObject {
  matter_id: ID;
  bundle_type: 'full_assessment' | 'partial_assessment' | 'expedited_review' | 'follow_up' | 'advisory_review';
  title: string;
  description: string;
  business_assessment: KernelAssessment | null;
  legal_assessment: KernelAssessment | null;
  accounting_assessment: KernelAssessment | null;
  combined_recommendation: string;
  combined_risk_level: RiskLevel;
  open_risks: Risk[];
  unresolved_constraints: Constraint[];
  follow_up_actions: Action[];
  source_kernel_receipts: ID[];
  advisory_support_receipts: ID[];
  requesting_practitioner: string;
  reviewed_by: string | null;
  review_date: Timestamp | null;
  generated_at: Timestamp;
  generated_by_surface: string;
  notes: string;
  tags: string[];
  status: 'draft' | 'pending_review' | 'reviewed' | 'accepted' | 'rejected' | 'superseded' | 'archived';
}
