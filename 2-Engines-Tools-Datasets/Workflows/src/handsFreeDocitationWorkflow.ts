// ──────────────────────────────────────────────────────────────
//  Workflow: Hands-Free Dictation
//
//  Processes spoken matter notes, dictated analyses, and
//  dictated tasks into practitioner-editable structured drafts.
//  Output is NEVER a sovereign record — always a candidate for
//  practitioner review.
//
//  Flow:
//    1. Receive voice input (audio reference or raw transcript)
//    2. Create TranscriptEnvelope
//    3. Create SpokenNoteEnvelope with structured draft
//    4. Route through language normalization
//    5. Determine kernel routing
//    6. Create RoutedKernelCandidate
//    7. Add to practitioner review queue
//    8. Output practitioner-editable structured draft
// ──────────────────────────────────────────────────────────────

import type {
  TranscriptEnvelope,
  TranscriptSegment,
  SpokenNoteEnvelope,
  StructuredDraft,
  LanguageNormalizationPacket,
  RoutedKernelCandidate,
  KernelDomain,
  KernelReceipt,
  TrustLevel,
} from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export interface DictationInput {
  session_id: string;
  audio_path?: string;
  raw_transcript?: string;
  speaker_id?: string;
  matter_id?: string;
  dictation_type: 'matter_note' | 'analysis' | 'task' | 'correspondence' | 'general';
  language?: string;
  requested_by: string;
}

export interface DictationOutputPacket {
  id: string;
  session_id: string;
  transcript_envelope: TranscriptEnvelope;
  spoken_note: SpokenNoteEnvelope;
  language_packet: LanguageNormalizationPacket | null;
  routed_candidate: RoutedKernelCandidate;
  editable_draft: EditableDraft;
  review_queue_id: string;
  kernel_receipts: KernelReceipt[];
  trust_level: 'UNTRUSTED';
  warnings: string[];
  generated_at: string;
  generated_by: string;
}

export interface EditableDraft {
  title: string;
  content: string;
  summary: string;
  key_points: string[];
  suggested_tags: string[];
  suggested_matter_id?: string;
  suggested_kernel: KernelDomain | null;
  referenced_entities: { name: string; entity_id?: string; confidence: number }[];
  referenced_dates: { raw: string; parsed?: string; confidence: number }[];
  referenced_amounts: { raw: string; amount?: number; currency?: string; confidence: number }[];
  practitioner_can_edit: true;
  is_sovereign: false;
}

// ── Workflow stages ──────────────────────────────────────────

export type DictationStage =
  | 'input_validation'
  | 'transcription'
  | 'envelope_creation'
  | 'note_structuring'
  | 'language_normalization'
  | 'kernel_routing'
  | 'candidate_creation'
  | 'review_queue_submission'
  | 'completed'
  | 'failed';

export interface DictationState {
  stage: DictationStage;
  input: DictationInput;
  transcript_envelope: TranscriptEnvelope | null;
  spoken_note: SpokenNoteEnvelope | null;
  language_packet: LanguageNormalizationPacket | null;
  routed_candidate: RoutedKernelCandidate | null;
  kernel_receipts: KernelReceipt[];
  warnings: string[];
  errors: DictationError[];
  started_at: string;
  completed_at?: string;
}

export interface DictationError {
  stage: DictationStage;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
}

// ── Workflow execution ───────────────────────────────────────

export async function executeHandsFreeDictation(
  input: DictationInput,
  dependencies: DictationDependencies,
): Promise<DictationOutputPacket> {
  const state: DictationState = {
    stage: 'input_validation',
    input,
    transcript_envelope: null,
    spoken_note: null,
    language_packet: null,
    routed_candidate: null,
    kernel_receipts: [],
    warnings: [],
    errors: [],
    started_at: new Date().toISOString(),
  };

  // Stage 1: Validate
  if (!input.audio_path && !input.raw_transcript) {
    throw new DictationWorkflowError([{
      stage: 'input_validation',
      code: 'NO_INPUT',
      message: 'Either audio_path or raw_transcript is required.',
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Stage 2: Transcription (if audio provided, otherwise use raw transcript)
  state.stage = 'transcription';
  let transcriptText: string;
  let segments: TranscriptSegment[];

  if (input.audio_path) {
    try {
      const result = await dependencies.transcribeAudio(input.audio_path, input.language ?? 'en');
      transcriptText = result.text;
      segments = result.segments;
    } catch (err) {
      throw new DictationWorkflowError([{
        stage: 'transcription',
        code: 'TRANSCRIPTION_FAILED',
        message: err instanceof Error ? err.message : String(err),
        recoverable: false,
        timestamp: new Date().toISOString(),
      }]);
    }
  } else {
    transcriptText = input.raw_transcript!;
    segments = [{
      id: `seg_${Date.now()}_0`,
      start_time: 0,
      end_time: 0,
      text: transcriptText,
      speaker_id: input.speaker_id,
      confidence: 1.0,
      language: input.language ?? 'en',
      flagged_terms: [],
    }];
  }

  // Stage 3: Create TranscriptEnvelope
  state.stage = 'envelope_creation';
  const now = new Date().toISOString();

  const envelope: TranscriptEnvelope = {
    id: `te_${input.session_id}_${Date.now()}`,
    session_id: input.session_id,
    transcript_text: transcriptText,
    segments,
    speaker_attributions: input.speaker_id
      ? [{
          speaker_id: input.speaker_id,
          label: input.requested_by,
          total_speaking_time: 0,
          segment_count: segments.length,
        }]
      : [],
    overall_confidence: segments.reduce((sum, s) => sum + s.confidence, 0) / segments.length,
    source_type: 'dictation',
    language: input.language ?? 'en',
    duration_seconds: 0,
    review_status: 'pending_review',
    routed_to_kernel: null,
    matter_id: input.matter_id,
    trust_level: 'UNTRUSTED',
    created_at: now,
    updated_at: now,
    created_by: input.requested_by,
  };

  state.transcript_envelope = envelope;

  state.kernel_receipts.push({
    receipt_id: `rcpt_transcribe_${Date.now()}`,
    kernel: 'business',
    operation: 'dictation_transcription',
    timestamp: now,
    status: 'success',
  });

  // Stage 4: Create SpokenNoteEnvelope with structured draft
  state.stage = 'note_structuring';
  let structuredDraft: StructuredDraft;
  try {
    structuredDraft = await dependencies.structureNote(transcriptText, input.dictation_type);
  } catch (err) {
    state.warnings.push(`Note structuring partially failed: ${err instanceof Error ? err.message : String(err)}`);
    structuredDraft = {
      title: `Dictated ${input.dictation_type} — ${new Date().toLocaleDateString()}`,
      summary: transcriptText.slice(0, 200),
      key_points: [],
      referenced_entities: [],
      referenced_dates: [],
      referenced_amounts: [],
      suggested_tags: [],
      suggested_kernel: null,
    };
  }

  const spokenNote: SpokenNoteEnvelope = {
    id: `sn_${input.session_id}_${Date.now()}`,
    session_id: input.session_id,
    raw_text: transcriptText,
    structured_draft: structuredDraft,
    routed_kernel: structuredDraft.suggested_kernel,
    review_status: 'draft',
    matter_id: input.matter_id ?? structuredDraft.suggested_matter_id,
    editable_title: structuredDraft.title,
    editable_content: transcriptText,
    editable_tags: structuredDraft.suggested_tags,
    practitioner_corrections: [],
    trust_level: 'UNTRUSTED',
    created_at: now,
    updated_at: now,
    created_by: input.requested_by,
  };

  state.spoken_note = spokenNote;

  // Stage 5: Language normalization (optional but recommended)
  state.stage = 'language_normalization';
  try {
    state.language_packet = await dependencies.normalizeLanguage(transcriptText, input.language ?? 'en');

    // Enrich the structured draft with normalization results
    if (state.language_packet.routing_hints.length > 0) {
      const topHint = state.language_packet.routing_hints.sort((a, b) => b.relevance_score - a.relevance_score)[0]!;
      if (!structuredDraft.suggested_kernel) {
        structuredDraft.suggested_kernel = topHint.kernel;
        spokenNote.routed_kernel = topHint.kernel;
      }
    }
  } catch (err) {
    state.warnings.push(`Language normalization skipped: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Stage 6: Determine kernel routing
  state.stage = 'kernel_routing';
  const targetKernel = determineTargetKernel(structuredDraft, state.language_packet, input);

  // Stage 7: Create RoutedKernelCandidate
  state.stage = 'candidate_creation';
  const candidate: RoutedKernelCandidate = {
    id: `rkc_${input.session_id}_${Date.now()}`,
    source: 'voice_dictation',
    source_id: spokenNote.id,
    target_kernel: targetKernel,
    confidence: structuredDraft.suggested_kernel === targetKernel ? 0.8 : 0.5,
    content: {
      content_type: mapDictationType(input.dictation_type),
      raw_content: transcriptText,
      structured_content: structuredDraft as unknown as Record<string, unknown>,
      extraction_method: 'voice_dictation_pipeline',
    },
    requires_practitioner_review: true,
    review_status: 'pending_review',
    matter_id: input.matter_id,
    trust_level: 'UNTRUSTED',
    routing_reasoning: buildRoutingReasoning(targetKernel, structuredDraft, state.language_packet),
    alternative_kernels: buildAlternativeKernels(targetKernel, state.language_packet),
    created_at: now,
    updated_at: now,
    created_by: input.requested_by,
  };

  state.routed_candidate = candidate;

  // Stage 8: Submit to review queue
  state.stage = 'review_queue_submission';
  const reviewQueueId = await dependencies.submitToReviewQueue(candidate, spokenNote);

  // Build editable draft output
  const editableDraft: EditableDraft = {
    title: spokenNote.editable_title,
    content: spokenNote.editable_content,
    summary: structuredDraft.summary,
    key_points: structuredDraft.key_points,
    suggested_tags: structuredDraft.suggested_tags,
    suggested_matter_id: spokenNote.matter_id,
    suggested_kernel: targetKernel,
    referenced_entities: structuredDraft.referenced_entities.map(e => ({
      name: e.raw_mention,
      entity_id: e.resolved_entity_id,
      confidence: e.confidence,
    })),
    referenced_dates: structuredDraft.referenced_dates.map(d => ({
      raw: d.raw_mention,
      parsed: d.parsed_date,
      confidence: d.confidence,
    })),
    referenced_amounts: structuredDraft.referenced_amounts.map(a => ({
      raw: a.raw_mention,
      amount: a.parsed_amount,
      currency: a.currency,
      confidence: a.confidence,
    })),
    practitioner_can_edit: true,
    is_sovereign: false,
  };

  const packet: DictationOutputPacket = {
    id: `dop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    session_id: input.session_id,
    transcript_envelope: envelope,
    spoken_note: spokenNote,
    language_packet: state.language_packet,
    routed_candidate: candidate,
    editable_draft: editableDraft,
    review_queue_id: reviewQueueId,
    kernel_receipts: state.kernel_receipts,
    trust_level: 'UNTRUSTED',
    warnings: state.warnings,
    generated_at: new Date().toISOString(),
    generated_by: 'hands_free_dictation_workflow',
  };

  state.stage = 'completed';
  state.completed_at = new Date().toISOString();

  return packet;
}

// ── Helper functions ─────────────────────────────────────────

function determineTargetKernel(
  draft: StructuredDraft,
  langPacket: LanguageNormalizationPacket | null,
  input: DictationInput,
): KernelDomain {
  // Priority: explicit draft suggestion > language packet hints > dictation type inference
  if (draft.suggested_kernel) return draft.suggested_kernel;

  if (langPacket && langPacket.routing_hints.length > 0) {
    const topHint = langPacket.routing_hints.sort((a, b) => b.relevance_score - a.relevance_score)[0]!;
    if (topHint.relevance_score > 0.6) return topHint.kernel;
  }

  // Fall back to dictation type
  switch (input.dictation_type) {
    case 'correspondence': return 'business';
    case 'analysis': return 'law';
    case 'task': return 'business';
    default: return 'business';
  }
}

function mapDictationType(type: DictationInput['dictation_type']): 'matter_note' | 'action_item' | 'other' {
  switch (type) {
    case 'matter_note': return 'matter_note';
    case 'task': return 'action_item';
    default: return 'other';
  }
}

function buildRoutingReasoning(
  kernel: KernelDomain,
  draft: StructuredDraft,
  langPacket: LanguageNormalizationPacket | null,
): string {
  const reasons: string[] = [];
  if (draft.suggested_kernel === kernel) {
    reasons.push(`Structured draft analysis suggests ${kernel} kernel.`);
  }
  if (langPacket) {
    const hint = langPacket.routing_hints.find(h => h.kernel === kernel);
    if (hint) {
      reasons.push(`Language normalization supports routing to ${kernel} (score: ${hint.relevance_score}).`);
    }
  }
  if (reasons.length === 0) {
    reasons.push(`Default routing to ${kernel} based on dictation type.`);
  }
  return reasons.join(' ');
}

function buildAlternativeKernels(
  primary: KernelDomain,
  langPacket: LanguageNormalizationPacket | null,
): { kernel: KernelDomain; confidence: number }[] {
  const allKernels: KernelDomain[] = ['business', 'law', 'accounting'];
  const alternatives: { kernel: KernelDomain; confidence: number }[] = [];

  for (const k of allKernels) {
    if (k === primary) continue;
    const hint = langPacket?.routing_hints.find(h => h.kernel === k);
    alternatives.push({ kernel: k, confidence: hint?.relevance_score ?? 0.2 });
  }

  return alternatives.sort((a, b) => b.confidence - a.confidence);
}

// ── Dependency injection interface ───────────────────────────

export interface TranscriptionResult {
  text: string;
  segments: TranscriptSegment[];
}

export interface DictationDependencies {
  transcribeAudio(audioPath: string, language: string): Promise<TranscriptionResult>;
  structureNote(text: string, dictationType: DictationInput['dictation_type']): Promise<StructuredDraft>;
  normalizeLanguage(text: string, language: string): Promise<LanguageNormalizationPacket>;
  submitToReviewQueue(candidate: RoutedKernelCandidate, note: SpokenNoteEnvelope): Promise<string>;
}

// ── Error types ──────────────────────────────────────────────

export class DictationWorkflowError extends Error {
  public readonly errors: DictationError[];

  constructor(errors: DictationError[]) {
    super(`Dictation workflow failed: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'DictationWorkflowError';
    this.errors = errors;
  }
}
