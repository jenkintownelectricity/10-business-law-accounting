// ──────────────────────────────────────────────────────────────
//  MatterService — Full Matter CRUD + Lifecycle
//  Manages creation, retrieval, update, listing, status transitions,
//  kernel assignment, notes, evidence, and timeline for Matters.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  Matter,
  MatterStatus,
  MatterNote,
  MatterType,
  KernelDomain,
  Priority,
  NoteType,
  TrustLevel,
  FollowUpAction,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── State Machine ──────────────────────────────────────────────

const VALID_TRANSITIONS: Record<MatterStatus, MatterStatus[]> = {
  draft:        ['intake', 'closed'],
  intake:       ['under_review', 'closed'],
  under_review: ['active', 'on_hold', 'closed'],
  active:       ['on_hold', 'resolved', 'closed'],
  on_hold:      ['active', 'under_review', 'closed'],
  resolved:     ['closed', 'archived', 'active'],
  closed:       ['archived', 'active'],
  archived:     [],
};

// ── Request / Response Types ───────────────────────────────────

export interface CreateMatterRequest {
  title: string;
  description: string;
  matter_type: MatterType;
  client_id: string;
  priority: Priority;
  assigned_kernels?: KernelDomain[];
  counterparty_ids?: string[];
  tags?: string[];
  created_by: string;
  source_surface: string;
}

export interface UpdateMatterRequest {
  id: string;
  title?: string;
  description?: string;
  priority?: string;
  tags?: string[];
  counterparty_ids?: string[];
  updated_by: string;
}

export interface ListMattersFilter {
  status?: MatterStatus;
  matter_type?: MatterType;
  client_id?: string;
  assigned_kernel?: KernelDomain;
  priority?: Priority;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface AddNoteRequest {
  matter_id: string;
  content: string;
  note_type: NoteType;
  source: string;
  trust_level: TrustLevel;
  created_by: string;
}

export interface AddEvidenceRequest {
  matter_id: string;
  evidence_id: string;
  added_by: string;
}

export interface TimelineEntry {
  id: string;
  matter_id: string;
  event_type: string;
  description: string;
  actor: string;
  timestamp: string;
  receipt_id: string;
  metadata?: Record<string, unknown>;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class MatterService {
  private matters: Map<string, Matter> = new Map();
  private timeline: Map<string, TimelineEntry[]> = new Map();
  private receiptSequence = 0;

  // ── CRUD ───────────────────────────────────────────────────

  async createMatter(request: CreateMatterRequest): Promise<ServiceResult<Matter>> {
    const now = new Date().toISOString();
    const id = `matter_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const matter: Matter = {
      id,
      title: request.title,
      description: request.description,
      matter_type: request.matter_type,
      assigned_kernels: request.assigned_kernels ?? [],
      client_id: request.client_id,
      counterparty_ids: request.counterparty_ids ?? [],
      priority: request.priority,
      status: 'draft',
      related_contracts: [],
      related_obligations: [],
      related_accounting_events: [],
      evidence_ids: [],
      receipt_ids: [],
      follow_up_actions: [],
      tags: request.tags ?? [],
      notes: [],
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
      source_surface: request.source_surface,
    };

    this.matters.set(id, matter);

    const receipt = this.emitReceipt({
      operation: 'matter.created',
      description: `Matter "${matter.title}" created`,
      actor: request.created_by,
      target_id: id,
      target_type: 'matter',
      previous_state: null,
      new_state: 'draft',
    });

    matter.receipt_ids.push(receipt.id);
    this.appendTimeline(id, 'created', `Matter created: ${matter.title}`, request.created_by, receipt.id);

    return { success: true, data: matter, receipt };
  }

  async getMatter(id: string): Promise<ServiceResult<Matter>> {
    const matter = this.matters.get(id);
    if (!matter) {
      return { success: false, error: `Matter ${id} not found` };
    }
    return { success: true, data: { ...matter } };
  }

  async updateMatter(request: UpdateMatterRequest): Promise<ServiceResult<Matter>> {
    const matter = this.matters.get(request.id);
    if (!matter) {
      return { success: false, error: `Matter ${request.id} not found` };
    }

    const previousState = JSON.stringify(matter);

    if (request.title !== undefined) matter.title = request.title;
    if (request.description !== undefined) matter.description = request.description;
    if (request.priority !== undefined) matter.priority = request.priority as Priority;
    if (request.tags !== undefined) matter.tags = request.tags;
    if (request.counterparty_ids !== undefined) matter.counterparty_ids = request.counterparty_ids;
    matter.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'matter.updated',
      description: `Matter "${matter.title}" updated`,
      actor: request.updated_by,
      target_id: request.id,
      target_type: 'matter',
      previous_state: previousState,
      new_state: JSON.stringify(matter),
    });

    matter.receipt_ids.push(receipt.id);
    this.appendTimeline(request.id, 'updated', `Matter updated by ${request.updated_by}`, request.updated_by, receipt.id);

    return { success: true, data: { ...matter }, receipt };
  }

  async listMatters(filter: ListMattersFilter = {}): Promise<ServiceResult<Matter[]>> {
    let results = Array.from(this.matters.values());

    if (filter.status) results = results.filter(m => m.status === filter.status);
    if (filter.matter_type) results = results.filter(m => m.matter_type === filter.matter_type);
    if (filter.client_id) results = results.filter(m => m.client_id === filter.client_id);
    if (filter.assigned_kernel) results = results.filter(m => m.assigned_kernels.includes(filter.assigned_kernel!));
    if (filter.priority) results = results.filter(m => m.priority === filter.priority);
    if (filter.tag) results = results.filter(m => m.tags.includes(filter.tag!));

    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 50;
    results = results.slice(offset, offset + limit);

    return { success: true, data: results };
  }

  // ── Status Transitions ─────────────────────────────────────

  async transitionStatus(
    matterId: string,
    newStatus: MatterStatus,
    actor: string,
    reason?: string
  ): Promise<ServiceResult<Matter>> {
    const matter = this.matters.get(matterId);
    if (!matter) {
      return { success: false, error: `Matter ${matterId} not found` };
    }

    const allowed = VALID_TRANSITIONS[matter.status];
    if (!allowed || !allowed.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid transition: ${matter.status} -> ${newStatus}. Allowed: [${(allowed ?? []).join(', ')}]`,
      };
    }

    const previousStatus = matter.status;
    matter.status = newStatus;
    matter.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'matter.status_transitioned',
      description: `Matter status: ${previousStatus} -> ${newStatus}${reason ? ` (${reason})` : ''}`,
      actor,
      target_id: matterId,
      target_type: 'matter',
      previous_state: previousStatus,
      new_state: newStatus,
    });

    matter.receipt_ids.push(receipt.id);
    this.appendTimeline(
      matterId,
      'status_transition',
      `Status changed from ${previousStatus} to ${newStatus}${reason ? `: ${reason}` : ''}`,
      actor,
      receipt.id
    );

    return { success: true, data: { ...matter }, receipt };
  }

  // ── Kernel Assignment ──────────────────────────────────────

  async assignKernels(
    matterId: string,
    kernels: KernelDomain[],
    actor: string
  ): Promise<ServiceResult<Matter>> {
    const matter = this.matters.get(matterId);
    if (!matter) {
      return { success: false, error: `Matter ${matterId} not found` };
    }

    const previousKernels = [...matter.assigned_kernels];
    matter.assigned_kernels = [...new Set(kernels)];
    matter.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'matter.kernels_assigned',
      description: `Kernels assigned: [${kernels.join(', ')}]`,
      actor,
      target_id: matterId,
      target_type: 'matter',
      previous_state: JSON.stringify(previousKernels),
      new_state: JSON.stringify(matter.assigned_kernels),
    });

    matter.receipt_ids.push(receipt.id);
    this.appendTimeline(
      matterId,
      'kernels_assigned',
      `Kernels assigned: [${kernels.join(', ')}] (was: [${previousKernels.join(', ')}])`,
      actor,
      receipt.id
    );

    return { success: true, data: { ...matter }, receipt };
  }

  // ── Notes ──────────────────────────────────────────────────

  async addNote(request: AddNoteRequest): Promise<ServiceResult<MatterNote>> {
    const matter = this.matters.get(request.matter_id);
    if (!matter) {
      return { success: false, error: `Matter ${request.matter_id} not found` };
    }

    const note: MatterNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content: request.content,
      note_type: request.note_type,
      source: request.source,
      created_at: new Date().toISOString(),
      trust_level: request.trust_level,
    };

    matter.notes.push(note);
    matter.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'matter.note_added',
      description: `Note added (${request.note_type}, trust: ${request.trust_level})`,
      actor: request.created_by,
      target_id: request.matter_id,
      target_type: 'matter',
      previous_state: null,
      new_state: note.id,
    });

    matter.receipt_ids.push(receipt.id);
    this.appendTimeline(
      request.matter_id,
      'note_added',
      `Note added: ${request.note_type} by ${request.created_by}`,
      request.created_by,
      receipt.id
    );

    return { success: true, data: note, receipt };
  }

  // ── Evidence ───────────────────────────────────────────────

  async addEvidence(request: AddEvidenceRequest): Promise<ServiceResult<{ matter_id: string; evidence_id: string }>> {
    const matter = this.matters.get(request.matter_id);
    if (!matter) {
      return { success: false, error: `Matter ${request.matter_id} not found` };
    }

    if (matter.evidence_ids.includes(request.evidence_id)) {
      return { success: false, error: `Evidence ${request.evidence_id} already linked to matter ${request.matter_id}` };
    }

    matter.evidence_ids.push(request.evidence_id);
    matter.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'matter.evidence_added',
      description: `Evidence ${request.evidence_id} linked to matter`,
      actor: request.added_by,
      target_id: request.matter_id,
      target_type: 'matter',
      previous_state: null,
      new_state: request.evidence_id,
    });

    matter.receipt_ids.push(receipt.id);
    this.appendTimeline(
      request.matter_id,
      'evidence_added',
      `Evidence ${request.evidence_id} linked`,
      request.added_by,
      receipt.id
    );

    return { success: true, data: { matter_id: request.matter_id, evidence_id: request.evidence_id }, receipt };
  }

  // ── Timeline ───────────────────────────────────────────────

  async getTimeline(matterId: string): Promise<ServiceResult<TimelineEntry[]>> {
    const matter = this.matters.get(matterId);
    if (!matter) {
      return { success: false, error: `Matter ${matterId} not found` };
    }

    const entries = this.timeline.get(matterId) ?? [];
    return { success: true, data: [...entries] };
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
    const receipt: Receipt = {
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
    return receipt;
  }

  private appendTimeline(
    matterId: string,
    eventType: string,
    description: string,
    actor: string,
    receiptId: string
  ): void {
    if (!this.timeline.has(matterId)) {
      this.timeline.set(matterId, []);
    }
    this.timeline.get(matterId)!.push({
      id: `tl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      matter_id: matterId,
      event_type: eventType,
      description,
      actor,
      timestamp: new Date().toISOString(),
      receipt_id: receiptId,
    });
  }
}
