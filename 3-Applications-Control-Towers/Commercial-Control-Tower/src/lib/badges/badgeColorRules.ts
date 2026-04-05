/**
 * Badge Color Rules
 *
 * Professional, muted palette for industrial-grade control tower UI.
 * All colors reference CSS custom properties from industrial-night theme.
 */

export type BadgeType =
  | 'confidence'
  | 'route'
  | 'source'
  | 'trustState'
  | 'violation'
  | 'focus';

export interface BadgeColorRule {
  background: string;
  foreground: string;
  border: string;
  borderStyle: 'solid' | 'dashed' | 'none';
}

export const CONFIDENCE_COLORS: Record<string, BadgeColorRule> = {
  HIGH: {
    background: 'var(--color-accent-green-muted)',
    foreground: 'var(--color-accent-green)',
    border: 'var(--color-accent-green)',
    borderStyle: 'solid',
  },
  MEDIUM: {
    background: 'var(--color-accent-amber-muted)',
    foreground: 'var(--color-accent-amber)',
    border: 'var(--color-accent-amber)',
    borderStyle: 'solid',
  },
  LOW: {
    background: 'var(--color-accent-red-muted)',
    foreground: 'var(--color-accent-red)',
    border: 'var(--color-accent-red)',
    borderStyle: 'solid',
  },
};

export const ROUTE_COLORS: Record<string, BadgeColorRule> = {
  Business: {
    background: 'var(--color-kernel-commercial-muted)',
    foreground: 'var(--color-kernel-commercial)',
    border: 'var(--color-kernel-commercial)',
    borderStyle: 'solid',
  },
  Law: {
    background: 'var(--color-kernel-law-muted)',
    foreground: 'var(--color-kernel-law)',
    border: 'var(--color-kernel-law)',
    borderStyle: 'solid',
  },
  Accounting: {
    background: 'var(--color-kernel-accounting-muted)',
    foreground: 'var(--color-kernel-accounting)',
    border: 'var(--color-kernel-accounting)',
    borderStyle: 'solid',
  },
  Orchestrator: {
    background: 'var(--color-accent-purple-muted)',
    foreground: 'var(--color-accent-purple)',
    border: 'var(--color-accent-purple)',
    borderStyle: 'solid',
  },
  Voice: {
    background: 'var(--color-voice-active-muted)',
    foreground: 'var(--color-voice-active)',
    border: 'var(--color-voice-active)',
    borderStyle: 'solid',
  },
  Language: {
    background: 'var(--color-accent-blue-muted)',
    foreground: 'var(--color-accent-blue)',
    border: 'var(--color-accent-blue)',
    borderStyle: 'solid',
  },
};

export const SOURCE_COLORS: Record<string, BadgeColorRule> = {
  'Iron Ear': {
    background: 'var(--color-source-ironear-muted)',
    foreground: 'var(--color-source-ironear)',
    border: 'var(--color-source-ironear)',
    borderStyle: 'solid',
  },
  'Language Layer': {
    background: 'var(--color-accent-blue-muted)',
    foreground: 'var(--color-accent-blue)',
    border: 'var(--color-accent-blue)',
    borderStyle: 'solid',
  },
  'AI Assistant': {
    background: 'var(--color-source-ai-muted)',
    foreground: 'var(--color-source-ai)',
    border: 'var(--color-source-ai)',
    borderStyle: 'solid',
  },
  'Voice Command': {
    background: 'var(--color-voice-active-muted)',
    foreground: 'var(--color-voice-active)',
    border: 'var(--color-voice-active)',
    borderStyle: 'solid',
  },
};

export const TRUST_STATE_COLORS: Record<string, BadgeColorRule> = {
  UNPROMOTED: {
    background: 'var(--color-accent-amber-muted)',
    foreground: 'var(--color-accent-amber)',
    border: 'var(--color-accent-amber)',
    borderStyle: 'dashed',
  },
  PROMOTED: {
    background: 'var(--color-accent-green-muted)',
    foreground: 'var(--color-accent-green)',
    border: 'var(--color-accent-green)',
    borderStyle: 'solid',
  },
  REJECTED: {
    background: 'var(--color-accent-red-muted)',
    foreground: 'var(--color-accent-red)',
    border: 'var(--color-accent-red)',
    borderStyle: 'solid',
  },
};

export const VIOLATION_COLORS: Record<string, BadgeColorRule> = {
  NONE: {
    background: 'transparent',
    foreground: 'transparent',
    border: 'transparent',
    borderStyle: 'none',
  },
  WARNING: {
    background: 'var(--color-accent-amber-muted)',
    foreground: 'var(--color-accent-amber)',
    border: 'var(--color-accent-amber)',
    borderStyle: 'solid',
  },
  CRITICAL: {
    background: 'var(--color-violation-crimson-muted)',
    foreground: 'var(--color-violation-crimson)',
    border: 'var(--color-violation-crimson)',
    borderStyle: 'solid',
  },
};

export const FOCUS_COLORS: Record<string, BadgeColorRule> = {
  PRIMARY_ACTIVE: {
    background: 'var(--color-focus-primary-muted)',
    foreground: 'var(--color-focus-primary)',
    border: 'var(--color-focus-primary)',
    borderStyle: 'solid',
  },
  SECONDARY: {
    background: 'var(--color-focus-secondary-muted)',
    foreground: 'var(--color-focus-secondary)',
    border: 'var(--color-focus-secondary)',
    borderStyle: 'solid',
  },
  ADVISORY: {
    background: 'var(--color-focus-advisory-muted)',
    foreground: 'var(--color-focus-advisory)',
    border: 'var(--color-focus-advisory)',
    borderStyle: 'dashed',
  },
  BACKGROUND_AWARE: {
    background: 'var(--color-focus-background-muted)',
    foreground: 'var(--color-focus-background)',
    border: 'var(--color-focus-background)',
    borderStyle: 'dashed',
  },
};

export function getBadgeColorRule(type: BadgeType, value: string): BadgeColorRule {
  const colorMaps: Record<BadgeType, Record<string, BadgeColorRule>> = {
    confidence: CONFIDENCE_COLORS,
    route: ROUTE_COLORS,
    source: SOURCE_COLORS,
    trustState: TRUST_STATE_COLORS,
    violation: VIOLATION_COLORS,
    focus: FOCUS_COLORS,
  };

  const map = colorMaps[type];
  return map[value] || {
    background: 'var(--color-neutral-800)',
    foreground: 'var(--color-neutral-300)',
    border: 'var(--color-neutral-600)',
    borderStyle: 'solid' as const,
  };
}
