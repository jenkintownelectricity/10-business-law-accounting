/**
 * Slash Command Parser
 *
 * Parses slash commands from the command palette input.
 * Supported commands:
 *   /focus pane <id>
 *   /focus next
 *   /focus prev
 *   /focus lock
 *   /focus queue
 *   /quiet on
 *   /quiet off
 *   /promote selected ghost
 *   /dismiss selected ghost
 *   /ghost toggle
 *   /show receipts
 *   /show lineage
 *   /inspect violation
 */

export interface ParsedCommand {
  valid: boolean;
  handler: string;
  args: Record<string, unknown>;
  raw: string;
  error?: string;
}

const COMMAND_PATTERNS: Array<{
  pattern: RegExp;
  handler: string;
  extractArgs: (match: RegExpMatchArray) => Record<string, unknown>;
}> = [
  {
    pattern: /^\/focus\s+pane\s+(\S+)$/i,
    handler: 'focusPane',
    extractArgs: (m) => ({ paneId: m[1] }),
  },
  {
    pattern: /^\/focus\s+next$/i,
    handler: 'focusNext',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/focus\s+prev$/i,
    handler: 'focusPrev',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/focus\s+lock$/i,
    handler: 'focusLock',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/focus\s+queue$/i,
    handler: 'focusQueue',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/quiet\s+on$/i,
    handler: 'quietOn',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/quiet\s+off$/i,
    handler: 'quietOff',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/promote\s+selected\s+ghost$/i,
    handler: 'ghostPromote',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/dismiss\s+selected\s+ghost$/i,
    handler: 'ghostDismiss',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/ghost\s+toggle$/i,
    handler: 'ghostToggle',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/show\s+receipts$/i,
    handler: 'showReceipts',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/show\s+lineage$/i,
    handler: 'showLineage',
    extractArgs: () => ({}),
  },
  {
    pattern: /^\/inspect\s+violation$/i,
    handler: 'inspectViolation',
    extractArgs: () => ({}),
  },
];

export function parseSlashCommand(input: string): ParsedCommand {
  const trimmed = input.trim();

  if (!trimmed.startsWith('/')) {
    return {
      valid: false,
      handler: '',
      args: {},
      raw: input,
      error: 'Not a slash command',
    };
  }

  for (const { pattern, handler, extractArgs } of COMMAND_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        valid: true,
        handler,
        args: extractArgs(match),
        raw: input,
      };
    }
  }

  return {
    valid: false,
    handler: '',
    args: {},
    raw: input,
    error: `Unknown slash command: ${trimmed}`,
  };
}

export function isSlashCommand(input: string): boolean {
  return input.trim().startsWith('/');
}
