/**
 * Command Palette
 * Quick-access command palette for the Commercial Control Tower.
 * Keyboard shortcut: Ctrl+K (or Cmd+K on macOS)
 *
 * Provides rapid navigation, entity search, and action dispatch
 * from a single overlay. Integrates with spoken command shortcuts
 * for voice-triggered palette access.
 */

export interface CommandPaletteItem {
  id: string;
  label: string;
  category: CommandCategory;
  action: CommandPaletteAction;
  keywords: string[];
  shortcut?: string;
  icon?: string;
}

export type CommandCategory =
  | 'navigation'
  | 'entity'
  | 'action'
  | 'voice'
  | 'settings'
  | 'recent';

export type CommandPaletteAction =
  | { type: 'navigate'; path: string }
  | { type: 'open_entity'; entity_type: string; entity_id: string }
  | { type: 'run_action'; action_id: string; params?: Record<string, unknown> }
  | { type: 'toggle_feature'; feature: string }
  | { type: 'search'; query: string };

export interface CommandPaletteState {
  is_open: boolean;
  query: string;
  filtered_items: CommandPaletteItem[];
  selected_index: number;
  category_filter: CommandCategory | null;
}

/**
 * Built-in navigation commands available in the palette.
 */
const NAVIGATION_COMMANDS: CommandPaletteItem[] = [
  {
    id: 'nav-overview',
    label: 'Go to Overview Dashboard',
    category: 'navigation',
    action: { type: 'navigate', path: '/overview' },
    keywords: ['overview', 'dashboard', 'home'],
    shortcut: 'G then O',
  },
  {
    id: 'nav-matters',
    label: 'Go to Matters',
    category: 'navigation',
    action: { type: 'navigate', path: '/matters' },
    keywords: ['matters', 'cases', 'engagements'],
    shortcut: 'G then M',
  },
  {
    id: 'nav-contracts',
    label: 'Go to Contracts',
    category: 'navigation',
    action: { type: 'navigate', path: '/contracts' },
    keywords: ['contracts', 'agreements'],
    shortcut: 'G then C',
  },
  {
    id: 'nav-obligations',
    label: 'Go to Obligations',
    category: 'navigation',
    action: { type: 'navigate', path: '/obligations' },
    keywords: ['obligations', 'duties', 'commitments'],
    shortcut: 'G then B',
  },
  {
    id: 'nav-deadlines',
    label: 'Go to Deadlines',
    category: 'navigation',
    action: { type: 'navigate', path: '/deadlines' },
    keywords: ['deadlines', 'due dates', 'calendar'],
    shortcut: 'G then D',
  },
  {
    id: 'nav-clients',
    label: 'Go to Clients',
    category: 'navigation',
    action: { type: 'navigate', path: '/clients' },
    keywords: ['clients', 'customers'],
  },
  {
    id: 'nav-vendors',
    label: 'Go to Vendors',
    category: 'navigation',
    action: { type: 'navigate', path: '/vendors' },
    keywords: ['vendors', 'suppliers'],
  },
  {
    id: 'nav-accounting',
    label: 'Go to Accounting',
    category: 'navigation',
    action: { type: 'navigate', path: '/accounting' },
    keywords: ['accounting', 'ledger', 'financial'],
  },
  {
    id: 'nav-review-queue',
    label: 'Go to Review Queue',
    category: 'navigation',
    action: { type: 'navigate', path: '/review-queue' },
    keywords: ['review', 'queue', 'pending'],
  },
  {
    id: 'nav-decision-threads',
    label: 'Go to Decision Threads',
    category: 'navigation',
    action: { type: 'navigate', path: '/decision-threads' },
    keywords: ['decisions', 'threads', 'deliberation'],
  },
  {
    id: 'nav-voice',
    label: 'Go to Voice Workspace',
    category: 'navigation',
    action: { type: 'navigate', path: '/voice' },
    keywords: ['voice', 'dictation', 'listening'],
  },
  {
    id: 'nav-settings',
    label: 'Go to Settings',
    category: 'navigation',
    action: { type: 'navigate', path: '/settings' },
    keywords: ['settings', 'preferences', 'configuration'],
  },
];

/**
 * Built-in action commands.
 */
const ACTION_COMMANDS: CommandPaletteItem[] = [
  {
    id: 'action-focus-mode',
    label: 'Toggle Focus Mode',
    category: 'action',
    action: { type: 'toggle_feature', feature: 'focus_mode' },
    keywords: ['focus', 'distraction', 'clean'],
    shortcut: 'Ctrl+Shift+F',
  },
  {
    id: 'action-search',
    label: 'Search Everything',
    category: 'action',
    action: { type: 'navigate', path: '/search' },
    keywords: ['search', 'find', 'lookup'],
    shortcut: '/',
  },
  {
    id: 'action-start-dictation',
    label: 'Start Voice Dictation',
    category: 'voice',
    action: { type: 'run_action', action_id: 'start_dictation' },
    keywords: ['dictate', 'voice', 'speak', 'record'],
  },
  {
    id: 'action-start-listening',
    label: 'Start Iron Ear Listening Session',
    category: 'voice',
    action: { type: 'run_action', action_id: 'start_listening' },
    keywords: ['listen', 'iron ear', 'meeting', 'capture'],
  },
];

export class CommandPalette {
  private state: CommandPaletteState;
  private commands: CommandPaletteItem[];
  private recentCommands: string[] = [];

  constructor(customCommands?: CommandPaletteItem[]) {
    this.commands = [...NAVIGATION_COMMANDS, ...ACTION_COMMANDS, ...(customCommands || [])];
    this.state = {
      is_open: false,
      query: '',
      filtered_items: [],
      selected_index: 0,
      category_filter: null,
    };
  }

  open(): void {
    this.state.is_open = true;
    this.state.query = '';
    this.state.selected_index = 0;
    this.state.category_filter = null;
    this.state.filtered_items = this.getDefaultItems();
  }

  close(): void {
    this.state.is_open = false;
    this.state.query = '';
    this.state.filtered_items = [];
  }

  toggle(): void {
    if (this.state.is_open) this.close();
    else this.open();
  }

  isOpen(): boolean {
    return this.state.is_open;
  }

  /**
   * Update the search query and filter commands.
   */
  updateQuery(query: string): CommandPaletteItem[] {
    this.state.query = query;
    this.state.selected_index = 0;

    if (!query.trim()) {
      this.state.filtered_items = this.getDefaultItems();
      return this.state.filtered_items;
    }

    const terms = query.toLowerCase().split(/\s+/);
    const scored: { item: CommandPaletteItem; score: number }[] = [];

    for (const item of this.commands) {
      if (this.state.category_filter && item.category !== this.state.category_filter) continue;

      let score = 0;
      const searchText = [item.label, ...item.keywords].join(' ').toLowerCase();

      for (const term of terms) {
        if (searchText.includes(term)) score += 1;
        if (item.label.toLowerCase().startsWith(term)) score += 0.5;
      }

      if (score > 0) {
        // Boost recently used commands
        if (this.recentCommands.includes(item.id)) score += 0.5;
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    this.state.filtered_items = scored.map(s => s.item);
    return this.state.filtered_items;
  }

  /**
   * Filter by category (e.g., only navigation, only actions).
   */
  filterByCategory(category: CommandCategory | null): void {
    this.state.category_filter = category;
    this.updateQuery(this.state.query);
  }

  /**
   * Move selection up/down.
   */
  moveSelection(direction: 'up' | 'down'): number {
    if (direction === 'down') {
      this.state.selected_index = Math.min(
        this.state.selected_index + 1,
        this.state.filtered_items.length - 1,
      );
    } else {
      this.state.selected_index = Math.max(this.state.selected_index - 1, 0);
    }
    return this.state.selected_index;
  }

  /**
   * Execute the currently selected command.
   */
  executeSelected(): CommandPaletteAction | null {
    const item = this.state.filtered_items[this.state.selected_index];
    if (!item) return null;

    this.recentCommands = [item.id, ...this.recentCommands.filter(id => id !== item.id)].slice(0, 10);
    this.close();
    return item.action;
  }

  /**
   * Register a dynamic command (e.g., for recently viewed entities).
   */
  registerCommand(command: CommandPaletteItem): void {
    this.commands.push(command);
  }

  getState(): CommandPaletteState {
    return { ...this.state };
  }

  private getDefaultItems(): CommandPaletteItem[] {
    // Show recent commands first, then navigation
    const recent = this.recentCommands
      .map(id => this.commands.find(c => c.id === id))
      .filter((c): c is CommandPaletteItem => c != null);

    const nav = this.commands.filter(
      c => c.category === 'navigation' && !this.recentCommands.includes(c.id),
    );

    return [...recent, ...nav].slice(0, 15);
  }

  /**
   * Register keyboard shortcut handler for Ctrl+K / Cmd+K.
   */
  registerKeyboardShortcut(onAction: (action: CommandPaletteAction) => void): () => void {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }

      if (!this.state.is_open) return;

      if (e.key === 'ArrowDown') { e.preventDefault(); this.moveSelection('down'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); this.moveSelection('up'); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const action = this.executeSelected();
        if (action) onAction(action);
      }
      if (e.key === 'Escape') { this.close(); }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
    return () => {};
  }
}
