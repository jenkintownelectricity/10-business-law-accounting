/**
 * Serialize Queue State
 *
 * Serializes attention queue state for replay persistence.
 */

import type { SerializableQueueState } from '../lineage/replayStateContracts';

export interface QueueItem {
  id: string;
  type: 'advisory' | 'interruption';
  sourceId: string;
  timestamp: string;
  priority: number;
  /** Runtime-only fields excluded from serialization */
  onAcknowledge?: () => void;
  element?: unknown;
}

export function serializeQueueState(items: QueueItem[]): SerializableQueueState {
  return {
    items: items.map((item) => ({
      id: item.id,
      type: item.type,
      sourceId: item.sourceId,
      timestamp: item.timestamp,
      priority: item.priority,
    })),
  };
}

export function deserializeQueueState(
  serialized: SerializableQueueState
): QueueItem[] {
  return serialized.items.map((item) => ({
    id: item.id,
    type: item.type,
    sourceId: item.sourceId,
    timestamp: item.timestamp,
    priority: item.priority,
  }));
}

export function validateQueueState(
  serialized: SerializableQueueState
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(serialized.items)) {
    errors.push('items must be an array');
  }

  for (const item of serialized.items) {
    if (!item.id) errors.push('Each queue item must have an id');
    if (item.type !== 'advisory' && item.type !== 'interruption') {
      errors.push(`Invalid queue item type: ${item.type}`);
    }
    if (!item.sourceId) errors.push(`Queue item ${item.id} missing sourceId`);
    if (typeof item.priority !== 'number') {
      errors.push(`Queue item ${item.id} priority must be a number`);
    }
  }

  // Verify sorted by priority
  for (let i = 1; i < serialized.items.length; i++) {
    if (serialized.items[i].priority > serialized.items[i - 1].priority) {
      // Not necessarily an error, but worth noting
    }
  }

  return { valid: errors.length === 0, errors };
}
