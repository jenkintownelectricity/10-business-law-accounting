// ──────────────────────────────────────────────────────────────
//  LanguageNormalizationService — Text Normalization & Routing
//  Normalizes domain text, aligns terminology, disambiguates
//  phrases, and produces routing hints for kernel assignment.
//  ALL outputs are advisory only — never authoritative.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  LanguageNormalizationPacket,
  TerminologyAlignment,
  DisambiguationResult,
  LanguageFlag,
  KernelDomain,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Types ──────────────────────────────────────────────────────

export interface NormalizeTextRequest {
  input_text: string;
  source_language?: string;
  target_language?: string;
  session_id?: string;
  matter_id?: string;
  requested_by: string;
}

export interface AlignTerminologyRequest {
  text: string;
  target_domain?: KernelDomain;
  requested_by: string;
}

export interface DisambiguatePhraseRequest {
  phrase: string;
  context: string;
  requested_by: string;
}

export interface RoutingHintResult {
  text: string;
  primary_kernel: KernelDomain;
  primary_confidence: number;
  secondary_hints: { kernel: KernelDomain; confidence: number; reason: string }[];
  advisory_only: true;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Domain Terminology Dictionaries ────────────────────────────

const LAW_TERMS: Record<string, string> = {
  'force majeure': 'force majeure (unforeseeable circumstances excusing performance)',
  'indemnification': 'indemnification (obligation to compensate for loss)',
  'indemnify': 'indemnification (obligation to compensate for loss)',
  'liability cap': 'limitation of liability (maximum exposure ceiling)',
  'breach': 'breach of contract (failure to perform contractual obligation)',
  'clause': 'contractual clause (specific provision within an agreement)',
  'governing law': 'governing law (jurisdiction whose laws apply)',
  'due diligence': 'due diligence (comprehensive investigation or audit)',
  'regulatory compliance': 'regulatory compliance (adherence to applicable regulations)',
  'litigation': 'litigation (legal proceedings)',
};

const ACCOUNTING_TERMS: Record<string, string> = {
  'contingent liability': 'contingent liability (potential obligation dependent on future events)',
  'accrual': 'accrual (recognition of revenue/expense when earned/incurred)',
  'depreciation': 'depreciation (allocation of asset cost over useful life)',
  'amortization': 'amortization (gradual reduction of intangible asset value)',
  'write-off': 'write-off (removal of uncollectible receivable from books)',
  'write off': 'write-off (removal of uncollectible receivable from books)',
  'revenue recognition': 'revenue recognition (timing of recording earned revenue)',
  'accounts receivable': 'accounts receivable (amounts owed by customers)',
  'accounts payable': 'accounts payable (amounts owed to vendors)',
  'fiscal year': 'fiscal year (twelve-month reporting period)',
};

const BUSINESS_TERMS: Record<string, string> = {
  'acquisition': 'acquisition (purchase of controlling interest in another entity)',
  'merger': 'merger (combination of two entities into one)',
  'market share': 'market share (percentage of total market held by entity)',
  'stakeholder': 'stakeholder (party with interest in business outcome)',
  'roi': 'return on investment (measure of profitability relative to cost)',
  'cash flow': 'cash flow (movement of money in and out of business)',
  'vendor selection': 'vendor selection (process of evaluating and choosing suppliers)',
  'operational integration': 'operational integration (combining operational processes)',
};

// ── Service Implementation ─────────────────────────────────────

export class LanguageNormalizationService {
  private receiptSequence = 0;

  // ── Normalize Text ─────────────────────────────────────────

  async normalizeText(request: NormalizeTextRequest): Promise<ServiceResult<LanguageNormalizationPacket>> {
    const now = new Date().toISOString();
    const id = `lang_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const alignments = this.findTerminologyAlignments(request.input_text);
    const disambiguations = this.findAmbiguousPhrases(request.input_text);
    const routingHints = this.computeRoutingHints(request.input_text);
    const flags = this.detectFlags(request.input_text, alignments, disambiguations);

    const overallConfidence = alignments.length > 0
      ? alignments.reduce((sum, a) => sum + a.confidence, 0) / alignments.length
      : 0.5;

    const normalizedText = this.applyNormalization(request.input_text, alignments);

    const packet: LanguageNormalizationPacket = {
      id,
      input_text: request.input_text,
      normalized_text: normalizedText,
      source_language: request.source_language ?? 'en',
      target_language: request.target_language ?? 'en',
      terminology_alignments: alignments,
      disambiguation_results: disambiguations,
      routing_hints: routingHints,
      overall_confidence: overallConfidence,
      flags,
      session_id: request.session_id,
      matter_id: request.matter_id,
      created_at: now,
      created_by: request.requested_by,
    };

    const receipt = this.emitReceipt({
      operation: 'language.text_normalized',
      description: `Text normalized: ${alignments.length} alignments, ${disambiguations.length} disambiguations, confidence: ${overallConfidence.toFixed(2)}`,
      actor: request.requested_by,
      target_id: id,
      target_type: 'language_packet',
    });

    return { success: true, data: packet, receipt };
  }

  // ── Align Terminology ──────────────────────────────────────

  async alignTerminology(request: AlignTerminologyRequest): Promise<ServiceResult<TerminologyAlignment[]>> {
    const alignments = this.findTerminologyAlignments(request.text, request.target_domain);

    const receipt = this.emitReceipt({
      operation: 'language.terminology_aligned',
      description: `Terminology aligned: ${alignments.length} terms identified`,
      actor: request.requested_by,
      target_id: 'terminology',
      target_type: 'language_alignment',
    });

    return { success: true, data: alignments, receipt };
  }

  // ── Disambiguate Phrase ────────────────────────────────────

  async disambiguatePhrase(request: DisambiguatePhraseRequest): Promise<ServiceResult<DisambiguationResult>> {
    const result = this.performDisambiguation(request.phrase, request.context);

    const receipt = this.emitReceipt({
      operation: 'language.phrase_disambiguated',
      description: `Phrase disambiguated: "${request.phrase}" -> ${result.selected_domain} (confidence: ${result.confidence.toFixed(2)})`,
      actor: request.requested_by,
      target_id: 'disambiguation',
      target_type: 'language_disambiguation',
    });

    return { success: true, data: result, receipt };
  }

  // ── Routing Hints (Advisory Only) ──────────────────────────

  async routeToKernel(text: string, requestedBy: string): Promise<ServiceResult<RoutingHintResult>> {
    const hints = this.computeRoutingHints(text);

    const primary = hints.length > 0 ? hints[0] : { kernel: 'business' as KernelDomain, relevance_score: 0.33, reason: 'Default routing', key_terms: [] };

    const result: RoutingHintResult = {
      text,
      primary_kernel: primary.kernel,
      primary_confidence: primary.relevance_score,
      secondary_hints: hints.slice(1).map(h => ({
        kernel: h.kernel,
        confidence: h.relevance_score,
        reason: h.reason,
      })),
      advisory_only: true,
    };

    const receipt = this.emitReceipt({
      operation: 'language.routing_hint_produced',
      description: `Routing hint: primary=${primary.kernel} (${primary.relevance_score.toFixed(2)}) — ADVISORY ONLY`,
      actor: requestedBy,
      target_id: 'routing',
      target_type: 'language_routing',
    });

    return { success: true, data: result, receipt };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private findTerminologyAlignments(text: string, targetDomain?: KernelDomain): TerminologyAlignment[] {
    const lower = text.toLowerCase();
    const alignments: TerminologyAlignment[] = [];

    const dictionaries: { domain: KernelDomain; terms: Record<string, string> }[] = [
      { domain: 'law', terms: LAW_TERMS },
      { domain: 'accounting', terms: ACCOUNTING_TERMS },
      { domain: 'business', terms: BUSINESS_TERMS },
    ];

    for (const { domain, terms } of dictionaries) {
      if (targetDomain && domain !== targetDomain) continue;
      for (const [term, normalized] of Object.entries(terms)) {
        if (lower.includes(term)) {
          alignments.push({
            original_term: term,
            normalized_term: normalized,
            domain,
            confidence: 0.9,
            alternatives: [],
          });
        }
      }
    }

    return alignments;
  }

  private findAmbiguousPhrases(text: string): DisambiguationResult[] {
    const lower = text.toLowerCase();
    const results: DisambiguationResult[] = [];

    // Known ambiguous patterns
    const ambiguousPatterns = [
      { pattern: 'account for', domains: ['accounting', 'business'] as KernelDomain[], note: 'Could mean financial recording or general consideration' },
      { pattern: 'exposure', domains: ['law', 'accounting'] as KernelDomain[], note: 'Could mean legal liability or financial risk amount' },
      { pattern: 'material', domains: ['law', 'accounting'] as KernelDomain[], note: 'Could mean legally significant or financially significant' },
      { pattern: 'provision', domains: ['law', 'accounting'] as KernelDomain[], note: 'Could mean contractual clause or financial reserve' },
      { pattern: 'settlement', domains: ['law', 'accounting'] as KernelDomain[], note: 'Could mean legal resolution or payment processing' },
      { pattern: 'default', domains: ['law', 'accounting'] as KernelDomain[], note: 'Could mean contractual breach or loan non-payment' },
    ];

    for (const { pattern, domains, note } of ambiguousPatterns) {
      if (lower.includes(pattern)) {
        results.push({
          ambiguous_phrase: pattern,
          context: text.slice(Math.max(0, lower.indexOf(pattern) - 40), lower.indexOf(pattern) + pattern.length + 40),
          selected_interpretation: note,
          selected_domain: domains[0],
          confidence: 0.6,
          reasoning: `"${pattern}" appears in context that could relate to ${domains.join(' or ')}`,
          alternatives: domains.slice(1).map(d => ({
            term: pattern,
            domain: d,
            confidence: 0.4,
            context_hint: `Alternative interpretation in ${d} domain`,
          })),
          requires_practitioner_confirmation: true,
        });
      }
    }

    return results;
  }

  private computeRoutingHints(text: string): Array<{ kernel: KernelDomain; relevance_score: number; reason: string; key_terms: string[] }> {
    const lower = text.toLowerCase();

    const lawKeywords = ['contract', 'legal', 'clause', 'regulation', 'compliance', 'indemnif', 'liability', 'litigation', 'court', 'statute', 'force majeure', 'breach'];
    const acctKeywords = ['invoice', 'payment', 'tax', 'accounting', 'financial', 'ledger', 'expense', 'revenue', 'depreciation', 'amortization', 'accrual', 'fiscal'];
    const bizKeywords = ['business', 'strategy', 'client', 'vendor', 'operation', 'commercial', 'market', 'acquisition', 'stakeholder', 'capacity', 'timeline'];

    const lawMatches = lawKeywords.filter(k => lower.includes(k));
    const acctMatches = acctKeywords.filter(k => lower.includes(k));
    const bizMatches = bizKeywords.filter(k => lower.includes(k));

    const total = lawMatches.length + acctMatches.length + bizMatches.length;
    if (total === 0) return [];

    const hints: Array<{ kernel: KernelDomain; relevance_score: number; reason: string; key_terms: string[] }> = [];

    if (lawMatches.length > 0) {
      hints.push({
        kernel: 'law',
        relevance_score: lawMatches.length / total,
        reason: `Legal terms detected: ${lawMatches.join(', ')}`,
        key_terms: lawMatches,
      });
    }
    if (acctMatches.length > 0) {
      hints.push({
        kernel: 'accounting',
        relevance_score: acctMatches.length / total,
        reason: `Accounting terms detected: ${acctMatches.join(', ')}`,
        key_terms: acctMatches,
      });
    }
    if (bizMatches.length > 0) {
      hints.push({
        kernel: 'business',
        relevance_score: bizMatches.length / total,
        reason: `Business terms detected: ${bizMatches.join(', ')}`,
        key_terms: bizMatches,
      });
    }

    hints.sort((a, b) => b.relevance_score - a.relevance_score);
    return hints;
  }

  private performDisambiguation(phrase: string, context: string): DisambiguationResult {
    const hints = this.computeRoutingHints(`${phrase} ${context}`);
    const primary = hints[0];

    return {
      ambiguous_phrase: phrase,
      context,
      selected_interpretation: `Interpreted in ${primary?.kernel ?? 'business'} domain context`,
      selected_domain: primary?.kernel ?? 'business',
      confidence: primary?.relevance_score ?? 0.33,
      reasoning: primary?.reason ?? 'No strong domain signals detected',
      alternatives: hints.slice(1).map(h => ({
        term: phrase,
        domain: h.kernel,
        confidence: h.relevance_score,
        context_hint: h.reason,
      })),
      requires_practitioner_confirmation: true,
    };
  }

  private applyNormalization(text: string, alignments: TerminologyAlignment[]): string {
    let normalized = text;
    for (const alignment of alignments) {
      const regex = new RegExp(alignment.original_term, 'gi');
      normalized = normalized.replace(regex, alignment.normalized_term);
    }
    return normalized;
  }

  private detectFlags(
    text: string,
    alignments: TerminologyAlignment[],
    disambiguations: DisambiguationResult[]
  ): LanguageFlag[] {
    const flags: LanguageFlag[] = [];

    const lowConfidence = alignments.filter(a => a.confidence < 0.7);
    if (lowConfidence.length > 0) {
      flags.push({
        flag_type: 'low_confidence',
        description: `${lowConfidence.length} terminology alignments have low confidence`,
        affected_text: lowConfidence.map(a => a.original_term).join(', '),
        suggested_action: 'Practitioner should review flagged terms',
      });
    }

    if (disambiguations.length > 0) {
      flags.push({
        flag_type: 'multiple_interpretations',
        description: `${disambiguations.length} ambiguous phrases detected`,
        affected_text: disambiguations.map(d => d.ambiguous_phrase).join(', '),
        suggested_action: 'Practitioner should confirm intended interpretation',
      });
    }

    if (alignments.length === 0 && text.length > 50) {
      flags.push({
        flag_type: 'missing_context',
        description: 'No domain-specific terminology detected in text',
        affected_text: text.slice(0, 100),
        suggested_action: 'Additional context may be needed for accurate routing',
      });
    }

    // Check for cross-domain collisions
    const domains = new Set(alignments.map(a => a.domain));
    if (domains.size >= 3) {
      flags.push({
        flag_type: 'domain_collision',
        description: 'Text contains terms from all three domains — may need cross-domain review',
        affected_text: text.slice(0, 100),
        suggested_action: 'Route to orchestrator for multi-kernel assessment',
      });
    }

    return flags;
  }

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: 'language_normalization',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'language_layer',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: 'orchestrator',
      previous_state: null,
      new_state: null,
      payload_hash: `sha256_${Date.now()}`,
      parent_receipt_id: null,
      related_receipt_ids: [],
      timestamp: now,
      replay_sequence: this.receiptSequence,
      idempotency_key: `${params.operation}_${params.target_id}_${this.receiptSequence}`,
      notes: '',
      created_at: now,
      updated_at: now,
      status: 'emitted',
    };
  }
}
