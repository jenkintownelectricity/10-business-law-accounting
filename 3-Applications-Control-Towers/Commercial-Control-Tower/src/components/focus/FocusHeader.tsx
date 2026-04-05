/**
 * FocusHeader
 * Header showing current focus target with entity info.
 * Displays pane type, entity ID, and focus state indicator.
 */

import React from 'react';
import { FocusEntry } from '../../lib/focus/focusTypes';

interface FocusHeaderProps {
  activeEntry: FocusEntry | null;
  quietMode: boolean;
  lockedReview: boolean;
}

const FocusHeader: React.FC<FocusHeaderProps> = ({
  activeEntry,
  quietMode,
  lockedReview,
}) => {
  return (
    <div
      className="focus-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        backgroundColor: '#0f172a',
        borderBottom: '1px solid #1e293b',
        fontSize: '13px',
        color: '#e2e8f0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: activeEntry ? '#22c55e' : '#64748b',
            display: 'inline-block',
          }}
        />
        <span style={{ fontWeight: 600 }}>
          {activeEntry ? activeEntry.pane_type : 'No Active Focus'}
        </span>
        {activeEntry?.entity_id && (
          <span style={{ color: '#94a3b8' }}>
            {activeEntry.entity_type || 'Entity'}: {activeEntry.entity_id}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {lockedReview && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: '#7c3aed',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            LOCKED REVIEW
          </span>
        )}
        {quietMode && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: '#475569',
              color: '#cbd5e1',
              fontSize: '11px',
              fontWeight: 600,
            }}
          >
            QUIET
          </span>
        )}
      </div>
    </div>
  );
};

export default FocusHeader;
