/**
 * Command Registry
 *
 * Registry of all available commands including focus commands,
 * ghost commands, and navigation commands.
 */

export type CommandCategory = 'focus' | 'ghost' | 'navigation' | 'system';

export interface RegisteredCommand {
  id: string;
  label: string;
  description: string;
  category: CommandCategory;
  shortcut?: string;
  handler: string; // reference to handler function name in commandExecutor
  requiresFocusLevel?: string;
  args?: Record<string, unknown>;
}

const COMMAND_REGISTRY: RegisteredCommand[] = [
  // Focus commands
  {
    id: 'focus.next',
    label: 'Focus Next Pane',
    description: 'Move primary focus to the next pane in order',
    category: 'focus',
    shortcut: 'Ctrl+Shift+F',
    handler: 'focusNext',
  },
  {
    id: 'focus.prev',
    label: 'Focus Previous Pane',
    description: 'Move primary focus to the previous pane in order',
    category: 'focus',
    shortcut: 'Ctrl+Shift+B',
    handler: 'focusPrev',
  },
  {
    id: 'focus.lock',
    label: 'Lock Focus',
    description: 'Lock the current pane in LOCKED_REVIEW mode',
    category: 'focus',
    shortcut: 'Ctrl+Shift+L',
    handler: 'focusLock',
  },
  {
    id: 'focus.quiet.on',
    label: 'Quiet Mode On',
    description: 'Enable quiet mode - suppress advisory notifications',
    category: 'focus',
    shortcut: 'Ctrl+Shift+Q',
    handler: 'quietOn',
  },
  {
    id: 'focus.quiet.off',
    label: 'Quiet Mode Off',
    description: 'Disable quiet mode - resume advisory notifications',
    category: 'focus',
    handler: 'quietOff',
  },
  {
    id: 'focus.queue',
    label: 'Show Focus Queue',
    description: 'Display the attention queue',
    category: 'focus',
    handler: 'focusQueue',
  },
  // Ghost commands
  {
    id: 'ghost.toggle',
    label: 'Toggle Ghost Layer',
    description: 'Show or hide the ghost overlay layer',
    category: 'ghost',
    shortcut: 'Ctrl+G',
    handler: 'ghostToggle',
  },
  {
    id: 'ghost.promote',
    label: 'Promote Selected Ghost',
    description: 'Promote the currently selected ghost proposal via VKBUS',
    category: 'ghost',
    shortcut: 'Ctrl+Shift+P',
    handler: 'ghostPromote',
  },
  {
    id: 'ghost.dismiss',
    label: 'Dismiss Selected Ghost',
    description: 'Dismiss the currently selected ghost proposal',
    category: 'ghost',
    shortcut: 'Ctrl+Shift+D',
    handler: 'ghostDismiss',
  },
  // Navigation commands
  {
    id: 'nav.receipts',
    label: 'Show Receipts',
    description: 'Navigate to the receipt feed',
    category: 'navigation',
    shortcut: 'Ctrl+R',
    handler: 'showReceipts',
  },
  {
    id: 'nav.lineage',
    label: 'Show Lineage',
    description: 'Navigate to the lineage trail for the active entity',
    category: 'navigation',
    handler: 'showLineage',
  },
  // System commands
  {
    id: 'system.inspect.violation',
    label: 'Inspect Violation',
    description: 'Inspect the current violation detail',
    category: 'system',
    shortcut: 'Ctrl+Shift+V',
    handler: 'inspectViolation',
  },
];

export function getCommand(id: string): RegisteredCommand | undefined {
  return COMMAND_REGISTRY.find((cmd) => cmd.id === id);
}

export function getCommandsByCategory(category: CommandCategory): RegisteredCommand[] {
  return COMMAND_REGISTRY.filter((cmd) => cmd.category === category);
}

export function getAllCommands(): RegisteredCommand[] {
  return [...COMMAND_REGISTRY];
}

export function searchCommands(query: string): RegisteredCommand[] {
  const lowerQuery = query.toLowerCase();
  return COMMAND_REGISTRY.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.id.toLowerCase().includes(lowerQuery)
  );
}
