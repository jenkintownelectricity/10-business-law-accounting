/**
 * Matter Review Packet Generator
 *
 * Generates a complete matter review packet containing:
 * - Matter details (title, status, client, practitioner)
 * - Kernel assessments (business, law, accounting)
 * - Active constraints and their resolution status
 * - Evidence inventory
 * - Timeline of significant events
 * - Follow-up actions and deadlines
 *
 * Output is print-ready and suitable for practitioner review sessions.
 */

import { formatPacketHeader, formatSection, formatTimestamp, formatProvenance } from './packetFormatter';

// ── Types ──────────────────────────────────────────────────────

export interface MatterReviewSection {
  title: string;
  content: string;
  source_kernel?: string;
}

export interface MatterReviewPacket {
  packet_type: 'MATTER_REVIEW';
  generated_at: string;
  matter_id: string;
  matter_title: string;
  status: string;
  client: {
    id: string;
    name: string;
  };
  assigned_practitioner: string | null;
  kernel_assessments: {
    business: {
      source_kernel: 'business';
      strategic_alignment: string;
      risk_score: number;
      vendor_concerns: string[];
      recommendation: string;
    };
    law: {
      source_kernel: 'law';
      legal_risk_level: string;
      active_obligations: number;
      compliance_status: string;
      recommendation: string;
    };
    accounting: {
      source_kernel: 'accounting';
      total_financial_exposure: number;
      currency: string;
      outstanding_invoices: number;
      reconciliation_status: string;
      recommendation: string;
    };
  };
  constraints: Array<{
    type: string;
    family: string;
    severity: string;
    message: string;
    resolved: boolean;
  }>;
  evidence: Array<{
    id: string;
    type: string;
    description: string;
    added_at: string;
  }>;
  timeline: Array<{
    timestamp: string;
    event: string;
    actor: string;
    kernel?: string;
  }>;
  follow_up_actions: Array<{
    action: string;
    assigned_to: string | null;
    deadline: string | null;
    priority: string;
  }>;
  sections: MatterReviewSection[];
}

// ── Generator ──────────────────────────────────────────────────

export function generateMatterReviewPacket(
  matterId: string,
  options?: { includeTimeline?: boolean; includeEvidence?: boolean }
): MatterReviewPacket {
  const opts = {
    includeTimeline: true,
    includeEvidence: true,
    ...options,
  };

  // In production, this would fetch from domain state.
  // Structure shown here demonstrates the complete packet shape.
  const packet: MatterReviewPacket = {
    packet_type: 'MATTER_REVIEW',
    generated_at: formatTimestamp(new Date()),
    matter_id: matterId,
    matter_title: '',
    status: '',
    client: { id: '', name: '' },
    assigned_practitioner: null,
    kernel_assessments: {
      business: {
        source_kernel: 'business',
        strategic_alignment: '',
        risk_score: 0,
        vendor_concerns: [],
        recommendation: '',
      },
      law: {
        source_kernel: 'law',
        legal_risk_level: '',
        active_obligations: 0,
        compliance_status: '',
        recommendation: '',
      },
      accounting: {
        source_kernel: 'accounting',
        total_financial_exposure: 0,
        currency: 'CAD',
        outstanding_invoices: 0,
        reconciliation_status: '',
        recommendation: '',
      },
    },
    constraints: [],
    evidence: opts.includeEvidence ? [] : [],
    timeline: opts.includeTimeline ? [] : [],
    follow_up_actions: [],
    sections: [],
  };

  // Build printable sections
  packet.sections = [
    { title: 'Matter Overview', content: formatSection('Overview', `${packet.matter_title} — ${packet.status}`) },
    { title: 'Business Assessment', content: formatSection('Business', packet.kernel_assessments.business.recommendation), source_kernel: 'business' },
    { title: 'Legal Assessment', content: formatSection('Law', packet.kernel_assessments.law.recommendation), source_kernel: 'law' },
    { title: 'Financial Assessment', content: formatSection('Accounting', packet.kernel_assessments.accounting.recommendation), source_kernel: 'accounting' },
    { title: 'Constraints', content: formatSection('Constraints', `${packet.constraints.length} active constraints`) },
    { title: 'Follow-Up Actions', content: formatSection('Actions', `${packet.follow_up_actions.length} pending actions`) },
  ];

  return packet;
}
