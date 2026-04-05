/**
 * Terminology Aligner
 * Maps colloquial and informal terms to domain-specific terminology.
 * Suggests which kernel a term most likely belongs to.
 */

import { TerminologyAlignment, KernelRoutingHint, SuggestedKernel } from './types';

interface TermMapping {
  colloquial: string[];
  domain_term: string;
  kernel: string;
}

const TERM_MAPPINGS: TermMapping[] = [
  // Business kernel terms
  { colloquial: ['company', 'firm', 'org', 'organization', 'business'], domain_term: 'BusinessEntity', kernel: 'business' },
  { colloquial: ['supplier', 'vendor', 'provider', 'contractor'], domain_term: 'Vendor', kernel: 'business' },
  { colloquial: ['deal', 'opportunity', 'prospect'], domain_term: 'CommercialMatter', kernel: 'business' },
  { colloquial: ['danger', 'threat', 'exposure'], domain_term: 'BusinessRisk', kernel: 'business' },

  // Law kernel terms
  { colloquial: ['agreement', 'deal', 'contract', 'pact'], domain_term: 'LegalContract', kernel: 'law' },
  { colloquial: ['duty', 'requirement', 'obligation', 'commitment'], domain_term: 'Obligation', kernel: 'law' },
  { colloquial: ['proof', 'evidence', 'documentation', 'exhibit'], domain_term: 'EvidenceItem', kernel: 'law' },
  { colloquial: ['regulation', 'rule', 'compliance', 'standard'], domain_term: 'ComplianceStatus', kernel: 'law' },
  { colloquial: ['lawsuit', 'case', 'litigation', 'dispute'], domain_term: 'LegalMatter', kernel: 'law' },

  // Accounting kernel terms
  { colloquial: ['bill', 'invoice', 'statement', 'charge'], domain_term: 'Invoice', kernel: 'accounting' },
  { colloquial: ['entry', 'posting', 'journal entry', 'ledger entry'], domain_term: 'LedgerEntry', kernel: 'accounting' },
  { colloquial: ['taxes', 'tax', 'irs', 'filing'], domain_term: 'TaxPosture', kernel: 'accounting' },
  { colloquial: ['money', 'funds', 'payment', 'cost', 'price'], domain_term: 'FinancialImpact', kernel: 'accounting' },
  { colloquial: ['reconciliation', 'matching', 'balancing'], domain_term: 'ReconciliationStatus', kernel: 'accounting' },
];

export class TerminologyAligner {
  /**
   * Align a colloquial term to its domain-specific equivalent.
   */
  align(inputTerm: string): TerminologyAlignment {
    const lower = inputTerm.toLowerCase();
    const matches: { mapping: TermMapping; score: number }[] = [];

    for (const mapping of TERM_MAPPINGS) {
      for (const colloquial of mapping.colloquial) {
        if (lower.includes(colloquial) || colloquial.includes(lower)) {
          const score = lower === colloquial ? 1.0 : 0.7;
          matches.push({ mapping, score });
        }
      }
    }

    matches.sort((a, b) => b.score - a.score);
    const best = matches[0];

    if (!best) {
      return {
        alignment_id: `align-${Date.now()}`,
        input_term: inputTerm,
        domain_term: inputTerm,
        target_kernel: 'unknown',
        confidence: 0.1,
        alternatives: [],
        aligned_at: new Date().toISOString(),
      };
    }

    return {
      alignment_id: `align-${Date.now()}`,
      input_term: inputTerm,
      domain_term: best.mapping.domain_term,
      target_kernel: best.mapping.kernel,
      confidence: best.score,
      alternatives: matches.slice(1, 4).map(m => ({
        term: m.mapping.domain_term,
        kernel: m.mapping.kernel,
        confidence: m.score,
      })),
      aligned_at: new Date().toISOString(),
    };
  }

  /**
   * Suggest kernel routing based on terminology analysis.
   */
  suggestKernelRouting(text: string): KernelRoutingHint {
    const lower = text.toLowerCase();
    const kernelScores: Record<string, { score: number; terms: string[] }> = {
      business: { score: 0, terms: [] },
      law: { score: 0, terms: [] },
      accounting: { score: 0, terms: [] },
    };

    for (const mapping of TERM_MAPPINGS) {
      for (const colloquial of mapping.colloquial) {
        if (lower.includes(colloquial)) {
          kernelScores[mapping.kernel].score += 1;
          kernelScores[mapping.kernel].terms.push(colloquial);
        }
      }
    }

    const suggested: SuggestedKernel[] = Object.entries(kernelScores)
      .filter(([_, v]) => v.score > 0)
      .map(([kernel, v]) => ({
        kernel,
        confidence: Math.min(v.score / 3, 1.0),
        matched_terms: v.terms,
        reasoning: `Matched ${v.terms.length} domain term(s): ${v.terms.join(', ')}`,
      }))
      .sort((a, b) => b.confidence - a.confidence);

    const primary = suggested[0]?.kernel ?? 'business';
    const confidence = suggested[0]?.confidence ?? 0.1;

    return {
      hint_id: `hint-${Date.now()}`,
      input_text: text,
      suggested_kernels: suggested,
      primary_kernel: primary,
      confidence,
      advisory_only: true,
      generated_at: new Date().toISOString(),
    };
  }
}
