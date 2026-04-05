export interface LegalContract {
  id: string;
  title: string;
  parties: PartyIdentification[];
  contract_type: string;
  effective_date?: string;
  expiration_date?: string;
  signed: boolean;
  signed_date?: string;
  obligations: Obligation[];
  evidence_items: EvidenceItem[];
  status: 'draft' | 'under_review' | 'signed' | 'active' | 'expired' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface PartyIdentification {
  party_id: string;
  name: string;
  role: 'party_a' | 'party_b' | 'guarantor' | 'witness' | 'other';
  entity_id?: string;
  identified: boolean;
}

export interface Obligation {
  id: string;
  contract_id: string;
  description: string;
  obligated_party_id: string;
  due_date?: string;
  recurring: boolean;
  recurrence_schedule?: string;
  reviewed: boolean;
  status: 'pending' | 'in_progress' | 'fulfilled' | 'breached' | 'waived';
  created_at: string;
}

export interface LegalRisk {
  id: string;
  matter_id: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number;
  mitigation_strategy?: string;
  assessed: boolean;
  assessed_at?: string;
}

export interface ComplianceStatus {
  matter_id: string;
  jurisdiction: string;
  compliant: boolean;
  requirements_met: string[];
  requirements_pending: string[];
  last_checked: string;
}

export interface EvidenceItem {
  id: string;
  contract_id: string;
  description: string;
  evidence_type: 'document' | 'correspondence' | 'testimony' | 'record' | 'other';
  source: string;
  verified: boolean;
  added_at: string;
}

export interface LegalAssessment {
  kernel: 'law';
  matter_id: string;
  summary: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  obligations_extracted: Obligation[];
  compliance_status?: ComplianceStatus;
  legal_risks: LegalRisk[];
  recommendations: string[];
  constraints_evaluated: any[];
  assessed_at: string;
}
