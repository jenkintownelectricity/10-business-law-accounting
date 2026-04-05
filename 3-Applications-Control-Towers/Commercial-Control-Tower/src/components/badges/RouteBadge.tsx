import React from 'react';
import { getRouteLabel } from '../../lib/badges/routeLabelMap';
import { getBadgeColorRule } from '../../lib/badges/badgeColorRules';

export interface RouteBadgeProps {
  route: string;
  className?: string;
}

/**
 * RouteBadge
 *
 * Shows the target kernel/route as a colored label.
 * Business=blue, Law=purple, Accounting=green.
 * Read-only display component -- no mutation paths.
 */
export const RouteBadge: React.FC<RouteBadgeProps> = ({ route, className }) => {
  const routeInfo = getRouteLabel(route);
  const colorRule = getBadgeColorRule('route', routeInfo.label);

  return (
    <span
      className={`cct-badge cct-badge--route ${className || ''}`}
      style={{
        backgroundColor: colorRule.background,
        color: colorRule.foreground,
        borderColor: colorRule.border,
        borderStyle: colorRule.borderStyle,
      }}
      role="status"
      aria-label={`Route: ${routeInfo.label}`}
      data-badge-type="route"
      data-route={route}
    >
      <span className="cct-badge__label">{routeInfo.label}</span>
    </span>
  );
};

export default RouteBadge;
