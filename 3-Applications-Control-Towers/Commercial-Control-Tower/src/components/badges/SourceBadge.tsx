import React from 'react';
import { getBadgeColorRule } from '../../lib/badges/badgeColorRules';

export type SourceSystem = 'Iron Ear' | 'Language Layer' | 'AI Assistant' | 'Voice Command';

export interface SourceBadgeProps {
  source: SourceSystem;
  className?: string;
}

/**
 * SourceBadge
 *
 * Shows the source system that originated this signal or data.
 * Supported sources: Iron Ear, Language Layer, AI Assistant, Voice Command.
 * Read-only display component -- no mutation paths.
 */
export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className }) => {
  const colorRule = getBadgeColorRule('source', source);

  const sourceIcons: Record<SourceSystem, string> = {
    'Iron Ear': '◉',
    'Language Layer': '◈',
    'AI Assistant': '◆',
    'Voice Command': '◎',
  };

  return (
    <span
      className={`cct-badge cct-badge--source ${className || ''}`}
      style={{
        backgroundColor: colorRule.background,
        color: colorRule.foreground,
        borderColor: colorRule.border,
        borderStyle: colorRule.borderStyle,
      }}
      role="status"
      aria-label={`Source: ${source}`}
      data-badge-type="source"
      data-source={source}
    >
      <span className="cct-badge__icon">{sourceIcons[source]}</span>
      <span className="cct-badge__label">{source}</span>
    </span>
  );
};

export default SourceBadge;
