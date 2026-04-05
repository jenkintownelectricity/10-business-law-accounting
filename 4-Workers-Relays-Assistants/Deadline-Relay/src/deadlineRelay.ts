/**
 * Deadline-Relay
 *
 * Scans active obligations, contracts, and matters for upcoming deadlines.
 * Emits deadline signals with priority and criticality. Supports configurable
 * reminder windows.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DeadlineEntityType = 'obligation' | 'contract' | 'matter' | 'follow_up_action';

export type DeadlineCriticality = 'critical' | 'high' | 'medium' | 'low';

export interface DeadlineEntry {
  entity_type: DeadlineEntityType;
  entity_id: string;
  matter_id?: string;
  description: string;
  deadline: string;
  criticality: DeadlineCriticality;
}

export interface ReminderWindow {
  label: string;
  days_before: number;
  criticality_boost: boolean;
}

export interface DeadlineSignal {
  signal_id: string;
  entity_type: DeadlineEntityType;
  entity_id: string;
  matter_id?: string;
  description: string;
  deadline: string;
  days_remaining: number;
  triggered_window: string;
  criticality: DeadlineCriticality;
  emitted_at: string;
  receipt_id: string;
}

export interface DeadlineReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'deadline_signal';
  source_kernel: 'orchestrator';
  entity_type: string;
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 86_400_000;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
}

function boostCriticality(base: DeadlineCriticality): DeadlineCriticality {
  switch (base) {
    case 'low': return 'medium';
    case 'medium': return 'high';
    case 'high': return 'critical';
    case 'critical': return 'critical';
  }
}

// ---------------------------------------------------------------------------
// Default reminder windows
// ---------------------------------------------------------------------------

const DEFAULT_WINDOWS: ReminderWindow[] = [
  { label: '30_day', days_before: 30, criticality_boost: false },
  { label: '14_day', days_before: 14, criticality_boost: false },
  { label: '7_day', days_before: 7, criticality_boost: true },
  { label: '3_day', days_before: 3, criticality_boost: true },
  { label: '1_day', days_before: 1, criticality_boost: true },
  { label: 'overdue', days_before: 0, criticality_boost: true },
];

// ---------------------------------------------------------------------------
// Relay
// ---------------------------------------------------------------------------

export class DeadlineRelay {
  private windows: ReminderWindow[];
  private receipts: DeadlineReceipt[] = [];

  constructor(windows?: ReminderWindow[]) {
    this.windows = windows ?? DEFAULT_WINDOWS;
  }

  /**
   * Scan deadline entries and emit signals for any that fall within a
   * reminder window relative to the reference date.
   */
  scan(entries: DeadlineEntry[], referenceDate?: Date): DeadlineSignal[] {
    const now = referenceDate ?? new Date();
    const signals: DeadlineSignal[] = [];

    for (const entry of entries) {
      const deadlineDate = new Date(entry.deadline);
      const daysRemaining = daysBetween(now, deadlineDate);

      // Find the tightest matching window
      const matchedWindow = this.findMatchingWindow(daysRemaining);
      if (!matchedWindow) continue;

      const criticality = matchedWindow.criticality_boost
        ? boostCriticality(entry.criticality)
        : entry.criticality;

      const receiptId = generateId('RCT');
      const signalId = generateId('SIG');
      const emittedAt = now.toISOString();

      const signal: DeadlineSignal = {
        signal_id: signalId,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id,
        matter_id: entry.matter_id,
        description: entry.description,
        deadline: entry.deadline,
        days_remaining: daysRemaining,
        triggered_window: matchedWindow.label,
        criticality,
        emitted_at: emittedAt,
        receipt_id: receiptId,
      };
      signals.push(signal);

      this.receipts.push({
        receipt_id: receiptId,
        domain: 'business-law-accounting',
        action: 'deadline_signal',
        source_kernel: 'orchestrator',
        entity_type: entry.entity_type,
        entity_id: entry.entity_id,
        details: {
          deadline: entry.deadline,
          days_remaining: daysRemaining,
          triggered_window: matchedWindow.label,
          criticality,
        },
        timestamp: emittedAt,
      });
    }

    return signals;
  }

  /**
   * Find the tightest reminder window that matches.
   */
  private findMatchingWindow(daysRemaining: number): ReminderWindow | undefined {
    // Sort windows ascending by days_before
    const sorted = [...this.windows].sort((a, b) => a.days_before - b.days_before);

    for (const window of sorted) {
      if (daysRemaining <= window.days_before) {
        return window;
      }
    }

    return undefined;
  }

  /**
   * Configure reminder windows.
   */
  setWindows(windows: ReminderWindow[]): void {
    this.windows = windows;
  }

  getWindows(): ReminderWindow[] {
    return [...this.windows];
  }

  getReceipts(): DeadlineReceipt[] {
    return [...this.receipts];
  }
}
