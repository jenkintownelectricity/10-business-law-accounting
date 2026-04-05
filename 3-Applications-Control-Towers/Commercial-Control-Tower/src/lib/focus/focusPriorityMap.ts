/**
 * Focus Priority Map
 * Numeric ordering for focus priorities. Higher value = higher priority.
 */

import { FocusPriority } from './focusTypes';

export const FOCUS_PRIORITY_ORDER: Record<FocusPriority, number> = {
  CRITICAL_VIOLATION: 100,
  ACTIVE_REVIEW_TARGET: 90,
  SELECTED_EVIDENCE: 70,
  EPHEMERAL_PROPOSAL: 40,
  SEARCH_RESULTS: 30,
  RECEIPT_FEED: 20,
  WAVEFORM_MONITOR: 10,
};

/**
 * Compare two priorities. Returns positive if a > b, negative if a < b, 0 if equal.
 */
export function comparePriority(a: FocusPriority, b: FocusPriority): number {
  return FOCUS_PRIORITY_ORDER[a] - FOCUS_PRIORITY_ORDER[b];
}

/**
 * Returns the higher priority of two.
 */
export function higherPriority(a: FocusPriority, b: FocusPriority): FocusPriority {
  return FOCUS_PRIORITY_ORDER[a] >= FOCUS_PRIORITY_ORDER[b] ? a : b;
}
