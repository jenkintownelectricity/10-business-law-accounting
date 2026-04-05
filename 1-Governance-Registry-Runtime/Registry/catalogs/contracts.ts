/**
 * Contracts Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — owned by Law Kernel
 */

export interface Contract {
  id: string;
  title: string;
  contract_type: 'service_agreement' | 'nda' | 'lease' | 'employment' | 'purchase' | 'settlement' | 'partnership' | 'license' | 'other';
  parties: {
    party_id: string;
    party_name: string;
    role: 'principal' | 'counterparty' | 'guarantor' | 'beneficiary';
  }[];
  effective_date: string;
  expiration_date: string | null;
  execution_date: string | null;
  execution_status: 'draft' | 'under_review' | 'pending_signature' | 'partially_executed' | 'fully_executed' | 'expired' | 'terminated';
  obligations_count: number;
  financial_value: number | null;
  currency: string;
  governing_law: string;
  jurisdiction: string;
  renewal_type: 'auto_renew' | 'manual_renew' | 'non_renewable';
  renewal_notice_days: number | null;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  associated_matter_id: string | null;
  associated_client_id: string;
  document_references: string[];
  amendment_history: {
    amendment_id: string;
    date: string;
    description: string;
  }[];
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'active' | 'inactive' | 'draft' | 'expired' | 'terminated' | 'archived';
}

export class ContractCatalog {
  private entries: Map<string, Contract> = new Map();

  register(entry: Contract): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Contract | undefined {
    return this.entries.get(id);
  }

  list(): Contract[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Contract[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByRiskLevel(level: Contract['risk_level']): Contract[] {
    return this.list().filter(e => e.risk_level === level);
  }

  listExpiringSoon(daysAhead: number): Contract[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysAhead);
    const cutoffStr = cutoff.toISOString();
    return this.list().filter(e =>
      e.expiration_date !== null &&
      e.expiration_date <= cutoffStr &&
      e.status === 'active'
    );
  }

  listByClient(clientId: string): Contract[] {
    return this.list().filter(e => e.associated_client_id === clientId);
  }

  listByExecutionStatus(status: Contract['execution_status']): Contract[] {
    return this.list().filter(e => e.execution_status === status);
  }
}
