// ──────────────────────────────────────────────────────────────
//  Domain Object: SpokenCommandCandidate
//  Represents a voice command parsed from speech input.
//  Always requires practitioner review before execution.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain } from './matter.js';

export type CommandReviewStatus = 'pending_review' | 'approved' | 'rejected' | 'modified_and_approved';

export interface ParsedIntent {
  action: string;
  domain: KernelDomain | 'cross-domain';
  target_object_type?: string;
  target_object_id?: string;
  parameters: Record<string, string | number | boolean>;
  inferred_context: string[];
}

export interface TargetAction {
  action_type: 'create_matter' | 'update_matter' | 'add_note' | 'create_obligation' | 'set_deadline' | 'assign_kernel' | 'create_follow_up' | 'search' | 'query' | 'other';
  description: string;
  affected_object_ids: string[];
  reversible: boolean;
  requires_elevated_review: boolean;
}

export interface SpokenCommandCandidate {
  id: string;
  session_id: string;
  raw_text: string;
  parsed_intent: ParsedIntent;
  confidence: number;
  target_action: TargetAction;
  requires_review: true;
  review_status: CommandReviewStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  modification_notes?: string;
  execution_receipt_id?: string;
  created_at: string;
  created_by: string;
}
