// ──────────────────────────────────────────────────────────────
//  Workflow: Matter Intake
//
//  Processes new matter creation from manual entry or spoken
//  intake, assigns kernels, evaluates constraints, and routes
//  untrusted sources to review queue.
//
//  Flow:
//    1. Validate intake input
//    2. Determine kernel assignment(s) based on matter type
//    3. Create matter record in INTAKE status
//    4. Evaluate intake constraints
//    5. Route to review queue if from untrusted source
//    6. Output Matter with kernel assignments
// ──────────────────────────────────────────────────────────────

import type {
  Matter,
  MatterType,
  MatterStatus,
  MatterNote,
  KernelDomain,
  Priority,
  TrustLevel,
  FollowUpAction,
  ConstraintEvaluation,
  KernelReceipt,
} from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export type IntakeSource =
  | 'manual_entry'
  | 'spoken_dictation'
  | 'spoken_command'
  | 'listening_session'
  | 'email_intake'
  | 'document_scan'
  | 'api_integration';

export interface MatterIntakeInput {
  title: string;
  description: string;
  matter_type?: MatterType;
  client_id: string;
  counterparty_ids?: string[];
  priority?: Priority;
  related_contracts?: string[];
  initial_notes?: string[];
  tags?: string[];
  intake_source: IntakeSource;
  source_session_id?: string;
  requested_by: string;
  trust_level: TrustLevel;
}

export interface KernelAssignmentResult {
  assigned_kernels: KernelDomain[];
  primary_kernel: KernelDomain;
  assignment_reasoning: string[];
  confidence: number;
}

export interface IntakeConstraintResult {
  evaluations: ConstraintEvaluation[];
  blocked: boolean;
  block_reasons: string[];
  warnings: string[];
}

export interface MatterIntakePacket {
  id: string;
  matter: Matter;
  kernel_assignment: KernelAssignmentResult;
  constraint_result: IntakeConstraintResult;
  routed_to_review: boolean;
  review_reason?: string;
  kernel_receipts: KernelReceipt[];
  generated_at: string;
  generated_by: string;
}

// ── Workflow stages ──────────────────────────────────────────

export type MatterIntakeStage =
  | 'input_validation'
  | 'kernel_assignment'
  | 'matter_creation'
  | 'constraint_evaluation'
  | 'review_routing'
  | 'output_generation'
  | 'completed'
  | 'failed';

export interface MatterIntakeState {
  stage: MatterIntakeStage;
  input: MatterIntakeInput;
  matter: Matter | null;
  kernel_assignment: KernelAssignmentResult | null;
  constraint_result: IntakeConstraintResult | null;
  routed_to_review: boolean;
  kernel_receipts: KernelReceipt[];
  errors: IntakeWorkflowError[];
  started_at: string;
  completed_at?: string;
}

export interface IntakeWorkflowError {
  stage: MatterIntakeStage;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
}

// ── Kernel assignment logic ──────────────────────────────────

function determineKernelAssignment(input: MatterIntakeInput): KernelAssignmentResult {
  const reasoning: string[] = [];
  const kernels: Set<KernelDomain> = new Set();

  const matterType = input.matter_type ?? inferMatterType(input);

  switch (matterType) {
    case 'business':
      kernels.add('business');
      reasoning.push('Business matter type — primary routing to Business Kernel.');
      break;
    case 'legal':
      kernels.add('law');
      reasoning.push('Legal matter type — primary routing to Law Kernel.');
      break;
    case 'accounting':
      kernels.add('accounting');
      reasoning.push('Accounting matter type — primary routing to Accounting Kernel.');
      break;
    case 'cross-domain':
      kernels.add('business');
      kernels.add('law');
      kernels.add('accounting');
      reasoning.push('Cross-domain matter — routing to all kernels.');
      break;
  }

  // Heuristics: if contracts are referenced, add law kernel
  if (input.related_contracts && input.related_contracts.length > 0 && !kernels.has('law')) {
    kernels.add('law');
    reasoning.push('Related contracts detected — adding Law Kernel.');
  }

  // If priority is critical, ensure all kernels are involved
  if (input.priority === 'critical' && kernels.size < 3) {
    kernels.add('business');
    kernels.add('law');
    kernels.add('accounting');
    reasoning.push('Critical priority — escalating to all kernels for comprehensive assessment.');
  }

  const assignedKernels = Array.from(kernels);
  const primaryKernel = assignedKernels[0]!;

  return {
    assigned_kernels: assignedKernels,
    primary_kernel: primaryKernel,
    assignment_reasoning: reasoning,
    confidence: matterType === (input.matter_type ?? matterType) ? 0.9 : 0.6,
  };
}

function inferMatterType(input: MatterIntakeInput): MatterType {
  const text = `${input.title} ${input.description}`.toLowerCase();

  const legalTerms = ['contract', 'lawsuit', 'litigation', 'compliance', 'regulatory', 'court', 'legal', 'obligation', 'statute', 'liability'];
  const accountingTerms = ['invoice', 'tax', 'audit', 'ledger', 'revenue', 'expense', 'depreciation', 'reconciliation', 'financial statement', 'payroll'];
  const businessTerms = ['vendor', 'client', 'deal', 'partnership', 'strategy', 'market', 'acquisition', 'merger', 'project'];

  const legalScore = legalTerms.filter(t => text.includes(t)).length;
  const accountingScore = accountingTerms.filter(t => text.includes(t)).length;
  const businessScore = businessTerms.filter(t => text.includes(t)).length;

  const maxScore = Math.max(legalScore, accountingScore, businessScore);

  if (maxScore === 0) return 'cross-domain';

  const topScorers = [
    legalScore === maxScore ? 'legal' : null,
    accountingScore === maxScore ? 'accounting' : null,
    businessScore === maxScore ? 'business' : null,
  ].filter(Boolean) as MatterType[];

  if (topScorers.length > 1) return 'cross-domain';
  return topScorers[0]!;
}

// ── Workflow execution ───────────────────────────────────────

export async function executeMatterIntake(
  input: MatterIntakeInput,
  dependencies: MatterIntakeDependencies,
): Promise<MatterIntakePacket> {
  const state: MatterIntakeState = {
    stage: 'input_validation',
    input,
    matter: null,
    kernel_assignment: null,
    constraint_result: null,
    routed_to_review: false,
    kernel_receipts: [],
    errors: [],
    started_at: new Date().toISOString(),
  };

  // Stage 1: Validate
  if (!input.title || !input.title.trim()) {
    throw new MatterIntakeError([{
      stage: 'input_validation',
      code: 'MISSING_TITLE',
      message: 'Matter title is required.',
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  if (!input.client_id) {
    throw new MatterIntakeError([{
      stage: 'input_validation',
      code: 'MISSING_CLIENT',
      message: 'Client ID is required for matter intake.',
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Stage 2: Determine kernel assignments
  state.stage = 'kernel_assignment';
  state.kernel_assignment = determineKernelAssignment(input);

  // Stage 3: Create matter record
  state.stage = 'matter_creation';
  const now = new Date().toISOString();
  const matterId = `mat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const initialNotes: MatterNote[] = (input.initial_notes ?? []).map((content, idx) => ({
    id: `mn_${matterId}_${idx}`,
    content,
    note_type: input.intake_source === 'spoken_dictation' ? 'dictated' as const : 'manual' as const,
    source: input.intake_source,
    created_at: now,
    trust_level: input.trust_level,
  }));

  const matter: Matter = {
    id: matterId,
    title: input.title,
    description: input.description,
    matter_type: input.matter_type ?? inferMatterType(input),
    assigned_kernels: state.kernel_assignment.assigned_kernels,
    client_id: input.client_id,
    counterparty_ids: input.counterparty_ids ?? [],
    priority: input.priority ?? 'medium',
    status: 'intake',
    related_contracts: input.related_contracts ?? [],
    related_obligations: [],
    related_accounting_events: [],
    evidence_ids: [],
    receipt_ids: [],
    follow_up_actions: [],
    tags: input.tags ?? [],
    notes: initialNotes,
    created_at: now,
    updated_at: now,
    created_by: input.requested_by,
    source_surface: input.intake_source,
  };

  state.matter = matter;

  // Persist the matter
  try {
    await dependencies.persistMatter(matter);
    state.kernel_receipts.push({
      receipt_id: `rcpt_intake_${Date.now()}`,
      kernel: state.kernel_assignment.primary_kernel,
      operation: 'matter_intake_create',
      timestamp: now,
      status: 'success',
    });
  } catch (err) {
    throw new MatterIntakeError([{
      stage: 'matter_creation',
      code: 'PERSIST_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Stage 4: Evaluate intake constraints
  state.stage = 'constraint_evaluation';
  state.constraint_result = await dependencies.evaluateIntakeConstraints(matter, state.kernel_assignment);

  if (state.constraint_result.blocked) {
    // Update matter status to reflect the block
    state.matter = { ...state.matter, status: 'under_review' as MatterStatus };
    await dependencies.updateMatterStatus(matter.id, 'under_review');
  }

  // Stage 5: Route to review if untrusted
  state.stage = 'review_routing';
  const requiresReview =
    input.trust_level === 'UNTRUSTED'
    || isSpokenSource(input.intake_source)
    || state.constraint_result.blocked
    || state.constraint_result.warnings.length > 0;

  if (requiresReview) {
    state.routed_to_review = true;
    await dependencies.routeToReviewQueue(matter.id, buildReviewReason(input, state));
  }

  // Stage 6: Output
  state.stage = 'output_generation';
  const packet: MatterIntakePacket = {
    id: `mip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    matter: state.matter,
    kernel_assignment: state.kernel_assignment,
    constraint_result: state.constraint_result,
    routed_to_review: state.routed_to_review,
    review_reason: state.routed_to_review ? buildReviewReason(input, state) : undefined,
    kernel_receipts: state.kernel_receipts,
    generated_at: new Date().toISOString(),
    generated_by: 'matter_intake_workflow',
  };

  state.stage = 'completed';
  state.completed_at = new Date().toISOString();

  return packet;
}

function isSpokenSource(source: IntakeSource): boolean {
  return source === 'spoken_dictation' || source === 'spoken_command' || source === 'listening_session';
}

function buildReviewReason(input: MatterIntakeInput, state: MatterIntakeState): string {
  const reasons: string[] = [];
  if (input.trust_level === 'UNTRUSTED') reasons.push('Source is UNTRUSTED');
  if (isSpokenSource(input.intake_source)) reasons.push(`Voice-originated intake (${input.intake_source})`);
  if (state.constraint_result?.blocked) reasons.push(`Constraint blocked: ${state.constraint_result.block_reasons.join(', ')}`);
  if (state.constraint_result && state.constraint_result.warnings.length > 0) reasons.push(`${state.constraint_result.warnings.length} constraint warning(s)`);
  return reasons.join('; ');
}

// ── Dependency injection interface ───────────────────────────

export interface MatterIntakeDependencies {
  persistMatter(matter: Matter): Promise<void>;
  updateMatterStatus(matterId: string, status: MatterStatus): Promise<void>;
  evaluateIntakeConstraints(matter: Matter, assignment: KernelAssignmentResult): Promise<IntakeConstraintResult>;
  routeToReviewQueue(matterId: string, reason: string): Promise<void>;
}

// ── Error types ──────────────────────────────────────────────

export class MatterIntakeError extends Error {
  public readonly errors: IntakeWorkflowError[];

  constructor(errors: IntakeWorkflowError[]) {
    super(`Matter intake failed: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'MatterIntakeError';
    this.errors = errors;
  }
}
