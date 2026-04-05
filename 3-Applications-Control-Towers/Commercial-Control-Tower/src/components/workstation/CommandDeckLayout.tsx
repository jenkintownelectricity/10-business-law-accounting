import React from 'react';
import type { FocusLevel } from '../../lib/badges/focusLabelMap';

export interface PaneConfig {
  id: string;
  label: string;
  focusLevel: FocusLevel;
  gridArea: string;
  component: React.ReactNode;
}

export interface CommandDeckLayoutProps {
  panes: PaneConfig[];
  primaryPaneId: string;
  onPaneFocus?: (paneId: string) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * CommandDeckLayout
 *
 * Top-level workstation layout with focus-aware pane management.
 * Uses CSS Grid for industrial-grade layout control.
 * Emphasizes PRIMARY_ACTIVE pane with full rendering priority.
 *
 * Layout contract:
 * - Exactly one PRIMARY_ACTIVE pane at any time
 * - Focus transitions are operator-initiated only
 * - AI cannot manipulate grid layout or pane sizing
 * - All panes retain their grid position regardless of focus
 */
export const CommandDeckLayout: React.FC<CommandDeckLayoutProps> = ({
  panes,
  primaryPaneId,
  onPaneFocus,
  className,
  children,
}) => {
  const getDimClass = (focusLevel: FocusLevel): string => {
    const dimMap: Record<FocusLevel, string> = {
      PRIMARY_ACTIVE: 'cct-pane--primary',
      SECONDARY: 'cct-pane--secondary',
      ADVISORY: 'cct-pane--advisory',
      BACKGROUND_AWARE: 'cct-pane--background',
      QUIET: 'cct-pane--quiet',
      LOCKED_REVIEW: 'cct-pane--locked',
    };
    return dimMap[focusLevel] || 'cct-pane--background';
  };

  return (
    <div
      className={`cct-command-deck ${className || ''}`}
      data-component="command-deck-layout"
      data-primary-pane={primaryPaneId}
      role="region"
      aria-label="Command Deck Layout"
    >
      <div className="cct-command-deck__grid">
        {panes.map((pane) => (
          <div
            key={pane.id}
            className={`cct-command-deck__pane ${getDimClass(pane.focusLevel)}`}
            style={{ gridArea: pane.gridArea }}
            data-pane-id={pane.id}
            data-focus-level={pane.focusLevel}
            role="region"
            aria-label={pane.label}
            onClick={() => onPaneFocus?.(pane.id)}
          >
            <div className="cct-command-deck__pane-header">
              <span className="cct-command-deck__pane-label">{pane.label}</span>
            </div>
            <div className="cct-command-deck__pane-content">
              {pane.component}
            </div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
};

export default CommandDeckLayout;
