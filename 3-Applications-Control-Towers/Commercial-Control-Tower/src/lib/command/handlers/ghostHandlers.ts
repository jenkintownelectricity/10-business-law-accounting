/**
 * Ghost Command Handlers
 * Handles ghost layer operations: toggle visibility, promote, dismiss,
 * history trail, and shadow accounting overlay.
 */

import { CommandRegistry, CommandContext, CommandResult } from '../registry';
import { VkbusClient } from '../../vkbus/vkbusClient';

const vkbusClient = new VkbusClient();

// --- ghost.toggle ---
CommandRegistry.register({
  id: 'ghost.toggle',
  label: 'Toggle Ghost Layer',
  category: 'ghost',
  description: 'Show or hide the ghost proposal layer overlay on the current pane.',
  shortcut: 'G G',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: false,
  receipt_class: 'NONE',
  context_requirements: (ctx: CommandContext): boolean => !ctx.is_replay_mode,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.is_replay_mode) return 'Ghost layer disabled in replay mode';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'ghost.toggle',
      message: 'Ghost layer toggled',
    };
  },
});

// --- ghost.promote ---
CommandRegistry.register({
  id: 'ghost.promote',
  label: 'Promote Ghost',
  category: 'ghost',
  description: 'Promote the selected ghost proposal to a live domain object via VKBUS signal.',
  shortcut: 'G P',
  trust_class: 'SIGNAL_REQUIRED',
  execution_class: 'ASYNC_SIGNAL',
  focus_effect: 'NONE',
  replay_valid: false,
  receipt_class: 'EMIT',
  context_requirements: (ctx: CommandContext): boolean => ctx.has_active_ghost && !ctx.is_replay_mode,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.is_replay_mode) return 'Promotion disabled in replay mode';
    if (!ctx.has_active_ghost) return 'No active ghost proposal selected';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    const result = await vkbusClient.promoteGhost(
      ctx.selected_entity_id || '',
      'standard',
      'commercial',
      'operator',
    );
    if (result.success) {
      return {
        success: true,
        command_id: 'ghost.promote',
        message: 'Ghost promoted via VKBUS',
        signal_id: result.signal_id,
        receipt_id: result.receipt_id,
      };
    }
    return {
      success: false,
      command_id: 'ghost.promote',
      error: result.error || 'Ghost promotion failed',
    };
  },
});

// --- ghost.dismiss ---
CommandRegistry.register({
  id: 'ghost.dismiss',
  label: 'Dismiss Ghost',
  category: 'ghost',
  description: 'Dismiss the selected ghost proposal without promotion.',
  shortcut: 'G D',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: false,
  receipt_class: 'NONE',
  context_requirements: (ctx: CommandContext): boolean => ctx.has_active_ghost,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (!ctx.has_active_ghost) return 'No active ghost proposal to dismiss';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    await vkbusClient.dismissGhost(
      ctx.selected_entity_id || '',
      'operator',
    );
    return {
      success: true,
      command_id: 'ghost.dismiss',
      message: 'Ghost dismissed',
    };
  },
});

// --- ghost.history ---
CommandRegistry.register({
  id: 'ghost.history',
  label: 'Ghost History',
  category: 'ghost',
  description: 'Show the history trail of ghost proposals for the current context.',
  shortcut: 'G H',
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
      command_id: 'ghost.history',
      message: 'Ghost history panel opened',
    };
  },
});

// --- ghost.shadow ---
CommandRegistry.register({
  id: 'ghost.shadow',
  label: 'Shadow Accounting Overlay',
  category: 'ghost',
  description: 'Overlay shadow accounting deltas on the current pane. Suppressed in quiet mode.',
  shortcut: 'G S',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: false,
  receipt_class: 'NONE',
  context_requirements: (ctx: CommandContext): boolean => !ctx.is_replay_mode && !ctx.is_quiet_mode,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.is_replay_mode) return 'Shadow overlay disabled in replay mode';
    if (ctx.is_quiet_mode) return 'Shadow advisory suppressed in quiet mode';
    return null;
  },
  handler: async (): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'ghost.shadow',
      message: 'Shadow accounting overlay activated',
    };
  },
});

export { vkbusClient };
