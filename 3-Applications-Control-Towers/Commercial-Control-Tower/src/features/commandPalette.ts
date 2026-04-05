/**
 * Command Palette
 * ⌘K triggered command palette for the Commercial Control Tower.
 */

export interface CommandAction {
  id: string;
  category: 'navigation' | 'create' | 'search' | 'voice' | 'view' | 'export';
  label: string;
  shortcut?: string;
  keywords: string[];
  handler: () => void;
}

export const COMMAND_ACTIONS: Omit<CommandAction, 'handler'>[] = [
  // Navigation
  { id: 'nav-overview', category: 'navigation', label: 'Go to Overview', shortcut: 'G O', keywords: ['home', 'dashboard'] },
  { id: 'nav-matters', category: 'navigation', label: 'Go to Matters', shortcut: 'G M', keywords: ['cases', 'matters'] },
  { id: 'nav-contracts', category: 'navigation', label: 'Go to Contracts', shortcut: 'G C', keywords: ['agreements'] },
  { id: 'nav-obligations', category: 'navigation', label: 'Go to Obligations', keywords: ['duties', 'requirements'] },
  { id: 'nav-accounting', category: 'navigation', label: 'Go to Accounting', shortcut: 'G A', keywords: ['finance', 'invoices'] },
  { id: 'nav-clients', category: 'navigation', label: 'Go to Clients', keywords: ['customers'] },
  { id: 'nav-vendors', category: 'navigation', label: 'Go to Vendors', keywords: ['suppliers'] },
  { id: 'nav-deadlines', category: 'navigation', label: 'Go to Deadlines', shortcut: 'G D', keywords: ['due dates', 'calendar'] },
  { id: 'nav-decisions', category: 'navigation', label: 'Go to Decision Threads', keywords: ['bundles'] },
  { id: 'nav-receipts', category: 'navigation', label: 'Go to Receipts', keywords: ['evidence', 'audit'] },
  { id: 'nav-review', category: 'navigation', label: 'Go to Review Queue', shortcut: 'G R', keywords: ['pending', 'approve'] },
  { id: 'nav-voice', category: 'navigation', label: 'Go to Voice Workspace', shortcut: 'G V', keywords: ['dictation', 'listening', 'mic'] },
  { id: 'nav-settings', category: 'navigation', label: 'Go to Settings', keywords: ['config', 'preferences'] },

  // Create
  { id: 'create-matter', category: 'create', label: 'New Matter', shortcut: 'N M', keywords: ['add matter', 'create case'] },
  { id: 'create-contract', category: 'create', label: 'New Contract', shortcut: 'N C', keywords: ['add contract'] },
  { id: 'create-invoice', category: 'create', label: 'New Invoice', shortcut: 'N I', keywords: ['add invoice'] },
  { id: 'create-note', category: 'create', label: 'New Note', shortcut: 'N N', keywords: ['add note', 'write'] },

  // Search
  { id: 'search-global', category: 'search', label: 'Search Everything', keywords: ['find', 'query'] },
  { id: 'search-matters', category: 'search', label: 'Search Matters', keywords: ['find matter'] },
  { id: 'search-contracts', category: 'search', label: 'Search Contracts', keywords: ['find contract'] },
  { id: 'search-transcripts', category: 'search', label: 'Search Transcripts', keywords: ['find transcript', 'find recording'] },

  // Voice
  { id: 'voice-dictate', category: 'voice', label: 'Start Dictation', keywords: ['speak', 'dictate', 'mic'] },
  { id: 'voice-listen', category: 'voice', label: 'Start Listening (Iron Ear)', keywords: ['listen', 'meeting', 'capture'] },
  { id: 'voice-command', category: 'voice', label: 'Spoken Command', keywords: ['command', 'voice control'] },

  // View
  { id: 'view-focus', category: 'view', label: 'Toggle Focus Mode', shortcut: 'Ctrl+Shift+F', keywords: ['focus', 'clean', 'minimal'] },
  { id: 'view-due-today', category: 'view', label: 'Show Due Today', keywords: ['today', 'urgent'] },
  { id: 'view-due-soon', category: 'view', label: 'Show Due Soon', keywords: ['upcoming', 'soon'] },
  { id: 'view-risks', category: 'view', label: 'Show Unresolved Risks', keywords: ['open risks', 'warnings'] },

  // Export
  { id: 'export-matter', category: 'export', label: 'Export Matter Packet', keywords: ['print', 'pdf', 'report'] },
  { id: 'export-contract', category: 'export', label: 'Export Contract Packet', keywords: ['print contract'] },
  { id: 'export-decision', category: 'export', label: 'Export Decision Packet', keywords: ['print decision'] },
  { id: 'export-receipts', category: 'export', label: 'Export Receipt Packet', keywords: ['print receipts'] },
];

export function filterCommands(query: string): Omit<CommandAction, 'handler'>[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return COMMAND_ACTIONS;

  return COMMAND_ACTIONS.filter(action => {
    if (action.label.toLowerCase().includes(normalized)) return true;
    if (action.keywords.some(k => k.includes(normalized))) return true;
    return false;
  });
}
