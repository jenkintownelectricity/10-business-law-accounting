/**
 * Law Constraint Family
 * Domain: Business Law Accounting — Law Kernel
 */

import type { ConstraintResult, ConstraintEvaluation } from '../Business-Constraints/constraints';

export type { ConstraintResult, ConstraintEvaluation };

// --- LAW-001: unsigned-contract ---

export interface ContractSignatureInput {
  contract_id: string;
  signature_required: boolean;
  is_signed: boolean;
  signatory_count?: number;
  required_signatory_count?: number;
}

export function evaluateUnsignedContract(contract: ContractSignatureInput): ConstraintEvaluation {
  if (!contract.signature_required) {
    return {
      constraint_id: 'LAW-001',
      constraint_name: 'unsigned-contract',
      result: 'PASS',
      message: 'Contract does not require signature',
      evaluated_at: new Date().toISOString()
    };
  }

  if (contract.is_signed) {
    const signatoryComplete =
      contract.required_signatory_count === undefined ||
      (contract.signatory_count ?? 0) >= contract.required_signatory_count;

    return {
      constraint_id: 'LAW-001',
      constraint_name: 'unsigned-contract',
      result: signatoryComplete ? 'PASS' : 'WARNING',
      message: signatoryComplete
        ? 'Contract fully signed'
        : `Contract signed but missing signatories (${contract.signatory_count ?? 0}/${contract.required_signatory_count})`,
      details: {
        signatory_count: contract.signatory_count,
        required_signatory_count: contract.required_signatory_count
      },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'LAW-001',
    constraint_name: 'unsigned-contract',
    result: 'HALT',
    message: 'Contract requires signature but is unsigned — cannot proceed',
    details: { contract_id: contract.contract_id },
    evaluated_at: new Date().toISOString()
  };
}

// --- LAW-002: unreviewed-obligation ---

export interface ObligationReviewInput {
  obligation_id: string;
  reviewed: boolean;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  reviewer_id?: string;
}

export function evaluateUnreviewedObligation(obligation: ObligationReviewInput): ConstraintEvaluation {
  if (obligation.reviewed && obligation.reviewer_id) {
    return {
      constraint_id: 'LAW-002',
      constraint_name: 'unreviewed-obligation',
      result: 'PASS',
      message: 'Obligation reviewed',
      details: { reviewer_id: obligation.reviewer_id },
      evaluated_at: new Date().toISOString()
    };
  }

  const haltCriticalities: string[] = ['high', 'critical'];
  const isHalt = haltCriticalities.includes(obligation.criticality);

  return {
    constraint_id: 'LAW-002',
    constraint_name: 'unreviewed-obligation',
    result: isHalt ? 'HALT' : 'WARNING',
    message: isHalt
      ? `${obligation.criticality}-criticality obligation not reviewed — cannot proceed`
      : `${obligation.criticality}-criticality obligation not yet reviewed`,
    details: {
      obligation_id: obligation.obligation_id,
      criticality: obligation.criticality
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- LAW-003: missing-evidence ---

export interface EvidenceRequirementInput {
  assertion_id: string;
  evidence_required: boolean;
  evidence_provided: boolean;
  evidence_count?: number;
  minimum_evidence_count?: number;
}

export function evaluateMissingEvidence(input: EvidenceRequirementInput): ConstraintEvaluation {
  if (!input.evidence_required) {
    return {
      constraint_id: 'LAW-003',
      constraint_name: 'missing-evidence',
      result: 'PASS',
      message: 'No evidence required for this assertion',
      evaluated_at: new Date().toISOString()
    };
  }

  if (!input.evidence_provided) {
    return {
      constraint_id: 'LAW-003',
      constraint_name: 'missing-evidence',
      result: 'HALT',
      message: 'Evidence required for legal assertion but none provided — cannot proceed',
      details: { assertion_id: input.assertion_id },
      evaluated_at: new Date().toISOString()
    };
  }

  const meetsMinimum =
    input.minimum_evidence_count === undefined ||
    (input.evidence_count ?? 0) >= input.minimum_evidence_count;

  return {
    constraint_id: 'LAW-003',
    constraint_name: 'missing-evidence',
    result: meetsMinimum ? 'PASS' : 'WARNING',
    message: meetsMinimum
      ? 'Evidence requirements satisfied'
      : `Evidence provided but below minimum count (${input.evidence_count ?? 0}/${input.minimum_evidence_count})`,
    details: {
      evidence_count: input.evidence_count,
      minimum_evidence_count: input.minimum_evidence_count
    },
    evaluated_at: new Date().toISOString()
  };
}

// --- LAW-004: expired-deadline ---

export interface DeadlineInput {
  deadline_id: string;
  deadline_date: string;
  current_date?: string;
  grace_period_days?: number;
}

export function evaluateExpiredDeadline(input: DeadlineInput): ConstraintEvaluation {
  const now = input.current_date ? new Date(input.current_date) : new Date();
  const deadline = new Date(input.deadline_date);
  const gracePeriodMs = (input.grace_period_days ?? 0) * 24 * 60 * 60 * 1000;
  const effectiveDeadline = new Date(deadline.getTime() + gracePeriodMs);

  if (now <= deadline) {
    return {
      constraint_id: 'LAW-004',
      constraint_name: 'expired-deadline',
      result: 'PASS',
      message: 'Legal deadline has not passed',
      details: { deadline_date: input.deadline_date },
      evaluated_at: new Date().toISOString()
    };
  }

  if (now <= effectiveDeadline) {
    return {
      constraint_id: 'LAW-004',
      constraint_name: 'expired-deadline',
      result: 'WARNING',
      message: `Legal deadline passed but within grace period (${input.grace_period_days} days)`,
      details: { deadline_date: input.deadline_date, grace_period_days: input.grace_period_days },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'LAW-004',
    constraint_name: 'expired-deadline',
    result: 'HALT',
    message: 'Legal deadline has passed — cannot proceed',
    details: { deadline_id: input.deadline_id, deadline_date: input.deadline_date },
    evaluated_at: new Date().toISOString()
  };
}

// --- LAW-005: incomplete-party-identification ---

export interface PartyIdentificationInput {
  party_id: string;
  name?: string;
  legal_name?: string;
  jurisdiction?: string;
  contact_info?: string;
  role?: string;
}

export function evaluateIncompletePartyIdentification(party: PartyIdentificationInput): ConstraintEvaluation {
  const missing: string[] = [];
  if (!party.name && !party.legal_name) missing.push('name/legal_name');
  if (!party.jurisdiction) missing.push('jurisdiction');
  if (!party.contact_info) missing.push('contact_info');
  if (!party.role) missing.push('role');

  if (missing.length === 0) {
    return {
      constraint_id: 'LAW-005',
      constraint_name: 'incomplete-party-identification',
      result: 'PASS',
      message: 'Party fully identified',
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'LAW-005',
    constraint_name: 'incomplete-party-identification',
    result: 'WARNING',
    message: `Party not fully identified — missing: ${missing.join(', ')}`,
    details: { party_id: party.party_id, missing_fields: missing },
    evaluated_at: new Date().toISOString()
  };
}

// --- LAW-006: unassessed-legal-risk ---

export interface LegalRiskInput {
  matter_id: string;
  risk_assessed: boolean;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  assessor_id?: string;
}

export function evaluateUnassessedLegalRisk(input: LegalRiskInput): ConstraintEvaluation {
  if (input.risk_assessed && input.assessor_id) {
    return {
      constraint_id: 'LAW-006',
      constraint_name: 'unassessed-legal-risk',
      result: 'PASS',
      message: `Legal risk assessed as ${input.risk_level ?? 'unknown'}`,
      details: { risk_level: input.risk_level, assessor_id: input.assessor_id },
      evaluated_at: new Date().toISOString()
    };
  }

  return {
    constraint_id: 'LAW-006',
    constraint_name: 'unassessed-legal-risk',
    result: 'WARNING',
    message: 'Legal risk has not been evaluated for this matter',
    details: { matter_id: input.matter_id },
    evaluated_at: new Date().toISOString()
  };
}
