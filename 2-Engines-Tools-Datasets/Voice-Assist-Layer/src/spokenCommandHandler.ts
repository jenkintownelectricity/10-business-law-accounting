/**
 * Spoken Command Handler
 * Parses spoken commands into SpokenCommandCandidates.
 * Never executes commands directly — advisory output only.
 */

import { SpokenCommandCandidate } from './types';

const COMMAND_PATTERNS: { pattern: RegExp; action: string; paramExtractor: (match: RegExpMatchArray) => Record<string, string> }[] = [
  {
    pattern: /^(create|add|new)\s+(contract|invoice|matter|entity|task)\s*(?:for\s+(.+))?$/i,
    action: 'create',
    paramExtractor: (m) => ({ object_type: m[2]?.toLowerCase() ?? '', target: m[3] ?? '' }),
  },
  {
    pattern: /^(review|check|look at)\s+(?:the\s+)?(.+)$/i,
    action: 'review',
    paramExtractor: (m) => ({ target: m[2] ?? '' }),
  },
  {
    pattern: /^(note|remember|record)\s+(?:that\s+)?(.+)$/i,
    action: 'note',
    paramExtractor: (m) => ({ content: m[2] ?? '' }),
  },
  {
    pattern: /^(schedule|set deadline|set reminder)\s+(?:for\s+)?(.+)$/i,
    action: 'schedule',
    paramExtractor: (m) => ({ target: m[2] ?? '' }),
  },
  {
    pattern: /^(send|email|notify)\s+(.+)$/i,
    action: 'communicate',
    paramExtractor: (m) => ({ target: m[2] ?? '' }),
  },
];

export class SpokenCommandHandler {
  /**
   * Parse a spoken text into a command candidate.
   * The candidate is advisory — it requires confirmation and is never executed directly.
   */
  parse(sessionId: string, rawText: string): SpokenCommandCandidate {
    const trimmed = rawText.trim();

    for (const { pattern, action, paramExtractor } of COMMAND_PATTERNS) {
      const match = trimmed.match(pattern);
      if (match) {
        return {
          candidate_id: `cmd-${sessionId}-${Date.now()}`,
          session_id: sessionId,
          raw_text: rawText,
          interpreted_action: action,
          confidence: 0.85,
          parameters: paramExtractor(match),
          requires_confirmation: true,
          advisory_only: true,
          parsed_at: new Date().toISOString(),
        };
      }
    }

    // No pattern matched — return as unrecognized candidate
    return {
      candidate_id: `cmd-${sessionId}-${Date.now()}`,
      session_id: sessionId,
      raw_text: rawText,
      interpreted_action: 'unrecognized',
      confidence: 0.2,
      parameters: { raw: trimmed },
      requires_confirmation: true,
      advisory_only: true,
      parsed_at: new Date().toISOString(),
    };
  }
}
