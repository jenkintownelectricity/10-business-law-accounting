/**
 * Ephemeral TTL Governance
 *
 * TTL (Time-To-Live) governs the automatic expiration of ephemeral proposals.
 * Decay is paused under specific conditions to prevent premature expiration
 * of proposals the operator is actively engaging with or that carry significance.
 *
 * PAUSE CONDITIONS:
 *   1. confidence >= 0.75 — High-confidence proposals persist until explicit action.
 *   2. violationState !== 'NONE' — Proposals with violations must not silently expire.
 *   3. hovered — Operator is hovering over the proposal UI element.
 *   4. selected — Operator has selected/clicked the proposal.
 *   5. focus_owner_active — The pane that owns focus is actively viewing this proposal.
 *
 * When none of the pause conditions are met, the proposal expires after ttl_ms
 * milliseconds from created_at.
 */

import { EphemeralProposal } from './ephemeralTypes';

export interface TTLCheckResult {
  expired: boolean;
  paused: boolean;
  pauseReason: string | null;
  remainingMs: number;
}

/**
 * Check TTL status for a single proposal.
 */
export function checkTTL(proposal: EphemeralProposal, now: number): TTLCheckResult {
  const elapsed = now - proposal.created_at;
  const remaining = Math.max(0, proposal.ttl_ms - elapsed);

  const pauseReason = getTTLPauseReason(proposal);
  if (pauseReason !== null) {
    return { expired: false, paused: true, pauseReason, remainingMs: remaining };
  }

  if (elapsed >= proposal.ttl_ms) {
    return { expired: true, paused: false, pauseReason: null, remainingMs: 0 };
  }

  return { expired: false, paused: false, pauseReason: null, remainingMs: remaining };
}

/**
 * Get the reason TTL decay is paused, or null if not paused.
 */
export function getTTLPauseReason(proposal: EphemeralProposal): string | null {
  if (proposal.confidence >= 0.75) return 'high_confidence';
  if (proposal.violationState !== 'NONE') return 'violation_present';
  if (proposal.hovered) return 'hovered';
  if (proposal.selected) return 'selected';
  if (proposal.focus_owner_active) return 'focus_owner_active';
  return null;
}

/**
 * Default TTL durations by source type (milliseconds).
 */
export const DEFAULT_TTL_BY_SOURCE: Record<EphemeralProposal['source_type'], number> = {
  iron_ear: 30_000,
  language_layer: 60_000,
  ai_assistant: 45_000,
  voice_command: 20_000,
};
