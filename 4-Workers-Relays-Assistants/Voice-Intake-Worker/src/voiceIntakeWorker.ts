/**
 * Voice-Intake-Worker
 *
 * Receives voice session data, creates TranscriptEnvelope, creates
 * SpokenNoteEnvelope, routes through trust-boundary handling, creates
 * review queue items. NEVER creates sovereign domain records directly.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VoiceSessionMode = 'dictation' | 'command';

export interface VoiceSessionData {
  session_id: string;
  mode: VoiceSessionMode;
  raw_transcript: string;
  speaker_id?: string;
  duration_ms: number;
  confidence: number;
  metadata?: Record<string, unknown>;
}

export interface TranscriptEnvelope {
  envelope_id: string;
  session_id: string;
  raw_transcript: string;
  speaker_id?: string;
  duration_ms: number;
  confidence: number;
  trust_level: 'UNTRUSTED';
  created_at: string;
}

export interface SpokenNoteEnvelope {
  envelope_id: string;
  session_id: string;
  note_text: string;
  speaker_id?: string;
  intent?: string;
  trust_level: 'UNTRUSTED';
  created_at: string;
}

export interface ReviewQueueItem {
  id: string;
  item_type: 'transcript' | 'spoken_note';
  item_id: string;
  source: 'voice_intake';
  source_trust_level: 'UNTRUSTED';
  priority: 'medium';
  status: 'pending';
  created_at: string;
}

export interface VoiceIntakeResult {
  transcript_envelope: TranscriptEnvelope;
  spoken_note_envelope?: SpokenNoteEnvelope;
  review_queue_items: ReviewQueueItem[];
  receipt_id: string;
}

export interface VoiceIntakeReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'voice_intake';
  source_kernel: 'voice';
  entity_type: 'voice_session';
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
// Worker
// ---------------------------------------------------------------------------

export class VoiceIntakeWorker {
  private receipts: VoiceIntakeReceipt[] = [];

  /**
   * Process a voice session. Creates envelopes and review queue items.
   * NEVER creates sovereign domain records directly.
   */
  async processVoiceSession(session: VoiceSessionData): Promise<VoiceIntakeResult> {
    const now = new Date().toISOString();
    const receiptId = generateId('RCT');
    const reviewItems: ReviewQueueItem[] = [];

    // 1. Create TranscriptEnvelope — always UNTRUSTED
    const transcriptEnvelope: TranscriptEnvelope = {
      envelope_id: generateId('TXE'),
      session_id: session.session_id,
      raw_transcript: session.raw_transcript,
      speaker_id: session.speaker_id,
      duration_ms: session.duration_ms,
      confidence: session.confidence,
      trust_level: 'UNTRUSTED',
      created_at: now,
    };

    // 2. Create review queue item for transcript
    reviewItems.push({
      id: generateId('RQI'),
      item_type: 'transcript',
      item_id: transcriptEnvelope.envelope_id,
      source: 'voice_intake',
      source_trust_level: 'UNTRUSTED',
      priority: 'medium',
      status: 'pending',
      created_at: now,
    });

    // 3. For dictation mode, also create SpokenNoteEnvelope
    let spokenNoteEnvelope: SpokenNoteEnvelope | undefined;
    if (session.mode === 'dictation') {
      spokenNoteEnvelope = {
        envelope_id: generateId('SNE'),
        session_id: session.session_id,
        note_text: session.raw_transcript,
        speaker_id: session.speaker_id,
        trust_level: 'UNTRUSTED',
        created_at: now,
      };

      reviewItems.push({
        id: generateId('RQI'),
        item_type: 'spoken_note',
        item_id: spokenNoteEnvelope.envelope_id,
        source: 'voice_intake',
        source_trust_level: 'UNTRUSTED',
        priority: 'medium',
        status: 'pending',
        created_at: now,
      });
    }

    // 4. Emit receipt
    const receipt: VoiceIntakeReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'voice_intake',
      source_kernel: 'voice',
      entity_type: 'voice_session',
      entity_id: session.session_id,
      details: {
        mode: session.mode,
        confidence: session.confidence,
        duration_ms: session.duration_ms,
        transcript_envelope_id: transcriptEnvelope.envelope_id,
        spoken_note_envelope_id: spokenNoteEnvelope?.envelope_id ?? null,
        review_queue_items: reviewItems.length,
        trust_level: 'UNTRUSTED',
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    return {
      transcript_envelope: transcriptEnvelope,
      spoken_note_envelope: spokenNoteEnvelope,
      review_queue_items: reviewItems,
      receipt_id: receiptId,
    };
  }

  getReceipts(): VoiceIntakeReceipt[] {
    return [...this.receipts];
  }
}
