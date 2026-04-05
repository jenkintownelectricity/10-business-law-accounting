/**
 * Doctrine Overlay Selectors
 * Read-only selectors for doctrine state used by Ghost Layer components.
 */

import { TruthDelta } from './calculateTruthDelta';

export interface DoctrineRecord {
  entity_id: string;
  entity_type: string;
  fields: Record<string, unknown>;
  constraints: DoctrineConstraint[];
}

export interface DoctrineConstraint {
  field: string;
  rule: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface DoctrineState {
  records: Map<string, DoctrineRecord>;
}

/**
 * Get the doctrine record for a specific entity.
 */
export function getDoctrineForEntity(
  state: DoctrineState,
  entityId: string,
): DoctrineRecord | undefined {
  return state.records.get(entityId);
}

/**
 * Get all truth deltas relevant to a specific pane.
 * Filters deltas by entity IDs assigned to the given pane.
 */
export function getDeltasForPane(
  deltas: TruthDelta[],
  paneEntityIds: string[],
  allDeltas: Map<string, TruthDelta[]>,
): TruthDelta[] {
  const result: TruthDelta[] = [];
  for (const entityId of paneEntityIds) {
    const entityDeltas = allDeltas.get(entityId);
    if (entityDeltas) {
      result.push(...entityDeltas);
    }
  }
  return result;
}

/**
 * Get only violation-level deltas for a pane.
 */
export function getViolationsForPane(
  paneEntityIds: string[],
  allDeltas: Map<string, TruthDelta[]>,
): TruthDelta[] {
  const paneDeltas = getDeltasForPane([], paneEntityIds, allDeltas);
  return paneDeltas.filter(
    (d) => d.divergence_type === 'violated' || d.severity === 'critical',
  );
}

/**
 * Check if there is any active delta for a given entity.
 */
export function hasActiveDelta(
  entityId: string,
  allDeltas: Map<string, TruthDelta[]>,
): boolean {
  const deltas = allDeltas.get(entityId);
  return deltas !== undefined && deltas.length > 0;
}
