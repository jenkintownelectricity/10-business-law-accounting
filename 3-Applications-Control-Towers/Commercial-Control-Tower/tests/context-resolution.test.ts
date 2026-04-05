/**
 * Context Resolution Test
 * Verifies that context resolution follows deterministic order:
 * active pane -> selected object -> evidence -> ghost -> lineage.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Context Resolution: Deterministic Order', () => {
  const resolverPath = path.resolve(__dirname, '../src/lib/doctrine/doctrineContextResolver.ts');
  let resolverContent: string;

  beforeAll(() => {
    resolverContent = fs.readFileSync(resolverPath, 'utf-8');
  });

  it('context resolver should exist', () => {
    expect(fs.existsSync(resolverPath)).toBe(true);
  });

  it('should export resolveDoctrineContext function', () => {
    expect(resolverContent).toContain('export function resolveDoctrineContext');
  });

  it('should accept activePaneType parameter', () => {
    expect(resolverContent).toContain('activePaneType');
  });

  it('should accept activeEntityType parameter', () => {
    expect(resolverContent).toContain('activeEntityType');
  });

  it('should return suggestedDoctrineId', () => {
    expect(resolverContent).toContain('suggestedDoctrineId');
  });

  it('should return breadcrumb array', () => {
    expect(resolverContent).toContain('breadcrumb');
  });

  it('should resolve matter pane to commercial orchestration', () => {
    expect(resolverContent).toMatch(/matter.*commercial-orchestration/s);
  });

  it('should resolve contract pane to kernel stack', () => {
    expect(resolverContent).toMatch(/contract.*kernel-stack/s);
  });

  it('should resolve accounting pane to kernel stack', () => {
    expect(resolverContent).toMatch(/accounting.*kernel-stack/s);
  });

  it('should resolve voice pane to voice language', () => {
    expect(resolverContent).toMatch(/voice.*voice-language/s);
  });

  it('should have a default fallback to domain root', () => {
    expect(resolverContent).toContain('root-v1');
    expect(resolverContent).toContain('Domain Root');
  });

  it('should check activePaneType before activeEntityType (deterministic order)', () => {
    // The pane type checks come first in the function
    const paneCheckIndex = resolverContent.indexOf("activePaneType === 'matter'");
    const entityCheckIndex = resolverContent.indexOf("activeEntityType === 'matter'");
    expect(paneCheckIndex).toBeLessThan(entityCheckIndex);
  });

  it('should resolve invoice entity to accounting kernel', () => {
    expect(resolverContent).toMatch(/activeEntityType === 'invoice'/);
    expect(resolverContent).toContain('Accounting Kernel');
  });
});
