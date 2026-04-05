/**
 * Entities Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — owned by Business Kernel
 */

export interface Entity {
  id: string;
  legal_name: string;
  dba_names: string[];
  entity_type: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship' | 'trust' | 'estate' | 'nonprofit' | 'government' | 'joint_venture';
  jurisdiction_of_formation: string;
  formation_date: string;
  ein: string | null;
  state_id: string | null;
  registered_agent: string | null;
  principal_office_address: string;
  mailing_address: string;
  officers: {
    name: string;
    title: string;
    appointed_date: string;
  }[];
  ownership_structure: {
    owner_name: string;
    ownership_percentage: number;
    owner_type: 'individual' | 'entity';
  }[];
  parent_entity_id: string | null;
  subsidiary_entity_ids: string[];
  annual_filing_requirements: {
    filing_type: string;
    jurisdiction: string;
    due_date_pattern: string;
  }[];
  good_standing: boolean;
  last_annual_report_date: string | null;
  associated_client_id: string | null;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'active' | 'inactive' | 'dissolved' | 'suspended' | 'pending_formation' | 'archived';
}

export class EntityCatalog {
  private entries: Map<string, Entity> = new Map();

  register(entry: Entity): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Entity | undefined {
    return this.entries.get(id);
  }

  list(): Entity[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Entity[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByType(type: Entity['entity_type']): Entity[] {
    return this.list().filter(e => e.entity_type === type);
  }

  listByJurisdiction(jurisdiction: string): Entity[] {
    return this.list().filter(e => e.jurisdiction_of_formation === jurisdiction);
  }

  listNotInGoodStanding(): Entity[] {
    return this.list().filter(e => !e.good_standing && e.status === 'active');
  }

  listSubsidiaries(parentId: string): Entity[] {
    return this.list().filter(e => e.parent_entity_id === parentId);
  }

  findByName(name: string): Entity[] {
    const lower = name.toLowerCase();
    return this.list().filter(e =>
      e.legal_name.toLowerCase().includes(lower) ||
      e.dba_names.some(d => d.toLowerCase().includes(lower))
    );
  }
}
