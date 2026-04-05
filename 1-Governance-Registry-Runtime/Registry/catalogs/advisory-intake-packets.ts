/**
 * Advisory Intake Packets Registry Catalog
 * Domain: Business Law Accounting
 * Trust Level: UNTRUSTED — produced by Voice Assist Layer (Iron Ear), requires review
 */

export interface AdvisoryIntakePacket {
  id: string;
  session_id: string;
  session_type: 'client_meeting' | 'internal_review' | 'opposing_counsel' | 'vendor_call' | 'court_proceeding' | 'general';
  transcript_envelope_id: string;
  participants: {
    participant_id: string | null;
    name: string;
    role: string;
  }[];
  duration_seconds: number;
  obligation_candidates: {
    candidate_id: string;
    description: string;
    obligor: string | null;
    obligee: string | null;
    due_date: string | null;
    confidence: number;
    source_segment: string;
  }[];
  deadline_candidates: {
    candidate_id: string;
    description: string;
    due_date: string | null;
    deadline_type: string;
    confidence: number;
    source_segment: string;
  }[];
  action_item_candidates: {
    candidate_id: string;
    description: string;
    suggested_assignee: string | null;
    suggested_due_date: string | null;
    confidence: number;
    source_segment: string;
  }[];
  entity_references: {
    entity_name: string;
    entity_type: string | null;
    mention_count: number;
    context_segments: string[];
  }[];
  routing_hints: {
    kernel: 'business' | 'law' | 'accounting';
    relevance_score: number;
    reason: string;
    related_candidates: string[];
  }[];
  language_normalization_ids: string[];
  privilege_flags: {
    attorney_client: boolean;
    work_product: boolean;
    joint_defense: boolean;
  };
  review_status: 'pending' | 'in_review' | 'partially_accepted' | 'fully_reviewed' | 'rejected';
  reviewed_by: string | null;
  review_date: string | null;
  accepted_candidates: string[];
  rejected_candidates: string[];
  deferred_candidates: string[];
  notes: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  source_kernel: 'business' | 'law' | 'accounting' | 'orchestrator';
  status: 'captured' | 'processed' | 'routed' | 'under_review' | 'reviewed' | 'archived';
}

export class AdvisoryIntakePacketCatalog {
  private entries: Map<string, AdvisoryIntakePacket> = new Map();

  register(entry: AdvisoryIntakePacket): void {
    this.entries.set(entry.id, entry);
  }

  lookup(id: string): AdvisoryIntakePacket | undefined {
    return this.entries.get(id);
  }

  list(): AdvisoryIntakePacket[] {
    return Array.from(this.entries.values());
  }

  listByKernel(kernel: string): AdvisoryIntakePacket[] {
    return this.list().filter(e => e.source_kernel === kernel);
  }

  listPendingReview(): AdvisoryIntakePacket[] {
    return this.list().filter(e => e.review_status === 'pending' || e.review_status === 'in_review');
  }

  listBySessionType(type: AdvisoryIntakePacket['session_type']): AdvisoryIntakePacket[] {
    return this.list().filter(e => e.session_type === type);
  }

  listPrivileged(): AdvisoryIntakePacket[] {
    return this.list().filter(e =>
      e.privilege_flags.attorney_client ||
      e.privilege_flags.work_product ||
      e.privilege_flags.joint_defense
    );
  }

  listWithHighConfidenceCandidates(threshold: number = 0.8): AdvisoryIntakePacket[] {
    return this.list().filter(e =>
      e.obligation_candidates.some(c => c.confidence >= threshold) ||
      e.deadline_candidates.some(c => c.confidence >= threshold) ||
      e.action_item_candidates.some(c => c.confidence >= threshold)
    );
  }

  countUnreviewedCandidates(): number {
    return this.list()
      .filter(e => e.review_status === 'pending')
      .reduce((sum, e) =>
        sum + e.obligation_candidates.length + e.deadline_candidates.length + e.action_item_candidates.length,
        0
      );
  }
}
