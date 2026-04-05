/**
 * Replay Mode Store
 * When replay mode is active:
 * - Live mutation is frozen
 * - Lineage scrub rail is active
 * - Visual replay badge is shown
 * - All mutation commands are disabled
 * - Exit restores previous operator state
 */

export interface ReplayModeState {
  active: boolean;
  entered_at: string | null;
  scrub_position: number; // 0-1 normalized position in timeline
  frozen_snapshot_id: string | null;
  previous_focus_snapshot: string | null; // serialized focus state before replay
}

export class ReplayModeStore {
  private state: ReplayModeState = {
    active: false,
    entered_at: null,
    scrub_position: 0,
    frozen_snapshot_id: null,
    previous_focus_snapshot: null,
  };

  enter(focusSnapshot: string): void {
    this.state = {
      active: true,
      entered_at: new Date().toISOString(),
      scrub_position: 1, // start at most recent
      frozen_snapshot_id: `replay_${Date.now()}`,
      previous_focus_snapshot: focusSnapshot,
    };
  }

  exit(): { previousFocusSnapshot: string | null } {
    const prev = this.state.previous_focus_snapshot;
    this.state = {
      active: false,
      entered_at: null,
      scrub_position: 0,
      frozen_snapshot_id: null,
      previous_focus_snapshot: null,
    };
    return { previousFocusSnapshot: prev };
  }

  isActive(): boolean { return this.state.active; }

  scrubTo(position: number): void {
    if (!this.state.active) return;
    this.state.scrub_position = Math.max(0, Math.min(1, position));
  }

  getScrubPosition(): number { return this.state.scrub_position; }

  getState(): Readonly<ReplayModeState> { return { ...this.state }; }
}
