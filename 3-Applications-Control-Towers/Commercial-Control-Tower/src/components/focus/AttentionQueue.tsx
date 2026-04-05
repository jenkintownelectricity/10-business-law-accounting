/**
 * AttentionQueue
 * Queue panel showing advisory items (right rail or top-right).
 * All ephemeral proposals land here. Queue never auto-opens panes.
 * Operator must explicitly select an item to promote it.
 */

import React from 'react';
import { FocusEntry } from '../../lib/focus/focusTypes';
import { FOCUS_PRIORITY_ORDER } from '../../lib/focus/focusPriorityMap';

interface AttentionQueueProps {
  advisoryItems: FocusEntry[];
  onSelectItem?: (paneId: string) => void;
  onDismissItem?: (paneId: string) => void;
  quietMode: boolean;
}

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL_VIOLATION: '#dc2626',
  ACTIVE_REVIEW_TARGET: '#f59e0b',
  SELECTED_EVIDENCE: '#3b82f6',
  EPHEMERAL_PROPOSAL: '#8b5cf6',
  SEARCH_RESULTS: '#06b6d4',
  RECEIPT_FEED: '#64748b',
  WAVEFORM_MONITOR: '#475569',
};

const AttentionQueue: React.FC<AttentionQueueProps> = ({
  advisoryItems,
  onSelectItem,
  onDismissItem,
  quietMode,
}) => {
  const sortedItems = [...advisoryItems].sort(
    (a, b) => (FOCUS_PRIORITY_ORDER[b.priority] || 0) - (FOCUS_PRIORITY_ORDER[a.priority] || 0)
  );

  return (
    <div
      className="attention-queue"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '6px',
        overflow: 'hidden',
        minWidth: '240px',
        maxHeight: '400px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '1px solid #1e293b',
        }}
      >
        <span>Advisory Queue</span>
        <span
          style={{
            backgroundColor: sortedItems.length > 0 ? '#1e293b' : 'transparent',
            padding: '1px 6px',
            borderRadius: '8px',
            fontSize: '10px',
          }}
        >
          {sortedItems.length}
        </span>
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {quietMode && (
          <div
            style={{
              padding: '8px 12px',
              color: '#f59e0b',
              fontSize: '11px',
              backgroundColor: '#1c1917',
              borderBottom: '1px solid #1e293b',
            }}
          >
            Quiet mode active — non-critical items suppressed
          </div>
        )}
        {sortedItems.length === 0 && (
          <div style={{ padding: '16px 12px', color: '#475569', fontSize: '12px', textAlign: 'center' }}>
            No advisory items
          </div>
        )}
        {sortedItems.map((entry) => (
          <div
            key={entry.pane_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid #1e293b',
              cursor: 'pointer',
            }}
            onClick={() => onSelectItem?.(entry.pane_id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: PRIORITY_COLORS[entry.priority] || '#475569',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 500 }}>
                  {entry.pane_type}
                </div>
                <div style={{ color: '#64748b', fontSize: '10px' }}>
                  {entry.priority.replace(/_/g, ' ').toLowerCase()}
                </div>
              </div>
            </div>
            {onDismissItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismissItem(entry.pane_id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '0 4px',
                  lineHeight: 1,
                }}
                aria-label={`Dismiss ${entry.pane_type}`}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttentionQueue;
