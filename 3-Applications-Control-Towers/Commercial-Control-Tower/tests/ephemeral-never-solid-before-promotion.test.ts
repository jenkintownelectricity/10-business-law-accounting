/**
 * Ephemeral: Never Solid Before Promotion
 *
 * Verifies proposals start as PROPOSED/UNPROMOTED and never auto-solidify.
 * Trust state must be explicitly transitioned through VKBUS.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ephemeral: Never Solid Before Promotion', () => {
  it('ephemeral CSS should use dashed borders for unpromoted state', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ephemeral-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toMatch(/\.cct-ephemeral-proposal--unpromoted[^{]*\{[^}]*border-style:\s*dashed/);
  });

  it('ephemeral CSS should only use solid borders for promoted state', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ephemeral-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toMatch(/\.cct-ephemeral-proposal--promoted[^{]*\{[^}]*border-style:\s*solid/);
  });

  it('trust badge rules should define UNPROMOTED as dashed', () => {
    const rulesPath = path.resolve(__dirname, '../src/lib/badges/trustBadgeRules.ts');
    const content = fs.readFileSync(rulesPath, 'utf-8');

    expect(content).toContain("UNPROMOTED");
    expect(content).toMatch(/UNPROMOTED[^}]*borderStyle:\s*'dashed'/);
  });

  it('trust badge rules should define PROMOTED as solid', () => {
    const rulesPath = path.resolve(__dirname, '../src/lib/badges/trustBadgeRules.ts');
    const content = fs.readFileSync(rulesPath, 'utf-8');

    expect(content).toContain("PROMOTED");
    expect(content).toMatch(/PROMOTED[^}]*borderStyle:\s*'solid'/);
  });

  it('should not contain auto-solidify or auto-promote logic', () => {
    const searchDirs = [
      path.resolve(__dirname, '../src/lib'),
      path.resolve(__dirname, '../src/components'),
    ];

    const files: string[] = [];
    function walk(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    }
    searchDirs.forEach(walk);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/autoSolidify|auto[_-]?promote|auto[_-]?trust/i);
    }
  });

  it('ephemeral proposals should have reduced opacity when unpromoted', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/ephemeral-layer.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('var(--ephemeral-untrusted-opacity)');
  });
});
