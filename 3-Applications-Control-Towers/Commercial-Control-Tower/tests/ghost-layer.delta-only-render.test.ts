/**
 * Ghost Layer: Delta-Only Render
 *
 * Verifies ghost layer renders only deltas (additions, removals, modifications),
 * not full-screen fog overlays.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ghost Layer: Delta-Only Rendering', () => {
  it('ghost-layer.css should define delta highlight classes', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-ghost-delta__added');
    expect(content).toContain('.cct-ghost-delta__removed');
    expect(content).toContain('.cct-ghost-delta__modified');
  });

  it('ghost overlay should NOT use full-screen backdrop opacity', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // Ghost overlays should not have high opacity backgrounds that obscure content
    // The --ghost-overlay-opacity token should be low (defined in theme)
    expect(content).toContain('var(--ghost-overlay-opacity)');

    // Should not have a full-screen blocking overlay
    expect(content).not.toMatch(/\.cct-ghost-layer\s*\{[^}]*background-color:\s*rgba\(\s*\d+,\s*\d+,\s*\d+,\s*0\.[5-9]/);
  });

  it('ghost wireframe should use border outlines, not filled backgrounds', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-ghost-wireframe');
    expect(content).toContain('border');
    expect(content).toContain('dashed');
  });

  it('ghost overlay should be positioned absolutely, not covering entire viewport', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // Ghost overlay uses position: absolute (within pane), not fixed (viewport)
    expect(content).toMatch(/\.cct-ghost-overlay\s*\{[^}]*position:\s*absolute/);
    expect(content).not.toMatch(/\.cct-ghost-overlay\s*\{[^}]*position:\s*fixed/);
  });

  it('ghost overlay should use pointer-events: none by default', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toMatch(/\.cct-ghost-overlay\s*\{[^}]*pointer-events:\s*none/);
  });

  it('delta highlights should have distinct visual treatment for add/remove/modify', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // Added = green indicator
    expect(content).toMatch(/\.cct-ghost-delta__added[^{]*\{[^}]*var\(--color-accent-green\)/);

    // Removed = red indicator
    expect(content).toMatch(/\.cct-ghost-delta__removed[^{]*\{[^}]*var\(--color-accent-red\)/);

    // Modified = amber indicator
    expect(content).toMatch(/\.cct-ghost-delta__modified[^{]*\{[^}]*var\(--color-accent-amber\)/);
  });
});
