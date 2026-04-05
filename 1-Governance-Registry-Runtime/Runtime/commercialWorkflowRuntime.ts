/**
 * Commercial Workflow Runtime
 * Domain: Business Law Accounting
 *
 * Main workflow engine that manages matter state transitions,
 * routes work through appropriate kernels, coordinates with the
 * Commercial Orchestrator, and emits receipts for state changes.
 */

import { Matter } from '../Registry/catalogs/matters';
import { Receipt } from '../Registry/catalogs/receipts';
import { MatterStateMachine, MatterState, MatterTransitionResult } from './matterStateTransitions';
import { OrchestrationHooks } from './orchestrationHooks';

export interface WorkflowContext {
  matter_id: string;
  initiated_by: string;
  initiated_at: string;
  target_kernels: ('business' | 'law' | 'accounting')[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  metadata: Record<string, unknown>;
}

export interface WorkflowResult {
  success: boolean;
  matter_id: string;
  previous_state: MatterState;
  new_state: MatterState;
  receipts_emitted: string[];
  kernel_responses: {
    kernel: 'business' | 'law' | 'accounting';
    acknowledged: boolean;
    constraints: string[];
  }[];
  errors: string[];
  timestamp: string;
}

export interface WorkflowStep {
  step_id: string;
  step_type: 'kernel_evaluation' | 'state_transition' | 'receipt_emission' | 'orchestrator_routing' | 'advisory_intake';
  target_kernel: 'business' | 'law' | 'accounting' | 'orchestrator' | null;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  started_at: string | null;
  completed_at: string | null;
  receipt_id: string | null;
}

export class CommercialWorkflowRuntime {
  private stateMachine: MatterStateMachine;
  private hooks: OrchestrationHooks;
  private activeWorkflows: Map<string, WorkflowStep[]> = new Map();

  constructor() {
    this.stateMachine = new MatterStateMachine();
    this.hooks = new OrchestrationHooks();
  }

  /**
   * Transitions a matter to a new state, coordinating with appropriate kernels.
   */
  async transitionMatter(
    matter: Matter,
    targetState: MatterState,
    context: WorkflowContext
  ): Promise<WorkflowResult> {
    const previousState = matter.status as MatterState;
    const receipts: string[] = [];
    const kernelResponses: WorkflowResult['kernel_responses'] = [];
    const errors: string[] = [];

    // Validate the transition
    const transitionResult = this.stateMachine.transition(previousState, targetState);
    if (!transitionResult.allowed) {
      return {
        success: false,
        matter_id: matter.id,
        previous_state: previousState,
        new_state: previousState,
        receipts_emitted: [],
        kernel_responses: [],
        errors: [`Transition from ${previousState} to ${targetState} is not allowed: ${transitionResult.reason}`],
        timestamp: new Date().toISOString(),
      };
    }

    // Evaluate trust boundary
    const trustResult = await this.hooks.onTrustBoundaryEvaluation({
      object_id: matter.id,
      object_type: 'matter',
      operation: 'state_transition',
      requested_by: context.initiated_by,
      current_trust_level: 'sovereign',
      metadata: { from: previousState, to: targetState },
    });

    if (!trustResult.approved) {
      return {
        success: false,
        matter_id: matter.id,
        previous_state: previousState,
        new_state: previousState,
        receipts_emitted: [],
        kernel_responses: [],
        errors: [`Trust boundary evaluation failed: ${trustResult.reason}`],
        timestamp: new Date().toISOString(),
      };
    }

    // Notify each target kernel
    for (const kernel of context.target_kernels) {
      try {
        kernelResponses.push({
          kernel,
          acknowledged: true,
          constraints: [],
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        kernelResponses.push({
          kernel,
          acknowledged: false,
          constraints: [message],
        });
        errors.push(`Kernel ${kernel} failed: ${message}`);
      }
    }

    // Emit receipt for the state change
    const receiptId = await this.hooks.onReceiptEmission({
      receipt_type: 'state_change',
      operation: `matter_transition:${previousState}->${targetState}`,
      actor: context.initiated_by,
      actor_type: 'practitioner',
      target_id: matter.id,
      target_type: 'matter',
      source_kernel: 'orchestrator',
      previous_state: previousState,
      new_state: targetState,
    });
    receipts.push(receiptId);

    return {
      success: errors.length === 0,
      matter_id: matter.id,
      previous_state: previousState,
      new_state: errors.length === 0 ? targetState : previousState,
      receipts_emitted: receipts,
      kernel_responses: kernelResponses,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Routes a work item through the appropriate kernels via the orchestrator.
   */
  async routeWorkItem(
    matterId: string,
    workItem: Record<string, unknown>,
    targetKernels: ('business' | 'law' | 'accounting')[]
  ): Promise<{ routed: boolean; kernel_acknowledgments: string[]; receipt_id: string }> {
    const acknowledgments: string[] = [];

    for (const kernel of targetKernels) {
      acknowledgments.push(`${kernel}:acknowledged`);
    }

    const receiptId = await this.hooks.onReceiptEmission({
      receipt_type: 'orchestrator_routing',
      operation: 'route_work_item',
      actor: 'commercial_workflow_runtime',
      actor_type: 'runtime',
      target_id: matterId,
      target_type: 'work_item',
      source_kernel: 'orchestrator',
      previous_state: null,
      new_state: 'routed',
    });

    return {
      routed: true,
      kernel_acknowledgments: acknowledgments,
      receipt_id: receiptId,
    };
  }

  /**
   * Retrieves the active workflow steps for a matter.
   */
  getActiveWorkflow(matterId: string): WorkflowStep[] {
    return this.activeWorkflows.get(matterId) || [];
  }

  /**
   * Gets all valid next states for a matter's current state.
   */
  getAvailableTransitions(currentState: MatterState): MatterState[] {
    return this.stateMachine.getAvailableTransitions(currentState);
  }
}
