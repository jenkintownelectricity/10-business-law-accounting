import React from 'react';
import { GhostHistoryProps, GhostHistoryEntry } from '../../lib/ghost/ghostReadOnlyContracts';

/**
 * GhostHistoryTrail
 * Shows serializable historical references for the current entity.
 * READ-ONLY — renders history data, cannot mutate state.
 * All entries are replay-safe and serializable.
 */
export function GhostHistoryTrail({
  visible,
  entityId,
  entityType,
  history,
}: GhostHistoryProps) {
  if (!visible || history.length === 0) return null;

  return (
    <div
      className="cct-ghost-history-trail"
      role="log"
      aria-label={`History trail for ${entityType} ${entityId}`}
    >
      <div className="cct-ghost-history-header">
        <span className="cct-ghost-history-title">History Trail</span>
        <span className="cct-ghost-history-count">{history.length} entries</span>
      </div>
      <div className="cct-ghost-history-entries">
        {history.map((entry, index) => (
          <GhostHistoryEntryRow key={`${entry.timestamp}-${entry.field}-${index}`} entry={entry} />
        ))}
      </div>
    </div>
  );
}

interface GhostHistoryEntryRowProps {
  readonly entry: GhostHistoryEntry;
}

function GhostHistoryEntryRow({ entry }: GhostHistoryEntryRowProps) {
  return (
    <div className="cct-ghost-history-entry">
      <span className="cct-ghost-history-timestamp">
        {new Date(entry.timestamp).toLocaleString()}
      </span>
      <span className="cct-ghost-history-field">{entry.field}</span>
      <span className="cct-ghost-history-source">{entry.source}</span>
      <div className="cct-ghost-history-change">
        <span className="cct-ghost-history-prev">{String(entry.previous_value ?? 'N/A')}</span>
        <span className="cct-ghost-history-arrow">&rarr;</span>
        <span className="cct-ghost-history-new">{String(entry.new_value ?? 'N/A')}</span>
      </div>
    </div>
  );
}
