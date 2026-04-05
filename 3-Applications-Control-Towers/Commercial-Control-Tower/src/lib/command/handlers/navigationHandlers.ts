/**
 * Navigation Command Handlers
 * Handles all workspace navigation commands: overview, matters, contracts,
 * accounting, review queue, lineage, doctrine, and search.
 */

import { CommandRegistry, CommandResult } from '../registry';

// --- nav.overview ---
CommandRegistry.register({
  id: 'nav.overview',
  label: 'Go to Overview',
  category: 'navigation',
  description: 'Navigate to the workspace overview dashboard.',
  shortcut: 'G O',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.overview', message: 'Navigated to overview' };
  },
});

// --- nav.matters ---
CommandRegistry.register({
  id: 'nav.matters',
  label: 'Go to Matters',
  category: 'navigation',
  description: 'Navigate to the matters list and management view.',
  shortcut: 'G M',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.matters', message: 'Navigated to matters' };
  },
});

// --- nav.contracts ---
CommandRegistry.register({
  id: 'nav.contracts',
  label: 'Go to Contracts',
  category: 'navigation',
  description: 'Navigate to the contracts management view.',
  shortcut: 'G C',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.contracts', message: 'Navigated to contracts' };
  },
});

// --- nav.accounting ---
CommandRegistry.register({
  id: 'nav.accounting',
  label: 'Go to Accounting',
  category: 'navigation',
  description: 'Navigate to the accounting and financial ledger view.',
  shortcut: 'G A',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.accounting', message: 'Navigated to accounting' };
  },
});

// --- nav.review ---
CommandRegistry.register({
  id: 'nav.review',
  label: 'Go to Review Queue',
  category: 'navigation',
  description: 'Navigate to the review queue for pending items.',
  shortcut: 'G R',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.review', message: 'Navigated to review queue' };
  },
});

// --- nav.lineage ---
CommandRegistry.register({
  id: 'nav.lineage',
  label: 'Go to Lineage View',
  category: 'navigation',
  description: 'Navigate to the lineage and audit trail view.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.lineage', message: 'Navigated to lineage view' };
  },
});

// --- nav.doctrine ---
CommandRegistry.register({
  id: 'nav.doctrine',
  label: 'Open Doctrine Pane',
  category: 'navigation',
  description: 'Open the doctrine pane in read-only mode. Contextual to current entity if applicable.',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'TRANSFER',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.doctrine', message: 'Doctrine pane opened (read-only)' };
  },
});

// --- nav.search ---
CommandRegistry.register({
  id: 'nav.search',
  label: 'Open Search',
  category: 'navigation',
  description: 'Open the workspace search overlay.',
  shortcut: '/',
  trust_class: 'UI_ONLY',
  execution_class: 'IMMEDIATE',
  focus_effect: 'NONE',
  replay_valid: true,
  receipt_class: 'NONE',
  context_requirements: (): boolean => true,
  disabled_reason_resolver: (): string | null => null,
  handler: async (): Promise<CommandResult> => {
    return { success: true, command_id: 'nav.search', message: 'Search overlay opened' };
  },
});
