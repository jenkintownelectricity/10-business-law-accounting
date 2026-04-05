/**
 * Ghost Promotion Requires Command Test
 * Verifies that ghost promotion only occurs through explicit
 * ghost.promote command, never automatically.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ghost Promotion: Requires Explicit Command', () => {
  const ghostLibDir = path.resolve(__dirname, '../src/lib/ghost');
  const ghostComponentDir = path.resolve(__dirname, '../src/components/ghost');
  const vkbusClientPath = path.resolve(__dirname, '../src/lib/vkbus/vkbusClient.ts');
  const registryPath = path.resolve(__dirname, '../src/lib/command/commandRegistry.ts');

  function getAllGhostFiles(): string[] {
    const files: string[] = [];
    for (const dir of [ghostLibDir, ghostComponentDir]) {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir)
          .filter(f => f.endsWith('.ts') || f.endsWith('.tsx'))
          .forEach(f => files.push(path.join(dir, f)));
      }
    }
    return files;
  }

  it('ghost.promote command should be registered in command registry', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    expect(content).toContain("'ghost.promote'");
  });

  it('vkbus client should have a promoteGhost method', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    expect(content).toContain('promoteGhost');
  });

  it('ghost components should not auto-promote on mount or render', () => {
    const files = getAllGhostFiles();
    expect(files.length).toBeGreaterThan(0);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      // No useEffect that calls promote
      expect(content).not.toMatch(/useEffect\s*\([^)]*promot/);
      // No componentDidMount promotion
      expect(content).not.toMatch(/componentDidMount[^}]*promot/);
    }
  });

  it('ghost components should not call promoteGhost directly', () => {
    const files = getAllGhostFiles();
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/promoteGhost\s*\(/);
    }
  });

  it('ghost components should not auto-dispatch promote signals', () => {
    const files = getAllGhostFiles();
    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/dispatch\s*\(\s*\{[^}]*type:\s*['"].*PROMOTE/);
      expect(content).not.toMatch(/emit\s*\(\s*\{[^}]*signal_type:\s*['"]cct\.ghost\.promote/);
    }
  });

  it('promotion should route through VKBUS signal emission', () => {
    const content = fs.readFileSync(vkbusClientPath, 'utf-8');
    expect(content).toMatch(/signal_type:\s*'cct\.ghost\.promote'/);
  });
});
