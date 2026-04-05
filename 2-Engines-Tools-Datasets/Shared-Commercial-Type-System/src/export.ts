/**
 * Export Packet Types
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Types for review packets, report packets, and data export.
 */

import { ID, Timestamp, KernelName, KernelSource, RiskLevel, Priority } from './base';
import { KernelAssessment, Risk, Constraint } from './decisionBundle';

/**
 * Matter Review Packet — exported for practitioner review of a matter.
 */
export interface MatterReviewPacket {
  packet_id: ID;
  packet_type: 'matter_review';
  matter_id: ID;
  matter_title: string;
  matter_type: string;
  client_name: string;
  assigned_kernels: KernelName[];
  priority: Priority;
  risk_level: RiskLevel;
  open_obligations_count: number;
  upcoming_deadlines_count: number;
  financial_exposure: number | null;
  recent_activity: {
    activity_type: string;
    description: string;
    kernel: KernelSource;
    timestamp: Timestamp;
  }[];
  pending_actions: string[];
  generated_at: Timestamp;
  generated_by: string;
}

/**
 * Contract Review Packet — exported for practitioner review of a contract.
 */
export interface ContractReviewPacket {
  packet_id: ID;
  packet_type: 'contract_review';
  contract_id: ID;
  contract_title: string;
  contract_type: string;
  parties: { name: string; role: string }[];
  effective_date: Timestamp;
  expiration_date: Timestamp | null;
  execution_status: string;
  obligations_summary: {
    total: number;
    pending: number;
    overdue: number;
    completed: number;
  };
  financial_value: number | null;
  risk_level: RiskLevel;
  key_clauses: string[];
  renewal_info: {
    type: string;
    notice_days: number | null;
    next_renewal_date: Timestamp | null;
  };
  generated_at: Timestamp;
  generated_by: string;
}

/**
 * Commercial Decision Packet — exported summary of a decision bundle.
 */
export interface CommercialDecisionPacket {
  packet_id: ID;
  packet_type: 'commercial_decision';
  bundle_id: ID;
  matter_id: ID;
  matter_title: string;
  combined_recommendation: string;
  combined_risk_level: RiskLevel;
  kernel_summaries: {
    kernel: KernelName;
    risk_level: RiskLevel;
    summary: string;
    key_constraints: string[];
  }[];
  open_risks: Risk[];
  unresolved_constraints: Constraint[];
  follow_up_actions: {
    description: string;
    assigned_to: string | null;
    due_date: Timestamp | null;
    priority: Priority;
  }[];
  advisory_inputs_used: boolean;
  generated_at: Timestamp;
  generated_by: string;
}

/**
 * Receipt Packet — exported receipt chain for audit/review.
 */
export interface ReceiptPacket {
  packet_id: ID;
  packet_type: 'receipt_chain';
  target_id: ID;
  target_type: string;
  receipts: {
    receipt_id: ID;
    receipt_type: string;
    operation: string;
    actor: string;
    timestamp: Timestamp;
    previous_state: string | null;
    new_state: string | null;
    replay_sequence: number;
  }[];
  chain_length: number;
  chain_valid: boolean;
  generated_at: Timestamp;
  generated_by: string;
}

/**
 * Listening Session Review Packet — exported for practitioner review of Iron Ear output.
 */
export interface ListeningSessionReviewPacket {
  packet_id: ID;
  packet_type: 'listening_session_review';
  session_id: ID;
  session_type: string;
  duration_seconds: number;
  participants: { name: string; role: string }[];
  obligation_candidates: {
    description: string;
    confidence: number;
    suggested_kernel: KernelName;
  }[];
  deadline_candidates: {
    description: string;
    due_date: Timestamp | null;
    confidence: number;
    suggested_kernel: KernelName;
  }[];
  action_item_candidates: {
    description: string;
    suggested_assignee: string | null;
    confidence: number;
  }[];
  privilege_flags: {
    attorney_client: boolean;
    work_product: boolean;
  };
  generated_at: Timestamp;
  generated_by: string;
}

/**
 * Transcript Review Packet — exported for practitioner review of a transcript.
 */
export interface TranscriptReviewPacket {
  packet_id: ID;
  packet_type: 'transcript_review';
  transcript_id: ID;
  session_id: ID;
  source_type: string;
  transcript_text: string;
  confidence_score: number;
  speaker_attribution: { speaker: string | null; text: string }[];
  derived_candidates: {
    candidate_type: string;
    description: string;
    confidence: number;
  }[];
  privilege_flags: {
    attorney_client: boolean;
    work_product: boolean;
  };
  language_normalization_applied: boolean;
  generated_at: Timestamp;
  generated_by: string;
}
