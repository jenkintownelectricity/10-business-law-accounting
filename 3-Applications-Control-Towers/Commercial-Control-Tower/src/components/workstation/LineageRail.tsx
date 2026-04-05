import React from 'react';

export interface LineageEntry {
  receiptId: string;
  timestamp: string;
  operation: string;
  entityId: string;
  status: 'success' | 'failure' | 'pending';
}

export interface LineageRailProps {
  entries: LineageEntry[];
  activeEntityId?: string;
  onReceiptSelect?: (receiptId: string) => void;
  className?: string;
}

/**
 * LineageRail
 *
 * Right rail showing receipt feed and lineage trail for the active entity.
 * Operates at BACKGROUND_AWARE focus level by default.
 *
 * Read-only projection of receipt history. Does not execute operations.
 */
export const LineageRail: React.FC<LineageRailProps> = ({
  entries,
  activeEntityId,
  onReceiptSelect,
  className,
}) => {
  const filteredEntries = activeEntityId
    ? entries.filter(e => e.entityId === activeEntityId)
    : entries;

  return (
    <aside
      className={`cct-lineage-rail ${className || ''}`}
      data-component="lineage-rail"
      data-active-entity={activeEntityId}
      data-focus-level="BACKGROUND_AWARE"
      role="complementary"
      aria-label="Lineage trail"
    >
      <header className="cct-lineage-rail__header">
        <h3 className="cct-lineage-rail__title">Lineage</h3>
        {activeEntityId && (
          <span className="cct-lineage-rail__entity-ref">{activeEntityId.slice(0, 12)}</span>
        )}
      </header>
      <ol className="cct-lineage-rail__entries" role="list">
        {filteredEntries.map((entry) => (
          <li
            key={entry.receiptId}
            className={`cct-lineage-rail__entry cct-lineage-rail__entry--${entry.status}`}
            data-receipt-id={entry.receiptId}
            onClick={() => onReceiptSelect?.(entry.receiptId)}
            role="listitem"
          >
            <span className="cct-lineage-rail__entry-op">{entry.operation}</span>
            <span className="cct-lineage-rail__entry-time">{entry.timestamp}</span>
            <span className="cct-lineage-rail__entry-status">{entry.status}</span>
          </li>
        ))}
        {filteredEntries.length === 0 && (
          <li className="cct-lineage-rail__empty">No lineage entries</li>
        )}
      </ol>
    </aside>
  );
};

export default LineageRail;
