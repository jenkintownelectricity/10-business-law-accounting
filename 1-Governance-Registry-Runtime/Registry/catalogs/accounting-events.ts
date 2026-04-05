/**
 * Accounting Events Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — owned by Accounting Kernel
 */

export interface AccountingEvent {
  id: string;
  event_type: 'invoice_issued' | 'invoice_received' | 'payment_sent' | 'payment_received' | 'journal_entry' | 'adjustment' | 'accrual' | 'reversal' | 'write_off' | 'refund';
  description: string;
  amount: number;
  currency: string;
  debit_account: string;
  credit_account: string;
  transaction_date: string;
  posting_date: string;
  reference_number: string;
  associated_matter_id: string | null;
  associated_client_id: string | null;
  associated_vendor_id: string | null;
  associated_invoice_id: string | null;
  associated_contract_id: string | null;
  fiscal_year: number;
  fiscal_period: number;
  tax_implications: boolean;
  tax_category: string | null;
  reconciliation_status: 'unreconciled' | 'reconciled' | 'disputed' | 'pending';
  approved_by: string | null;
  approval_date: string | null;
  supporting_documents: string[];
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'pending' | 'posted' | 'voided' | 'reversed' | 'archived';
}

export class AccountingEventCatalog {
  private entries: Map<string, AccountingEvent> = new Map();

  register(entry: AccountingEvent): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): AccountingEvent | undefined {
    return this.entries.get(id);
  }

  list(): AccountingEvent[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): AccountingEvent[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByEventType(type: AccountingEvent['event_type']): AccountingEvent[] {
    return this.list().filter(e => e.event_type === type);
  }

  listByFiscalPeriod(year: number, period: number): AccountingEvent[] {
    return this.list().filter(e => e.fiscal_year === year && e.fiscal_period === period);
  }

  listUnreconciled(): AccountingEvent[] {
    return this.list().filter(e => e.reconciliation_status === 'unreconciled');
  }

  listByMatter(matterId: string): AccountingEvent[] {
    return this.list().filter(e => e.associated_matter_id === matterId);
  }

  sumByAccount(account: string, type: 'debit' | 'credit'): number {
    return this.list()
      .filter(e => type === 'debit' ? e.debit_account === account : e.credit_account === account)
      .reduce((sum, e) => sum + e.amount, 0);
  }
}
