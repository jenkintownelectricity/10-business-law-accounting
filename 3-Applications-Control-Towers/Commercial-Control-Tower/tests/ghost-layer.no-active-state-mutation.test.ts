/**
 * Ghost Layer: No Active State Mutation
 *
 * Verifies ghost layer cannot mutate active workspace state.
 * Ghost overlay is a projection-only surface.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ghost Layer: No Active State Mutation', () => {
  function getAllGhostFiles(): string[] {
    const dirs = [
      path.resolve(__dirname, '../src/components/lineage'),
      path.resolve(__dirname, '../src/components/badges'),
      path.resolve(__dirname, '../src/lib/lineage'),
    ];
    const files: string[] = [];
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir)
          .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
          .forEach((f) => files.push(path.join(dir, f)));
      }
    }
    return files;
  }

  it('should not import any store mutation functions', () => {
    const files = getAllGhostFiles();
    expect(files.length).toBeGreaterThan(0);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // Ghost files should not import mutation operations
      expect(content).not.toMatch(/import.*\b(createEntity|updateEntity|deleteEntity|executeWorkflow)\b/);
    }
  });

  it('should not use useReducer for domain state', () => {
    const files = getAllGhostFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/useReducer\s*\([^)]*(?:domain|entity|workflow|kernel)/);
    }
  });

  it('should not modify global/window state', () => {
    const files = getAllGhostFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/window\.\w+\s*=/);
      expect(content).not.toMatch(/globalThis\.\w+\s*=/);
    }
  });

  it('should not contain direct DOM mutations', () => {
    const files = getAllGhostFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/document\.getElementById\([^)]+\)\.\w+\s*=/);
      expect(content).not.toMatch(/\.innerHTML\s*=/);
      expect(content).not.toMatch(/\.textContent\s*=/);
    }
  });

  it('should not call any promotion/rejection functions directly', () => {
    const files = getAllGhostFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/\bpromoteProposal\s*\(/);
      expect(content).not.toMatch(/\brejectProposal\s*\(/);
      expect(content).not.toMatch(/\bsolidifyGhost\s*\(/);
    }
  });

  it('receipt feed store should only expose addReceipt from VKBUS subscription, not from ghost layer', () => {
    const storePath = path.resolve(__dirname, '../src/lib/lineage/receiptFeedStore.ts');
    if (fs.existsSync(storePath)) {
      const content = fs.readFileSync(storePath, 'utf-8');
      // Store has addReceipt, but ghost components should not import it
      expect(content).toContain('addReceipt');

      // Verify ghost components don't import addReceipt
      const ghostDir = path.resolve(__dirname, '../src/components/lineage');
      if (fs.existsSync(ghostDir)) {
        const ghostFiles = fs.readdirSync(ghostDir).filter((f) => f.endsWith('.tsx'));
        for (const file of ghostFiles) {
          const ghostContent = fs.readFileSync(path.join(ghostDir, file), 'utf-8');
          expect(ghostContent).not.toMatch(/import.*addReceipt/);
        }
      }
    }
  });
});
