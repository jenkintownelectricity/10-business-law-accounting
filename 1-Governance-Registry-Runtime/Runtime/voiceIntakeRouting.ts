/**
 * Voice Intake Routing
 * Domain: Business Law Accounting
 *
 * Routes voice intake through trust-boundary handling.
 * Receives raw transcript/spoken input, creates candidate envelopes,
 * routes to appropriate kernel via orchestrator.
 * NEVER directly creates domain truth.
 */

import { TranscriptEnvelope } from '../Registry/catalogs/transcript-envelopes';
import { SpokenNoteEnvelope } from '../Registry/catalogs/spoken-note-envelopes';

export type KernelTarget = 'business' | 'law' | 'accounting';

export interface RawVoiceInput {
  session_id: string;
  input_type: 'dictation' | 'command' | 'meeting' | 'conversation';
  transcript_text: string;
  confidence_score: number;
  speaker_id: string | null;
  speaker_name: string | null;
  source_device_id: string;
  timestamp: string;
  duration_seconds: number;
}

export interface CandidateEnvelope {
  envelope_id: string;
  envelope_type: 'spoken_command' | 'spoken_note' | 'advisory_intake';
  source_transcript_id: string;
  content: string;
  trust_level: 'untrusted';
  routing_hints: {
    kernel: KernelTarget;
    relevance_score: number;
    reason: string;
  }[];
  created_at: string;
}

export interface VoiceRoutingResult {
  success: boolean;
  envelope: CandidateEnvelope;
  routed_to_kernels: KernelTarget[];
  review_queue_ids: string[];
  receipt_id: string;
  warnings: string[];
}

export class VoiceIntakeRouter {
  /**
   * Receives raw voice input and creates a candidate envelope.
   * The envelope is ALWAYS untrusted and must go through review.
   */
  async processRawInput(input: RawVoiceInput): Promise<VoiceRoutingResult> {
    // Step 1: Validate the input has minimum requirements
    const warnings: string[] = [];
    if (input.confidence_score < 0.7) {
      warnings.push(`Low confidence score (${input.confidence_score}). Manual transcript review recommended.`);
    }

    // Step 2: Determine envelope type based on input type
    const envelopeType = this.classifyEnvelopeType(input.input_type);

    // Step 3: Analyze content for routing hints
    const routingHints = this.analyzeForRouting(input.transcript_text);

    // Step 4: Create the candidate envelope — always UNTRUSTED
    const envelope: CandidateEnvelope = {
      envelope_id: `env-${input.session_id}-${Date.now()}`,
      envelope_type: envelopeType,
      source_transcript_id: `transcript-${input.session_id}`,
      content: input.transcript_text,
      trust_level: 'untrusted',
      routing_hints: routingHints,
      created_at: new Date().toISOString(),
    };

    // Step 5: Route to appropriate kernel review queues
    const targetKernels = routingHints
      .filter(h => h.relevance_score > 0.3)
      .map(h => h.kernel);

    const reviewQueueIds = targetKernels.map(k => `review-queue-${k}-${envelope.envelope_id}`);

    const receiptId = `receipt-voice-route-${envelope.envelope_id}-${Date.now()}`;

    return {
      success: true,
      envelope,
      routed_to_kernels: targetKernels,
      review_queue_ids: reviewQueueIds,
      receipt_id: receiptId,
      warnings,
    };
  }

  /**
   * Classifies the envelope type based on the input type.
   */
  private classifyEnvelopeType(inputType: RawVoiceInput['input_type']): CandidateEnvelope['envelope_type'] {
    switch (inputType) {
      case 'command':
        return 'spoken_command';
      case 'dictation':
        return 'spoken_note';
      case 'meeting':
      case 'conversation':
        return 'advisory_intake';
    }
  }

  /**
   * Analyzes transcript content for kernel routing hints.
   * This is a heuristic analysis — all results are suggestions only.
   */
  private analyzeForRouting(text: string): CandidateEnvelope['routing_hints'] {
    const hints: CandidateEnvelope['routing_hints'] = [];
    const lower = text.toLowerCase();

    // Business kernel indicators
    const businessTerms = ['vendor', 'entity', 'business', 'client', 'partner', 'relationship', 'operational', 'commercial'];
    const businessScore = businessTerms.reduce((score, term) =>
      lower.includes(term) ? score + 0.15 : score, 0);
    if (businessScore > 0) {
      hints.push({
        kernel: 'business',
        relevance_score: Math.min(businessScore, 1.0),
        reason: 'Business-related terminology detected.',
      });
    }

    // Law kernel indicators
    const lawTerms = ['contract', 'obligation', 'legal', 'compliance', 'deadline', 'court', 'statute', 'liability', 'indemnif', 'clause'];
    const lawScore = lawTerms.reduce((score, term) =>
      lower.includes(term) ? score + 0.15 : score, 0);
    if (lawScore > 0) {
      hints.push({
        kernel: 'law',
        relevance_score: Math.min(lawScore, 1.0),
        reason: 'Legal terminology detected.',
      });
    }

    // Accounting kernel indicators
    const accountingTerms = ['invoice', 'payment', 'tax', 'ledger', 'financial', 'reconcil', 'expense', 'revenue', 'debit', 'credit'];
    const accountingScore = accountingTerms.reduce((score, term) =>
      lower.includes(term) ? score + 0.15 : score, 0);
    if (accountingScore > 0) {
      hints.push({
        kernel: 'accounting',
        relevance_score: Math.min(accountingScore, 1.0),
        reason: 'Accounting/financial terminology detected.',
      });
    }

    // If no routing hints, route to all kernels for review
    if (hints.length === 0) {
      hints.push(
        { kernel: 'business', relevance_score: 0.33, reason: 'No specific kernel indicators. Routing to all for review.' },
        { kernel: 'law', relevance_score: 0.33, reason: 'No specific kernel indicators. Routing to all for review.' },
        { kernel: 'accounting', relevance_score: 0.33, reason: 'No specific kernel indicators. Routing to all for review.' },
      );
    }

    return hints;
  }
}
