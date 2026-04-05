/**
 * Obligations Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — owned by Law Kernel
 */

export interface Obligation {
  id: string;
  title: string;
  description: string;
  obligation_type: 'contractual' | 'statutory' | 'regulatory' | 'court_ordered' | 'voluntary';
  source_contract_id: string | null;
  source_matter_id: string | null;
  obligor: string;
  obligor_type: 'client' | 'counterparty' | 'vendor' | 'entity';
  obligee: string;
  obligee_type: 'client' | 'counterparty' | 'vendor' | 'entity';
  due_date: string;
  recurring: boolean;
  recurrence_pattern: string | null;
  financial_impact: number | null;
  currency: string;
  performance_type: 'payment' | 'delivery' | 'reporting' | 'compliance' | 'notification' | 'other';
  breach_consequence: string;
  cure_period_days: number | null;
  escalation_contact: string | null;
  completion_date: string | null;
  completion_evidence: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'pending' | 'in_progress' | 'completed' | 'breached' | 'waived' | 'expired' | 'disputed' | 'archived';
}

export class ObligationCatalog {
  private entries: Map<string, Obligation> = new Map();

  register(entry: Obligation): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Obligation | undefined {
    return this.entries.get(id);
  }

  list(): Obligation[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Obligation[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByContract(contractId: string): Obligation[] {
    return this.list().filter(e => e.source_contract_id === contractId);
  }

  listByMatter(matterId: string): Obligation[] {
    return this.list().filter(e => e.source_matter_id === matterId);
  }

  listOverdue(): Obligation[] {
    const now = new Date().toISOString();
    return this.list().filter(e =>
      e.due_date < now &&
      (e.status === 'pending' || e.status === 'in_progress')
    );
  }

  listDueSoon(daysAhead: number): Obligation[] {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() + daysAhead);
    return this.list().filter(e =>
      e.due_date >= now.toISOString() &&
      e.due_date <= cutoff.toISOString() &&
      (e.status === 'pending' || e.status === 'in_progress')
    );
  }

  listByObligor(obligor: string): Obligation[] {
    return this.list().filter(e => e.obligor === obligor);
  }
}
