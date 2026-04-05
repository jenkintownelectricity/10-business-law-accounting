/**
 * Calculate truth delta between doctrine state and current projected state.
 * Ghost Layer renders only divergence zones.
 */

export interface TruthDelta {
  field: string;
  doctrine_value: unknown;
  current_value: unknown;
  divergence_type: 'missing' | 'changed' | 'added' | 'violated';
  severity: 'info' | 'warning' | 'critical';
}

export function calculateTruthDelta(
  doctrineState: Record<string, unknown>,
  currentState: Record<string, unknown>,
): TruthDelta[] {
  const deltas: TruthDelta[] = [];

  for (const key of Object.keys(doctrineState)) {
    if (!(key in currentState)) {
      deltas.push({ field: key, doctrine_value: doctrineState[key], current_value: undefined, divergence_type: 'missing', severity: 'warning' });
    } else if (JSON.stringify(doctrineState[key]) !== JSON.stringify(currentState[key])) {
      deltas.push({ field: key, doctrine_value: doctrineState[key], current_value: currentState[key], divergence_type: 'changed', severity: 'info' });
    }
  }

  for (const key of Object.keys(currentState)) {
    if (!(key in doctrineState)) {
      deltas.push({ field: key, doctrine_value: undefined, current_value: currentState[key], divergence_type: 'added', severity: 'info' });
    }
  }

  return deltas;
}
