/**
 * Advisory Packet Routing
 * Domain: Business Law Accounting
 *
 * Routes advisory packets from voice/language layers to review queues.
 * Validates packet completeness, routes to review queue,
 * and ensures no sovereign action without practitioner review.
 */

export type KernelTarget = 'business' | 'law' | 'accounting';

export interface AdvisoryPacket {
  packet_id: string;
  packet_source: 'voice_assist' | 'language_intelligence' | 'iron_ear';
  session_id: string;
  trust_level: 'untrusted' | 'advisory';
  candidates: {
    candidate_id: string;
    candidate_type: 'obligation' | 'deadline' | 'action_item' | 'entity_reference' | 'normalization';
    description: string;
    confidence: number;
    suggested_kernel: KernelTarget;
    source_segment: string;
  }[];
  routing_hints: {
    kernel: KernelTarget;
    relevance: number;
  }[];
  language_normalization_id: string | null;
  created_at: string;
}

export interface PacketValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ReviewQueueEntry {
  queue_entry_id: string;
  packet_id: string;
  target_kernel: KernelTarget;
  candidates: string[];
  priority: 'high' | 'normal' | 'low';
  queued_at: string;
  status: 'queued' | 'assigned' | 'in_review' | 'completed';
}

export interface AdvisoryRoutingResult {
  success: boolean;
  packet_id: string;
  validation: PacketValidationResult;
  review_queue_entries: ReviewQueueEntry[];
  receipt_id: string;
  warnings: string[];
}

export class AdvisoryPacketRouter {
  /**
   * Validates and routes an advisory packet to the appropriate review queues.
   * Ensures no sovereign action occurs without practitioner review.
   */
  async routeAdvisoryPacket(packet: AdvisoryPacket): Promise<AdvisoryRoutingResult> {
    // Step 1: Validate packet completeness
    const validation = this.validatePacket(packet);

    if (!validation.valid) {
      return {
        success: false,
        packet_id: packet.packet_id,
        validation,
        review_queue_entries: [],
        receipt_id: '',
        warnings: validation.errors,
      };
    }

    // Step 2: Group candidates by target kernel
    const kernelGroups = this.groupCandidatesByKernel(packet);

    // Step 3: Create review queue entries for each kernel
    const reviewEntries: ReviewQueueEntry[] = [];
    for (const [kernel, candidateIds] of Object.entries(kernelGroups)) {
      if (candidateIds.length === 0) continue;

      const priority = this.determinePriority(
        packet.candidates.filter(c => candidateIds.includes(c.candidate_id))
      );

      reviewEntries.push({
        queue_entry_id: `queue-${kernel}-${packet.packet_id}-${Date.now()}`,
        packet_id: packet.packet_id,
        target_kernel: kernel as KernelTarget,
        candidates: candidateIds,
        priority,
        queued_at: new Date().toISOString(),
        status: 'queued',
      });
    }

    const receiptId = `receipt-advisory-route-${packet.packet_id}-${Date.now()}`;

    return {
      success: true,
      packet_id: packet.packet_id,
      validation,
      review_queue_entries: reviewEntries,
      receipt_id: receiptId,
      warnings: validation.warnings,
    };
  }

  /**
   * Validates that an advisory packet meets minimum completeness requirements.
   */
  private validatePacket(packet: AdvisoryPacket): PacketValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!packet.packet_id) {
      errors.push('Missing packet_id.');
    }
    if (!packet.session_id) {
      errors.push('Missing session_id.');
    }
    if (!packet.packet_source) {
      errors.push('Missing packet_source.');
    }
    if (packet.candidates.length === 0) {
      warnings.push('Packet contains no candidates. Nothing to route.');
    }

    // Validate trust level — must be untrusted or advisory
    if (packet.trust_level !== 'untrusted' && packet.trust_level !== 'advisory') {
      errors.push(`Invalid trust level: ${packet.trust_level}. Advisory packets must be 'untrusted' or 'advisory'.`);
    }

    // Validate each candidate
    for (const candidate of packet.candidates) {
      if (!candidate.candidate_id) {
        errors.push('Candidate missing candidate_id.');
      }
      if (!candidate.candidate_type) {
        errors.push(`Candidate ${candidate.candidate_id} missing candidate_type.`);
      }
      if (candidate.confidence < 0 || candidate.confidence > 1) {
        warnings.push(`Candidate ${candidate.candidate_id} has out-of-range confidence: ${candidate.confidence}.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Groups candidate IDs by their suggested target kernel.
   */
  private groupCandidatesByKernel(packet: AdvisoryPacket): Record<KernelTarget, string[]> {
    const groups: Record<KernelTarget, string[]> = {
      business: [],
      law: [],
      accounting: [],
    };

    for (const candidate of packet.candidates) {
      groups[candidate.suggested_kernel].push(candidate.candidate_id);
    }

    // Also consider routing hints for candidates without strong kernel suggestions
    for (const hint of packet.routing_hints) {
      if (hint.relevance > 0.5 && groups[hint.kernel].length === 0) {
        // Add unrouted candidates to this kernel if routing hint is strong
        const unrouted = packet.candidates
          .filter(c => !Object.values(groups).flat().includes(c.candidate_id))
          .map(c => c.candidate_id);
        groups[hint.kernel].push(...unrouted);
      }
    }

    return groups;
  }

  /**
   * Determines review priority based on candidate characteristics.
   */
  private determinePriority(candidates: AdvisoryPacket['candidates']): ReviewQueueEntry['priority'] {
    const hasHighConfidence = candidates.some(c => c.confidence >= 0.8);
    const hasDeadline = candidates.some(c => c.candidate_type === 'deadline');
    const hasObligation = candidates.some(c => c.candidate_type === 'obligation');

    if (hasDeadline && hasHighConfidence) return 'high';
    if (hasObligation && hasHighConfidence) return 'high';
    if (hasDeadline || hasObligation) return 'normal';
    return 'low';
  }
}
