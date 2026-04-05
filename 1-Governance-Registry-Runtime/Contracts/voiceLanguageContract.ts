/**
 * Voice Language Contract
 * Domain: Business Law Accounting
 *
 * Contract for voice/language layer interactions.
 * Defines allowed inputs/outputs and trust boundary requirements.
 * All voice/language outputs are either UNTRUSTED or ADVISORY.
 */

export type VoiceInputType = 'dictation' | 'command' | 'meeting' | 'conversation';
export type LanguageInputType = 'spoken_note' | 'transcript' | 'manual_entry' | 'meeting_intake' | 'document_extract';
export type OutputTrustLevel = 'untrusted' | 'advisory';

/**
 * Allowed inputs for the Voice Assist Layer.
 */
export interface VoiceLayerInput {
  session_id: string;
  input_type: VoiceInputType;
  audio_reference: string | null;
  transcript_text: string;
  confidence_score: number;
  speaker_id: string | null;
  source_device_id: string;
  timestamp: string;
}

/**
 * Allowed outputs from the Voice Assist Layer.
 * All outputs carry trust_level 'untrusted'.
 */
export interface VoiceLayerOutput {
  output_id: string;
  output_type: 'transcript_envelope' | 'spoken_command_candidate' | 'spoken_note_envelope' | 'advisory_intake_packet';
  trust_level: 'untrusted';
  session_id: string;
  content: Record<string, unknown>;
  routing_hints: {
    kernel: 'business' | 'law' | 'accounting';
    relevance: number;
  }[];
  requires_review: true;
  produced_at: string;
}

/**
 * Allowed inputs for the Language Intelligence Layer.
 */
export interface LanguageLayerInput {
  request_id: string;
  input_type: LanguageInputType;
  input_text: string;
  source_id: string | null;
  context: Record<string, unknown>;
  timestamp: string;
}

/**
 * Allowed outputs from the Language Intelligence Layer.
 * All outputs carry trust_level 'advisory'.
 */
export interface LanguageLayerOutput {
  output_id: string;
  output_type: 'normalization_packet' | 'terminology_alignment' | 'phrase_disambiguation' | 'routing_hint';
  trust_level: 'advisory';
  request_id: string;
  content: Record<string, unknown>;
  confidence: number;
  produced_at: string;
}

/**
 * Trust boundary requirements for voice/language outputs
 * entering the domain kernel space.
 */
export interface VoiceLanguageTrustRequirements {
  /**
   * Voice outputs must pass through this trust pipeline before
   * any content may influence domain truth.
   */
  voice_trust_pipeline: [
    'transcription',
    'candidate_envelope_creation',
    'orchestrator_routing',
    'kernel_review_queue',
    'practitioner_review',
    'typed_acceptance'
  ];

  /**
   * Language outputs are advisory and may be attached to
   * candidate envelopes but never directly modify domain records.
   */
  language_trust_constraints: [
    'outputs_are_advisory_only',
    'no_direct_record_modification',
    'no_automatic_classification',
    'practitioner_may_override'
  ];
}

/**
 * VoiceLanguageContract defines the allowed interaction patterns
 * for the Voice Assist Layer and Language Intelligence Layer.
 */
export interface VoiceLanguageContract {
  /**
   * Submit voice input for processing.
   * Returns an UNTRUSTED output that must go through the review pipeline.
   */
  submitVoiceInput(input: VoiceLayerInput): Promise<VoiceLayerOutput>;

  /**
   * Submit text for language normalization.
   * Returns an ADVISORY output with suggestions only.
   */
  submitLanguageInput(input: LanguageLayerInput): Promise<LanguageLayerOutput>;

  /**
   * Get the trust requirements that govern voice/language outputs.
   */
  getTrustRequirements(): VoiceLanguageTrustRequirements;

  /**
   * Validate that a voice/language output conforms to trust constraints.
   */
  validateOutputTrust(output: VoiceLayerOutput | LanguageLayerOutput): {
    valid: boolean;
    violations: string[];
  };
}
