import React from 'react';

interface GhostDismissControlProps {
  proposalId: string;
  onDismiss: (id: string) => void;
}

/**
 * GhostDismissControl
 * Dismiss button for ephemeral proposals.
 * Dismiss is UI lifecycle only — no domain truth mutation occurs.
 * The proposal transitions to DISMISSED status in the ephemeral buffer.
 */
export function GhostDismissControl({ proposalId, onDismiss }: GhostDismissControlProps) {
  return (
    <button
      className="cct-btn-ghost cct-btn-dismiss"
      onClick={() => onDismiss(proposalId)}
      aria-label="Dismiss proposal"
    >
      Dismiss
    </button>
  );
}
