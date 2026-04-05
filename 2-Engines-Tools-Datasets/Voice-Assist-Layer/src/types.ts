/**
 * Voice Assist Layer — Types
 * All types for voice sessions, spoken commands, and transcript handling.
 */

export interface VoiceSession {
  session_id: string;
  user_id: string;
  status: 'active' | 'paused' | 'stopped' | 'error';
  mode: 'command' | 'dictation' | 'meeting' | 'listening';
  started_at: string;
  paused_at?: string;
  stopped_at?: string;
  transcript_segments: TranscriptSegment[];
}

export interface TranscriptSegment {
  segment_id: string;
  speaker?: string;
  text: string;
  confidence: number;
  timestamp: string;
  duration_ms: number;
}

export interface SpokenCommandCandidate {
  candidate_id: string;
  session_id: string;
  raw_text: string;
  interpreted_action: string;
  confidence: number;
  parameters: Record<string, string>;
  requires_confirmation: boolean;
  advisory_only: true;
  parsed_at: string;
}

export interface SpokenNoteEnvelope {
  envelope_id: string;
  session_id: string;
  raw_text: string;
  normalized_text: string;
  detected_entities: string[];
  detected_dates: string[];
  detected_amounts: string[];
  source: 'dictation' | 'meeting' | 'listening';
  captured_at: string;
}

export interface ListeningSession {
  session_id: string;
  parent_session_id?: string;
  mode: 'iron_ear';
  status: 'listening' | 'paused' | 'stopped';
  keywords_detected: string[];
  obligation_candidates: string[];
  action_item_candidates: string[];
  started_at: string;
  stopped_at?: string;
}

export interface TranscriptEnvelope {
  envelope_id: string;
  session_id: string;
  segments: TranscriptSegment[];
  total_duration_ms: number;
  speaker_count: number;
  language: string;
  generated_at: string;
}

export interface MeetingIntakePacket {
  packet_id: string;
  session_id: string;
  title: string;
  attendees: string[];
  transcript: TranscriptEnvelope;
  obligation_candidates: string[];
  action_item_candidates: string[];
  spoken_notes: SpokenNoteEnvelope[];
  advisory_only: true;
  captured_at: string;
}
