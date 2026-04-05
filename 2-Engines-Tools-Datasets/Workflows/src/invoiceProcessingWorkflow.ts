// ──────────────────────────────────────────────────────────────
//  Workflow: Invoice Processing
//
//  Routes an invoice through kernels for classification,
//  validation, and ledger entry generation.
//
//  Flow:
//    1. Validate invoice input
//    2. Accounting Kernel — classification, period, tax assessment
//    3. Business Kernel — vendor validation, commercial context
//    4. Law Kernel (conditional) — if contractual obligations referenced
//    5. Constraint evaluation
//    6. Output classified invoice with ledger entries
// ──────────────────────────────────────────────────────────────

import type {
  Invoice,
  InvoiceLineItem,
  LedgerClassification,
  TaxSummary,
  AccountingEvent,
  LedgerEntry,
  TaxImplication,
  Obligation,
  ConstraintEvaluation,
  KernelReceipt,
  Priority,
} from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export interface InvoiceProcessingInput {
  invoice_id?: string;
  invoice_data?: Partial<Invoice>;
  document_path?: string;
  requested_by: string;
  priority: Priority;
  matter_id?: string;
  auto_classify: boolean;
}

export interface ClassificationResult {
  ledger_classification: LedgerClassification;
  accounting_period: string;
  fiscal_year: string;
  suggested_account_code: string;
  suggested_cost_center?: string;
  confidence: number;
}

export interface TaxAssessmentResult {
  tax_summary: TaxSummary;
  tax_implications: TaxImplication[];
  withholding_required: boolean;
  withholding_rate?: number;
  tax_jurisdiction: string;
}

export interface VendorValidationResult {
  vendor_entity_id: string;
  vendor_status: 'active' | 'inactive' | 'suspended' | 'unknown';
  vendor_standing: 'good' | 'cautionary' | 'delinquent' | 'unknown';
  payment_terms_match: boolean;
  expected_terms?: string;
  commercial_notes: string[];
}

export interface ContractualCheckResult {
  contract_referenced: boolean;
  contract_id?: string;
  obligations_matched: string[];
  pricing_compliant: boolean;
  pricing_variance?: number;
  notes: string[];
}

export interface GeneratedLedgerEntry {
  entry_id: string;
  ledger_entries: LedgerEntry[];
  accounting_event_type: string;
  period: string;
  description: string;
}

export interface InvoiceProcessingPacket {
  id: string;
  invoice_id: string;
  matter_id?: string;
  classification: ClassificationResult;
  tax_assessment: TaxAssessmentResult;
  vendor_validation: VendorValidationResult;
  contractual_check: ContractualCheckResult | null;
  generated_ledger_entries: GeneratedLedgerEntry[];
  constraint_evaluations: ConstraintEvaluation[];
  kernel_receipts: KernelReceipt[];
  warnings: string[];
  approval_required: boolean;
  approval_reason?: string;
  review_status: 'pending_review' | 'auto_approved' | 'requires_approval';
  generated_at: string;
  generated_by: string;
}

// ── Workflow stages ──────────────────────────────────────────

export type InvoiceProcessingStage =
  | 'input_validation'
  | 'invoice_retrieval'
  | 'accounting_kernel_classification'
  | 'accounting_kernel_tax'
  | 'business_kernel_vendor_validation'
  | 'law_kernel_contract_check'
  | 'ledger_entry_generation'
  | 'constraint_evaluation'
  | 'output_generation'
  | 'completed'
  | 'failed';

export interface InvoiceProcessingState {
  stage: InvoiceProcessingStage;
  input: InvoiceProcessingInput;
  invoice: Invoice | null;
  classification: ClassificationResult | null;
  tax_assessment: TaxAssessmentResult | null;
  vendor_validation: VendorValidationResult | null;
  contractual_check: ContractualCheckResult | null;
  generated_ledger_entries: GeneratedLedgerEntry[];
  constraint_evaluations: ConstraintEvaluation[];
  kernel_receipts: KernelReceipt[];
  warnings: string[];
  errors: InvoiceWorkflowError[];
  started_at: string;
  completed_at?: string;
}

export interface InvoiceWorkflowError {
  stage: InvoiceProcessingStage;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
}

// ── Workflow execution ───────────────────────────────────────

function createInitialState(input: InvoiceProcessingInput): InvoiceProcessingState {
  return {
    stage: 'input_validation',
    input,
    invoice: null,
    classification: null,
    tax_assessment: null,
    vendor_validation: null,
    contractual_check: null,
    generated_ledger_entries: [],
    constraint_evaluations: [],
    kernel_receipts: [],
    warnings: [],
    errors: [],
    started_at: new Date().toISOString(),
  };
}

function addReceipt(
  state: InvoiceProcessingState,
  kernel: 'business' | 'law' | 'accounting',
  operation: string,
  status: 'success' | 'failure' | 'partial',
): InvoiceProcessingState {
  const receipt: KernelReceipt = {
    receipt_id: `rcpt_${kernel}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    kernel,
    operation,
    timestamp: new Date().toISOString(),
    status,
  };
  return { ...state, kernel_receipts: [...state.kernel_receipts, receipt] };
}

export async function executeInvoiceProcessing(
  input: InvoiceProcessingInput,
  dependencies: InvoiceProcessingDependencies,
): Promise<InvoiceProcessingPacket> {
  let state = createInitialState(input);

  // Stage 1: Validate
  if (!input.invoice_id && !input.invoice_data && !input.document_path) {
    throw new InvoiceProcessingError([{
      stage: 'input_validation',
      code: 'MISSING_INVOICE_REFERENCE',
      message: 'At least one of invoice_id, invoice_data, or document_path is required.',
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Stage 2: Retrieve/parse invoice
  state.stage = 'invoice_retrieval';
  try {
    state.invoice = await dependencies.retrieveInvoice(input);
  } catch (err) {
    throw new InvoiceProcessingError([{
      stage: 'invoice_retrieval',
      code: 'INVOICE_RETRIEVAL_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Stage 3: Accounting Kernel — classification and period assignment
  state.stage = 'accounting_kernel_classification';
  try {
    state.classification = await dependencies.accountingKernelClassify(state.invoice!);
    state = addReceipt(state, 'accounting', 'invoice_classification', 'success');
  } catch (err) {
    state = addReceipt(state, 'accounting', 'invoice_classification', 'failure');
    state.errors.push({
      stage: 'accounting_kernel_classification',
      code: 'CLASSIFICATION_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Stage 4: Accounting Kernel — tax assessment
  state.stage = 'accounting_kernel_tax';
  try {
    state.tax_assessment = await dependencies.accountingKernelTaxAssess(state.invoice!);
    state = addReceipt(state, 'accounting', 'invoice_tax_assessment', 'success');
  } catch (err) {
    state = addReceipt(state, 'accounting', 'invoice_tax_assessment', 'failure');
    state.errors.push({
      stage: 'accounting_kernel_tax',
      code: 'TAX_ASSESSMENT_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Stage 5: Business Kernel — vendor validation and commercial context
  state.stage = 'business_kernel_vendor_validation';
  try {
    state.vendor_validation = await dependencies.businessKernelValidateVendor(state.invoice!);
    state = addReceipt(state, 'business', 'vendor_validation', 'success');

    if (state.vendor_validation.vendor_standing === 'delinquent') {
      state.warnings.push('Vendor is in delinquent standing — payment hold recommended.');
    }
    if (!state.vendor_validation.payment_terms_match) {
      state.warnings.push(
        `Payment terms mismatch: invoice terms differ from expected (${state.vendor_validation.expected_terms}).`,
      );
    }
  } catch (err) {
    state = addReceipt(state, 'business', 'vendor_validation', 'failure');
    state.errors.push({
      stage: 'business_kernel_vendor_validation',
      code: 'VENDOR_VALIDATION_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Stage 6: Law Kernel (conditional) — check if contract is referenced
  const hasContractRef = state.invoice!.contract_id != null;
  if (hasContractRef) {
    state.stage = 'law_kernel_contract_check';
    try {
      state.contractual_check = await dependencies.lawKernelContractCheck(state.invoice!);
      state = addReceipt(state, 'law', 'invoice_contract_check', 'success');

      if (state.contractual_check.pricing_compliant === false) {
        state.warnings.push(
          `Invoice pricing deviates from contract by ${state.contractual_check.pricing_variance ?? 0}%.`,
        );
      }
    } catch (err) {
      state = addReceipt(state, 'law', 'invoice_contract_check', 'failure');
      state.errors.push({
        stage: 'law_kernel_contract_check',
        code: 'CONTRACT_CHECK_FAILED',
        message: err instanceof Error ? err.message : String(err),
        recoverable: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Stage 7: Generate ledger entries
  state.stage = 'ledger_entry_generation';
  if (state.classification) {
    state.generated_ledger_entries = await dependencies.generateLedgerEntries(
      state.invoice!,
      state.classification,
      state.tax_assessment,
    );
  }

  // Stage 8: Constraint evaluation
  state.stage = 'constraint_evaluation';
  state.constraint_evaluations = await dependencies.evaluateConstraints(state);

  const hasViolation = state.constraint_evaluations.some(c => c.result === 'violated');
  const needsApproval = hasViolation
    || state.warnings.length > 0
    || state.invoice!.tax_summary.total > 10000
    || state.errors.length > 0;

  // Stage 9: Output
  state.stage = 'output_generation';
  const packet: InvoiceProcessingPacket = {
    id: `ipp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    invoice_id: state.invoice!.id,
    matter_id: input.matter_id,
    classification: state.classification ?? {
      ledger_classification: { account_code: 'UNCLASSIFIED', account_name: 'Unclassified' },
      accounting_period: 'UNKNOWN',
      fiscal_year: 'UNKNOWN',
      suggested_account_code: 'UNCLASSIFIED',
      confidence: 0,
    },
    tax_assessment: state.tax_assessment ?? {
      tax_summary: { subtotal: 0, total_tax: 0, tax_breakdowns: [], total: 0, currency: 'USD' },
      tax_implications: [],
      withholding_required: false,
      tax_jurisdiction: 'UNKNOWN',
    },
    vendor_validation: state.vendor_validation ?? {
      vendor_entity_id: state.invoice!.vendor_entity_id,
      vendor_status: 'unknown',
      vendor_standing: 'unknown',
      payment_terms_match: false,
      commercial_notes: ['Vendor validation was not completed.'],
    },
    contractual_check: state.contractual_check,
    generated_ledger_entries: state.generated_ledger_entries,
    constraint_evaluations: state.constraint_evaluations,
    kernel_receipts: state.kernel_receipts,
    warnings: state.warnings,
    approval_required: needsApproval,
    approval_reason: needsApproval
      ? [
          hasViolation ? 'Constraint violation detected' : '',
          state.warnings.length > 0 ? `${state.warnings.length} warning(s)` : '',
          state.errors.length > 0 ? 'Processing errors occurred' : '',
        ].filter(Boolean).join('; ')
      : undefined,
    review_status: needsApproval ? 'requires_approval' : (input.auto_classify ? 'auto_approved' : 'pending_review'),
    generated_at: new Date().toISOString(),
    generated_by: 'invoice_processing_workflow',
  };

  state.stage = 'completed';
  state.completed_at = new Date().toISOString();

  return packet;
}

// ── Dependency injection interface ───────────────────────────

export interface InvoiceProcessingDependencies {
  retrieveInvoice(input: InvoiceProcessingInput): Promise<Invoice>;
  accountingKernelClassify(invoice: Invoice): Promise<ClassificationResult>;
  accountingKernelTaxAssess(invoice: Invoice): Promise<TaxAssessmentResult>;
  businessKernelValidateVendor(invoice: Invoice): Promise<VendorValidationResult>;
  lawKernelContractCheck(invoice: Invoice): Promise<ContractualCheckResult>;
  generateLedgerEntries(
    invoice: Invoice,
    classification: ClassificationResult,
    tax: TaxAssessmentResult | null,
  ): Promise<GeneratedLedgerEntry[]>;
  evaluateConstraints(state: InvoiceProcessingState): Promise<ConstraintEvaluation[]>;
}

// ── Error types ──────────────────────────────────────────────

export class InvoiceProcessingError extends Error {
  public readonly errors: InvoiceWorkflowError[];

  constructor(errors: InvoiceWorkflowError[]) {
    super(`Invoice processing failed: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'InvoiceProcessingError';
    this.errors = errors;
  }
}
