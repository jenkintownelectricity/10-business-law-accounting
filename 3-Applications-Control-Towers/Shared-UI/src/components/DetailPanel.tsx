import React from 'react';

interface DetailPanelProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  children: React.ReactNode;
  width?: 'narrow' | 'medium' | 'wide';
  className?: string;
}

interface DetailSectionProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function DetailPanel({
  title,
  subtitle,
  onClose,
  children,
  width = 'medium',
  className = '',
}: DetailPanelProps) {
  return (
    <aside className={`cct-detail-panel cct-detail-panel-${width} ${className}`}>
      <div className="cct-detail-panel-header">
        <div className="cct-detail-panel-title-group">
          <h3 className="cct-detail-panel-title">{title}</h3>
          {subtitle && <p className="cct-detail-panel-subtitle">{subtitle}</p>}
        </div>
        {onClose && (
          <button className="cct-detail-panel-close" onClick={onClose} aria-label="Close panel">
            &times;
          </button>
        )}
      </div>
      <div className="cct-detail-panel-body">
        {children}
      </div>
    </aside>
  );
}

export function DetailSection({
  title,
  actions,
  children,
  collapsible = false,
  defaultCollapsed = false,
}: DetailSectionProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <section className={`cct-detail-section ${collapsed ? 'cct-detail-section-collapsed' : ''}`}>
      <div className="cct-detail-section-header">
        <h4
          className="cct-detail-section-title"
          onClick={collapsible ? () => setCollapsed(!collapsed) : undefined}
          style={collapsible ? { cursor: 'pointer' } : undefined}
        >
          {collapsible && (
            <span className="cct-collapse-indicator">{collapsed ? '\u25B6' : '\u25BC'}</span>
          )}
          {title}
        </h4>
        {actions && <div className="cct-detail-section-actions">{actions}</div>}
      </div>
      {!collapsed && <div className="cct-detail-section-body">{children}</div>}
    </section>
  );
}
