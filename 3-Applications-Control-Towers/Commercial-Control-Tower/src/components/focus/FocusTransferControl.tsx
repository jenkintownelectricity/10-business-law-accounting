/**
 * FocusTransferControl
 * Control for explicitly transferring focus between panes.
 * Provides next/prev cycling and direct pane selection.
 */

import React from 'react';
import { FocusEntry } from '../../lib/focus/focusTypes';

interface FocusTransferControlProps {
  currentPrimary: FocusEntry | null;
  availablePanes: FocusEntry[];
  lockedReview: boolean;
  onFocusNext?: () => void;
  onFocusPrev?: () => void;
  onFocusPane?: (paneId: string) => void;
}

const FocusTransferControl: React.FC<FocusTransferControlProps> = ({
  currentPrimary,
  availablePanes,
  lockedReview,
  onFocusNext,
  onFocusPrev,
  onFocusPane,
}) => {
  const buttonStyle: React.CSSProperties = {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '4px',
    color: lockedReview ? '#475569' : '#e2e8f0',
    fontSize: '12px',
    padding: '4px 10px',
    cursor: lockedReview ? 'not-allowed' : 'pointer',
    opacity: lockedReview ? 0.5 : 1,
  };

  return (
    <div
      className="focus-transfer-control"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: '#0f172a',
        borderRadius: '6px',
        border: '1px solid #1e293b',
      }}
    >
      <button
        onClick={onFocusPrev}
        disabled={lockedReview}
        style={buttonStyle}
        title="Previous pane (Shift+Tab)"
        aria-label="Focus previous pane"
      >
        Prev
      </button>
      <select
        value={currentPrimary?.pane_id || ''}
        onChange={(e) => onFocusPane?.(e.target.value)}
        disabled={lockedReview}
        style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '4px',
          color: '#e2e8f0',
          fontSize: '12px',
          padding: '4px 8px',
          flex: 1,
          minWidth: '120px',
          cursor: lockedReview ? 'not-allowed' : 'pointer',
          opacity: lockedReview ? 0.5 : 1,
        }}
        aria-label="Select focus pane"
      >
        <option value="">-- Select Pane --</option>
        {availablePanes.map((entry) => (
          <option key={entry.pane_id} value={entry.pane_id}>
            {entry.pane_type} ({entry.state})
          </option>
        ))}
      </select>
      <button
        onClick={onFocusNext}
        disabled={lockedReview}
        style={buttonStyle}
        title="Next pane (Tab)"
        aria-label="Focus next pane"
      >
        Next
      </button>
    </div>
  );
};

export default FocusTransferControl;
