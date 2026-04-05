/**
 * FocusStackPanel
 * Shows the stack of panes with their focus states.
 * Primary at top, secondary below, background at bottom.
 */

import React from 'react';
import { FocusEntry, FocusState } from '../../lib/focus/focusTypes';

interface FocusStackPanelProps {
  primaryActive: FocusEntry | null;
  secondaryContext: FocusEntry[];
  backgroundAware: FocusEntry[];
  onPaneSelect?: (paneId: string) => void;
}

const STATE_INDICATORS: Record<FocusState, { color: string; label: string }> = {
  PRIMARY_ACTIVE: { color: '#22c55e', label: 'Active' },
  SECONDARY_CONTEXT: { color: '#3b82f6', label: 'Context' },
  BACKGROUND_AWARE: { color: '#64748b', label: 'Background' },
  ADVISORY_QUEUE: { color: '#f59e0b', label: 'Advisory' },
  INTERRUPTION_PENDING: { color: '#dc2626', label: 'Interruption' },
  LOCKED_REVIEW: { color: '#7c3aed', label: 'Locked' },
  QUIET_MODE: { color: '#475569', label: 'Quiet' },
};

const PaneRow: React.FC<{
  entry: FocusEntry;
  onSelect?: (paneId: string) => void;
}> = ({ entry, onSelect }) => {
  const indicator = STATE_INDICATORS[entry.state] || STATE_INDICATORS.BACKGROUND_AWARE;

  return (
    <button
      onClick={() => onSelect?.(entry.pane_id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '6px 12px',
        border: 'none',
        background: entry.state === 'PRIMARY_ACTIVE' ? '#1e293b' : 'transparent',
        color: '#e2e8f0',
        cursor: 'pointer',
        fontSize: '12px',
        textAlign: 'left',
        borderLeft: `3px solid ${indicator.color}`,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: indicator.color,
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1, fontWeight: entry.state === 'PRIMARY_ACTIVE' ? 600 : 400 }}>
        {entry.pane_type}
      </span>
      <span style={{ color: '#64748b', fontSize: '10px' }}>{indicator.label}</span>
    </button>
  );
};

const FocusStackPanel: React.FC<FocusStackPanelProps> = ({
  primaryActive,
  secondaryContext,
  backgroundAware,
  onPaneSelect,
}) => {
  return (
    <div
      className="focus-stack-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '6px',
        overflow: 'hidden',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '1px solid #1e293b',
        }}
      >
        Focus Stack
      </div>
      {primaryActive && <PaneRow entry={primaryActive} onSelect={onPaneSelect} />}
      {secondaryContext.map((entry) => (
        <PaneRow key={entry.pane_id} entry={entry} onSelect={onPaneSelect} />
      ))}
      {backgroundAware.map((entry) => (
        <PaneRow key={entry.pane_id} entry={entry} onSelect={onPaneSelect} />
      ))}
      {!primaryActive && secondaryContext.length === 0 && backgroundAware.length === 0 && (
        <div style={{ padding: '12px', color: '#475569', fontSize: '12px', textAlign: 'center' }}>
          No panes registered
        </div>
      )}
    </div>
  );
};

export default FocusStackPanel;
