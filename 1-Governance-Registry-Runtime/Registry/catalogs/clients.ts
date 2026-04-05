/**
 * Clients Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — owned by Business Kernel
 */

export interface Client {
  id: string;
  name: string;
  type: 'individual' | 'entity' | 'trust' | 'estate';
  contact_info: {
    email: string;
    phone: string;
    address: string;
    preferred_contact_method: 'email' | 'phone' | 'mail';
  };
  associated_matters: string[];
  associated_contracts: string[];
  engagement_date: string;
  engagement_type: 'retainer' | 'project' | 'advisory' | 'ongoing';
  billing_status: 'current' | 'overdue' | 'suspended' | 'pro_bono';
  responsible_practitioner: string;
  conflict_check_completed: boolean;
  conflict_check_date: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'active' | 'inactive' | 'prospective' | 'former' | 'archived';
}

export class ClientCatalog {
  private entries: Map<string, Client> = new Map();

  register(entry: Client): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Client | undefined {
    return this.entries.get(id);
  }

  list(): Client[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Client[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByStatus(status: Client['status']): Client[] {
    return this.list().filter(e => e.status === status);
  }

  listByType(type: Client['type']): Client[] {
    return this.list().filter(e => e.type === type);
  }

  findByName(name: string): Client[] {
    const lower = name.toLowerCase();
    return this.list().filter(e => e.name.toLowerCase().includes(lower));
  }
}
