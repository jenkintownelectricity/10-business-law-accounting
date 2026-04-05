/**
 * Ephemeral Promotion Rules
 *
 * RULE 1: Promotion requires explicit operator event.
 *   - No ephemeral proposal may transition to PROMOTED without an explicit
 *     operator action (click, keyboard shortcut, or voice confirmation).
 *
 * RULE 2: No auto-solidification.
 *   - High confidence alone does NOT trigger promotion.
 *   - TTL expiration does NOT trigger promotion (it triggers EXPIRED).
 *   - No system event may auto-promote an ephemeral proposal.
 *
 * RULE 3: No auto-workflow execution.
 *   - Promotion does not automatically execute the proposed workflow.
 *   - Promoted proposals enter PROMOTION_REQUESTED trust state and must be
 *     further confirmed before domain execution.
 *
 * RULE 4: Promotion emits VKBUS signal.
 *   - On promotion, a VKBUS signal is emitted for audit trail and
 *     downstream coordination.
 */

export interface EphemeralPromotionRuleSet {
  /** Promotion requires explicit operator event */
  readonly requires_explicit_event: true;
  /** No auto-solidification from confidence or TTL */
  readonly auto_solidification: false;
  /** No auto-workflow execution on promotion */
  readonly auto_execute_workflow: false;
  /** Promotion emits VKBUS signal */
  readonly emits_vkbus_signal: true;
  /** Promoted proposals enter PROMOTION_REQUESTED trust state */
  readonly initial_trust_state: 'PROMOTION_REQUESTED';
  /** Promotion is reversible before domain execution */
  readonly reversible_before_execution: true;
}

export const EPHEMERAL_PROMOTION_RULES: EphemeralPromotionRuleSet = {
  requires_explicit_event: true,
  auto_solidification: false,
  auto_execute_workflow: false,
  emits_vkbus_signal: true,
  initial_trust_state: 'PROMOTION_REQUESTED',
  reversible_before_execution: true,
} as const;

export interface PromotionEvent {
  proposal_id: string;
  promoted_by: string;
  promoted_at: string;
  promotion_method: 'click' | 'keyboard' | 'voice_confirm';
  target_kernel: string | undefined;
}

/**
 * Create a promotion event for VKBUS emission.
 */
export function createPromotionEvent(
  proposalId: string,
  promotedBy: string,
  method: PromotionEvent['promotion_method'],
  targetKernel?: string,
): PromotionEvent {
  return {
    proposal_id: proposalId,
    promoted_by: promotedBy,
    promoted_at: new Date().toISOString(),
    promotion_method: method,
    target_kernel: targetKernel,
  };
}
