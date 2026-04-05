/**
 * Voice-Language Constraint Family
 * Domain: Business Law Accounting — Voice and Language Layers
 *
 * All voice and language inputs enter as UNTRUSTED.
 * These constraints enforce integrity before any voice/language data
 * can influence domain truth.
 */

import type { ConstraintResult, ConstraintEvaluation } from '../Business-Constraints/constraints';

export type { ConstraintResult, ConstraintEvaluation };

// --- VOICE-001: incomplete-transcript-envelope ---

export interface TranscriptEnvelopeInput {
  envelope_id: string;
  session_id?: string;
  speaker_id?: string;
  transcript_text?: string;
  timestamp?: string;
  audio_source?: string;
  confidence_score?: number;
}

export function evaluateIncompleteTranscriptEnvelope(input: TranscriptEnvelopeInput): ConstraintEvaluation {
  const required: Array<{ field: string; present: boolean }> = [
    { field: 'session_id', present: !!input.session_id },
    { field: 'speaker_id', present: !!input.speaker_id },
    { field: 'transcript_text', present: !!input.transcript_text },
    { field: 'timestamp', present: !!input.timestamp },
    { field: 'audio_source', present: !!input.audio_source }
  ];

  const missing = required.filter(r => !r.present).map(r => r.field);

  if (missing.length === 0) {
    return {
      constraint_id: 'VOICE-001',
      constraint_name: 'incomplete-transcript-envelope',
      result: 'PASS',
      message: 'Transcript envelope complete',
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-001',
    constraint_name: 'incomplete-transcript-envelope',
    result: 'HALT',
    message: `Transcript envelope missing required fields: ${missing.join(', ')} — cannot proceed`,
    details: { envelope_id: input.envelope_id, missing_fields: missing },
    evaluated_at: new Date().toISOString()
  };
}

// --- VOICE-002: low-confidence-utterance-classification ---

export interface UtteranceClassificationInput {
  utterance_id: string;
  confidence_score: number;
  confidence_threshold?: number;
  classified_intent?: string;
}

export function evaluateLowConfidenceUtteranceClassification(input: UtteranceClassificationInput): ConstraintEvaluation {
  const threshold = input.confidence_threshold ?? 0.75;

  if (input.confidence_score >= threshold) {
    return {
      constraint_id: 'VOICE-002',
      constraint_name: 'low-confidence-utterance-classification',
      result: 'PASS',
      message: `Utterance classification confidence: ${input.confidence_score} (threshold: ${threshold})`,
      details: { classified_intent: input.classified_intent },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-002',
    constraint_name: 'low-confidence-utterance-classification',
    result: 'WARNING',
    message: `Speech-to-text confidence ${input.confidence_score} below threshold ${threshold}`,
    details: {
      utterance_id: input.utterance_id,
      confidence_score: input.confidence_score,
      threshold,
      classified_intent: input.classified_intent
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- VOICE-003: missing-speaker-session-provenance ---

export interface SpeakerSessionProvenanceInput {
  input_id: string;
  session_id?: string;
  speaker_id?: string;
  session_start?: string;
  device_id?: string;
}

export function evaluateMissingSpeakerSessionProvenance(input: SpeakerSessionProvenanceInput): ConstraintEvaluation {
  if (input.session_id && input.speaker_id) {
    return {
      constraint_id: 'VOICE-003',
      constraint_name: 'missing-speaker-session-provenance',
      result: 'PASS',
      message: 'Speaker and session provenance present',
      details: {
        session_id: input.session_id,
        speaker_id: input.speaker_id,
        session_start: input.session_start
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-003',
    constraint_name: 'missing-speaker-session-provenance',
    result: 'HALT',
    message: 'No session or speaker provenance — cannot proceed without attribution',
    details: {
      input_id: input.input_id,
      has_session_id: !!input.session_id,
      has_speaker_id: !!input.speaker_id
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- VOICE-004: ambiguous-legal-accounting-routing ---

export interface RoutingAmbiguityInput {
  utterance_id: string;
  detected_kernels: Array<'business' | 'law' | 'accounting'>;
  routing_confidence: number;
  routing_threshold?: number;
}

export function evaluateAmbiguousLegalAccountingRouting(input: RoutingAmbiguityInput): ConstraintEvaluation {
  const threshold = input.routing_threshold ?? 0.7;

  if (input.detected_kernels.length === 1 && input.routing_confidence >= threshold) {
    return {
      constraint_id: 'VOICE-004',
      constraint_name: 'ambiguous-legal-accounting-routing',
      result: 'PASS',
      message: `Clear routing to ${input.detected_kernels[0]} kernel (confidence: ${input.routing_confidence})`,
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-004',
    constraint_name: 'ambiguous-legal-accounting-routing',
    result: 'WARNING',
    message: input.detected_kernels.length === 0
      ? 'Cannot determine target kernel from utterance'
      : `Ambiguous routing — detected kernels: ${input.detected_kernels.join(', ')} (confidence: ${input.routing_confidence})`,
    details: {
      utterance_id: input.utterance_id,
      detected_kernels: input.detected_kernels,
      routing_confidence: input.routing_confidence,
      threshold
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- VOICE-005: unsafe-spoken-action-request ---

export interface SpokenActionInput {
  utterance_id: string;
  action_type: string;
  is_truth_mutation: boolean;
  requires_confirmation: boolean;
}

export function evaluateUnsafeSpokenActionRequest(input: SpokenActionInput): ConstraintEvaluation {
  if (input.is_truth_mutation) {
    return {
      constraint_id: 'VOICE-005',
      constraint_name: 'unsafe-spoken-action-request',
      result: 'HALT',
      message: 'Spoken command attempts direct truth mutation — cannot proceed',
      details: {
        utterance_id: input.utterance_id,
        action_type: input.action_type,
        is_truth_mutation: true
      },
      evaluated_at: new Date().toISOString()
    };
  }

  if (input.requires_confirmation) {
    return {
      constraint_id: 'VOICE-005',
      constraint_name: 'unsafe-spoken-action-request',
      result: 'WARNING',
      message: 'Spoken action requires confirmation before proceeding',
      details: {
        utterance_id: input.utterance_id,
        action_type: input.action_type
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-005',
    constraint_name: 'unsafe-spoken-action-request',
    result: 'PASS',
    message: 'Spoken action request is safe',
    evaluated_at: new Date().toISOString()
  };
}

// --- VOICE-006: unsupported-spoken-command ---

export interface SpokenCommandInput {
  utterance_id: string;
  command: string;
  recognized: boolean;
  supported_commands?: string[];
}

export function evaluateUnsupportedSpokenCommand(input: SpokenCommandInput): ConstraintEvaluation {
  if (input.recognized) {
    return {
      constraint_id: 'VOICE-006',
      constraint_name: 'unsupported-spoken-command',
      result: 'PASS',
      message: `Spoken command recognized: ${input.command}`,
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-006',
    constraint_name: 'unsupported-spoken-command',
    result: 'UNSUPPORTED',
    message: `Unrecognized spoken command: ${input.command}`,
    details: {
      utterance_id: input.utterance_id,
      command: input.command,
      supported_commands: input.supported_commands
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- VOICE-007: language-normalization-uncertainty ---

export interface LanguageNormalizationInput {
  input_id: string;
  normalization_confidence: number;
  normalization_threshold?: number;
  original_text: string;
  normalized_text?: string;
}

export function evaluateLanguageNormalizationUncertainty(input: LanguageNormalizationInput): ConstraintEvaluation {
  const threshold = input.normalization_threshold ?? 0.8;

  if (input.normalization_confidence >= threshold && input.normalized_text) {
    return {
      constraint_id: 'VOICE-007',
      constraint_name: 'language-normalization-uncertainty',
      result: 'PASS',
      message: `Normalization confidence: ${input.normalization_confidence} (threshold: ${threshold})`,
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-007',
    constraint_name: 'language-normalization-uncertainty',
    result: 'WARNING',
    message: `Normalization confidence ${input.normalization_confidence} below threshold ${threshold}`,
    details: {
      input_id: input.input_id,
      normalization_confidence: input.normalization_confidence,
      threshold,
      original_text_length: input.original_text.length
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- VOICE-008: transcription-evidence-completeness ---

export interface TranscriptionCompletenessInput {
  transcript_id: string;
  total_segments: number;
  transcribed_segments: number;
  audio_duration_seconds?: number;
  transcribed_duration_seconds?: number;
}

export function evaluateTranscriptionEvidenceCompleteness(input: TranscriptionCompletenessInput): ConstraintEvaluation {
  const completeness = input.total_segments > 0
    ? input.transcribed_segments / input.total_segments
    : 0;

  if (completeness >= 1.0) {
    return {
      constraint_id: 'VOICE-008',
      constraint_name: 'transcription-evidence-completeness',
      result: 'PASS',
      message: 'Transcription complete',
      details: {
        total_segments: input.total_segments,
        transcribed_segments: input.transcribed_segments
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'VOICE-008',
    constraint_name: 'transcription-evidence-completeness',
    result: 'PARTIAL',
    message: `Transcript incomplete: ${input.transcribed_segments}/${input.total_segments} segments (${(completeness * 100).toFixed(1)}%)`,
    details: {
      transcript_id: input.transcript_id,
      total_segments: input.total_segments,
      transcribed_segments: input.transcribed_segments,
      completeness_ratio: completeness,
      audio_duration_seconds: input.audio_duration_seconds,
      transcribed_duration_seconds: input.transcribed_duration_seconds
    },
    evaluated_at: new Date().toISOString()
  };
}
