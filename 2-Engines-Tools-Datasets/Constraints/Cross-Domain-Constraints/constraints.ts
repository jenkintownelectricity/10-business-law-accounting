/**
 * Cross-Domain Constraint Family
 * Domain: Business Law Accounting — Cross-Kernel Coordination
 *
 * These constraints enforce integrity at the boundaries where
 * Business, Law, and Accounting kernels interact, and govern
 * the boundary between language-derived outputs and sovereign actions.
 */

import type { ConstraintResult, ConstraintEvaluation } from '../Business-Constraints/constraints';

export type { ConstraintResult, ConstraintEvaluation };

export type KernelName = 'business' | 'law' | 'accounting';

// --- CROSS-001: decision-without-all-kernel-inputs ---

export interface DecisionBundleInput {
  decision_id: string;
  required_kernels: KernelName[];
  received_assessments: KernelName[];
}

export function evaluateDecisionWithoutAllKernelInputs(input: DecisionBundleInput): ConstraintEvaluation {
  const missing = input.required_kernels.filter(k => !input.received_assessments.includes(k));

  if (missing.length === 0) {
    return {
      constraint_id: 'CROSS-001',
      constraint_name: 'decision-without-all-kernel-inputs',
      result: 'PASS',
      message: 'All required kernel assessments received',
      details: { required_kernels: input.required_kernels },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-001',
    constraint_name: 'decision-without-all-kernel-inputs',
    result: 'WARNING',
    message: `Decision bundle missing assessments from: ${missing.join(', ')}`,
    details: {
      decision_id: input.decision_id,
      missing_kernels: missing,
      received_assessments: input.received_assessments
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- CROSS-002: unresolved-cross-kernel-conflict ---

export interface CrossKernelConflictInput {
  conflict_id: string;
  conflicting_kernels: KernelName[];
  resolved: boolean;
  resolution_method?: string;
}

export function evaluateUnresolvedCrossKernelConflict(input: CrossKernelConflictInput): ConstraintEvaluation {
  if (input.resolved) {
    return {
      constraint_id: 'CROSS-002',
      constraint_name: 'unresolved-cross-kernel-conflict',
      result: 'PASS',
      message: 'Cross-kernel conflict resolved',
      details: { resolution_method: input.resolution_method },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-002',
    constraint_name: 'unresolved-cross-kernel-conflict',
    result: 'HALT',
    message: `Kernels disagree without resolution: ${input.conflicting_kernels.join(' vs ')} — cannot proceed`,
    details: {
      conflict_id: input.conflict_id,
      conflicting_kernels: input.conflicting_kernels
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- CROSS-003: matter-missing-kernel-assignment ---

export interface MatterKernelAssignmentInput {
  matter_id: string;
  assigned_kernels: KernelName[];
}

export function evaluateMatterMissingKernelAssignment(input: MatterKernelAssignmentInput): ConstraintEvaluation {
  if (input.assigned_kernels.length > 0) {
    return {
      constraint_id: 'CROSS-003',
      constraint_name: 'matter-missing-kernel-assignment',
      result: 'PASS',
      message: `Matter assigned to: ${input.assigned_kernels.join(', ')}`,
      details: { assigned_kernels: input.assigned_kernels },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-003',
    constraint_name: 'matter-missing-kernel-assignment',
    result: 'HALT',
    message: 'Matter not routed to any kernel — cannot proceed',
    details: { matter_id: input.matter_id },
    evaluated_at: new Date().toISOString()
  };
}

// --- CROSS-004: spoken-intake-with-no-review-queue-routing ---

export interface SpokenIntakeRoutingInput {
  intake_id: string;
  routed_to_review_queue: boolean;
  review_queue_id?: string;
}

export function evaluateSpokenIntakeWithNoReviewQueueRouting(input: SpokenIntakeRoutingInput): ConstraintEvaluation {
  if (input.routed_to_review_queue && input.review_queue_id) {
    return {
      constraint_id: 'CROSS-004',
      constraint_name: 'spoken-intake-with-no-review-queue-routing',
      result: 'PASS',
      message: 'Spoken intake routed to review queue',
      details: { review_queue_id: input.review_queue_id },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-004',
    constraint_name: 'spoken-intake-with-no-review-queue-routing',
    result: 'HALT',
    message: 'Spoken intake not in review queue — cannot proceed without review',
    details: { intake_id: input.intake_id },
    evaluated_at: new Date().toISOString()
  };
}

// --- CROSS-005: advisory-packet-with-no-source-attribution ---

export interface AdvisoryPacketInput {
  packet_id: string;
  source_attributions: string[];
}

export function evaluateAdvisoryPacketWithNoSourceAttribution(input: AdvisoryPacketInput): ConstraintEvaluation {
  if (input.source_attributions.length > 0) {
    return {
      constraint_id: 'CROSS-005',
      constraint_name: 'advisory-packet-with-no-source-attribution',
      result: 'PASS',
      message: 'Advisory packet has source attribution',
      details: { source_count: input.source_attributions.length },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-005',
    constraint_name: 'advisory-packet-with-no-source-attribution',
    result: 'HALT',
    message: 'Advisory packet has no source attribution — cannot proceed',
    details: { packet_id: input.packet_id },
    evaluated_at: new Date().toISOString()
  };
}

// --- CROSS-006: listening-session-with-no-evidence-envelope ---

export interface ListeningSessionInput {
  session_id: string;
  evidence_envelope_id?: string;
  enveloped: boolean;
}

export function evaluateListeningSessionWithNoEvidenceEnvelope(input: ListeningSessionInput): ConstraintEvaluation {
  if (input.enveloped && input.evidence_envelope_id) {
    return {
      constraint_id: 'CROSS-006',
      constraint_name: 'listening-session-with-no-evidence-envelope',
      result: 'PASS',
      message: 'Listening session enveloped',
      details: { evidence_envelope_id: input.evidence_envelope_id },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-006',
    constraint_name: 'listening-session-with-no-evidence-envelope',
    result: 'WARNING',
    message: 'Listening session not enveloped — evidence may be incomplete',
    details: { session_id: input.session_id },
    evaluated_at: new Date().toISOString()
  };
}

// --- CROSS-007: language-derived-output-attempting-sovereign-action ---

export interface LanguageDerivedActionInput {
  output_id: string;
  source_type: 'language-model' | 'human' | 'system';
  attempted_action: string;
}

export function evaluateLanguageDerivedOutputAttemptingSovereignAction(input: LanguageDerivedActionInput): ConstraintEvaluation {
  // This constraint ALWAYS halts — language outputs cannot take sovereign action
  if (input.source_type === 'language-model') {
    return {
      constraint_id: 'CROSS-007',
      constraint_name: 'language-derived-output-attempting-sovereign-action',
      result: 'HALT',
      message: 'Language-derived output cannot take sovereign action — HALT always enforced',
      details: {
        output_id: input.output_id,
        attempted_action: input.attempted_action,
        source_type: input.source_type
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-007',
    constraint_name: 'language-derived-output-attempting-sovereign-action',
    result: 'PASS',
    message: 'Action source is not language-derived',
    details: { source_type: input.source_type },
    evaluated_at: new Date().toISOString()
  };
}

// --- CROSS-008: dictated-matter-with-unresolved-kernel-routing ---

export interface DictatedMatterRoutingInput {
  matter_id: string;
  dictation_source: boolean;
  routed_to_kernels: KernelName[];
  routing_confirmed: boolean;
}

export function evaluateDictatedMatterWithUnresolvedKernelRouting(input: DictatedMatterRoutingInput): ConstraintEvaluation {
  if (!input.dictation_source) {
    return {
      constraint_id: 'CROSS-008',
      constraint_name: 'dictated-matter-with-unresolved-kernel-routing',
      result: 'PASS',
      message: 'Matter is not dictation-sourced',
      evaluated_at: new Date().toISOString()
    };
  }

  if (input.routing_confirmed && input.routed_to_kernels.length > 0) {
    return {
      constraint_id: 'CROSS-008',
      constraint_name: 'dictated-matter-with-unresolved-kernel-routing',
      result: 'PASS',
      message: `Dictated matter routed to: ${input.routed_to_kernels.join(', ')}`,
      details: { routed_to_kernels: input.routed_to_kernels },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'CROSS-008',
    constraint_name: 'dictated-matter-with-unresolved-kernel-routing',
    result: 'WARNING',
    message: 'Dictated matter not yet routed to any kernel',
    details: {
      matter_id: input.matter_id,
      routed_to_kernels: input.routed_to_kernels,
      routing_confirmed: input.routing_confirmed
    },
    evaluated_at: new Date().toISOString()
  };
}
