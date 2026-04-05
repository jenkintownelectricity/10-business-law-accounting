/**
 * FocusEscalationBanner
 * Banner for INTERRUPTION_PENDING state.
 * Hard but restrained crimson framing. Shows violation summary.
 * Operator can inspect, defer, or quiet the interruption.
 */

import React from 'react';
import { FocusEntry } from '../../lib/focus/focusTypes';

interface FocusEscalationBannerProps {
  interruptions: FocusEntry[];
  onInspect?: (paneId: string) => void;
  onDefer?: (paneId: string) => void;
  onQuiet?: () => void;
}

const FocusEscalationBanner: React.FC<FocusEscalationBannerProps> = ({
  interruptions,
  onInspect,
  onDefer,
  onQuiet,
}) => {
  if (interruptions.length === 0) return null;

  return (
    <div
      className="focus-escalation-banner"
      style={{
        backgroundColor: '#1c0a0a',
        border: '1px solid #7f1d1d',
        borderLeft: '4px solid #dc2626',
        borderRadius: '4px',
        padding: '10px 16px',
        margin: '8px 0',
      }}
      role="alert"
      aria-live="assertive"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: interruptions.length > 1 ? '8px' : '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '12px' }}>
            INTERRUPTION PENDING
          </span>
          <span style={{ color: '#fca5a5', fontSize: '12px' }}>
            {interruptions.length} violation{interruptions.length !== 1 ? 's' : ''} require attention
          </span>
        </div>
        {onQuiet && (
          <button
            onClick={onQuiet}
            style={{
              background: 'none',
              border: '1px solid #7f1d1d',
              borderRadius: '3px',
              color: '#fca5a5',
              fontSize: '11px',
              padding: '2px 8px',
              cursor: 'pointer',
            }}
          >
            Quiet All
          </button>
        )}
      </div>
      {interruptions.map((entry) => (
        <div
          key={entry.pane_id}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 0',
            borderTop: '1px solid #7f1d1d',
          }}
        >
          <div style={{ color: '#fecaca', fontSize: '12px' }}>
            <span style={{ fontWeight: 600 }}>{entry.pane_type}</span>
            {entry.entity_id && (
              <span style={{ color: '#fca5a5', marginLeft: '8px' }}>
                {entry.entity_type || 'Entity'}: {entry.entity_id}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {onInspect && (
              <button
                onClick={() => onInspect(entry.pane_id)}
                style={{
                  background: '#7f1d1d',
                  border: 'none',
                  borderRadius: '3px',
                  color: '#fecaca',
                  fontSize: '11px',
                  padding: '2px 8px',
                  cursor: 'pointer',
                }}
              >
                Inspect
              </button>
            )}
            {onDefer && (
              <button
                onClick={() => onDefer(entry.pane_id)}
                style={{
                  background: 'none',
                  border: '1px solid #7f1d1d',
                  borderRadius: '3px',
                  color: '#fca5a5',
                  fontSize: '11px',
                  padding: '2px 8px',
                  cursor: 'pointer',
                }}
              >
                Defer
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FocusEscalationBanner;
