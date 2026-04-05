// ──────────────────────────────────────────────────────────────
//  AdvisoryRoutingService — Advisory Packet Routing
//  Routes advisory packets from voice, language, and listening
//  layers to the review queue. Validates packet completeness,
//  assigns to review queue, and tracks outcomes.
//  All operations emit receipts.
// ──────────────────────────────────────────────────────────────

import type {
  AdvisoryIntakePacket,
  AdvisorySourceType,
  AdvisoryReviewStatus,
  KernelDomain,
} from '../../../2-Engines-Tools-Datasets/Domain-Objects/src/index.js';

import type { Receipt } from '../../Registry/catalogs/receipts.js';

// ── Types ──────────────────────────────────────────────────────

export interface RoutePacketRequest {
  packet: AdvisoryIntakePacket;
  routed_by: string;
  override_kernel?: KernelDomain;
  priority_override?: 'critical' | 'high' | 'medium' | 'low';
}

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
  completeness_score: number;
}

export interface RoutingOutcome {
  packet_id: string;
  routed_to_review_queue: boolean;
  review_item_id: string;
  assigned_kernel: KernelDomain | null;
  priority: string;
  validation: ValidationResult;
  receipt: Receipt;
}

export interface AdvisoryOutcomeRecord {
  packet_id: string;
  outcome: 'approved' | 'rejected' | 'modified_and_approved' | 'pending';
  promoted_objects: { type: string; id: string }[];
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  receipt?: Receipt;
}

// ── Service Implementation ─────────────────────────────────────

export class AdvisoryRoutingService {
  private routedPackets: Map<string, AdvisoryIntakePacket> = new Map();
  private outcomes: Map<string, AdvisoryOutcomeRecord> = new Map();
  private receiptSequence = 0;

  // ── Route Advisory Packet ──────────────────────────────────

  async routeAdvisoryPacket(request: RoutePacketRequest): Promise<ServiceResult<RoutingOutcome>> {
    const { packet } = request;

    // Validate completeness first
    const validation = this.validatePacketCompletenessSync(packet);

    if (validation.errors.length > 0) {
      const receipt = this.emitReceipt({
        operation: 'advisory.routing_failed',
        description: `Advisory packet ${packet.id} failed validation: ${validation.errors.join('; ')}`,
        actor: request.routed_by,
        target_id: packet.id,
        target_type: 'advisory_packet',
      });
      return {
        success: false,
        error: `Packet validation failed: ${validation.errors.join('; ')}`,
        receipt,
      };
    }

    // Apply overrides
    if (request.override_kernel) {
      packet.routing_suggestion = request.override_kernel;
    }

    // Store the packet
    this.routedPackets.set(packet.id, packet);

    // Create review item reference
    const reviewItemId = `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Determine priority
    const priority = request.priority_override ?? this.determinePriority(packet);

    const receipt = this.emitReceipt({
      operation: 'advisory.packet_routed',
      description: `Advisory packet routed to review queue. Kernel: ${packet.routing_suggestion ?? 'none'}, Priority: ${priority}, Completeness: ${(validation.completeness_score * 100).toFixed(0)}%`,
      actor: request.routed_by,
      target_id: packet.id,
      target_type: 'advisory_packet',
    });

    // Initialize outcome tracking
    this.outcomes.set(packet.id, {
      packet_id: packet.id,
      outcome: 'pending',
      promoted_objects: [],
    });

    return {
      success: true,
      data: {
        packet_id: packet.id,
        routed_to_review_queue: true,
        review_item_id: reviewItemId,
        assigned_kernel: packet.routing_suggestion,
        priority,
        validation,
        receipt,
      },
      receipt,
    };
  }

  // ── Validate Packet Completeness ───────────────────────────

  async validatePacketCompleteness(packetId: string): Promise<ServiceResult<ValidationResult>> {
    const packet = this.routedPackets.get(packetId);
    if (!packet) {
      return { success: false, error: `Advisory packet ${packetId} not found` };
    }
    return { success: true, data: this.validatePacketCompletenessSync(packet) };
  }

  // ── Assign to Review Queue ─────────────────────────────────

  async assignToReviewQueue(
    packetId: string,
    targetKernel: KernelDomain | null,
    assignedBy: string
  ): Promise<ServiceResult<{ packet_id: string; review_item_id: string; receipt: Receipt }>> {
    const packet = this.routedPackets.get(packetId);
    if (!packet) {
      return { success: false, error: `Advisory packet ${packetId} not found` };
    }

    if (targetKernel) {
      packet.routing_suggestion = targetKernel;
    }

    const reviewItemId = `review_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const receipt = this.emitReceipt({
      operation: 'advisory.assigned_to_review',
      description: `Advisory packet ${packetId} assigned to review queue. Target kernel: ${targetKernel ?? 'unassigned'}`,
      actor: assignedBy,
      target_id: packetId,
      target_type: 'advisory_packet',
    });

    return {
      success: true,
      data: { packet_id: packetId, review_item_id: reviewItemId, receipt },
      receipt,
    };
  }

  // ── Track Advisory Outcome ─────────────────────────────────

  async trackAdvisoryOutcome(
    packetId: string,
    outcome: AdvisoryOutcomeRecord['outcome'],
    details: {
      promoted_objects?: { type: string; id: string }[];
      reviewed_by: string;
      notes?: string;
    }
  ): Promise<ServiceResult<AdvisoryOutcomeRecord>> {
    const packet = this.routedPackets.get(packetId);
    if (!packet) {
      return { success: false, error: `Advisory packet ${packetId} not found` };
    }

    const now = new Date().toISOString();
    const record: AdvisoryOutcomeRecord = {
      packet_id: packetId,
      outcome,
      promoted_objects: details.promoted_objects ?? [],
      reviewed_by: details.reviewed_by,
      reviewed_at: now,
      notes: details.notes,
    };

    this.outcomes.set(packetId, record);

    // Update packet review status
    const statusMap: Record<string, AdvisoryReviewStatus> = {
      approved: 'approved',
      rejected: 'rejected',
      modified_and_approved: 'partially_approved',
      pending: 'pending_review',
    };
    packet.review_status = statusMap[outcome] ?? 'pending_review';
    packet.reviewed_by = details.reviewed_by;
    packet.reviewed_at = now;
    packet.updated_at = now;

    const receipt = this.emitReceipt({
      operation: 'advisory.outcome_tracked',
      description: `Advisory outcome: ${outcome}. Promoted: ${record.promoted_objects.length} objects`,
      actor: details.reviewed_by,
      target_id: packetId,
      target_type: 'advisory_packet',
    });

    return { success: true, data: record, receipt };
  }

  // ── Internal Helpers ───────────────────────────────────────

  private validatePacketCompletenessSync(packet: AdvisoryIntakePacket): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    let completenessScore = 0;
    let maxScore = 0;

    // Required fields
    maxScore += 1;
    if (packet.id) completenessScore += 1;
    else errors.push('Missing packet id');

    maxScore += 1;
    if (packet.source_type) completenessScore += 1;
    else errors.push('Missing source_type');

    maxScore += 1;
    if (packet.source_session_id) completenessScore += 1;
    else errors.push('Missing source_session_id');

    maxScore += 1;
    if (packet.content && packet.content.length > 0) completenessScore += 1;
    else errors.push('Missing or empty content');

    maxScore += 1;
    if (packet.content_summary && packet.content_summary.length > 0) completenessScore += 1;
    else warnings.push('Missing content_summary');

    // Advisory fields
    maxScore += 1;
    if (packet.routing_suggestion) completenessScore += 1;
    else warnings.push('No routing suggestion — will need manual kernel assignment');

    maxScore += 1;
    if (packet.candidate_actions.length > 0) completenessScore += 1;
    else warnings.push('No candidate actions extracted');

    // Trust boundary check
    if (packet.trust_level !== 'UNTRUSTED') {
      errors.push('Advisory packet trust_level must be UNTRUSTED');
    }

    if (!packet.review_required) {
      errors.push('Advisory packet must have review_required = true');
    }

    // Routing confidence
    maxScore += 1;
    if (packet.routing_confidence > 0.5) completenessScore += 1;
    else if (packet.routing_confidence > 0) {
      completenessScore += 0.5;
      warnings.push(`Low routing confidence: ${packet.routing_confidence}`);
    }

    return {
      valid: errors.length === 0,
      warnings,
      errors,
      completeness_score: maxScore > 0 ? completenessScore / maxScore : 0,
    };
  }

  private determinePriority(packet: AdvisoryIntakePacket): string {
    // Escalate priority based on candidate action count and confidence
    const actionCount = packet.candidate_actions.length;
    const avgConfidence = actionCount > 0
      ? packet.candidate_actions.reduce((sum, a) => sum + a.confidence, 0) / actionCount
      : 0;

    if (actionCount >= 5 || packet.flags.length > 0) return 'high';
    if (actionCount >= 3 && avgConfidence > 0.7) return 'medium';
    if (actionCount > 0) return 'medium';
    return 'low';
  }

  private emitReceipt(params: {
    operation: string;
    description: string;
    actor: string;
    target_id: string;
    target_type: string;
  }): Receipt {
    this.receiptSequence++;
    const now = new Date().toISOString();
    return {
      id: `rcpt_${Date.now()}_${this.receiptSequence}`,
      receipt_type: 'advisory_intake',
      operation: params.operation,
      description: params.description,
      actor: params.actor,
      actor_type: 'runtime',
      target_id: params.target_id,
      target_type: params.target_type,
      source_kernel: 'orchestrator',
      previous_state: null,
      new_state: null,
      payload_hash: `sha256_${Date.now()}`,
      parent_receipt_id: null,
      related_receipt_ids: [],
      timestamp: now,
      replay_sequence: this.receiptSequence,
      idempotency_key: `${params.operation}_${params.target_id}_${this.receiptSequence}`,
      notes: '',
      created_at: now,
      updated_at: now,
      status: 'emitted',
    };
  }
}
