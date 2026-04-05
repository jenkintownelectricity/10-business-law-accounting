/**
 * Attention Queue Rules
 *
 * These rules govern the behavior of the Attention Queue within the
 * Commercial Control Tower workstation.
 *
 * RULE 1: Queue never auto-opens panes.
 *   - No queue item, regardless of urgency, may trigger automatic pane opening.
 *   - All pane transitions require explicit operator action.
 *
 * RULE 2: Items persist across layout changes.
 *   - Queue items are NOT cleared when the layout changes.
 *   - Items survive pane focus transitions, layout reflows, and view switches.
 *   - Only explicit dismiss or expiration removes items.
 *
 * RULE 3: Previewing does not transfer focus.
 *   - An operator may preview any queue item without changing PRIMARY_ACTIVE focus.
 *   - Preview renders as overlay or tooltip — never as pane navigation.
 *
 * RULE 4: Only operator action promotes to PRIMARY_ACTIVE.
 *   - Promotion from queue to active pane requires explicit operator event.
 *   - No AI advisory, ephemeral proposal, or system event may self-promote.
 *   - Promotion emits a focus transfer event for audit trail.
 */

export interface AttentionQueueRuleSet {
  /** Queue items never auto-open panes */
  readonly auto_open_panes: false;
  /** Items persist across layout changes */
  readonly persist_across_layout: true;
  /** Preview does not transfer focus */
  readonly preview_transfers_focus: false;
  /** Only explicit operator action promotes to PRIMARY_ACTIVE */
  readonly requires_explicit_promotion: true;
  /** Dismissed items are soft-deleted, not hard-deleted */
  readonly soft_delete_on_dismiss: true;
  /** Queue items are sorted by urgency */
  readonly sorted_by_urgency: true;
}

export const ATTENTION_QUEUE_RULES: AttentionQueueRuleSet = {
  auto_open_panes: false,
  persist_across_layout: true,
  preview_transfers_focus: false,
  requires_explicit_promotion: true,
  soft_delete_on_dismiss: true,
  sorted_by_urgency: true,
} as const;
