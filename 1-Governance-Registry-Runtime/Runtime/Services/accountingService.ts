// ──────────────────────────────────────────────────────────────
//  AccountingService — Accounting Event & Invoice Management
//  Handles accounting event creation, transaction classification,
//  period assignment, invoice lifecycle, reconciliation, tax
//  implications, and financial summaries.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  AccountingEvent,
  AccountingEventType,
  EventClassification,
  ReconciliationStatus,
  LedgerEntry,
  TaxImplication,
  Invoice,
  InvoiceStatus,
  InvoiceLineItem,
  TaxSummary,
  LedgerClassification,
  TrustLevel,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Request / Response Types ───────────────────────────────────

export interface CreateAccountingEventRequest {
  event_type: AccountingEventType;
  description: string;
  event_date: string;
  amount: number;
  currency: string;
  classification: EventClassification;
  ledger_entries: LedgerEntry[];
  source_invoice_id?: string;
  source_contract_id?: string;
  source_obligation_id?: string;
  matter_id?: string;
  tags?: string[];
  created_by: string;
}

export interface ClassifyTransactionRequest {
  event_id: string;
  classification: EventClassification;
  ledger_entries: LedgerEntry[];
  classified_by: string;
  rationale: string;
}

export interface AssignPeriodRequest {
  event_id: string;
  accounting_period: string;
  fiscal_year: string;
  assigned_by: string;
  rationale?: string;
}

export interface CreateInvoiceRequest {
  invoice_number: string;
  direction: 'receivable' | 'payable';
  vendor_entity_id: string;
  client_entity_id: string;
  contract_id?: string;
  matter_id?: string;
  issue_date: string;
  due_date: string;
  line_items: InvoiceLineItem[];
  tax_summary: TaxSummary;
  ledger_classification: LedgerClassification;
  accounting_period: string;
  currency: string;
  terms: string;
  notes?: string;
  created_by: string;
}

export interface ProcessInvoiceRequest {
  invoice_id: string;
  action: 'submit' | 'approve' | 'dispute' | 'pay' | 'partially_pay' | 'write_off' | 'cancel';
  amount?: number;
  processed_by: string;
  notes?: string;
}

export interface ReconcileEntryRequest {
  event_id: string;
  matched_transaction_id: string;
  matched_amount: number;
  reconciled_by: string;
  notes?: string;
}

export interface TaxAssessmentResult {
  event_id: string;
  tax_implications: TaxImplication[];
  total_tax_impact: number;
  currency: string;
  advisory_notes: string[];
  receipt: Receipt;
}

export interface FinancialSummary {
  period: string;
  total_revenue: number;
  total_expenses: number;
  net_income: number;
  total_assets_acquired: number;
  total_liabilities_incurred: number;
  outstanding_receivables: number;
  outstanding_payables: number;
  unreconciled_count: number;
  currency: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class AccountingService {
  private events: Map<string, AccountingEvent> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private receiptSequence = 0;

  // ── Accounting Events ──────────────────────────────────────

  async createAccountingEvent(request: CreateAccountingEventRequest): Promise<ServiceResult<AccountingEvent>> {
    const now = new Date().toISOString();
    const id = `acct_evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const event: AccountingEvent = {
      id,
      event_type: request.event_type,
      description: request.description,
      event_date: request.event_date,
      amount: request.amount,
      currency: request.currency,
      classification: request.classification,
      ledger_entries: request.ledger_entries,
      accounting_period: '',
      fiscal_year: '',
      tax_implications: [],
      reconciliation_status: 'unreconciled',
      reconciliation_records: [],
      source_invoice_id: request.source_invoice_id,
      source_contract_id: request.source_contract_id,
      source_obligation_id: request.source_obligation_id,
      matter_id: request.matter_id,
      evidence_ids: [],
      trust_level: 'TRUSTED',
      is_reversal: false,
      tags: request.tags ?? [],
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
    };

    this.events.set(id, event);

    const receipt = this.emitReceipt({
      operation: 'accounting_event.created',
      description: `Accounting event created: ${request.event_type} — ${request.amount} ${request.currency}`,
      actor: request.created_by,
      target_id: id,
      target_type: 'accounting_event',
      previous_state: null,
      new_state: 'unreconciled',
    });

    return { success: true, data: event, receipt };
  }

  async classifyTransaction(request: ClassifyTransactionRequest): Promise<ServiceResult<AccountingEvent>> {
    const event = this.events.get(request.event_id);
    if (!event) {
      return { success: false, error: `Accounting event ${request.event_id} not found` };
    }

    const previousClassification = event.classification;
    event.classification = request.classification;
    event.ledger_entries = request.ledger_entries;
    event.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'accounting_event.classified',
      description: `Transaction classified: ${previousClassification} -> ${request.classification}. Rationale: ${request.rationale}`,
      actor: request.classified_by,
      target_id: request.event_id,
      target_type: 'accounting_event',
      previous_state: previousClassification,
      new_state: request.classification,
    });

    return { success: true, data: { ...event }, receipt };
  }

  async assignPeriod(request: AssignPeriodRequest): Promise<ServiceResult<AccountingEvent>> {
    const event = this.events.get(request.event_id);
    if (!event) {
      return { success: false, error: `Accounting event ${request.event_id} not found` };
    }

    const previousPeriod = event.accounting_period;
    event.accounting_period = request.accounting_period;
    event.fiscal_year = request.fiscal_year;
    event.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'accounting_event.period_assigned',
      description: `Period assigned: ${request.accounting_period} (FY ${request.fiscal_year})`,
      actor: request.assigned_by,
      target_id: request.event_id,
      target_type: 'accounting_event',
      previous_state: previousPeriod || null,
      new_state: request.accounting_period,
    });

    return { success: true, data: { ...event }, receipt };
  }

  // ── Invoice Operations ─────────────────────────────────────

  async createInvoice(request: CreateInvoiceRequest): Promise<ServiceResult<Invoice>> {
    const now = new Date().toISOString();
    const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const invoice: Invoice = {
      id,
      invoice_number: request.invoice_number,
      direction: request.direction,
      vendor_entity_id: request.vendor_entity_id,
      client_entity_id: request.client_entity_id,
      contract_id: request.contract_id,
      matter_id: request.matter_id,
      status: 'draft',
      issue_date: request.issue_date,
      due_date: request.due_date,
      line_items: request.line_items,
      tax_summary: request.tax_summary,
      ledger_classification: request.ledger_classification,
      accounting_period: request.accounting_period,
      payments: [],
      amount_paid: 0,
      amount_outstanding: request.tax_summary.total,
      currency: request.currency,
      terms: request.terms,
      notes: request.notes,
      evidence_ids: [],
      trust_level: 'TRUSTED',
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
    };

    this.invoices.set(id, invoice);

    const receipt = this.emitReceipt({
      operation: 'invoice.created',
      description: `Invoice ${request.invoice_number} created: ${request.tax_summary.total} ${request.currency}`,
      actor: request.created_by,
      target_id: id,
      target_type: 'invoice',
      previous_state: null,
      new_state: 'draft',
    });

    return { success: true, data: invoice, receipt };
  }

  async processInvoice(request: ProcessInvoiceRequest): Promise<ServiceResult<Invoice>> {
    const invoice = this.invoices.get(request.invoice_id);
    if (!invoice) {
      return { success: false, error: `Invoice ${request.invoice_id} not found` };
    }

    const STATUS_MAP: Record<string, InvoiceStatus> = {
      submit: 'submitted',
      approve: 'approved',
      dispute: 'disputed',
      pay: 'paid',
      partially_pay: 'partially_paid',
      write_off: 'written_off',
      cancel: 'cancelled',
    };

    const previousStatus = invoice.status;
    const newStatus = STATUS_MAP[request.action];
    if (!newStatus) {
      return { success: false, error: `Unknown action: ${request.action}` };
    }

    invoice.status = newStatus;
    invoice.updated_at = new Date().toISOString();

    if (request.action === 'approve') {
      invoice.approved_by = request.processed_by;
      invoice.approved_at = new Date().toISOString();
    }

    if ((request.action === 'pay' || request.action === 'partially_pay') && request.amount !== undefined) {
      invoice.payments.push({
        id: `pay_${Date.now()}`,
        amount: request.amount,
        payment_date: new Date().toISOString(),
        payment_method: 'bank_transfer',
        notes: request.notes,
      });
      invoice.amount_paid += request.amount;
      invoice.amount_outstanding = invoice.tax_summary.total - invoice.amount_paid;

      if (invoice.amount_outstanding <= 0) {
        invoice.status = 'paid';
      }
    }

    const receipt = this.emitReceipt({
      operation: `invoice.${request.action}`,
      description: `Invoice ${invoice.invoice_number}: ${previousStatus} -> ${invoice.status}`,
      actor: request.processed_by,
      target_id: request.invoice_id,
      target_type: 'invoice',
      previous_state: previousStatus,
      new_state: invoice.status,
    });

    return { success: true, data: { ...invoice }, receipt };
  }

  async reconcileEntry(request: ReconcileEntryRequest): Promise<ServiceResult<AccountingEvent>> {
    const event = this.events.get(request.event_id);
    if (!event) {
      return { success: false, error: `Accounting event ${request.event_id} not found` };
    }

    const now = new Date().toISOString();
    event.reconciliation_records.push({
      id: `recon_${Date.now()}`,
      matched_transaction_id: request.matched_transaction_id,
      matched_amount: request.matched_amount,
      reconciled_at: now,
      reconciled_by: request.reconciled_by,
      notes: request.notes,
    });

    const totalReconciled = event.reconciliation_records.reduce((sum, r) => sum + r.matched_amount, 0);
    event.reconciliation_status = totalReconciled >= event.amount ? 'reconciled' : 'partially_reconciled';
    event.updated_at = now;

    const receipt = this.emitReceipt({
      operation: 'accounting_event.reconciled',
      description: `Reconciled ${request.matched_amount} against ${request.matched_transaction_id}`,
      actor: request.reconciled_by,
      target_id: request.event_id,
      target_type: 'accounting_event',
      previous_state: null,
      new_state: event.reconciliation_status,
    });

    return { success: true, data: { ...event }, receipt };
  }

  // ── Tax & Summary ──────────────────────────────────────────

  async assessTaxImplications(
    eventId: string,
    assessedBy: string
  ): Promise<ServiceResult<TaxAssessmentResult>> {
    const event = this.events.get(eventId);
    if (!event) {
      return { success: false, error: `Accounting event ${eventId} not found` };
    }

    // Generate advisory tax implications based on event type
    const implications: TaxImplication[] = [];
    const advisoryNotes: string[] = [];

    if (event.event_type === 'revenue_recognition') {
      implications.push({
        tax_type: 'income_tax',
        jurisdiction: 'federal',
        amount: event.amount * 0.21,
        treatment: 'taxable_income',
        notes: 'Standard corporate income tax assessment',
      });
      advisoryNotes.push('Revenue timing should be reviewed for proper period recognition');
    } else if (event.event_type === 'expense_recognition') {
      implications.push({
        tax_type: 'income_tax',
        jurisdiction: 'federal',
        amount: event.amount * 0.21,
        treatment: 'deductible',
        notes: 'Expense deductibility subject to substantiation requirements',
      });
      advisoryNotes.push('Verify expense qualifies for immediate deduction vs. capitalization');
    } else {
      implications.push({
        tax_type: 'income_tax',
        jurisdiction: 'federal',
        amount: 0,
        treatment: 'deferred',
        notes: `Tax treatment for ${event.event_type} requires specific review`,
      });
      advisoryNotes.push(`Event type "${event.event_type}" requires detailed tax analysis`);
    }

    event.tax_implications = implications;
    event.updated_at = new Date().toISOString();

    const totalTax = implications.reduce((sum, ti) => sum + ti.amount, 0);

    const receipt = this.emitReceipt({
      operation: 'accounting_event.tax_assessed',
      description: `Tax implications assessed: ${implications.length} items, total ${totalTax} ${event.currency}`,
      actor: assessedBy,
      target_id: eventId,
      target_type: 'accounting_event',
      previous_state: null,
      new_state: JSON.stringify({ count: implications.length, total: totalTax }),
    });

    return {
      success: true,
      data: {
        event_id: eventId,
        tax_implications: implications,
        total_tax_impact: totalTax,
        currency: event.currency,
        advisory_notes: advisoryNotes,
        receipt,
      },
      receipt,
    };
  }

  async getFinancialSummary(period: string): Promise<ServiceResult<FinancialSummary>> {
    const periodEvents = Array.from(this.events.values()).filter(e => e.accounting_period === period);

    const revenue = periodEvents
      .filter(e => e.event_type === 'revenue_recognition')
      .reduce((sum, e) => sum + e.amount, 0);

    const expenses = periodEvents
      .filter(e => e.event_type === 'expense_recognition')
      .reduce((sum, e) => sum + e.amount, 0);

    const assets = periodEvents
      .filter(e => e.event_type === 'asset_acquisition')
      .reduce((sum, e) => sum + e.amount, 0);

    const liabilities = periodEvents
      .filter(e => e.event_type === 'liability_incurred')
      .reduce((sum, e) => sum + e.amount, 0);

    const periodInvoices = Array.from(this.invoices.values()).filter(i => i.accounting_period === period);
    const receivables = periodInvoices
      .filter(i => i.direction === 'receivable')
      .reduce((sum, i) => sum + i.amount_outstanding, 0);
    const payables = periodInvoices
      .filter(i => i.direction === 'payable')
      .reduce((sum, i) => sum + i.amount_outstanding, 0);

    const unreconciledCount = periodEvents.filter(e => e.reconciliation_status === 'unreconciled').length;

    const currency = periodEvents[0]?.currency ?? 'USD';

    return {
      success: true,
      data: {
        period,
        total_revenue: revenue,
        total_expenses: expenses,
        net_income: revenue - expenses,
        total_assets_acquired: assets,
        total_liabilities_incurred: liabilities,
        outstanding_receivables: receivables,
        outstanding_payables: payables,
        unreconciled_count: unreconciledCount,
        currency,
      },
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
      source_kernel: 'accounting',
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
