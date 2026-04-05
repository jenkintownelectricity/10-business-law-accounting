/**
 * Voice-Language-State Store
 *
 * Manages voice/language operational state.
 */

export interface VoiceSessionLog {
  session_id: string;
  mode: 'dictation' | 'command' | 'listening';
  started_at: string;
  ended_at?: string;
  transcript_count: number;
  command_count: number;
  advisory_packet_count: number;
  trust_boundary_crossings: number;
}

export interface TranscriptReference {
  transcript_id: string;
  session_id: string;
  source_type: 'dictation' | 'meeting' | 'call';
  review_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface LanguageNormalizationReceipt {
  id: string;
  input_hash: string;
  normalization_type: string;
  confidence: number;
  accepted: boolean;
  created_at: string;
}

export class VoiceLanguageStateStore {
  private sessionLogs: VoiceSessionLog[] = [];
  private transcriptRefs: Map<string, TranscriptReference[]> = new Map();
  private normalizationReceipts: LanguageNormalizationReceipt[] = [];

  /**
   * Log a voice session.
   */
  logVoiceSession(session: VoiceSessionLog): void {
    this.sessionLogs.push({ ...session });
  }

  /**
   * Get session logs, optionally filtered by time range.
   */
  getSessionLogs(options?: { from?: string; to?: string }): VoiceSessionLog[] {
    let logs = this.sessionLogs.map((s) => ({ ...s }));

    if (options?.from) {
      logs = logs.filter((s) => s.started_at >= options.from!);
    }

    if (options?.to) {
      logs = logs.filter((s) => s.started_at <= options.to!);
    }

    return logs.sort((a, b) => a.started_at.localeCompare(b.started_at));
  }

  /**
   * Add a transcript reference.
   */
  addTranscriptReference(ref: TranscriptReference): void {
    const refs = this.transcriptRefs.get(ref.session_id) ?? [];
    refs.push({ ...ref });
    this.transcriptRefs.set(ref.session_id, refs);
  }

  /**
   * Get transcript references for a session.
   */
  getTranscriptReferences(sessionId: string): TranscriptReference[] {
    return (this.transcriptRefs.get(sessionId) ?? []).map((r) => ({ ...r }));
  }

  /**
   * Add a language normalization receipt.
   */
  addNormalizationReceipt(receipt: LanguageNormalizationReceipt): void {
    this.normalizationReceipts.push({ ...receipt });
  }

  /**
   * Get all language normalization receipts.
   */
  getNormalizationReceipts(): LanguageNormalizationReceipt[] {
    return this.normalizationReceipts.map((r) => ({ ...r }));
  }
}
