import React from 'react';

export interface PulseReceiptItem {
  receiptId: string;
  timestamp: string;
  operation: string;
  kernel: string;
  status: 'success' | 'failure' | 'pending';
  isNew: boolean;
  hasViolation: boolean;
  confidence: number;
}

export interface ReceiptPulseFeedProps {
  items: PulseReceiptItem[];
  maxVisible?: number;
  onReceiptSelect?: (receiptId: string) => void;
  className?: string;
}

/**
 * ReceiptPulseFeed
 *
 * Live receipt feed with pulse animation on new receipts.
 * Operates at BACKGROUND_AWARE focus level.
 *
 * Animation contract:
 * - New receipts pulse briefly on arrival
 * - Pulse animation respects prefers-reduced-motion
 * - Violations pulse crimson, not amber
 * - Feed does not auto-scroll to disrupt reading position
 */
export const ReceiptPulseFeed: React.FC<ReceiptPulseFeedProps> = ({
  items,
  maxVisible = 100,
  onReceiptSelect,
  className,
}) => {
  const visibleItems = items.slice(0, maxVisible);

  return (
    <div
      className={`cct-receipt-pulse-feed ${className || ''}`}
      data-component="receipt-pulse-feed"
      data-focus-level="BACKGROUND_AWARE"
      role="log"
      aria-label="Live receipt feed"
      aria-live="polite"
    >
      <header className="cct-receipt-pulse-feed__header">
        <h3 className="cct-receipt-pulse-feed__title">Receipt Feed</h3>
        <span className="cct-receipt-pulse-feed__count">{items.length} total</span>
      </header>
      <ul className="cct-receipt-pulse-feed__list">
        {visibleItems.map((item) => (
          <li
            key={item.receiptId}
            className={[
              'cct-receipt-pulse-feed__item',
              `cct-receipt-pulse-feed__item--${item.status}`,
              item.isNew ? 'cct-receipt-pulse-feed__item--pulse' : '',
              item.hasViolation ? 'cct-receipt-pulse-feed__item--violation-pulse' : '',
            ].filter(Boolean).join(' ')}
            data-receipt-id={item.receiptId}
            onClick={() => onReceiptSelect?.(item.receiptId)}
          >
            <span className="cct-receipt-pulse-feed__item-status" aria-hidden="true">
              {item.status === 'success' ? '●' : item.status === 'failure' ? '✕' : '◌'}
            </span>
            <span className="cct-receipt-pulse-feed__item-op">{item.operation}</span>
            <span className="cct-receipt-pulse-feed__item-kernel">{item.kernel}</span>
            <span className="cct-receipt-pulse-feed__item-confidence">
              {Math.round(item.confidence * 100)}%
            </span>
            <time className="cct-receipt-pulse-feed__item-time">{item.timestamp}</time>
            {item.hasViolation && (
              <span className="cct-receipt-pulse-feed__violation-marker" role="alert">VIOLATION</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceiptPulseFeed;
