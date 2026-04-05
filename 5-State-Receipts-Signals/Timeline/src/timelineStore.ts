/**
 * Timeline Store
 *
 * Maintains chronological timeline of domain events.
 */

export interface TimelineEvent {
  id: string;
  timestamp: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  source_kernel: string;
  summary: string;
  details: Record<string, unknown>;
  receipt_id?: string;
}

export interface TimelineQueryOptions {
  from?: string;
  to?: string;
  limit?: number;
}

export class TimelineStore {
  private events: TimelineEvent[] = [];
  private entityIndex: Map<string, number[]> = new Map();

  /**
   * Add an event to the timeline.
   */
  addEvent(event: TimelineEvent): void {
    const index = this.events.length;
    this.events.push({ ...event });

    // Index by entity
    const indices = this.entityIndex.get(event.entity_id) ?? [];
    indices.push(index);
    this.entityIndex.set(event.entity_id, indices);
  }

  /**
   * Get the timeline for a specific entity, sorted chronologically.
   */
  getTimeline(entityId: string): TimelineEvent[] {
    const indices = this.entityIndex.get(entityId) ?? [];
    return indices
      .map((i) => ({ ...this.events[i] }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  /**
   * Get the global timeline with optional filtering and limiting.
   */
  getGlobalTimeline(options: TimelineQueryOptions = {}): TimelineEvent[] {
    let result = this.events.map((e) => ({ ...e }));

    if (options.from) {
      result = result.filter((e) => e.timestamp >= options.from!);
    }

    if (options.to) {
      result = result.filter((e) => e.timestamp <= options.to!);
    }

    result.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    if (options.limit !== undefined && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }
}
