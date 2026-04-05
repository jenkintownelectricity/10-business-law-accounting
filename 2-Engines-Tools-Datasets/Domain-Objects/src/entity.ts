// ──────────────────────────────────────────────────────────────
//  Domain Object: Entity
//  Represents clients, vendors, counterparties, and other
//  business entities with contact info, classification, and
//  financial standing.
// ──────────────────────────────────────────────────────────────

import type { TrustLevel } from './matter.js';

export type EntityType =
  | 'client'
  | 'vendor'
  | 'counterparty'
  | 'partner'
  | 'subsidiary'
  | 'regulator'
  | 'government_agency'
  | 'individual'
  | 'internal';

export type EntityStatus = 'active' | 'inactive' | 'suspended' | 'under_review' | 'archived';

export type FinancialStanding = 'good' | 'cautionary' | 'delinquent' | 'default' | 'unknown';

export interface ContactInfo {
  primary_email?: string;
  secondary_email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
  address: Address | null;
}

export interface Address {
  line_1: string;
  line_2?: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

export interface EntityFinancials {
  financial_standing: FinancialStanding;
  credit_limit?: number;
  outstanding_receivables: number;
  outstanding_payables: number;
  currency: string;
  payment_terms?: string;
  tax_id?: string;
  bank_details_on_file: boolean;
}

export interface EntityRelationship {
  related_entity_id: string;
  relationship_type: 'parent' | 'subsidiary' | 'affiliate' | 'partner' | 'agent';
  since: string;
  notes?: string;
}

export interface Entity {
  id: string;
  name: string;
  legal_name?: string;
  entity_type: EntityType;
  status: EntityStatus;
  contact_info: ContactInfo;
  financials: EntityFinancials;
  relationships: EntityRelationship[];
  associated_matter_ids: string[];
  associated_contract_ids: string[];
  tags: string[];
  trust_level: TrustLevel;
  jurisdiction?: string;
  incorporation_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}
