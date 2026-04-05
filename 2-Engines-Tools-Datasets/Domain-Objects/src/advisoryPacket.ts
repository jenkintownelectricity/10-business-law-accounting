// ──────────────────────────────────────────────────────────────
//  Domain Object: AdvisoryIntakePacket
//  Intake packets from voice, language, or listening sources.
//  Always UNTRUSTED until practitioner review.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain } from './matter.js';

export type AdvisorySourceType = 'voice' | 'language' | 'listening';

export type AdvisoryReviewStatus =
  | 'pending_review'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'partially_approved'
  | 'deferred';

export interface CandidateAction {
  id: string;
  action_type: 'create_matter' | 'create_obligation' | 'create_deadline' | 'add_note' | 'update_entity' | 'flag_risk' | 'create_follow_up' | 'other';
  description: string;
  target_kernel: KernelDomain;
  target_object_id?: string;
  parameters: Record<string, unknown>;
  confidence: number;
  requires_practitioner_review: true;
}

export interface AdvisoryIntakePacket {
  id: string;
  source_type: AdvisorySourceType;
  source_session_id: string;
  content: string;
  content_summary: string;
  routing_suggestion: KernelDomain | null;
  routing_confidence: number;
  review_required: true;
  review_status: AdvisoryReviewStatus;
  candidate_actions: CandidateAction[];
  trust_level: 'UNTRUSTED';
  matter_id?: string;
  related_entity_ids: string[];
  flags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  practitioner_notes?: string;
}
