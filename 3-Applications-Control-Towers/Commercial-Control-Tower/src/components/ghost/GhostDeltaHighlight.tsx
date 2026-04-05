import React from 'react';
import { TruthDelta } from '../../lib/ghost/calculateTruthDelta';

interface GhostDeltaHighlightProps {
  /** The truth delta to highlight */
  readonly delta: TruthDelta;
  /** Entity ID for context */
  readonly entityId: string;
  /** Entity type for context */
  readonly entityType: string;
}

/**
 * GhostDeltaHighlight
 * Highlights a specific field that diverges from doctrine.
 * READ-ONLY — renders delta data, cannot mutate state.
 */
export function GhostDeltaHighlight({
  delta,
  entityId,
  entityType,
}: GhostDeltaHighlightProps) {
  return (
    <div
      className={`cct-ghost-delta-highlight cct-ghost-delta-${delta.divergence_type} cct-ghost-severity-${delta.severity}`}
      role="status"
      aria-label={`${delta.divergence_type} delta on field ${delta.field}`}
    >
      <div className="cct-ghost-delta-header">
        <span className={`cct-badge cct-badge-${delta.severity}`}>
          {delta.divergence_type}
        </span>
        <span className="cct-ghost-delta-field">{delta.field}</span>
      </div>
      <div className="cct-ghost-delta-values">
        {delta.doctrine_value !== undefined && (
          <div className="cct-ghost-delta-doctrine">
            <span className="cct-ghost-delta-label">Doctrine:</span>
            <span className="cct-ghost-delta-value">{String(delta.doctrine_value)}</span>
          </div>
        )}
        {delta.current_value !== undefined && (
          <div className="cct-ghost-delta-current">
            <span className="cct-ghost-delta-label">Current:</span>
            <span className="cct-ghost-delta-value">{String(delta.current_value)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
