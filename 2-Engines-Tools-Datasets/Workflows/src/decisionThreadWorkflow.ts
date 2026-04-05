// ──────────────────────────────────────────────────────────────
//  Workflow: Decision Thread
//
//  Assembles a CommercialDecisionBundle by collecting assessments
//  from all relevant kernels for a matter requiring cross-domain
//  decision-making.
//
//  Flow:
//    1. Validate matter reference
//    2. Collect Business Kernel assessment
//    3. Collect Law Kernel assessment
//    4. Collect Accounting Kernel assessment
//    5. Assemble CommercialDecisionBundle
//    6. Evaluate cross-domain constraints
//    7. Present for practitioner review
//    8. Output CommercialDecisionBundle with provenance
// ──────────────────────────────────────────────────────────────

import type {
  Matter,
  CommercialDecisionBundle,
  BusinessAssessment,
  LegalAssessment,
  AccountingAssessment,
  Risk,
  UnresolvedConstraint,
  ConstraintEvaluation,
  FollowUpAction,
  KernelReceipt,
  AdvisoryReceipt,
  KernelDomain,
  Priority,
  DecisionBundleStatus,
} from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export interface DecisionThreadInput {
  matter_id: string;
  requested_kernels?: KernelDomain[];
  priority: Priority;
  context_notes?: string;
  supersedes_bundle_id?: string;
  requested_by: string;
}

export interface DecisionThreadPacket {
  id: string;
  bundle: CommercialDecisionBundle;
  cross_domain_constraints: ConstraintEvaluation[];
  conflicting_assessments: ConflictingAssessment[];
  practitioner_review_required: boolean;
  review_reasons: string[];
  kernel_receipts: KernelReceipt[];
  generated_at: string;
  generated_by: string;
}

export interface ConflictingAssessment {
  kernel_a: KernelDomain;
  kernel_b: KernelDomain;
  area: string;
  summary_a: string;
  summary_b: string;
  conflict_severity: 'blocking' | 'significant' | 'minor';
  suggested_resolution: string;
}

// ── Workflow stages ──────────────────────────────────────────

export type DecisionThreadStage =
  | 'input_validation'
  | 'matter_retrieval'
  | 'business_assessment'
  | 'legal_assessment'
  | 'accounting_assessment'
  | 'conflict_detection'
  | 'bundle_assembly'
  | 'constraint_evaluation'
  | 'review_routing'
  | 'completed'
  | 'failed';

export interface DecisionThreadState {
  stage: DecisionThreadStage;
  input: DecisionThreadInput;
  matter: Matter | null;
  business_assessment: BusinessAssessment | null;
  legal_assessment: LegalAssessment | null;
  accounting_assessment: AccountingAssessment | null;
  conflicts: ConflictingAssessment[];
  cross_domain_constraints: ConstraintEvaluation[];
  kernel_receipts: KernelReceipt[];
  advisory_receipts: AdvisoryReceipt[];
  errors: DecisionThreadError[];
  started_at: string;
  completed_at?: string;
}

export interface DecisionThreadError {
  stage: DecisionThreadStage;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
}

// ── Workflow execution ───────────────────────────────────────

function addReceipt(
  state: DecisionThreadState,
  kernel: KernelDomain,
  operation: string,
  status: 'success' | 'failure' | 'partial',
): DecisionThreadState {
  return {
    ...state,
    kernel_receipts: [
      ...state.kernel_receipts,
      {
        receipt_id: `rcpt_${kernel}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        kernel,
        operation,
        timestamp: new Date().toISOString(),
        status,
      },
    ],
  };
}

export async function executeDecisionThread(
  input: DecisionThreadInput,
  dependencies: DecisionThreadDependencies,
): Promise<DecisionThreadPacket> {
  let state: DecisionThreadState = {
    stage: 'input_validation',
    input,
    matter: null,
    business_assessment: null,
    legal_assessment: null,
    accounting_assessment: null,
    conflicts: [],
    cross_domain_constraints: [],
    kernel_receipts: [],
    advisory_receipts: [],
    errors: [],
    started_at: new Date().toISOString(),
  };

  // Stage 1: Validate
  if (!input.matter_id) {
    throw new DecisionThreadWorkflowError([{
      stage: 'input_validation',
      code: 'MISSING_MATTER_ID',
      message: 'A matter_id is required to initiate a decision thread.',
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Stage 2: Retrieve matter
  state.stage = 'matter_retrieval';
  try {
    state.matter = await dependencies.retrieveMatter(input.matter_id);
  } catch (err) {
    throw new DecisionThreadWorkflowError([{
      stage: 'matter_retrieval',
      code: 'MATTER_NOT_FOUND',
      message: err instanceof Error ? err.message : String(err),
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  const requestedKernels = input.requested_kernels ?? state.matter!.assigned_kernels;
  const allKernels = new Set<KernelDomain>(requestedKernels);

  // For cross-domain decisions, always include all kernels
  if (state.matter!.matter_type === 'cross-domain') {
    allKernels.add('business');
    allKernels.add('law');
    allKernels.add('accounting');
  }

  // Stage 3: Collect Business assessment
  if (allKernels.has('business')) {
    state.stage = 'business_assessment';
    try {
      state.business_assessment = await dependencies.collectBusinessAssessment(state.matter!);
      state = addReceipt(state, 'business', 'decision_assessment', 'success');
    } catch (err) {
      state = addReceipt(state, 'business', 'decision_assessment', 'failure');
      state.errors.push({
        stage: 'business_assessment',
        code: 'BUSINESS_ASSESSMENT_FAILED',
        message: err instanceof Error ? err.message : String(err),
        recoverable: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Stage 4: Collect Legal assessment
  if (allKernels.has('law')) {
    state.stage = 'legal_assessment';
    try {
      state.legal_assessment = await dependencies.collectLegalAssessment(state.matter!);
      state = addReceipt(state, 'law', 'decision_assessment', 'success');
    } catch (err) {
      state = addReceipt(state, 'law', 'decision_assessment', 'failure');
      state.errors.push({
        stage: 'legal_assessment',
        code: 'LEGAL_ASSESSMENT_FAILED',
        message: err instanceof Error ? err.message : String(err),
        recoverable: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Stage 5: Collect Accounting assessment
  if (allKernels.has('accounting')) {
    state.stage = 'accounting_assessment';
    try {
      state.accounting_assessment = await dependencies.collectAccountingAssessment(state.matter!);
      state = addReceipt(state, 'accounting', 'decision_assessment', 'success');
    } catch (err) {
      state = addReceipt(state, 'accounting', 'decision_assessment', 'failure');
      state.errors.push({
        stage: 'accounting_assessment',
        code: 'ACCOUNTING_ASSESSMENT_FAILED',
        message: err instanceof Error ? err.message : String(err),
        recoverable: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Stage 6: Detect conflicts between kernel assessments
  state.stage = 'conflict_detection';
  state.conflicts = detectConflicts(state);

  // Stage 7: Assemble CommercialDecisionBundle
  state.stage = 'bundle_assembly';
  const allRisks = collectAllRisks(state);
  const followUpActions = deriveFollowUpActions(state);
  const combinedRecommendation = assembleCombinedRecommendation(state);

  // Stage 8: Evaluate cross-domain constraints
  state.stage = 'constraint_evaluation';
  state.cross_domain_constraints = await dependencies.evaluateCrossDomainConstraints(state);

  const unresolvedConstraints: UnresolvedConstraint[] = state.cross_domain_constraints
    .filter(c => c.result === 'violated' || c.result === 'partially_satisfied')
    .map(c => ({
      constraint_id: c.constraint_id,
      constraint_name: c.constraint_name,
      reason: c.details,
      blocking: c.result === 'violated',
      suggested_resolution: `Review ${c.constraint_name} with practitioner to determine resolution path.`,
    }));

  const bundle: CommercialDecisionBundle = {
    id: `cdb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    matter_id: input.matter_id,
    business_assessment: state.business_assessment,
    legal_assessment: state.legal_assessment,
    accounting_assessment: state.accounting_assessment,
    combined_recommendation: combinedRecommendation,
    open_risks: allRisks,
    unresolved_constraints: unresolvedConstraints,
    follow_up_actions: followUpActions,
    source_kernel_receipts: state.kernel_receipts,
    advisory_support_receipts: state.advisory_receipts,
    generated_at: new Date().toISOString(),
    generated_by_surface: 'decision_thread_workflow',
    status: 'draft',
    version: input.supersedes_bundle_id ? 2 : 1,
    supersedes_bundle_id: input.supersedes_bundle_id,
  };

  // Stage 9: Route for review
  state.stage = 'review_routing';
  const reviewReasons: string[] = [];

  if (state.conflicts.length > 0) {
    reviewReasons.push(`${state.conflicts.length} conflicting assessment(s) between kernels`);
  }
  if (unresolvedConstraints.some(c => c.blocking)) {
    reviewReasons.push('Blocking constraint violation(s) detected');
  }
  if (state.errors.length > 0) {
    reviewReasons.push(`${state.errors.length} kernel assessment(s) failed — incomplete bundle`);
  }
  // Always require review for decision bundles
  if (reviewReasons.length === 0) {
    reviewReasons.push('All decision bundles require practitioner review by governance policy');
  }

  await dependencies.persistBundle(bundle);
  await dependencies.routeForPractitionerReview(bundle.id, reviewReasons);

  // Output
  const packet: DecisionThreadPacket = {
    id: `dtp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    bundle,
    cross_domain_constraints: state.cross_domain_constraints,
    conflicting_assessments: state.conflicts,
    practitioner_review_required: true,
    review_reasons: reviewReasons,
    kernel_receipts: state.kernel_receipts,
    generated_at: new Date().toISOString(),
    generated_by: 'decision_thread_workflow',
  };

  state.stage = 'completed';
  state.completed_at = new Date().toISOString();

  return packet;
}

// ── Helper functions ─────────────────────────────────────────

function detectConflicts(state: DecisionThreadState): ConflictingAssessment[] {
  const conflicts: ConflictingAssessment[] = [];

  // Check business vs legal alignment
  if (state.business_assessment && state.legal_assessment) {
    if (
      state.business_assessment.strategic_alignment === 'aligned' &&
      state.legal_assessment.compliance_status === 'non_compliant'
    ) {
      conflicts.push({
        kernel_a: 'business',
        kernel_b: 'law',
        area: 'Strategic alignment vs. compliance',
        summary_a: 'Business assessment supports proceeding (strategic alignment).',
        summary_b: 'Legal assessment flags non-compliance risks.',
        conflict_severity: 'blocking',
        suggested_resolution: 'Resolve compliance issues before proceeding with business strategy.',
      });
    }
  }

  // Check business vs accounting impact levels
  if (state.business_assessment && state.accounting_assessment) {
    if (
      state.business_assessment.impact_level === 'low' &&
      state.accounting_assessment.impact_level === 'high'
    ) {
      conflicts.push({
        kernel_a: 'business',
        kernel_b: 'accounting',
        area: 'Impact assessment divergence',
        summary_a: 'Business assesses low commercial impact.',
        summary_b: 'Accounting assesses high financial impact.',
        conflict_severity: 'significant',
        suggested_resolution: 'Reconcile differing impact assessments — financial exposure may be underestimated commercially.',
      });
    }
  }

  return conflicts;
}

function collectAllRisks(state: DecisionThreadState): Risk[] {
  const risks: Risk[] = [];
  if (state.business_assessment) risks.push(...state.business_assessment.risks);
  if (state.legal_assessment) risks.push(...state.legal_assessment.risks);
  if (state.accounting_assessment) risks.push(...state.accounting_assessment.risks);
  return risks;
}

function deriveFollowUpActions(state: DecisionThreadState): FollowUpAction[] {
  const actions: FollowUpAction[] = [];

  const addAction = (title: string, desc: string, kernel: KernelDomain, priority: Priority) => {
    actions.push({
      id: `fua_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      description: desc,
      assigned_kernel: kernel,
      status: 'pending',
      priority,
    });
  };

  for (const conflict of state.conflicts) {
    addAction(
      `Resolve conflict: ${conflict.area}`,
      conflict.suggested_resolution,
      conflict.kernel_a,
      conflict.conflict_severity === 'blocking' ? 'critical' : 'high',
    );
  }

  if (state.business_assessment) {
    for (const rec of state.business_assessment.recommendations) {
      addAction(`Business: ${rec}`, rec, 'business', 'medium');
    }
  }
  if (state.legal_assessment) {
    for (const rec of state.legal_assessment.recommendations) {
      addAction(`Legal: ${rec}`, rec, 'law', 'medium');
    }
  }
  if (state.accounting_assessment) {
    for (const rec of state.accounting_assessment.recommendations) {
      addAction(`Accounting: ${rec}`, rec, 'accounting', 'medium');
    }
  }

  return actions;
}

function assembleCombinedRecommendation(state: DecisionThreadState): string {
  const parts: string[] = [];

  if (state.conflicts.some(c => c.conflict_severity === 'blocking')) {
    parts.push('BLOCKING CONFLICTS EXIST — cannot proceed without resolution.');
  }

  if (state.business_assessment) {
    parts.push(`Business (${state.business_assessment.impact_level} impact): ${state.business_assessment.summary}`);
  }
  if (state.legal_assessment) {
    parts.push(`Legal (${state.legal_assessment.impact_level} impact, ${state.legal_assessment.compliance_status}): ${state.legal_assessment.summary}`);
  }
  if (state.accounting_assessment) {
    parts.push(`Accounting (${state.accounting_assessment.impact_level} impact): ${state.accounting_assessment.summary}`);
  }

  if (state.errors.length > 0) {
    const missed = state.errors.map(e => e.stage).join(', ');
    parts.push(`WARNING: Incomplete assessment — failed stages: ${missed}.`);
  }

  return parts.join(' | ');
}

// ── Dependency injection interface ───────────────────────────

export interface DecisionThreadDependencies {
  retrieveMatter(matterId: string): Promise<Matter>;
  collectBusinessAssessment(matter: Matter): Promise<BusinessAssessment>;
  collectLegalAssessment(matter: Matter): Promise<LegalAssessment>;
  collectAccountingAssessment(matter: Matter): Promise<AccountingAssessment>;
  evaluateCrossDomainConstraints(state: DecisionThreadState): Promise<ConstraintEvaluation[]>;
  persistBundle(bundle: CommercialDecisionBundle): Promise<void>;
  routeForPractitionerReview(bundleId: string, reasons: string[]): Promise<void>;
}

// ── Error types ──────────────────────────────────────────────

export class DecisionThreadWorkflowError extends Error {
  public readonly errors: DecisionThreadError[];

  constructor(errors: DecisionThreadError[]) {
    super(`Decision thread failed: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'DecisionThreadWorkflowError';
    this.errors = errors;
  }
}
