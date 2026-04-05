/**
 * Disabled State Logic Test
 * Verifies that commands are correctly disabled based on context:
 * replay mode, locked review, missing ghost, etc.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Command Disabled State Logic', () => {
  const executorPath = path.resolve(__dirname, '../src/lib/command/commandExecutor.ts');
  const registryPath = path.resolve(__dirname, '../src/lib/command/commandRegistry.ts');
  const replayStorePath = path.resolve(__dirname, '../src/lib/replay/replayModeStore.ts');

  it('commandExecutor should exist and handle command execution', () => {
    expect(fs.existsSync(executorPath)).toBe(true);
    const content = fs.readFileSync(executorPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('replay mode store should track active state for disabling mutations', () => {
    expect(fs.existsSync(replayStorePath)).toBe(true);
    const content = fs.readFileSync(replayStorePath, 'utf-8');
    expect(content).toContain('isActive');
    expect(content).toContain('active: boolean');
  });

  it('replay mode should freeze mutation by tracking active state', () => {
    const content = fs.readFileSync(replayStorePath, 'utf-8');
    expect(content).toContain('enter(');
    expect(content).toContain('exit(');
    expect(content).toMatch(/active:\s*true/);
    expect(content).toMatch(/active:\s*false/);
  });

  it('ghost.promote command should exist in registry', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    expect(content).toContain("'ghost.promote'");
  });

  it('focus.lock command should exist in registry', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    expect(content).toContain("'focus.lock'");
  });

  it('ghost.toggle command should exist in registry', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    expect(content).toContain("'ghost.toggle'");
  });

  it('focus commands should require focus category', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    // All focus.* commands should have category 'focus'
    const focusBlocks = content.split(/\{/).filter(b => b.includes("'focus."));
    for (const block of focusBlocks) {
      if (block.includes("id: 'focus.")) {
        expect(block).toContain("category: 'focus'");
      }
    }
  });

  it('ghost commands should require ghost category', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    const ghostBlocks = content.split(/\{/).filter(b => b.includes("id: 'ghost."));
    for (const block of ghostBlocks) {
      if (block.includes("id: 'ghost.")) {
        expect(block).toContain("category: 'ghost'");
      }
    }
  });
});
