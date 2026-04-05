// ──────────────────────────────────────────────────────────────
//  ReviewQueueService — Practitioner Review Queue
//  Manages the review queue for items requiring human review
//  before they become sovereign domain records.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type { KernelDomain, TrustLevel, Priority } from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';
import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Types ──────────────────────────────────────────────────────

export type ReviewItemType =
  | 'transcript'
  | 'spoken_note'
  | 'spoken_command'
  | 'obligation_candidate'
  | 'deadline_candidate'
  | 'advisory_packet'
  | 'language_normalization'
  | 'routed_candidate'
  | 'contract_extraction'
  | 'other';

export type ReviewItemStatus =
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'deferred'
  | 'escalated';

export interface ReviewItem {
  id: string;
  item_type: ReviewItemType;
  source_id: string;
  title: string;
  summary: string;
  content: Record<string, unknown>;
  trust_level: TrustLevel;
  target_kernel?: KernelDomain;
  priority: Priority;
  status: ReviewItemStatus;
  assigned_to?: string;
  matter_id?: string;
  confidence?: number;
  review_notes?: string;
  promoted_object_id?: string;
  promoted_object_type?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AddToQueueRequest {
  item_type: ReviewItemType;
  source_id: string;
  title: string;
  summary: string;
  content: Record<string, unknown>;
  trust_level: TrustLevel;
  target_kernel?: KernelDomain;
  priority: Priority;
  matter_id?: string;
  confidence?: number;
  created_by: string;
}

export interface ReviewItemRequest {
  item_id: string;
  reviewer: string;
  notes?: string;
}

export interface ApproveItemRequest {
  item_id: string;
  reviewer: string;
  promoted_object_id?: string;
  promoted_object_type?: string;
  notes?: string;
}

export interface RejectItemRequest {
  item_id: string;
  reviewer: string;
  reason: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class ReviewQueueService {
  private queue: Map<string, ReviewItem> = new Map();
  private receiptSequence = 0;

  // ── Queue Operations ───────────────────────────────────────

  async addToReviewQueue(request: AddToQueueRequest): Promise<ServiceResult<ReviewItem>> {
    const now = new Date().toISOString();
    const id = `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const item: ReviewItem = {
      id,
      item_type: request.item_type,
      source_id: request.source_id,
      title: request.title,
      summary: request.summary,
      content: request.content,
      trust_level: request.trust_level,
      target_kernel: request.target_kernel,
      priority: request.priority,
      status: 'pending',
      matter_id: request.matter_id,
      confidence: request.confidence,
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
    };

    this.queue.set(id, item);

    const receipt = this.emitReceipt({
      operation: 'review_queue.item_added',
      description: `Review item added: ${request.item_type} — "${request.title}"`,
      actor: request.created_by,
      target_id: id,
      target_type: 'review_item',
      previous_state: null,
      new_state: 'pending',
    });

    return { success: true, data: item, receipt };
  }

  async getReviewQueue(filter?: {
    status?: ReviewItemStatus;
    item_type?: ReviewItemType;
    target_kernel?: KernelDomain;
    priority?: Priority;
    trust_level?: TrustLevel;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResult<ReviewItem[]>> {
    let results = Array.from(this.queue.values());

    if (filter?.status) results = results.filter(i => i.status === filter.status);
    if (filter?.item_type) results = results.filter(i => i.item_type === filter.item_type);
    if (filter?.target_kernel) results = results.filter(i => i.target_kernel === filter.target_kernel);
    if (filter?.priority) results = results.filter(i => i.priority === filter.priority);
    if (filter?.trust_level) results = results.filter(i => i.trust_level === filter.trust_level);

    // Sort by priority then by created_at
    const priorityOrder: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    results.sort((a, b) => {
      const pd = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (pd !== 0) return pd;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    const offset = filter?.offset ?? 0;
    const limit = filter?.limit ?? 50;
    results = results.slice(offset, offset + limit);

    return { success: true, data: results };
  }

  async reviewItem(request: ReviewItemRequest): Promise<ServiceResult<ReviewItem>> {
    const item = this.queue.get(request.item_id);
    if (!item) {
      return { success: false, error: `Review item ${request.item_id} not found` };
    }

    item.status = 'in_review';
    item.assigned_to = request.reviewer;
    item.review_notes = request.notes;
    item.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'review_queue.item_reviewed',
      description: `Review started by ${request.reviewer}`,
      actor: request.reviewer,
      target_id: request.item_id,
      target_type: 'review_item',
      previous_state: 'pending',
      new_state: 'in_review',
    });

    return { success: true, data: { ...item }, receipt };
  }

  async approveItem(request: ApproveItemRequest): Promise<ServiceResult<ReviewItem>> {
    const item = this.queue.get(request.item_id);
    if (!item) {
      return { success: false, error: `Review item ${request.item_id} not found` };
    }

    const previousStatus = item.status;
    item.status = 'approved';
    item.trust_level = 'TRUSTED';
    item.reviewed_by = request.reviewer;
    item.reviewed_at = new Date().toISOString();
    item.review_notes = request.notes;
    item.promoted_object_id = request.promoted_object_id;
    item.promoted_object_type = request.promoted_object_type;
    item.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'review_queue.item_approved',
      description: `Item approved by ${request.reviewer}${request.promoted_object_id ? ` — promoted to ${request.promoted_object_type} ${request.promoted_object_id}` : ''}`,
      actor: request.reviewer,
      target_id: request.item_id,
      target_type: 'review_item',
      previous_state: previousStatus,
      new_state: 'approved',
    });

    return { success: true, data: { ...item }, receipt };
  }

  async rejectItem(request: RejectItemRequest): Promise<ServiceResult<ReviewItem>> {
    const item = this.queue.get(request.item_id);
    if (!item) {
      return { success: false, error: `Review item ${request.item_id} not found` };
    }

    const previousStatus = item.status;
    item.status = 'rejected';
    item.reviewed_by = request.reviewer;
    item.reviewed_at = new Date().toISOString();
    item.review_notes = request.reason;
    item.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'review_queue.item_rejected',
      description: `Item rejected by ${request.reviewer}: ${request.reason}`,
      actor: request.reviewer,
      target_id: request.item_id,
      target_type: 'review_item',
      previous_state: previousStatus,
      new_state: 'rejected',
    });

    return { success: true, data: { ...item }, receipt };
  }

  // ── Query Helpers ──────────────────────────────────────────

  async getByTrustLevel(trustLevel: TrustLevel): Promise<ServiceResult<ReviewItem[]>> {
    const results = Array.from(this.queue.values()).filter(i => i.trust_level === trustLevel);
    return { success: true, data: results };
  }

  async getByPriority(priority: Priority): Promise<ServiceResult<ReviewItem[]>> {
    const results = Array.from(this.queue.values()).filter(i => i.priority === priority && i.status === 'pending');
    return { success: true, data: results };
  }

  async getByType(itemType: ReviewItemType): Promise<ServiceResult<ReviewItem[]>> {
    const results = Array.from(this.queue.values()).filter(i => i.item_type === itemType);
    return { success: true, data: results };
  }

  async getPendingCount(): Promise<ServiceResult<{
    total: number;
    by_type: Record<string, number>;
    by_priority: Record<string, number>;
    by_kernel: Record<string, number>;
  }>> {
    const pending = Array.from(this.queue.values()).filter(i => i.status === 'pending');

    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byKernel: Record<string, number> = {};

    for (const item of pending) {
      byType[item.item_type] = (byType[item.item_type] ?? 0) + 1;
      byPriority[item.priority] = (byPriority[item.priority] ?? 0) + 1;
      if (item.target_kernel) {
        byKernel[item.target_kernel] = (byKernel[item.target_kernel] ?? 0) + 1;
      }
    }

    return {
      success: true,
      data: { total: pending.length, by_type: byType, by_priority: byPriority, by_kernel: byKernel },
    };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
    previous_state: string | null;
    new_state: string | null;
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: 'state_change',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'practitioner',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: 'orchestrator',
      previous_state: params.previous_state,
      new_state: params.new_state,
      payload_hash: `sha256_${Date.now()}`,
      parent_receipt_id: null,
      related_receipt_ids: [],
      timestamp: now,
      replay_sequence: this.receiptSequence,
      idempotency_key: `${params.operation}_${params.target_id}_${this.receiptSequence}`,
      notes: '',
      created_at: now,
      updated_at: now,
      status: 'emitted',
    };
  }
}
