/**
 * Commercial Orchestrator
 * Routes matters to appropriate kernels, assembles CommercialDecisionBundles,
 * preserves source_kernel_receipts, and coordinates cross-domain decisions.
 *
 * Trust Level: ORCHESTRATOR — coordinates, never overrides kernel truth.
 */

import { DecisionBundleAssembler, KernelAssessment, CommercialDecisionBundle } from './decisionBundleAssembler';
import { CrossDomainRouter, RoutingDecision } from './crossDomainRouter';

export interface MatterIntake {
  matter_id: string;
  title: string;
  description: string;
  matter_type?: string;
  entity_id?: string;
  domains?: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  received_at: string;
}

export interface OrchestratorReceipt {
  receipt_id: string;
  matter_id: string;
  action: string;
  kernels_engaged: string[];
  routing_decisions: RoutingDecision[];
  bundle_id?: string;
  orchestrated_at: string;
}

export class CommercialOrchestrator {
  readonly role = 'orchestrator' as const;
  readonly trustLevel = 'ORCHESTRATOR' as const;

  private readonly router = new CrossDomainRouter();
  private readonly assembler = new DecisionBundleAssembler();

  /**
   * Route a matter to appropriate kernels and assemble a decision bundle.
   * The orchestrator never fabricates assessments for non-responding kernels.
   */
  async orchestrate(intake: MatterIntake): Promise<{
    bundle: CommercialDecisionBundle;
    receipt: OrchestratorReceipt;
  }> {
    // Step 1: Determine routing
    const routingDecisions = this.router.route(intake);

    // Step 2: Collect kernel assessments (placeholder — real impl would call kernels)
    const assessments: KernelAssessment[] = routingDecisions
      .filter(rd => rd.routed)
      .map(rd => ({
        kernel: rd.target_kernel,
        matter_id: intake.matter_id,
        assessment_type: `${rd.target_kernel}_evaluation`,
        result: 'pending' as const,
        summary: `Awaiting ${rd.target_kernel} kernel assessment`,
        constraints_evaluated: [],
        receipt_id: `receipt-${rd.target_kernel}-${intake.matter_id}-${Date.now()}`,
        assessed_at: new Date().toISOString(),
      }));

    // Step 3: For kernels that returned UNSUPPORTED, surface that — never fabricate
    const unsupported = routingDecisions.filter(rd => !rd.routed);
    for (const u of unsupported) {
      assessments.push({
        kernel: u.target_kernel,
        matter_id: intake.matter_id,
        assessment_type: `${u.target_kernel}_unsupported`,
        result: 'unsupported' as const,
        summary: u.reason ?? `${u.target_kernel} kernel cannot handle this matter type`,
        constraints_evaluated: [],
        receipt_id: `receipt-${u.target_kernel}-unsupported-${Date.now()}`,
        assessed_at: new Date().toISOString(),
      });
    }

    // Step 4: Assemble decision bundle
    const bundle = this.assembler.assemble(intake.matter_id, assessments);

    // Step 5: Emit orchestrator receipt
    const receipt: OrchestratorReceipt = {
      receipt_id: `receipt-orch-${intake.matter_id}-${Date.now()}`,
      matter_id: intake.matter_id,
      action: 'orchestrate_matter',
      kernels_engaged: routingDecisions.filter(rd => rd.routed).map(rd => rd.target_kernel),
      routing_decisions: routingDecisions,
      bundle_id: bundle.bundle_id,
      orchestrated_at: new Date().toISOString(),
    };

    return { bundle, receipt };
  }

  /**
   * Route advisory intake from voice/language layers to review queues.
   * Advisory intake is never routed directly to domain truth.
   */
  routeAdvisoryIntake(intake: {
    source_layer: 'voice' | 'language';
    content: string;
    candidates: any[];
    session_id: string;
  }): {
    routed_to: 'review_queue';
    queue_id: string;
    items: any[];
    receipt_id: string;
  } {
    return {
      routed_to: 'review_queue',
      queue_id: `review-${intake.source_layer}-${Date.now()}`,
      items: intake.candidates,
      receipt_id: `receipt-advisory-${intake.session_id}-${Date.now()}`,
    };
  }
}
