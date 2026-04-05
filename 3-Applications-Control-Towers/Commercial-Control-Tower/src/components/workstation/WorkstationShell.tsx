import React from 'react';
import type { FocusLevel } from '../../lib/badges/focusLabelMap';

export interface WorkstationShellProps {
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  commandDeck: React.ReactNode;
  lineageRail?: React.ReactNode;
  activeFocusLevel: FocusLevel;
  operatorId: string;
  sessionId: string;
  className?: string;
}

/**
 * WorkstationShell
 *
 * Outer shell wrapping CommandDeckLayout with sidebar, topbar, and focus integration.
 * Provides the structural skeleton for the entire CCT workstation.
 *
 * Shell contract:
 * - Shell itself is never a focus target
 * - Sidebar and topbar remain visible at all focus levels
 * - Lineage rail is BACKGROUND_AWARE by default
 * - Shell propagates focus context to all children
 */
export const WorkstationShell: React.FC<WorkstationShellProps> = ({
  sidebar,
  topbar,
  commandDeck,
  lineageRail,
  activeFocusLevel,
  operatorId,
  sessionId,
  className,
}) => {
  return (
    <div
      className={`cct-workstation-shell ${className || ''}`}
      data-component="workstation-shell"
      data-operator={operatorId}
      data-session={sessionId}
      data-active-focus={activeFocusLevel}
      role="application"
      aria-label="Commercial Control Tower Workstation"
    >
      {topbar && (
        <header className="cct-workstation-shell__topbar" role="banner">
          {topbar}
        </header>
      )}
      <div className="cct-workstation-shell__body">
        {sidebar && (
          <nav className="cct-workstation-shell__sidebar" role="navigation" aria-label="Workstation navigation">
            {sidebar}
          </nav>
        )}
        <main className="cct-workstation-shell__main" role="main">
          {commandDeck}
        </main>
        {lineageRail && (
          <aside className="cct-workstation-shell__rail" role="complementary" aria-label="Lineage rail">
            {lineageRail}
          </aside>
        )}
      </div>
    </div>
  );
};

export default WorkstationShell;
