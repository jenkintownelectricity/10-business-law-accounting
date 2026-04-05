/**
 * Focus: Single Primary Owner
 *
 * Verifies exactly one PRIMARY_ACTIVE pane at any time.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Focus: Single Primary Owner', () => {
  it('serialized focus state validation should reject multiple PRIMARY_ACTIVE panes', () => {
    const { validateFocusState } = require('../src/lib/replay/serializeFocusState');

    const invalidState = {
      primaryPaneId: 'pane-1',
      focusLevels: {
        'pane-1': 'PRIMARY_ACTIVE',
        'pane-2': 'PRIMARY_ACTIVE',
        'pane-3': 'SECONDARY',
      },
      quietMode: false,
      lockedPaneId: null,
    };

    const result = validateFocusState(invalidState);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e: string) => e.includes('PRIMARY_ACTIVE'))).toBe(true);
  });

  it('serialized focus state validation should accept exactly one PRIMARY_ACTIVE', () => {
    const { validateFocusState } = require('../src/lib/replay/serializeFocusState');

    const validState = {
      primaryPaneId: 'pane-1',
      focusLevels: {
        'pane-1': 'PRIMARY_ACTIVE',
        'pane-2': 'SECONDARY',
        'pane-3': 'ADVISORY',
      },
      quietMode: false,
      lockedPaneId: null,
    };

    const result = validateFocusState(validState);
    expect(result.valid).toBe(true);
  });

  it('focus label map should define PRIMARY_ACTIVE with strongest ring width', () => {
    const { FOCUS_LABEL_MAP } = require('../src/lib/badges/focusLabelMap');

    const primaryRing = FOCUS_LABEL_MAP.PRIMARY_ACTIVE.ringWidth;
    const secondaryRing = FOCUS_LABEL_MAP.SECONDARY.ringWidth;
    const advisoryRing = FOCUS_LABEL_MAP.ADVISORY.ringWidth;

    expect(primaryRing).toBeGreaterThan(secondaryRing);
    expect(primaryRing).toBeGreaterThan(advisoryRing);
  });

  it('focus label map should define PRIMARY_ACTIVE with full opacity', () => {
    const { FOCUS_LABEL_MAP } = require('../src/lib/badges/focusLabelMap');

    expect(FOCUS_LABEL_MAP.PRIMARY_ACTIVE.dimOpacity).toBe(1.0);
  });

  it('CSS should define primary pane with opacity 1', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/operator-focus.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toMatch(/\.cct-contextual-stage--primary_active[^{]*\{[^}]*opacity:\s*1/);
  });

  it('CommandDeckLayout should accept primaryPaneId prop', () => {
    const layoutPath = path.resolve(__dirname, '../src/components/workstation/CommandDeckLayout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf-8');

    expect(content).toContain('primaryPaneId');
    expect(content).toContain('data-primary-pane');
  });
});
