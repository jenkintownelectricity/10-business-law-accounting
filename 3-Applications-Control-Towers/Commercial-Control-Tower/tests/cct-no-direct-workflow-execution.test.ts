/**
 * CCT: No Direct Workflow Execution
 *
 * Verifies no direct workflow execution occurs from UI components.
 * All execution must route through VKBUS signal emission.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('CCT: No Direct Workflow Execution', () => {
  function getAllSrcFiles(): string[] {
    const srcDir = path.resolve(__dirname, '../src');
    const files: string[] = [];
    function walk(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') walk(fullPath);
        else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    }
    walk(srcDir);
    return files;
  }

  it('should not contain direct workflow.execute calls', () => {
    const files = getAllSrcFiles();
    expect(files.length).toBeGreaterThan(0);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/workflow\.execute\s*\(/);
      expect(content).not.toMatch(/executeWorkflow\s*\(/);
      expect(content).not.toMatch(/runWorkflow\s*\(/);
    }
  });

  it('should not contain direct kernel.process calls', () => {
    const files = getAllSrcFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/kernel\.process\s*\(/);
      expect(content).not.toMatch(/kernel\.execute\s*\(/);
      expect(content).not.toMatch(/kernel\.run\s*\(/);
    }
  });

  it('should not contain direct database operations', () => {
    const files = getAllSrcFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/db\.(insert|update|delete|query)\s*\(/);
      expect(content).not.toMatch(/prisma\./);
      expect(content).not.toMatch(/drizzle\./);
    }
  });

  it('command executor should route domain actions through vkbus only', () => {
    const executorPath = path.resolve(__dirname, '../src/lib/command/commandExecutor.ts');
    const content = fs.readFileSync(executorPath, 'utf-8');

    // Ghost/domain actions should go through vkbusClient
    expect(content).toContain('vkbusClient.emit');

    // Should not contain direct execution
    expect(content).not.toMatch(/workflow\.execute/);
    expect(content).not.toMatch(/kernel\.process/);
  });

  it('should not import execution engine modules', () => {
    const files = getAllSrcFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/import.*from\s+['"].*execution-engine/i);
      expect(content).not.toMatch(/import.*from\s+['"].*process-engine/i);
    }
  });
});
