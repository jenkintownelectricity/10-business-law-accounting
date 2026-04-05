/**
 * Matter-State Store
 *
 * Stores and manages matter state including transitions,
 * kernel assignments, and constraint status.
 */

export interface MatterStateEntry {
  matter_id: string;
  current_status: string;
  previous_status: string;
  transition_timestamp: string;
  transition_reason: string;
  transitioned_by: string;
  kernel_assignments: string[];
  constraint_status: Record<string, string>;
}

export class MatterStateStore {
  private states: Map<string, MatterStateEntry[]> = new Map();

  /**
   * Record a state transition for a matter.
   */
  recordTransition(entry: MatterStateEntry): void {
    const history = this.states.get(entry.matter_id) ?? [];
    history.push({ ...entry });
    this.states.set(entry.matter_id, history);
  }

  /**
   * Get the current (most recent) state for a matter.
   */
  getCurrentState(matterId: string): MatterStateEntry | undefined {
    const history = this.states.get(matterId);
    if (!history || history.length === 0) return undefined;
    return history[history.length - 1];
  }

  /**
   * Get the full state history for a matter.
   */
  getHistory(matterId: string): MatterStateEntry[] {
    return [...(this.states.get(matterId) ?? [])];
  }

  /**
   * Get all matters that are not CLOSED or ARCHIVED.
   */
  getActiveMatters(): MatterStateEntry[] {
    const active: MatterStateEntry[] = [];
    const terminalStatuses = new Set(['CLOSED', 'ARCHIVED']);

    for (const [, history] of this.states) {
      if (history.length === 0) continue;
      const current = history[history.length - 1];
      if (!terminalStatuses.has(current.current_status)) {
        active.push(current);
      }
    }

    return active;
  }

  /**
   * Get all matters currently in a given status.
   */
  getMattersByStatus(status: string): MatterStateEntry[] {
    const result: MatterStateEntry[] = [];

    for (const [, history] of this.states) {
      if (history.length === 0) continue;
      const current = history[history.length - 1];
      if (current.current_status === status) {
        result.push(current);
      }
    }

    return result;
  }
}
