import React, { useState, useCallback, useEffect } from 'react';

export interface CommandEntry {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
  category: 'focus' | 'ghost' | 'navigation' | 'system';
}

export interface CommandPaletteProps {
  isOpen: boolean;
  commands: CommandEntry[];
  onSelect: (commandId: string) => void;
  onClose: () => void;
  className?: string;
}

/**
 * CommandPalette
 *
 * Full command palette overlay component with keyboard navigation.
 * Integrated with focus system -- palette itself does not steal focus
 * from the current PRIMARY_ACTIVE pane; it operates as a modal overlay.
 *
 * Keyboard:
 * - Ctrl+K or Cmd+K: toggle open
 * - Arrow Up/Down: navigate results
 * - Enter: execute selected command
 * - Escape: close
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  commands,
  onSelect,
  onClose,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onSelect(filteredCommands[selectedIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filteredCommands, selectedIndex, onSelect, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className={`cct-command-palette ${className || ''}`}
      data-component="command-palette"
      role="dialog"
      aria-label="Command palette"
      aria-modal="true"
      onKeyDown={handleKeyDown}
    >
      <div className="cct-command-palette__backdrop" onClick={onClose} />
      <div className="cct-command-palette__panel">
        <div className="cct-command-palette__input-area">
          <input
            className="cct-command-palette__input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            autoFocus
            aria-label="Command search"
          />
        </div>
        <ul className="cct-command-palette__results" role="listbox">
          {filteredCommands.map((cmd, index) => (
            <li
              key={cmd.id}
              className={`cct-command-palette__result ${index === selectedIndex ? 'cct-command-palette__result--selected' : ''}`}
              data-command-id={cmd.id}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => onSelect(cmd.id)}
            >
              <span className="cct-command-palette__result-label">{cmd.label}</span>
              <span className="cct-command-palette__result-desc">{cmd.description}</span>
              {cmd.shortcut && (
                <kbd className="cct-command-palette__result-shortcut">{cmd.shortcut}</kbd>
              )}
            </li>
          ))}
          {filteredCommands.length === 0 && (
            <li className="cct-command-palette__no-results">No matching commands</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;
