/**
 * Serialize Ghost State
 *
 * Serializes ghost layer state for replay persistence.
 * Ghost state is read-only -- serialization captures visibility and proposal IDs only.
 */

import type { SerializableGhostState } from '../lineage/replayStateContracts';

export interface GhostStateInput {
  visible: boolean;
  activeProposalIds: string[];
  selectedProposalId: string | null;
  /** Full proposal objects (excluded from serialization) */
  proposals?: unknown[];
}

export function serializeGhostState(input: GhostStateInput): SerializableGhostState {
  return {
    visible: input.visible,
    activeProposalIds: [...input.activeProposalIds],
    selectedProposalId: input.selectedProposalId,
  };
}

export function deserializeGhostState(
  serialized: SerializableGhostState
): GhostStateInput {
  return {
    visible: serialized.visible,
    activeProposalIds: [...serialized.activeProposalIds],
    selectedProposalId: serialized.selectedProposalId,
  };
}

export function validateGhostState(
  serialized: SerializableGhostState
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof serialized.visible !== 'boolean') {
    errors.push('visible must be a boolean');
  }

  if (!Array.isArray(serialized.activeProposalIds)) {
    errors.push('activeProposalIds must be an array');
  }

  if (
    serialized.selectedProposalId !== null &&
    !serialized.activeProposalIds.includes(serialized.selectedProposalId)
  ) {
    errors.push('selectedProposalId must be in activeProposalIds or null');
  }

  return { valid: errors.length === 0, errors };
}
