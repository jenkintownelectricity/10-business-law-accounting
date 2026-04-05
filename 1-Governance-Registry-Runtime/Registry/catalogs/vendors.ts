/**
 * Vendors Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: SOVEREIGN — owned by Business Kernel
 */

export interface Vendor {
  id: string;
  name: string;
  type: 'service_provider' | 'supplier' | 'contractor' | 'consultant' | 'technology';
  contact_info: {
    email: string;
    phone: string;
    address: string;
    primary_contact_name: string;
  };
  tax_id: string | null;
  w9_on_file: boolean;
  insurance_verified: boolean;
  insurance_expiration: string | null;
  associated_contracts: string[];
  payment_terms: string;
  default_payment_method: 'ach' | 'check' | 'wire' | 'credit_card';
  ytd_spend: number;
  lifetime_spend: number;
  risk_rating: 'low' | 'medium' | 'high' | 'unrated';
  last_assessment_date: string | null;
  services_provided: string[];
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'active' | 'inactive' | 'pending_approval' | 'suspended' | 'archived';
}

export class VendorCatalog {
  private entries: Map<string, Vendor> = new Map();

  register(entry: Vendor): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): Vendor | undefined {
    return this.entries.get(id);
  }

  list(): Vendor[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): Vendor[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listByRiskRating(rating: Vendor['risk_rating']): Vendor[] {
    return this.list().filter(e => e.risk_rating === rating);
  }

  listByStatus(status: Vendor['status']): Vendor[] {
    return this.list().filter(e => e.status === status);
  }

  listRequiringInsuranceRenewal(): Vendor[] {
    const now = new Date().toISOString();
    return this.list().filter(e =>
      e.insurance_expiration !== null && e.insurance_expiration < now
    );
  }
}
