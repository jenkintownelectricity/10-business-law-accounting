/**
 * Language Intelligence Layer — Main Entry Point
 * Non-sovereign layer for language normalization and disambiguation.
 * Reference: 10-Language-OS
 *
 * All output is advisory. Nothing produced here modifies domain truth directly.
 */

import { LanguageNormalizationPacket, TerminologyAlignment, PhraseDisambiguation, KernelRoutingHint } from './types';
import { LanguageNormalizer } from './languageNormalizer';
import { TerminologyAligner } from './terminologyAligner';
import { PhraseDisambiguator } from './phraseDisambiguator';

export class LanguageIntelligenceLayer {
  readonly layerId = 'language-intelligence' as const;
  readonly trustLevel = 'NON_SOVEREIGN' as const;
  readonly advisoryOnly = true as const;

  private readonly normalizer = new LanguageNormalizer();
  private readonly aligner = new TerminologyAligner();
  private readonly disambiguator = new PhraseDisambiguator();

  /**
   * Normalize input text for domain processing.
   */
  normalize(text: string): LanguageNormalizationPacket {
    return this.normalizer.normalize(text);
  }

  /**
   * Align a term to domain-specific terminology.
   */
  alignTerm(term: string): TerminologyAlignment {
    return this.aligner.align(term);
  }

  /**
   * Disambiguate a phrase that could apply to multiple kernels.
   */
  disambiguate(phrase: string): PhraseDisambiguation {
    return this.disambiguator.disambiguate(phrase);
  }

  /**
   * Suggest kernel routing based on language analysis.
   */
  suggestRouting(text: string): KernelRoutingHint {
    return this.aligner.suggestKernelRouting(text);
  }

  /**
   * Full pipeline: normalize, align terminology, disambiguate, and suggest routing.
   */
  process(text: string): {
    normalization: LanguageNormalizationPacket;
    routing: KernelRoutingHint;
  } {
    const normalization = this.normalize(text);
    const routing = this.suggestRouting(normalization.normalized_text);
    return { normalization, routing };
  }
}
