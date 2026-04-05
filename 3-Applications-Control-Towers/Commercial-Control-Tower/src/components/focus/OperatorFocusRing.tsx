/**
 * OperatorFocusRing
 * Visual ring/border around the PRIMARY_ACTIVE pane.
 * Strongest edge definition and contrast — makes the active pane unmistakable.
 */

import React from 'react';
import { FocusState } from '../../lib/focus/focusTypes';

interface OperatorFocusRingProps {
  focusState: FocusState;
  children: React.ReactNode;
  className?: string;
}

const RING_STYLES: Record<FocusState, React.CSSProperties> = {
  PRIMARY_ACTIVE: {
    border: '2px solid #2563eb',
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.3)',
    borderRadius: '6px',
  },
  SECONDARY_CONTEXT: {
    border: '1px solid #64748b',
    borderRadius: '6px',
    opacity: 0.85,
  },
  BACKGROUND_AWARE: {
    border: '1px solid #334155',
    borderRadius: '6px',
    opacity: 0.6,
  },
  ADVISORY_QUEUE: {
    border: '1px dashed #f59e0b',
    borderRadius: '6px',
    opacity: 0.7,
  },
  INTERRUPTION_PENDING: {
    border: '2px solid #dc2626',
    boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.3)',
    borderRadius: '6px',
    animation: 'focus-pulse 1.5s ease-in-out infinite',
  },
  LOCKED_REVIEW: {
    border: '2px solid #7c3aed',
    boxShadow: '0 0 0 2px rgba(124, 58, 237, 0.3)',
    borderRadius: '6px',
  },
  QUIET_MODE: {
    border: '1px solid #475569',
    borderRadius: '6px',
    opacity: 0.5,
  },
};

const OperatorFocusRing: React.FC<OperatorFocusRingProps> = ({
  focusState,
  children,
  className = '',
}) => {
  const ringStyle = RING_STYLES[focusState] || RING_STYLES.BACKGROUND_AWARE;

  return (
    <div
      className={`operator-focus-ring ${className}`}
      style={{
        position: 'relative',
        ...ringStyle,
      }}
      data-focus-state={focusState}
    >
      {children}
    </div>
  );
};

export default OperatorFocusRing;
