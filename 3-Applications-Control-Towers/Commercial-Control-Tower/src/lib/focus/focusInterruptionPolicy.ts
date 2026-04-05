/**
 * Focus Interruption Policy
 * Defines which priorities can interrupt, quiet mode suppression rules,
 * and critical violation override rules.
 */

import { FocusPriority } from './focusTypes';

/** Priorities that can raise INTERRUPTION_PENDING. */
const INTERRUPTIBLE_PRIORITIES: FocusPriority[] = ['CRITICAL_VIOLATION'];

/** Priorities suppressed by quiet mode. */
const QUIET_MODE_SUPPRESSED: FocusPriority[] = [
  'EPHEMERAL_PROPOSAL',
  'SEARCH_RESULTS',
  'RECEIPT_FEED',
  'WAVEFORM_MONITOR',
];

/** Priorities that bypass quiet mode entirely. */
const QUIET_MODE_OVERRIDE: FocusPriority[] = ['CRITICAL_VIOLATION'];

/**
 * Returns true if the priority level is allowed to raise an interruption.
 */
export function canRaiseInterruption(priority: FocusPriority): boolean {
  return INTERRUPTIBLE_PRIORITIES.includes(priority);
}

/**
 * Returns true if the priority is suppressed during quiet mode.
 */
export function isSuppressedByQuietMode(priority: FocusPriority): boolean {
  return QUIET_MODE_SUPPRESSED.includes(priority);
}

/**
 * Returns true if the priority overrides quiet mode.
 * Critical violations always get through.
 */
export function overridesQuietMode(priority: FocusPriority): boolean {
  return QUIET_MODE_OVERRIDE.includes(priority);
}

/**
 * Returns the maximum time (ms) an interruption can remain pending
 * before auto-escalation. Returns null if no auto-escalation applies.
 */
export function getInterruptionTimeout(priority: FocusPriority): number | null {
  switch (priority) {
    case 'CRITICAL_VIOLATION':
      return 30_000; // 30 seconds before escalation
    default:
      return null;
  }
}

/**
 * Policy: should the interruption produce an audible alert?
 */
export function shouldProduceAudibleAlert(priority: FocusPriority): boolean {
  return priority === 'CRITICAL_VIOLATION';
}

/**
 * Policy: should the interruption produce a visual flash/pulse?
 */
export function shouldProduceVisualPulse(priority: FocusPriority): boolean {
  return priority === 'CRITICAL_VIOLATION' || priority === 'ACTIVE_REVIEW_TARGET';
}
