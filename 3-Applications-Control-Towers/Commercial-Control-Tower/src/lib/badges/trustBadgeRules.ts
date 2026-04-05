/**
 * Trust Badge Rules
 *
 * Defines rendering rules for trust state badges in the CCT.
 * Trust state is a core governance signal -- never decorative.
 */

export type TrustState = 'UNPROMOTED' | 'PROMOTED' | 'REJECTED';

export interface TrustBadgeRule {
  state: TrustState;
  label: string;
  borderStyle: 'solid' | 'dashed';
  color: string;
  backgroundColor: string;
  icon: string;
  ariaLabel: string;
  tooltip: string;
}

export const TRUST_BADGE_RULES: Record<TrustState, TrustBadgeRule> = {
  UNPROMOTED: {
    state: 'UNPROMOTED',
    label: 'UNPROMOTED',
    borderStyle: 'dashed',
    color: 'var(--color-accent-amber)',
    backgroundColor: 'var(--color-accent-amber-muted)',
    icon: '◌',
    ariaLabel: 'Trust state: unpromoted proposal',
    tooltip: 'This item has not been promoted. It remains an untrusted proposal.',
  },
  PROMOTED: {
    state: 'PROMOTED',
    label: 'PROMOTED',
    borderStyle: 'solid',
    color: 'var(--color-accent-green)',
    backgroundColor: 'var(--color-accent-green-muted)',
    icon: '●',
    ariaLabel: 'Trust state: promoted and trusted',
    tooltip: 'This item has been explicitly promoted through VKBUS and is trusted.',
  },
  REJECTED: {
    state: 'REJECTED',
    label: 'REJECTED',
    borderStyle: 'solid',
    color: 'var(--color-accent-red)',
    backgroundColor: 'var(--color-accent-red-muted)',
    icon: '✕',
    ariaLabel: 'Trust state: rejected',
    tooltip: 'This item was explicitly rejected by the operator.',
  },
};

export function getTrustBadgeRule(state: TrustState): TrustBadgeRule {
  return TRUST_BADGE_RULES[state];
}

export function isTrusted(state: TrustState): boolean {
  return state === 'PROMOTED';
}

export function requiresAttention(state: TrustState): boolean {
  return state === 'UNPROMOTED';
}
