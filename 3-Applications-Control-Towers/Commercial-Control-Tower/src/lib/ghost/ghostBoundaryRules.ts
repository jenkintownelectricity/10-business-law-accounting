/**
 * Ghost Boundary Rules
 * Ghost Layer is READ-ONLY. It cannot mutate pane state, call vkbusClient,
 * or execute domain operations. It only renders divergence.
 */

export const GHOST_BOUNDARY_RULES = {
  can_mutate_state: false,
  can_call_vkbus: false,
  can_execute_workflow: false,
  can_invoke_kernel: false,
  can_render_delta: true,
  can_render_violation: true,
  can_render_history: true,
  can_freeze_editing_locally: true,  // Ghost Lock — local only, no domain mutation
} as const;
