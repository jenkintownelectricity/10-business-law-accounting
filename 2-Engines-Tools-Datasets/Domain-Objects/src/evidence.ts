// ──────────────────────────────────────────────────────────────
//  Domain Object: Evidence
//  Tracks documents, recordings, and artifacts that support
//  matters, decisions, obligations, and compliance records.
// ──────────────────────────────────────────────────────────────

import type { TrustLevel } from './matter.js';

export type EvidenceType =
  | 'document'
  | 'contract'
  | 'invoice'
  | 'correspondence'
  | 'recording'
  | 'transcript'
  | 'photograph'
  | 'financial_record'
  | 'regulatory_filing'
  | 'court_document'
  | 'expert_report'
  | 'internal_memo'
  | 'digital_artifact'
  | 'other';

export type EvidenceSource =
  | 'upload'
  | 'email'
  | 'voice_capture'
  | 'system_generated'
  | 'third_party'
  | 'regulatory'
  | 'court'
  | 'manual_entry';

export type ReviewStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'requires_redaction';

export interface EvidenceFingerprint {
  algorithm: 'sha256' | 'sha512' | 'md5';
  hash: string;
  computed_at: string;
}

export interface EvidenceLink {
  linked_type: 'matter' | 'contract' | 'obligation' | 'decision_bundle' | 'invoice' | 'accounting_event' | 'entity';
  linked_id: string;
  relationship: 'primary' | 'supporting' | 'contradicting' | 'contextual';
  added_at: string;
  added_by: string;
}

export interface ChainOfCustodyEntry {
  action: 'created' | 'accessed' | 'modified' | 'transferred' | 'archived' | 'destroyed';
  actor: string;
  timestamp: string;
  notes?: string;
}

export interface Evidence {
  id: string;
  title: string;
  description: string;
  evidence_type: EvidenceType;
  source: EvidenceSource;
  source_details?: string;
  file_path?: string;
  file_size_bytes?: number;
  mime_type?: string;
  fingerprint: EvidenceFingerprint | null;
  trust_level: TrustLevel;
  review_status: ReviewStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  links: EvidenceLink[];
  chain_of_custody: ChainOfCustodyEntry[];
  retention_policy?: string;
  expiration_date?: string;
  redacted: boolean;
  tags: string[];
  metadata: Record<string, string>;
  created_at: string;
  updated_at: string;
  created_by: string;
}
