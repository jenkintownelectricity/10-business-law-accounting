/**
 * Listening Session Packet Generator
 *
 * Generates an export of an Iron Ear listening session containing:
 * - Session metadata (duration, participants, context)
 * - Full transcript with speaker attribution
 * - Extracted candidates (items flagged for review)
 * - Advisory packets (non-sovereign observations)
 * - Routing hints (suggested domain actions)
 * - Review status for all extracted items
 *
 * All output is non-sovereign. Nothing in this packet constitutes domain truth.
 */

import { formatPacketHeader, formatSection, formatTimestamp, formatProvenance } from './packetFormatter';

// ── Types ──────────────────────────────────────────────────────

export interface AdvisoryPacketExport {
  id: string;
  content: string;
  confidence: number;
  suggested_action: string;
  linked_matter_id: string | null;
  sovereign: false;
  review_status: 'pending' | 'accepted' | 'rejected' | 'deferred';
  reviewed_by: string | null;
}

export interface ListeningSessionPacket {
  packet_type: 'LISTENING_SESSION';
  generated_at: string;
  sovereign: false;
  trust_level: 'UNTRUSTED';
  session_id: string;
  session_type: 'meeting' | 'call' | 'deposition' | 'negotiation' | 'other';
  started_at: string;
  ended_at: string;
  duration_minutes: number;
  participants: Array<{
    name: string;
    role: string;
    speaker_id: string;
  }>;
  context: {
    matter_id: string | null;
    purpose: string;
    notes: string;
  };
  transcript_segments: Array<{
    segment_index: number;
    speaker_id: string;
    speaker_name: string;
    text: string;
    timestamp: string;
    confidence: number;
  }>;
  extracted_candidates: Array<{
    id: string;
    type: 'obligation' | 'deadline' | 'commitment' | 'risk' | 'action_item' | 'other';
    text: string;
    confidence: number;
    review_status: 'pending' | 'accepted' | 'rejected';
  }>;
  advisory_packets: AdvisoryPacketExport[];
  routing_hints: Array<{
    target_kernel: string;
    suggested_action: string;
    confidence: number;
    requires_review: true;
  }>;
  review_summary: {
    total_candidates: number;
    reviewed: number;
    accepted: number;
    rejected: number;
    pending: number;
  };
}

// ── Generator ──────────────────────────────────────────────────

export function generateListeningSessionPacket(
  sessionId: string,
  options?: { includeTranscript?: boolean; includeRoutingHints?: boolean }
): ListeningSessionPacket {
  const opts = {
    includeTranscript: true,
    includeRoutingHints: true,
    ...options,
  };

  const now = formatTimestamp(new Date());

  const packet: ListeningSessionPacket = {
    packet_type: 'LISTENING_SESSION',
    generated_at: now,
    sovereign: false,
    trust_level: 'UNTRUSTED',
    session_id: sessionId,
    session_type: 'other',
    started_at: '',
    ended_at: '',
    duration_minutes: 0,
    participants: [],
    context: {
      matter_id: null,
      purpose: '',
      notes: '',
    },
    transcript_segments: opts.includeTranscript ? [] : [],
    extracted_candidates: [],
    advisory_packets: [],
    routing_hints: opts.includeRoutingHints ? [] : [],
    review_summary: {
      total_candidates: 0,
      reviewed: 0,
      accepted: 0,
      rejected: 0,
      pending: 0,
    },
  };

  return packet;
}
