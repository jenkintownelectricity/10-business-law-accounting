/**
 * Iron Ear Listener
 * Passive listening mode that detects obligation candidates, action items,
 * and key phrases during meetings or dictation.
 *
 * Advisory output only — never modifies domain truth.
 */

import {
  ListeningSession,
  MeetingIntakePacket,
  TranscriptEnvelope,
  SpokenNoteEnvelope,
} from './types';

const OBLIGATION_KEYWORDS = [
  'must', 'shall', 'required to', 'obligated', 'agrees to',
  'will deliver', 'deadline', 'due by', 'no later than',
  'committed to', 'responsible for',
];

const ACTION_ITEM_KEYWORDS = [
  'action item', 'follow up', 'to do', 'next step',
  'need to', 'should', 'take care of', 'assigned to',
  'please handle', 'make sure',
];

export class IronEarListener {
  private sessions: Map<string, ListeningSession> = new Map();

  /**
   * Start listening on a session in Iron Ear mode.
   */
  startListening(sessionId: string): ListeningSession {
    const session: ListeningSession = {
      session_id: `iron-ear-${sessionId}-${Date.now()}`,
      parent_session_id: sessionId,
      mode: 'iron_ear',
      status: 'listening',
      keywords_detected: [],
      obligation_candidates: [],
      action_item_candidates: [],
      started_at: new Date().toISOString(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Process a transcript segment through Iron Ear analysis.
   */
  processSegment(sessionId: string, text: string): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'listening') return;

    const lower = text.toLowerCase();

    for (const kw of OBLIGATION_KEYWORDS) {
      if (lower.includes(kw)) {
        session.keywords_detected.push(kw);
        session.obligation_candidates.push(text);
        break;
      }
    }

    for (const kw of ACTION_ITEM_KEYWORDS) {
      if (lower.includes(kw)) {
        if (!session.keywords_detected.includes(kw)) {
          session.keywords_detected.push(kw);
        }
        session.action_item_candidates.push(text);
        break;
      }
    }
  }

  /**
   * Stop listening and produce a MeetingIntakePacket (advisory only).
   */
  stopListening(sessionId: string): MeetingIntakePacket | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.status = 'stopped';
    session.stopped_at = new Date().toISOString();

    const transcript: TranscriptEnvelope = {
      envelope_id: `transcript-${session.session_id}`,
      session_id: session.session_id,
      segments: [],
      total_duration_ms: 0,
      speaker_count: 0,
      language: 'en',
      generated_at: new Date().toISOString(),
    };

    const packet: MeetingIntakePacket = {
      packet_id: `meeting-${session.session_id}`,
      session_id: session.session_id,
      title: `Iron Ear Session ${session.session_id}`,
      attendees: [],
      transcript,
      obligation_candidates: session.obligation_candidates,
      action_item_candidates: session.action_item_candidates,
      spoken_notes: [],
      advisory_only: true,
      captured_at: new Date().toISOString(),
    };

    this.sessions.delete(sessionId);
    return packet;
  }
}
