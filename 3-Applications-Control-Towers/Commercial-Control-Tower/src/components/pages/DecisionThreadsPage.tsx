import React from 'react';

type KernelAssessment = 'approved' | 'pending' | 'flagged' | 'rejected' | 'not-applicable';
type BundleStatus = 'open' | 'resolved' | 'escalated' | 'deferred';

interface DecisionThread {
  id: string;
  title: string;
  summary: string;
  status: BundleStatus;
  priority: 'critical' | 'high' | 'medium' | 'low';
  matterId: string | null;
  matterTitle: string | null;
  businessAssessment: KernelAssessment;
  lawAssessment: KernelAssessment;
  accountingAssessment: KernelAssessment;
  createdDate: string;
  lastActivity: string;
  participantCount: number;
  commentCount: number;
}

const PLACEHOLDER_THREADS: DecisionThread[] = [];

const STATUS_LABELS: Record<BundleStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
  escalated: 'Escalated',
  deferred: 'Deferred',
};

const ASSESSMENT_LABELS: Record<KernelAssessment, string> = {
  approved: 'Approved',
  pending: 'Pending',
  flagged: 'Flagged',
  rejected: 'Rejected',
  'not-applicable': 'N/A',
};

export function DecisionThreadsPage() {
  const threads = PLACEHOLDER_THREADS;

  return (
    <div className="cct-page cct-page-decisions">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Decision Threads</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-primary">New Decision Thread</button>
        </div>
      </div>

      <div className="cct-decision-summary">
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Open Threads</span>
        </div>
        <div className="cct-summary-card cct-summary-warning">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Escalated</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Awaiting Assessment</span>
        </div>
        <div className="cct-summary-card cct-summary-success">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Resolved This Week</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Status</label>
          <select className="cct-filter-select" defaultValue="open">
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="escalated">Escalated</option>
            <option value="deferred">Deferred</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Assessment Status</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">Any</option>
            <option value="all-approved">All Kernels Approved</option>
            <option value="any-flagged">Any Kernel Flagged</option>
            <option value="any-pending">Any Kernel Pending</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Priority</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="cct-decision-list">
        {threads.length === 0 ? (
          <div className="cct-empty-state cct-empty-state-large">
            <p className="cct-empty-title">No decision threads</p>
            <p className="cct-empty-description">Decision threads capture multi-kernel deliberation. Each thread tracks assessments from Business, Law, and Accounting perspectives.</p>
          </div>
        ) : (
          threads.map(thread => (
            <div key={thread.id} className="cct-decision-card">
              <div className="cct-decision-card-header">
                <div className="cct-decision-card-title-row">
                  <span className={`cct-priority-indicator cct-priority-${thread.priority}`} />
                  <a href={`/decisions/${thread.id}`} className="cct-decision-card-title">{thread.title}</a>
                  <span className={`cct-status-badge cct-status-${thread.status}`}>
                    {STATUS_LABELS[thread.status]}
                  </span>
                </div>
                <p className="cct-decision-card-summary">{thread.summary}</p>
              </div>

              <div className="cct-decision-assessments">
                <div className={`cct-assessment cct-assessment-${thread.businessAssessment}`}>
                  <span className="cct-assessment-kernel">Business</span>
                  <span className="cct-assessment-status">{ASSESSMENT_LABELS[thread.businessAssessment]}</span>
                </div>
                <div className={`cct-assessment cct-assessment-${thread.lawAssessment}`}>
                  <span className="cct-assessment-kernel">Law</span>
                  <span className="cct-assessment-status">{ASSESSMENT_LABELS[thread.lawAssessment]}</span>
                </div>
                <div className={`cct-assessment cct-assessment-${thread.accountingAssessment}`}>
                  <span className="cct-assessment-kernel">Accounting</span>
                  <span className="cct-assessment-status">{ASSESSMENT_LABELS[thread.accountingAssessment]}</span>
                </div>
              </div>

              <div className="cct-decision-card-footer">
                {thread.matterTitle && (
                  <a href={`/matters/${thread.matterId}`} className="cct-link">{thread.matterTitle}</a>
                )}
                <span className="cct-decision-meta">{thread.commentCount} comments</span>
                <span className="cct-decision-meta">{thread.participantCount} participants</span>
                <span className="cct-decision-meta">Last activity: {thread.lastActivity}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
