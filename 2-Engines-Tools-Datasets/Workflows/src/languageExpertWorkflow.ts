// ──────────────────────────────────────────────────────────────
//  Workflow: Language Expert
//
//  Processes complex, multilingual, or domain-heavy text through
//  the Language Intelligence Layer for normalization, terminology
//  alignment, disambiguation, and kernel routing.
//
//  Flow:
//    1. Validate text input
//    2. Normalize language (grammar, phrasing, structure)
//    3. Align domain terminology (legal, accounting, business)
//    4. Disambiguate phrases with multiple interpretations
//    5. Produce kernel routing suggestions
//    6. Output LanguageNormalizationPacket with interpretation support
// ──────────────────────────────────────────────────────────────

import type {
  LanguageNormalizationPacket,
  TerminologyAlignment,
  AlternativeInterpretation,
  DisambiguationResult,
  LanguageFlag,
  KernelDomain,
  KernelReceipt,
} from '@10-bla/domain-objects';

// Use the RoutingHint from languagePacket (not listeningSession)
import type { RoutingHint } from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export interface LanguageExpertInput {
  text: string;
  source_language?: string;
  target_language?: string;
  context?: LanguageContext;
  session_id?: string;
  matter_id?: string;
  requested_by: string;
}

export interface LanguageContext {
  domain_hint?: KernelDomain;
  matter_type?: string;
  related_entity_names?: string[];
  known_terms?: Record<string, string>;
  formality_level?: 'formal' | 'informal' | 'legal' | 'technical';
}

export interface LanguageExpertOutputPacket {
  id: string;
  normalization_packet: LanguageNormalizationPacket;
  interpretation_support: InterpretationSupport;
  routing_recommendations: RoutingRecommendation[];
  kernel_receipts: KernelReceipt[];
  warnings: string[];
  generated_at: string;
  generated_by: string;
}

export interface InterpretationSupport {
  original_text: string;
  normalized_text: string;
  confidence: number;
  ambiguity_count: number;
  domain_terms_found: number;
  languages_detected: string[];
  practitioner_attention_needed: boolean;
  attention_areas: AttentionArea[];
}

export interface AttentionArea {
  text_range: { start: number; end: number };
  original_text: string;
  issue: string;
  suggestion: string;
  confidence: number;
}

export interface RoutingRecommendation {
  kernel: KernelDomain;
  confidence: number;
  reason: string;
  supporting_terms: string[];
  text_segments: string[];
}

// ── Terminology dictionaries ─────────────────────────────────

const LEGAL_TERMS: Record<string, string> = {
  'force majeure': 'Unforeseeable circumstances preventing contract fulfillment',
  'indemnify': 'To compensate for loss or damage',
  'liquidated damages': 'Pre-determined damage amount specified in contract',
  'statute of limitations': 'Maximum time period for initiating legal proceedings',
  'fiduciary duty': 'Legal obligation of one party to act in the best interest of another',
  'lien': 'Legal claim or right against property as security for a debt',
  'estoppel': 'Legal principle preventing assertion of contradictory claims',
  'res judicata': 'Matter that has been adjudicated and cannot be re-litigated',
  'prima facie': 'Sufficient evidence to establish a fact unless rebutted',
  'pro rata': 'Proportional allocation or distribution',
};

const ACCOUNTING_TERMS: Record<string, string> = {
  'accrual': 'Revenue/expense recognition when earned/incurred regardless of cash timing',
  'amortization': 'Gradual write-off of intangible asset cost over its useful life',
  'depreciation': 'Allocation of tangible asset cost over its useful life',
  'goodwill': 'Excess of purchase price over fair value of net identifiable assets',
  'impairment': 'Reduction in recoverable amount of an asset below its carrying amount',
  'provisions': 'Liability of uncertain timing or amount',
  'contingent liability': 'Possible obligation from past events confirmed by uncertain future events',
  'deferred revenue': 'Payment received for goods/services not yet delivered',
  'fair value': 'Price at which an asset would change hands between willing parties',
  'materiality': 'Significance of an amount or misstatement in financial reporting context',
};

const BUSINESS_TERMS: Record<string, string> = {
  'due diligence': 'Comprehensive appraisal of a business or investment opportunity',
  'synergy': 'Combined value exceeding the sum of individual parts',
  'run rate': 'Annualized financial performance based on current data',
  'burn rate': 'Rate at which a company spends cash in excess of revenue',
  'cap table': 'Capitalization table detailing ownership structure',
  'term sheet': 'Non-binding agreement setting forth basic terms of an investment',
  'waterfall': 'Hierarchical structure of cash flow distribution',
  'clawback': 'Provision for return of previously distributed compensation',
  'drag-along': 'Right forcing minority shareholders to join in a sale',
  'ratchet': 'Anti-dilution provision adjusting conversion price',
};

// ── Workflow execution ───────────────────────────────────────

export async function executeLanguageExpert(
  input: LanguageExpertInput,
  dependencies: LanguageExpertDependencies,
): Promise<LanguageExpertOutputPacket> {
  const warnings: string[] = [];
  const kernelReceipts: KernelReceipt[] = [];
  const now = new Date().toISOString();

  // Stage 1: Validate
  if (!input.text || !input.text.trim()) {
    throw new LanguageExpertError('Input text is empty.');
  }

  const sourceLanguage = input.source_language ?? 'en';
  const targetLanguage = input.target_language ?? 'en';

  // Stage 2: Normalize language
  let normalizedText: string;
  try {
    normalizedText = await dependencies.normalizeText(input.text, sourceLanguage, targetLanguage, input.context);
  } catch (err) {
    warnings.push(`Normalization partially failed, using original text: ${err instanceof Error ? err.message : String(err)}`);
    normalizedText = input.text;
  }

  // Stage 3: Align domain terminology
  const terminologyAlignments = identifyTerminology(input.text, normalizedText, input.context);

  // Enrich with dependency-provided terminology if available
  try {
    const enrichedAlignments = await dependencies.enrichTerminology(terminologyAlignments, input.context);
    terminologyAlignments.push(...enrichedAlignments.filter(
      ea => !terminologyAlignments.some(ta => ta.original_term === ea.original_term),
    ));
  } catch (err) {
    warnings.push(`Terminology enrichment skipped: ${err instanceof Error ? err.message : String(err)}`);
  }

  kernelReceipts.push({
    receipt_id: `rcpt_lang_terminology_${Date.now()}`,
    kernel: 'business',
    operation: 'terminology_alignment',
    timestamp: now,
    status: 'success',
  });

  // Stage 4: Disambiguate phrases
  let disambiguationResults: DisambiguationResult[];
  try {
    disambiguationResults = await dependencies.disambiguate(input.text, normalizedText, terminologyAlignments, input.context);
  } catch (err) {
    warnings.push(`Disambiguation failed: ${err instanceof Error ? err.message : String(err)}`);
    disambiguationResults = [];
  }

  // Stage 5: Produce kernel routing suggestions
  const routingHints = produceRoutingHints(terminologyAlignments, disambiguationResults, input.context);

  // Build flags
  const flags = buildFlags(terminologyAlignments, disambiguationResults);

  // Build the normalization packet
  const overallConfidence = computeOverallConfidence(terminologyAlignments, disambiguationResults);

  const normalizationPacket: LanguageNormalizationPacket = {
    id: `lnp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    input_text: input.text,
    normalized_text: normalizedText,
    source_language: sourceLanguage,
    target_language: targetLanguage,
    terminology_alignments: terminologyAlignments,
    disambiguation_results: disambiguationResults,
    routing_hints: routingHints,
    overall_confidence: overallConfidence,
    flags,
    session_id: input.session_id,
    matter_id: input.matter_id,
    created_at: now,
    created_by: input.requested_by,
  };

  // Build interpretation support
  const attentionAreas = buildAttentionAreas(disambiguationResults, flags, input.text);
  const interpretationSupport: InterpretationSupport = {
    original_text: input.text,
    normalized_text: normalizedText,
    confidence: overallConfidence,
    ambiguity_count: disambiguationResults.length,
    domain_terms_found: terminologyAlignments.length,
    languages_detected: [sourceLanguage],
    practitioner_attention_needed: attentionAreas.length > 0 || overallConfidence < 0.7,
    attention_areas: attentionAreas,
  };

  // Build routing recommendations
  const routingRecommendations: RoutingRecommendation[] = routingHints
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .map(hint => ({
      kernel: hint.kernel,
      confidence: hint.relevance_score,
      reason: hint.reason,
      supporting_terms: hint.key_terms,
      text_segments: [],
    }));

  const outputPacket: LanguageExpertOutputPacket = {
    id: `leop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    normalization_packet: normalizationPacket,
    interpretation_support: interpretationSupport,
    routing_recommendations: routingRecommendations,
    kernel_receipts: kernelReceipts,
    warnings,
    generated_at: now,
    generated_by: 'language_expert_workflow',
  };

  return outputPacket;
}

// ── Helper functions ─────────────────────────────────────────

function identifyTerminology(
  originalText: string,
  normalizedText: string,
  context?: LanguageContext,
): TerminologyAlignment[] {
  const alignments: TerminologyAlignment[] = [];
  const lowerText = originalText.toLowerCase();

  const searchDictionary = (
    dict: Record<string, string>,
    domain: KernelDomain,
  ) => {
    for (const [term, definition] of Object.entries(dict)) {
      if (lowerText.includes(term)) {
        const alternatives: AlternativeInterpretation[] = [];

        // Check if this term exists in other domain dictionaries
        if (domain !== 'law' && term in LEGAL_TERMS) {
          alternatives.push({ term, domain: 'law', confidence: 0.5, context_hint: 'Also a legal term' });
        }
        if (domain !== 'accounting' && term in ACCOUNTING_TERMS) {
          alternatives.push({ term, domain: 'accounting', confidence: 0.5, context_hint: 'Also an accounting term' });
        }
        if (domain !== 'business' && term in BUSINESS_TERMS) {
          alternatives.push({ term, domain: 'business', confidence: 0.5, context_hint: 'Also a business term' });
        }

        alignments.push({
          original_term: term,
          normalized_term: term,
          domain,
          definition,
          confidence: context?.domain_hint === domain ? 0.9 : 0.7,
          alternatives,
        });
      }
    }
  };

  searchDictionary(LEGAL_TERMS, 'law');
  searchDictionary(ACCOUNTING_TERMS, 'accounting');
  searchDictionary(BUSINESS_TERMS, 'business');

  // Apply known terms from context
  if (context?.known_terms) {
    for (const [original, normalized] of Object.entries(context.known_terms)) {
      if (lowerText.includes(original.toLowerCase())) {
        alignments.push({
          original_term: original,
          normalized_term: normalized,
          domain: context.domain_hint ?? 'business',
          confidence: 0.95,
          alternatives: [],
        });
      }
    }
  }

  return alignments;
}

function produceRoutingHints(
  alignments: TerminologyAlignment[],
  disambiguations: DisambiguationResult[],
  context?: LanguageContext,
): RoutingHint[] {
  const kernelScores = new Map<KernelDomain, { score: number; terms: string[]; reasons: string[] }>();

  const ensureKernel = (kernel: KernelDomain) => {
    if (!kernelScores.has(kernel)) {
      kernelScores.set(kernel, { score: 0, terms: [], reasons: [] });
    }
    return kernelScores.get(kernel)!;
  };

  // Score from terminology
  for (const alignment of alignments) {
    const entry = ensureKernel(alignment.domain);
    entry.score += alignment.confidence;
    entry.terms.push(alignment.original_term);
    entry.reasons.push(`Domain term "${alignment.original_term}" identified`);
  }

  // Score from disambiguations
  for (const disambiguation of disambiguations) {
    const entry = ensureKernel(disambiguation.selected_domain);
    entry.score += disambiguation.confidence * 0.5;
    entry.reasons.push(`Disambiguation resolved "${disambiguation.ambiguous_phrase}" to ${disambiguation.selected_domain}`);
  }

  // Context hint bonus
  if (context?.domain_hint) {
    const entry = ensureKernel(context.domain_hint);
    entry.score += 1.0;
    entry.reasons.push(`Context domain hint: ${context.domain_hint}`);
  }

  // Normalize scores
  const maxScore = Math.max(...Array.from(kernelScores.values()).map(v => v.score), 1);

  const hints: RoutingHint[] = [];
  for (const [kernel, data] of kernelScores) {
    hints.push({
      kernel,
      relevance_score: Math.min(data.score / maxScore, 1.0),
      reason: data.reasons.slice(0, 3).join('; '),
      key_terms: data.terms,
    });
  }

  return hints.sort((a, b) => b.relevance_score - a.relevance_score);
}

function buildFlags(
  alignments: TerminologyAlignment[],
  disambiguations: DisambiguationResult[],
): LanguageFlag[] {
  const flags: LanguageFlag[] = [];

  // Flag terms with multiple domain interpretations
  for (const alignment of alignments) {
    if (alignment.alternatives.length > 0 && alignment.confidence < 0.8) {
      flags.push({
        flag_type: 'multiple_interpretations',
        description: `"${alignment.original_term}" has interpretations in ${alignment.alternatives.map(a => a.domain).join(', ')}`,
        affected_text: alignment.original_term,
        suggested_action: 'Confirm intended domain interpretation with practitioner.',
      });
    }
  }

  // Flag low-confidence disambiguations
  for (const disambiguation of disambiguations) {
    if (disambiguation.confidence < 0.6) {
      flags.push({
        flag_type: 'low_confidence',
        description: `Disambiguation of "${disambiguation.ambiguous_phrase}" has low confidence (${disambiguation.confidence})`,
        affected_text: disambiguation.ambiguous_phrase,
        suggested_action: disambiguation.reasoning,
      });
    }
    if (disambiguation.requires_practitioner_confirmation) {
      flags.push({
        flag_type: 'domain_collision',
        description: `"${disambiguation.ambiguous_phrase}" requires practitioner confirmation for domain assignment`,
        affected_text: disambiguation.ambiguous_phrase,
        suggested_action: 'Review the selected interpretation and confirm or override.',
      });
    }
  }

  return flags;
}

function buildAttentionAreas(
  disambiguations: DisambiguationResult[],
  flags: LanguageFlag[],
  originalText: string,
): AttentionArea[] {
  const areas: AttentionArea[] = [];

  for (const flag of flags) {
    const idx = originalText.toLowerCase().indexOf(flag.affected_text.toLowerCase());
    if (idx >= 0) {
      areas.push({
        text_range: { start: idx, end: idx + flag.affected_text.length },
        original_text: flag.affected_text,
        issue: flag.description,
        suggestion: flag.suggested_action,
        confidence: 0.5,
      });
    }
  }

  return areas;
}

function computeOverallConfidence(
  alignments: TerminologyAlignment[],
  disambiguations: DisambiguationResult[],
): number {
  if (alignments.length === 0 && disambiguations.length === 0) return 0.8;

  const scores: number[] = [
    ...alignments.map(a => a.confidence),
    ...disambiguations.map(d => d.confidence),
  ];

  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

// ── Dependency injection interface ───────────────────────────

export interface LanguageExpertDependencies {
  normalizeText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    context?: LanguageContext,
  ): Promise<string>;
  enrichTerminology(
    alignments: TerminologyAlignment[],
    context?: LanguageContext,
  ): Promise<TerminologyAlignment[]>;
  disambiguate(
    originalText: string,
    normalizedText: string,
    alignments: TerminologyAlignment[],
    context?: LanguageContext,
  ): Promise<DisambiguationResult[]>;
}

// ── Error types ──────────────────────────────────────────────

export class LanguageExpertError extends Error {
  constructor(message: string) {
    super(`Language expert workflow failed: ${message}`);
    this.name = 'LanguageExpertError';
  }
}
