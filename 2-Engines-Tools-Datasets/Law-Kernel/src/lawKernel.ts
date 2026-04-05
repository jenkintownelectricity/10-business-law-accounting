/**
 * Law Kernel
 * Sovereign kernel for legal truth.
 * Owns: contracts, obligations, legal risk, compliance, evidence chain, legal deadlines, legal opinions.
 */

import { LegalContract, Obligation, LegalRisk, ComplianceStatus, LegalAssessment, EvidenceItem } from './types';
import {
  evaluateUnsignedContract,
  evaluateUnreviewedObligation,
  evaluateMissingEvidence,
  evaluateExpiredDeadline,
  evaluateIncompletePartyIdentification,
  evaluateUnassessedLegalRisk,
} from './constraints';

export class LawKernel {
  readonly kernelId = 'law' as const;
  readonly trustLevel = 'TRUSTED' as const;

  evaluate(contract: LegalContract): LegalAssessment {
    const signedConstraint = evaluateUnsignedContract(contract.signed);
    const obligationConstraint = evaluateUnreviewedObligation(contract.obligations);
    const evidenceConstraint = evaluateMissingEvidence(contract.evidence_items);
    const deadlineConstraint = evaluateExpiredDeadline(contract.expiration_date);
    const partyConstraint = evaluateIncompletePartyIdentification(contract.parties);
    const riskConstraint = evaluateUnassessedLegalRisk([]);

    const constraints = [signedConstraint, obligationConstraint, evidenceConstraint, deadlineConstraint, partyConstraint, riskConstraint];
    const hasHalt = constraints.some(c => c.result === 'HALT');
    const hasWarning = constraints.some(c => c.result === 'WARNING');

    return {
      kernel: 'law',
      matter_id: contract.id,
      summary: hasHalt
        ? 'Legal assessment blocked — critical constraints unresolved'
        : hasWarning
        ? 'Legal assessment complete with warnings'
        : 'Legal assessment clear — no issues identified',
      risk_level: hasHalt ? 'high' : hasWarning ? 'medium' : 'low',
      obligations_extracted: contract.obligations,
      legal_risks: [],
      recommendations: this.generateRecommendations(constraints),
      constraints_evaluated: constraints,
      assessed_at: new Date().toISOString(),
    };
  }

  extractObligations(contract: LegalContract): Obligation[] {
    return contract.obligations.map(o => ({
      ...o,
      contract_id: contract.id,
    }));
  }

  assessLegalRisk(risks: LegalRisk[]): { overall_risk: string; unassessed_count: number; constraint: any } {
    const constraint = evaluateUnassessedLegalRisk(risks);
    const maxRiskScore = risks.length > 0 ? Math.max(...risks.map(r => r.risk_score)) : 0;
    return {
      overall_risk: maxRiskScore <= 0.3 ? 'low' : maxRiskScore <= 0.6 ? 'medium' : maxRiskScore <= 0.8 ? 'high' : 'critical',
      unassessed_count: risks.filter(r => !r.assessed).length,
      constraint,
    };
  }

  checkCompliance(jurisdiction: string, requirementsMet: string[], requirementsPending: string[]): ComplianceStatus {
    return {
      matter_id: '',
      jurisdiction,
      compliant: requirementsPending.length === 0,
      requirements_met: requirementsMet,
      requirements_pending: requirementsPending,
      last_checked: new Date().toISOString(),
    };
  }

  private generateRecommendations(constraints: any[]): string[] {
    const recs: string[] = [];
    for (const c of constraints) {
      if (c.result === 'HALT') recs.push(`RESOLVE: ${c.message}`);
      if (c.result === 'WARNING') recs.push(`REVIEW: ${c.message}`);
    }
    return recs;
  }
}
