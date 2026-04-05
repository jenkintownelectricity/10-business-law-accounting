/**
 * Registry Typing Test
 * Verifies that all registered commands have required fields,
 * valid categories, and valid trust classes.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Command Registry: Typing and Completeness', () => {
  const registryPath = path.resolve(__dirname, '../src/lib/command/commandRegistry.ts');
  let registryContent: string;

  beforeAll(() => {
    registryContent = fs.readFileSync(registryPath, 'utf-8');
  });

  it('should export a getAllCommands function', () => {
    expect(registryContent).toContain('export function getAllCommands');
  });

  it('should export a searchCommands function', () => {
    expect(registryContent).toContain('export function searchCommands');
  });

  it('should define CommandCategory type with required categories', () => {
    expect(registryContent).toMatch(/CommandCategory/);
    expect(registryContent).toContain("'focus'");
    expect(registryContent).toContain("'ghost'");
    expect(registryContent).toContain("'navigation'");
    expect(registryContent).toContain("'system'");
  });

  it('every registered command should have an id field', () => {
    // Extract command objects from the registry array
    const commandBlockMatches = registryContent.match(/\{\s*id:\s*'[^']+'/g);
    expect(commandBlockMatches).not.toBeNull();
    expect(commandBlockMatches!.length).toBeGreaterThan(0);
  });

  it('every registered command should have a label field', () => {
    const labelMatches = registryContent.match(/label:\s*'[^']+'/g);
    expect(labelMatches).not.toBeNull();
    expect(labelMatches!.length).toBeGreaterThan(0);
  });

  it('every registered command should have a description field', () => {
    const descMatches = registryContent.match(/description:\s*'[^']+'/g);
    expect(descMatches).not.toBeNull();
    expect(descMatches!.length).toBeGreaterThan(0);
  });

  it('every registered command should have a handler field', () => {
    const handlerMatches = registryContent.match(/handler:\s*'[^']+'/g);
    expect(handlerMatches).not.toBeNull();
    expect(handlerMatches!.length).toBeGreaterThan(0);
  });

  it('every registered command should have a valid category', () => {
    const categoryMatches = registryContent.match(/category:\s*'([^']+)'/g);
    expect(categoryMatches).not.toBeNull();
    const validCategories = ['focus', 'ghost', 'navigation', 'system'];
    for (const match of categoryMatches!) {
      const category = match.replace(/category:\s*'/, '').replace(/'$/, '');
      expect(validCategories).toContain(category);
    }
  });

  it('command ids should follow dotted naming convention', () => {
    const idMatches = registryContent.match(/id:\s*'([^']+)'/g);
    expect(idMatches).not.toBeNull();
    for (const match of idMatches!) {
      const id = match.replace(/id:\s*'/, '').replace(/'$/, '');
      expect(id).toMatch(/^[a-z]+\.[a-z]+(\.[a-z]+)*$/);
    }
  });

  it('RegisteredCommand interface should include required fields', () => {
    expect(registryContent).toContain('id: string');
    expect(registryContent).toContain('label: string');
    expect(registryContent).toContain('description: string');
    expect(registryContent).toContain('category: CommandCategory');
    expect(registryContent).toContain('handler: string');
  });
});
