/**
 * Ghost Shadow No Mutation Test
 * Verifies that ghost.shadow (ghost overlay) does not mutate
 * accounting state, only renders overlay.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ghost Shadow: No Accounting Mutation', () => {
  const ghostComponentDir = path.resolve(__dirname, '../src/components/ghost');
  const ghostLibDir = path.resolve(__dirname, '../src/lib/ghost');

  function getGhostFiles(): string[] {
    const files: string[] = [];
    for (const dir of [ghostComponentDir, ghostLibDir]) {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir)
          .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
          .forEach(f => files.push(path.join(dir, f)));
      }
    }
    return files;
  }

  it('ghost files should exist', () => {
    const files = getGhostFiles();
    expect(files.length).toBeGreaterThan(0);
  });

  it('ghost components should not write to accounting state', () => {
    const files = getGhostFiles();
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/setAccountingState|updateLedger|postJournalEntry|createInvoice/);
    }
  });

  it('ghost components should not dispatch accounting mutations', () => {
    const files = getGhostFiles();
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/dispatch\s*\(\s*\{[^}]*type:\s*['"](?:ACCOUNTING|LEDGER|INVOICE|JOURNAL)/);
    }
  });

  it('ghost components should not import accounting stores', () => {
    const files = getGhostFiles();
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/import.*from.*accounting[Ss]tore/);
      expect(content).not.toMatch(/import.*from.*ledger[Ss]tore/);
    }
  });

  it('ghost components should not call fetch/POST for accounting endpoints', () => {
    const files = getGhostFiles();
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/fetch\s*\([^)]*accounting/);
      expect(content).not.toMatch(/fetch\s*\([^)]*ledger/);
      expect(content).not.toMatch(/fetch\s*\([^)]*invoice/);
    }
  });

  it('ghost read-only contracts should enforce no-mutation rules', () => {
    const contractsPath = path.join(ghostLibDir, 'ghostReadOnlyContracts.ts');
    if (fs.existsSync(contractsPath)) {
      const content = fs.readFileSync(contractsPath, 'utf-8');
      expect(content).toMatch(/[Rr]ead[Oo]nly|immutable|no.*mut/i);
    }
  });

  it('ghost boundary rules should exist', () => {
    const boundaryPath = path.join(ghostLibDir, 'ghostBoundaryRules.ts');
    expect(fs.existsSync(boundaryPath)).toBe(true);
  });
});
