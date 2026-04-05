/**
 * Serialize Pane Layout
 *
 * Serializes the current pane layout configuration for replay persistence.
 * Only serializable data -- no component references, no DOM nodes.
 */

import type { SerializablePaneLayout } from '../lineage/replayStateContracts';

export interface PaneLayoutInput {
  id: string;
  gridArea: string;
  label: string;
  visible: boolean;
  component?: unknown; // excluded from serialization
}

export function serializePaneLayout(
  panes: PaneLayoutInput[],
  gridTemplate: string
): SerializablePaneLayout {
  return {
    panes: panes.map((pane) => ({
      id: pane.id,
      gridArea: pane.gridArea,
      label: pane.label,
      visible: pane.visible,
    })),
    gridTemplate,
  };
}

export function deserializePaneLayout(
  serialized: SerializablePaneLayout
): { panes: Array<{ id: string; gridArea: string; label: string; visible: boolean }>; gridTemplate: string } {
  return {
    panes: serialized.panes.map((pane) => ({
      id: pane.id,
      gridArea: pane.gridArea,
      label: pane.label,
      visible: pane.visible,
    })),
    gridTemplate: serialized.gridTemplate,
  };
}

export function validatePaneLayout(serialized: SerializablePaneLayout): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!serialized.panes || !Array.isArray(serialized.panes)) {
    errors.push('panes must be an array');
  }

  if (typeof serialized.gridTemplate !== 'string') {
    errors.push('gridTemplate must be a string');
  }

  const ids = new Set<string>();
  for (const pane of serialized.panes) {
    if (!pane.id) errors.push('Each pane must have an id');
    if (ids.has(pane.id)) errors.push(`Duplicate pane id: ${pane.id}`);
    ids.add(pane.id);
    if (!pane.gridArea) errors.push(`Pane ${pane.id} missing gridArea`);
  }

  return { valid: errors.length === 0, errors };
}
