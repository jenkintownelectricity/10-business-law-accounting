/**
 * PaneDimmer
 * Dims non-primary panes based on focus state.
 * SECONDARY_CONTEXT gets controlled dimming, not disappearance.
 * BACKGROUND_AWARE remains visible for orientation.
 */

import React from 'react';
import { FocusState } from '../../lib/focus/focusTypes';

interface PaneDimmerProps {
  focusState: FocusState;
  children: React.ReactNode;
  className?: string;
}

const DIMMING_LEVELS: Record<FocusState, number> = {
  PRIMARY_ACTIVE: 1.0,
  SECONDARY_CONTEXT: 0.75,
  BACKGROUND_AWARE: 0.5,
  ADVISORY_QUEUE: 0.6,
  INTERRUPTION_PENDING: 0.9,
  LOCKED_REVIEW: 1.0,
  QUIET_MODE: 0.4,
};

const PaneDimmer: React.FC<PaneDimmerProps> = ({
  focusState,
  children,
  className = '',
}) => {
  const opacity = DIMMING_LEVELS[focusState] ?? 0.5;
  const isActive = focusState === 'PRIMARY_ACTIVE' || focusState === 'LOCKED_REVIEW';

  return (
    <div
      className={`pane-dimmer ${className}`}
      style={{
        opacity,
        transition: 'opacity 0.2s ease',
        pointerEvents: isActive ? 'auto' : 'auto',
        filter: focusState === 'QUIET_MODE' ? 'saturate(0.5)' : 'none',
      }}
      data-focus-state={focusState}
      data-dimmed={!isActive}
      aria-hidden={focusState === 'QUIET_MODE'}
    >
      {children}
    </div>
  );
};

export default PaneDimmer;
