// ──────────────────────────────────────────────────────────────
//  Domain Object: VoiceSessionState
//  Tracks the real-time state of an active voice session
//  including mode, transcript buffer, and pending candidates.
// ──────────────────────────────────────────────────────────────

export type VoiceSessionStatus = 'idle' | 'listening' | 'processing' | 'paused';
export type VoiceSessionMode = 'dictation' | 'command' | 'listening';

export interface TranscriptBufferEntry {
  segment_index: number;
  text: string;
  confidence: number;
  is_final: boolean;
  timestamp: number;
}

export interface PendingCandidate {
  candidate_id: string;
  candidate_type: 'command' | 'note' | 'obligation' | 'deadline' | 'action_item';
  summary: string;
  confidence: number;
  created_at: string;
}

export interface VoiceSessionState {
  id: string;
  session_id: string;
  status: VoiceSessionStatus;
  mode: VoiceSessionMode;
  active_since: string | null;
  paused_at: string | null;
  total_active_duration_ms: number;
  transcript_buffer: TranscriptBufferEntry[];
  pending_candidates: PendingCandidate[];
  current_speaker_id?: string;
  matter_id?: string;
  error_state: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}
