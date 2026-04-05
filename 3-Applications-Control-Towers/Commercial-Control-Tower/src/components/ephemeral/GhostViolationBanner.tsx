import React from 'react';
import { ViolationState } from '../../lib/ephemeral/ephemeralTypes';

interface GhostViolationBannerProps {
  violationState: ViolationState;
  proposalId: string;
}

/**
 * GhostViolationBanner
 * Crimson wireframe banner for violations detected in ephemeral proposals.
 * Renders only when violationState is WARNING or CRITICAL.
 * READ-ONLY display — does not mutate state.
 */
export function GhostViolationBanner({ violationState, proposalId }: GhostViolationBannerProps) {
  if (violationState === 'NONE') return null;

  const isCritical = violationState === 'CRITICAL';

  return (
    <div
      className={`cct-ghost-violation-banner cct-ghost-violation-${violationState.toLowerCase()}`}
      role="alert"
      aria-live={isCritical ? 'assertive' : 'polite'}
      style={{ borderColor: 'var(--cct-crimson, #dc2626)' }}
      data-proposal-id={proposalId}
    >
      <span className={`cct-badge ${isCritical ? 'cct-badge-crimson' : 'cct-badge-warning'}`}>
        {violationState}
      </span>
      <span className="cct-ghost-violation-banner-text">
        {isCritical
          ? 'Critical constraint violation detected. Review required before promotion.'
          : 'Warning: potential constraint issue detected in this proposal.'}
      </span>
    </div>
  );
}
