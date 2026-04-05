import React from 'react';
import { PinnedEvidence } from '../../lib/focus/pinnedEvidenceStore';
import { PinnedEvidenceCard } from './PinnedEvidenceCard';

interface EvidencePinTrayProps {
  pins: PinnedEvidence[];
  onUnpin: (pinId: string) => void;
  onSelect: (pinId: string) => void;
}

/**
 * EvidencePinTray
 * Tray component showing pinned evidence items as persistent secondary context.
 * Pinned evidence remains visible regardless of focus transitions or layout changes.
 * AI summaries cannot displace items in this tray.
 */
export function EvidencePinTray({ pins, onUnpin, onSelect }: EvidencePinTrayProps) {
  if (pins.length === 0) return null;

  return (
    <div className="cct-evidence-pin-tray" role="region" aria-label="Pinned Evidence">
      <div className="cct-pin-tray-header">
        <span className="cct-pin-tray-title">Pinned Evidence</span>
        <span className="cct-pin-tray-count">{pins.length}</span>
      </div>
      <div className="cct-pin-tray-list" role="list">
        {pins.map((pin) => (
          <PinnedEvidenceCard
            key={pin.pin_id}
            pin={pin}
            onUnpin={onUnpin}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
