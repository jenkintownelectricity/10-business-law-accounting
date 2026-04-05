/**
 * Ephemeral: Promotion Requires Explicit Event
 *
 * Verifies that promotion of proposals requires an explicit operator event.
 * No timer-based, confidence-based, or AI-initiated auto-promotion.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Ephemeral: Promotion Requires Explicit Event', () => {
  it('command executor should route ghost promote through vkbus', () => {
    const executorPath = path.resolve(__dirname, '../src/lib/command/commandExecutor.ts');
    const content = fs.readFileSync(executorPath, 'utf-8');

    // ghostPromote should call vkbusClient.emit
    expect(content).toMatch(/ghostPromote[^}]*vkbusClient\.emit/s);
  });

  it('slash command parser should support /promote selected ghost', () => {
    const parserPath = path.resolve(__dirname, '../src/lib/command/slashCommandParser.ts');
    const content = fs.readFileSync(parserPath, 'utf-8');

    expect(content).toContain('/promote');
    expect(content).toContain('ghostPromote');
  });

  it('focus commands should validate operator source for focus changes', () => {
    const focusCmdsPath = path.resolve(__dirname, '../src/lib/command/focusCommands.ts');
    const content = fs.readFileSync(focusCmdsPath, 'utf-8');

    expect(content).toContain("source: 'operator'");
    expect(content).toContain('validateFocusCommand');
  });

  it('should not contain setTimeout-based promotion', () => {
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
      expect(content).not.toMatch(/setTimeout\s*\([^)]*promot/i);
      expect(content).not.toMatch(/setInterval\s*\([^)]*promot/i);
    }
  });

  it('command registry should have ghost.promote as an explicit command', () => {
    const registryPath = path.resolve(__dirname, '../src/lib/command/commandRegistry.ts');
    const content = fs.readFileSync(registryPath, 'utf-8');

    expect(content).toContain("'ghost.promote'");
    expect(content).toContain('Promote Selected Ghost');
  });
});
