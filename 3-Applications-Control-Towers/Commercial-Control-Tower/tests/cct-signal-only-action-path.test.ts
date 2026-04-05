/**
 * CCT: Signal-Only Action Path
 *
 * Verifies all domain-affecting actions route through vkbusClient.
 * The UI is a projection surface, not a truth source.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('CCT: Signal-Only Action Path', () => {
  it('command executor should use vkbusClient for all domain-affecting operations', () => {
    const executorPath = path.resolve(__dirname, '../src/lib/command/commandExecutor.ts');
    const content = fs.readFileSync(executorPath, 'utf-8');

    // All ghost operations should route through vkbus
    expect(content).toMatch(/ghostToggle.*vkbusClient\.emit/s);
    expect(content).toMatch(/ghostPromote.*vkbusClient\.emit/s);
    expect(content).toMatch(/ghostDismiss.*vkbusClient\.emit/s);
    expect(content).toMatch(/inspectViolation.*vkbusClient\.emit/s);
  });

  it('command executor interface should require vkbusClient dependency', () => {
    const executorPath = path.resolve(__dirname, '../src/lib/command/commandExecutor.ts');
    const content = fs.readFileSync(executorPath, 'utf-8');

    expect(content).toContain('vkbusClient');
    expect(content).toContain('emit');
  });

  it('no component should directly mutate receipt store', () => {
    const componentDir = path.resolve(__dirname, '../src/components');
    const files: string[] = [];
    function walk(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (entry.name.endsWith('.tsx')) files.push(fullPath);
      }
    }
    walk(componentDir);

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toMatch(/receiptStore\.addReceipt/);
      expect(content).not.toMatch(/receiptStore\.clear/);
    }
  });

  it('receipt feed store should not contain VKBUS emission logic', () => {
    const storePath = path.resolve(__dirname, '../src/lib/lineage/receiptFeedStore.ts');
    const content = fs.readFileSync(storePath, 'utf-8');

    // Store receives receipts, does not emit VKBUS signals
    expect(content).not.toMatch(/vkbus/i);
    expect(content).not.toMatch(/emit\s*\(/);
  });

  it('focus commands should be sourced from operator only', () => {
    const focusCmdsPath = path.resolve(__dirname, '../src/lib/command/focusCommands.ts');
    const content = fs.readFileSync(focusCmdsPath, 'utf-8');

    // All exported focus command functions should have source: 'operator'
    const functionMatches = content.match(/export function \w+\([^)]*\):\s*FocusCommand\s*\{[^}]*\}/g);
    if (functionMatches) {
      for (const fn of functionMatches) {
        expect(fn).toContain("source: 'operator'");
      }
    }
  });
});
