/**
 * Focus Transition Logic
 * Orchestrates focus changes through the store with rule validation.
 */

import { FocusPriority, FocusTransition } from './focusTypes';
import { OperatorFocusStore } from './operatorFocusStore';
import { validateFocusTransition, canInterrupt } from './focusRules';

export interface TransitionResult {
  success: boolean;
  transition: FocusTransition | null;
  reason: string;
}

/**
 * Handles an operator or system focus request with full validation.
 */
export function handleFocusRequest(
  store: OperatorFocusStore,
  paneId: string,
  paneType: string,
  priority: FocusPriority,
  initiatedBy: 'operator' | 'system' | 'advisory',
  entityId?: string,
  entityType?: string
): TransitionResult {
  const snapshot = store.getSnapshot();
  const validation = validateFocusTransition(snapshot, paneId, 'PRIMARY_ACTIVE', initiatedBy, priority);

  if (!validation.allowed) {
    // If system/advisory, try to place in advisory queue instead
    if (initiatedBy !== 'operator') {
      const queued = store.requestAdvisoryFocus(paneId, paneType, priority);
      return {
        success: queued,
        transition: null,
        reason: queued ? 'Placed in advisory queue.' : validation.reason,
      };
    }
    return { success: false, transition: null, reason: validation.reason };
  }

  const transition = store.setPrimaryActive(paneId, paneType, priority, entityId, entityType);
  return {
    success: transition !== null,
    transition,
    reason: transition ? 'Focus transferred.' : 'Focus transfer failed (locked review).',
  };
}

/**
 * Handles an interruption request (e.g., critical violation detected).
 * Does NOT steal PRIMARY_ACTIVE — raises INTERRUPTION_PENDING.
 */
export function handleInterruptionRequest(
  store: OperatorFocusStore,
  paneId: string,
  paneType: string,
  priority: FocusPriority,
  reason: string
): TransitionResult {
  const snapshot = store.getSnapshot();

  if (!canInterrupt(snapshot, priority)) {
    return { success: false, transition: null, reason: 'Priority level cannot interrupt.' };
  }

  const accepted = store.requestInterruption(paneId, paneType, reason);
  return {
    success: accepted,
    transition: null,
    reason: accepted ? 'Interruption pending — awaiting operator acknowledgment.' : 'Interruption rejected.',
  };
}

/**
 * Handles quiet mode toggle. Returns the new quiet mode state.
 */
export function handleQuietModeToggle(store: OperatorFocusStore): boolean {
  return store.toggleQuietMode();
}

/**
 * Handles locked review toggle.
 */
export function handleLockedReviewToggle(store: OperatorFocusStore, lock: boolean): void {
  if (lock) {
    store.enterLockedReview();
  } else {
    store.exitLockedReview();
  }
}

/**
 * Cycles focus to the next pane in the entry list.
 */
export function handleFocusNext(store: OperatorFocusStore): TransitionResult {
  if (store.isLockedReview()) {
    return { success: false, transition: null, reason: 'Cannot cycle focus during locked review.' };
  }
  const transition = store.focusNext();
  return {
    success: transition !== null,
    transition,
    reason: transition ? 'Cycled to next pane.' : 'No panes to cycle.',
  };
}

/**
 * Cycles focus to the previous pane in the entry list.
 */
export function handleFocusPrev(store: OperatorFocusStore): TransitionResult {
  if (store.isLockedReview()) {
    return { success: false, transition: null, reason: 'Cannot cycle focus during locked review.' };
  }
  const transition = store.focusPrev();
  return {
    success: transition !== null,
    transition,
    reason: transition ? 'Cycled to previous pane.' : 'No panes to cycle.',
  };
}
