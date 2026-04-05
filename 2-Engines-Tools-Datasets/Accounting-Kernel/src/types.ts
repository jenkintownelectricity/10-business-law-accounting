export interface AccountingEvent {
  id: string;
  event_type: 'invoice' | 'payment' | 'adjustment' | 'accrual' | 'write_off' | 'transfer';
  description: string;
  amount: number;
  currency: string;
  account_code?: string;
  entity_id?: string;
  classified: boolean;
  classification?: string;
  occurred_at: string;
  recorded_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  vendor_id: string;
  vendor_name: string;
  amount: number;
  currency: string;
  line_items: InvoiceLineItem[];
  issued_date: string;
  due_date: string;
  paid: boolean;
  paid_date?: string;
  status: 'draft' | 'issued' | 'received' | 'approved' | 'paid' | 'overdue' | 'disputed';
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  account_code?: string;
  tax_code?: string;
}

export interface LedgerEntry {
  id: string;
  account_code: string;
  account_name: string;
  debit: number;
  credit: number;
  description: string;
  reference_id?: string;
  reconciled: boolean;
  reconciled_at?: string;
  posted_at: string;
}

export interface TaxPosture {
  entity_id: string;
  jurisdiction: string;
  tax_year: string;
  income_reported: number;
  deductions_claimed: number;
  tax_liability_estimated: number;
  filing_status: 'not_started' | 'in_progress' | 'filed' | 'amended';
  complete: boolean;
  assessed_at: string;
}

export interface FinancialImpact {
  matter_id: string;
  total_exposure: number;
  currency: string;
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  categories: FinancialImpactCategory[];
  assessed_at: string;
}

export interface FinancialImpactCategory {
  category: string;
  amount: number;
  description: string;
}

export interface AccountingAssessment {
  kernel: 'accounting';
  matter_id: string;
  summary: string;
  financial_impact: FinancialImpact;
  tax_implications?: TaxPosture;
  reconciliation_status: ReconciliationStatus;
  recommendations: string[];
  constraints_evaluated: any[];
  assessed_at: string;
}

export interface ReconciliationStatus {
  total_entries: number;
  reconciled_entries: number;
  unreconciled_entries: number;
  discrepancy_amount: number;
  status: 'complete' | 'in_progress' | 'not_started' | 'discrepancy_found';
}
