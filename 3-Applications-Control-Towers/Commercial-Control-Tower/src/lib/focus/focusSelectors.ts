/**
 * Focus Selectors
 * Pure selector functions for querying focus state from a snapshot.
 */

import { FocusEntry, FocusSnapshot, FocusState } from './focusTypes';

/** Returns the current PRIMARY_ACTIVE pane entry, or null. */
export function getPrimaryPane(snapshot: FocusSnapshot): FocusEntry | null {
  return snapshot.primary_active;
}

/** Returns all SECONDARY_CONTEXT panes. */
export function getSecondaryPanes(snapshot: FocusSnapshot): FocusEntry[] {
  return snapshot.secondary_context;
}

/** Returns all BACKGROUND_AWARE panes. */
export function getBackgroundPanes(snapshot: FocusSnapshot): FocusEntry[] {
  return snapshot.background_aware;
}

/** Returns the advisory queue entries, sorted by priority descending. */
export function getAdvisoryQueue(snapshot: FocusSnapshot): FocusEntry[] {
  return [...snapshot.advisory_queue];
}

/** Returns all INTERRUPTION_PENDING entries. */
export function getInterruptions(snapshot: FocusSnapshot): FocusEntry[] {
  return snapshot.interruption_pending;
}

/** True if the pane should be visually dimmed (not PRIMARY_ACTIVE). */
export function isPaneDimmed(snapshot: FocusSnapshot, paneId: string): boolean {
  if (snapshot.primary_active?.pane_id === paneId) return false;
  return true;
}

/** True if the pane is PRIMARY_ACTIVE. */
export function isPaneActive(snapshot: FocusSnapshot, paneId: string): boolean {
  return snapshot.primary_active?.pane_id === paneId;
}

/** True if the pane is in SECONDARY_CONTEXT. */
export function isPaneSecondary(snapshot: FocusSnapshot, paneId: string): boolean {
  return snapshot.secondary_context.some(e => e.pane_id === paneId);
}

/** True if the pane has an INTERRUPTION_PENDING state. */
export function isPaneInterrupting(snapshot: FocusSnapshot, paneId: string): boolean {
  return snapshot.interruption_pending.some(e => e.pane_id === paneId);
}

/** Returns the focus state for a given pane, or null if not tracked. */
export function getPaneFocusState(snapshot: FocusSnapshot, paneId: string): FocusState | null {
  if (snapshot.primary_active?.pane_id === paneId) return 'PRIMARY_ACTIVE';
  if (snapshot.secondary_context.some(e => e.pane_id === paneId)) return 'SECONDARY_CONTEXT';
  if (snapshot.background_aware.some(e => e.pane_id === paneId)) return 'BACKGROUND_AWARE';
  if (snapshot.advisory_queue.some(e => e.pane_id === paneId)) return 'ADVISORY_QUEUE';
  if (snapshot.interruption_pending.some(e => e.pane_id === paneId)) return 'INTERRUPTION_PENDING';
  return null;
}

/** Returns the entry for a given pane across all state buckets. */
export function getPaneEntry(snapshot: FocusSnapshot, paneId: string): FocusEntry | null {
  if (snapshot.primary_active?.pane_id === paneId) return snapshot.primary_active;
  const allEntries = [
    ...snapshot.secondary_context,
    ...snapshot.background_aware,
    ...snapshot.advisory_queue,
    ...snapshot.interruption_pending,
  ];
  return allEntries.find(e => e.pane_id === paneId) || null;
}

/** True if quiet mode is active. */
export function isQuietMode(snapshot: FocusSnapshot): boolean {
  return snapshot.quiet_mode;
}

/** True if locked review is active. */
export function isLockedReview(snapshot: FocusSnapshot): boolean {
  return snapshot.locked_review;
}

/** Returns the count of pending advisory items. */
export function getAdvisoryCount(snapshot: FocusSnapshot): number {
  return snapshot.advisory_queue.length;
}

/** Returns the count of pending interruptions. */
export function getInterruptionCount(snapshot: FocusSnapshot): number {
  return snapshot.interruption_pending.length;
}
