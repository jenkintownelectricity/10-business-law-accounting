/**
 * Review-State Store
 *
 * Tracks review queue items that require practitioner review.
 */

export interface ReviewQueueItem {
  id: string;
  item_type: 'matter' | 'contract' | 'obligation' | 'decision_bundle' | 'transcript' | 'spoken_note' | 'advisory_packet' | 'listening_session';
  item_id: string;
  source: string;
  source_trust_level: 'TRUSTED' | 'PARTIALLY_TRUSTED' | 'UNTRUSTED';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'deferred';
  assigned_to?: string;
  review_notes?: string;
  created_at: string;
  reviewed_at?: string;
}

export class ReviewStateStore {
  private items: Map<string, ReviewQueueItem> = new Map();

  /**
   * Add an item to the review queue.
   */
  addItem(item: ReviewQueueItem): void {
    this.items.set(item.id, { ...item });
  }

  /**
   * Get a review queue item by ID.
   */
  getItem(id: string): ReviewQueueItem | undefined {
    const item = this.items.get(id);
    return item ? { ...item } : undefined;
  }

  /**
   * Transition an item to in_review status.
   */
  startReview(id: string, assignedTo: string): ReviewQueueItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;
    if (item.status !== 'pending') {
      throw new Error(`Cannot start review: item ${id} is in status "${item.status}", expected "pending"`);
    }
    item.status = 'in_review';
    item.assigned_to = assignedTo;
    return { ...item };
  }

  /**
   * Approve a review item.
   */
  approve(id: string, notes?: string): ReviewQueueItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;
    if (item.status !== 'in_review') {
      throw new Error(`Cannot approve: item ${id} is in status "${item.status}", expected "in_review"`);
    }
    item.status = 'approved';
    item.review_notes = notes;
    item.reviewed_at = new Date().toISOString();
    return { ...item };
  }

  /**
   * Reject a review item.
   */
  reject(id: string, notes?: string): ReviewQueueItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;
    if (item.status !== 'in_review') {
      throw new Error(`Cannot reject: item ${id} is in status "${item.status}", expected "in_review"`);
    }
    item.status = 'rejected';
    item.review_notes = notes;
    item.reviewed_at = new Date().toISOString();
    return { ...item };
  }

  /**
   * Defer a review item.
   */
  defer(id: string, notes?: string): ReviewQueueItem | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;
    if (item.status !== 'in_review' && item.status !== 'pending') {
      throw new Error(`Cannot defer: item ${id} is in status "${item.status}"`);
    }
    item.status = 'deferred';
    item.review_notes = notes;
    item.reviewed_at = new Date().toISOString();
    return { ...item };
  }

  /**
   * Get all items by status.
   */
  getByStatus(status: ReviewQueueItem['status']): ReviewQueueItem[] {
    const result: ReviewQueueItem[] = [];
    for (const item of this.items.values()) {
      if (item.status === status) result.push({ ...item });
    }
    return result;
  }

  /**
   * Get all items by type.
   */
  getByType(itemType: ReviewQueueItem['item_type']): ReviewQueueItem[] {
    const result: ReviewQueueItem[] = [];
    for (const item of this.items.values()) {
      if (item.item_type === itemType) result.push({ ...item });
    }
    return result;
  }

  /**
   * Get all items by priority.
   */
  getByPriority(priority: ReviewQueueItem['priority']): ReviewQueueItem[] {
    const result: ReviewQueueItem[] = [];
    for (const item of this.items.values()) {
      if (item.priority === priority) result.push({ ...item });
    }
    return result;
  }

  /**
   * Get all items assigned to a specific reviewer.
   */
  getByAssignee(assignedTo: string): ReviewQueueItem[] {
    const result: ReviewQueueItem[] = [];
    for (const item of this.items.values()) {
      if (item.assigned_to === assignedTo) result.push({ ...item });
    }
    return result;
  }

  /**
   * Get all pending items, sorted by priority.
   */
  getPendingQueue(): ReviewQueueItem[] {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return this.getByStatus('pending').sort(
      (a, b) => (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4),
    );
  }

  /**
   * Get all items.
   */
  getAll(): ReviewQueueItem[] {
    return Array.from(this.items.values()).map((item) => ({ ...item }));
  }
}
