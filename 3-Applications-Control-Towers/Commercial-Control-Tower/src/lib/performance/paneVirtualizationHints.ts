/**
 * Pane Virtualization Hints
 *
 * Hints for virtualizing off-screen panes to conserve rendering budget.
 * Panes below a certain focus threshold can be virtualized (placeholder rendered
 * instead of full content tree).
 */

import type { FocusLevel } from '../badges/focusLabelMap';

export interface VirtualizationHint {
  paneId: string;
  shouldVirtualize: boolean;
  reason: string;
  placeholderHeight: number;
  restoreOnFocus: boolean;
}

/**
 * Focus levels at or below which virtualization is recommended.
 */
const VIRTUALIZABLE_LEVELS: Set<FocusLevel> = new Set([
  'BACKGROUND_AWARE',
  'QUIET',
]);

/**
 * Determine whether a pane should be virtualized based on focus and visibility.
 */
export function getVirtualizationHint(
  paneId: string,
  focusLevel: FocusLevel,
  isVisible: boolean,
  estimatedHeight: number
): VirtualizationHint {
  if (!isVisible) {
    return {
      paneId,
      shouldVirtualize: true,
      reason: 'Pane is off-screen',
      placeholderHeight: estimatedHeight,
      restoreOnFocus: true,
    };
  }

  if (VIRTUALIZABLE_LEVELS.has(focusLevel)) {
    return {
      paneId,
      shouldVirtualize: true,
      reason: `Focus level ${focusLevel} is below virtualization threshold`,
      placeholderHeight: estimatedHeight,
      restoreOnFocus: true,
    };
  }

  return {
    paneId,
    shouldVirtualize: false,
    reason: 'Pane is visible and above virtualization threshold',
    placeholderHeight: 0,
    restoreOnFocus: false,
  };
}

/**
 * Get virtualization hints for all panes.
 */
export function getPaneVirtualizationHints(
  panes: Array<{
    id: string;
    focusLevel: FocusLevel;
    isVisible: boolean;
    estimatedHeight: number;
  }>
): VirtualizationHint[] {
  return panes.map((pane) =>
    getVirtualizationHint(pane.id, pane.focusLevel, pane.isVisible, pane.estimatedHeight)
  );
}

/**
 * Count how many panes are currently virtualized.
 */
export function countVirtualizedPanes(hints: VirtualizationHint[]): number {
  return hints.filter((h) => h.shouldVirtualize).length;
}
