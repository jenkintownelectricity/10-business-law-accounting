// ──────────────────────────────────────────────────────────────
//  Domain Object: LanguageNormalizationPacket
//  Output of the Language Expert that normalizes, aligns
//  terminology, and disambiguates domain-heavy text.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain } from './matter.js';

export interface TerminologyAlignment {
  original_term: string;
  normalized_term: string;
  domain: KernelDomain;
  definition?: string;
  confidence: number;
  alternatives: AlternativeInterpretation[];
}

export interface AlternativeInterpretation {
  term: string;
  domain: KernelDomain;
  confidence: number;
  context_hint: string;
}

export interface DisambiguationResult {
  ambiguous_phrase: string;
  context: string;
  selected_interpretation: string;
  selected_domain: KernelDomain;
  confidence: number;
  reasoning: string;
  alternatives: AlternativeInterpretation[];
  requires_practitioner_confirmation: boolean;
}

export interface RoutingHint {
  kernel: KernelDomain;
  relevance_score: number;
  reason: string;
  key_terms: string[];
}

export interface LanguageNormalizationPacket {
  id: string;
  input_text: string;
  normalized_text: string;
  source_language: string;
  target_language: string;
  terminology_alignments: TerminologyAlignment[];
  disambiguation_results: DisambiguationResult[];
  routing_hints: RoutingHint[];
  overall_confidence: number;
  flags: LanguageFlag[];
  session_id?: string;
  matter_id?: string;
  created_at: string;
  created_by: string;
}

export interface LanguageFlag {
  flag_type: 'low_confidence' | 'multiple_interpretations' | 'missing_context' | 'domain_collision' | 'untranslatable';
  description: string;
  affected_text: string;
  suggested_action: string;
}
