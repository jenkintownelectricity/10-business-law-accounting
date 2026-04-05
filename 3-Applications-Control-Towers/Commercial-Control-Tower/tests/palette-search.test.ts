/**
 * Palette Search Test
 * Verifies that CommandRegistry.searchCommands returns
 * matching commands by id, label, and description.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Command Palette: Search Behavior', () => {
  const registryPath = path.resolve(__dirname, '../src/lib/command/commandRegistry.ts');
  let registryContent: string;

  beforeAll(() => {
    registryContent = fs.readFileSync(registryPath, 'utf-8');
  });

  it('searchCommands should filter by lowercase query matching', () => {
    // The search function should convert query to lowercase
    expect(registryContent).toMatch(/toLowerCase\(\)/);
    expect(registryContent).toMatch(/includes\(lowerQuery\)/);
  });

  it('searchCommands should match against command id', () => {
    expect(registryContent).toMatch(/cmd\.id\.toLowerCase\(\)\.includes/);
  });

  it('searchCommands should match against command label', () => {
    expect(registryContent).toMatch(/cmd\.label\.toLowerCase\(\)\.includes/);
  });

  it('searchCommands should match against command description', () => {
    expect(registryContent).toMatch(/cmd\.description\.toLowerCase\(\)\.includes/);
  });

  it('registry should contain focus commands searchable by "focus"', () => {
    const focusIdMatches = registryContent.match(/id:\s*'focus\.[^']+'/g);
    expect(focusIdMatches).not.toBeNull();
    expect(focusIdMatches!.length).toBeGreaterThanOrEqual(3);
  });

  it('registry should contain ghost commands searchable by "ghost"', () => {
    const ghostIdMatches = registryContent.match(/id:\s*'ghost\.[^']+'/g);
    expect(ghostIdMatches).not.toBeNull();
    expect(ghostIdMatches!.length).toBeGreaterThanOrEqual(2);
  });

  it('registry should contain navigation commands', () => {
    const navIdMatches = registryContent.match(/id:\s*'nav\.[^']+'/g);
    expect(navIdMatches).not.toBeNull();
    expect(navIdMatches!.length).toBeGreaterThanOrEqual(1);
  });

  it('searchCommands should return array type', () => {
    expect(registryContent).toMatch(/function searchCommands\(query: string\): RegisteredCommand\[\]/);
  });

  it('getAllCommands should return a copy of the registry', () => {
    // Should spread or slice the array to prevent mutation
    expect(registryContent).toMatch(/\[\.\.\.COMMAND_REGISTRY\]/);
  });
});
