/**
 * Accounting Constraint Family
 * Domain: Business Law Accounting — Accounting Kernel
 */

import type { ConstraintResult, ConstraintEvaluation } from '../Business-Constraints/constraints';

export type { ConstraintResult, ConstraintEvaluation };

/** Supported currencies in the system */
const SUPPORTED_CURRENCIES = new Set([
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'MXN', 'BRL', 'KRW', 'SGD', 'HKD', 'NZD'
]);

// --- ACCT-001: unclassified-transaction ---

export interface TransactionClassificationInput {
  transaction_id: string;
  ledger_code?: string;
  account_category?: string;
  amount: number;
}

export function evaluateUnclassifiedTransaction(txn: TransactionClassificationInput): ConstraintEvaluation {
  if (txn.ledger_code && txn.account_category) {
    return {
      constraint_id: 'ACCT-001',
      constraint_name: 'unclassified-transaction',
      result: 'PASS',
      message: 'Transaction classified',
      details: { ledger_code: txn.ledger_code, account_category: txn.account_category },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'ACCT-001',
    constraint_name: 'unclassified-transaction',
    result: 'HALT',
    message: 'Transaction has no ledger classification — cannot proceed',
    details: {
      transaction_id: txn.transaction_id,
      missing_ledger_code: !txn.ledger_code,
      missing_account_category: !txn.account_category
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- ACCT-002: missing-invoice ---

export interface InvoiceRequirementInput {
  transaction_id: string;
  invoice_attached: boolean;
  amount: number;
  invoice_threshold?: number;
}

export function evaluateMissingInvoice(input: InvoiceRequirementInput): ConstraintEvaluation {
  if (input.invoice_attached) {
    return {
      constraint_id: 'ACCT-002',
      constraint_name: 'missing-invoice',
      result: 'PASS',
      message: 'Invoice attached',
      evaluated_at: new Date().toISOString()
    };
  }

  const threshold = input.invoice_threshold ?? 1000;
  const isHighValue = input.amount >= threshold;

  return {
    constraint_id: 'ACCT-002',
    constraint_name: 'missing-invoice',
    result: isHighValue ? 'HALT' : 'WARNING',
    message: isHighValue
      ? `Missing invoice for high-value transaction ($${input.amount}) — cannot proceed`
      : `Missing invoice for transaction ($${input.amount}) — review recommended`,
    details: {
      transaction_id: input.transaction_id,
      amount: input.amount,
      threshold
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- ACCT-003: unreconciled-entry ---

export interface ReconciliationInput {
  entry_id: string;
  reconciled: boolean;
  reconciliation_date?: string;
  reconciled_by?: string;
}

export function evaluateUnreconciledEntry(input: ReconciliationInput): ConstraintEvaluation {
  if (input.reconciled) {
    return {
      constraint_id: 'ACCT-003',
      constraint_name: 'unreconciled-entry',
      result: 'PASS',
      message: 'Ledger entry reconciled',
      details: {
        reconciliation_date: input.reconciliation_date,
        reconciled_by: input.reconciled_by
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'ACCT-003',
    constraint_name: 'unreconciled-entry',
    result: 'WARNING',
    message: 'Ledger entry has not been reconciled',
    details: { entry_id: input.entry_id },
    evaluated_at: new Date().toISOString()
  };
}

// --- ACCT-004: incomplete-tax-posture ---

export interface TaxPostureInput {
  entity_id: string;
  tax_assessed: boolean;
  tax_jurisdiction?: string;
  tax_classification?: string;
  assessor_id?: string;
}

export function evaluateIncompleteTaxPosture(input: TaxPostureInput): ConstraintEvaluation {
  if (input.tax_assessed && input.tax_jurisdiction && input.tax_classification) {
    return {
      constraint_id: 'ACCT-004',
      constraint_name: 'incomplete-tax-posture',
      result: 'PASS',
      message: 'Tax posture complete',
      details: {
        tax_jurisdiction: input.tax_jurisdiction,
        tax_classification: input.tax_classification,
        assessor_id: input.assessor_id
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'ACCT-004',
    constraint_name: 'incomplete-tax-posture',
    result: 'HALT',
    message: 'Tax implications have not been assessed — cannot proceed',
    details: {
      entity_id: input.entity_id,
      tax_assessed: input.tax_assessed,
      missing_jurisdiction: !input.tax_jurisdiction,
      missing_classification: !input.tax_classification
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- ACCT-005: missing-financial-period ---

export interface FinancialPeriodInput {
  entry_id: string;
  period_id?: string;
  fiscal_year?: number;
  fiscal_quarter?: number;
}

export function evaluateMissingFinancialPeriod(input: FinancialPeriodInput): ConstraintEvaluation {
  if (input.period_id || (input.fiscal_year && input.fiscal_quarter)) {
    return {
      constraint_id: 'ACCT-005',
      constraint_name: 'missing-financial-period',
      result: 'PASS',
      message: 'Financial period assigned',
      details: {
        period_id: input.period_id,
        fiscal_year: input.fiscal_year,
        fiscal_quarter: input.fiscal_quarter
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'ACCT-005',
    constraint_name: 'missing-financial-period',
    result: 'WARNING',
    message: 'No financial period assigned to this entry',
    details: { entry_id: input.entry_id },
    evaluated_at: new Date().toISOString()
  };
}

// --- ACCT-006: unsupported-currency ---

export interface CurrencyInput {
  transaction_id: string;
  currency_code: string;
}

export function evaluateUnsupportedCurrency(input: CurrencyInput): ConstraintEvaluation {
  if (SUPPORTED_CURRENCIES.has(input.currency_code.toUpperCase())) {
    return {
      constraint_id: 'ACCT-006',
      constraint_name: 'unsupported-currency',
      result: 'PASS',
      message: `Currency ${input.currency_code} is supported`,
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'ACCT-006',
    constraint_name: 'unsupported-currency',
    result: 'UNSUPPORTED',
    message: `Currency ${input.currency_code} is not supported by the system`,
    details: {
      transaction_id: input.transaction_id,
      currency_code: input.currency_code,
      supported_currencies: Array.from(SUPPORTED_CURRENCIES)
    },
    evaluated_at: new Date().toISOString()
  };
}
