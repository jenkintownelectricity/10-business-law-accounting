// ──────────────────────────────────────────────────────────────
//  Workflow: Iron Ear / Listening
//
//  Processes live or uploaded meeting/discussion/call audio into
//  a ListeningSession with transcript candidates, obligation
//  candidates, deadline candidates, and advisory review packets.
//
//  CRITICAL GOVERNANCE: No sovereign action without practitioner
//  review. All outputs are advisory candidates.
//
//  Flow:
//    1. Initialize ListeningSession
//    2. Produce transcript envelopes from audio stream/file
//    3. Extract obligation candidates from transcript
//    4. Extract deadline candidates from transcript
//    5. Produce business/legal/accounting routing hints
//    6. Create advisory review packets
//    7. Output ListeningSession envelope with advisory packets
// ──────────────────────────────────────────────────────────────

import type {
  ListeningSession,
  ListeningSessionStatus,
  TranscriptEnvelope,
  TranscriptSegment,
  SpeakerAttribution,
  ObligationCandidate,
  DeadlineCandidate,
  RoutingHint,
  AdvisoryIntakePacket,
  CandidateAction,
  KernelDomain,
  KernelReceipt,
} from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export interface ListeningInput {
  session_id: string;
  title: string;
  description?: string;
  audio_source: 'live_microphone' | 'uploaded_file' | 'conference_bridge' | 'phone_call';
  audio_path?: string;
  language?: string;
  expected_participants?: string[];
  matter_id?: string;
  requested_by: string;
}

export interface ListeningOutputPacket {
  id: string;
  session: ListeningSession;
  transcript_envelopes: TranscriptEnvelope[];
  obligation_candidates: ObligationCandidate[];
  deadline_candidates: DeadlineCandidate[];
  routing_hints: RoutingHint[];
  advisory_packets: AdvisoryIntakePacket[];
  kernel_receipts: KernelReceipt[];
  governance_notice: string;
  generated_at: string;
  generated_by: string;
}

// ── Workflow stages ──────────────────────────────────────────

export type ListeningStage =
  | 'initialization'
  | 'transcription'
  | 'obligation_extraction'
  | 'deadline_extraction'
  | 'routing_analysis'
  | 'advisory_packet_creation'
  | 'session_finalization'
  | 'completed'
  | 'failed';

export interface ListeningState {
  stage: ListeningStage;
  input: ListeningInput;
  session: ListeningSession | null;
  transcript_envelopes: TranscriptEnvelope[];
  obligation_candidates: ObligationCandidate[];
  deadline_candidates: DeadlineCandidate[];
  routing_hints: RoutingHint[];
  advisory_packets: AdvisoryIntakePacket[];
  kernel_receipts: KernelReceipt[];
  errors: ListeningError[];
  started_at: string;
  completed_at?: string;
}

export interface ListeningError {
  stage: ListeningStage;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
}

// ── Workflow execution ───────────────────────────────────────

export async function executeIronEarListening(
  input: ListeningInput,
  dependencies: ListeningDependencies,
): Promise<ListeningOutputPacket> {
  const state: ListeningState = {
    stage: 'initialization',
    input,
    session: null,
    transcript_envelopes: [],
    obligation_candidates: [],
    deadline_candidates: [],
    routing_hints: [],
    advisory_packets: [],
    kernel_receipts: [],
    errors: [],
    started_at: new Date().toISOString(),
  };

  const now = new Date().toISOString();

  // Stage 1: Initialize ListeningSession
  state.stage = 'initialization';
  const session: ListeningSession = {
    id: `ls_${input.session_id}`,
    session_id: input.session_id,
    title: input.title,
    description: input.description,
    start_time: now,
    status: 'active',
    transcript_envelope_ids: [],
    obligation_candidates: [],
    deadline_candidates: [],
    routing_hints: [],
    advisory_packets: [],
    participant_count: input.expected_participants?.length,
    matter_id: input.matter_id,
    trust_level: 'UNTRUSTED',
    tags: [],
    created_at: now,
    updated_at: now,
    created_by: input.requested_by,
  };

  state.session = session;
  await dependencies.persistSession(session);

  // Stage 2: Produce transcript envelopes
  state.stage = 'transcription';
  try {
    const transcriptResults = await dependencies.processAudio(
      input.audio_source,
      input.audio_path,
      input.language ?? 'en',
      input.expected_participants,
    );

    for (const result of transcriptResults) {
      const envelope: TranscriptEnvelope = {
        id: `te_${input.session_id}_${state.transcript_envelopes.length}`,
        session_id: input.session_id,
        transcript_text: result.text,
        segments: result.segments,
        speaker_attributions: result.speakers,
        overall_confidence: result.segments.length > 0
          ? result.segments.reduce((sum, s) => sum + s.confidence, 0) / result.segments.length
          : 0,
        source_type: mapAudioSource(input.audio_source),
        language: input.language ?? 'en',
        duration_seconds: result.duration_seconds,
        review_status: 'pending_review',
        routed_to_kernel: null,
        matter_id: input.matter_id,
        trust_level: 'UNTRUSTED',
        created_at: now,
        updated_at: now,
        created_by: input.requested_by,
      };

      state.transcript_envelopes.push(envelope);
      session.transcript_envelope_ids.push(envelope.id);
    }

    state.kernel_receipts.push({
      receipt_id: `rcpt_transcription_${Date.now()}`,
      kernel: 'business',
      operation: 'listening_transcription',
      timestamp: now,
      status: 'success',
    });
  } catch (err) {
    state.errors.push({
      stage: 'transcription',
      code: 'TRANSCRIPTION_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: false,
      timestamp: new Date().toISOString(),
    });
    throw new ListeningWorkflowError(state.errors);
  }

  const fullTranscript = state.transcript_envelopes.map(e => e.transcript_text).join('\n');

  // Stage 3: Extract obligation candidates
  state.stage = 'obligation_extraction';
  try {
    state.obligation_candidates = await dependencies.extractObligationCandidates(
      fullTranscript,
      state.transcript_envelopes,
    );

    // Mark all as requiring review
    for (const candidate of state.obligation_candidates) {
      candidate.requires_review = true;
      candidate.review_status = 'pending';
    }

    session.obligation_candidates = state.obligation_candidates;

    state.kernel_receipts.push({
      receipt_id: `rcpt_obligation_extract_${Date.now()}`,
      kernel: 'law',
      operation: 'obligation_candidate_extraction',
      timestamp: new Date().toISOString(),
      status: state.obligation_candidates.length > 0 ? 'success' : 'partial',
    });
  } catch (err) {
    state.errors.push({
      stage: 'obligation_extraction',
      code: 'OBLIGATION_EXTRACTION_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Stage 4: Extract deadline candidates
  state.stage = 'deadline_extraction';
  try {
    state.deadline_candidates = await dependencies.extractDeadlineCandidates(
      fullTranscript,
      state.transcript_envelopes,
    );

    for (const candidate of state.deadline_candidates) {
      candidate.requires_review = true;
      candidate.review_status = 'pending';
    }

    session.deadline_candidates = state.deadline_candidates;

    state.kernel_receipts.push({
      receipt_id: `rcpt_deadline_extract_${Date.now()}`,
      kernel: 'law',
      operation: 'deadline_candidate_extraction',
      timestamp: new Date().toISOString(),
      status: state.deadline_candidates.length > 0 ? 'success' : 'partial',
    });
  } catch (err) {
    state.errors.push({
      stage: 'deadline_extraction',
      code: 'DEADLINE_EXTRACTION_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Stage 5: Produce routing hints
  state.stage = 'routing_analysis';
  try {
    state.routing_hints = await dependencies.analyzeRouting(fullTranscript, state.transcript_envelopes);
    session.routing_hints = state.routing_hints;
  } catch (err) {
    state.errors.push({
      stage: 'routing_analysis',
      code: 'ROUTING_ANALYSIS_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Stage 6: Create advisory review packets
  state.stage = 'advisory_packet_creation';

  // Create advisory packet for obligation candidates
  if (state.obligation_candidates.length > 0) {
    const oblPacket = createAdvisoryPacket(
      input,
      'obligation',
      `${state.obligation_candidates.length} obligation candidate(s) extracted from listening session`,
      state.obligation_candidates.map(oc => ({
        id: `ca_obl_${oc.id}`,
        action_type: 'create_obligation' as const,
        description: oc.extracted_text,
        target_kernel: 'law' as KernelDomain,
        parameters: {
          suggested_obligor: oc.suggested_obligor,
          suggested_obligee: oc.suggested_obligee,
          suggested_due_date: oc.suggested_due_date,
        },
        confidence: oc.confidence,
        requires_practitioner_review: true as const,
      })),
    );
    state.advisory_packets.push(oblPacket);
  }

  // Create advisory packet for deadline candidates
  if (state.deadline_candidates.length > 0) {
    const dlPacket = createAdvisoryPacket(
      input,
      'deadline',
      `${state.deadline_candidates.length} deadline candidate(s) extracted from listening session`,
      state.deadline_candidates.map(dc => ({
        id: `ca_dl_${dc.id}`,
        action_type: 'create_deadline' as const,
        description: dc.extracted_text,
        target_kernel: 'law' as KernelDomain,
        parameters: {
          suggested_date: dc.suggested_date,
          suggested_description: dc.suggested_description,
          suggested_criticality: dc.suggested_criticality,
        },
        confidence: dc.confidence,
        requires_practitioner_review: true as const,
      })),
    );
    state.advisory_packets.push(dlPacket);
  }

  // Create general advisory packet for routing hints
  if (state.routing_hints.length > 0) {
    for (const hint of state.routing_hints) {
      const routingPacket = createAdvisoryPacket(
        input,
        'routing',
        `Content relevant to ${hint.kernel} kernel detected: ${hint.reason}`,
        [{
          id: `ca_route_${hint.kernel}_${Date.now()}`,
          action_type: 'flag_risk' as const,
          description: hint.reason,
          target_kernel: hint.kernel,
          parameters: { relevant_segments: hint.relevant_segments },
          confidence: hint.confidence,
          requires_practitioner_review: true as const,
        }],
      );
      state.advisory_packets.push(routingPacket);
    }
  }

  session.advisory_packets = state.advisory_packets.map(p => ({
    packet_id: p.id,
    packet_type: 'obligation' as const,
    summary: p.content_summary,
  }));

  // Stage 7: Finalize session
  state.stage = 'session_finalization';
  session.end_time = new Date().toISOString();
  session.status = 'completed';
  session.updated_at = session.end_time;

  await dependencies.persistSession(session);
  await dependencies.submitAdvisoryPackets(state.advisory_packets);

  const packet: ListeningOutputPacket = {
    id: `lop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    session,
    transcript_envelopes: state.transcript_envelopes,
    obligation_candidates: state.obligation_candidates,
    deadline_candidates: state.deadline_candidates,
    routing_hints: state.routing_hints,
    advisory_packets: state.advisory_packets,
    kernel_receipts: state.kernel_receipts,
    governance_notice: 'ALL outputs from this listening session are ADVISORY ONLY. No sovereign action will be taken without explicit practitioner review and approval.',
    generated_at: new Date().toISOString(),
    generated_by: 'iron_ear_listening_workflow',
  };

  state.stage = 'completed';
  state.completed_at = new Date().toISOString();

  return packet;
}

// ── Helper functions ─────────────────────────────────────────

function mapAudioSource(source: ListeningInput['audio_source']): TranscriptEnvelope['source_type'] {
  switch (source) {
    case 'live_microphone': return 'meeting';
    case 'uploaded_file': return 'meeting';
    case 'conference_bridge': return 'meeting';
    case 'phone_call': return 'phone_call';
  }
}

function createAdvisoryPacket(
  input: ListeningInput,
  type: string,
  summary: string,
  candidateActions: CandidateAction[],
): AdvisoryIntakePacket {
  const now = new Date().toISOString();
  return {
    id: `aip_${type}_${input.session_id}_${Date.now()}`,
    source_type: 'listening',
    source_session_id: input.session_id,
    content: summary,
    content_summary: summary,
    routing_suggestion: candidateActions.length > 0 ? candidateActions[0]!.target_kernel : null,
    routing_confidence: candidateActions.length > 0
      ? candidateActions.reduce((sum, a) => sum + a.confidence, 0) / candidateActions.length
      : 0,
    review_required: true,
    review_status: 'pending_review',
    candidate_actions: candidateActions,
    trust_level: 'UNTRUSTED',
    matter_id: input.matter_id,
    related_entity_ids: [],
    flags: [],
    created_at: now,
    updated_at: now,
    created_by: input.requested_by,
  };
}

// ── Dependency injection interface ───────────────────────────

export interface AudioProcessingResult {
  text: string;
  segments: TranscriptSegment[];
  speakers: SpeakerAttribution[];
  duration_seconds: number;
}

export interface ListeningDependencies {
  persistSession(session: ListeningSession): Promise<void>;
  processAudio(
    source: ListeningInput['audio_source'],
    audioPath: string | undefined,
    language: string,
    expectedParticipants?: string[],
  ): Promise<AudioProcessingResult[]>;
  extractObligationCandidates(
    transcript: string,
    envelopes: TranscriptEnvelope[],
  ): Promise<ObligationCandidate[]>;
  extractDeadlineCandidates(
    transcript: string,
    envelopes: TranscriptEnvelope[],
  ): Promise<DeadlineCandidate[]>;
  analyzeRouting(
    transcript: string,
    envelopes: TranscriptEnvelope[],
  ): Promise<RoutingHint[]>;
  submitAdvisoryPackets(packets: AdvisoryIntakePacket[]): Promise<void>;
}

// ── Error types ──────────────────────────────────────────────

export class ListeningWorkflowError extends Error {
  public readonly errors: ListeningError[];

  constructor(errors: ListeningError[]) {
    super(`Iron Ear listening workflow failed: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'ListeningWorkflowError';
    this.errors = errors;
  }
}
