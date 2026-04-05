/**
 * Focus Command Handlers
 * Handles all focus-related operator commands: quiet mode, locked review,
 * focus transfer, and evidence pinning.
 */

import { CommandRegistry, CommandContext, CommandResult } from '../registry';
import { OperatorFocusStore } from '../../focus/operatorFocusStore';

const focusStore = new OperatorFocusStore();

// --- focus.quiet.on ---
CommandRegistry.register({
  id: 'focus.quiet.on',
  label: 'Enable Quiet Mode',
  category: 'focus',
  description: 'Suppress advisory and non-critical notifications. Only critical violations break through.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'QUIET_TOGGLE',
  replay_valid: false,
  receipt_class: 'TRANSIENT',
  context_requirements: (ctx: CommandContext): boolean => !ctx.is_quiet_mode,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.is_quiet_mode) return 'Quiet mode is already enabled';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    focusStore.toggleQuietMode();
    return { success: true, command_id: 'focus.quiet.on', message: 'Quiet mode enabled' };
  },
});

// --- focus.quiet.off ---
CommandRegistry.register({
  id: 'focus.quiet.off',
  label: 'Disable Quiet Mode',
  category: 'focus',
  description: 'Re-enable advisory and non-critical notifications.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'QUIET_TOGGLE',
  replay_valid: false,
  receipt_class: 'TRANSIENT',
  context_requirements: (ctx: CommandContext): boolean => ctx.is_quiet_mode,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (!ctx.is_quiet_mode) return 'Quiet mode is already disabled';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    focusStore.toggleQuietMode();
    return { success: true, command_id: 'focus.quiet.off', message: 'Quiet mode disabled' };
  },
});

// --- focus.lockedReview.on ---
CommandRegistry.register({
  id: 'focus.lockedReview.on',
  label: 'Enter Locked Review',
  category: 'focus',
  description: 'Lock focus to the current pane for uninterrupted review. Focus transfers are blocked.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'LOCK',
  replay_valid: false,
  receipt_class: 'TRANSIENT',
  context_requirements: (ctx: CommandContext): boolean => !ctx.is_locked_review && ctx.active_pane_id !== null,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.is_locked_review) return 'Already in locked review mode';
    if (ctx.active_pane_id === null) return 'No active pane to lock';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    focusStore.enterLockedReview();
    return { success: true, command_id: 'focus.lockedReview.on', message: 'Locked review mode entered' };
  },
});

// --- focus.lockedReview.off ---
CommandRegistry.register({
  id: 'focus.lockedReview.off',
  label: 'Exit Locked Review',
  category: 'focus',
  description: 'Unlock focus and allow normal pane transitions.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'UNLOCK',
  replay_valid: false,
  receipt_class: 'TRANSIENT',
  context_requirements: (ctx: CommandContext): boolean => ctx.is_locked_review,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (!ctx.is_locked_review) return 'Not in locked review mode';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    focusStore.exitLockedReview();
    return { success: true, command_id: 'focus.lockedReview.off', message: 'Locked review mode exited' };
  },
});

// --- focus.transfer.next ---
CommandRegistry.register({
  id: 'focus.transfer.next',
  label: 'Focus Next Pane',
  category: 'focus',
  description: 'Transfer primary focus to the next pane in the workstation layout.',
  shortcut: 'Tab',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (ctx: CommandContext): boolean => !ctx.is_locked_review,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.is_locked_review) return 'Focus transfer blocked during locked review';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    const transition = focusStore.focusNext();
    if (transition) {
      return { success: true, command_id: 'focus.transfer.next', message: `Focus transferred to ${transition.to_pane}` };
    }
    return { success: false, command_id: 'focus.transfer.next', error: 'No pane to transfer focus to' };
  },
});

// --- focus.transfer.prev ---
CommandRegistry.register({
  id: 'focus.transfer.prev',
  label: 'Focus Previous Pane',
  category: 'focus',
  description: 'Transfer primary focus to the previous pane in the workstation layout.',
  shortcut: 'Shift+Tab',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (ctx: CommandContext): boolean => !ctx.is_locked_review,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.is_locked_review) return 'Focus transfer blocked during locked review';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    const transition = focusStore.focusPrev();
    if (transition) {
      return { success: true, command_id: 'focus.transfer.prev', message: `Focus transferred to ${transition.to_pane}` };
    }
    return { success: false, command_id: 'focus.transfer.prev', error: 'No pane to transfer focus to' };
  },
});

// --- focus.pinEvidence ---
CommandRegistry.register({
  id: 'focus.pinEvidence',
  label: 'Pin Evidence',
  category: 'focus',
  description: 'Pin the currently selected evidence to the workstation for persistent reference.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: false,
  receipt_class: 'TRANSIENT',
  context_requirements: (ctx: CommandContext): boolean => ctx.selected_entity_id !== null && ctx.has_active_evidence,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (ctx.selected_entity_id === null) return 'No entity selected to pin';
    if (!ctx.has_active_evidence) return 'No active evidence available';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'focus.pinEvidence',
      message: `Evidence ${ctx.selected_entity_id} pinned`,
      receipt_id: `rcpt_pin_${Date.now()}`,
    };
  },
});

// --- focus.unpinEvidence ---
CommandRegistry.register({
  id: 'focus.unpinEvidence',
  label: 'Unpin Evidence',
  category: 'focus',
  description: 'Remove the pinned evidence from the workstation.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: false,
  receipt_class: 'TRANSIENT',
  context_requirements: (ctx: CommandContext): boolean => ctx.has_active_evidence,
  disabled_reason_resolver: (ctx: CommandContext): string | null => {
    if (!ctx.has_active_evidence) return 'No pinned evidence to remove';
    return null;
  },
  handler: async (ctx: CommandContext): Promise<CommandResult> => {
    return {
      success: true,
      command_id: 'focus.unpinEvidence',
      message: 'Evidence unpinned',
      receipt_id: `rcpt_unpin_${Date.now()}`,
    };
  },
});

export { focusStore };
