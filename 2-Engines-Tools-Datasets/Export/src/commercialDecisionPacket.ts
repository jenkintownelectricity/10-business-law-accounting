/**
 * Commercial Decision Packet Generator
 *
 * Generates a decision bundle export containing:
 * - Decision question and context
 * - All kernel assessments with source provenance
 * - Combined recommendation
 * - Risks and constraints bearing on the decision
 * - Action items resulting from the decision
 * - Full provenance chain from question to resolution
 *
 * This packet documents the complete reasoning trail for any commercial decision.
 */

import { formatPacketHeader, formatSection, formatTimestamp, formatProvenance } from './packetFormatter';

// ── Types ──────────────────────────────────────────────────────

export interface KernelAssessmentExport {
  kernel: 'business' | 'law' | 'accounting';
  recommendation: string;
  risk_score: number;
  rationale: string;
  flags: string[];
  confidence: number;
  assessed_at: string;
}

export interface CommercialDecisionPacket {
  packet_type: 'COMMERCIAL_DECISION';
  generated_at: string;
  decision_thread_id: string;
  matter_id: string;
  question: string;
  context: string;
  kernel_assessments: {
    business: KernelAssessmentExport;
    law: KernelAssessmentExport;
    accounting: KernelAssessmentExport;
  };
  combined_recommendation: string;
  recommendation_rationale: string;
  conflicts: Array<{
    between_kernels: [string, string];
    description: string;
    resolution: string | null;
    resolved: boolean;
  }>;
  risks: Array<{
    source_kernel: string;
    risk_type: string;
    severity: string;
    description: string;
    mitigation: string | null;
  }>;
  constraints: Array<{
    type: string;
    family: string;
    severity: string;
    message: string;
    resolved: boolean;
  }>;
  action_items: Array<{
    action: string;
    assigned_to: string | null;
    priority: string;
    deadline: string | null;
    source_kernel: string;
  }>;
  decision_status: 'AWAITING_DECISION' | 'DECIDED' | 'DEFERRED' | 'SUPERSEDED';
  decided_by: string | null;
  decided_at: string | null;
  decision_outcome: string | null;
  provenance_chain: Array<{
    step: string;
    actor: string;
    timestamp: string;
    detail: string;
  }>;
}

// ── Generator ──────────────────────────────────────────────────

export function generateCommercialDecisionPacket(
  threadId: string,
  options?: { includeProvenance?: boolean; includeConstraints?: boolean }
): CommercialDecisionPacket {
  const opts = {
    includeProvenance: true,
    includeConstraints: true,
    ...options,
  };

  const now = formatTimestamp(new Date());

  const packet: CommercialDecisionPacket = {
    packet_type: 'COMMERCIAL_DECISION',
    generated_at: now,
    decision_thread_id: threadId,
    matter_id: '',
    question: '',
    context: '',
    kernel_assessments: {
      business: {
        kernel: 'business',
        recommendation: '',
        risk_score: 0,
        rationale: '',
        flags: [],
        confidence: 0,
        assessed_at: now,
      },
      law: {
        kernel: 'law',
        recommendation: '',
        risk_score: 0,
        rationale: '',
        flags: [],
        confidence: 0,
        assessed_at: now,
      },
      accounting: {
        kernel: 'accounting',
        recommendation: '',
        risk_score: 0,
        rationale: '',
        flags: [],
        confidence: 0,
        assessed_at: now,
      },
    },
    combined_recommendation: '',
    recommendation_rationale: '',
    conflicts: [],
    risks: [],
    constraints: opts.includeConstraints ? [] : [],
    action_items: [],
    decision_status: 'AWAITING_DECISION',
    decided_by: null,
    decided_at: null,
    decision_outcome: null,
    provenance_chain: opts.includeProvenance ? [] : [],
  };

  return packet;
}
