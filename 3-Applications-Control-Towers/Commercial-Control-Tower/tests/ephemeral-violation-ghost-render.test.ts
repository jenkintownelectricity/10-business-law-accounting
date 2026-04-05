/**
 * Ephemeral: Violation Ghost Render
 *
 * Verifies violations render crimson wireframe immediately.
 * Violations must be visually prominent and never hidden.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ephemeral: Violation Ghost Render', () => {
  it('ghost-layer.css should define crimson wireframe for violations', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-ghost-wireframe--crimson');
    expect(content).toContain('var(--color-violation-crimson)');
  });

  it('ghost overlay should have violation variant', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ghost-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-ghost-overlay--violation');
    expect(content).toMatch(/\.cct-ghost-overlay--violation[^{]*\{[^}]*var\(--color-violation-crimson/);
  });

  it('violation badge should render CRITICAL with crimson color', () => {
    const badgeColorsPath = path.resolve(__dirname, '../src/lib/badges/badgeColorRules.ts');
    const content = fs.readFileSync(badgeColorsPath, 'utf-8');

    expect(content).toContain('CRITICAL');
    expect(content).toMatch(/CRITICAL[^}]*var\(--color-violation-crimson\)/);
  });

  it('ViolationBadge should return null for NONE state (hidden)', () => {
    const badgePath = path.resolve(__dirname, '../src/components/badges/ViolationBadge.tsx');
    const content = fs.readFileSync(badgePath, 'utf-8');

    expect(content).toContain("state === 'NONE'");
    expect(content).toContain('return null');
  });

  it('ViolationBadge should use role="alert" for accessibility', () => {
    const badgePath = path.resolve(__dirname, '../src/components/badges/ViolationBadge.tsx');
    const content = fs.readFileSync(badgePath, 'utf-8');

    expect(content).toContain('role="alert"');
  });

  it('ephemeral-layer.css should define violation variant with crimson border', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ephemeral-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-ephemeral-proposal--violation');
    expect(content).toMatch(/\.cct-ephemeral-proposal--violation[^{]*\{[^}]*var\(--color-violation-crimson\)/);
  });

  it('violation badge CSS should use crimson for critical', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/badge-system.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-badge--violation-critical');
    expect(content).toMatch(/\.cct-badge--violation-critical[^{]*\{[^}]*var\(--color-violation-crimson\)/);
  });
});
