/**
 * QuietModeToggle
 * Toggle button for quiet mode.
 * Suppresses non-critical advisory focus requests when active.
 */

import React from 'react';

interface QuietModeToggleProps {
  quietMode: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const QuietModeToggle: React.FC<QuietModeToggleProps> = ({
  quietMode,
  onToggle,
  disabled = false,
}) => {
  return (
    <button
      className="quiet-mode-toggle"
      onClick={onToggle}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '4px',
        border: quietMode ? '1px solid #475569' : '1px solid #334155',
        backgroundColor: quietMode ? '#334155' : '#1e293b',
        color: quietMode ? '#f8fafc' : '#94a3b8',
        fontSize: '12px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
      }}
      aria-pressed={quietMode}
      aria-label={quietMode ? 'Disable quiet mode' : 'Enable quiet mode'}
      title="Toggle quiet mode — suppresses non-critical advisory requests"
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: quietMode ? '#f59e0b' : '#475569',
          transition: 'background-color 0.15s ease',
        }}
      />
      {quietMode ? 'Quiet On' : 'Quiet Off'}
    </button>
  );
};

export default QuietModeToggle;
