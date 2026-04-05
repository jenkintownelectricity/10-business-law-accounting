/**
 * Accounting-Classification-Worker
 *
 * Receives accounting events/invoices, classifies into ledger categories,
 * assigns accounting periods, evaluates tax implications, checks
 * reconciliation status.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LedgerCategory =
  | 'accounts_receivable'
  | 'accounts_payable'
  | 'revenue'
  | 'expense'
  | 'asset'
  | 'liability'
  | 'equity'
  | 'cost_of_goods_sold'
  | 'other';

export type ReconciliationStatus =
  | 'unreconciled'
  | 'partially_reconciled'
  | 'reconciled'
  | 'discrepancy_detected';

export interface AccountingEvent {
  event_id: string;
  matter_id?: string;
  event_type: 'invoice' | 'payment' | 'credit' | 'debit' | 'adjustment' | 'accrual';
  description: string;
  amount: number;
  currency: string;
  counterparty?: string;
  reference_date: string;
  metadata?: Record<string, unknown>;
}

export interface TaxImplication {
  tax_type: string;
  applicable: boolean;
  rate?: number;
  notes: string;
}

export interface ClassificationResult {
  event_id: string;
  ledger_category: LedgerCategory;
  sub_category?: string;
  accounting_period: string;
  fiscal_year: string;
  tax_implications: TaxImplication[];
  reconciliation_status: ReconciliationStatus;
  confidence: number;
  requires_review: boolean;
  receipt_id: string;
  classified_at: string;
}

export interface ClassificationReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'accounting_classification';
  source_kernel: 'accounting';
  entity_type: 'accounting_event';
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

function deriveAccountingPeriod(dateStr: string): { period: string; fiscalYear: string } {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const period = `${year}-${month.toString().padStart(2, '0')}`;
  const fiscalYear = `FY${year}`;
  return { period, fiscalYear };
}

// ---------------------------------------------------------------------------
// Classification logic
// ---------------------------------------------------------------------------

function classifyLedgerCategory(event: AccountingEvent): { category: LedgerCategory; subCategory?: string; confidence: number } {
  switch (event.event_type) {
    case 'invoice':
      return { category: 'accounts_receivable', subCategory: 'client_invoices', confidence: 0.9 };
    case 'payment':
      if (event.amount > 0) {
        return { category: 'revenue', subCategory: 'payment_received', confidence: 0.85 };
      }
      return { category: 'accounts_payable', subCategory: 'payment_made', confidence: 0.85 };
    case 'credit':
      return { category: 'accounts_receivable', subCategory: 'credit_applied', confidence: 0.8 };
    case 'debit':
      return { category: 'expense', subCategory: 'debit_charge', confidence: 0.8 };
    case 'adjustment':
      return { category: 'other', subCategory: 'adjustment', confidence: 0.6 };
    case 'accrual':
      return { category: 'liability', subCategory: 'accrued_expense', confidence: 0.75 };
    default:
      return { category: 'other', confidence: 0.3 };
  }
}

function evaluateTaxImplications(event: AccountingEvent, ledgerCategory: LedgerCategory): TaxImplication[] {
  const implications: TaxImplication[] = [];

  // Sales tax for revenue items
  if (ledgerCategory === 'revenue' || ledgerCategory === 'accounts_receivable') {
    implications.push({
      tax_type: 'sales_tax',
      applicable: true,
      notes: 'Review for applicable sales tax obligations',
    });
  }

  // Income tax for revenue
  if (ledgerCategory === 'revenue') {
    implications.push({
      tax_type: 'income_tax',
      applicable: true,
      notes: 'Revenue event — include in taxable income calculation',
    });
  }

  // Deductibility for expenses
  if (ledgerCategory === 'expense' || ledgerCategory === 'cost_of_goods_sold') {
    implications.push({
      tax_type: 'deduction',
      applicable: true,
      notes: 'Evaluate for tax deductibility',
    });
  }

  if (implications.length === 0) {
    implications.push({
      tax_type: 'none',
      applicable: false,
      notes: 'No immediate tax implications identified',
    });
  }

  return implications;
}

function checkReconciliation(event: AccountingEvent): ReconciliationStatus {
  // New events start as unreconciled
  return 'unreconciled';
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class AccountingClassificationWorker {
  private receipts: ClassificationReceipt[] = [];
  private classifications: ClassificationResult[] = [];

  /**
   * Classify an accounting event.
   */
  async classifyEvent(event: AccountingEvent): Promise<ClassificationResult> {
    const now = new Date().toISOString();
    const receiptId = generateId('RCT');

    // 1. Classify into ledger category
    const { category, subCategory, confidence } = classifyLedgerCategory(event);

    // 2. Derive accounting period
    const { period, fiscalYear } = deriveAccountingPeriod(event.reference_date);

    // 3. Evaluate tax implications
    const taxImplications = evaluateTaxImplications(event, category);

    // 4. Check reconciliation status
    const reconciliationStatus = checkReconciliation(event);

    // 5. Determine if review is needed
    const requiresReview = confidence < 0.7;

    const result: ClassificationResult = {
      event_id: event.event_id,
      ledger_category: category,
      sub_category: subCategory,
      accounting_period: period,
      fiscal_year: fiscalYear,
      tax_implications: taxImplications,
      reconciliation_status: reconciliationStatus,
      confidence,
      requires_review: requiresReview,
      receipt_id: receiptId,
      classified_at: now,
    };
    this.classifications.push(result);

    // 6. Emit receipt
    const receipt: ClassificationReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'accounting_classification',
      source_kernel: 'accounting',
      entity_type: 'accounting_event',
      entity_id: event.event_id,
      details: {
        ledger_category: category,
        sub_category: subCategory,
        accounting_period: period,
        fiscal_year: fiscalYear,
        confidence,
        requires_review: requiresReview,
        matter_id: event.matter_id ?? null,
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    return result;
  }

  /**
   * Batch classify multiple events.
   */
  async classifyBatch(events: AccountingEvent[]): Promise<ClassificationResult[]> {
    const results: ClassificationResult[] = [];
    for (const event of events) {
      results.push(await this.classifyEvent(event));
    }
    return results;
  }

  getClassifications(): ClassificationResult[] {
    return [...this.classifications];
  }

  getReceipts(): ClassificationReceipt[] {
    return [...this.receipts];
  }
}
