/**
 * Transcript-Normalization-Worker
 *
 * Cleans transcript text, segments by speaker, assigns timestamps,
 * evaluates completeness constraints, routes through language normalization,
 * produces structured transcript for review.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RawTranscriptInput {
  transcript_id: string;
  session_id: string;
  raw_text: string;
  speakers?: string[];
  total_duration_ms?: number;
  source_type: 'dictation' | 'meeting' | 'call';
}

export interface TranscriptSegment {
  segment_id: string;
  speaker: string;
  text: string;
  start_ms: number;
  end_ms: number;
  confidence: number;
}

export interface CompletenessConstraint {
  constraint_name: string;
  passed: boolean;
  message: string;
}

export interface StructuredTranscript {
  transcript_id: string;
  session_id: string;
  source_type: 'dictation' | 'meeting' | 'call';
  segments: TranscriptSegment[];
  total_duration_ms: number;
  speaker_count: number;
  completeness_constraints: CompletenessConstraint[];
  normalized: boolean;
  ready_for_review: boolean;
  created_at: string;
  receipt_id: string;
}

export interface NormalizationReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'transcript_normalization';
  source_kernel: 'language';
  entity_type: 'transcript';
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// ---------------------------------------------------------------------------
// Normalization logic
// ---------------------------------------------------------------------------

function cleanText(text: string): string {
  let cleaned = text;
  // Remove common filler words (simplified)
  cleaned = cleaned.replace(/\b(um|uh|hmm|like,?\s)/gi, '');
  // Collapse multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  // Trim
  cleaned = cleaned.trim();
  return cleaned;
}

function segmentBySpeaker(
  rawText: string,
  speakers: string[],
  totalDurationMs: number,
): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];

  // Simple segmentation: split by newlines or speaker labels
  const lines = rawText.split(/\n+/).filter((l) => l.trim().length > 0);
  const avgDurationPerLine = totalDurationMs / Math.max(lines.length, 1);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Try to detect "Speaker: text" pattern
    const speakerMatch = line.match(/^([A-Za-z\s]+?):\s*(.+)$/);
    let speaker: string;
    let text: string;

    if (speakerMatch) {
      speaker = speakerMatch[1].trim();
      text = speakerMatch[2].trim();
    } else {
      speaker = speakers.length > 0 ? speakers[i % speakers.length] : 'Speaker 1';
      text = line;
    }

    segments.push({
      segment_id: generateId('SEG'),
      speaker,
      text: cleanText(text),
      start_ms: Math.round(i * avgDurationPerLine),
      end_ms: Math.round((i + 1) * avgDurationPerLine),
      confidence: 0.8,
    });
  }

  return segments;
}

function evaluateCompleteness(segments: TranscriptSegment[], rawText: string): CompletenessConstraint[] {
  const constraints: CompletenessConstraint[] = [];

  // Constraint: minimum segment count
  constraints.push({
    constraint_name: 'minimum_segments',
    passed: segments.length > 0,
    message: segments.length > 0
      ? `${segments.length} segment(s) produced`
      : 'No segments produced from transcript',
  });

  // Constraint: no empty segments
  const emptySegments = segments.filter((s) => s.text.trim().length === 0);
  constraints.push({
    constraint_name: 'no_empty_segments',
    passed: emptySegments.length === 0,
    message: emptySegments.length === 0
      ? 'All segments contain text'
      : `${emptySegments.length} empty segment(s) found`,
  });

  // Constraint: transcript length preservation
  const originalLength = rawText.replace(/\s+/g, '').length;
  const segmentLength = segments.reduce((sum, s) => sum + s.text.replace(/\s+/g, '').length, 0);
  const preservationRatio = originalLength > 0 ? segmentLength / originalLength : 0;
  constraints.push({
    constraint_name: 'content_preservation',
    passed: preservationRatio > 0.5,
    message: `Content preservation ratio: ${(preservationRatio * 100).toFixed(1)}%`,
  });

  return constraints;
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class TranscriptNormalizationWorker {
  private receipts: NormalizationReceipt[] = [];

  /**
   * Normalize a raw transcript into a structured, reviewable format.
   */
  async normalize(input: RawTranscriptInput): Promise<StructuredTranscript> {
    const now = new Date().toISOString();
    const receiptId = generateId('RCT');

    const totalDuration = input.total_duration_ms ?? 0;
    const speakers = input.speakers ?? [];

    // 1. Segment by speaker and clean text
    const segments = segmentBySpeaker(input.raw_text, speakers, totalDuration);

    // 2. Evaluate completeness constraints
    const completenessConstraints = evaluateCompleteness(segments, input.raw_text);

    // 3. Determine unique speakers
    const uniqueSpeakers = new Set(segments.map((s) => s.speaker));

    // 4. Determine readiness for review
    const allConstraintsPassed = completenessConstraints.every((c) => c.passed);

    // 5. Emit receipt
    const receipt: NormalizationReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'transcript_normalization',
      source_kernel: 'language',
      entity_type: 'transcript',
      entity_id: input.transcript_id,
      details: {
        session_id: input.session_id,
        source_type: input.source_type,
        segment_count: segments.length,
        speaker_count: uniqueSpeakers.size,
        constraints_passed: allConstraintsPassed,
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    return {
      transcript_id: input.transcript_id,
      session_id: input.session_id,
      source_type: input.source_type,
      segments,
      total_duration_ms: totalDuration,
      speaker_count: uniqueSpeakers.size,
      completeness_constraints: completenessConstraints,
      normalized: true,
      ready_for_review: allConstraintsPassed,
      created_at: now,
      receipt_id: receiptId,
    };
  }

  getReceipts(): NormalizationReceipt[] {
    return [...this.receipts];
  }
}
