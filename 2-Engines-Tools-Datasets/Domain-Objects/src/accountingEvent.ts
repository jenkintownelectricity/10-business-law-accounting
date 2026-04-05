// ──────────────────────────────────────────────────────────────
//  Domain Object: AccountingEvent
//  Records financial events with classification, period
//  assignment, tax implications, and reconciliation status.
// ──────────────────────────────────────────────────────────────

import type { TrustLevel } from './matter.js';

export type AccountingEventType =
  | 'revenue_recognition'
  | 'expense_recognition'
  | 'asset_acquisition'
  | 'asset_disposal'
  | 'liability_incurred'
  | 'liability_settled'
  | 'equity_transaction'
  | 'adjustment'
  | 'accrual'
  | 'deferral'
  | 'depreciation'
  | 'amortization'
  | 'write_off'
  | 'reclassification'
  | 'foreign_exchange'
  | 'tax_event'
  | 'intercompany'
  | 'other';

export type ReconciliationStatus =
  | 'unreconciled'
  | 'partially_reconciled'
  | 'reconciled'
  | 'discrepancy_identified'
  | 'under_investigation'
  | 'resolved';

export type EventClassification = 'operating' | 'investing' | 'financing';

export interface LedgerEntry {
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string;
}

export interface TaxImplication {
  tax_type: string;
  jurisdiction: string;
  amount: number;
  treatment: 'deductible' | 'non_deductible' | 'taxable_income' | 'exempt' | 'deferred' | 'credits';
  notes?: string;
}

export interface ReconciliationRecord {
  id: string;
  matched_transaction_id?: string;
  matched_amount: number;
  reconciled_at: string;
  reconciled_by: string;
  notes?: string;
}

export interface AccountingEvent {
  id: string;
  event_type: AccountingEventType;
  description: string;
  event_date: string;
  amount: number;
  currency: string;
  classification: EventClassification;
  ledger_entries: LedgerEntry[];
  accounting_period: string;
  fiscal_year: string;
  tax_implications: TaxImplication[];
  reconciliation_status: ReconciliationStatus;
  reconciliation_records: ReconciliationRecord[];
  source_invoice_id?: string;
  source_contract_id?: string;
  source_obligation_id?: string;
  matter_id?: string;
  evidence_ids: string[];
  trust_level: TrustLevel;
  reversing_event_id?: string;
  is_reversal: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  approved_by?: string;
  approved_at?: string;
}
