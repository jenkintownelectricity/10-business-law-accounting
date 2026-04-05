import React from 'react';
import { getConfidenceBand } from '../../lib/badges/confidenceBands';
import { getBadgeColorRule } from '../../lib/badges/badgeColorRules';

export interface ConfidenceBadgeProps {
  score: number;
  className?: string;
}

/**
 * ConfidenceBadge
 *
 * Displays a confidence score as a colored badge.
 * Bands: >= 0.9 green (HIGH), >= 0.7 amber (MEDIUM), < 0.7 red (LOW).
 * Read-only display component -- no mutation paths.
 */
export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ score, className }) => {
  const band = getConfidenceBand(score);
  const colorRule = getBadgeColorRule('confidence', band.label);
  const displayScore = Math.round(score * 100);

  return (
    <span
      className={`cct-badge cct-badge--confidence cct-badge--${band.label.toLowerCase()} ${className || ''}`}
      style={{
        backgroundColor: colorRule.background,
        color: colorRule.foreground,
        borderColor: colorRule.border,
        borderStyle: colorRule.borderStyle,
      }}
      role="status"
      aria-label={`Confidence: ${band.label} (${displayScore}%)`}
      data-badge-type="confidence"
      data-confidence-band={band.label}
      data-confidence-score={score}
    >
      <span className="cct-badge__label">{band.label}</span>
      <span className="cct-badge__value">{displayScore}%</span>
    </span>
  );
};

export default ConfidenceBadge;
