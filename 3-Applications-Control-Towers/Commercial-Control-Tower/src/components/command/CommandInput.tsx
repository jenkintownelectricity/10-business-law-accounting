import React, { useRef, useEffect } from 'react';

export interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onEscape: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * CommandInput
 *
 * Input field for the command palette with search capability.
 * Supports slash command syntax: /focus, /ghost, /promote, etc.
 */
export const CommandInput: React.FC<CommandInputProps> = ({
  value,
  onChange,
  onSubmit,
  onEscape,
  placeholder = 'Type a command...',
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEscape();
    }
  };

  const isSlashCommand = value.startsWith('/');

  return (
    <div
      className={`cct-command-input ${isSlashCommand ? 'cct-command-input--slash' : ''} ${className || ''}`}
      data-component="command-input"
    >
      {isSlashCommand && (
        <span className="cct-command-input__slash-indicator" aria-hidden="true">/</span>
      )}
      <input
        ref={inputRef}
        className="cct-command-input__field"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Command input"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
};

export default CommandInput;
