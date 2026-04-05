import React from 'react';
import { ConfidenceBadge } from './ConfidenceBadge';
import { RouteBadge } from './RouteBadge';
import { SourceBadge, type SourceSystem } from './SourceBadge';
import { TrustStateBadge } from './TrustStateBadge';
import { ViolationBadge, type ViolationState } from './ViolationBadge';
import { FocusBadge } from './FocusBadge';
import type { TrustState } from '../../lib/badges/trustBadgeRules';
import type { FocusLevel } from '../../lib/badges/focusLabelMap';

export interface GhostBadgeStripProps {
  confidence: number;
  route: string;
  source: SourceSystem;
  trustState: TrustState;
  violationState: ViolationState;
  violationMessage?: string;
  focusLevel?: FocusLevel;
  className?: string;
}

/**
 * GhostBadgeStrip
 *
 * Horizontal strip showing all badges in mandatory order:
 * [CONFIDENCE] [ROUTE] [SOURCE] [TRUST STATE] [VIOLATION] [FOCUS IF APPLICABLE]
 *
 * Badge order is fixed and non-negotiable. This ensures consistent
 * visual scanning across all ghost overlays and pane headers.
 *
 * Read-only display component -- no mutation paths.
 */
export const GhostBadgeStrip: React.FC<GhostBadgeStripProps> = ({
  confidence,
  route,
  source,
  trustState,
  violationState,
  violationMessage,
  focusLevel,
  className,
}) => {
  return (
    <div
      className={`cct-badge-strip ${className || ''}`}
      role="group"
      aria-label="Badge strip"
      data-component="ghost-badge-strip"
    >
      <ConfidenceBadge score={confidence} />
      <RouteBadge route={route} />
      <SourceBadge source={source} />
      <TrustStateBadge state={trustState} />
      <ViolationBadge state={violationState} message={violationMessage} />
      {focusLevel && <FocusBadge level={focusLevel} />}
    </div>
  );
};

export default GhostBadgeStrip;
