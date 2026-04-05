/**
 * Commercial Orchestrator
 * Routes matters to appropriate kernels, assembles CommercialDecisionBundles,
 * preserves source_kernel_receipts, and coordinates cross-domain decisions.
 *
 * Trust Level: ORCHESTRATOR — coordinates, never overrides kernel truth.
 */

import { DecisionBundleAssembler, KernelAssessment, CommercialDecisionBundle } from './decisionBundleAssembler';
import { CrossDomainRouter, RoutingDecision } from './crossDomainRouter';

export type KernelName = 'business' | 'law' | 'accounting';

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
  advisory_support_receipts: string[];
  orchestrated_at: string;
}

export interface AdvisoryIntakeRequest {
  source_layer: 'voice' | 'language' | 'iron_ear';
  packet_id: string;
  session_id: string;
  content: string;
  candidates: {
    candidate_id: string;
    candidate_type: string;
    description: string;
    confidence: number;
    suggested_kernel: KernelName;
  }[];
  routing_hints: { kernel: KernelName; relevance: number }[];
}

export interface AdvisoryRoutingResult {
  routed_to: 'review_queue';
  review_queues: { kernel: KernelName; queue_id: string; candidate_count: number }[];
  total_candidates: number;
  receipt_id: string;
  warnings: string[];
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

    // Step 2: Collect kernel assessments (placeholder -- real impl would call kernels)
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

    // Step 3: For kernels that returned UNSUPPORTED, surface that -- never fabricate
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
      advisory_support_receipts: [],
      orchestrated_at: new Date().toISOString(),
    };

    return { bundle, receipt };
  }

  /**
   * Route advisory intake from voice/language layers to review queues.
   * Advisory intake is NEVER routed directly to domain truth.
   */
  routeAdvisoryIntake(intake: AdvisoryIntakeRequest): AdvisoryRoutingResult {
    const warnings: string[] = [];

    // Group candidates by suggested kernel
    const kernelGroups: Record<KernelName, string[]> = {
      business: [],
      law: [],
      accounting: [],
    };

    for (const candidate of intake.candidates) {
      if (candidate.confidence < 0.3) {
        warnings.push(`Low confidence candidate ${candidate.candidate_id} (${candidate.confidence}). Manual review recommended.`);
      }
      kernelGroups[candidate.suggested_kernel].push(candidate.candidate_id);
    }

    // Create review queue entries
    const reviewQueues: AdvisoryRoutingResult['review_queues'] = [];
    for (const [kernel, candidates] of Object.entries(kernelGroups) as [KernelName, string[]][]) {
      if (candidates.length > 0) {
        reviewQueues.push({
          kernel,
          queue_id: `review-${kernel}-${intake.packet_id}-${Date.now()}`,
          candidate_count: candidates.length,
        });
      }
    }

    return {
      routed_to: 'review_queue',
      review_queues: reviewQueues,
      total_candidates: intake.candidates.length,
      receipt_id: `receipt-advisory-${intake.session_id}-${Date.now()}`,
      warnings,
    };
  }

  /**
   * Coordinate a cross-domain decision requiring input from multiple kernels.
   */
  async coordinateCrossDomain(
    matterId: string,
    kernels: KernelName[],
    decisionType: string,
    payload: Record<string, unknown>
  ): Promise<{
    bundle: CommercialDecisionBundle;
    receipt: OrchestratorReceipt;
  }> {
    // Request assessments from specified kernels
    const assessments: KernelAssessment[] = kernels.map(kernel => ({
      kernel,
      matter_id: matterId,
      assessment_type: `${kernel}_${decisionType}`,
      result: 'pending' as const,
      summary: `Cross-domain ${decisionType} assessment from ${kernel}`,
      constraints_evaluated: [],
      receipt_id: `receipt-${kernel}-crossdomain-${matterId}-${Date.now()}`,
      assessed_at: new Date().toISOString(),
    }));

    const bundle = this.assembler.assemble(matterId, assessments);

    const receipt: OrchestratorReceipt = {
      receipt_id: `receipt-orch-crossdomain-${matterId}-${Date.now()}`,
      matter_id: matterId,
      action: `cross_domain_${decisionType}`,
      kernels_engaged: kernels,
      routing_decisions: [],
      bundle_id: bundle.bundle_id,
      advisory_support_receipts: [],
      orchestrated_at: new Date().toISOString(),
    };

    return { bundle, receipt };
  }
}
