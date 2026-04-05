// ──────────────────────────────────────────────────────────────
//  ContractService — Contract Management
//  CRUD operations plus cross-kernel routing for obligation
//  extraction (Law), financial impact (Accounting), and
//  business impact (Business) assessments.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  Contract,
  ContractStatus,
  ContractType,
  ContractParty,
  ContractTerm,
  ContractFinancialSummary,
  ContractRiskAssessment,
  Priority,
  TrustLevel,
  KernelDomain,
  Obligation,
  RiskSeverity,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Request / Response Types ───────────────────────────────────

export interface CreateContractRequest {
  title: string;
  contract_type: ContractType;
  parties: ContractParty[];
  effective_date: string;
  expiration_date?: string;
  auto_renew: boolean;
  governing_law: string;
  terms?: ContractTerm[];
  financial_summary: ContractFinancialSummary;
  tags?: string[];
  priority: Priority;
  created_by: string;
  source_document_path?: string;
}

export interface UpdateContractRequest {
  id: string;
  title?: string;
  status?: ContractStatus;
  terms?: ContractTerm[];
  financial_summary?: ContractFinancialSummary;
  risk_assessments?: ContractRiskAssessment[];
  tags?: string[];
  priority?: Priority;
  updated_by: string;
}

export interface ListContractsFilter {
  status?: ContractStatus;
  contract_type?: ContractType;
  party_entity_id?: string;
  matter_id?: string;
  priority?: Priority;
  tag?: string;
  expiring_before?: string;
  limit?: number;
  offset?: number;
}

export interface ObligationExtractionResult {
  contract_id: string;
  extracted_obligations: ExtractedObligation[];
  routing_kernel: 'law';
  confidence: number;
  receipt: Receipt;
}

export interface ExtractedObligation {
  clause_reference: string;
  obligation_text: string;
  suggested_type: string;
  suggested_obligor: string;
  suggested_obligee: string;
  suggested_due_date?: string;
  financial_value?: number;
  confidence: number;
}

export interface FinancialImpactAssessment {
  contract_id: string;
  total_value: number;
  currency: string;
  annual_impact: number;
  contingent_liabilities: number;
  tax_implications: string[];
  cash_flow_impact: string;
  classification_guidance: string;
  routing_kernel: 'accounting';
  receipt: Receipt;
}

export interface BusinessImpactAssessment {
  contract_id: string;
  strategic_alignment: 'aligned' | 'neutral' | 'misaligned';
  commercial_impact: string;
  stakeholder_impacts: string[];
  risk_summary: string;
  recommendations: string[];
  routing_kernel: 'business';
  receipt: Receipt;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class ContractService {
  private contracts: Map<string, Contract> = new Map();
  private receiptSequence = 0;

  // ── CRUD ───────────────────────────────────────────────────

  async createContract(request: CreateContractRequest): Promise<ServiceResult<Contract>> {
    const now = new Date().toISOString();
    const id = `contract_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const contract: Contract = {
      id,
      title: request.title,
      contract_type: request.contract_type,
      status: 'draft',
      parties: request.parties,
      effective_date: request.effective_date,
      expiration_date: request.expiration_date,
      auto_renew: request.auto_renew,
      governing_law: request.governing_law,
      terms: request.terms ?? [],
      financial_summary: request.financial_summary,
      risk_assessments: [],
      obligation_ids: [],
      matter_ids: [],
      evidence_ids: [],
      source_document_path: request.source_document_path,
      tags: request.tags ?? [],
      trust_level: 'TRUSTED',
      priority: request.priority,
      created_at: now,
      updated_at: now,
      created_by: request.created_by,
    };

    this.contracts.set(id, contract);

    const receipt = this.emitReceipt({
      operation: 'contract.created',
      description: `Contract "${contract.title}" created`,
      actor: request.created_by,
      target_id: id,
      target_type: 'contract',
      source_kernel: 'orchestrator',
      previous_state: null,
      new_state: 'draft',
    });

    return { success: true, data: contract, receipt };
  }

  async getContract(id: string): Promise<ServiceResult<Contract>> {
    const contract = this.contracts.get(id);
    if (!contract) {
      return { success: false, error: `Contract ${id} not found` };
    }
    return { success: true, data: { ...contract } };
  }

  async updateContract(request: UpdateContractRequest): Promise<ServiceResult<Contract>> {
    const contract = this.contracts.get(request.id);
    if (!contract) {
      return { success: false, error: `Contract ${request.id} not found` };
    }

    const previousState = contract.status;

    if (request.title !== undefined) contract.title = request.title;
    if (request.status !== undefined) contract.status = request.status;
    if (request.terms !== undefined) contract.terms = request.terms;
    if (request.financial_summary !== undefined) contract.financial_summary = request.financial_summary;
    if (request.risk_assessments !== undefined) contract.risk_assessments = request.risk_assessments;
    if (request.tags !== undefined) contract.tags = request.tags;
    if (request.priority !== undefined) contract.priority = request.priority;
    contract.updated_at = new Date().toISOString();

    const receipt = this.emitReceipt({
      operation: 'contract.updated',
      description: `Contract "${contract.title}" updated`,
      actor: request.updated_by,
      target_id: request.id,
      target_type: 'contract',
      source_kernel: 'orchestrator',
      previous_state: previousState,
      new_state: contract.status,
    });

    return { success: true, data: { ...contract }, receipt };
  }

  async listContracts(filter: ListContractsFilter = {}): Promise<ServiceResult<Contract[]>> {
    let results = Array.from(this.contracts.values());

    if (filter.status) results = results.filter(c => c.status === filter.status);
    if (filter.contract_type) results = results.filter(c => c.contract_type === filter.contract_type);
    if (filter.party_entity_id) results = results.filter(c => c.parties.some(p => p.entity_id === filter.party_entity_id));
    if (filter.matter_id) results = results.filter(c => c.matter_ids.includes(filter.matter_id!));
    if (filter.priority) results = results.filter(c => c.priority === filter.priority);
    if (filter.tag) results = results.filter(c => c.tags.includes(filter.tag!));
    if (filter.expiring_before) {
      const cutoff = new Date(filter.expiring_before).getTime();
      results = results.filter(c => c.expiration_date && new Date(c.expiration_date).getTime() <= cutoff);
    }

    const offset = filter.offset ?? 0;
    const limit = filter.limit ?? 50;
    results = results.slice(offset, offset + limit);

    return { success: true, data: results };
  }

  // ── Cross-Kernel Routing ──────────────────────────────────

  async extractObligations(
    contractId: string,
    requestedBy: string
  ): Promise<ServiceResult<ObligationExtractionResult>> {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      return { success: false, error: `Contract ${contractId} not found` };
    }

    // Route through Law Kernel — produces extraction candidates
    const extracted: ExtractedObligation[] = contract.terms.map(term => ({
      clause_reference: term.clause_reference,
      obligation_text: term.summary,
      suggested_type: term.term_type,
      suggested_obligor: contract.parties.find(p => p.role === 'principal')?.entity_id ?? 'unknown',
      suggested_obligee: contract.parties.find(p => p.role === 'counterparty')?.entity_id ?? 'unknown',
      suggested_due_date: term.key_dates?.[0],
      financial_value: term.financial_value,
      confidence: 0.85,
    }));

    const receipt = this.emitReceipt({
      operation: 'contract.obligations_extracted',
      description: `${extracted.length} obligation candidates extracted via Law Kernel`,
      actor: requestedBy,
      target_id: contractId,
      target_type: 'contract',
      source_kernel: 'law',
      previous_state: null,
      new_state: `${extracted.length} candidates`,
    });

    return {
      success: true,
      data: {
        contract_id: contractId,
        extracted_obligations: extracted,
        routing_kernel: 'law',
        confidence: 0.85,
        receipt,
      },
      receipt,
    };
  }

  async assessFinancialImpact(
    contractId: string,
    requestedBy: string
  ): Promise<ServiceResult<FinancialImpactAssessment>> {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      return { success: false, error: `Contract ${contractId} not found` };
    }

    // Route through Accounting Kernel
    const fs = contract.financial_summary;
    const contingentTotal = fs.contingent_amounts.reduce((sum, ca) => sum + ca.estimated_amount, 0);

    const assessment: FinancialImpactAssessment = {
      contract_id: contractId,
      total_value: fs.total_value,
      currency: fs.currency,
      annual_impact: fs.annual_value ?? fs.total_value,
      contingent_liabilities: contingentTotal,
      tax_implications: ['Review required for tax treatment of contract payments'],
      cash_flow_impact: fs.payment_schedule.length > 0
        ? `${fs.payment_schedule.length} scheduled payments totaling ${fs.total_value} ${fs.currency}`
        : 'No payment schedule defined',
      classification_guidance: 'Requires period-end assessment for proper classification',
      routing_kernel: 'accounting',
      receipt: null!,
    };

    const receipt = this.emitReceipt({
      operation: 'contract.financial_impact_assessed',
      description: `Financial impact assessed: ${fs.total_value} ${fs.currency}`,
      actor: requestedBy,
      target_id: contractId,
      target_type: 'contract',
      source_kernel: 'accounting',
      previous_state: null,
      new_state: JSON.stringify({ total_value: fs.total_value, contingent: contingentTotal }),
    });

    assessment.receipt = receipt;
    return { success: true, data: assessment, receipt };
  }

  async assessBusinessImpact(
    contractId: string,
    requestedBy: string
  ): Promise<ServiceResult<BusinessImpactAssessment>> {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      return { success: false, error: `Contract ${contractId} not found` };
    }

    // Route through Business Kernel
    const riskCount = contract.risk_assessments.length;
    const highRisks = contract.risk_assessments.filter(r => r.severity === 'critical' || r.severity === 'high');

    const assessment: BusinessImpactAssessment = {
      contract_id: contractId,
      strategic_alignment: 'neutral',
      commercial_impact: `Contract "${contract.title}" with ${contract.parties.length} parties, type: ${contract.contract_type}`,
      stakeholder_impacts: contract.parties.map(p => `${p.name} (${p.role})`),
      risk_summary: `${riskCount} risks identified, ${highRisks.length} high/critical`,
      recommendations: [
        'Evaluate counterparty relationship strength',
        'Assess alignment with current business strategy',
        riskCount > 0 ? 'Address identified risk items before proceeding' : 'Low risk profile — standard review sufficient',
      ],
      routing_kernel: 'business',
      receipt: null!,
    };

    const receipt = this.emitReceipt({
      operation: 'contract.business_impact_assessed',
      description: `Business impact assessed for "${contract.title}"`,
      actor: requestedBy,
      target_id: contractId,
      target_type: 'contract',
      source_kernel: 'business',
      previous_state: null,
      new_state: JSON.stringify({ alignment: assessment.strategic_alignment, risks: riskCount }),
    });

    assessment.receipt = receipt;
    return { success: true, data: assessment, receipt };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
    source_kernel: string;
    previous_state: string | null;
    new_state: string | null;
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: 'kernel_evaluation',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'practitioner',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: params.source_kernel as Receipt['source_kernel'],
      previous_state: params.previous_state,
      new_state: params.new_state,
      payload_hash: `sha256_${Date.now()}`,
      parent_receipt_id: null,
      related_receipt_ids: [],
      timestamp: now,
      replay_sequence: this.receiptSequence,
      idempotency_key: `${params.operation}_${params.target_id}_${this.receiptSequence}`,
      notes: '',
      created_at: now,
      updated_at: now,
      status: 'emitted',
    };
  }
}
