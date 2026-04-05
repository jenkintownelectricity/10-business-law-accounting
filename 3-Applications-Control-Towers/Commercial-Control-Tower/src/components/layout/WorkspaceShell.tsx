import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface WorkspaceShellProps {
  activeNav: string;
  children: React.ReactNode;
}

export function WorkspaceShell({ activeNav, children }: WorkspaceShellProps) {
  return (
    <div className="cct-workspace">
      <Sidebar activeNav={activeNav} />
      <div className="cct-main">
        <TopBar />
        <main className="cct-content">
          {children}
        </main>
      </div>
    </div>
  );
}
