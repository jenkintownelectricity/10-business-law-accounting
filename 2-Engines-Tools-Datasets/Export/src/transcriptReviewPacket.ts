/**
 * Transcript Review Packet Generator
 *
 * Generates a full transcript export with:
 * - Complete transcript text with speaker attribution
 * - Language normalization notes
 * - Linked matters and entities
 * - Review status and practitioner annotations
 * - Confidence scores per segment
 *
 * Transcripts are non-sovereign artifacts. They become inputs to the review
 * queue but never directly constitute domain truth.
 */

import { formatPacketHeader, formatSection, formatTimestamp, formatProvenance } from './packetFormatter';

// ── Types ──────────────────────────────────────────────────────

export interface TranscriptSegmentExport {
  index: number;
  speaker_id: string;
  speaker_name: string;
  text: string;
  timestamp: string;
  duration_seconds: number;
  confidence: number;
  normalization_applied: boolean;
  normalization_notes: string[];
  annotations: string[];
}

export interface TranscriptReviewPacket {
  packet_type: 'TRANSCRIPT_REVIEW';
  generated_at: string;
  sovereign: false;
  trust_level: 'UNTRUSTED';
  transcript_id: string;
  session_id: string;
  source_type: 'dictation' | 'listening' | 'meeting' | 'call';
  total_duration_minutes: number;
  total_segments: number;
  average_confidence: number;
  speakers: Array<{
    speaker_id: string;
    speaker_name: string;
    segment_count: number;
    total_speaking_seconds: number;
  }>;
  segments: TranscriptSegmentExport[];
  language_normalization: {
    normalizations_applied: number;
    terminology_alignments: number;
    disambiguation_notes: string[];
  };
  linked_matters: Array<{
    matter_id: string;
    matter_title: string;
    relevance: string;
  }>;
  linked_entities: Array<{
    entity_id: string;
    entity_name: string;
    entity_type: string;
    mentions: number;
  }>;
  review_status: 'pending' | 'in_review' | 'reviewed' | 'archived';
  reviewed_by: string | null;
  reviewed_at: string | null;
  practitioner_notes: string[];
}

// ── Generator ──────────────────────────────────────────────────

export function generateTranscriptReviewPacket(
  transcriptId: string,
  options?: { includeNormalization?: boolean; includeLinkedEntities?: boolean }
): TranscriptReviewPacket {
  const opts = {
    includeNormalization: true,
    includeLinkedEntities: true,
    ...options,
  };

  const now = formatTimestamp(new Date());

  const packet: TranscriptReviewPacket = {
    packet_type: 'TRANSCRIPT_REVIEW',
    generated_at: now,
    sovereign: false,
    trust_level: 'UNTRUSTED',
    transcript_id: transcriptId,
    session_id: '',
    source_type: 'dictation',
    total_duration_minutes: 0,
    total_segments: 0,
    average_confidence: 0,
    speakers: [],
    segments: [],
    language_normalization: {
      normalizations_applied: 0,
      terminology_alignments: 0,
      disambiguation_notes: [],
    },
    linked_matters: [],
    linked_entities: opts.includeLinkedEntities ? [] : [],
    review_status: 'pending',
    reviewed_by: null,
    reviewed_at: null,
    practitioner_notes: [],
  };

  return packet;
}
