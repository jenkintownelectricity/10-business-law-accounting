// ──────────────────────────────────────────────────────────────
//  Domain Object: SpokenNoteEnvelope
//  Captures a dictated note with structured draft for
//  practitioner editing before it becomes a sovereign record.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain, TrustLevel } from './matter.js';

export type SpokenNoteReviewStatus = 'draft' | 'pending_review' | 'under_review' | 'approved' | 'rejected' | 'edited_and_approved';

export interface StructuredDraft {
  title: string;
  summary: string;
  key_points: string[];
  referenced_entities: ReferencedEntity[];
  referenced_dates: ReferencedDate[];
  referenced_amounts: ReferencedAmount[];
  suggested_tags: string[];
  suggested_matter_id?: string;
  suggested_kernel: KernelDomain | null;
}

export interface ReferencedEntity {
  raw_mention: string;
  resolved_entity_id?: string;
  resolved_name?: string;
  confidence: number;
}

export interface ReferencedDate {
  raw_mention: string;
  parsed_date?: string;
  context: string;
  confidence: number;
}

export interface ReferencedAmount {
  raw_mention: string;
  parsed_amount?: number;
  currency?: string;
  context: string;
  confidence: number;
}

export interface SpokenNoteEnvelope {
  id: string;
  session_id: string;
  raw_text: string;
  structured_draft: StructuredDraft;
  routed_kernel: KernelDomain | null;
  review_status: SpokenNoteReviewStatus;
  matter_id?: string;
  editable_title: string;
  editable_content: string;
  editable_tags: string[];
  practitioner_corrections: string[];
  trust_level: TrustLevel;
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
}
