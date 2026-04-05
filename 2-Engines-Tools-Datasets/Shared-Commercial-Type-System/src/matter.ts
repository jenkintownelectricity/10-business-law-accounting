/**
 * Matter Type
 * Domain: Business Law Accounting — Shared Commercial Type System
 *
 * Full matter definition used across all kernels and the orchestrator.
 */

import { ID, Timestamp, KernelName, KernelSource, Priority, RiskLevel, CurrencyCode, DomainObject } from './base';

export type MatterType =
  | 'litigation'
  | 'transactional'
  | 'advisory'
  | 'compliance'
  | 'tax'
  | 'corporate'
  | 'employment'
  | 'real_estate'
  | 'intellectual_property'
  | 'general';

export type MatterState =
  | 'draft'
  | 'intake'
  | 'under_review'
  | 'active'
  | 'on_hold'
  | 'resolved'
  | 'closed'
  | 'archived';

export type BillingType = 'hourly' | 'flat_fee' | 'contingency' | 'blended' | 'pro_bono';

export interface Matter extends DomainObject {
  title: string;
  description: string;
  matter_type: MatterType;
  assigned_kernels: KernelName[];
  priority: Priority;
  client_id: ID;
  responsible_practitioner: string;
  additional_practitioners: string[];
  opposing_parties: ID[];
  related_contracts: ID[];
  related_obligations: ID[];
  financial_exposure: number | null;
  currency: CurrencyCode;
  billing_type: BillingType;
  total_billed: number;
  total_collected: number;
  open_date: Timestamp;
  target_resolution_date: Timestamp | null;
  close_date: Timestamp | null;
  jurisdiction: string | null;
  court_case_number: string | null;
  internal_reference: string;
  risk_level: RiskLevel;
  notes: string;
  tags: string[];
  status: MatterState;
  source_kernel: KernelSource;
}
