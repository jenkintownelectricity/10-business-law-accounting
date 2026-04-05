// ──────────────────────────────────────────────────────────────
//  Domain Object: Invoice
//  Full invoice model with vendor/client references, line items,
//  tax handling, payment status, and ledger classification.
// ──────────────────────────────────────────────────────────────

import type { TrustLevel } from './matter.js';

export type InvoiceDirection = 'receivable' | 'payable';

export type InvoiceStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'disputed'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'written_off'
  | 'cancelled';

export type PaymentMethod =
  | 'bank_transfer'
  | 'check'
  | 'credit_card'
  | 'ach'
  | 'wire'
  | 'cash'
  | 'other';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  ledger_account_code: string;
  cost_center?: string;
  obligation_id?: string;
  contract_id?: string;
}

export interface TaxSummary {
  subtotal: number;
  total_tax: number;
  tax_breakdowns: TaxBreakdown[];
  total: number;
  currency: string;
}

export interface TaxBreakdown {
  tax_type: string;
  jurisdiction: string;
  rate: number;
  taxable_amount: number;
  tax_amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
}

export interface LedgerClassification {
  account_code: string;
  account_name: string;
  cost_center?: string;
  department?: string;
  project_code?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  direction: InvoiceDirection;
  vendor_entity_id: string;
  client_entity_id: string;
  contract_id?: string;
  matter_id?: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  line_items: InvoiceLineItem[];
  tax_summary: TaxSummary;
  ledger_classification: LedgerClassification;
  accounting_period: string;
  payments: PaymentRecord[];
  amount_paid: number;
  amount_outstanding: number;
  currency: string;
  terms: string;
  notes?: string;
  evidence_ids: string[];
  trust_level: TrustLevel;
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
}
