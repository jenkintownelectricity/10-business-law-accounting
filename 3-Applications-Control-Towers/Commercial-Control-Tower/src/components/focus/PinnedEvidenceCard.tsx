import React from 'react';
import { PinnedEvidence } from '../../lib/focus/pinnedEvidenceStore';

interface PinnedEvidenceCardProps {
  pin: PinnedEvidence;
  onUnpin: (pinId: string) => void;
  onSelect: (pinId: string) => void;
}

/**
 * PinnedEvidenceCard
 * Card for a single pinned evidence item with unpin action.
 * Displays entity label, type, content reference, and pinned timestamp.
 */
export function PinnedEvidenceCard({ pin, onUnpin, onSelect }: PinnedEvidenceCardProps) {
  return (
    <div
      className="cct-pinned-evidence-card"
      role="listitem"
      onClick={() => onSelect(pin.pin_id)}
    >
      <div className="cct-pinned-evidence-header">
        <span className="cct-pinned-evidence-type">{pin.entity_type}</span>
        {pin.stable_reference && (
          <span className="cct-badge cct-badge-stable" title="Stable reference">Stable</span>
        )}
      </div>
      <div className="cct-pinned-evidence-label">{pin.label}</div>
      <div className="cct-pinned-evidence-ref">{pin.content_ref}</div>
      <div className="cct-pinned-evidence-meta">
        <span className="cct-pinned-evidence-by">{pin.pinned_by}</span>
        <span className="cct-pinned-evidence-at">
          {new Date(pin.pinned_at).toLocaleTimeString()}
        </span>
      </div>
      <div className="cct-pinned-evidence-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnpin(pin.pin_id);
          }}
          className="cct-btn-ghost cct-btn-unpin"
          aria-label={`Unpin ${pin.label}`}
        >
          Unpin
        </button>
      </div>
    </div>
  );
}
