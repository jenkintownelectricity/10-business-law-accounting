/**
 * Focus Rules Enforcement
 * Validates focus transitions and enforces operator-sovereignty constraints.
 * AI systems cannot steal PRIMARY_ACTIVE focus.
 */

import { FocusState, FocusPriority, FocusSnapshot } from './focusTypes';

export interface FocusValidationResult {
  allowed: boolean;
  reason: string;
}

/**
 * Validates whether a focus transition is permitted.
 * Checks locked review, quiet mode, and AI focus theft prevention.
 */
export function validateFocusTransition(
  snapshot: FocusSnapshot,
  targetPaneId: string,
  targetState: FocusState,
  initiatedBy: 'operator' | 'system' | 'advisory',
  priority: FocusPriority
): FocusValidationResult {
  // Locked review: only operator can change focus
  if (snapshot.locked_review && initiatedBy !== 'operator') {
    return { allowed: false, reason: 'Focus is locked for review. Only operator can change focus.' };
  }

  // AI/system cannot claim PRIMARY_ACTIVE — must go through ADVISORY_QUEUE
  if (targetState === 'PRIMARY_ACTIVE' && initiatedBy !== 'operator') {
    return { allowed: false, reason: 'Only the operator can set PRIMARY_ACTIVE focus. System/advisory must use ADVISORY_QUEUE.' };
  }

  // Quiet mode suppresses non-critical advisory requests
  if (snapshot.quiet_mode && initiatedBy === 'advisory' && priority !== 'CRITICAL_VIOLATION') {
    return { allowed: false, reason: 'Quiet mode is active. Only CRITICAL_VIOLATION advisory requests are allowed.' };
  }

  // INTERRUPTION_PENDING can only be set by system for CRITICAL_VIOLATION
  if (targetState === 'INTERRUPTION_PENDING' && priority !== 'CRITICAL_VIOLATION') {
    return { allowed: false, reason: 'Only CRITICAL_VIOLATION priority can enter INTERRUPTION_PENDING.' };
  }

  return { allowed: true, reason: 'Transition permitted.' };
}

/**
 * Checks whether a pane can request focus at a given priority level.
 */
export function canRequestFocus(
  snapshot: FocusSnapshot,
  initiatedBy: 'operator' | 'system' | 'advisory',
  priority: FocusPriority
): boolean {
  // Operator can always request focus
  if (initiatedBy === 'operator') return true;

  // Quiet mode blocks non-critical
  if (snapshot.quiet_mode && priority !== 'CRITICAL_VIOLATION') return false;

  // Locked review blocks all non-operator
  if (snapshot.locked_review) return false;

  return true;
}

/**
 * Checks whether an interruption is allowed given the current state.
 */
export function canInterrupt(
  snapshot: FocusSnapshot,
  priority: FocusPriority
): boolean {
  // CRITICAL_VIOLATION can always interrupt (but cannot steal PRIMARY_ACTIVE)
  if (priority === 'CRITICAL_VIOLATION') return true;

  // Nothing else can interrupt
  return false;
}

/**
 * Returns whether a given priority level requires operator acknowledgment.
 */
export function requiresAcknowledgment(priority: FocusPriority): boolean {
  return priority === 'CRITICAL_VIOLATION' || priority === 'ACTIVE_REVIEW_TARGET';
}
