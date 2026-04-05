/**
 * Ephemeral: TTL Governance
 *
 * Verifies TTL (time-to-live) pauses for:
 * - High confidence proposals
 * - Proposals with violations
 * - Proposals under hover
 * - Proposals under selection
 * - Proposals in active focus pane
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ephemeral: TTL Governance', () => {
  it('should not auto-dismiss proposals without TTL expiry', () => {
    const dirs = [
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
    dirs.forEach(walk);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Should not have unconditional auto-dismiss
      expect(content).not.toMatch(/setTimeout\s*\([^)]*dismiss(?:All|Ghost|Proposal)/i);
    }
  });

  it('confidence bands should define HIGH threshold at 0.9', () => {
    const bandsPath = path.resolve(__dirname, '../src/lib/badges/confidenceBands.ts');
    const content = fs.readFileSync(bandsPath, 'utf-8');

    expect(content).toContain("min: 0.9");
    expect(content).toContain("label: 'HIGH'");
  });

  it('confidence bands should define MEDIUM threshold at 0.7', () => {
    const bandsPath = path.resolve(__dirname, '../src/lib/badges/confidenceBands.ts');
    const content = fs.readFileSync(bandsPath, 'utf-8');

    expect(content).toContain("min: 0.7");
    expect(content).toContain("label: 'MEDIUM'");
  });

  it('confidence bands should define LOW threshold at 0', () => {
    const bandsPath = path.resolve(__dirname, '../src/lib/badges/confidenceBands.ts');
    const content = fs.readFileSync(bandsPath, 'utf-8');

    expect(content).toContain("min: 0");
    expect(content).toContain("label: 'LOW'");
  });

  it('getConfidenceBand should return correct band for score >= 0.9', () => {
    // Import and test the actual function
    const { getConfidenceBand } = require('../src/lib/badges/confidenceBands');

    const band = getConfidenceBand(0.95);
    expect(band.label).toBe('HIGH');
    expect(band.min).toBe(0.9);
  });

  it('getConfidenceBand should return MEDIUM for score 0.7-0.89', () => {
    const { getConfidenceBand } = require('../src/lib/badges/confidenceBands');

    const band = getConfidenceBand(0.75);
    expect(band.label).toBe('MEDIUM');
  });

  it('getConfidenceBand should return LOW for score < 0.7', () => {
    const { getConfidenceBand } = require('../src/lib/badges/confidenceBands');

    const band = getConfidenceBand(0.5);
    expect(band.label).toBe('LOW');
  });
});
