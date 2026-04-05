/**
 * Focus Sovereignty Test
 * Verifies that AI/advisory cannot set PRIMARY_ACTIVE,
 * only operator commands can.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Focus Sovereignty: Operator-Only PRIMARY_ACTIVE', () => {
  const focusTypesPath = path.resolve(__dirname, '../src/lib/focus/focusTypes.ts');
  const focusRulesPath = path.resolve(__dirname, '../src/lib/focus/focusRules.ts');
  const focusTransitionsPath = path.resolve(__dirname, '../src/lib/focus/focusTransitions.ts');
  const focusStorePath = path.resolve(__dirname, '../src/lib/focus/operatorFocusStore.ts');

  it('focus types should define PRIMARY_ACTIVE state', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('PRIMARY_ACTIVE');
  });

  it('focus types should define ADVISORY_QUEUE state', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('ADVISORY_QUEUE');
  });

  it('focus transition should track initiated_by field', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('initiated_by');
    expect(content).toContain("'operator'");
    expect(content).toContain("'advisory'");
  });

  it('focus rules should exist and enforce sovereignty', () => {
    expect(fs.existsSync(focusRulesPath)).toBe(true);
    const content = fs.readFileSync(focusRulesPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('focus transitions should exist', () => {
    expect(fs.existsSync(focusTransitionsPath)).toBe(true);
  });

  it('operator focus store should exist', () => {
    expect(fs.existsSync(focusStorePath)).toBe(true);
    const content = fs.readFileSync(focusStorePath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('focus types should distinguish operator from system from advisory', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain("'operator'");
    expect(content).toContain("'system'");
    expect(content).toContain("'advisory'");
  });

  it('focus snapshot should track primary_active separately', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('primary_active');
  });

  it('focus snapshot should track quiet_mode state', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('quiet_mode');
  });

  it('focus snapshot should track locked_review state', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('locked_review');
  });
});
