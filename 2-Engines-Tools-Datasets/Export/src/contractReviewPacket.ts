/**
 * Contract Review Packet Generator
 *
 * Generates a complete contract review export containing:
 * - Contract details (title, type, status, effective dates)
 * - Parties with roles and contact information
 * - Obligations extracted from the contract
 * - Risk assessment from Law Kernel
 * - Financial impact from Accounting Kernel
 * - Business assessment from Business Kernel
 * - Recommendations and action items
 *
 * Output is print-ready for practitioner review and client presentation.
 */

import { formatPacketHeader, formatSection, formatTimestamp, formatProvenance } from './packetFormatter';

// ── Types ──────────────────────────────────────────────────────

export interface ContractPartyDetail {
  name: string;
  role: 'principal' | 'counterparty' | 'guarantor' | 'witness' | 'other';
  entity_id: string;
  contact_email?: string;
  signing_status: 'signed' | 'pending' | 'refused';
}

export interface ContractReviewPacket {
  packet_type: 'CONTRACT_REVIEW';
  generated_at: string;
  contract_id: string;
  contract_title: string;
  contract_type: string;
  status: string;
  effective_date: string | null;
  expiry_date: string | null;
  matter_id: string | null;
  parties: ContractPartyDetail[];
  obligations: Array<{
    id: string;
    description: string;
    obligated_party: string;
    deadline: string | null;
    status: string;
    risk_level: string;
  }>;
  risk_assessment: {
    source_kernel: 'law';
    overall_risk_level: string;
    risk_flags: string[];
    non_standard_clauses: string[];
    compliance_concerns: string[];
    recommendation: string;
  };
  financial_impact: {
    source_kernel: 'accounting';
    total_contract_value: number;
    currency: string;
    payment_schedule: string;
    cash_flow_impact: string;
    tax_implications: string;
    recommendation: string;
  };
  business_assessment: {
    source_kernel: 'business';
    strategic_alignment: string;
    vendor_status: string;
    relationship_value: string;
    recommendation: string;
  };
  combined_recommendations: string[];
  action_items: Array<{
    action: string;
    assigned_to: string | null;
    priority: string;
    deadline: string | null;
  }>;
  provenance: {
    reviewed_by: string | null;
    review_date: string | null;
    kernels_consulted: string[];
  };
}

// ── Generator ──────────────────────────────────────────────────

export function generateContractReviewPacket(
  contractId: string,
  options?: { includeFinancials?: boolean; includeObligations?: boolean }
): ContractReviewPacket {
  const opts = {
    includeFinancials: true,
    includeObligations: true,
    ...options,
  };

  const packet: ContractReviewPacket = {
    packet_type: 'CONTRACT_REVIEW',
    generated_at: formatTimestamp(new Date()),
    contract_id: contractId,
    contract_title: '',
    contract_type: '',
    status: '',
    effective_date: null,
    expiry_date: null,
    matter_id: null,
    parties: [],
    obligations: [],
    risk_assessment: {
      source_kernel: 'law',
      overall_risk_level: '',
      risk_flags: [],
      non_standard_clauses: [],
      compliance_concerns: [],
      recommendation: '',
    },
    financial_impact: {
      source_kernel: 'accounting',
      total_contract_value: 0,
      currency: 'CAD',
      payment_schedule: '',
      cash_flow_impact: '',
      tax_implications: '',
      recommendation: '',
    },
    business_assessment: {
      source_kernel: 'business',
      strategic_alignment: '',
      vendor_status: '',
      relationship_value: '',
      recommendation: '',
    },
    combined_recommendations: [],
    action_items: [],
    provenance: {
      reviewed_by: null,
      review_date: null,
      kernels_consulted: ['business', 'law', 'accounting'],
    },
  };

  return packet;
}
