import React from 'react';
import { GhostBadgeStrip } from '../badges/GhostBadgeStrip';
import type { SourceSystem } from '../badges/SourceBadge';
import type { ViolationState } from '../badges/ViolationBadge';
import type { TrustState } from '../../lib/badges/trustBadgeRules';

export interface ReceiptTimelineCardProps {
  receiptId: string;
  timestamp: string;
  operation: string;
  kernel: string;
  route: string;
  source: SourceSystem;
  confidence: number;
  trustState: TrustState;
  violationState: ViolationState;
  violationMessage?: string;
  entityId: string;
  parentReceiptId?: string;
  onSelect?: (receiptId: string) => void;
  className?: string;
}

/**
 * ReceiptTimelineCard
 *
 * Individual receipt card in timeline format.
 * Displays full badge strip and receipt metadata.
 * Read-only -- clicking navigates, does not mutate.
 */
export const ReceiptTimelineCard: React.FC<ReceiptTimelineCardProps> = ({
  receiptId,
  timestamp,
  operation,
  kernel,
  route,
  source,
  confidence,
  trustState,
  violationState,
  violationMessage,
  entityId,
  parentReceiptId,
  onSelect,
  className,
}) => {
  return (
    <article
      className={`cct-receipt-timeline-card ${className || ''}`}
      data-component="receipt-timeline-card"
      data-receipt-id={receiptId}
      data-entity-id={entityId}
      onClick={() => onSelect?.(receiptId)}
      role="article"
      aria-label={`Receipt: ${operation} on ${kernel}`}
    >
      <header className="cct-receipt-timeline-card__header">
        <GhostBadgeStrip
          confidence={confidence}
          route={route}
          source={source}
          trustState={trustState}
          violationState={violationState}
          violationMessage={violationMessage}
        />
      </header>
      <div className="cct-receipt-timeline-card__body">
        <div className="cct-receipt-timeline-card__operation">{operation}</div>
        <div className="cct-receipt-timeline-card__meta">
          <span className="cct-receipt-timeline-card__kernel">{kernel}</span>
          <time className="cct-receipt-timeline-card__time">{timestamp}</time>
        </div>
        <div className="cct-receipt-timeline-card__ids">
          <span className="cct-receipt-timeline-card__receipt-id">Receipt: {receiptId.slice(0, 12)}</span>
          <span className="cct-receipt-timeline-card__entity-id">Entity: {entityId.slice(0, 12)}</span>
          {parentReceiptId && (
            <span className="cct-receipt-timeline-card__parent-id">
              Parent: {parentReceiptId.slice(0, 12)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ReceiptTimelineCard;
