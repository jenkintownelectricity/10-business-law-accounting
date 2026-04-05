// ──────────────────────────────────────────────────────────────
//  Domain Object: Matter
//  The central case-management record that ties together
//  contracts, obligations, accounting events, evidence,
//  decisions, and follow-up actions across all three kernels.
// ──────────────────────────────────────────────────────────────

export type MatterType = 'business' | 'legal' | 'accounting' | 'cross-domain';
export type KernelDomain = 'business' | 'law' | 'accounting';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type MatterStatus =
  | 'draft'
  | 'intake'
  | 'under_review'
  | 'active'
  | 'on_hold'
  | 'resolved'
  | 'closed'
  | 'archived';

export type FollowUpStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface FollowUpAction {
  id: string;
  title: string;
  description: string;
  assigned_kernel: KernelDomain;
  due_date?: string;
  status: FollowUpStatus;
  priority: Priority;
}

export type NoteType = 'manual' | 'dictated' | 'system' | 'advisory';
export type TrustLevel = 'TRUSTED' | 'UNTRUSTED';

export interface MatterNote {
  id: string;
  content: string;
  note_type: NoteType;
  source: string;
  created_at: string;
  trust_level: TrustLevel;
}

export interface Matter {
  id: string;
  title: string;
  description: string;
  matter_type: MatterType;
  assigned_kernels: KernelDomain[];
  client_id: string;
  counterparty_ids: string[];
  priority: Priority;
  status: MatterStatus;
  related_contracts: string[];
  related_obligations: string[];
  related_accounting_events: string[];
  evidence_ids: string[];
  receipt_ids: string[];
  decision_bundle_id?: string;
  follow_up_actions: FollowUpAction[];
  tags: string[];
  notes: MatterNote[];
  created_at: string;
  updated_at: string;
  created_by: string;
  source_surface: string;
}
