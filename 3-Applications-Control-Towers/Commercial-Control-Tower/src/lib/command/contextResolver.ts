/**
 * Context Resolution
 * Resolves command context deterministically from current workstation state.
 * Resolution order: active pane -> selected object -> active evidence -> active ghost -> lineage state
 */

import { CommandContext } from './registry';

export function resolveCommandContext(): CommandContext {
  // In a real implementation, this reads from stores:
  // - OperatorFocusStore for active pane, quiet mode, locked review
  // - Selection store for selected entity
  // - Ghost store for active ghost state
  // - Evidence store for active evidence
  // - Lineage store for lineage state
  // - Replay store for replay mode
  return {
    active_pane_id: null,
    active_pane_type: null,
    selected_entity_id: null,
    selected_entity_type: null,
    has_active_ghost: false,
    has_active_evidence: false,
    has_lineage_state: false,
    is_quiet_mode: false,
    is_locked_review: false,
    is_replay_mode: false,
  };
}
