/**
 * Operator Focus Model — Type Definitions
 * One operator-active pane owns attention at a time.
 * Everything else is subordinate, queued, dimmed, or advisory.
 */

export type FocusState =
  | 'PRIMARY_ACTIVE'
  | 'SECONDARY_CONTEXT'
  | 'BACKGROUND_AWARE'
  | 'ADVISORY_QUEUE'
  | 'INTERRUPTION_PENDING'
  | 'LOCKED_REVIEW'
  | 'QUIET_MODE';

export type FocusPriority =
  | 'CRITICAL_VIOLATION'
  | 'ACTIVE_REVIEW_TARGET'
  | 'SELECTED_EVIDENCE'
  | 'EPHEMERAL_PROPOSAL'
  | 'SEARCH_RESULTS'
  | 'RECEIPT_FEED'
  | 'WAVEFORM_MONITOR';

export interface FocusEntry {
  pane_id: string;
  pane_type: string;
  state: FocusState;
  priority: FocusPriority;
  entity_id?: string;
  entity_type?: string;
  entered_at: string;
  previous_state?: FocusState;
}

export interface FocusTransition {
  from_pane: string;
  from_state: FocusState;
  to_pane: string;
  to_state: FocusState;
  reason: string;
  initiated_by: 'operator' | 'system' | 'advisory';
  timestamp: string;
}

export interface FocusSnapshot {
  primary_active: FocusEntry | null;
  secondary_context: FocusEntry[];
  background_aware: FocusEntry[];
  advisory_queue: FocusEntry[];
  interruption_pending: FocusEntry[];
  quiet_mode: boolean;
  locked_review: boolean;
  captured_at: string;
}
