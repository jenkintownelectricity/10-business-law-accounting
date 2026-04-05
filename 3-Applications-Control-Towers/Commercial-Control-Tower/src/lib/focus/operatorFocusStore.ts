/**
 * Operator Focus Store
 * Manages the focus state of all panes in the workstation.
 * Enforces single-primary ownership.
 */

import { FocusEntry, FocusState, FocusTransition, FocusSnapshot, FocusPriority } from './focusTypes';

export class OperatorFocusStore {
  private entries: Map<string, FocusEntry> = new Map();
  private transitions: FocusTransition[] = [];
  private quietMode: boolean = false;
  private lockedReview: boolean = false;

  getPrimaryActive(): FocusEntry | null {
    for (const entry of this.entries.values()) {
      if (entry.state === 'PRIMARY_ACTIVE') return entry;
    }
    return null;
  }

  setPrimaryActive(paneId: string, paneType: string, priority: FocusPriority, entityId?: string, entityType?: string): FocusTransition | null {
    const current = this.getPrimaryActive();

    // If locked review, only operator can change focus
    if (this.lockedReview) return null;

    // Demote current primary to secondary
    if (current && current.pane_id !== paneId) {
      current.previous_state = current.state;
      current.state = 'SECONDARY_CONTEXT';
    }

    const entry: FocusEntry = {
      pane_id: paneId,
      pane_type: paneType,
      state: 'PRIMARY_ACTIVE',
      priority,
      entity_id: entityId,
      entity_type: entityType,
      entered_at: new Date().toISOString(),
      previous_state: this.entries.get(paneId)?.state,
    };
    this.entries.set(paneId, entry);

    const transition: FocusTransition = {
      from_pane: current?.pane_id || '',
      from_state: current?.state || 'BACKGROUND_AWARE',
      to_pane: paneId,
      to_state: 'PRIMARY_ACTIVE',
      reason: 'operator_focus_change',
      initiated_by: 'operator',
      timestamp: new Date().toISOString(),
    };
    this.transitions.push(transition);
    return transition;
  }

  setSecondaryContext(paneId: string, paneType: string, priority: FocusPriority): void {
    const entry: FocusEntry = {
      pane_id: paneId, pane_type: paneType, state: 'SECONDARY_CONTEXT',
      priority, entered_at: new Date().toISOString(),
    };
    this.entries.set(paneId, entry);
  }

  setBackgroundAware(paneId: string, paneType: string): void {
    const entry: FocusEntry = {
      pane_id: paneId, pane_type: paneType, state: 'BACKGROUND_AWARE',
      priority: 'RECEIPT_FEED', entered_at: new Date().toISOString(),
    };
    this.entries.set(paneId, entry);
  }

  requestAdvisoryFocus(paneId: string, paneType: string, priority: FocusPriority): boolean {
    // AI/Iron Ear/ephemeral can only enter ADVISORY_QUEUE
    if (this.quietMode && priority !== 'CRITICAL_VIOLATION') return false;

    const entry: FocusEntry = {
      pane_id: paneId, pane_type: paneType, state: 'ADVISORY_QUEUE',
      priority, entered_at: new Date().toISOString(),
    };
    this.entries.set(paneId, entry);
    return true;
  }

  requestInterruption(paneId: string, paneType: string, reason: string): boolean {
    // Violations can raise INTERRUPTION_PENDING but cannot steal PRIMARY_ACTIVE
    const entry: FocusEntry = {
      pane_id: paneId, pane_type: paneType, state: 'INTERRUPTION_PENDING',
      priority: 'CRITICAL_VIOLATION', entered_at: new Date().toISOString(),
    };
    this.entries.set(paneId, entry);

    const transition: FocusTransition = {
      from_pane: '', from_state: 'BACKGROUND_AWARE',
      to_pane: paneId, to_state: 'INTERRUPTION_PENDING',
      reason, initiated_by: 'system', timestamp: new Date().toISOString(),
    };
    this.transitions.push(transition);
    return true;
  }

  toggleQuietMode(): boolean {
    this.quietMode = !this.quietMode;
    return this.quietMode;
  }

  isQuietMode(): boolean { return this.quietMode; }

  enterLockedReview(): void { this.lockedReview = true; }
  exitLockedReview(): void { this.lockedReview = false; }
  isLockedReview(): boolean { return this.lockedReview; }

  getSnapshot(): FocusSnapshot {
    const entries = Array.from(this.entries.values());
    return {
      primary_active: entries.find(e => e.state === 'PRIMARY_ACTIVE') || null,
      secondary_context: entries.filter(e => e.state === 'SECONDARY_CONTEXT'),
      background_aware: entries.filter(e => e.state === 'BACKGROUND_AWARE'),
      advisory_queue: entries.filter(e => e.state === 'ADVISORY_QUEUE'),
      interruption_pending: entries.filter(e => e.state === 'INTERRUPTION_PENDING'),
      quiet_mode: this.quietMode,
      locked_review: this.lockedReview,
      captured_at: new Date().toISOString(),
    };
  }

  getTransitionHistory(): FocusTransition[] { return [...this.transitions]; }

  focusNext(): FocusTransition | null {
    const entries = Array.from(this.entries.values());
    const current = this.getPrimaryActive();
    const idx = current ? entries.findIndex(e => e.pane_id === current.pane_id) : -1;
    const next = entries[(idx + 1) % entries.length];
    if (next) return this.setPrimaryActive(next.pane_id, next.pane_type, next.priority);
    return null;
  }

  focusPrev(): FocusTransition | null {
    const entries = Array.from(this.entries.values());
    const current = this.getPrimaryActive();
    const idx = current ? entries.findIndex(e => e.pane_id === current.pane_id) : 0;
    const prev = entries[(idx - 1 + entries.length) % entries.length];
    if (prev) return this.setPrimaryActive(prev.pane_id, prev.pane_type, prev.priority);
    return null;
  }
}
