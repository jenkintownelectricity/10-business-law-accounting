/**
 * Voice Session Manager
 * Manages the lifecycle of voice sessions: start, pause, resume, stop.
 */

import { VoiceSession } from './types';

export class VoiceSessionManager {
  private sessions: Map<string, VoiceSession> = new Map();

  start(userId: string, mode: VoiceSession['mode']): VoiceSession {
    const session: VoiceSession = {
      session_id: `vs-${userId}-${Date.now()}`,
      user_id: userId,
      status: 'active',
      mode,
      started_at: new Date().toISOString(),
      transcript_segments: [],
    };
    this.sessions.set(session.session_id, session);
    return session;
  }

  pause(sessionId: string): VoiceSession | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') return null;

    const updated: VoiceSession = {
      ...session,
      status: 'paused',
      paused_at: new Date().toISOString(),
    };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  resume(sessionId: string): VoiceSession | null {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'paused') return null;

    const updated: VoiceSession = {
      ...session,
      status: 'active',
      paused_at: undefined,
    };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  stop(sessionId: string): VoiceSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const updated: VoiceSession = {
      ...session,
      status: 'stopped',
      stopped_at: new Date().toISOString(),
    };
    this.sessions.set(sessionId, updated);
    return updated;
  }

  getSession(sessionId: string): VoiceSession | null {
    return this.sessions.get(sessionId) ?? null;
  }
}
