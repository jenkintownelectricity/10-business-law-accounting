import React from 'react';
import { getTrustBadgeRule, type TrustState } from '../../lib/badges/trustBadgeRules';

export interface TrustStateBadgeProps {
  state: TrustState;
  className?: string;
}

/**
 * TrustStateBadge
 *
 * Shows the trust state of an item:
 * - UNPROMOTED: amber dashed border (untrusted proposal)
 * - PROMOTED: green solid border (explicitly promoted)
 * - REJECTED: red solid border (operator rejected)
 *
 * Read-only display component -- no mutation paths.
 */
export const TrustStateBadge: React.FC<TrustStateBadgeProps> = ({ state, className }) => {
  const rule = getTrustBadgeRule(state);

  return (
    <span
      className={`cct-badge cct-badge--trust-state cct-badge--trust-${state.toLowerCase()} ${className || ''}`}
      style={{
        backgroundColor: rule.backgroundColor,
        color: rule.color,
        borderColor: rule.color,
        borderStyle: rule.borderStyle,
        borderWidth: '1px',
      }}
      role="status"
      aria-label={rule.ariaLabel}
      title={rule.tooltip}
      data-badge-type="trustState"
      data-trust-state={state}
    >
      <span className="cct-badge__icon">{rule.icon}</span>
      <span className="cct-badge__label">{rule.label}</span>
    </span>
  );
};

export default TrustStateBadge;
