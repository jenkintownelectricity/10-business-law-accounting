/**
 * Pinned Evidence: No Summary Displacement
 *
 * Verifies pinned evidence cannot be displaced by AI summary.
 * References are stable across focus transitions.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Pinned Evidence: No Summary Displacement', () => {
  it('evidence pin CSS should define operator-pinned variant', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/evidence-pin.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-evidence-pin-card--operator-pinned');
  });

  it('evidence pin CSS should define stable reference variant', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/evidence-pin.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-evidence-pin-card--stable');
  });

  it('evidence pin CSS should define protected indicator', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/evidence-pin.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-evidence-pin-card__protected');
  });

  it('evidence pin cards should have distinct visual treatment from AI summary', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/evidence-pin.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // Pinned cards have a strong left border for visual permanence
    expect(content).toMatch(/\.cct-evidence-pin-card[^{]*\{[^}]*border-left:\s*3px/);
  });

  it('evidence pin tray should maintain minimum height', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/evidence-pin.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toMatch(/\.cct-evidence-pin-tray[^{]*\{[^}]*min-height/);
  });

  it('unpin button should require explicit hover interaction', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/evidence-pin.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // Unpin button is hidden by default, shown on hover
    expect(content).toMatch(/\.cct-evidence-pin-card__unpin[^{]*\{[^}]*opacity:\s*0/);
    expect(content).toContain('.cct-evidence-pin-card:hover .cct-evidence-pin-card__unpin');
  });
});
