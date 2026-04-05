/**
 * Matters Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — cross-kernel, managed by Orchestrator
 */

export interface Matter {
  id: string;
  title: string;
  description: string;
  matter_type: 'litigation' | 'transactional' | 'advisory' | 'compliance' | 'tax' | 'corporate' | 'employment' | 'real_estate' | 'intellectual_property' | 'general';
  assigned_kernels: ('business' | 'law' | 'accounting')[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  client_id: string;
  responsible_practitioner: string;
  additional_practitioners: string[];
  opposing_parties: string[];
  related_contracts: string[];
  related_obligations: string[];
  financial_exposure: number | null;
  currency: string;
  billing_type: 'hourly' | 'flat_fee' | 'contingency' | 'blended' | 'pro_bono';
  total_billed: number;
  total_collected: number;
  open_date: string;
  target_resolution_date: string | null;
  close_date: string | null;
  jurisdiction: string | null;
  court_case_number: string | null;
  internal_reference: string;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'draft' | 'intake' | 'under_review' | 'active' | 'on_hold' | 'resolved' | 'closed' | 'archived';
}

export class MatterCatalog {
  private entries: Map<string, Matter> = new Map();

  register(entry: Matter): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Matter | undefined {
    return this.entries.get(id);
  }

  list(): Matter[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Matter[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByAssignedKernel(kernel: 'business' | 'law' | 'accounting'): Matter[] {
    return this.list().filter(e => e.assigned_kernels.includes(kernel));
  }

  listByStatus(status: Matter['status']): Matter[] {
    return this.list().filter(e => e.status === status);
  }

  listByPriority(priority: Matter['priority']): Matter[] {
    return this.list().filter(e => e.priority === priority);
  }

  listByClient(clientId: string): Matter[] {
    return this.list().filter(e => e.client_id === clientId);
  }

  listByPractitioner(practitionerId: string): Matter[] {
    return this.list().filter(e =>
      e.responsible_practitioner === practitionerId ||
      e.additional_practitioners.includes(practitionerId)
    );
  }
}
