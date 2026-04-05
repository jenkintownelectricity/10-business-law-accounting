import React from 'react';
import { GhostViolationProps } from '../../lib/ghost/ghostReadOnlyContracts';

/**
 * GhostViolationOverlay
 * Overlay for constraint violations — crimson wireframe with badge.
 * READ-ONLY — renders violation data, cannot mutate state.
 */
export function GhostViolationOverlay({
  violations,
  visible,
  entityId,
  entityType,
  ghostLocked,
}: GhostViolationProps) {
  if (!visible || violations.length === 0) return null;

  return (
    <div
      className="cct-ghost-violation-overlay"
      role="alert"
      aria-live="assertive"
      style={{ borderColor: 'var(--cct-crimson, #dc2626)' }}
      data-ghost-locked={ghostLocked}
    >
      <div className="cct-ghost-violation-header">
        <span className="cct-badge cct-badge-crimson">
          {violations.length} Violation{violations.length !== 1 ? 's' : ''}
        </span>
        <span className="cct-ghost-violation-entity">
          {entityType} {entityId}
        </span>
      </div>
      <div className="cct-ghost-violation-list">
        {violations.map((violation, index) => (
          <div
            key={`${violation.field}-${index}`}
            className="cct-ghost-violation-item"
          >
            <span className="cct-ghost-violation-field">{violation.field}</span>
            <span className="cct-ghost-violation-type">{violation.divergence_type}</span>
            <div className="cct-ghost-violation-values">
              <span className="cct-ghost-violation-doctrine">
                Expected: {String(violation.doctrine_value ?? 'N/A')}
              </span>
              <span className="cct-ghost-violation-current">
                Actual: {String(violation.current_value ?? 'N/A')}
              </span>
            </div>
          </div>
        ))}
      </div>
      {ghostLocked && (
        <div className="cct-ghost-violation-lock-notice">
          Editing frozen — resolve violations before continuing.
        </div>
      )}
    </div>
  );
}
