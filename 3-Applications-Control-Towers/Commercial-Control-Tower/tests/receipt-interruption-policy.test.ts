/**
 * Receipt Interruption Policy
 *
 * Verifies receipts with violations raise INTERRUPTION_PENDING,
 * not forced focus change.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Receipt Interruption Policy', () => {
  it('receipt feed component should not force focus changes', () => {
    const feedPath = path.resolve(__dirname, '../src/components/workstation/ReceiptFeed.tsx');
    const content = fs.readFileSync(feedPath, 'utf-8');

    // Should not contain focus-changing logic
    expect(content).not.toMatch(/focusPane|setPrimaryActive|setFocus/);

    // Should have read-only BACKGROUND_AWARE focus level
    expect(content).toContain('BACKGROUND_AWARE');
  });

  it('receipt pulse feed should not auto-scroll to disrupt reading position', () => {
    const feedPath = path.resolve(__dirname, '../src/components/lineage/ReceiptPulseFeed.tsx');
    const content = fs.readFileSync(feedPath, 'utf-8');

    // Should not contain scrollIntoView or auto-scroll
    expect(content).not.toMatch(/scrollIntoView|autoScroll|scrollTo/);
  });

  it('receipt feed should mark violations with markers, not forced navigation', () => {
    const feedPath = path.resolve(__dirname, '../src/components/workstation/ReceiptFeed.tsx');
    const content = fs.readFileSync(feedPath, 'utf-8');

    // Should have violation marker
    expect(content).toContain('violation-marker');
    expect(content).toContain('hasViolation');
  });

  it('attention queue should support interruption type for violation receipts', () => {
    const { validateQueueState } = require('../src/lib/replay/serializeQueueState');

    const validState = {
      items: [
        {
          id: 'int-1',
          type: 'interruption',
          sourceId: 'receipt-violation-123',
          timestamp: '2026-01-01T00:00:00Z',
          priority: 10,
        },
      ],
    };

    const result = validateQueueState(validState);
    expect(result.valid).toBe(true);
  });

  it('attention queue CSS should distinguish interruption from advisory', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/attention-queue.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-attention-queue__item--interruption');
    expect(content).toContain('.cct-attention-queue__item--advisory');

    // Interruption uses crimson
    expect(content).toMatch(/\.cct-attention-queue__item--interruption[^{]*\{[^}]*var\(--color-violation-crimson\)/s);

    // Advisory uses amber
    expect(content).toMatch(/\.cct-attention-queue__item--advisory[^{]*\{[^}]*var\(--color-accent-amber\)/s);
  });

  it('receipt feed store should track violation status on receipts', () => {
    const { createReceiptFeedStore } = require('../src/lib/lineage/receiptFeedStore');

    const store = createReceiptFeedStore();

    store.addReceipt({
      receiptId: 'r1',
      timestamp: '2026-01-01T00:00:00Z',
      operation: 'validate',
      kernel: 'law',
      entityId: 'e1',
      status: 'failure',
      confidence: 0.3,
      hasViolation: true,
      violationType: 'CRITICAL',
      isNew: true,
    });

    const state = store.getState();
    expect(state.items[0].hasViolation).toBe(true);
    expect(state.items[0].violationType).toBe('CRITICAL');
  });
});
