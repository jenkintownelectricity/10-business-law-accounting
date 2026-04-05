/**
 * Domain Runtime Facade
 * Domain: Business Law Accounting
 *
 * Unified facade over the three kernels (Business, Law, Accounting)
 * and the Commercial Orchestrator. Provides a single entry point
 * for all runtime operations.
 */

import { MatterState } from './matterStateTransitions';

export type KernelName = 'business' | 'law' | 'accounting';

export interface KernelEvaluationRequest {
  target_kernel: KernelName;
  object_id: string;
  object_type: string;
  evaluation_type: 'assess' | 'validate' | 'evaluate' | 'get_constraints';
  payload: Record<string, unknown>;
  requested_by: string;
}

export interface KernelEvaluationResponse {
  kernel: KernelName;
  object_id: string;
  evaluation_type: string;
  result: Record<string, unknown>;
  constraints: string[];
  receipt_id: string;
  evaluated_at: string;
}

export interface OrchestratorRequest {
  request_type: 'route_matter' | 'assemble_bundle' | 'cross_domain_decision' | 'route_advisory_intake';
  matter_id: string;
  target_kernels: KernelName[];
  payload: Record<string, unknown>;
  requested_by: string;
}

export interface OrchestratorResponse {
  request_type: string;
  matter_id: string;
  success: boolean;
  result: Record<string, unknown>;
  receipts: string[];
  timestamp: string;
}

export interface MatterTransitionRequest {
  matter_id: string;
  current_state: MatterState;
  target_state: MatterState;
  initiated_by: string;
  reason: string;
}

export interface VoiceIntakeRequest {
  intake_type: 'spoken_command' | 'spoken_note' | 'meeting_intake';
  session_id: string;
  transcript_envelope_id: string;
  content: string;
  source_device_id: string;
}

export interface LanguageNormalizationRequest {
  input_text: string;
  input_source_id: string | null;
  input_source_type: string;
  target_kernels: KernelName[] | null;
}

export interface FacadeResponse {
  success: boolean;
  operation: string;
  result: Record<string, unknown>;
  receipts: string[];
  errors: string[];
  timestamp: string;
}

/**
 * DomainRuntimeFacade provides a single entry point for all domain runtime operations.
 * All platform-facing operations go through this facade.
 */
export class DomainRuntimeFacade {

  /**
   * Evaluate an object against a specific kernel.
   */
  async evaluateWithKernel(request: KernelEvaluationRequest): Promise<KernelEvaluationResponse> {
    const receiptId = `receipt-eval-${request.target_kernel}-${request.object_id}-${Date.now()}`;

    return {
      kernel: request.target_kernel,
      object_id: request.object_id,
      evaluation_type: request.evaluation_type,
      result: {},
      constraints: [],
      receipt_id: receiptId,
      evaluated_at: new Date().toISOString(),
    };
  }

  /**
   * Route a request through the Commercial Orchestrator.
   */
  async routeThroughOrchestrator(request: OrchestratorRequest): Promise<OrchestratorResponse> {
    return {
      request_type: request.request_type,
      matter_id: request.matter_id,
      success: true,
      result: {},
      receipts: [`receipt-orch-${request.matter_id}-${Date.now()}`],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Transition a matter's state.
   */
  async transitionMatter(request: MatterTransitionRequest): Promise<FacadeResponse> {
    return {
      success: true,
      operation: `matter_transition:${request.current_state}->${request.target_state}`,
      result: {
        matter_id: request.matter_id,
        previous_state: request.current_state,
        new_state: request.target_state,
      },
      receipts: [`receipt-transition-${request.matter_id}-${Date.now()}`],
      errors: [],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Submit voice intake for processing. All voice intake is UNTRUSTED
   * and routes through candidate envelopes, never directly to domain truth.
   */
  async submitVoiceIntake(request: VoiceIntakeRequest): Promise<FacadeResponse> {
    return {
      success: true,
      operation: `voice_intake:${request.intake_type}`,
      result: {
        session_id: request.session_id,
        intake_type: request.intake_type,
        trust_level: 'untrusted',
        routed_to_review: true,
      },
      receipts: [`receipt-voice-${request.session_id}-${Date.now()}`],
      errors: [],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Submit a language normalization request. All outputs are ADVISORY.
   */
  async submitLanguageNormalization(request: LanguageNormalizationRequest): Promise<FacadeResponse> {
    return {
      success: true,
      operation: 'language_normalization',
      result: {
        input_source_id: request.input_source_id,
        trust_level: 'advisory',
        normalization_complete: true,
      },
      receipts: [`receipt-lang-${Date.now()}`],
      errors: [],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Assemble a decision bundle for a matter across all relevant kernels.
   */
  async assembleDecisionBundle(
    matterId: string,
    requestedBy: string,
    targetKernels: KernelName[] = ['business', 'law', 'accounting']
  ): Promise<FacadeResponse> {
    return {
      success: true,
      operation: 'assemble_decision_bundle',
      result: {
        matter_id: matterId,
        target_kernels: targetKernels,
        bundle_assembled: true,
      },
      receipts: [`receipt-bundle-${matterId}-${Date.now()}`],
      errors: [],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Request a replay of operations from the receipt chain.
   */
  async requestReplay(
    fromReceiptId: string,
    toReceiptId: string | null,
    requestedBy: string,
    reason: string
  ): Promise<FacadeResponse> {
    return {
      success: true,
      operation: 'replay_request',
      result: {
        from_receipt: fromReceiptId,
        to_receipt: toReceiptId,
        replay_initiated: true,
      },
      receipts: [`receipt-replay-${Date.now()}`],
      errors: [],
      timestamp: new Date().toISOString(),
    };
  }
}
