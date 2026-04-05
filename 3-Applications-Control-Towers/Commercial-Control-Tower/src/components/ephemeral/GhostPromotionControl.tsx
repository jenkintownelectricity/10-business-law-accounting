import React, { useState } from 'react';

interface GhostPromotionControlProps {
  proposalId: string;
  onPromote: (id: string) => void;
}

/**
 * GhostPromotionControl
 * Explicit promote button with confirmation step.
 * Emits VKBUS signal on promote (via onPromote callback).
 * Promotion requires explicit operator action — no auto-solidification.
 */
export function GhostPromotionControl({ proposalId, onPromote }: GhostPromotionControlProps) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    // Confirmed — emit promotion
    onPromote(proposalId);
    setConfirming(false);
  };

  const handleCancel = () => {
    setConfirming(false);
  };

  return (
    <div className="cct-ghost-promotion-control">
      {confirming ? (
        <>
          <button
            onClick={handleClick}
            className="cct-btn-ghost cct-btn-confirm-promote"
            aria-label="Confirm promotion"
          >
            Confirm Promote
          </button>
          <button
            onClick={handleCancel}
            className="cct-btn-ghost cct-btn-cancel"
            aria-label="Cancel promotion"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={handleClick}
          className="cct-btn-ghost cct-btn-promote"
          aria-label="Promote proposal"
        >
          Promote
        </button>
      )}
    </div>
  );
}
