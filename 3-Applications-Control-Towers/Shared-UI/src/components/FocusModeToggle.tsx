import React from 'react';

interface FocusModeToggleProps {
  active: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function FocusModeToggle({ active, onToggle, size = 'md', className = '' }: FocusModeToggleProps) {
  return (
    <button
      className={[
        'cct-focus-mode-toggle',
        active ? 'cct-focus-mode-active' : '',
        size === 'sm' ? 'cct-focus-mode-toggle-sm' : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onToggle}
      aria-pressed={active}
      title={active ? 'Exit Focus Mode' : 'Enter Focus Mode'}
    >
      <span className="cct-focus-mode-icon" />
      <span className="cct-focus-mode-label">
        {active ? 'Exit Focus' : 'Focus Mode'}
      </span>
    </button>
  );
}
