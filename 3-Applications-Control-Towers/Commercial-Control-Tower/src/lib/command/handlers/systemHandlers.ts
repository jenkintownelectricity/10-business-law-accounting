/**
 * System Command Handlers
 * Handles system-level commands: replay mode, command help, receipt feed,
 * workspace search, and settings.
 */

import { CommandRegistry, CommandContext, CommandResult } from '../registry';

// --- system.replay ---
CommandRegistry.register({
  id: 'system.replay',
  label: 'Enter Replay Mode',
  category: 'system',
  description: 'Enter replay mode for lineage scrubbing. Mutation commands are disabled during replay.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: true,
  receipt_class: 'REPLAY_REFERENCE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    if (ctx.is_replay_mode) {
      return {
        success: true,
        command_id: 'system.replay',
        message: 'Exited replay mode',
      };
    }
    return {
      success: true,
      command_id: 'system.replay',
      message: 'Entered replay mode. Mutation commands disabled.',
      receipt_id: `rcpt_replay_${Date.now()}`,
    };
  },
});

// --- system.commandHelp ---
CommandRegistry.register({
  id: 'system.commandHelp',
  label: 'Command Help',
  category: 'system',
  description: 'Show the command help panel with all available commands and shortcuts.',
  shortcut: '?',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'system.commandHelp',
      message: 'Command help panel opened',
    };
  },
});

// --- system.receipts ---
CommandRegistry.register({
  id: 'system.receipts',
  label: 'Show Receipt Feed',
  category: 'system',
  description: 'Open the receipt feed showing signal emission history and confirmations.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'system.receipts',
      message: 'Receipt feed opened',
    };
  },
});

// --- system.workspaceSearch ---
CommandRegistry.register({
  id: 'system.workspaceSearch',
  label: 'Workspace Search',
  category: 'system',
  description: 'Activate workspace-wide search across all entities and documents.',
  shortcut: 'Ctrl+Shift+F',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'system.workspaceSearch',
      message: 'Workspace search activated',
    };
  },
});

// --- system.settings ---
CommandRegistry.register({
  id: 'system.settings',
  label: 'Open Settings',
  category: 'system',
  description: 'Open the workstation settings panel.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'system.settings',
      message: 'Settings panel opened',
    };
  },
});
