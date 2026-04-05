/**
 * Spoken Command Shortcuts
 * Maps common voice commands to CCT actions.
 *
 * NON-SOVEREIGN: Voice commands are captured by the Voice Assist Layer
 * and routed here for UI action dispatch. All commands that modify
 * kernel-owned data must pass through sovereign kernel typing before
 * taking effect. Navigation and UI-only commands execute immediately.
 */

export interface SpokenCommandDefinition {
  command_id: string;
  phrases: string[];
  action: SpokenCommandAction;
  requires_kernel_typing: boolean;
  description: string;
}

export type SpokenCommandAction =
  | { type: 'navigate'; target: string }
  | { type: 'toggle_focus_mode' }
  | { type: 'open_command_palette' }
  | { type: 'open_search'; query?: string }
  | { type: 'create_draft'; entity_type: string; prefill?: Record<string, unknown> }
  | { type: 'start_dictation'; context?: string }
  | { type: 'stop_session' }
  | { type: 'read_back'; target: string };

export interface SpokenCommandResult {
  command_id: string;
  matched_phrase: string;
  action_dispatched: SpokenCommandAction;
  requires_kernel_typing: boolean;
  executed_at: string;
}

/**
 * Built-in spoken command definitions for the CCT.
 * Navigation and UI commands do not require kernel typing.
 * Data-modifying commands always require kernel typing.
 */
const BUILT_IN_COMMANDS: SpokenCommandDefinition[] = [
  // Navigation commands (immediate, no kernel typing)
  {
    command_id: 'nav-overview',
    phrases: ['go to overview', 'show overview', 'open dashboard', 'show dashboard'],
    action: { type: 'navigate', target: '/overview' },
    requires_kernel_typing: false,
    description: 'Navigate to the overview dashboard',
  },
  {
    command_id: 'nav-matters',
    phrases: ['go to matters', 'show matters', 'open matters'],
    action: { type: 'navigate', target: '/matters' },
    requires_kernel_typing: false,
    description: 'Navigate to matters list',
  },
  {
    command_id: 'nav-contracts',
    phrases: ['go to contracts', 'show contracts', 'open contracts'],
    action: { type: 'navigate', target: '/contracts' },
    requires_kernel_typing: false,
    description: 'Navigate to contracts list',
  },
  {
    command_id: 'nav-obligations',
    phrases: ['go to obligations', 'show obligations', 'open obligations'],
    action: { type: 'navigate', target: '/obligations' },
    requires_kernel_typing: false,
    description: 'Navigate to obligations tracker',
  },
  {
    command_id: 'nav-deadlines',
    phrases: ['go to deadlines', 'show deadlines', 'open deadlines'],
    action: { type: 'navigate', target: '/deadlines' },
    requires_kernel_typing: false,
    description: 'Navigate to deadlines view',
  },
  {
    command_id: 'nav-voice',
    phrases: ['go to voice', 'open voice workspace', 'show voice'],
    action: { type: 'navigate', target: '/voice' },
    requires_kernel_typing: false,
    description: 'Navigate to voice workspace',
  },

  // UI toggle commands (immediate)
  {
    command_id: 'toggle-focus',
    phrases: ['focus mode', 'toggle focus', 'enter focus mode', 'exit focus mode'],
    action: { type: 'toggle_focus_mode' },
    requires_kernel_typing: false,
    description: 'Toggle focus mode on the current page',
  },
  {
    command_id: 'open-palette',
    phrases: ['command palette', 'open commands', 'show commands'],
    action: { type: 'open_command_palette' },
    requires_kernel_typing: false,
    description: 'Open the command palette',
  },
  {
    command_id: 'open-search',
    phrases: ['search', 'open search', 'find'],
    action: { type: 'open_search' },
    requires_kernel_typing: false,
    description: 'Open the search panel',
  },

  // Draft creation commands (require kernel typing)
  {
    command_id: 'create-task',
    phrases: ['create a task', 'new task', 'add task'],
    action: { type: 'create_draft', entity_type: 'task' },
    requires_kernel_typing: true,
    description: 'Create a draft task (requires kernel typing before activation)',
  },
  {
    command_id: 'create-note',
    phrases: ['create a note', 'new note', 'add note', 'take a note'],
    action: { type: 'create_draft', entity_type: 'note' },
    requires_kernel_typing: true,
    description: 'Create a draft note (requires kernel typing before saving)',
  },

  // Voice session commands
  {
    command_id: 'start-dictation',
    phrases: ['start dictation', 'begin dictation', 'dictate'],
    action: { type: 'start_dictation' },
    requires_kernel_typing: false,
    description: 'Start a dictation session',
  },
  {
    command_id: 'stop-session',
    phrases: ['stop listening', 'stop session', 'end session', 'stop dictation'],
    action: { type: 'stop_session' },
    requires_kernel_typing: false,
    description: 'Stop the current voice session',
  },

  // Read-back commands
  {
    command_id: 'read-back-matter',
    phrases: ['read back matter', 'read this matter', 'summarize matter'],
    action: { type: 'read_back', target: 'current_matter' },
    requires_kernel_typing: false,
    description: 'Read back the current matter summary',
  },
];

export class SpokenCommandShortcuts {
  private commands: SpokenCommandDefinition[];

  constructor(customCommands?: SpokenCommandDefinition[]) {
    this.commands = [...BUILT_IN_COMMANDS, ...(customCommands || [])];
  }

  /**
   * Match a spoken phrase to a registered command.
   * Uses normalized substring matching.
   */
  matchCommand(spokenPhrase: string): SpokenCommandResult | null {
    const normalized = spokenPhrase.toLowerCase().trim();

    for (const cmd of this.commands) {
      for (const phrase of cmd.phrases) {
        if (normalized.includes(phrase) || phrase.includes(normalized)) {
          return {
            command_id: cmd.command_id,
            matched_phrase: phrase,
            action_dispatched: cmd.action,
            requires_kernel_typing: cmd.requires_kernel_typing,
            executed_at: new Date().toISOString(),
          };
        }
      }
    }

    return null;
  }

  /**
   * Get all registered commands for display in help or palette.
   */
  getAllCommands(): SpokenCommandDefinition[] {
    return [...this.commands];
  }

  /**
   * Register a custom spoken command.
   */
  registerCommand(command: SpokenCommandDefinition): void {
    this.commands.push(command);
  }
}
