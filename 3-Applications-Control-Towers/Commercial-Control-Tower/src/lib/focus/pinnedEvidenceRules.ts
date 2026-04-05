/**
 * Pinned Evidence Rules
 *
 * RULE 1: Summaries cannot displace pinned evidence.
 *   - AI-generated summaries, aggregations, or condensed views may NOT
 *     replace or hide pinned raw evidence.
 *   - Pinned evidence always renders in SECONDARY_CONTEXT regardless of
 *     what summaries are generated.
 *
 * RULE 2: Pinned references must be stable across focus transitions.
 *   - When the operator changes PRIMARY_ACTIVE focus, pinned evidence
 *     references remain valid and accessible.
 *   - Content references must resolve consistently across sessions.
 *
 * RULE 3: Replay-safe serialization required.
 *   - All pinned evidence must be serializable to a stable format.
 *   - Serialized pins can be replayed to reconstruct the pinned state.
 *   - Serialization format must include entity_id, entity_type, content_ref,
 *     and pinned_at timestamp.
 */

export interface PinnedEvidenceRuleSet {
  /** AI summaries cannot displace pinned evidence */
  readonly summaries_can_displace: false;
  /** Pinned refs remain stable across focus transitions */
  readonly stable_across_focus: true;
  /** Replay-safe serialization is required */
  readonly replay_safe_serialization: true;
  /** Pinned evidence renders as SECONDARY_CONTEXT */
  readonly render_context: 'SECONDARY_CONTEXT';
  /** Only the operator who pinned may unpin (or admin) */
  readonly unpin_requires_authority: true;
}

export const PINNED_EVIDENCE_RULES: PinnedEvidenceRuleSet = {
  summaries_can_displace: false,
  stable_across_focus: true,
  replay_safe_serialization: true,
  render_context: 'SECONDARY_CONTEXT',
  unpin_requires_authority: true,
} as const;

export interface PinnedEvidenceSerializable {
  pin_id: string;
  entity_id: string;
  entity_type: string;
  label: string;
  content_ref: string;
  pinned_at: string;
  pinned_by: string;
}

export function serializePinnedEvidence(pin: PinnedEvidenceSerializable): string {
  return JSON.stringify(pin);
}

export function deserializePinnedEvidence(data: string): PinnedEvidenceSerializable {
  return JSON.parse(data) as PinnedEvidenceSerializable;
}
