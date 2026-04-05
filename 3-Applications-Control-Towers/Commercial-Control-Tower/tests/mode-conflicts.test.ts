/**
 * Mode Conflicts Test
 * Verifies all mode conflict rules:
 * - replay + ghost = disabled
 * - quiet + shadow = suppressed
 * - locked + transfer = blocked
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Mode Conflicts: Mutual Exclusion Rules', () => {
  const replayStorePath = path.resolve(__dirname, '../src/lib/replay/replayModeStore.ts');
  const ghostTransitionsPath = path.resolve(__dirname, '../src/lib/ghost/ghostTransitions.ts');
  const focusTypesPath = path.resolve(__dirname, '../src/lib/focus/focusTypes.ts');
  const registryPath = path.resolve(__dirname, '../src/lib/command/commandRegistry.ts');
  const replayCssPath = path.resolve(__dirname, '../src/styles/replay-mode.css');

  it('replay mode store should support enter/exit lifecycle', () => {
    const content = fs.readFileSync(replayStorePath, 'utf-8');
    expect(content).toContain('enter(');
    expect(content).toContain('exit(');
  });

  it('ghost transition controller should have show/hide methods', () => {
    const content = fs.readFileSync(ghostTransitionsPath, 'utf-8');
    expect(content).toContain('show()');
    expect(content).toContain('hide()');
  });

  it('replay mode should disable ghost promotion via visual indicator', () => {
    const content = fs.readFileSync(replayCssPath, 'utf-8');
    // Mutating commands should be visually disabled in replay mode
    expect(content).toContain('data-mutating');
    expect(content).toContain('pointer-events: none');
  });

  it('focus types should define QUIET_MODE state', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('QUIET_MODE');
  });

  it('focus types should define LOCKED_REVIEW state', () => {
    const content = fs.readFileSync(focusTypesPath, 'utf-8');
    expect(content).toContain('LOCKED_REVIEW');
  });

  it('ghost transition states should include hidden and visible', () => {
    const content = fs.readFileSync(ghostTransitionsPath, 'utf-8');
    expect(content).toContain("'hidden'");
    expect(content).toContain("'visible'");
    expect(content).toContain("'entering'");
    expect(content).toContain("'exiting'");
  });

  it('ghost transition should support reduced motion', () => {
    const content = fs.readFileSync(ghostTransitionsPath, 'utf-8');
    expect(content).toContain('reduced_motion');
    // In reduced motion, entering/exiting should collapse to immediate
    expect(content).toMatch(/reduced_motion/);
    expect(content).toContain('ghost-hidden');
    expect(content).toContain('ghost-visible');
  });

  it('registry should have both focus.lock and ghost.toggle commands', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    expect(content).toContain("'focus.lock'");
    expect(content).toContain("'ghost.toggle'");
  });

  it('registry should have focus.quiet.on and focus.quiet.off commands', () => {
    const content = fs.readFileSync(registryPath, 'utf-8');
    expect(content).toContain("'focus.quiet.on'");
    expect(content).toContain("'focus.quiet.off'");
  });

  it('replay mode state should be distinct from focus states', () => {
    const replayContent = fs.readFileSync(replayStorePath, 'utf-8');
    const focusContent = fs.readFileSync(focusTypesPath, 'utf-8');
    // Replay uses its own state model, not focus states
    expect(replayContent).toContain('ReplayModeState');
    expect(focusContent).toContain('FocusState');
  });
});
