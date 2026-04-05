// ──────────────────────────────────────────────────────────────
//  Domain Object: TranscriptEnvelope
//  Wraps a voice-to-text transcript with speaker attribution,
//  confidence scores, and kernel routing metadata.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain, TrustLevel } from './matter.js';

export type TranscriptSourceType = 'dictation' | 'meeting' | 'phone_call' | 'deposition' | 'hearing' | 'interview' | 'other';
export type TranscriptReviewStatus = 'pending_review' | 'under_review' | 'approved' | 'rejected' | 'partially_approved';

export interface TranscriptSegment {
  id: string;
  start_time: number;
  end_time: number;
  text: string;
  speaker_id?: string;
  speaker_label?: string;
  confidence: number;
  language: string;
  flagged_terms: FlaggedTerm[];
}

export interface FlaggedTerm {
  term: string;
  offset_start: number;
  offset_end: number;
  flag_reason: 'legal_significance' | 'financial_amount' | 'date_reference' | 'obligation_language' | 'ambiguous' | 'domain_term';
  suggested_kernel: KernelDomain;
}

export interface SpeakerAttribution {
  speaker_id: string;
  label: string;
  entity_id?: string;
  role?: string;
  total_speaking_time: number;
  segment_count: number;
}

export interface TranscriptEnvelope {
  id: string;
  session_id: string;
  transcript_text: string;
  segments: TranscriptSegment[];
  speaker_attributions: SpeakerAttribution[];
  overall_confidence: number;
  source_type: TranscriptSourceType;
  language: string;
  duration_seconds: number;
  review_status: TranscriptReviewStatus;
  routed_to_kernel: KernelDomain | null;
  matter_id?: string;
  trust_level: TrustLevel;
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
}
