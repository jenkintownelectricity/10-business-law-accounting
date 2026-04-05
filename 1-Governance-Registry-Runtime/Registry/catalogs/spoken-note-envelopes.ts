/**
 * Spoken Note Envelopes Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: UNTRUSTED — produced by Voice Assist Layer, requires review
 */

export interface SpokenNoteEnvelope {
  id: string;
  transcript_envelope_id: string;
  speaker_id: string;
  speaker_name: string;
  note_text: string;
  normalized_text: string | null;
  content_classification: {
    primary_kernel: 'business' | 'law' | 'accounting' | null;
    secondary_kernels: ('business' | 'law' | 'accounting')[];
    confidence: number;
    classification_hints: string[];
  };
  extracted_references: {
    entity_references: string[];
    contract_references: string[];
    matter_references: string[];
    financial_references: string[];
    date_references: string[];
  };
  language_normalization_id: string | null;
  structured_draft_id: string | null;
  routed_to_kernel: ('business' | 'law' | 'accounting')[] | null;
  session_id: string;
  timestamp: string;
  confidence_score: number;
  review_status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'split';
  reviewed_by: string | null;
  review_date: string | null;
  review_notes: string | null;
  promoted_to_record_id: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'captured' | 'classified' | 'routed' | 'draft_produced' | 'reviewed' | 'promoted' | 'rejected' | 'archived';
}

export class SpokenNoteEnvelopeCatalog {
  private entries: Map<string, SpokenNoteEnvelope> = new Map();

  register(entry: SpokenNoteEnvelope): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): SpokenNoteEnvelope | undefined {
    return this.entries.get(id);
  }

  list(): SpokenNoteEnvelope[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): SpokenNoteEnvelope[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listPendingReview(): SpokenNoteEnvelope[] {
    return this.list().filter(e => e.review_status === 'pending');
  }

  listByClassification(kernel: 'business' | 'law' | 'accounting'): SpokenNoteEnvelope[] {
    return this.list().filter(e =>
      e.content_classification.primary_kernel === kernel ||
      e.content_classification.secondary_kernels.includes(kernel)
    );
  }

  listBySession(sessionId: string): SpokenNoteEnvelope[] {
    return this.list().filter(e => e.session_id === sessionId);
  }

  listBySpeaker(speakerId: string): SpokenNoteEnvelope[] {
    return this.list().filter(e => e.speaker_id === speakerId);
  }

  listPromoted(): SpokenNoteEnvelope[] {
    return this.list().filter(e => e.status === 'promoted' && e.promoted_to_record_id !== null);
  }
}
