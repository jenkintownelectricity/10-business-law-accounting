/**
 * Language Normalization Outputs Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: ADVISORY — produced by Language Intelligence Layer
 */

export interface LanguageNormalizationOutput {
  id: string;
  input_text: string;
  input_source_type: 'spoken_note' | 'transcript' | 'manual_entry' | 'meeting_intake' | 'document_extract';
  input_source_id: string | null;
  terminology_alignments: {
    original_term: string;
    suggested_term: string;
    target_kernel: 'business' | 'law' | 'accounting';
    confidence: number;
    alternatives: string[];
  }[];
  phrase_disambiguations: {
    original_phrase: string;
    interpretations: {
      interpretation: string;
      target_kernel: 'business' | 'law' | 'accounting';
      confidence: number;
    }[];
    recommended_interpretation: string;
  }[];
  semantic_components: {
    component_text: string;
    component_type: 'action' | 'entity_reference' | 'obligation' | 'deadline' | 'financial' | 'legal_term' | 'condition';
    target_kernel: 'business' | 'law' | 'accounting';
    confidence: number;
  }[];
  kernel_routing_hints: {
    kernel: 'business' | 'law' | 'accounting';
    relevance_score: number;
    reason: string;
  }[];
  overall_confidence: number;
  processing_time_ms: number;
  feedback_status: 'pending' | 'correct' | 'incorrect' | 'ambiguous' | null;
  feedback_correction: string | null;
  feedback_by: string | null;
  feedback_date: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'produced' | 'attached' | 'feedback_received' | 'archived';
}

export class LanguageNormalizationOutputCatalog {
  private entries: Map<string, LanguageNormalizationOutput> = new Map();

  register(entry: LanguageNormalizationOutput): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): LanguageNormalizationOutput | undefined {
    return this.entries.get(id);
  }

  list(): LanguageNormalizationOutput[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): LanguageNormalizationOutput[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listBySourceType(type: LanguageNormalizationOutput['input_source_type']): LanguageNormalizationOutput[] {
    return this.list().filter(e => e.input_source_type === type);
  }

  listLowConfidence(threshold: number = 0.5): LanguageNormalizationOutput[] {
    return this.list().filter(e => e.overall_confidence < threshold);
  }

  listPendingFeedback(): LanguageNormalizationOutput[] {
    return this.list().filter(e => e.feedback_status === 'pending');
  }

  listIncorrect(): LanguageNormalizationOutput[] {
    return this.list().filter(e => e.feedback_status === 'incorrect');
  }

  listByRoutingKernel(kernel: 'business' | 'law' | 'accounting'): LanguageNormalizationOutput[] {
    return this.list().filter(e =>
      e.kernel_routing_hints.some(h => h.kernel === kernel && h.relevance_score > 0.5)
    );
  }
}
