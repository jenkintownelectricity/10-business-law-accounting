import React from 'react';

type Criticality = 'critical' | 'high' | 'medium' | 'low';
type DeadlineStatus = 'upcoming' | 'due-today' | 'overdue' | 'completed';

interface Deadline {
  id: string;
  title: string;
  date: string;
  time: string | null;
  criticality: Criticality;
  status: DeadlineStatus;
  sourceType: 'matter' | 'contract' | 'obligation' | 'manual';
  sourceId: string;
  sourceTitle: string;
  kernels: Array<'business' | 'law' | 'accounting'>;
  daysRemaining: number;
  assignee: string | null;
}

const PLACEHOLDER_DEADLINES: Deadline[] = [];

const CRITICALITY_LABELS: Record<Criticality, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const STATUS_LABELS: Record<DeadlineStatus, string> = {
  upcoming: 'Upcoming',
  'due-today': 'Due Today',
  overdue: 'Overdue',
  completed: 'Completed',
};

export function DeadlinesPage() {
  const deadlines = PLACEHOLDER_DEADLINES;
  const viewMode: 'timeline' | 'list' = 'timeline';

  return (
    <div className="cct-page cct-page-deadlines">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Deadlines</h2>
        <div className="cct-page-actions">
          <div className="cct-view-toggle">
            <button className={`cct-view-btn ${viewMode === 'timeline' ? 'cct-view-active' : ''}`}>Timeline</button>
            <button className={`cct-view-btn ${viewMode === 'list' ? 'cct-view-active' : ''}`}>List</button>
          </div>
          <button className="cct-btn cct-btn-primary">Add Deadline</button>
        </div>
      </div>

      <div className="cct-deadline-summary">
        <div className="cct-summary-card cct-summary-danger">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Overdue</span>
        </div>
        <div className="cct-summary-card cct-summary-warning">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Due Today</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">This Week</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">This Month</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Criticality</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Source</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Sources</option>
            <option value="matter">Matters</option>
            <option value="contract">Contracts</option>
            <option value="obligation">Obligations</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Kernel</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Kernels</option>
            <option value="business">Business</option>
            <option value="law">Law</option>
            <option value="accounting">Accounting</option>
          </select>
        </div>
      </div>

      {/* Timeline View */}
      <div className="cct-timeline-container">
        {deadlines.length === 0 ? (
          <div className="cct-empty-state cct-empty-state-large">
            <p className="cct-empty-title">No deadlines tracked</p>
            <p className="cct-empty-description">Deadlines are aggregated from matters, contracts, obligations, and manual entries. They appear here color-coded by criticality.</p>
          </div>
        ) : (
          <div className="cct-timeline">
            {deadlines.map(deadline => (
              <div key={deadline.id} className={`cct-timeline-item cct-timeline-${deadline.criticality}`}>
                <div className="cct-timeline-marker">
                  <span className={`cct-timeline-dot cct-criticality-${deadline.criticality}`} />
                </div>
                <div className="cct-timeline-content">
                  <div className="cct-timeline-date">
                    <span className="cct-timeline-day">{deadline.date}</span>
                    {deadline.time && <span className="cct-timeline-time">{deadline.time}</span>}
                  </div>
                  <div className="cct-timeline-details">
                    <h4 className="cct-timeline-title">{deadline.title}</h4>
                    <div className="cct-timeline-meta">
                      <span className={`cct-criticality-badge cct-criticality-${deadline.criticality}`}>
                        {CRITICALITY_LABELS[deadline.criticality]}
                      </span>
                      <span className={`cct-status-badge cct-status-${deadline.status}`}>
                        {STATUS_LABELS[deadline.status]}
                      </span>
                      <a href={`/${deadline.sourceType}s/${deadline.sourceId}`} className="cct-link">
                        {deadline.sourceTitle}
                      </a>
                      <div className="cct-kernel-tags">
                        {deadline.kernels.map(k => (
                          <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
                        ))}
                      </div>
                    </div>
                    {deadline.assignee && (
                      <span className="cct-timeline-assignee">Assigned: {deadline.assignee}</span>
                    )}
                  </div>
                  <div className="cct-timeline-countdown">
                    {deadline.daysRemaining < 0
                      ? <span className="cct-countdown-overdue">{Math.abs(deadline.daysRemaining)}d overdue</span>
                      : deadline.daysRemaining === 0
                        ? <span className="cct-countdown-today">Today</span>
                        : <span className="cct-countdown-remaining">{deadline.daysRemaining}d remaining</span>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
