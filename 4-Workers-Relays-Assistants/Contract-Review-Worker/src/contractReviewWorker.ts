/**
 * Contract-Review-Worker
 *
 * Receives contract for review, extracts obligations, assesses risks through
 * Law Kernel, routes financial assessment to Accounting Kernel, business
 * impact to Business Kernel. Produces ContractReviewPacket.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContractInput {
  contract_id: string;
  matter_id: string;
  title: string;
  parties: string[];
  full_text: string;
  contract_type: string;
  effective_date?: string;
  expiration_date?: string;
  metadata?: Record<string, unknown>;
}

export interface ExtractedObligation {
  obligation_id: string;
  clause_reference: string;
  description: string;
  obligated_party: string;
  deadline?: string;
  recurring: boolean;
  obligation_type: 'performance' | 'payment' | 'delivery' | 'compliance' | 'reporting' | 'other';
}

export interface LegalRiskAssessment {
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  risk_factors: string[];
  constraint_issues: string[];
  recommendations: string[];
}

export interface FinancialAssessment {
  total_value?: number;
  payment_terms: string;
  financial_risks: string[];
  tax_implications: string[];
  ledger_classifications: string[];
}

export interface BusinessImpactAssessment {
  impact_level: 'critical' | 'high' | 'medium' | 'low';
  strategic_alignment: string;
  operational_impacts: string[];
  resource_requirements: string[];
}

export interface ContractReviewPacket {
  packet_id: string;
  contract_id: string;
  matter_id: string;
  reviewed_at: string;
  obligations: ExtractedObligation[];
  legal_assessment: LegalRiskAssessment;
  financial_assessment: FinancialAssessment;
  business_assessment: BusinessImpactAssessment;
  overall_recommendation: 'approve' | 'approve_with_conditions' | 'reject' | 'needs_further_review';
  conditions: string[];
  receipt_id: string;
}

export interface ContractReviewReceipt {
  receipt_id: string;
  domain: 'business-law-accounting';
  action: 'contract_review';
  source_kernel: 'orchestrator';
  entity_type: 'contract';
  entity_id: string;
  details: Record<string, unknown>;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

// ---------------------------------------------------------------------------
// Extraction & assessment (domain logic stubs)
// ---------------------------------------------------------------------------

function extractObligations(contractText: string): ExtractedObligation[] {
  const obligations: ExtractedObligation[] = [];

  const obligationPatterns = [
    { pattern: /shall\s+pay/gi, type: 'payment' as const },
    { pattern: /shall\s+deliver/gi, type: 'delivery' as const },
    { pattern: /shall\s+perform/gi, type: 'performance' as const },
    { pattern: /shall\s+comply/gi, type: 'compliance' as const },
    { pattern: /shall\s+report/gi, type: 'reporting' as const },
    { pattern: /must\s+provide/gi, type: 'performance' as const },
    { pattern: /obligated\s+to/gi, type: 'other' as const },
  ];

  for (const { pattern, type } of obligationPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(contractText)) !== null) {
      const start = Math.max(0, match.index - 50);
      const end = Math.min(contractText.length, match.index + 150);
      const context = contractText.substring(start, end).trim();

      obligations.push({
        obligation_id: generateId('OBL'),
        clause_reference: `char_offset:${match.index}`,
        description: context,
        obligated_party: 'TBD',
        recurring: false,
        obligation_type: type,
      });
    }
  }

  return obligations;
}

function assessLegalRisk(contract: ContractInput, obligations: ExtractedObligation[]): LegalRiskAssessment {
  const riskFactors: string[] = [];
  const constraintIssues: string[] = [];
  const recommendations: string[] = [];

  if (!contract.expiration_date) {
    riskFactors.push('No expiration date specified');
    recommendations.push('Specify contract expiration date');
  }

  if (obligations.length === 0) {
    constraintIssues.push('No obligations could be extracted — manual review required');
  }

  if (contract.parties.length < 2) {
    riskFactors.push('Fewer than two parties identified');
  }

  const complianceObligations = obligations.filter((o) => o.obligation_type === 'compliance');
  if (complianceObligations.length > 0) {
    riskFactors.push(`${complianceObligations.length} compliance obligation(s) detected`);
    recommendations.push('Verify compliance obligations against current regulatory requirements');
  }

  let riskLevel: LegalRiskAssessment['risk_level'] = 'low';
  if (riskFactors.length >= 3 || constraintIssues.length > 0) riskLevel = 'high';
  else if (riskFactors.length >= 1) riskLevel = 'medium';

  return { risk_level: riskLevel, risk_factors: riskFactors, constraint_issues: constraintIssues, recommendations };
}

function assessFinancialImpact(contract: ContractInput, obligations: ExtractedObligation[]): FinancialAssessment {
  const paymentObligations = obligations.filter((o) => o.obligation_type === 'payment');
  const financialRisks: string[] = [];
  const taxImplications: string[] = [];
  const ledgerClassifications: string[] = [];

  if (paymentObligations.length > 0) {
    financialRisks.push(`${paymentObligations.length} payment obligation(s) identified`);
    ledgerClassifications.push('accounts_payable');
    taxImplications.push('Review payment obligations for tax deductibility');
  }

  return {
    payment_terms: 'See contract',
    financial_risks: financialRisks,
    tax_implications: taxImplications,
    ledger_classifications: ledgerClassifications,
  };
}

function assessBusinessImpact(contract: ContractInput): BusinessImpactAssessment {
  return {
    impact_level: 'medium',
    strategic_alignment: 'Requires evaluation against current business strategy',
    operational_impacts: [`Contract type "${contract.contract_type}" may affect operations`],
    resource_requirements: ['Legal review resources', 'Contract management resources'],
  };
}

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

export class ContractReviewWorker {
  private receipts: ContractReviewReceipt[] = [];

  /**
   * Review a contract: extract obligations, assess through all three kernels,
   * and produce a ContractReviewPacket.
   */
  async reviewContract(contract: ContractInput): Promise<ContractReviewPacket> {
    const now = new Date().toISOString();
    const packetId = generateId('CRP');
    const receiptId = generateId('RCT');

    // 1. Extract obligations
    const obligations = extractObligations(contract.full_text);

    // 2. Route to Law Kernel — assess legal risk
    const legalAssessment = assessLegalRisk(contract, obligations);

    // 3. Route to Accounting Kernel — assess financial impact
    const financialAssessment = assessFinancialImpact(contract, obligations);

    // 4. Route to Business Kernel — assess business impact
    const businessAssessment = assessBusinessImpact(contract);

    // 5. Determine overall recommendation
    let recommendation: ContractReviewPacket['overall_recommendation'] = 'approve';
    const conditions: string[] = [];

    if (legalAssessment.risk_level === 'critical' || legalAssessment.constraint_issues.length > 0) {
      recommendation = 'needs_further_review';
    } else if (legalAssessment.risk_level === 'high') {
      recommendation = 'approve_with_conditions';
      conditions.push(...legalAssessment.recommendations);
    }

    // 6. Emit receipt
    const receipt: ContractReviewReceipt = {
      receipt_id: receiptId,
      domain: 'business-law-accounting',
      action: 'contract_review',
      source_kernel: 'orchestrator',
      entity_type: 'contract',
      entity_id: contract.contract_id,
      details: {
        matter_id: contract.matter_id,
        obligation_count: obligations.length,
        legal_risk_level: legalAssessment.risk_level,
        recommendation,
      },
      timestamp: now,
    };
    this.receipts.push(receipt);

    return {
      packet_id: packetId,
      contract_id: contract.contract_id,
      matter_id: contract.matter_id,
      reviewed_at: now,
      obligations,
      legal_assessment: legalAssessment,
      financial_assessment: financialAssessment,
      business_assessment: businessAssessment,
      overall_recommendation: recommendation,
      conditions,
      receipt_id: receiptId,
    };
  }

  getReceipts(): ContractReviewReceipt[] {
    return [...this.receipts];
  }
}
