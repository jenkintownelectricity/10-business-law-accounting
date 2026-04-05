/**
 * Attention Queue: No Auto-Open
 *
 * Verifies queue items do not auto-open panes.
 * Advisory items land in the queue; operator decides when to engage.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Attention Queue: No Auto-Open', () => {
  it('attention queue CSS should not contain auto-open or auto-focus styles', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/attention-queue.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // Should not have auto-expanding or auto-opening animations
    expect(content).not.toMatch(/auto-open|auto-expand|auto-focus/i);
  });

  it('attention queue CSS should use cursor:pointer (manual click required)', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/attention-queue.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('cursor: pointer');
  });

  it('attention queue CSS should not contain flashing animations', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/attention-queue.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // No flash keyframes
    expect(content).not.toMatch(/@keyframes.*flash/i);
    expect(content).not.toMatch(/animation:.*flash/i);
    expect(content).not.toMatch(/animation:.*blink/i);
  });

  it('queue state serialization should track items without auto-open flags', () => {
    const { serializeQueueState } = require('../src/lib/replay/serializeQueueState');

    const items = [
      {
        id: 'q1',
        type: 'advisory' as const,
        sourceId: 'src-1',
        timestamp: '2026-01-01T00:00:00Z',
        priority: 1,
        onAcknowledge: () => {}, // runtime-only, should be excluded
      },
    ];

    const serialized = serializeQueueState(items);

    // Should not serialize runtime callbacks
    expect(serialized.items[0]).not.toHaveProperty('onAcknowledge');
    expect(serialized.items[0]).not.toHaveProperty('autoOpen');
    expect(serialized.items[0].type).toBe('advisory');
  });

  it('queue items should only have advisory or interruption types', () => {
    const { validateQueueState } = require('../src/lib/replay/serializeQueueState');

    const invalidState = {
      items: [
        { id: 'q1', type: 'auto-open', sourceId: 's1', timestamp: '', priority: 1 },
      ],
    };

    const result = validateQueueState(invalidState);
    expect(result.valid).toBe(false);
  });

  it('advisory items should use contained glow, not attention-grabbing flash', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/attention-queue.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    // Advisory uses box-shadow (contained glow)
    expect(content).toMatch(/\.cct-attention-queue__item--advisory[^{]*\{[^}]*box-shadow/s);
  });
});
