/**
 * Ephemeral Routing
 * Routes ephemeral proposals to the attention queue based on source type and confidence.
 */

import { EphemeralProposal } from './ephemeralTypes';
import { QueueItemType, QueueItemUrgency, AttentionQueueItem } from '../focus/attentionQueueStore';

export interface RoutingDecision {
  queueItemType: QueueItemType;
  urgency: QueueItemUrgency;
  targetPane: string | undefined;
}

/**
 * Determine how an ephemeral proposal should be routed to the attention queue.
 */
export function routeProposal(proposal: EphemeralProposal): RoutingDecision {
  const queueItemType = mapSourceToQueueType(proposal.source_type);
  const urgency = determineUrgency(proposal);
  const targetPane = proposal.route_suggestion || undefined;

  return { queueItemType, urgency, targetPane };
}

/**
 * Map source type to queue item type.
 */
function mapSourceToQueueType(sourceType: EphemeralProposal['source_type']): QueueItemType {
  switch (sourceType) {
    case 'iron_ear':
      return 'ephemeral_proposal';
    case 'language_layer':
      return 'advisory';
    case 'ai_assistant':
      return 'advisory';
    case 'voice_command':
      return 'ephemeral_proposal';
    default:
      return 'ephemeral_proposal';
  }
}

/**
 * Determine urgency based on confidence and violation state.
 */
function determineUrgency(proposal: EphemeralProposal): QueueItemUrgency {
  if (proposal.violationState === 'CRITICAL') return 'critical';
  if (proposal.violationState === 'WARNING') return 'high';
  if (proposal.confidence >= 0.9) return 'high';
  if (proposal.confidence >= 0.7) return 'medium';
  return 'low';
}

/**
 * Convert an ephemeral proposal into an attention queue item payload.
 */
export function toQueueItem(
  proposal: EphemeralProposal,
  decision: RoutingDecision,
): Omit<AttentionQueueItem, 'created_at' | 'previewed' | 'dismissed'> {
  return {
    id: `queue_${proposal.id}`,
    type: decision.queueItemType,
    urgency: decision.urgency,
    title: `Proposal from ${proposal.source}`,
    summary: proposal.route_suggestion,
    source: proposal.source,
    confidence: proposal.confidence,
    target_pane: decision.targetPane,
    entity_id: proposal.id,
    entity_type: 'ephemeral_proposal',
  };
}
