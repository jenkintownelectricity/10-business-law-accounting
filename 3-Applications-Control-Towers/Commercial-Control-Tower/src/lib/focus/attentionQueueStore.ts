/**
 * Attention Queue Store
 * All ephemeral proposals, advisory items, and interruptions land here.
 * Queue never auto-opens panes. Items may be previewed without focus transfer.
 */

export type QueueItemType = 'ephemeral_proposal' | 'advisory' | 'interruption' | 'receipt_notification' | 'violation';
export type QueueItemUrgency = 'critical' | 'high' | 'medium' | 'low';

export interface AttentionQueueItem {
  id: string;
  type: QueueItemType;
  urgency: QueueItemUrgency;
  title: string;
  summary: string;
  source: string;
  confidence?: number;
  target_pane?: string;
  entity_id?: string;
  entity_type?: string;
  created_at: string;
  previewed: boolean;
  dismissed: boolean;
}

export class AttentionQueueStore {
  private items: AttentionQueueItem[] = [];

  add(item: Omit<AttentionQueueItem, 'created_at' | 'previewed' | 'dismissed'>): AttentionQueueItem {
    const full: AttentionQueueItem = {
      ...item,
      created_at: new Date().toISOString(),
      previewed: false,
      dismissed: false,
    };
    this.items.push(full);
    this.sortByUrgency();
    return full;
  }

  getActive(): AttentionQueueItem[] {
    return this.items.filter(i => !i.dismissed);
  }

  getByUrgency(urgency: QueueItemUrgency): AttentionQueueItem[] {
    return this.getActive().filter(i => i.urgency === urgency);
  }

  getCount(): number {
    return this.getActive().length;
  }

  preview(id: string): AttentionQueueItem | undefined {
    const item = this.items.find(i => i.id === id);
    if (item) item.previewed = true;
    return item;
  }

  dismiss(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) item.dismissed = true;
  }

  private sortByUrgency(): void {
    const order: Record<QueueItemUrgency, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    this.items.sort((a, b) => order[a.urgency] - order[b.urgency]);
  }
}
