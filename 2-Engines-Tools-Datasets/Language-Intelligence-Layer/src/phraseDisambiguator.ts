/**
 * Phrase Disambiguator
 * Disambiguates phrases that could apply to multiple kernels.
 * For example, "deal" could be a CommercialMatter (business) or a LegalContract (law).
 */

import { PhraseDisambiguation, PhraseInterpretation } from './types';

interface DisambiguationRule {
  trigger: string;
  interpretations: PhraseInterpretation[];
}

const DISAMBIGUATION_RULES: DisambiguationRule[] = [
  {
    trigger: 'deal',
    interpretations: [
      { interpretation: 'Commercial opportunity or matter', target_kernel: 'business', confidence: 0.6, reasoning: '"Deal" commonly refers to a business opportunity or commercial matter' },
      { interpretation: 'Legal agreement or contract', target_kernel: 'law', confidence: 0.3, reasoning: '"Deal" can refer to a legal agreement' },
      { interpretation: 'Financial transaction', target_kernel: 'accounting', confidence: 0.1, reasoning: '"Deal" occasionally refers to a financial transaction' },
    ],
  },
  {
    trigger: 'exposure',
    interpretations: [
      { interpretation: 'Business risk exposure', target_kernel: 'business', confidence: 0.4, reasoning: '"Exposure" often refers to business risk' },
      { interpretation: 'Legal liability exposure', target_kernel: 'law', confidence: 0.3, reasoning: '"Exposure" can mean legal liability' },
      { interpretation: 'Financial exposure amount', target_kernel: 'accounting', confidence: 0.3, reasoning: '"Exposure" can mean financial exposure' },
    ],
  },
  {
    trigger: 'obligation',
    interpretations: [
      { interpretation: 'Legal obligation or duty', target_kernel: 'law', confidence: 0.7, reasoning: '"Obligation" primarily refers to legal duties' },
      { interpretation: 'Financial obligation or liability', target_kernel: 'accounting', confidence: 0.2, reasoning: '"Obligation" can mean financial liability' },
      { interpretation: 'Business commitment', target_kernel: 'business', confidence: 0.1, reasoning: '"Obligation" occasionally means a business commitment' },
    ],
  },
  {
    trigger: 'compliance',
    interpretations: [
      { interpretation: 'Legal/regulatory compliance', target_kernel: 'law', confidence: 0.6, reasoning: '"Compliance" primarily relates to legal requirements' },
      { interpretation: 'Tax compliance', target_kernel: 'accounting', confidence: 0.3, reasoning: '"Compliance" can refer to tax filing compliance' },
      { interpretation: 'Business policy compliance', target_kernel: 'business', confidence: 0.1, reasoning: '"Compliance" occasionally refers to internal business policies' },
    ],
  },
  {
    trigger: 'liability',
    interpretations: [
      { interpretation: 'Legal liability', target_kernel: 'law', confidence: 0.5, reasoning: '"Liability" often refers to legal exposure' },
      { interpretation: 'Financial liability', target_kernel: 'accounting', confidence: 0.4, reasoning: '"Liability" is a core accounting concept' },
      { interpretation: 'Business risk liability', target_kernel: 'business', confidence: 0.1, reasoning: '"Liability" can be a business risk factor' },
    ],
  },
];

export class PhraseDisambiguator {
  /**
   * Disambiguate a phrase that could apply to multiple domains.
   */
  disambiguate(phrase: string): PhraseDisambiguation {
    const lower = phrase.toLowerCase();
    let bestMatch: DisambiguationRule | null = null;

    for (const rule of DISAMBIGUATION_RULES) {
      if (lower.includes(rule.trigger)) {
        bestMatch = rule;
        break;
      }
    }

    if (!bestMatch) {
      return {
        disambiguation_id: `disamb-${Date.now()}`,
        input_phrase: phrase,
        interpretations: [
          {
            interpretation: 'General business context',
            target_kernel: 'business',
            confidence: 0.5,
            reasoning: 'No specific disambiguation rule matched; defaulting to business context',
          },
        ],
        recommended_interpretation: 'General business context',
        confidence: 0.3,
        advisory_only: true,
        disambiguated_at: new Date().toISOString(),
      };
    }

    const sorted = [...bestMatch.interpretations].sort((a, b) => b.confidence - a.confidence);

    return {
      disambiguation_id: `disamb-${Date.now()}`,
      input_phrase: phrase,
      interpretations: sorted,
      recommended_interpretation: sorted[0].interpretation,
      confidence: sorted[0].confidence,
      advisory_only: true,
      disambiguated_at: new Date().toISOString(),
    };
  }
}
