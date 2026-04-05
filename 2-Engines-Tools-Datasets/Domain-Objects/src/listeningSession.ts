// ──────────────────────────────────────────────────────────────
//  Domain Object: ListeningSession
//  Represents an Iron Ear listening session capturing meetings,
//  calls, or discussions with obligation/deadline extraction.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain, TrustLevel } from './matter.js';

export type ListeningSessionStatus = 'active' | 'paused' | 'completed' | 'abandoned' | 'processing' | 'reviewed';

export interface ObligationCandidate {
  id: string;
  extracted_text: string;
  speaker_id?: string;
  timestamp: number;
  suggested_obligor?: string;
  suggested_obligee?: string;
  suggested_due_date?: string;
  suggested_type: string;
  confidence: number;
  requires_review: true;
  review_status: 'pending' | 'confirmed' | 'rejected' | 'modified';
  reviewed_by?: string;
  promoted_obligation_id?: string;
}

export interface DeadlineCandidate {
  id: string;
  extracted_text: string;
  speaker_id?: string;
  timestamp: number;
  suggested_date: string;
  suggested_description: string;
  suggested_criticality: 'absolute' | 'statutory' | 'contractual' | 'operational' | 'advisory';
  confidence: number;
  requires_review: true;
  review_status: 'pending' | 'confirmed' | 'rejected' | 'modified';
  reviewed_by?: string;
  promoted_deadline_id?: string;
}

export interface ListeningRoutingHint {
  kernel: KernelDomain;
  reason: string;
  confidence: number;
  relevant_segments: string[];
}

export interface AdvisoryPacketReference {
  packet_id: string;
  packet_type: 'obligation' | 'deadline' | 'action_item' | 'risk_flag' | 'terminology';
  summary: string;
}

export interface ListeningSession {
  id: string;
  session_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  status: ListeningSessionStatus;
  transcript_envelope_ids: string[];
  obligation_candidates: ObligationCandidate[];
  deadline_candidates: DeadlineCandidate[];
  routing_hints: ListeningRoutingHint[];
  advisory_packets: AdvisoryPacketReference[];
  participant_count?: number;
  matter_id?: string;
  trust_level: TrustLevel;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
}
