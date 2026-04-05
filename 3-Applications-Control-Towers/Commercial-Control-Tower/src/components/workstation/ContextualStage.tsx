import React from 'react';
import type { FocusLevel } from '../../lib/badges/focusLabelMap';
import { getFocusLabel } from '../../lib/badges/focusLabelMap';

export interface ContextualStageProps {
  focusLevel: FocusLevel;
  paneId: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * ContextualStage
 *
 * Stage area for the main working content.
 * Applies focus ring and dimming based on focus state.
 *
 * Rendering rules:
 * - PRIMARY_ACTIVE: full opacity, visible focus ring, full interaction
 * - SECONDARY: slight dim, thin focus ring
 * - ADVISORY: notable dim, dashed ring, read-only interaction
 * - BACKGROUND_AWARE: heavy dim, no ring, minimal updates
 * - QUIET: maximum dim, suppressed notifications
 * - LOCKED_REVIEW: full opacity, thick ring, no focus changes
 */
export const ContextualStage: React.FC<ContextualStageProps> = ({
  focusLevel,
  paneId,
  label,
  children,
  className,
}) => {
  const focusInfo = getFocusLabel(focusLevel);

  return (
    <section
      className={`cct-contextual-stage cct-contextual-stage--${focusLevel.toLowerCase()} ${className || ''}`}
      style={{
        opacity: focusInfo.dimOpacity,
        borderColor: focusInfo.color,
        borderWidth: `${focusInfo.ringWidth}px`,
        borderStyle: focusLevel === 'ADVISORY' || focusLevel === 'BACKGROUND_AWARE' ? 'dashed' : 'solid',
      }}
      data-component="contextual-stage"
      data-pane-id={paneId}
      data-focus-level={focusLevel}
      role="region"
      aria-label={`${label} (${focusInfo.label})`}
    >
      <div className="cct-contextual-stage__content">
        {children}
      </div>
      {focusLevel === 'LOCKED_REVIEW' && (
        <div className="cct-contextual-stage__lock-indicator" aria-hidden="true">
          <span className="cct-contextual-stage__lock-icon">LOCKED</span>
        </div>
      )}
    </section>
  );
};

export default ContextualStage;
