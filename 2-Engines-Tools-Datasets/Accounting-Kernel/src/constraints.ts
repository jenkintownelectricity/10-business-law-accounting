export type ConstraintResult = 'PASS' | 'WARNING' | 'HALT' | 'UNSUPPORTED' | 'PARTIAL';

export interface ConstraintEvaluation {
  constraint_id: string;
  constraint_name: string;
  result: ConstraintResult;
  message: string;
  evaluated_at: string;
}

export function evaluateUnclassifiedTransaction(event: { classified: boolean; account_code?: string }): ConstraintEvaluation {
  if (event.classified && event.account_code) {
    return { constraint_id: 'ACCT-001', constraint_name: 'unclassified-transaction', result: 'PASS', message: 'Transaction classified', evaluated_at: new Date().toISOString() };
  }
  if (event.classified) {
    return { constraint_id: 'ACCT-001', constraint_name: 'unclassified-transaction', result: 'WARNING', message: 'Transaction classified but missing account code', evaluated_at: new Date().toISOString() };
  }
  return { constraint_id: 'ACCT-001', constraint_name: 'unclassified-transaction', result: 'HALT', message: 'Transaction not classified', evaluated_at: new Date().toISOString() };
}

export function evaluateMissingInvoice(invoicePresent: boolean, amount: number): ConstraintEvaluation {
  if (invoicePresent) {
    return { constraint_id: 'ACCT-002', constraint_name: 'missing-invoice', result: 'PASS', message: 'Invoice present', evaluated_at: new Date().toISOString() };
  }
  return {
    constraint_id: 'ACCT-002',
    constraint_name: 'missing-invoice',
    result: amount > 10000 ? 'HALT' : 'WARNING',
    message: `Invoice missing for amount: ${amount}`,
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateUnreconciledEntry(entries: { reconciled: boolean }[]): ConstraintEvaluation {
  const unreconciled = entries.filter(e => !e.reconciled);
  if (unreconciled.length === 0) {
    return { constraint_id: 'ACCT-003', constraint_name: 'unreconciled-entry', result: 'PASS', message: 'All entries reconciled', evaluated_at: new Date().toISOString() };
  }
  return {
    constraint_id: 'ACCT-003',
    constraint_name: 'unreconciled-entry',
    result: unreconciled.length > 5 ? 'HALT' : 'WARNING',
    message: `${unreconciled.length} entry/entries unreconciled`,
    evaluated_at: new Date().toISOString(),
  };
}

export function evaluateIncompleteTaxPosture(posture: { complete: boolean; filing_status: string }): ConstraintEvaluation {
  if (posture.complete && posture.filing_status === 'filed') {
    return { constraint_id: 'ACCT-004', constraint_name: 'incomplete-tax-posture', result: 'PASS', message: 'Tax posture complete and filed', evaluated_at: new Date().toISOString() };
  }
  if (posture.filing_status === 'in_progress') {
    return { constraint_id: 'ACCT-004', constraint_name: 'incomplete-tax-posture', result: 'WARNING', message: 'Tax posture in progress', evaluated_at: new Date().toISOString() };
  }
  return { constraint_id: 'ACCT-004', constraint_name: 'incomplete-tax-posture', result: 'HALT', message: 'Tax posture incomplete', evaluated_at: new Date().toISOString() };
}
