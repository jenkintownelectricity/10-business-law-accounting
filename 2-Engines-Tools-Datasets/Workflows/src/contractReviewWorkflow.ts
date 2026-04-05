// ──────────────────────────────────────────────────────────────
//  Workflow: Contract Review
//
//  Routes a contract through all three kernels to produce a
//  comprehensive review packet with obligations, risks,
//  financial impact, and recommendations.
//
//  Flow:
//    1. Validate input contract reference
//    2. Law Kernel  — obligation extraction, risk assessment, compliance
//    3. Accounting Kernel — financial impact, tax, period classification
//    4. Business Kernel — commercial impact, strategic alignment
//    5. Commercial Orchestrator — assemble decision bundle
//    6. Output ContractReviewPacket for practitioner review
// ──────────────────────────────────────────────────────────────

import type {
  Contract,
  ContractRiskAssessment,
  ContractTerm,
  Obligation,
  AccountingEvent,
  CommercialDecisionBundle,
  BusinessAssessment,
  LegalAssessment,
  AccountingAssessment,
  Risk,
  ConstraintEvaluation,
  FollowUpAction,
  KernelReceipt,
  Priority,
} from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export interface ContractReviewInput {
  contract_id?: string;
  contract_data?: Partial<Contract>;
  document_path?: string;
  document_hash?: string;
  requested_by: string;
  priority: Priority;
  matter_id?: string;
  review_scope: ('obligations' | 'risks' | 'financial' | 'compliance' | 'full')[];
}

export interface ExtractedObligationSummary {
  obligation_id: string;
  title: string;
  obligation_type: string;
  obligor: string;
  obligee: string;
  due_date?: string;
  financial_impact_amount?: number;
  source_clause: string;
}

export interface FinancialImpactSummary {
  total_contract_value: number;
  currency: string;
  annual_cost: number;
  contingent_liabilities: number;
  tax_exposure: number;
  cash_flow_impact: string;
  accounting_treatment: string;
}

export interface ComplianceCheckResult {
  area: string;
  status: 'compliant' | 'at_risk' | 'non_compliant' | 'requires_review';
  details: string;
  regulatory_reference?: string;
  remediation?: string;
}

export interface ContractReviewPacket {
  id: string;
  contract_id: string;
  matter_id?: string;
  extracted_obligations: ExtractedObligationSummary[];
  risk_assessments: ContractRiskAssessment[];
  financial_impact: FinancialImpactSummary;
  compliance_checks: ComplianceCheckResult[];
  business_assessment: BusinessAssessment | null;
  legal_assessment: LegalAssessment | null;
  accounting_assessment: AccountingAssessment | null;
  combined_recommendation: string;
  follow_up_actions: FollowUpAction[];
  constraint_evaluations: ConstraintEvaluation[];
  kernel_receipts: KernelReceipt[];
  review_status: 'pending_review' | 'under_review' | 'approved' | 'rejected';
  generated_at: string;
  generated_by: string;
}

// ── Workflow stages ──────────────────────────────────────────

export type ContractReviewStage =
  | 'input_validation'
  | 'contract_retrieval'
  | 'law_kernel_review'
  | 'accounting_kernel_review'
  | 'business_kernel_review'
  | 'orchestrator_assembly'
  | 'constraint_evaluation'
  | 'output_generation'
  | 'completed'
  | 'failed';

export interface ContractReviewState {
  stage: ContractReviewStage;
  input: ContractReviewInput;
  contract: Contract | null;
  extracted_obligations: ExtractedObligationSummary[];
  risk_assessments: ContractRiskAssessment[];
  financial_impact: FinancialImpactSummary | null;
  compliance_checks: ComplianceCheckResult[];
  legal_assessment: LegalAssessment | null;
  accounting_assessment: AccountingAssessment | null;
  business_assessment: BusinessAssessment | null;
  constraint_evaluations: ConstraintEvaluation[];
  kernel_receipts: KernelReceipt[];
  errors: WorkflowError[];
  started_at: string;
  completed_at?: string;
}

export interface WorkflowError {
  stage: ContractReviewStage;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
}

// ── Workflow execution ───────────────────────────────────────

function createInitialState(input: ContractReviewInput): ContractReviewState {
  return {
    stage: 'input_validation',
    input,
    contract: null,
    extracted_obligations: [],
    risk_assessments: [],
    financial_impact: null,
    compliance_checks: [],
    legal_assessment: null,
    accounting_assessment: null,
    business_assessment: null,
    constraint_evaluations: [],
    kernel_receipts: [],
    errors: [],
    started_at: new Date().toISOString(),
  };
}

function validateInput(state: ContractReviewState): ContractReviewState {
  const { input } = state;

  if (!input.contract_id && !input.contract_data && !input.document_path) {
    return {
      ...state,
      stage: 'failed',
      errors: [
        ...state.errors,
        {
          stage: 'input_validation',
          code: 'MISSING_CONTRACT_REFERENCE',
          message: 'At least one of contract_id, contract_data, or document_path must be provided.',
          recoverable: false,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  if (input.review_scope.length === 0) {
    return {
      ...state,
      stage: 'failed',
      errors: [
        ...state.errors,
        {
          stage: 'input_validation',
          code: 'EMPTY_REVIEW_SCOPE',
          message: 'Review scope must include at least one area.',
          recoverable: false,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  return { ...state, stage: 'contract_retrieval' };
}

function addKernelReceipt(
  state: ContractReviewState,
  kernel: 'business' | 'law' | 'accounting',
  operation: string,
  status: 'success' | 'failure' | 'partial',
): ContractReviewState {
  const receipt: KernelReceipt = {
    receipt_id: `rcpt_${kernel}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    kernel,
    operation,
    timestamp: new Date().toISOString(),
    status,
  };
  return { ...state, kernel_receipts: [...state.kernel_receipts, receipt] };
}

/**
 * Execute the full contract review workflow.
 *
 * In a production system each kernel call would be an async operation
 * against the respective kernel service. Here we define the typed
 * orchestration skeleton that real kernel implementations plug into.
 */
export async function executeContractReview(
  input: ContractReviewInput,
  dependencies: ContractReviewDependencies,
): Promise<ContractReviewPacket> {
  let state = createInitialState(input);

  // Stage 1: Validate input
  state = validateInput(state);
  if (state.stage === 'failed') {
    throw new ContractReviewError(state.errors);
  }

  // Stage 2: Retrieve or parse contract
  state.stage = 'contract_retrieval';
  try {
    state.contract = await dependencies.retrieveContract(input);
  } catch (err) {
    state.errors.push({
      stage: 'contract_retrieval',
      code: 'CONTRACT_RETRIEVAL_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: false,
      timestamp: new Date().toISOString(),
    });
    throw new ContractReviewError(state.errors);
  }

  const scope = input.review_scope.includes('full')
    ? ['obligations', 'risks', 'financial', 'compliance'] as const
    : input.review_scope;

  // Stage 3: Law Kernel — obligation extraction, risk, compliance
  if (scope.includes('obligations') || scope.includes('risks') || scope.includes('compliance')) {
    state.stage = 'law_kernel_review';
    try {
      const lawResult = await dependencies.lawKernelReview(state.contract!);
      state.extracted_obligations = lawResult.obligations;
      state.risk_assessments = lawResult.risks;
      state.compliance_checks = lawResult.compliance;
      state.legal_assessment = lawResult.assessment;
      state = addKernelReceipt(state, 'law', 'contract_review', 'success');
    } catch (err) {
      state = addKernelReceipt(state, 'law', 'contract_review', 'failure');
      state.errors.push({
        stage: 'law_kernel_review',
        code: 'LAW_KERNEL_FAILED',
        message: err instanceof Error ? err.message : String(err),
        recoverable: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Stage 4: Accounting Kernel — financial impact
  if (scope.includes('financial')) {
    state.stage = 'accounting_kernel_review';
    try {
      const acctResult = await dependencies.accountingKernelReview(state.contract!);
      state.financial_impact = acctResult.financialImpact;
      state.accounting_assessment = acctResult.assessment;
      state = addKernelReceipt(state, 'accounting', 'contract_financial_review', 'success');
    } catch (err) {
      state = addKernelReceipt(state, 'accounting', 'contract_financial_review', 'failure');
      state.errors.push({
        stage: 'accounting_kernel_review',
        code: 'ACCOUNTING_KERNEL_FAILED',
        message: err instanceof Error ? err.message : String(err),
        recoverable: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Stage 5: Business Kernel — commercial impact
  state.stage = 'business_kernel_review';
  try {
    const bizResult = await dependencies.businessKernelReview(state.contract!);
    state.business_assessment = bizResult.assessment;
    state = addKernelReceipt(state, 'business', 'contract_commercial_review', 'success');
  } catch (err) {
    state = addKernelReceipt(state, 'business', 'contract_commercial_review', 'failure');
    state.errors.push({
      stage: 'business_kernel_review',
      code: 'BUSINESS_KERNEL_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: true,
      timestamp: new Date().toISOString(),
    });
  }

  // Stage 6: Constraint evaluation
  state.stage = 'constraint_evaluation';
  state.constraint_evaluations = await dependencies.evaluateConstraints(state);

  const hasViolation = state.constraint_evaluations.some(c => c.result === 'violated');

  // Stage 7: Assemble output
  state.stage = 'output_generation';
  const recommendation = assembleRecommendation(state, hasViolation);

  const packet: ContractReviewPacket = {
    id: `crp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    contract_id: state.contract!.id,
    matter_id: input.matter_id,
    extracted_obligations: state.extracted_obligations,
    risk_assessments: state.risk_assessments,
    financial_impact: state.financial_impact ?? {
      total_contract_value: 0,
      currency: 'USD',
      annual_cost: 0,
      contingent_liabilities: 0,
      tax_exposure: 0,
      cash_flow_impact: 'Not assessed',
      accounting_treatment: 'Not assessed',
    },
    compliance_checks: state.compliance_checks,
    business_assessment: state.business_assessment,
    legal_assessment: state.legal_assessment,
    accounting_assessment: state.accounting_assessment,
    combined_recommendation: recommendation,
    follow_up_actions: deriveFollowUpActions(state),
    constraint_evaluations: state.constraint_evaluations,
    kernel_receipts: state.kernel_receipts,
    review_status: 'pending_review',
    generated_at: new Date().toISOString(),
    generated_by: 'contract_review_workflow',
  };

  state.stage = 'completed';
  state.completed_at = new Date().toISOString();

  return packet;
}

function assembleRecommendation(state: ContractReviewState, hasViolation: boolean): string {
  const parts: string[] = [];

  if (hasViolation) {
    parts.push('CONSTRAINT VIOLATION DETECTED — requires practitioner review before proceeding.');
  }

  if (state.legal_assessment) {
    parts.push(`Legal: ${state.legal_assessment.summary}`);
  }
  if (state.accounting_assessment) {
    parts.push(`Accounting: ${state.accounting_assessment.summary}`);
  }
  if (state.business_assessment) {
    parts.push(`Business: ${state.business_assessment.summary}`);
  }

  if (state.errors.length > 0) {
    const failedKernels = state.errors.map(e => e.stage).join(', ');
    parts.push(`Note: Incomplete assessment due to failures in: ${failedKernels}.`);
  }

  return parts.join(' | ');
}

function deriveFollowUpActions(state: ContractReviewState): FollowUpAction[] {
  const actions: FollowUpAction[] = [];

  for (const violation of state.constraint_evaluations.filter(c => c.result === 'violated')) {
    actions.push({
      id: `fua_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: `Resolve constraint violation: ${violation.constraint_name}`,
      description: violation.details,
      assigned_kernel: 'law',
      status: 'pending',
      priority: 'high',
    });
  }

  for (const obl of state.extracted_obligations.filter(o => o.due_date)) {
    actions.push({
      id: `fua_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: `Track obligation: ${obl.title}`,
      description: `Obligation from clause ${obl.source_clause} due ${obl.due_date}`,
      assigned_kernel: 'law',
      due_date: obl.due_date,
      status: 'pending',
      priority: 'medium',
    });
  }

  return actions;
}

// ── Dependency injection interface ───────────────────────────

export interface LawKernelReviewResult {
  obligations: ExtractedObligationSummary[];
  risks: ContractRiskAssessment[];
  compliance: ComplianceCheckResult[];
  assessment: LegalAssessment;
}

export interface AccountingKernelReviewResult {
  financialImpact: FinancialImpactSummary;
  assessment: AccountingAssessment;
}

export interface BusinessKernelReviewResult {
  assessment: BusinessAssessment;
}

export interface ContractReviewDependencies {
  retrieveContract(input: ContractReviewInput): Promise<Contract>;
  lawKernelReview(contract: Contract): Promise<LawKernelReviewResult>;
  accountingKernelReview(contract: Contract): Promise<AccountingKernelReviewResult>;
  businessKernelReview(contract: Contract): Promise<BusinessKernelReviewResult>;
  evaluateConstraints(state: ContractReviewState): Promise<ConstraintEvaluation[]>;
}

// ── Error types ──────────────────────────────────────────────

export class ContractReviewError extends Error {
  public readonly errors: WorkflowError[];

  constructor(errors: WorkflowError[]) {
    super(`Contract review failed: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'ContractReviewError';
    this.errors = errors;
  }
}
