/**
 * Badge Clarity: Render Test
 *
 * Verifies all badges render with correct labels and order.
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Badge Clarity: Render', () => {
  it('confidence bands should cover the full 0-1 range', () => {
    const { CONFIDENCE_BANDS, getConfidenceBand } = require('../src/lib/badges/confidenceBands');

    expect(CONFIDENCE_BANDS).toHaveLength(3);

    // Test full range coverage
    expect(getConfidenceBand(1.0).label).toBe('HIGH');
    expect(getConfidenceBand(0.9).label).toBe('HIGH');
    expect(getConfidenceBand(0.89).label).toBe('MEDIUM');
    expect(getConfidenceBand(0.7).label).toBe('MEDIUM');
    expect(getConfidenceBand(0.69).label).toBe('LOW');
    expect(getConfidenceBand(0.0).label).toBe('LOW');
  });

  it('route labels should define all kernel routes', () => {
    const { ROUTE_LABELS } = require('../src/lib/badges/routeLabelMap');

    expect(ROUTE_LABELS).toHaveProperty('business_kernel');
    expect(ROUTE_LABELS).toHaveProperty('law_kernel');
    expect(ROUTE_LABELS).toHaveProperty('accounting_kernel');
    expect(ROUTE_LABELS.business_kernel.label).toBe('Business');
    expect(ROUTE_LABELS.law_kernel.label).toBe('Law');
    expect(ROUTE_LABELS.accounting_kernel.label).toBe('Accounting');
  });

  it('trust badge rules should define all three states', () => {
    const { TRUST_BADGE_RULES } = require('../src/lib/badges/trustBadgeRules');

    expect(TRUST_BADGE_RULES).toHaveProperty('UNPROMOTED');
    expect(TRUST_BADGE_RULES).toHaveProperty('PROMOTED');
    expect(TRUST_BADGE_RULES).toHaveProperty('REJECTED');
  });

  it('focus label map should define all focus levels', () => {
    const { FOCUS_LABEL_MAP } = require('../src/lib/badges/focusLabelMap');

    expect(FOCUS_LABEL_MAP).toHaveProperty('PRIMARY_ACTIVE');
    expect(FOCUS_LABEL_MAP).toHaveProperty('SECONDARY');
    expect(FOCUS_LABEL_MAP).toHaveProperty('ADVISORY');
    expect(FOCUS_LABEL_MAP).toHaveProperty('BACKGROUND_AWARE');
    expect(FOCUS_LABEL_MAP).toHaveProperty('QUIET');
    expect(FOCUS_LABEL_MAP).toHaveProperty('LOCKED_REVIEW');
  });

  it('GhostBadgeStrip should render badges in mandatory order', () => {
    const stripPath = path.resolve(__dirname, '../src/components/badges/GhostBadgeStrip.tsx');
    const content = fs.readFileSync(stripPath, 'utf-8');

    // Verify the render order: Confidence, Route, Source, TrustState, Violation, Focus
    const confidencePos = content.indexOf('ConfidenceBadge');
    const routePos = content.indexOf('RouteBadge');
    const sourcePos = content.indexOf('SourceBadge');
    const trustPos = content.indexOf('TrustStateBadge');
    const violationPos = content.indexOf('ViolationBadge');
    const focusPos = content.lastIndexOf('FocusBadge');

    expect(confidencePos).toBeLessThan(routePos);
    expect(routePos).toBeLessThan(sourcePos);
    expect(sourcePos).toBeLessThan(trustPos);
    expect(trustPos).toBeLessThan(violationPos);
    expect(violationPos).toBeLessThan(focusPos);
  });

  it('badge CSS should define mandatory order layout', () => {
    const cssPath = path.resolve(__dirname, '../src/styles/badge-system.css');
    const content = fs.readFileSync(cssPath, 'utf-8');

    expect(content).toContain('.cct-badge-strip');
    expect(content).toContain('flex-wrap: nowrap');
  });

  it('all badge color rules should reference CSS custom properties', () => {
    const { getBadgeColorRule } = require('../src/lib/badges/badgeColorRules');

    const testCases = [
      { type: 'confidence', value: 'HIGH' },
      { type: 'confidence', value: 'LOW' },
      { type: 'route', value: 'Business' },
      { type: 'trustState', value: 'UNPROMOTED' },
      { type: 'violation', value: 'CRITICAL' },
      { type: 'focus', value: 'PRIMARY_ACTIVE' },
    ] as const;

    for (const { type, value } of testCases) {
      const rule = getBadgeColorRule(type, value);
      expect(rule.foreground).toMatch(/^var\(--/);
      expect(rule.background).toMatch(/^var\(--|^rgba|^transparent/);
    }
  });
});
