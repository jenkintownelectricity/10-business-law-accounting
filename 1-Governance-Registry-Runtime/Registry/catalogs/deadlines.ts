/**
 * Deadlines Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — owned by Law Kernel
 */

export interface Deadline {
  id: string;
  title: string;
  description: string;
  deadline_type: 'filing' | 'statute_of_limitations' | 'contractual' | 'regulatory' | 'court' | 'tax' | 'internal' | 'discovery';
  due_date: string;
  due_time: string | null;
  timezone: string;
  hard_deadline: boolean;
  extension_possible: boolean;
  extension_deadline: string | null;
  associated_matter_id: string | null;
  associated_contract_id: string | null;
  associated_obligation_id: string | null;
  responsible_practitioner: string;
  backup_practitioner: string | null;
  reminder_schedule: {
    days_before: number;
    notification_type: 'email' | 'system' | 'both';
  }[];
  consequence_of_miss: 'critical' | 'high' | 'medium' | 'low';
  consequence_description: string;
  jurisdiction: string | null;
  court_name: string | null;
  completion_date: string | null;
  completion_notes: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'upcoming' | 'imminent' | 'due_today' | 'overdue' | 'completed' | 'extended' | 'waived' | 'archived';
}

export class DeadlineCatalog {
  private entries: Map<string, Deadline> = new Map();

  register(entry: Deadline): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Deadline | undefined {
    return this.entries.get(id);
  }

  list(): Deadline[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Deadline[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listOverdue(): Deadline[] {
    const now = new Date().toISOString();
    return this.list().filter(e =>
      e.due_date < now &&
      e.status !== 'completed' && e.status !== 'extended' &&
      e.status !== 'waived' && e.status !== 'archived'
    );
  }

  listDueWithin(daysAhead: number): Deadline[] {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() + daysAhead);
    return this.list().filter(e =>
      e.due_date >= now.toISOString() &&
      e.due_date <= cutoff.toISOString() &&
      e.status !== 'completed' && e.status !== 'archived'
    );
  }

  listByPractitioner(practitionerId: string): Deadline[] {
    return this.list().filter(e =>
      e.responsible_practitioner === practitionerId ||
      e.backup_practitioner === practitionerId
    );
  }

  listCritical(): Deadline[] {
    return this.list().filter(e =>
      e.consequence_of_miss === 'critical' &&
      e.status !== 'completed' && e.status !== 'archived'
    );
  }

  listByMatter(matterId: string): Deadline[] {
    return this.list().filter(e => e.associated_matter_id === matterId);
  }
}
