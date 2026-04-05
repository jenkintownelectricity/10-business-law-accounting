/**
 * Lineage Selectors
 *
 * Selectors for querying receipt and lineage data.
 * Pure functions -- no side effects, no state mutation.
 */

import type { ReceiptFeedItem } from './receiptFeedStore';

export interface TimelineEntry {
  receiptId: string;
  timestamp: string;
  operation: string;
  kernel: string;
  entityId: string;
  status: 'success' | 'failure' | 'pending';
  depth: number;
  parentReceiptId?: string;
}

/**
 * Get all receipts for a specific entity, ordered by timestamp descending.
 */
export function getReceiptsForEntity(
  items: ReceiptFeedItem[],
  entityId: string
): ReceiptFeedItem[] {
  return items
    .filter((item) => item.entityId === entityId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Build a timeline of receipts with parent-child depth tracking.
 */
export function getReceiptTimeline(items: ReceiptFeedItem[]): TimelineEntry[] {
  const parentMap = new Map<string, string>();
  items.forEach((item) => {
    if (item.parentReceiptId) {
      parentMap.set(item.receiptId, item.parentReceiptId);
    }
  });

  function getDepth(receiptId: string, visited: Set<string> = new Set()): number {
    if (visited.has(receiptId)) return 0; // prevent cycles
    visited.add(receiptId);
    const parentId = parentMap.get(receiptId);
    if (!parentId) return 0;
    return 1 + getDepth(parentId, visited);
  }

  return items
    .map((item) => ({
      receiptId: item.receiptId,
      timestamp: item.timestamp,
      operation: item.operation,
      kernel: item.kernel,
      entityId: item.entityId,
      status: item.status,
      depth: getDepth(item.receiptId),
      parentReceiptId: item.parentReceiptId,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Get the latest receipt for a given entity.
 */
export function getLatestReceipt(
  items: ReceiptFeedItem[],
  entityId: string
): ReceiptFeedItem | undefined {
  const entityReceipts = getReceiptsForEntity(items, entityId);
  return entityReceipts[0];
}

/**
 * Get all receipts with violations.
 */
export function getViolationReceipts(items: ReceiptFeedItem[]): ReceiptFeedItem[] {
  return items.filter((item) => item.hasViolation);
}

/**
 * Get receipt chain (lineage) from a receipt back to root.
 */
export function getReceiptChain(
  items: ReceiptFeedItem[],
  receiptId: string
): ReceiptFeedItem[] {
  const itemMap = new Map(items.map((i) => [i.receiptId, i]));
  const chain: ReceiptFeedItem[] = [];
  let current = itemMap.get(receiptId);
  const visited = new Set<string>();

  while (current && !visited.has(current.receiptId)) {
    visited.add(current.receiptId);
    chain.unshift(current);
    current = current.parentReceiptId ? itemMap.get(current.parentReceiptId) : undefined;
  }

  return chain;
}
