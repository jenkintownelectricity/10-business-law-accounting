import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  CommandRegistry,
  CommandContext,
  CommandDefinition,
  CommandCategory,
  CommandResult,
} from '../../lib/command/registry';
import { resolveCommandContext } from '../../lib/command/contextResolver';

export interface CommandPaletteProps {
  className?: string;
}

const CATEGORY_COLORS: Record<CommandCategory, string> = {
  focus: '#4fc3f7',
  ghost: '#ce93d8',
  navigation: '#81c784',
  lineage: '#ffb74d',
  system: '#90a4ae',
  workspace: '#a1887f',
  doctrine: '#fff176',
};

const CATEGORY_LABELS: Record<CommandCategory, string> = {
  focus: 'FOCUS',
  ghost: 'GHOST',
  navigation: 'NAV',
  lineage: 'LINEAGE',
  system: 'SYS',
  workspace: 'WORK',
  doctrine: 'DOCTRINE',
};

/**
 * CommandPalette
 *
 * Full command palette overlay component with keyboard navigation.
 * Integrated with the canonical CommandRegistry.
 * Opens on Cmd+K / Ctrl+K. Supports category prefix filtering (e.g., "focus:" or "ghost:").
 *
 * Keyboard:
 * - Ctrl+K or Cmd+K: toggle open
 * - Arrow Up/Down: navigate results
 * - Enter: execute selected command
 * - Escape: close
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lastResult, setLastResult] = useState<CommandResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Resolve current context for command enablement checks
  const context: CommandContext = useMemo(() => resolveCommandContext(), [isOpen]);

  // Parse category prefix from query
  const { categoryFilter, searchTerm } = useMemo(() => {
    const categoryPrefixes: CommandCategory[] = ['focus', 'ghost', 'navigation', 'lineage', 'system', 'workspace', 'doctrine'];
    for (const prefix of categoryPrefixes) {
      if (query.toLowerCase().startsWith(`${prefix}:`)) {
        return {
          categoryFilter: prefix,
          searchTerm: query.slice(prefix.length + 1).trim(),
        };
      }
    }
    return { categoryFilter: null as CommandCategory | null, searchTerm: query };
  }, [query]);

  // Filter commands from registry
  const filteredCommands: CommandDefinition[] = useMemo(() => {
    let commands: CommandDefinition[];

    if (categoryFilter) {
      const categoryCommands = CommandRegistry.getCommandsByCategory(categoryFilter);
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        commands = categoryCommands.filter(
          cmd =>
            cmd.id.includes(q) ||
            cmd.label.toLowerCase().includes(q) ||
            cmd.description.toLowerCase().includes(q),
        );
      } else {
        commands = categoryCommands;
      }
    } else if (searchTerm) {
      commands = CommandRegistry.searchCommands(searchTerm);
    } else {
      commands = CommandRegistry.getAllCommands();
    }

    return commands;
  }, [categoryFilter, searchTerm]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Clear state on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setLastResult(null);
      setShowResult(false);
    }
  }, [isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Global keyboard listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.children[selectedIndex] as HTMLElement | undefined;
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Hide result toast after delay
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => setShowResult(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  const executeCommand = useCallback(
    async (commandId: string) => {
      const result = await CommandRegistry.executeCommand(commandId, context);
      setLastResult(result);
      setShowResult(true);
      if (result.success) {
        setIsOpen(false);
      }
    },
    [context],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [filteredCommands, selectedIndex, executeCommand],
  );

  if (!isOpen) {
    // Render result toast even when closed
    if (showResult && lastResult) {
      return (
        <div
          className="cct-command-palette__toast"
          data-success={lastResult.success}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '13px',
            fontFamily: 'monospace',
            zIndex: 10001,
            background: lastResult.success ? '#1b5e20' : '#b71c1c',
            color: '#fff',
            border: `1px solid ${lastResult.success ? '#2e7d32' : '#c62828'}`,
          }}
        >
          {lastResult.success ? lastResult.message : lastResult.error}
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={`cct-command-palette ${className || ''}`}
      data-component="command-palette"
      role="dialog"
      aria-label="Command palette"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
    >
      {/* Backdrop */}
      <div
        className="cct-command-palette__backdrop"
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
        }}
      />

      {/* Panel */}
      <div
        className="cct-command-palette__panel"
        style={{
          position: 'relative',
          width: '560px',
          maxHeight: '60vh',
          background: '#1a1a2e',
          border: '1px solid #333355',
          borderRadius: '8px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Input area */}
        <div
          className="cct-command-palette__input-area"
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid #333355',
          }}
        >
          <input
            ref={inputRef}
            className="cct-command-palette__input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search... (prefix with category: e.g. focus:)"
            autoFocus
            aria-label="Command search"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e0e0e0',
              fontSize: '15px',
              fontFamily: 'monospace',
            }}
          />
        </div>

        {/* Category filter indicator */}
        {categoryFilter && (
          <div
            style={{
              padding: '4px 16px',
              fontSize: '11px',
              color: CATEGORY_COLORS[categoryFilter],
              borderBottom: '1px solid #333355',
              fontFamily: 'monospace',
            }}
          >
            Filtering: {CATEGORY_LABELS[categoryFilter]}
          </div>
        )}

        {/* Results list */}
        <ul
          ref={listRef}
          className="cct-command-palette__results"
          role="listbox"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: '4px 0',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {filteredCommands.map((cmd, index) => {
            const isEnabled = CommandRegistry.isCommandEnabled(cmd.id, context);
            const disabledReason = !isEnabled
              ? CommandRegistry.getDisabledReason(cmd.id, context)
              : null;
            const isSelected = index === selectedIndex;
            const isPaneSpecific = cmd.focus_effect === 'TRANSFER' || cmd.focus_effect === 'LOCK';

            return (
              <li
                key={cmd.id}
                className={`cct-command-palette__result ${isSelected ? 'cct-command-palette__result--selected' : ''}`}
                data-command-id={cmd.id}
                data-enabled={isEnabled}
                role="option"
                aria-selected={isSelected}
                onClick={() => isEnabled && executeCommand(cmd.id)}
                style={{
                  padding: '8px 16px',
                  cursor: isEnabled ? 'pointer' : 'not-allowed',
                  background: isSelected ? '#2a2a4e' : 'transparent',
                  opacity: isEnabled ? 1 : 0.45,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'monospace',
                }}
              >
                {/* Category badge */}
                <span
                  className="cct-command-palette__category-badge"
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '3px',
                    background: `${CATEGORY_COLORS[cmd.category]}22`,
                    color: CATEGORY_COLORS[cmd.category],
                    border: `1px solid ${CATEGORY_COLORS[cmd.category]}44`,
                    textTransform: 'uppercase',
                    flexShrink: 0,
                    minWidth: '48px',
                    textAlign: 'center' as const,
                  }}
                >
                  {CATEGORY_LABELS[cmd.category]}
                </span>

                {/* Label and description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="cct-command-palette__result-label"
                    style={{
                      color: isEnabled ? '#e0e0e0' : '#666',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    {cmd.label}
                    {isPaneSpecific && (
                      <span
                        style={{
                          fontSize: '9px',
                          marginLeft: '6px',
                          color: '#666',
                          verticalAlign: 'middle',
                        }}
                      >
                        [PANE]
                      </span>
                    )}
                  </div>
                  <div
                    className="cct-command-palette__result-desc"
                    style={{
                      color: '#777',
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {disabledReason || cmd.description}
                  </div>
                </div>

                {/* Shortcut */}
                {cmd.shortcut && (
                  <kbd
                    className="cct-command-palette__result-shortcut"
                    style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: '#111',
                      color: '#888',
                      border: '1px solid #333',
                      flexShrink: 0,
                    }}
                  >
                    {cmd.shortcut}
                  </kbd>
                )}
              </li>
            );
          })}
          {filteredCommands.length === 0 && (
            <li
              className="cct-command-palette__no-results"
              style={{
                padding: '16px',
                textAlign: 'center',
                color: '#555',
                fontSize: '13px',
                fontFamily: 'monospace',
              }}
            >
              No matching commands
            </li>
          )}
        </ul>

        {/* Footer */}
        <div
          className="cct-command-palette__footer"
          style={{
            padding: '6px 16px',
            borderTop: '1px solid #333355',
            display: 'flex',
            gap: '16px',
            fontSize: '11px',
            color: '#555',
            fontFamily: 'monospace',
          }}
        >
          <span>
            <kbd style={{ background: '#111', padding: '1px 4px', borderRadius: '2px', border: '1px solid #333' }}>
              Up/Down
            </kbd>{' '}
            navigate
          </span>
          <span>
            <kbd style={{ background: '#111', padding: '1px 4px', borderRadius: '2px', border: '1px solid #333' }}>
              Enter
            </kbd>{' '}
            execute
          </span>
          <span>
            <kbd style={{ background: '#111', padding: '1px 4px', borderRadius: '2px', border: '1px solid #333' }}>
              Esc
            </kbd>{' '}
            close
          </span>
          <span style={{ marginLeft: 'auto' }}>
            {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
