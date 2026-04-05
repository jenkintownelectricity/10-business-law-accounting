/**
 * Doctrine Pane Read-Only Test
 * Verifies that DoctrinePane has no mutation controls,
 * edit buttons, or save paths.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Doctrine Pane: Read-Only Enforcement', () => {
  const doctrinePanePath = path.resolve(__dirname, '../src/components/doctrine/DoctrinePane.tsx');
  const doctrineStorePath = path.resolve(__dirname, '../src/lib/doctrine/doctrineStore.ts');
  let paneContent: string;
  let storeContent: string;

  beforeAll(() => {
    paneContent = fs.readFileSync(doctrinePanePath, 'utf-8');
    storeContent = fs.readFileSync(doctrineStorePath, 'utf-8');
  });

  it('doctrine pane should exist', () => {
    expect(fs.existsSync(doctrinePanePath)).toBe(true);
  });

  it('doctrine pane should not contain edit buttons', () => {
    // Should not have interactive edit/save/delete/update buttons or handlers
    expect(paneContent).not.toMatch(/onClick=\{[^}]*[Ee]dit/);
    expect(paneContent).not.toMatch(/onClick=\{[^}]*[Ss]ave/);
    expect(paneContent).not.toMatch(/onClick=\{[^}]*[Dd]elete/);
    expect(paneContent).not.toMatch(/onClick=\{[^}]*[Uu]pdate/);
    expect(paneContent).not.toMatch(/>Edit<|>Save<|>Delete<|>Update</);
  });

  it('doctrine pane should not contain form inputs for modification', () => {
    expect(paneContent).not.toMatch(/<textarea/);
    expect(paneContent).not.toMatch(/<input[^>]*type=["']text["']/);
    expect(paneContent).not.toMatch(/contentEditable/);
  });

  it('doctrine pane should not contain mutation callbacks', () => {
    expect(paneContent).not.toMatch(/onSave|onEdit|onDelete|onUpdate|onMutate|onChange/);
  });

  it('doctrine pane should display FROZEN badge', () => {
    expect(paneContent).toContain('FROZEN');
  });

  it('doctrine pane should display READ-ONLY badge', () => {
    expect(paneContent).toContain('READ-ONLY');
  });

  it('doctrine pane should have aria-readonly attribute', () => {
    expect(paneContent).toMatch(/aria-readonly/);
  });

  it('doctrine pane should use pre tag for monospace content', () => {
    expect(paneContent).toMatch(/<pre/);
  });

  it('doctrine store should be immutable after load', () => {
    expect(storeContent).toContain('Object.freeze');
    expect(storeContent).toMatch(/if\s*\(this\.loaded\)\s*return/);
  });

  it('doctrine store should not have any update or delete methods', () => {
    expect(storeContent).not.toMatch(/update\(|delete\(|remove\(|set\(|modify\(|mutate\(/);
  });

  it('doctrine pane should display source path', () => {
    expect(paneContent).toContain('source_path');
  });

  it('doctrine pane should have breadcrumb navigation', () => {
    expect(paneContent).toContain('breadcrumb');
    expect(paneContent).toMatch(/aria-label=["']Doctrine context["']/);
  });
});
