/**
 * Focus Render Budget
 *
 * Defines render budgets to keep the CCT workstation performant.
 * Budgets are focus-level-aware: PRIMARY_ACTIVE gets full budget,
 * background panes get reduced allocation.
 */

import type { FocusLevel } from '../badges/focusLabelMap';

export interface RenderBudget {
  maxGhostOverlays: number;
  maxBadgeRenders: number;
  maxReceiptFeedItems: number;
  maxTimelineCards: number;
  enableAnimations: boolean;
  virtualizeOffscreen: boolean;
  updateIntervalMs: number;
}

export const RENDER_BUDGETS: Record<FocusLevel, RenderBudget> = {
  PRIMARY_ACTIVE: {
    maxGhostOverlays: 10,
    maxBadgeRenders: 50,
    maxReceiptFeedItems: 100,
    maxTimelineCards: 25,
    enableAnimations: true,
    virtualizeOffscreen: false,
    updateIntervalMs: 16, // ~60fps
  },
  SECONDARY: {
    maxGhostOverlays: 5,
    maxBadgeRenders: 25,
    maxReceiptFeedItems: 50,
    maxTimelineCards: 10,
    enableAnimations: true,
    virtualizeOffscreen: false,
    updateIntervalMs: 32, // ~30fps
  },
  ADVISORY: {
    maxGhostOverlays: 3,
    maxBadgeRenders: 15,
    maxReceiptFeedItems: 25,
    maxTimelineCards: 5,
    enableAnimations: false,
    virtualizeOffscreen: true,
    updateIntervalMs: 100,
  },
  BACKGROUND_AWARE: {
    maxGhostOverlays: 1,
    maxBadgeRenders: 10,
    maxReceiptFeedItems: 10,
    maxTimelineCards: 3,
    enableAnimations: false,
    virtualizeOffscreen: true,
    updateIntervalMs: 500,
  },
  QUIET: {
    maxGhostOverlays: 0,
    maxBadgeRenders: 5,
    maxReceiptFeedItems: 5,
    maxTimelineCards: 0,
    enableAnimations: false,
    virtualizeOffscreen: true,
    updateIntervalMs: 1000,
  },
  LOCKED_REVIEW: {
    maxGhostOverlays: 10,
    maxBadgeRenders: 50,
    maxReceiptFeedItems: 100,
    maxTimelineCards: 25,
    enableAnimations: true,
    virtualizeOffscreen: false,
    updateIntervalMs: 16,
  },
};

export function getRenderBudget(focusLevel: FocusLevel): RenderBudget {
  return RENDER_BUDGETS[focusLevel];
}

export function shouldVirtualize(focusLevel: FocusLevel): boolean {
  return RENDER_BUDGETS[focusLevel].virtualizeOffscreen;
}

export function getMaxGhostOverlays(focusLevel: FocusLevel): number {
  return RENDER_BUDGETS[focusLevel].maxGhostOverlays;
}
