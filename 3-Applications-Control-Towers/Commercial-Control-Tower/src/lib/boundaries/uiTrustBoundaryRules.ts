/**
 * UI Trust Boundary Rules
 * The Commercial Control Tower is a PARTIALLY TRUSTED UI SURFACE.
 * It may NOT:
 * - Directly mutate domain truth
 * - Directly execute workflows
 * - Directly invoke kernels
 * - Bypass VKBUS signal routing
 *
 * It MAY:
 * - Emit VKBUS signals
 * - Read projected domain state
 * - Render ghost/ephemeral overlays
 * - Accept operator focus commands
 * - Display receipts and advisory content
 */

export const UI_TRUST_RULES = {
  trust_level: 'PARTIALLY_TRUSTED' as const,
  surface_type: 'COMMERCIAL_CONTROL_TOWER' as const,

  allowed_actions: [
    'emit_vkbus_signal',
    'read_projected_state',
    'render_ghost_overlay',
    'render_ephemeral_proposal',
    'accept_focus_command',
    'display_receipt',
    'display_advisory',
    'pin_evidence',
    'manage_attention_queue',
  ],

  forbidden_actions: [
    'direct_kernel_invocation',
    'direct_workflow_execution',
    'direct_domain_mutation',
    'direct_platform_mutation',
    'bypass_vkbus',
    'auto_promote_ephemeral',
    'seize_operator_focus',
    'displace_pinned_evidence',
  ],
} as const;

export function isAllowedAction(action: string): boolean {
  return (UI_TRUST_RULES.allowed_actions as readonly string[]).includes(action);
}

export function isForbiddenAction(action: string): boolean {
  return (UI_TRUST_RULES.forbidden_actions as readonly string[]).includes(action);
}
