/**
 * Reduced Motion Rules
 *
 * Rules for prefers-reduced-motion media query compliance.
 * Reduced motion preserves badge clarity and focus clarity,
 * removes non-essential animation.
 */

export interface ReducedMotionRule {
  component: string;
  normalBehavior: string;
  reducedBehavior: string;
  essential: boolean;
}

export const REDUCED_MOTION_RULES: ReducedMotionRule[] = [
  {
    component: 'ReceiptPulseFeed',
    normalBehavior: 'Pulse animation on new receipt arrival',
    reducedBehavior: 'Instant highlight, no animation',
    essential: false,
  },
  {
    component: 'GhostBadgeStrip',
    normalBehavior: 'Fade-in transition for badge appearance',
    reducedBehavior: 'Instant render, no fade',
    essential: false,
  },
  {
    component: 'ConfidenceBadge',
    normalBehavior: 'Color transition on score update',
    reducedBehavior: 'Instant color change, badge remains clear',
    essential: true, // badge clarity is essential
  },
  {
    component: 'ViolationBadge',
    normalBehavior: 'Crimson pulse on CRITICAL violation',
    reducedBehavior: 'Static crimson border, no pulse. Visibility preserved.',
    essential: true, // violation visibility is essential
  },
  {
    component: 'OrchestrationSpine',
    normalBehavior: 'Stage transition animation',
    reducedBehavior: 'Instant stage highlight change',
    essential: false,
  },
  {
    component: 'ContextualStage',
    normalBehavior: 'Focus ring fade transition',
    reducedBehavior: 'Instant focus ring change. Ring width preserved.',
    essential: true, // focus clarity is essential
  },
  {
    component: 'IronEarMonitor',
    normalBehavior: 'Waveform bar animation',
    reducedBehavior: 'Static bar levels, no animation',
    essential: false,
  },
  {
    component: 'ReplayScrubber',
    normalBehavior: 'Smooth scrub transition',
    reducedBehavior: 'Instant position jump',
    essential: false,
  },
  {
    component: 'AttentionQueue',
    normalBehavior: 'Contained glow animation for advisory items',
    reducedBehavior: 'Static highlight, no glow animation',
    essential: false,
  },
  {
    component: 'CommandPalette',
    normalBehavior: 'Slide-in overlay animation',
    reducedBehavior: 'Instant overlay appearance',
    essential: false,
  },
];

/**
 * Returns the CSS media query for reduced motion detection.
 */
export function getReducedMotionMediaQuery(): string {
  return '@media (prefers-reduced-motion: reduce)';
}

/**
 * Returns rules for essential components that must preserve clarity
 * even in reduced motion mode.
 */
export function getEssentialMotionRules(): ReducedMotionRule[] {
  return REDUCED_MOTION_RULES.filter((rule) => rule.essential);
}

/**
 * Check if reduced motion is preferred (runtime detection).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
