import React from 'react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'matters', label: 'Matters', icon: 'briefcase' },
  { id: 'contracts', label: 'Contracts', icon: 'file-text' },
  { id: 'obligations', label: 'Obligations', icon: 'alert-circle' },
  { id: 'accounting', label: 'Accounting', icon: 'dollar-sign' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'vendors', label: 'Vendors', icon: 'truck' },
  { id: 'deadlines', label: 'Deadlines', icon: 'clock' },
  { id: 'decisions', label: 'Decision Threads', icon: 'git-branch' },
  { id: 'receipts', label: 'Receipts', icon: 'archive' },
  { id: 'review-queue', label: 'Review Queue', icon: 'check-square' },
  { id: 'voice', label: 'Voice Workspace', icon: 'mic' },
  { id: 'search', label: 'Workspace Search', icon: 'search' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

interface SidebarProps {
  activeNav: string;
}

export function Sidebar({ activeNav }: SidebarProps) {
  return (
    <nav className="cct-sidebar">
      <div className="cct-sidebar-header">
        <h1 className="cct-logo">CCT</h1>
        <span className="cct-logo-subtitle">Commercial Control Tower</span>
      </div>
      <ul className="cct-nav-list">
        {NAV_ITEMS.map(item => (
          <li key={item.id} className={`cct-nav-item ${activeNav === item.id ? 'cct-nav-active' : ''}`}>
            <a href={`/${item.id === 'overview' ? '' : item.id}`} className="cct-nav-link">
              <span className="cct-nav-icon" data-icon={item.icon} />
              <span className="cct-nav-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="cct-sidebar-footer">
        <div className="cct-kernel-status">
          <span className="cct-kernel-dot cct-kernel-active" /> Business
          <span className="cct-kernel-dot cct-kernel-active" /> Law
          <span className="cct-kernel-dot cct-kernel-active" /> Accounting
        </div>
      </div>
    </nav>
  );
}
