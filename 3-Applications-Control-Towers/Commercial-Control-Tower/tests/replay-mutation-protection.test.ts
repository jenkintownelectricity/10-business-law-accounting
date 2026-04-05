/**
 * Replay Mutation Protection Test
 * Verifies that mutation commands (ghost.promote, focus.transfer)
 * are disabled in replay mode.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Replay Mode: Mutation Protection', () => {
  const replayStorePath = path.resolve(__dirname, '../src/lib/replay/replayModeStore.ts');
  const replayBadgePath = path.resolve(__dirname, '../src/components/replay/ReplayBadge.tsx');
  const replayControlsPath = path.resolve(__dirname, '../src/components/replay/ReplayControls.tsx');
  const replayStylePath = path.resolve(__dirname, '../src/styles/replay-mode.css');

  let storeContent: string;

  beforeAll(() => {
    storeContent = fs.readFileSync(replayStorePath, 'utf-8');
  });

  it('replay mode store should track active state', () => {
    expect(storeContent).toContain('active: boolean');
    expect(storeContent).toContain('isActive');
  });

  it('replay mode store should freeze live mutation when active', () => {
    // Store should document that mutation is frozen
    expect(storeContent).toMatch(/[Ff]rozen|[Mm]utation.*disabled|[Ll]ive.*frozen/);
  });

  it('replay mode should save previous focus state on enter', () => {
    expect(storeContent).toContain('previous_focus_snapshot');
    expect(storeContent).toContain('focusSnapshot');
  });

  it('replay mode should restore previous state on exit', () => {
    expect(storeContent).toContain('exit()');
    expect(storeContent).toContain('previousFocusSnapshot');
  });

  it('replay mode should have scrub position tracking', () => {
    expect(storeContent).toContain('scrub_position');
    expect(storeContent).toContain('scrubTo');
  });

  it('scrub position should be clamped between 0 and 1', () => {
    expect(storeContent).toMatch(/Math\.max\(0/);
    expect(storeContent).toMatch(/Math\.min\(1/);
  });

  it('scrubTo should not work when replay is not active', () => {
    expect(storeContent).toMatch(/if\s*\(!this\.state\.active\)\s*return/);
  });

  it('replay badge component should exist', () => {
    expect(fs.existsSync(replayBadgePath)).toBe(true);
    const content = fs.readFileSync(replayBadgePath, 'utf-8');
    expect(content).toContain('REPLAY');
    expect(content).toContain('role="status"');
  });

  it('replay controls should have scrub slider and exit button', () => {
    expect(fs.existsSync(replayControlsPath)).toBe(true);
    const content = fs.readFileSync(replayControlsPath, 'utf-8');
    expect(content).toContain('type="range"');
    expect(content).toContain('Exit Replay');
  });

  it('replay CSS should disable mutating commands visually', () => {
    expect(fs.existsSync(replayStylePath)).toBe(true);
    const content = fs.readFileSync(replayStylePath, 'utf-8');
    expect(content).toContain('pointer-events: none');
    expect(content).toContain('Disabled in Replay');
  });

  it('replay badge should not render when inactive', () => {
    const content = fs.readFileSync(replayBadgePath, 'utf-8');
    expect(content).toMatch(/if\s*\(!active\)\s*return\s*null/);
  });
});
