export const CONFIDENCE_BANDS = [
  { min: 0.9, label: 'HIGH', color: 'var(--color-accent-green)' },
  { min: 0.7, label: 'MEDIUM', color: 'var(--color-accent-amber)' },
  { min: 0, label: 'LOW', color: 'var(--color-accent-red)' },
] as const;

export type ConfidenceBand = (typeof CONFIDENCE_BANDS)[number];

export function getConfidenceBand(score: number): ConfidenceBand {
  return CONFIDENCE_BANDS.find(b => score >= b.min) || CONFIDENCE_BANDS[2];
}
