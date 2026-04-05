import React from 'react';
import { getBadgeColorRule } from '../../lib/badges/badgeColorRules';

export type ViolationState = 'NONE' | 'WARNING' | 'CRITICAL';

export interface ViolationBadgeProps {
  state: ViolationState;
  message?: string;
  className?: string;
}

/**
 * ViolationBadge
 *
 * Shows violation state:
 * - NONE: hidden (not rendered)
 * - WARNING: amber badge
 * - CRITICAL: crimson badge
 *
 * Read-only display component -- no mutation paths.
 */
export const ViolationBadge: React.FC<ViolationBadgeProps> = ({ state, message, className }) => {
  if (state === 'NONE') {
    return null;
  }

  const colorRule = getBadgeColorRule('violation', state);

  const stateIcons: Record<Exclude<ViolationState, 'NONE'>, string> = {
    WARNING: '⚠',
    CRITICAL: '✖',
  };

  return (
    <span
      className={`cct-badge cct-badge--violation cct-badge--violation-${state.toLowerCase()} ${className || ''}`}
      style={{
        backgroundColor: colorRule.background,
        color: colorRule.foreground,
        borderColor: colorRule.border,
        borderStyle: colorRule.borderStyle,
        borderWidth: '1px',
      }}
      role="alert"
      aria-label={`Violation: ${state}${message ? ` - ${message}` : ''}`}
      title={message}
      data-badge-type="violation"
      data-violation-state={state}
    >
      <span className="cct-badge__icon">{stateIcons[state]}</span>
      <span className="cct-badge__label">{state}</span>
    </span>
  );
};

export default ViolationBadge;
