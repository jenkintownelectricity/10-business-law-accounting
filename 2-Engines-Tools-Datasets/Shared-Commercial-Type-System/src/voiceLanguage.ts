/**
 * Voice & Language Types
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Types for voice assist and language intelligence layer interactions.
 */

import { ID, Timestamp, KernelName, TrustLevel, DomainObject } from './base';

/**
 * Transcript Envelope — raw transcript from voice input.
 * Trust level: UNTRUSTED
 */
export interface TranscriptEnvelope extends DomainObject {
  session_id: ID;
  transcript_text: string;
  speaker_attribution: {
    speaker_id: ID | null;
    speaker_name: string | null;
    segments: { start_offset: number; end_offset: number; text: string }[];
  }[];
  confidence_score: number;
  source_type: 'dictation' | 'meeting' | 'command' | 'conversation' | 'court_proceeding';
  source_device_id: string;
  source_session_id: ID;
  duration_seconds: number;
  language: string;
  timestamp: Timestamp;
  trust_level: 'untrusted';
  review_status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'partial';
}

/**
 * Spoken Command Candidate — a command parsed from speech.
 * Trust level: UNTRUSTED — must be reviewed before execution.
 */
export interface SpokenCommandCandidate extends DomainObject {
  session_id: ID;
  transcript_envelope_id: ID;
  command_text: string;
  parsed_intent: string;
  parsed_parameters: Record<string, unknown>;
  confidence_score: number;
  target_kernel: KernelName | null;
  trust_level: 'untrusted';
  review_status: 'pending' | 'approved' | 'rejected' | 'modified';
  reviewed_by: string | null;
  review_date: Timestamp | null;
  execution_status: 'not_executed' | 'executed' | 'failed';
}

/**
 * Spoken Note Envelope — a dictated note for kernel routing.
 * Trust level: UNTRUSTED
 */
export interface SpokenNoteEnvelope extends DomainObject {
  session_id: ID;
  transcript_envelope_id: ID;
  speaker_id: string;
  note_text: string;
  normalized_text: string | null;
  content_classification: {
    primary_kernel: KernelName | null;
    secondary_kernels: KernelName[];
    confidence: number;
  };
  trust_level: 'untrusted';
  review_status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'split';
  promoted_to_record_id: ID | null;
}

/**
 * Listening Session — metadata for an Iron Ear listening session.
 */
export interface ListeningSession extends DomainObject {
  session_type: 'client_meeting' | 'internal_review' | 'opposing_counsel' | 'vendor_call' | 'court_proceeding' | 'general';
  start_time: Timestamp;
  end_time: Timestamp | null;
  duration_seconds: number | null;
  participants: { name: string; role: string }[];
  transcript_envelope_ids: ID[];
  advisory_packet_id: ID | null;
  trust_level: 'untrusted';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
}

/**
 * Language Normalization Packet — output from language intelligence.
 * Trust level: ADVISORY
 */
export interface LanguageNormalizationPacket extends DomainObject {
  input_text: string;
  input_source_id: ID | null;
  terminology_alignments: {
    original: string;
    suggested: string;
    kernel: KernelName;
    confidence: number;
  }[];
  disambiguations: {
    phrase: string;
    interpretations: { text: string; kernel: KernelName; confidence: number }[];
  }[];
  routing_hints: { kernel: KernelName; relevance: number; reason: string }[];
  overall_confidence: number;
  trust_level: 'advisory';
  feedback_status: 'pending' | 'correct' | 'incorrect' | 'ambiguous' | null;
}

/**
 * Advisory Intake Packet — output from Iron Ear listening sessions.
 * Trust level: UNTRUSTED
 */
export interface AdvisoryIntakePacket extends DomainObject {
  session_id: ID;
  session_type: string;
  transcript_envelope_id: ID;
  obligation_candidates: {
    candidate_id: ID;
    description: string;
    confidence: number;
    source_segment: string;
  }[];
  deadline_candidates: {
    candidate_id: ID;
    description: string;
    due_date: Timestamp | null;
    confidence: number;
    source_segment: string;
  }[];
  action_item_candidates: {
    candidate_id: ID;
    description: string;
    suggested_assignee: string | null;
    confidence: number;
  }[];
  routing_hints: { kernel: KernelName; relevance: number }[];
  trust_level: 'untrusted';
  review_status: 'pending' | 'in_review' | 'partially_accepted' | 'fully_reviewed' | 'rejected';
  accepted_candidates: ID[];
  rejected_candidates: ID[];
}

/**
 * Routed Kernel Candidate — a candidate object routed to a kernel for review.
 */
export interface RoutedKernelCandidate {
  candidate_id: ID;
  candidate_type: 'obligation' | 'deadline' | 'action_item' | 'entity_reference' | 'normalization' | 'spoken_note' | 'spoken_command';
  target_kernel: KernelName;
  source_packet_id: ID;
  content: Record<string, unknown>;
  confidence: number;
  trust_level: TrustLevel;
  review_status: 'queued' | 'in_review' | 'accepted' | 'rejected' | 'deferred';
  queued_at: Timestamp;
}

/**
 * Voice Session State — current state of a voice session.
 */
export interface VoiceSessionState {
  session_id: ID;
  session_type: 'dictation' | 'command' | 'meeting' | 'conversation';
  state: 'initializing' | 'active' | 'paused' | 'resuming' | 'stopping' | 'stopped' | 'error';
  started_at: Timestamp;
  paused_at: Timestamp | null;
  total_duration_seconds: number;
  transcript_count: number;
  candidate_count: number;
  source_device_id: string;
}
