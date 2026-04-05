// ──────────────────────────────────────────────────────────────
//  ObligationService — Obligation Tracking & Compliance
//  CRUD for obligations, deadline tracking, compliance status
//  management, and overdue detection.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  Obligation,
  ObligationType,
  ObligationStatus,
  ComplianceStatus,
  FinancialImpact,
  KernelDomain,
  Priority,
  TrustLevel,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Request / Response Types ───────────────────────────────────

export interface CreateObligationRequest {
  title: string;
  description: string;
  obligation_type: ObligationType;
  source_contract_id?: string;
  source_matter_id?: string;
  source_regulation?: string;
  obligor_entity_id: string;
  obligee_entity_id: string;
  assigned_kernel: KernelDomain;
  due_date?: string;
  recurring: boolean;
  recurrence_schedule?: string;
  financial_impact?: FinancialImpact;
  priority: Priority;
  trust_level: TrustLevel;
  tags?: string[];
  created_by: string;
}

export interface UpdateObligationRequest {
  id: string;
  title?: string;
  description?: string;
  due_date?: string;
  financial_impact?: FinancialImpact;
  priority?: Priority;
  tags?: string[];
  escalation_path?: string;
  updated_by: string;
}

export interface ListObligationsFilter {
  obligation_type?: ObligationType;
  obligation_status?: ObligationStatus;
  compliance_status?: ComplianceStatus;
  assigned_kernel?: KernelDomain;
  source_contract_id?: string;
  source_matter_id?: string;
  priority?: Priority;
  overdue_only?: boolean;
  due_before?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class ObligationService {
  private obligations: Map<string, Obligation> = new Map();
  private receiptSequence = 0;

  // ── CRUD ───────────────────────────────────────────────────

  async createObligation(request: CreateObligationRequest): Promise<ServiceResult<Obligation>> {
    const now = new Date().toISOString();
    const id = `obl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const obligation: Obligation = {
      id,
      title: request.title,
      description: request.description,
      obligation_type: request.obligation_type,
      source_contract_id: request.source_contract_id,
      source_matter_id: request.source_matter_id,
      source_regulation: request.source_regulation,
      obligor_entity_id: request.obligor_entity_id,
      obligee_entity_id: request.obligee_entity_id,
      assigned_kernel: request.assigned_kernel,
      due_date: request.due_date,
      recurring: request.recurring,
      recurrence_schedule: request.recurrence_schedule,
      financial_impact: request.financial_impact ?? null,
      compliance_status: 'pending_review',
      obligation_status: 'identified',
      evidence: [],
      deadline_ids: [],
      priority: request.priority,
      trust_level: request.trust_level,
      tags: request.tags ?? [],
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
    };

    this.obligations.set(id, obligation);

    const receipt = this.emitReceipt({
      operation: 'obligation.created',
      description: `Obligation "${obligation.title}" created`,
      actor: request.created_by,
      target_id: id,
      target_type: 'obligation',
      previous_state: null,
      new_state: 'identified',
    });

    return { success: true, data: obligation, receipt };
  }

  async getObligation(id: string): Promise<ServiceResult<Obligation>> {
    const obligation = this.obligations.get(id);
    if (!obligation) {
      return { success: false, error: `Obligation ${id} not found` };
    }
    return { success: true, data: { ...obligation } };
  }

  async updateObligation(request: UpdateObligationRequest): Promise<ServiceResult<Obligation>> {
    const obligation = this.obligations.get(request.id);
    if (!obligation) {
      return { success: false, error: `Obligation ${request.id} not found` };
    }

    if (request.title !== undefined) obligation.title = request.title;
    if (request.description !== undefined) obligation.description = request.description;
    if (request.due_date !== undefined) obligation.due_date = request.due_date;
    if (request.financial_impact !== undefined) obligation.financial_impact = request.financial_impact;
    if (request.priority !== undefined) obligation.priority = request.priority;
    if (request.tags !== undefined) obligation.tags = request.tags;
    if (request.escalation_path !== undefined) obligation.escalation_path = request.escalation_path;
    obligation.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'obligation.updated',
      description: `Obligation "${obligation.title}" updated`,
      actor: request.updated_by,
      target_id: request.id,
      target_type: 'obligation',
      previous_state: null,
      new_state: obligation.obligation_status,
    });

    return { success: true, data: { ...obligation }, receipt };
  }

  async listObligations(filter: ListObligationsFilter = {}): Promise<ServiceResult<Obligation[]>> {
    let results = Array.from(this.obligations.values());

    if (filter.obligation_type) results = results.filter(o => o.obligation_type === filter.obligation_type);
    if (filter.obligation_status) results = results.filter(o => o.obligation_status === filter.obligation_status);
    if (filter.compliance_status) results = results.filter(o => o.compliance_status === filter.compliance_status);
    if (filter.assigned_kernel) results = results.filter(o => o.assigned_kernel === filter.assigned_kernel);
    if (filter.source_contract_id) results = results.filter(o => o.source_contract_id === filter.source_contract_id);
    if (filter.source_matter_id) results = results.filter(o => o.source_matter_id === filter.source_matter_id);
    if (filter.priority) results = results.filter(o => o.priority === filter.priority);
    if (filter.tag) results = results.filter(o => o.tags.includes(filter.tag!));
    if (filter.due_before) {
      const cutoff = new Date(filter.due_before).getTime();
      results = results.filter(o => o.due_date && new Date(o.due_date).getTime() <= cutoff);
    }
    if (filter.overdue_only) {
      const now = Date.now();
      results = results.filter(o =>
        o.due_date &&
        new Date(o.due_date).getTime() < now &&
        o.obligation_status !== 'fulfilled' &&
        o.obligation_status !== 'waived' &&
        o.obligation_status !== 'expired'
      );
    }

    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 50;
    results = results.slice(offset, offset + limit);

    return { success: true, data: results };
  }

  // ── Deadline Tracking ──────────────────────────────────────

  async trackDeadline(
    obligationId: string,
    deadlineId: string,
    actor: string
  ): Promise<ServiceResult<Obligation>> {
    const obligation = this.obligations.get(obligationId);
    if (!obligation) {
      return { success: false, error: `Obligation ${obligationId} not found` };
    }

    if (obligation.deadline_ids.includes(deadlineId)) {
      return { success: false, error: `Deadline ${deadlineId} already tracked for obligation ${obligationId}` };
    }

    obligation.deadline_ids.push(deadlineId);
    obligation.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'obligation.deadline_tracked',
      description: `Deadline ${deadlineId} linked to obligation "${obligation.title}"`,
      actor,
      target_id: obligationId,
      target_type: 'obligation',
      previous_state: null,
      new_state: deadlineId,
    });

    return { success: true, data: { ...obligation }, receipt };
  }

  // ── Compliance Status ──────────────────────────────────────

  async updateComplianceStatus(
    obligationId: string,
    newStatus: ComplianceStatus,
    actor: string,
    reason?: string
  ): Promise<ServiceResult<Obligation>> {
    const obligation = this.obligations.get(obligationId);
    if (!obligation) {
      return { success: false, error: `Obligation ${obligationId} not found` };
    }

    const previousStatus = obligation.compliance_status;
    obligation.compliance_status = newStatus;
    obligation.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'obligation.compliance_status_updated',
      description: `Compliance: ${previousStatus} -> ${newStatus}${reason ? ` (${reason})` : ''}`,
      actor,
      target_id: obligationId,
      target_type: 'obligation',
      previous_state: previousStatus,
      new_state: newStatus,
    });

    return { success: true, data: { ...obligation }, receipt };
  }

  // ── Query Helpers ──────────────────────────────────────────

  async getObligationsByContract(contractId: string): Promise<ServiceResult<Obligation[]>> {
    const results = Array.from(this.obligations.values())
      .filter(o => o.source_contract_id === contractId);
    return { success: true, data: results };
  }

  async getOverdueObligations(): Promise<ServiceResult<Obligation[]>> {
    const now = Date.now();
    const results = Array.from(this.obligations.values()).filter(o =>
      o.due_date &&
      new Date(o.due_date).getTime() < now &&
      o.obligation_status !== 'fulfilled' &&
      o.obligation_status !== 'waived' &&
      o.obligation_status !== 'expired'
    );
    return { success: true, data: results };
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
