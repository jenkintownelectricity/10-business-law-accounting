/**
 * Language Normalizer
 * Normalizes complex and domain-specific language into standardized forms.
 */

import { LanguageNormalizationPacket, NormalizationTransformation } from './types';

const NORMALIZATION_RULES: { pattern: RegExp; replacement: string; rule: string }[] = [
  { pattern: /\bASAP\b/gi, replacement: 'as soon as possible', rule: 'abbreviation_expansion' },
  { pattern: /\bTBD\b/gi, replacement: 'to be determined', rule: 'abbreviation_expansion' },
  { pattern: /\bRE:\s*/gi, replacement: 'regarding ', rule: 'abbreviation_expansion' },
  { pattern: /\bFYI\b/gi, replacement: 'for your information', rule: 'abbreviation_expansion' },
  { pattern: /\bw\/\b/gi, replacement: 'with', rule: 'shorthand_expansion' },
  { pattern: /\bw\/o\b/gi, replacement: 'without', rule: 'shorthand_expansion' },
  { pattern: /\bn\/a\b/gi, replacement: 'not applicable', rule: 'shorthand_expansion' },
  { pattern: /\bpls\b/gi, replacement: 'please', rule: 'informal_expansion' },
  { pattern: /\bthx\b/gi, replacement: 'thanks', rule: 'informal_expansion' },
  { pattern: /\bbtw\b/gi, replacement: 'by the way', rule: 'informal_expansion' },
  { pattern: /\s{2,}/g, replacement: ' ', rule: 'whitespace_normalization' },
];

export class LanguageNormalizer {
  /**
   * Normalize text by applying all normalization rules.
   */
  normalize(text: string): LanguageNormalizationPacket {
    const transformations: NormalizationTransformation[] = [];
    let normalized = text;

    for (const { pattern, replacement, rule } of NORMALIZATION_RULES) {
      const match = normalized.match(pattern);
      if (match) {
        for (const m of match) {
          transformations.push({
            original: m,
            normalized: replacement,
            rule_applied: rule,
            confidence: 0.95,
          });
        }
        normalized = normalized.replace(pattern, replacement);
      }
    }

    const confidence = transformations.length === 0
      ? 1.0
      : transformations.reduce((sum, t) => sum + t.confidence, 0) / transformations.length;

    return {
      packet_id: `norm-${Date.now()}`,
      original_text: text,
      normalized_text: normalized.trim(),
      transformations,
      confidence,
      advisory_only: true,
      normalized_at: new Date().toISOString(),
    };
  }
}
