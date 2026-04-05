// ──────────────────────────────────────────────────────────────
//  Domain Object: RoutedKernelCandidate
//  A candidate routed to a specific kernel for processing.
//  Always requires practitioner review before becoming sovereign.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain, TrustLevel } from './matter.js';

export type RoutedCandidateSource = 'voice_dictation' | 'voice_command' | 'listening_session' | 'language_normalization' | 'advisory_intake' | 'manual';

export type CandidateReviewStatus =
  | 'pending_review'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'modified_and_approved'
  | 'escalated';

export interface RoutedContent {
  content_type: 'matter_note' | 'obligation_candidate' | 'deadline_candidate' | 'contract_clause' | 'accounting_entry' | 'entity_update' | 'action_item' | 'other';
  raw_content: string;
  structured_content: Record<string, unknown>;
  extraction_method: string;
}

export interface RoutedKernelCandidate {
  id: string;
  source: RoutedCandidateSource;
  source_id: string;
  target_kernel: KernelDomain;
  confidence: number;
  content: RoutedContent;
  requires_practitioner_review: true;
  review_status: CandidateReviewStatus;
  matter_id?: string;
  trust_level: TrustLevel;
  routing_reasoning: string;
  alternative_kernels: { kernel: KernelDomain; confidence: number }[];
  promoted_object_id?: string;
  promoted_object_type?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  practitioner_notes?: string;
}
