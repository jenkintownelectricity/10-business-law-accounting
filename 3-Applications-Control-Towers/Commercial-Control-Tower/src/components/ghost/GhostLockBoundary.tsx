import React from 'react';
import { GhostLockProps } from '../../lib/ghost/ghostReadOnlyContracts';

/**
 * GhostLockBoundary
 * Ghost Lock — freezes editing locally when engaged.
 * Does NOT mutate domain truth. Local-only UI freeze.
 *
 * When locked, children are rendered but interaction is disabled
 * via pointer-events and aria attributes. No domain mutations occur.
 */
export function GhostLockBoundary({ locked, lockReason, children }: GhostLockProps) {
  return (
    <div
      className={`cct-ghost-lock-boundary ${locked ? 'cct-ghost-locked' : ''}`}
      aria-disabled={locked}
      data-ghost-locked={locked}
    >
      {locked && (
        <div className="cct-ghost-lock-banner" role="alert">
          <span className="cct-badge cct-badge-crimson">Ghost Lock</span>
          <span className="cct-ghost-lock-reason">{lockReason}</span>
        </div>
      )}
      <div
        className="cct-ghost-lock-content"
        style={locked ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
        aria-hidden={locked}
      >
        {children}
      </div>
    </div>
  );
}
