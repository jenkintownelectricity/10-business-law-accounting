/**
 * Serialize Focus State
 *
 * Serializes focus state for replay. Uses the serializable focus contracts.
 */

import type { SerializableFocusState } from '../lineage/replayStateContracts';
import type { FocusLevel } from '../badges/focusLabelMap';

export interface FocusStateInput {
  primaryPaneId: string;
  paneFocusLevels: Map<string, FocusLevel> | Record<string, FocusLevel>;
  quietMode: boolean;
  lockedPaneId: string | null;
}

export function serializeFocusState(input: FocusStateInput): SerializableFocusState {
  const focusLevels: Record<string, string> =
    input.paneFocusLevels instanceof Map
      ? Object.fromEntries(input.paneFocusLevels)
      : { ...input.paneFocusLevels };

  return {
    primaryPaneId: input.primaryPaneId,
    focusLevels,
    quietMode: input.quietMode,
    lockedPaneId: input.lockedPaneId,
  };
}

export function deserializeFocusState(
  serialized: SerializableFocusState
): FocusStateInput {
  return {
    primaryPaneId: serialized.primaryPaneId,
    paneFocusLevels: { ...serialized.focusLevels } as Record<string, FocusLevel>,
    quietMode: serialized.quietMode,
    lockedPaneId: serialized.lockedPaneId,
  };
}

export function validateFocusState(
  serialized: SerializableFocusState
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!serialized.primaryPaneId) {
    errors.push('primaryPaneId is required');
  }

  if (typeof serialized.quietMode !== 'boolean') {
    errors.push('quietMode must be a boolean');
  }

  // Verify primary pane is in focus levels
  if (serialized.primaryPaneId && serialized.focusLevels) {
    const primaryLevel = serialized.focusLevels[serialized.primaryPaneId];
    if (primaryLevel && primaryLevel !== 'PRIMARY_ACTIVE' && primaryLevel !== 'LOCKED_REVIEW') {
      errors.push('Primary pane must have PRIMARY_ACTIVE or LOCKED_REVIEW focus level');
    }
  }

  // Verify only one PRIMARY_ACTIVE
  const primaryCount = Object.values(serialized.focusLevels).filter(
    (level) => level === 'PRIMARY_ACTIVE'
  ).length;
  if (primaryCount > 1) {
    errors.push(`Expected at most 1 PRIMARY_ACTIVE, found ${primaryCount}`);
  }

  return { valid: errors.length === 0, errors };
}
