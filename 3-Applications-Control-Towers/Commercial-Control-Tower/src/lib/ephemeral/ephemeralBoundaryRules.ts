/**
 * Ephemeral Boundary Rules
 *
 * RULE 1: Ephemeral proposals cannot mutate domain state.
 *   - No ephemeral proposal, regardless of confidence or source,
 *     may directly write to domain truth stores.
 *
 * RULE 2: Ephemeral proposals cannot bypass trust boundary.
 *   - All proposals must pass through the trust promotion gate
 *     before any domain-affecting action can occur.
 *
 * RULE 3: Ephemeral proposals cannot self-promote.
 *   - No proposal may change its own status to PROMOTED.
 *   - Promotion is exclusively an external operator event.
 *
 * RULE 4: Ephemeral proposals cannot invoke kernel operations.
 *   - Kernel calls require promoted, confirmed proposals only.
 *
 * RULE 5: Ephemeral proposals cannot emit domain VKBUS signals.
 *   - Only promotion events emit VKBUS signals, not the proposals themselves.
 */

export interface EphemeralBoundaryRuleSet {
  /** Cannot mutate domain state */
  readonly can_mutate_domain: false;
  /** Cannot bypass trust boundary */
  readonly can_bypass_trust: false;
  /** Cannot self-promote */
  readonly can_self_promote: false;
  /** Cannot invoke kernel operations */
  readonly can_invoke_kernel: false;
  /** Cannot emit domain VKBUS signals */
  readonly can_emit_domain_vkbus: false;
  /** Can render in UI as ghost/ephemeral */
  readonly can_render_ephemeral: true;
  /** Can be previewed without side effects */
  readonly can_preview: true;
  /** Can be dismissed (UI lifecycle only) */
  readonly can_dismiss: true;
}

export const EPHEMERAL_BOUNDARY_RULES: EphemeralBoundaryRuleSet = {
  can_mutate_domain: false,
  can_bypass_trust: false,
  can_self_promote: false,
  can_invoke_kernel: false,
  can_emit_domain_vkbus: false,
  can_render_ephemeral: true,
  can_preview: true,
  can_dismiss: true,
} as const;

/**
 * Validate that an operation is permitted under ephemeral boundary rules.
 */
export function assertEphemeralBoundary(operation: string): void {
  const forbidden = [
    'mutate_domain',
    'bypass_trust',
    'self_promote',
    'invoke_kernel',
    'emit_domain_vkbus',
  ];
  if (forbidden.includes(operation)) {
    throw new Error(
      `Ephemeral boundary violation: "${operation}" is not permitted for ephemeral proposals.`,
    );
  }
}
