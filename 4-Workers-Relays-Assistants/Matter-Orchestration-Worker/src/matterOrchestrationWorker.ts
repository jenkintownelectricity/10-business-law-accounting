/**
 * Matter-Orchestration-Worker
 *
 * Manages matter lifecycle across kernels. Collects kernel assessments,
 * assembles decision bundles, tracks follow-up actions, manages state
 * transitions.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MatterStatus =
  | 'INTAKE'
  | 'ASSESSMENT'
  | 'REVIEW'
  | 'ACTIVE'
  | 'PENDING_ACTION'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ARCHIVED';

export type KernelName = 'business' | 'law' | 'accounting';

export interface KernelAssessment {
  kernel: KernelName;
  assessment_id: string;
  matter_id: string;
  status: 'pending' | 'complete' | 'error';
  findings: string[];
  risk_level?: 'critical' | 'high' | 'medium' | 'low';
  recommendations: string[];
  constraints_evaluated: { name: string; passed: boolean; message: string }[];
  assessed_at: string;
}

export interface FollowUpAction {
  action_id: string;
  matter_id: string;
  description: string;
  assigned_kernel: KernelName;
  priority: 'critical' | 'high' | 'medium' | 'low';
  deadline?: string;
  status: 'pending' | 'in_progress' | 'complete' | 'overdue';
  created_at: string;
  completed_at?: string;
}

export interface DecisionBundle {
  bundle_id: string;
  matter_id: string;
  assessments: KernelAssessment[];
  follow_up_actions: FollowUpAction[];
  overall_risk_level: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  assembled_at: string;
  receipt_id: string;
}

export interface StateTransition {
  matter_id: string;
  from_status: MatterStatus;
  to_status: MatterStatus;
  reason: string;
  transitioned_by: string;
  timestamp: string;
}

export interface OrchestrationReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: string;
  source_kernel: 'orchestrator';
  entity_type: string;
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

// ---------------------------------------------------------------------------
// Valid transitions
// ---------------------------------------------------------------------------

const VALID_TRANSITIONS: Record<MatterStatus, MatterStatus[]> = {
  INTAKE: ['ASSESSMENT', 'CLOSED'],
  ASSESSMENT: ['REVIEW', 'CLOSED'],
  REVIEW: ['ACTIVE', 'PENDING_ACTION', 'CLOSED'],
  ACTIVE: ['PENDING_ACTION', 'RESOLVED', 'CLOSED'],
  PENDING_ACTION: ['ACTIVE', 'RESOLVED', 'CLOSED'],
  RESOLVED: ['CLOSED', 'ARCHIVED'],
  CLOSED: ['ARCHIVED'],
  ARCHIVED: [],
};

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class MatterOrchestrationWorker {
  private assessments: Map<string, KernelAssessment[]> = new Map();
  private followUpActions: Map<string, FollowUpAction[]> = new Map();
  private stateHistory: Map<string, StateTransition[]> = new Map();
  private currentStates: Map<string, MatterStatus> = new Map();
  private receipts: OrchestrationReceipt[] = [];

  /**
   * Record a kernel assessment for a matter.
   */
  recordAssessment(assessment: KernelAssessment): void {
    const existing = this.assessments.get(assessment.matter_id) ?? [];
    existing.push(assessment);
    this.assessments.set(assessment.matter_id, existing);
  }

  /**
   * Add a follow-up action for a matter.
   */
  addFollowUpAction(matterId: string, action: Omit<FollowUpAction, 'action_id' | 'created_at' | 'status'>): FollowUpAction {
    const fullAction: FollowUpAction = {
      ...action,
      action_id: generateId('ACT'),
      matter_id: matterId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    const existing = this.followUpActions.get(matterId) ?? [];
    existing.push(fullAction);
    this.followUpActions.set(matterId, existing);
    return fullAction;
  }

  /**
   * Complete a follow-up action.
   */
  completeAction(matterId: string, actionId: string): FollowUpAction | undefined {
    const actions = this.followUpActions.get(matterId);
    if (!actions) return undefined;

    const action = actions.find((a) => a.action_id === actionId);
    if (action) {
      action.status = 'complete';
      action.completed_at = new Date().toISOString();
    }
    return action;
  }

  /**
   * Assemble a decision bundle from all collected assessments and actions.
   */
  assembleDecisionBundle(matterId: string): DecisionBundle {
    const now = new Date().toISOString();
    const receiptId = generateId('RCT');
    const bundleId = generateId('DBN');

    const assessments = this.assessments.get(matterId) ?? [];
    const actions = this.followUpActions.get(matterId) ?? [];

    // Determine overall risk level from kernel assessments
    const riskLevels = assessments
      .filter((a) => a.risk_level)
      .map((a) => a.risk_level!);

    let overallRisk: DecisionBundle['overall_risk_level'] = 'low';
    if (riskLevels.includes('critical')) overallRisk = 'critical';
    else if (riskLevels.includes('high')) overallRisk = 'high';
    else if (riskLevels.includes('medium')) overallRisk = 'medium';

    // Build recommendation
    const pendingActions = actions.filter((a) => a.status === 'pending');
    let recommendation = `${assessments.length} kernel assessment(s) collected.`;
    if (pendingActions.length > 0) {
      recommendation += ` ${pendingActions.length} follow-up action(s) pending.`;
    }

    const receipt: OrchestrationReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'assemble_decision_bundle',
      source_kernel: 'orchestrator',
      entity_type: 'decision_bundle',
      entity_id: bundleId,
      details: {
        matter_id: matterId,
        assessment_count: assessments.length,
        action_count: actions.length,
        overall_risk: overallRisk,
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    return {
      bundle_id: bundleId,
      matter_id: matterId,
      assessments,
      follow_up_actions: actions,
      overall_risk_level: overallRisk,
      recommendation,
      assembled_at: now,
      receipt_id: receiptId,
    };
  }

  /**
   * Transition matter state. Validates the transition is allowed.
   */
  transitionState(
    matterId: string,
    toStatus: MatterStatus,
    reason: string,
    transitionedBy: string,
  ): StateTransition {
    const currentStatus = this.currentStates.get(matterId) ?? 'INTAKE';
    const allowed = VALID_TRANSITIONS[currentStatus] ?? [];

    if (!allowed.includes(toStatus)) {
      throw new Error(
        `Invalid state transition: ${currentStatus} -> ${toStatus}. Allowed: ${allowed.join(', ')}`,
      );
    }

    const transition: StateTransition = {
      matter_id: matterId,
      from_status: currentStatus,
      to_status: toStatus,
      reason,
      transitioned_by: transitionedBy,
      timestamp: new Date().toISOString(),
    };

    this.currentStates.set(matterId, toStatus);
    const history = this.stateHistory.get(matterId) ?? [];
    history.push(transition);
    this.stateHistory.set(matterId, history);

    const receipt: OrchestrationReceipt = {
      receipt_id: generateId('RCT'),
      domain: 'business-law-accounting',
      action: 'state_transition',
      source_kernel: 'orchestrator',
      entity_type: 'matter',
      entity_id: matterId,
      details: {
        from_status: currentStatus,
        to_status: toStatus,
        reason,
        transitioned_by: transitionedBy,
      },
      timestamp: transition.timestamp,
    };
    this.receipts.push(receipt);

    return transition;
  }

  /**
   * Initialize a matter at a given state.
   */
  initializeMatter(matterId: string, initialStatus: MatterStatus = 'INTAKE'): void {
    this.currentStates.set(matterId, initialStatus);
  }

  getCurrentStatus(matterId: string): MatterStatus | undefined {
    return this.currentStates.get(matterId);
  }

  getStateHistory(matterId: string): StateTransition[] {
    return this.stateHistory.get(matterId) ?? [];
  }

  getAssessments(matterId: string): KernelAssessment[] {
    return this.assessments.get(matterId) ?? [];
  }

  getFollowUpActions(matterId: string): FollowUpAction[] {
    return this.followUpActions.get(matterId) ?? [];
  }

  getReceipts(): OrchestrationReceipt[] {
    return [...this.receipts];
  }
}
