/**
 * Language Intelligence Layer — Types
 * All types for language normalization, terminology alignment, and disambiguation.
 */

export interface LanguageNormalizationPacket {
  packet_id: string;
  original_text: string;
  normalized_text: string;
  transformations: NormalizationTransformation[];
  confidence: number;
  advisory_only: true;
  normalized_at: string;
}

export interface NormalizationTransformation {
  original: string;
  normalized: string;
  rule_applied: string;
  confidence: number;
}

export interface TerminologyAlignment {
  alignment_id: string;
  input_term: string;
  domain_term: string;
  target_kernel: string;
  confidence: number;
  alternatives: { term: string; kernel: string; confidence: number }[];
  aligned_at: string;
}

export interface PhraseDisambiguation {
  disambiguation_id: string;
  input_phrase: string;
  interpretations: PhraseInterpretation[];
  recommended_interpretation: string;
  confidence: number;
  advisory_only: true;
  disambiguated_at: string;
}

export interface PhraseInterpretation {
  interpretation: string;
  target_kernel: string;
  confidence: number;
  reasoning: string;
}

export interface KernelRoutingHint {
  hint_id: string;
  input_text: string;
  suggested_kernels: SuggestedKernel[];
  primary_kernel: string;
  confidence: number;
  advisory_only: true;
  generated_at: string;
}

export interface SuggestedKernel {
  kernel: string;
  confidence: number;
  matched_terms: string[];
  reasoning: string;
}
