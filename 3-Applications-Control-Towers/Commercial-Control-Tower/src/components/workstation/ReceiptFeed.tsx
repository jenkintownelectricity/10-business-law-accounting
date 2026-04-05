import React from 'react';

export interface ReceiptFeedItem {
  receiptId: string;
  timestamp: string;
  operation: string;
  kernel: string;
  status: 'success' | 'failure' | 'pending';
  hasViolation: boolean;
}

export interface ReceiptFeedProps {
  items: ReceiptFeedItem[];
  maxVisible?: number;
  onReceiptClick?: (receiptId: string) => void;
  className?: string;
}

/**
 * ReceiptFeed
 *
 * Live feed of receipts from executed operations.
 * Operates at BACKGROUND_AWARE focus level.
 *
 * Contract:
 * - Read-only projection of receipt stream
 * - Does not execute or trigger operations
 * - Clicking a receipt navigates to detail, does not mutate
 * - Violations in receipts raise attention queue items, not forced focus
 */
export const ReceiptFeed: React.FC<ReceiptFeedProps> = ({
  items,
  maxVisible = 50,
  onReceiptClick,
  className,
}) => {
  const visibleItems = items.slice(0, maxVisible);

  return (
    <div
      className={`cct-receipt-feed ${className || ''}`}
      data-component="receipt-feed"
      data-focus-level="BACKGROUND_AWARE"
      role="log"
      aria-label="Receipt feed"
      aria-live="polite"
    >
      <header className="cct-receipt-feed__header">
        <h3 className="cct-receipt-feed__title">Receipts</h3>
        <span className="cct-receipt-feed__count">{items.length}</span>
      </header>
      <ul className="cct-receipt-feed__list">
        {visibleItems.map((item) => (
          <li
            key={item.receiptId}
            className={`cct-receipt-feed__item cct-receipt-feed__item--${item.status} ${item.hasViolation ? 'cct-receipt-feed__item--violation' : ''}`}
            data-receipt-id={item.receiptId}
            onClick={() => onReceiptClick?.(item.receiptId)}
          >
            <span className="cct-receipt-feed__item-op">{item.operation}</span>
            <span className="cct-receipt-feed__item-kernel">{item.kernel}</span>
            <span className="cct-receipt-feed__item-time">{item.timestamp}</span>
            {item.hasViolation && (
              <span className="cct-receipt-feed__item-violation-marker" aria-label="Has violation">!</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReceiptFeed;
