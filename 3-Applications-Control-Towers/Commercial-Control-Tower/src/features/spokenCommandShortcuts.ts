/**
 * Spoken Command Shortcuts
 * Voice command shortcuts for the Commercial Control Tower.
 * All commands produce candidates requiring confirmation for sovereign actions.
 */

export interface SpokenCommandDefinition {
  pattern: string;
  intent: string;
  touches_domain_truth: boolean;
  requires_review: boolean;
  description: string;
}

export const SPOKEN_COMMANDS: SpokenCommandDefinition[] = [
  {
    pattern: 'show matter *',
    intent: 'navigate_to_matter',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Navigate to a specific matter by name',
  },
  {
    pattern: 'show contracts',
    intent: 'navigate_to_contracts',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Navigate to contracts page',
  },
  {
    pattern: 'show obligations',
    intent: 'navigate_to_obligations',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Navigate to obligations page',
  },
  {
    pattern: 'dictate note',
    intent: 'start_dictation',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Start dictation mode for note capture',
  },
  {
    pattern: 'start listening',
    intent: 'start_iron_ear',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Enter Iron Ear listening mode',
  },
  {
    pattern: 'stop listening',
    intent: 'stop_iron_ear',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Exit Iron Ear listening mode',
  },
  {
    pattern: 'read back summary',
    intent: 'readback_summary',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Read back current matter summary',
  },
  {
    pattern: 'show due today',
    intent: 'show_due_today',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Show items due today',
  },
  {
    pattern: 'search *',
    intent: 'global_search',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Open search with spoken query',
  },
  {
    pattern: 'create matter *',
    intent: 'create_matter',
    touches_domain_truth: true,
    requires_review: true,
    description: 'Create a new matter (requires review)',
  },
  {
    pattern: 'approve *',
    intent: 'approve_item',
    touches_domain_truth: true,
    requires_review: true,
    description: 'Approve a review queue item (requires confirmation)',
  },
  {
    pattern: 'show review queue',
    intent: 'navigate_to_review_queue',
    touches_domain_truth: false,
    requires_review: false,
    description: 'Navigate to review queue',
  },
];

export function matchSpokenCommand(transcript: string): SpokenCommandDefinition | null {
  const normalized = transcript.toLowerCase().trim();
  for (const cmd of SPOKEN_COMMANDS) {
    const pattern = cmd.pattern.replace('*', '(.+)');
    const regex = new RegExp(`^${pattern}$`, 'i');
    if (regex.test(normalized)) return cmd;
  }
  return null;
}

export function parseCommandArgs(transcript: string, command: SpokenCommandDefinition): string | null {
  const normalized = transcript.toLowerCase().trim();
  const pattern = cmd.pattern.replace('*', '(.+)');
  const regex = new RegExp(`^${pattern}$`, 'i');
  const match = normalized.match(regex);
  return match ? match[1] : null;
}
