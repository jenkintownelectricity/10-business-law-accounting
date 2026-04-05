/**
 * Transcript Envelopes Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: UNTRUSTED — produced by Voice Assist Layer
 */

export interface TranscriptEnvelope {
  id: string;
  session_id: string;
  transcript_text: string;
  speaker_attribution: {
    speaker_id: string | null;
    speaker_name: string | null;
    speaker_role: string | null;
    segments: {
      start_offset: number;
      end_offset: number;
      text: string;
    }[];
  }[];
  confidence_score: number;
  source_type: 'dictation' | 'meeting' | 'command' | 'conversation' | 'court_proceeding';
  source_device_id: string;
  source_session_id: string;
  duration_seconds: number;
  language: string;
  timestamp: string;
  routed_to_kernel: ('business' | 'law' | 'accounting')[] | null;
  derived_envelopes: string[];
  privilege_flags: {
    attorney_client: boolean;
    work_product: boolean;
    joint_defense: boolean;
  };
  review_status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'partial';
  reviewed_by: string | null;
  review_date: string | null;
  review_notes: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'captured' | 'transcribed' | 'routed' | 'reviewed' | 'archived';
}

export class TranscriptEnvelopeCatalog {
  private entries: Map<string, TranscriptEnvelope> = new Map();

  register(entry: TranscriptEnvelope): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): TranscriptEnvelope | undefined {
    return this.entries.get(id);
  }

  list(): TranscriptEnvelope[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): TranscriptEnvelope[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listBySession(sessionId: string): TranscriptEnvelope[] {
    return this.list().filter(e => e.session_id === sessionId);
  }

  listBySourceType(type: TranscriptEnvelope['source_type']): TranscriptEnvelope[] {
    return this.list().filter(e => e.source_type === type);
  }

  listPendingReview(): TranscriptEnvelope[] {
    return this.list().filter(e => e.review_status === 'pending');
  }

  listLowConfidence(threshold: number = 0.7): TranscriptEnvelope[] {
    return this.list().filter(e => e.confidence_score < threshold);
  }

  listPrivileged(): TranscriptEnvelope[] {
    return this.list().filter(e =>
      e.privilege_flags.attorney_client ||
      e.privilege_flags.work_product ||
      e.privilege_flags.joint_defense
    );
  }
}
