import React from 'react';
import { TruthDelta } from '../../lib/ghost/calculateTruthDelta';
import { ReadOnlyGhostProps } from '../../lib/ghost/ghostReadOnlyContracts';
import { GhostDeltaHighlight } from './GhostDeltaHighlight';
import { GhostViolationOverlay } from './GhostViolationOverlay';

interface GhostLayerProps extends ReadOnlyGhostProps {
  /** Whether ghost lock is engaged for this entity */
  readonly ghostLocked: boolean;
}

/**
 * GhostLayer
 * Main ghost layer component. Renders only from doctrine + selector inputs.
 * Shows divergence zones, not full-screen fog. READ-ONLY — no mutation callbacks.
 *
 * This component overlays the current pane to show where the current state
 * diverges from doctrine truth. It renders only delta zones, not a blanket overlay.
 */
export function GhostLayer({
  deltas,
  visible,
  entityId,
  entityType,
  ghostLocked,
}: GhostLayerProps) {
  if (!visible || deltas.length === 0) return null;

  const violations = deltas.filter(
    (d) => d.divergence_type === 'violated' || d.severity === 'critical',
  );
  const nonViolations = deltas.filter(
    (d) => d.divergence_type !== 'violated' && d.severity !== 'critical',
  );

  return (
    <div
      className="cct-ghost-layer"
      role="region"
      aria-label={`Ghost overlay for ${entityType} ${entityId}`}
      data-ghost-locked={ghostLocked}
    >
      {violations.length > 0 && (
        <GhostViolationOverlay
          deltas={deltas}
          violations={violations}
          visible={visible}
          entityId={entityId}
          entityType={entityType}
          ghostLocked={ghostLocked}
        />
      )}
      {nonViolations.map((delta, index) => (
        <GhostDeltaHighlight
          key={`${delta.field}-${index}`}
          delta={delta}
          entityId={entityId}
          entityType={entityType}
        />
      ))}
    </div>
  );
}
