/**
 * Focus Commands
 *
 * Focus-specific commands for the CCT workstation.
 * All focus transitions are operator-initiated.
 * AI/advisory cannot escalate itself to PRIMARY_ACTIVE.
 */

import type { FocusLevel } from '../badges/focusLabelMap';

export interface FocusCommand {
  type: string;
  paneId?: string;
  level?: FocusLevel;
  source: 'operator' | 'system';
}

export function focusPane(paneId: string): FocusCommand {
  return { type: 'FOCUS_PANE', paneId, level: 'PRIMARY_ACTIVE', source: 'operator' };
}

export function focusNext(): FocusCommand {
  return { type: 'FOCUS_NEXT', source: 'operator' };
}

export function focusPrev(): FocusCommand {
  return { type: 'FOCUS_PREV', source: 'operator' };
}

export function focusLock(): FocusCommand {
  return { type: 'FOCUS_LOCK', level: 'LOCKED_REVIEW', source: 'operator' };
}

export function quietOn(): FocusCommand {
  return { type: 'QUIET_ON', level: 'QUIET', source: 'operator' };
}

export function quietOff(): FocusCommand {
  return { type: 'QUIET_OFF', source: 'operator' };
}

export function focusQueue(): FocusCommand {
  return { type: 'FOCUS_QUEUE', source: 'operator' };
}

export function inspectViolation(): FocusCommand {
  return { type: 'INSPECT_VIOLATION', source: 'operator' };
}

/**
 * Validates that a focus command respects the operator-ownership invariant.
 * AI-sourced commands cannot set PRIMARY_ACTIVE or LOCKED_REVIEW.
 */
export function validateFocusCommand(command: FocusCommand): { valid: boolean; reason?: string } {
  if (command.source !== 'operator') {
    if (command.level === 'PRIMARY_ACTIVE' || command.level === 'LOCKED_REVIEW') {
      return {
        valid: false,
        reason: 'Non-operator source cannot set PRIMARY_ACTIVE or LOCKED_REVIEW',
      };
    }
  }
  return { valid: true };
}
