export interface BusinessEntity {
  id: string;
  name: string;
  entity_type: 'individual' | 'corporation' | 'llc' | 'partnership' | 'trust' | 'other';
  tax_id?: string;
  jurisdiction?: string;
  contact_info?: ContactInfo;
  status: 'active' | 'inactive' | 'pending_verification';
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface VendorAssessment {
  vendor_id: string;
  vendor_name: string;
  verified: boolean;
  tax_id_present: boolean;
  constraint_result: string;
  assessment: string;
  assessed_at: string;
}

export interface CommercialMatter {
  id: string;
  title: string;
  description?: string;
  entity_id?: string;
  matter_type?: string;
  risk_score?: number;
  identified_risks?: BusinessRisk[];
  status: string;
}

export interface BusinessRisk {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  constraint_result: string;
  assessed_at: string;
  description?: string;
}

export interface BusinessAssessment {
  kernel: 'business';
  matter_id: string;
  summary: string;
  impact_level: 'high' | 'medium' | 'low';
  risks: BusinessRisk[];
  recommendations: string[];
  constraints_evaluated: any[];
  assessed_at: string;
}
