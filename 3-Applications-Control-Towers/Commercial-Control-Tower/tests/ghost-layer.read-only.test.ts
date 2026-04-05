/**
 * Ghost Layer Read-Only Test
 *
 * Verifies that ghost components have no mutation paths:
 * no setState for domain data, no vkbus calls from ghost layer.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ghost Layer: Read-Only Enforcement', () => {
  const ghostComponentDir = path.resolve(__dirname, '../src/components/lineage');
  const ghostStylePath = path.resolve(__dirname, '../src/styles/ghost-layer.css');

  function getGhostComponentFiles(): string[] {
    const componentDirs = [
      path.resolve(__dirname, '../src/components/lineage'),
      path.resolve(__dirname, '../src/components/badges'),
    ];
    const files: string[] = [];
    for (const dir of componentDirs) {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir)
          .filter((f) => f.endsWith('.tsx'))
          .forEach((f) => files.push(path.join(dir, f)));
      }
    }
    return files;
  }

  it('should not contain setState calls for domain data in ghost components', () => {
    const files = getGhostComponentFiles();
    expect(files.length).toBeGreaterThan(0);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Ghost components should not use setState for domain data
      // Local UI state (e.g., hover) is acceptable
      const domainSetStatePattern = /setState\s*\(\s*\{[^}]*(?:entity|receipt|proposal|kernel|workflow|domain)/g;
      const matches = content.match(domainSetStatePattern);
      expect(matches).toBeNull();
    }
  });

  it('should not import vkbus client in ghost components', () => {
    const files = getGhostComponentFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/import.*vkbus[Cc]lient/);
      expect(content).not.toMatch(/import.*from.*['"].*vkbus['"]/);
    }
  });

  it('should not contain direct fetch/API calls in ghost components', () => {
    const files = getGhostComponentFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/\bfetch\s*\(/);
      expect(content).not.toMatch(/axios\./);
      expect(content).not.toMatch(/\.post\s*\(/);
      expect(content).not.toMatch(/\.put\s*\(/);
      expect(content).not.toMatch(/\.delete\s*\(/);
    }
  });

  it('should not contain dispatch calls for domain actions in ghost components', () => {
    const files = getGhostComponentFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/dispatch\s*\(\s*\{[^}]*type:\s*['"](?:CREATE|UPDATE|DELETE|EXECUTE|MUTATE)/);
    }
  });

  it('should use pointer-events: none in ghost layer CSS', () => {
    if (fs.existsSync(ghostStylePath)) {
      const content = fs.readFileSync(ghostStylePath, 'utf-8');
      expect(content).toContain('pointer-events: none');
    }
  });

  it('ghost components should only accept read-only props (no mutation callbacks for domain data)', () => {
    const files = getGhostComponentFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Should not have props like onMutate, onUpdate, onSave for domain data
      expect(content).not.toMatch(/onMutate|onSave|onExecute|onWrite/);
    }
  });
});
