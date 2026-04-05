import React from 'react';
import { getFocusLabel, type FocusLevel } from '../../lib/badges/focusLabelMap';
import { getBadgeColorRule } from '../../lib/badges/badgeColorRules';

export interface FocusBadgeProps {
  level: FocusLevel;
  className?: string;
}

/**
 * FocusBadge
 *
 * Shows the focus state of the pane: PRIMARY_ACTIVE, SECONDARY, ADVISORY,
 * BACKGROUND_AWARE, QUIET, LOCKED_REVIEW.
 *
 * Focus is operator-owned. AI cannot escalate itself to PRIMARY_ACTIVE.
 * Read-only display component -- no mutation paths.
 */
export const FocusBadge: React.FC<FocusBadgeProps> = ({ level, className }) => {
  const focusInfo = getFocusLabel(level);
  const colorRule = getBadgeColorRule('focus', level);

  return (
    <span
      className={`cct-badge cct-badge--focus cct-badge--focus-${level.toLowerCase()} ${className || ''}`}
      style={{
        backgroundColor: colorRule.background,
        color: colorRule.foreground,
        borderColor: colorRule.border,
        borderStyle: colorRule.borderStyle,
        borderWidth: `${focusInfo.ringWidth}px`,
      }}
      role="status"
      aria-label={`Focus: ${focusInfo.label}`}
      title={focusInfo.description}
      data-badge-type="focus"
      data-focus-level={level}
    >
      <span className="cct-badge__label">{focusInfo.shortLabel}</span>
    </span>
  );
};

export default FocusBadge;
