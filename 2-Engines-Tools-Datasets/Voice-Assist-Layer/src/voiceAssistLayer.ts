/**
 * Voice Assist Layer — Main Entry Point
 * Non-sovereign layer for voice-based intake.
 * Reference: Hive215/premier_voice_assistant
 *
 * All output is advisory. Nothing produced here modifies domain truth directly.
 */

import { VoiceSession, MeetingIntakePacket, SpokenCommandCandidate } from './types';
import { VoiceSessionManager } from './voiceSessionManager';
import { SpokenCommandHandler } from './spokenCommandHandler';
import { IronEarListener } from './ironEarListener';

export class VoiceAssistLayer {
  readonly layerId = 'voice-assist' as const;
  readonly trustLevel = 'NON_SOVEREIGN' as const;
  readonly advisoryOnly = true as const;

  private readonly sessionManager = new VoiceSessionManager();
  private readonly commandHandler = new SpokenCommandHandler();
  private readonly ironEar = new IronEarListener();

  /**
   * Start a new voice session in the specified mode.
   */
  startSession(userId: string, mode: VoiceSession['mode']): VoiceSession {
    return this.sessionManager.start(userId, mode);
  }

  /**
   * Process a spoken command — returns candidates, never executes directly.
   */
  processSpokenCommand(sessionId: string, rawText: string): SpokenCommandCandidate {
    return this.commandHandler.parse(sessionId, rawText);
  }

  /**
   * Start Iron Ear listening mode for a session.
   */
  startListening(sessionId: string): void {
    this.ironEar.startListening(sessionId);
  }

  /**
   * Stop listening and collect advisory output.
   */
  stopListening(sessionId: string): MeetingIntakePacket | null {
    return this.ironEar.stopListening(sessionId);
  }

  /**
   * Pause an active session.
   */
  pauseSession(sessionId: string): VoiceSession | null {
    return this.sessionManager.pause(sessionId);
  }

  /**
   * Resume a paused session.
   */
  resumeSession(sessionId: string): VoiceSession | null {
    return this.sessionManager.resume(sessionId);
  }

  /**
   * Stop a session and finalize output.
   */
  stopSession(sessionId: string): VoiceSession | null {
    return this.sessionManager.stop(sessionId);
  }
}
