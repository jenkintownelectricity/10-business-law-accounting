/**
 * Accounting Kernel
 * Sovereign kernel for financial truth.
 * Owns: financial treatment, invoices, ledger classification, tax posture,
 *       reconciliation, financial impact assessment.
 */

import {
  AccountingEvent,
  Invoice,
  LedgerEntry,
  TaxPosture,
  FinancialImpact,
  AccountingAssessment,
  ReconciliationStatus,
} from './types';
import {
  ConstraintEvaluation,
  evaluateUnclassifiedTransaction,
  evaluateMissingInvoice,
  evaluateUnreconciledEntry,
  evaluateIncompleteTaxPosture,
} from './constraints';

export interface AccountingEvaluationRequest {
  object_id: string;
  object_type: string;
  payload: Record<string, unknown>;
  evaluation_context: {
    matter_id: string | null;
    requesting_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
    priority: 'critical' | 'high' | 'medium' | 'low';
    timestamp: string;
  };
}

export interface AccountingEvaluationResult {
  kernel: 'accounting';
  object_id: string;
  evaluation_type: string;
  constraints_evaluated: ConstraintEvaluation[];
  summary: string;
  receipt_id: string;
  evaluated_at: string;
}

export interface AccountingValidationResult {
  kernel: 'accounting';
  object_id: string;
  valid: boolean;
  violations: {
    rule: string;
    description: string;
    field: string | null;
  }[];
  receipt_id: string;
  validated_at: string;
}

export class AccountingKernel {
  readonly name = 'accounting' as const;
  readonly version = '1.0.0';

  private readonly ownedTypes = [
    'accounting_event',
    'invoice',
    'ledger_entry',
    'tax_posture',
    'financial_impact',
    'reconciliation',
  ];

  /**
   * Evaluate an object against accounting domain rules.
   */
  async evaluate(request: AccountingEvaluationRequest): Promise<AccountingEvaluationResult> {
    const constraints: ConstraintEvaluation[] = [];
    const { object_type, payload } = request;

    if (object_type === 'accounting_event' || object_type === 'transaction') {
      constraints.push(
        evaluateUnclassifiedTransaction({
          classified: (payload.classified as boolean) ?? false,
          account_code: payload.account_code as string | undefined,
        })
      );
    }

    if (object_type === 'invoice' || object_type === 'payment') {
      constraints.push(
        evaluateMissingInvoice(
          (payload.invoice_present as boolean) ?? false,
          (payload.amount as number) ?? 0
        )
      );
    }

    if (object_type === 'ledger_entry' || object_type === 'reconciliation') {
      const entries = (payload.entries as { reconciled: boolean }[]) ?? [];
      constraints.push(evaluateUnreconciledEntry(entries));
    }

    if (object_type === 'tax_posture') {
      constraints.push(
        evaluateIncompleteTaxPosture({
          complete: (payload.complete as boolean) ?? false,
          filing_status: (payload.filing_status as string) ?? 'not_started',
        })
      );
    }

    const hasHalt = constraints.some(c => c.result === 'HALT');
    const hasWarning = constraints.some(c => c.result === 'WARNING');

    let summary = 'All accounting constraints satisfied.';
    if (hasHalt) {
      summary = 'Accounting evaluation found blocking issues. See constraints for details.';
    } else if (hasWarning) {
      summary = 'Accounting evaluation passed with warnings. Review recommended.';
    }

    return {
      kernel: 'accounting',
      object_id: request.object_id,
      evaluation_type: `accounting_evaluation:${object_type}`,
      constraints_evaluated: constraints,
      summary,
      receipt_id: `receipt-acct-eval-${request.object_id}-${Date.now()}`,
      evaluated_at: new Date().toISOString(),
    };
  }

  /**
   * Validate an accounting object's completeness and correctness.
   */
  async validate(
    objectId: string,
    objectType: string,
    payload: Record<string, unknown>
  ): Promise<AccountingValidationResult> {
    const violations: AccountingValidationResult['violations'] = [];

    if (objectType === 'invoice') {
      if (!payload.invoice_number) violations.push({ rule: 'invoice_number_required', description: 'Invoice number is required', field: 'invoice_number' });
      if (!payload.amount || (payload.amount as number) <= 0) violations.push({ rule: 'positive_amount', description: 'Amount must be positive', field: 'amount' });
      if (!payload.vendor_id) violations.push({ rule: 'vendor_required', description: 'Vendor is required', field: 'vendor_id' });
      if (!payload.due_date) violations.push({ rule: 'due_date_required', description: 'Due date is required', field: 'due_date' });
    }

    if (objectType === 'ledger_entry') {
      if (!payload.account_code) violations.push({ rule: 'account_code_required', description: 'Account code is required', field: 'account_code' });
      const debit = (payload.debit as number) ?? 0;
      const credit = (payload.credit as number) ?? 0;
      if (debit === 0 && credit === 0) violations.push({ rule: 'nonzero_entry', description: 'Either debit or credit must be nonzero', field: null });
      if (debit > 0 && credit > 0) violations.push({ rule: 'single_side_entry', description: 'Entry cannot have both debit and credit', field: null });
    }

    if (objectType === 'accounting_event') {
      if (!payload.event_type) violations.push({ rule: 'event_type_required', description: 'Event type is required', field: 'event_type' });
      if (!payload.amount) violations.push({ rule: 'amount_required', description: 'Amount is required', field: 'amount' });
      if (!payload.transaction_date) violations.push({ rule: 'date_required', description: 'Transaction date is required', field: 'transaction_date' });
    }

    return {
      kernel: 'accounting',
      object_id: objectId,
      valid: violations.length === 0,
      violations,
      receipt_id: `receipt-acct-val-${objectId}-${Date.now()}`,
      validated_at: new Date().toISOString(),
    };
  }

  /**
   * Produce a financial assessment for a matter.
   */
  async assess(
    matterId: string,
    scope: {
      events?: AccountingEvent[];
      invoices?: Invoice[];
      ledgerEntries?: LedgerEntry[];
      taxPosture?: TaxPosture;
    }
  ): Promise<AccountingAssessment> {
    // Calculate financial impact
    const totalExposure = (scope.events ?? []).reduce((sum, e) => sum + e.amount, 0)
      + (scope.invoices ?? []).filter(i => !i.paid).reduce((sum, i) => sum + i.amount, 0);

    const impactLevel = totalExposure > 1000000 ? 'critical'
      : totalExposure > 100000 ? 'high'
      : totalExposure > 10000 ? 'medium'
      : 'low';

    const financialImpact: FinancialImpact = {
      matter_id: matterId,
      total_exposure: totalExposure,
      currency: 'USD',
      impact_level: impactLevel,
      categories: [],
      assessed_at: new Date().toISOString(),
    };

    // Calculate reconciliation status
    const allEntries = scope.ledgerEntries ?? [];
    const reconciledCount = allEntries.filter(e => e.reconciled).length;
    const reconciliationStatus: ReconciliationStatus = {
      total_entries: allEntries.length,
      reconciled_entries: reconciledCount,
      unreconciled_entries: allEntries.length - reconciledCount,
      discrepancy_amount: 0,
      status: allEntries.length === 0 ? 'not_started'
        : reconciledCount === allEntries.length ? 'complete'
        : 'in_progress',
    };

    // Evaluate constraints
    const constraintsEvaluated: ConstraintEvaluation[] = [];
    for (const event of (scope.events ?? [])) {
      constraintsEvaluated.push(evaluateUnclassifiedTransaction(event));
    }
    if (allEntries.length > 0) {
      constraintsEvaluated.push(evaluateUnreconciledEntry(allEntries));
    }
    if (scope.taxPosture) {
      constraintsEvaluated.push(evaluateIncompleteTaxPosture(scope.taxPosture));
    }

    const recommendations: string[] = [];
    if (reconciliationStatus.unreconciled_entries > 0) {
      recommendations.push(`Reconcile ${reconciliationStatus.unreconciled_entries} outstanding ledger entries.`);
    }
    if (scope.taxPosture && !scope.taxPosture.complete) {
      recommendations.push('Complete tax posture assessment before matter resolution.');
    }
    const unpaidInvoices = (scope.invoices ?? []).filter(i => !i.paid);
    if (unpaidInvoices.length > 0) {
      recommendations.push(`Review ${unpaidInvoices.length} unpaid invoices totaling ${unpaidInvoices.reduce((s, i) => s + i.amount, 0)}.`);
    }

    return {
      kernel: 'accounting',
      matter_id: matterId,
      summary: `Financial assessment: ${impactLevel} impact, $${totalExposure.toLocaleString()} exposure. Reconciliation: ${reconciliationStatus.status}.`,
      financial_impact: financialImpact,
      tax_implications: scope.taxPosture,
      reconciliation_status: reconciliationStatus,
      recommendations,
      constraints_evaluated: constraintsEvaluated,
      assessed_at: new Date().toISOString(),
    };
  }

  /**
   * Get all constraints enforced by this kernel.
   */
  getConstraints() {
    return [
      { constraint_name: 'unclassified-transaction', description: 'All transactions must be classified with an account code', applies_to: ['accounting_event', 'transaction'], severity: 'high' as const },
      { constraint_name: 'missing-invoice', description: 'Payments must have associated invoices', applies_to: ['invoice', 'payment'], severity: 'medium' as const },
      { constraint_name: 'unreconciled-entry', description: 'Ledger entries must be reconciled', applies_to: ['ledger_entry', 'reconciliation'], severity: 'high' as const },
      { constraint_name: 'incomplete-tax-posture', description: 'Tax posture must be complete before matter resolution', applies_to: ['tax_posture'], severity: 'critical' as const },
    ];
  }

  /**
   * Get the list of object types this kernel owns.
   */
  getOwnedTypes(): string[] {
    return [...this.ownedTypes];
  }

  /**
   * Check if this kernel can handle a given object type.
   */
  canHandle(objectType: string): boolean {
    return this.ownedTypes.includes(objectType);
  }
}
