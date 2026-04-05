/**
 * Counterparties Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — co-owned by Business and Law Kernels
 */

export interface Counterparty {
  id: string;
  name: string;
  counterparty_type: 'individual' | 'corporation' | 'llc' | 'partnership' | 'government' | 'other';
  relationship: 'opposing_party' | 'co_defendant' | 'co_plaintiff' | 'regulatory_body' | 'negotiating_party' | 'joint_venture_partner';
  contact_info: {
    address: string;
    phone: string | null;
    email: string | null;
  };
  counsel_info: {
    firm_name: string | null;
    attorney_name: string | null;
    attorney_email: string | null;
    attorney_phone: string | null;
  } | null;
  associated_matters: string[];
  associated_contracts: string[];
  risk_assessment: 'low' | 'medium' | 'high' | 'unknown';
  litigation_history: boolean;
  prior_dealings: string;
  conflict_check_completed: boolean;
  conflict_check_date: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'active' | 'inactive' | 'archived';
}

export class CounterpartyCatalog {
  private entries: Map<string, Counterparty> = new Map();

  register(entry: Counterparty): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Counterparty | undefined {
    return this.entries.get(id);
  }

  list(): Counterparty[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Counterparty[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByRelationship(relationship: Counterparty['relationship']): Counterparty[] {
    return this.list().filter(e => e.relationship === relationship);
  }

  listByMatter(matterId: string): Counterparty[] {
    return this.list().filter(e => e.associated_matters.includes(matterId));
  }

  listHighRisk(): Counterparty[] {
    return this.list().filter(e => e.risk_assessment === 'high');
  }

  findByName(name: string): Counterparty[] {
    const lower = name.toLowerCase();
    return this.list().filter(e => e.name.toLowerCase().includes(lower));
  }
}
