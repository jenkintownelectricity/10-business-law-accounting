import React from 'react';

export interface ShortcutHint {
  keys: string[];
  label: string;
  category: 'focus' | 'ghost' | 'navigation' | 'system';
}

export interface KeyboardShortcutHintsProps {
  shortcuts?: ShortcutHint[];
  className?: string;
}

const DEFAULT_SHORTCUTS: ShortcutHint[] = [
  { keys: ['Ctrl', 'K'], label: 'Command Palette', category: 'system' },
  { keys: ['Ctrl', 'Shift', 'F'], label: 'Focus Next Pane', category: 'focus' },
  { keys: ['Ctrl', 'Shift', 'B'], label: 'Focus Previous Pane', category: 'focus' },
  { keys: ['Ctrl', 'Shift', 'L'], label: 'Lock Focus', category: 'focus' },
  { keys: ['Ctrl', 'Shift', 'Q'], label: 'Toggle Quiet Mode', category: 'focus' },
  { keys: ['Ctrl', 'G'], label: 'Toggle Ghost Layer', category: 'ghost' },
  { keys: ['Ctrl', 'Shift', 'P'], label: 'Promote Selected Ghost', category: 'ghost' },
  { keys: ['Ctrl', 'Shift', 'D'], label: 'Dismiss Selected Ghost', category: 'ghost' },
  { keys: ['Ctrl', 'R'], label: 'Show Receipts', category: 'navigation' },
  { keys: ['Ctrl', 'Shift', 'V'], label: 'Inspect Violation', category: 'system' },
];

/**
 * KeyboardShortcutHints
 *
 * Shows keyboard shortcuts for focus and ghost commands.
 * Displayed at the bottom of the command palette or as a standalone reference.
 */
export const KeyboardShortcutHints: React.FC<KeyboardShortcutHintsProps> = ({
  shortcuts = DEFAULT_SHORTCUTS,
  className,
}) => {
  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div
      className={`cct-keyboard-hints ${className || ''}`}
      data-component="keyboard-shortcut-hints"
      role="region"
      aria-label="Keyboard shortcuts"
    >
      {categories.map((category) => (
        <div key={category} className="cct-keyboard-hints__group">
          <h4 className="cct-keyboard-hints__group-title">{category}</h4>
          <dl className="cct-keyboard-hints__list">
            {shortcuts
              .filter((s) => s.category === category)
              .map((shortcut) => (
                <div key={shortcut.label} className="cct-keyboard-hints__entry">
                  <dt className="cct-keyboard-hints__keys">
                    {shortcut.keys.map((key, i) => (
                      <React.Fragment key={key}>
                        <kbd className="cct-keyboard-hints__key">{key}</kbd>
                        {i < shortcut.keys.length - 1 && (
                          <span className="cct-keyboard-hints__separator">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </dt>
                  <dd className="cct-keyboard-hints__label">{shortcut.label}</dd>
                </div>
              ))}
          </dl>
        </div>
      ))}
    </div>
  );
};

export default KeyboardShortcutHints;
