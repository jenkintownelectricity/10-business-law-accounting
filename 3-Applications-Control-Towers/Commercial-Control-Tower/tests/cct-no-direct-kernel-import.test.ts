/**
 * CCT: No Direct Kernel Import
 *
 * Verifies no direct kernel or workflow imports exist in UI components.
 * All kernel interaction must route through VKBUS signals.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('CCT: No Direct Kernel Import', () => {
  function getAllUIFiles(): string[] {
    const srcDir = path.resolve(__dirname, '../src/components');
    const files: string[] = [];
    function walk(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    }
    walk(srcDir);
    return files;
  }

  it('should not import from kernel packages in any UI component', () => {
    const files = getAllUIFiles();
    expect(files.length).toBeGreaterThan(0);

    const kernelImportPatterns = [
      /import.*from\s+['"].*\/Microkernels\//,
      /import.*from\s+['"].*\/kernels?\//i,
      /import.*from\s+['"].*business-kernel/,
      /import.*from\s+['"].*law-kernel/,
      /import.*from\s+['"].*accounting-kernel/,
      /import.*from\s+['"]@validkernel\/kernel/,
    ];

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const pattern of kernelImportPatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  it('should not import workflow definitions in any UI component', () => {
    const files = getAllUIFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/import.*from\s+['"].*\/workflows?\//i);
      expect(content).not.toMatch(/import.*from\s+['"].*workflow-engine/i);
    }
  });

  it('should not import domain entity constructors in any UI component', () => {
    const files = getAllUIFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/import\s*\{[^}]*(?:createInvoice|createContract|createLedger|createEntity)[^}]*\}/);
    }
  });

  it('should not reference runtime engine directly', () => {
    const files = getAllUIFiles();

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/import.*from\s+['"].*runtime-engine/i);
      expect(content).not.toMatch(/import.*from\s+['"].*execution-spine/i);
    }
  });
});
