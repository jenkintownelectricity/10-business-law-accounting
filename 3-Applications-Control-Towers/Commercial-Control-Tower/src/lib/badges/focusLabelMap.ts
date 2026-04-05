/**
 * Focus Label Map
 *
 * Labels and colors for each focus state in the CCT workstation.
 * Focus hierarchy is operator-owned -- AI cannot escalate itself.
 */

export type FocusLevel =
  | 'PRIMARY_ACTIVE'
  | 'SECONDARY'
  | 'ADVISORY'
  | 'BACKGROUND_AWARE'
  | 'QUIET'
  | 'LOCKED_REVIEW';

export interface FocusLabelEntry {
  level: FocusLevel;
  label: string;
  shortLabel: string;
  color: string;
  backgroundColor: string;
  ringWidth: number;
  dimOpacity: number;
  description: string;
}

export const FOCUS_LABEL_MAP: Record<FocusLevel, FocusLabelEntry> = {
  PRIMARY_ACTIVE: {
    level: 'PRIMARY_ACTIVE',
    label: 'Primary Active',
    shortLabel: 'PRI',
    color: 'var(--color-focus-primary)',
    backgroundColor: 'var(--color-focus-primary-muted)',
    ringWidth: 2,
    dimOpacity: 1.0,
    description: 'Operator primary focus. Full rendering, full interaction.',
  },
  SECONDARY: {
    level: 'SECONDARY',
    label: 'Secondary',
    shortLabel: 'SEC',
    color: 'var(--color-focus-secondary)',
    backgroundColor: 'var(--color-focus-secondary-muted)',
    ringWidth: 1,
    dimOpacity: 0.85,
    description: 'Secondary focus. Visible and interactive but not dominant.',
  },
  ADVISORY: {
    level: 'ADVISORY',
    label: 'Advisory',
    shortLabel: 'ADV',
    color: 'var(--color-focus-advisory)',
    backgroundColor: 'var(--color-focus-advisory-muted)',
    ringWidth: 1,
    dimOpacity: 0.6,
    description: 'Advisory pane. AI suggestions land here. Cannot steal PRIMARY.',
  },
  BACKGROUND_AWARE: {
    level: 'BACKGROUND_AWARE',
    label: 'Background',
    shortLabel: 'BKG',
    color: 'var(--color-focus-background)',
    backgroundColor: 'var(--color-focus-background-muted)',
    ringWidth: 0,
    dimOpacity: 0.4,
    description: 'Background awareness. Minimal rendering, updates queued.',
  },
  QUIET: {
    level: 'QUIET',
    label: 'Quiet',
    shortLabel: 'QUI',
    color: 'var(--color-neutral-500)',
    backgroundColor: 'var(--color-neutral-900)',
    ringWidth: 0,
    dimOpacity: 0.25,
    description: 'Quiet mode. No advisory notifications. Only violations break through.',
  },
  LOCKED_REVIEW: {
    level: 'LOCKED_REVIEW',
    label: 'Locked Review',
    shortLabel: 'LCK',
    color: 'var(--color-focus-locked)',
    backgroundColor: 'var(--color-focus-locked-muted)',
    ringWidth: 3,
    dimOpacity: 1.0,
    description: 'Locked review. Focus cannot be changed until operator unlocks.',
  },
};

export function getFocusLabel(level: FocusLevel): FocusLabelEntry {
  return FOCUS_LABEL_MAP[level];
}

export function isPrimaryFocus(level: FocusLevel): boolean {
  return level === 'PRIMARY_ACTIVE';
}

export function canReceiveAdvisory(level: FocusLevel): boolean {
  return level !== 'QUIET' && level !== 'LOCKED_REVIEW';
}
