/**
 * Voice-Language Boundary Bridge
 * Domain: Business Law Accounting
 *
 * Specialized bridge for routing voice/language ingress through
 * trust-boundary handling. Enforces the following invariants:
 *
 * 1. All voice input routes through trust boundary evaluation as UNTRUSTED
 * 2. Speech-to-text outputs route through trust boundary as UNTRUSTED
 * 3. Language normalization outputs route through trust boundary as UNTRUSTED
 * 4. No direct path from voice/language to domain truth without trust-boundary clearance
 * 5. Produces audit trail of all voice/language boundary crossings
 */

import type {
  PlatformClient,
  PlatformResponse,
  TrustBoundaryResult
} from './platformClient';

import type { TrustBoundaryBridge, DomainTrustBoundaryRequest } from './trustBoundaryBridge';

// --- Voice/Language Input Types ---

export type VoiceLanguageInputType =
  | 'raw-voice-input'
  | 'speech-to-text-output'
  | 'language-normalization-output'
  | 'spoken-command'
  | 'dictation-intake'
  | 'listening-session-recording';

export interface VoiceLanguageIngressRequest {
  input_id: string;
  input_type: VoiceLanguageInputType;
  session_id: string;
  speaker_id?: string;
  content_hash?: string;
  confidence_score?: number;
  source_device?: string;
  metadata?: Record<string, unknown>;
}

// --- Boundary Crossing Result ---

export interface VoiceLanguageBoundaryCrossing {
  crossing_id: string;
  input_request: VoiceLanguageIngressRequest;
  trust_boundary_result: TrustBoundaryResult | null;
  cleared: boolean;
  denial_reason?: string;
  audit_timestamp: string;
}

// --- Voice-Language Boundary Bridge Configuration ---

export interface VoiceLanguageBridgeConfig {
  domain_id: string;
  require_speaker_attribution: boolean;
  minimum_confidence_for_clearance: number;
  audit_all_crossings: boolean;
}

// --- Bridge Implementation ---

export class VoiceLanguageBoundaryBridge {
  private trustBridge: TrustBoundaryBridge;
  private config: VoiceLanguageBridgeConfig;
  private crossingAuditLog: VoiceLanguageBoundaryCrossing[] = [];

  constructor(trustBridge: TrustBoundaryBridge, config: VoiceLanguageBridgeConfig) {
    this.trustBridge = trustBridge;
    this.config = config;
  }

  /**
   * Route raw voice input through trust boundary evaluation.
   * Voice input is ALWAYS treated as UNTRUSTED.
   */
  async evaluateVoiceInput(request: VoiceLanguageIngressRequest): Promise<VoiceLanguageBoundaryCrossing> {
    return this.evaluateIngress(request, 'raw-voice-input');
  }

  /**
   * Route speech-to-text output through trust boundary evaluation.
   * STT outputs are ALWAYS treated as UNTRUSTED — they are machine-derived.
   */
  async evaluateSpeechToTextOutput(request: VoiceLanguageIngressRequest): Promise<VoiceLanguageBoundaryCrossing> {
    return this.evaluateIngress(request, 'speech-to-text-output');
  }

  /**
   * Route language normalization output through trust boundary evaluation.
   * Normalization outputs are ALWAYS treated as UNTRUSTED — they are language-derived.
   */
  async evaluateLanguageNormalizationOutput(request: VoiceLanguageIngressRequest): Promise<VoiceLanguageBoundaryCrossing> {
    return this.evaluateIngress(request, 'language-normalization-output');
  }

  /**
   * Route a spoken command through trust boundary evaluation.
   * Spoken commands are ALWAYS treated as UNTRUSTED and cannot
   * directly mutate domain truth.
   */
  async evaluateSpokenCommand(request: VoiceLanguageIngressRequest): Promise<VoiceLanguageBoundaryCrossing> {
    return this.evaluateIngress(request, 'spoken-command');
  }

  /**
   * Route dictation intake through trust boundary evaluation.
   */
  async evaluateDictationIntake(request: VoiceLanguageIngressRequest): Promise<VoiceLanguageBoundaryCrossing> {
    return this.evaluateIngress(request, 'dictation-intake');
  }

  /**
   * Route listening session recording through trust boundary evaluation.
   */
  async evaluateListeningSession(request: VoiceLanguageIngressRequest): Promise<VoiceLanguageBoundaryCrossing> {
    return this.evaluateIngress(request, 'listening-session-recording');
  }

  /**
   * Get the full audit trail of all voice/language boundary crossings.
   */
  getAuditTrail(): readonly VoiceLanguageBoundaryCrossing[] {
    return [...this.crossingAuditLog];
  }

  /**
   * Get audit entries for a specific session.
   */
  getAuditForSession(sessionId: string): VoiceLanguageBoundaryCrossing[] {
    return this.crossingAuditLog.filter(c => c.input_request.session_id === sessionId);
  }

  /**
   * Get audit entries for a specific speaker.
   */
  getAuditForSpeaker(speakerId: string): VoiceLanguageBoundaryCrossing[] {
    return this.crossingAuditLog.filter(c => c.input_request.speaker_id === speakerId);
  }

  /**
   * Get all denied crossings.
   */
  getDeniedCrossings(): VoiceLanguageBoundaryCrossing[] {
    return this.crossingAuditLog.filter(c => !c.cleared);
  }

  /**
   * Get crossing statistics.
   */
  getCrossingStats(): {
    total: number;
    cleared: number;
    denied: number;
    by_input_type: Record<string, { cleared: number; denied: number }>;
  } {
    const stats: Record<string, { cleared: number; denied: number }> = {};

    for (const crossing of this.crossingAuditLog) {
      const type = crossing.input_request.input_type;
      if (!stats[type]) {
        stats[type] = { cleared: 0, denied: 0 };
      }
      if (crossing.cleared) {
        stats[type].cleared++;
      } else {
        stats[type].denied++;
      }
    }

    return {
      total: this.crossingAuditLog.length,
      cleared: this.crossingAuditLog.filter(c => c.cleared).length,
      denied: this.crossingAuditLog.filter(c => !c.cleared).length,
      by_input_type: stats
    };
  }

  // --- Private Implementation ---

  /**
   * Core ingress evaluation. All voice/language inputs route through here.
   * All inputs are UNTRUSTED — no exceptions.
   */
  private async evaluateIngress(
    request: VoiceLanguageIngressRequest,
    inputType: VoiceLanguageInputType
  ): Promise<VoiceLanguageBoundaryCrossing> {
    const crossingId = `vlc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Pre-flight checks before trust boundary evaluation
    const preflightDenial = this.preflightCheck(request);
    if (preflightDenial) {
      const crossing: VoiceLanguageBoundaryCrossing = {
        crossing_id: crossingId,
        input_request: { ...request, input_type: inputType },
        trust_boundary_result: null,
        cleared: false,
        denial_reason: preflightDenial,
        audit_timestamp: new Date().toISOString()
      };

      if (this.config.audit_all_crossings) {
        this.crossingAuditLog.push(crossing);
      }

      return crossing;
    }

    // Build domain trust boundary request — ALWAYS UNTRUSTED
    const domainRequest: DomainTrustBoundaryRequest = {
      source_kernel: 'voice-language',
      entity_type: inputType,
      entity_id: request.input_id,
      direction: 'ingress',
      payload_type: `voice-language/${inputType}`,
      trust_level: 'UNTRUSTED', // Always UNTRUSTED — no exceptions
      context: {
        session_id: request.session_id,
        speaker_id: request.speaker_id,
        content_hash: request.content_hash,
        confidence_score: request.confidence_score,
        source_device: request.source_device,
        ...request.metadata
      }
    };

    // Route through trust boundary bridge
    const response: PlatformResponse<TrustBoundaryResult> = await this.trustBridge.evaluateIngress(domainRequest);

    const cleared = response.success &&
      response.data !== undefined &&
      (response.data.evaluation === 'APPROVED' || response.data.evaluation === 'PENDING');

    const crossing: VoiceLanguageBoundaryCrossing = {
      crossing_id: crossingId,
      input_request: { ...request, input_type: inputType },
      trust_boundary_result: response.data ?? null,
      cleared,
      denial_reason: !cleared ? (response.error ?? 'Trust boundary evaluation did not approve') : undefined,
      audit_timestamp: new Date().toISOString()
    };

    if (this.config.audit_all_crossings) {
      this.crossingAuditLog.push(crossing);
    }

    return crossing;
  }

  /**
   * Pre-flight checks before trust boundary evaluation.
   * Returns a denial reason string, or null if pre-flight passes.
   */
  private preflightCheck(request: VoiceLanguageIngressRequest): string | null {
    // Check speaker attribution requirement
    if (this.config.require_speaker_attribution && !request.speaker_id) {
      return 'Speaker attribution required but not provided';
    }

    // Check minimum confidence for clearance
    if (
      request.confidence_score !== undefined &&
      request.confidence_score < this.config.minimum_confidence_for_clearance
    ) {
      return `Confidence score ${request.confidence_score} below minimum ${this.config.minimum_confidence_for_clearance}`;
    }

    // Check session ID is present
    if (!request.session_id) {
      return 'Session ID required for all voice/language ingress';
    }

    return null;
  }
}
