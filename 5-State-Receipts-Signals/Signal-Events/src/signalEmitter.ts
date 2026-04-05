/**
 * Signal-Events
 *
 * Emits typed domain signals.
 */

export type SignalType =
  | 'deadline_approaching'
  | 'deadline_passed'
  | 'obligation_status_change'
  | 'matter_status_change'
  | 'financial_impact_detected'
  | 'constraint_violation'
  | 'review_required'
  | 'voice_intake_received'
  | 'listening_session_complete'
  | 'advisory_packet_ready'
  | 'platform_receipt_confirmed';

export interface DomainSignal {
  signal_id: string;
  signal_type: SignalType;
  source_kernel: string;
  entity_type: string;
  entity_id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export type SignalHandler = (signal: DomainSignal) => void;

export class SignalEmitter {
  private listeners: Map<SignalType, SignalHandler[]> = new Map();
  private history: DomainSignal[] = [];

  /**
   * Subscribe to a signal type.
   */
  on(type: SignalType, handler: SignalHandler): void {
    const handlers = this.listeners.get(type) ?? [];
    handlers.push(handler);
    this.listeners.set(type, handlers);
  }

  /**
   * Emit a domain signal. All registered handlers for the signal type
   * will be invoked synchronously.
   */
  emit(signal: DomainSignal): void {
    this.history.push({ ...signal });
    const handlers = this.listeners.get(signal.signal_type) ?? [];
    for (const handler of handlers) {
      try {
        handler(signal);
      } catch {
        // Signal handlers should not throw, but we protect against it.
      }
    }
  }

  /**
   * Unsubscribe a handler from a signal type.
   */
  off(type: SignalType, handler: SignalHandler): void {
    const handlers = this.listeners.get(type);
    if (!handlers) return;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Get all emitted signals (history).
   */
  getHistory(): DomainSignal[] {
    return this.history.map((s) => ({ ...s }));
  }

  /**
   * Get emitted signals filtered by type.
   */
  getHistoryByType(type: SignalType): DomainSignal[] {
    return this.history.filter((s) => s.signal_type === type).map((s) => ({ ...s }));
  }

  /**
   * Clear all listeners.
   */
  removeAllListeners(): void {
    this.listeners.clear();
  }
}
