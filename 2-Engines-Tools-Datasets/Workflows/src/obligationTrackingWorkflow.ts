// ──────────────────────────────────────────────────────────────
//  Workflow: Obligation Tracking
//
//  Tracks obligations through their lifecycle — from extraction
//  to fulfillment or breach — generating deadline signals and
//  routing reminders.
//
//  Flow:
//    1. Receive obligation(s) for tracking
//    2. Validate and enrich obligation data
//    3. Generate or update deadline records
//    4. Evaluate compliance status
//    5. Generate deadline signals for approaching due dates
//    6. Route reminders to appropriate surfaces
//    7. Output updated obligation status and deadline signals
// ──────────────────────────────────────────────────────────────

import type {
  Obligation,
  ObligationStatus,
  ComplianceStatus,
  Deadline,
  DeadlineStatus,
  KernelReceipt,
  ConstraintEvaluation,
  KernelDomain,
  Priority,
} from '@10-bla/domain-objects';

// ── Workflow-specific types ──────────────────────────────────

export interface ObligationTrackingInput {
  obligation_ids?: string[];
  obligation_data?: Partial<Obligation>[];
  tracking_mode: 'initial_setup' | 'periodic_check' | 'status_update' | 'escalation';
  requested_by: string;
  as_of_date?: string;
}

export interface DeadlineSignal {
  id: string;
  deadline_id: string;
  obligation_id: string;
  signal_type: 'approaching' | 'imminent' | 'due_today' | 'overdue' | 'escalation';
  days_until_due: number;
  deadline_date: string;
  obligation_title: string;
  consequence_of_miss: string;
  priority: Priority;
  target_surfaces: string[];
  generated_at: string;
}

export interface ComplianceEvaluation {
  obligation_id: string;
  previous_status: ComplianceStatus;
  current_status: ComplianceStatus;
  status_changed: boolean;
  reason: string;
  evidence_ids: string[];
  evaluated_at: string;
}

export interface ReminderRouting {
  obligation_id: string;
  deadline_id: string;
  channel: 'dashboard' | 'email' | 'sms' | 'push' | 'signal';
  recipient: string;
  message: string;
  scheduled_at: string;
  sent: boolean;
}

export interface ObligationTrackingPacket {
  id: string;
  tracked_obligations: TrackedObligationSummary[];
  deadline_signals: DeadlineSignal[];
  compliance_evaluations: ComplianceEvaluation[];
  reminders_routed: ReminderRouting[];
  constraint_evaluations: ConstraintEvaluation[];
  kernel_receipts: KernelReceipt[];
  warnings: string[];
  generated_at: string;
  generated_by: string;
}

export interface TrackedObligationSummary {
  obligation_id: string;
  title: string;
  obligation_status: ObligationStatus;
  compliance_status: ComplianceStatus;
  due_date?: string;
  days_until_due?: number;
  deadlines_count: number;
  active_signals_count: number;
  financial_impact_amount?: number;
}

// ── Workflow stages ──────────────────────────────────────────

export type ObligationTrackingStage =
  | 'input_validation'
  | 'obligation_retrieval'
  | 'deadline_generation'
  | 'compliance_evaluation'
  | 'signal_generation'
  | 'reminder_routing'
  | 'constraint_evaluation'
  | 'output_generation'
  | 'completed'
  | 'failed';

export interface ObligationTrackingState {
  stage: ObligationTrackingStage;
  input: ObligationTrackingInput;
  obligations: Obligation[];
  deadlines: Map<string, Deadline[]>;
  compliance_evaluations: ComplianceEvaluation[];
  signals: DeadlineSignal[];
  reminders: ReminderRouting[];
  constraint_evaluations: ConstraintEvaluation[];
  kernel_receipts: KernelReceipt[];
  warnings: string[];
  errors: ObligationTrackingError[];
  started_at: string;
  completed_at?: string;
}

export interface ObligationTrackingError {
  stage: ObligationTrackingStage;
  code: string;
  message: string;
  recoverable: boolean;
  timestamp: string;
}

// ── Workflow execution ───────────────────────────────────────

export async function executeObligationTracking(
  input: ObligationTrackingInput,
  dependencies: ObligationTrackingDependencies,
): Promise<ObligationTrackingPacket> {
  const state: ObligationTrackingState = {
    stage: 'input_validation',
    input,
    obligations: [],
    deadlines: new Map(),
    compliance_evaluations: [],
    signals: [],
    reminders: [],
    constraint_evaluations: [],
    kernel_receipts: [],
    warnings: [],
    errors: [],
    started_at: new Date().toISOString(),
  };

  const asOfDate = input.as_of_date ? new Date(input.as_of_date) : new Date();

  // Stage 1: Validate
  if (!input.obligation_ids?.length && !input.obligation_data?.length) {
    throw new ObligationTrackingWorkflowError([{
      stage: 'input_validation',
      code: 'NO_OBLIGATIONS',
      message: 'At least one obligation_id or obligation_data entry is required.',
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  // Stage 2: Retrieve obligations
  state.stage = 'obligation_retrieval';
  try {
    state.obligations = await dependencies.retrieveObligations(input);
  } catch (err) {
    throw new ObligationTrackingWorkflowError([{
      stage: 'obligation_retrieval',
      code: 'RETRIEVAL_FAILED',
      message: err instanceof Error ? err.message : String(err),
      recoverable: false,
      timestamp: new Date().toISOString(),
    }]);
  }

  if (state.obligations.length === 0) {
    state.warnings.push('No obligations found matching the provided criteria.');
  }

  // Stage 3: Generate/update deadlines
  state.stage = 'deadline_generation';
  for (const obligation of state.obligations) {
    if (!obligation.due_date && !obligation.recurring) {
      state.warnings.push(`Obligation ${obligation.id} has no due date and is not recurring — no deadline generated.`);
      continue;
    }

    try {
      const deadlines = await dependencies.generateDeadlines(obligation);
      state.deadlines.set(obligation.id, deadlines);

      state.kernel_receipts.push({
        receipt_id: `rcpt_deadline_${obligation.id}_${Date.now()}`,
        kernel: obligation.assigned_kernel,
        operation: 'deadline_generation',
        timestamp: new Date().toISOString(),
        status: 'success',
      });
    } catch (err) {
      state.warnings.push(`Failed to generate deadlines for obligation ${obligation.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Stage 4: Evaluate compliance
  state.stage = 'compliance_evaluation';
  for (const obligation of state.obligations) {
    try {
      const evaluation = await dependencies.evaluateCompliance(obligation, asOfDate);
      state.compliance_evaluations.push(evaluation);

      // Update obligation if status changed
      if (evaluation.status_changed) {
        await dependencies.updateObligationStatus(obligation.id, evaluation.current_status);
      }
    } catch (err) {
      state.warnings.push(`Failed to evaluate compliance for obligation ${obligation.id}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Stage 5: Generate deadline signals
  state.stage = 'signal_generation';
  for (const obligation of state.obligations) {
    const deadlines = state.deadlines.get(obligation.id) ?? [];

    for (const deadline of deadlines) {
      const dueDate = new Date(deadline.due_date);
      const daysUntil = Math.ceil((dueDate.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));

      const signalType = determineSignalType(daysUntil, deadline.status);
      if (!signalType) continue;

      const signal: DeadlineSignal = {
        id: `sig_${deadline.id}_${Date.now()}`,
        deadline_id: deadline.id,
        obligation_id: obligation.id,
        signal_type: signalType,
        days_until_due: daysUntil,
        deadline_date: deadline.due_date,
        obligation_title: obligation.title,
        consequence_of_miss: deadline.consequence_of_miss,
        priority: deadline.priority,
        target_surfaces: determineSurfaces(signalType, deadline.priority),
        generated_at: new Date().toISOString(),
      };

      state.signals.push(signal);
    }
  }

  // Stage 6: Route reminders
  state.stage = 'reminder_routing';
  for (const signal of state.signals) {
    for (const surface of signal.target_surfaces) {
      const reminder: ReminderRouting = {
        obligation_id: signal.obligation_id,
        deadline_id: signal.deadline_id,
        channel: surface as ReminderRouting['channel'],
        recipient: input.requested_by,
        message: formatReminderMessage(signal),
        scheduled_at: new Date().toISOString(),
        sent: false,
      };

      state.reminders.push(reminder);
    }
  }

  await dependencies.routeReminders(state.reminders);

  // Stage 7: Constraint evaluation
  state.stage = 'constraint_evaluation';
  state.constraint_evaluations = await dependencies.evaluateConstraints(state.obligations);

  // Stage 8: Output
  state.stage = 'output_generation';
  const summaries: TrackedObligationSummary[] = state.obligations.map(obl => {
    const deadlines = state.deadlines.get(obl.id) ?? [];
    const signals = state.signals.filter(s => s.obligation_id === obl.id);
    const compliance = state.compliance_evaluations.find(c => c.obligation_id === obl.id);
    const dueDate = obl.due_date ? new Date(obl.due_date) : null;
    const daysUntil = dueDate ? Math.ceil((dueDate.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

    return {
      obligation_id: obl.id,
      title: obl.title,
      obligation_status: obl.obligation_status,
      compliance_status: compliance?.current_status ?? obl.compliance_status,
      due_date: obl.due_date,
      days_until_due: daysUntil,
      deadlines_count: deadlines.length,
      active_signals_count: signals.length,
      financial_impact_amount: obl.financial_impact?.amount,
    };
  });

  const packet: ObligationTrackingPacket = {
    id: `otp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    tracked_obligations: summaries,
    deadline_signals: state.signals,
    compliance_evaluations: state.compliance_evaluations,
    reminders_routed: state.reminders,
    constraint_evaluations: state.constraint_evaluations,
    kernel_receipts: state.kernel_receipts,
    warnings: state.warnings,
    generated_at: new Date().toISOString(),
    generated_by: 'obligation_tracking_workflow',
  };

  state.stage = 'completed';
  state.completed_at = new Date().toISOString();

  return packet;
}

// ── Helper functions ─────────────────────────────────────────

function determineSignalType(daysUntil: number, status: DeadlineStatus): DeadlineSignal['signal_type'] | null {
  if (status === 'completed' || status === 'waived' || status === 'cancelled') return null;
  if (daysUntil < 0) return 'overdue';
  if (daysUntil === 0) return 'due_today';
  if (daysUntil <= 3) return 'imminent';
  if (daysUntil <= 14) return 'approaching';
  return null;
}

function determineSurfaces(signalType: DeadlineSignal['signal_type'], priority: Priority): string[] {
  const surfaces: string[] = ['dashboard'];

  if (signalType === 'overdue' || signalType === 'due_today') {
    surfaces.push('email', 'push');
  }
  if (signalType === 'imminent') {
    surfaces.push('email');
  }
  if (priority === 'critical') {
    if (!surfaces.includes('push')) surfaces.push('push');
    if (!surfaces.includes('sms')) surfaces.push('sms');
  }

  return surfaces;
}

function formatReminderMessage(signal: DeadlineSignal): string {
  switch (signal.signal_type) {
    case 'overdue':
      return `OVERDUE: "${signal.obligation_title}" was due ${Math.abs(signal.days_until_due)} day(s) ago. ${signal.consequence_of_miss}`;
    case 'due_today':
      return `DUE TODAY: "${signal.obligation_title}" is due today. ${signal.consequence_of_miss}`;
    case 'imminent':
      return `IMMINENT: "${signal.obligation_title}" is due in ${signal.days_until_due} day(s).`;
    case 'approaching':
      return `APPROACHING: "${signal.obligation_title}" is due in ${signal.days_until_due} day(s).`;
    case 'escalation':
      return `ESCALATION: "${signal.obligation_title}" requires immediate attention. ${signal.consequence_of_miss}`;
  }
}

// ── Dependency injection interface ───────────────────────────

export interface ObligationTrackingDependencies {
  retrieveObligations(input: ObligationTrackingInput): Promise<Obligation[]>;
  generateDeadlines(obligation: Obligation): Promise<Deadline[]>;
  evaluateCompliance(obligation: Obligation, asOfDate: Date): Promise<ComplianceEvaluation>;
  updateObligationStatus(obligationId: string, status: ComplianceStatus): Promise<void>;
  routeReminders(reminders: ReminderRouting[]): Promise<void>;
  evaluateConstraints(obligations: Obligation[]): Promise<ConstraintEvaluation[]>;
}

// ── Error types ──────────────────────────────────────────────

export class ObligationTrackingWorkflowError extends Error {
  public readonly errors: ObligationTrackingError[];

  constructor(errors: ObligationTrackingError[]) {
    super(`Obligation tracking failed: ${errors.map(e => e.message).join('; ')}`);
    this.name = 'ObligationTrackingWorkflowError';
    this.errors = errors;
  }
}
