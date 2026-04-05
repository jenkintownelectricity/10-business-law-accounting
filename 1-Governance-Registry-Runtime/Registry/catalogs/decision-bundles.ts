/**
 * Decision Bundles Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — assembled by Commercial Orchestrator
 */

export interface DecisionBundle {
  id: string;
  matter_id: string;
  bundle_type: 'full_assessment' | 'partial_assessment' | 'expedited_review' | 'follow_up' | 'advisory_review';
  title: string;
  description: string;
  business_assessment: {
    kernel: 'business';
    risk_level: string;
    recommendation: string;
    constraints: string[];
    confidence: number;
  } | null;
  legal_assessment: {
    kernel: 'law';
    risk_level: string;
    recommendation: string;
    constraints: string[];
    confidence: number;
  } | null;
  accounting_assessment: {
    kernel: 'accounting';
    risk_level: string;
    recommendation: string;
    constraints: string[];
    confidence: number;
  } | null;
  combined_recommendation: string;
  combined_risk_level: 'low' | 'medium' | 'high' | 'critical';
  open_risks: {
    risk_id: string;
    description: string;
    severity: string;
    source_kernel: string;
  }[];
  unresolved_constraints: {
    constraint_id: string;
    description: string;
    source_kernel: string;
    resolution_action: string;
  }[];
  follow_up_actions: {
    action_id: string;
    description: string;
    assigned_kernel: string;
    assigned_practitioner: string | null;
    due_date: string | null;
    priority: string;
  }[];
  source_kernel_receipts: string[];
  advisory_support_receipts: string[];
  requesting_practitioner: string;
  reviewed_by: string | null;
  review_date: string | null;
  generated_at: string;
  generated_by_surface: string;
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'draft' | 'pending_review' | 'reviewed' | 'accepted' | 'rejected' | 'superseded' | 'archived';
}

export class DecisionBundleCatalog {
  private entries: Map<string, DecisionBundle> = new Map();

  register(entry: DecisionBundle): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): DecisionBundle | undefined {
    return this.entries.get(id);
  }

  list(): DecisionBundle[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): DecisionBundle[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByMatter(matterId: string): DecisionBundle[] {
    return this.list().filter(e => e.matter_id === matterId);
  }

  listPendingReview(): DecisionBundle[] {
    return this.list().filter(e => e.status === 'pending_review');
  }

  listByRiskLevel(level: DecisionBundle['combined_risk_level']): DecisionBundle[] {
    return this.list().filter(e => e.combined_risk_level === level);
  }

  listWithUnresolvedConstraints(): DecisionBundle[] {
    return this.list().filter(e => e.unresolved_constraints.length > 0 && e.status !== 'archived');
  }

  getLatestForMatter(matterId: string): DecisionBundle | undefined {
    const bundles = this.listByMatter(matterId);
    return bundles.sort((a, b) => b.generated_at.localeCompare(a.generated_at))[0];
  }
}
