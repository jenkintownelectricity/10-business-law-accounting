/**
 * Signal-Only Execution Enforcement
 * All CCT actions that affect domain state must route through VKBUS signals.
 * This module provides the enforcement layer.
 */

export interface ActionRequest {
  action_id: string;
  action_type: string;
  payload: Record<string, unknown>;
  source: string;
}

export interface ActionValidation {
  valid: boolean;
  reason?: string;
  required_signal_type?: string;
}

const SIGNAL_REQUIRED_ACTIONS = new Set([
  'promote_ghost',
  'dismiss_ghost',
  'create_matter',
  'update_matter',
  'review_contract',
  'process_invoice',
  'track_obligation',
  'start_dictation',
  'start_listening',
  'submit_language_analysis',
]);

const UI_ONLY_ACTIONS = new Set([
  'change_focus',
  'toggle_quiet_mode',
  'toggle_ghost_layer',
  'pin_evidence',
  'unpin_evidence',
  'open_command_palette',
  'navigate',
  'toggle_focus_mode',
]);

export function validateAction(request: ActionRequest): ActionValidation {
  if (UI_ONLY_ACTIONS.has(request.action_type)) {
    return { valid: true };
  }

  if (SIGNAL_REQUIRED_ACTIONS.has(request.action_type)) {
    return {
      valid: true,
      required_signal_type: `cct.${request.action_type}`,
      reason: 'Action requires VKBUS signal emission',
    };
  }

  return {
    valid: false,
    reason: `Unknown action type: ${request.action_type}. All domain-affecting actions must be registered.`,
  };
}
