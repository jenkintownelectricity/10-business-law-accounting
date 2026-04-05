import React from 'react';

type TrustLevel = 'verified' | 'high' | 'medium' | 'low' | 'unverified';
type ReviewPriority = 'critical' | 'high' | 'normal' | 'low';
type ReviewStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'deferred';

interface ReviewItem {
  id: string;
  title: string;
  description: string;
  sourceType: string;
  sourceId: string;
  sourceTrustLevel: TrustLevel;
  priority: ReviewPriority;
  status: ReviewStatus;
  submittedDate: string;
  kernels: Array<'business' | 'law' | 'accounting'>;
  assignee: string | null;
  category: 'data-entry' | 'voice-capture' | 'import' | 'ai-suggestion' | 'escalation';
}

const PLACEHOLDER_ITEMS: ReviewItem[] = [];

const TRUST_LABELS: Record<TrustLevel, string> = {
  verified: 'Verified',
  high: 'High Trust',
  medium: 'Medium Trust',
  low: 'Low Trust',
  unverified: 'Unverified',
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pending',
  'in-review': 'In Review',
  approved: 'Approved',
  rejected: 'Rejected',
  deferred: 'Deferred',
};

const PRIORITY_LABELS: Record<ReviewPriority, string> = {
  critical: 'Critical',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

export function ReviewQueuePage() {
  const items = PLACEHOLDER_ITEMS;

  return (
    <div className="cct-page cct-page-review-queue">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Review Queue</h2>
        <div className="cct-page-actions">
          <span className="cct-queue-count">0 items pending</span>
        </div>
      </div>

      <div className="cct-review-summary">
        <div className="cct-summary-card cct-summary-danger">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Critical</span>
        </div>
        <div className="cct-summary-card cct-summary-warning">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">High Priority</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Normal</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Low Trust Source</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Priority</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Trust Level</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Levels</option>
            <option value="unverified">Unverified</option>
            <option value="low">Low Trust</option>
            <option value="medium">Medium Trust</option>
            <option value="high">High Trust</option>
            <option value="verified">Verified</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Category</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Categories</option>
            <option value="voice-capture">Voice Capture</option>
            <option value="data-entry">Data Entry</option>
            <option value="import">Import</option>
            <option value="ai-suggestion">AI Suggestion</option>
            <option value="escalation">Escalation</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Status</label>
          <select className="cct-filter-select" defaultValue="pending">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="deferred">Deferred</option>
          </select>
        </div>
      </div>

      <div className="cct-review-list">
        {items.length === 0 ? (
          <div className="cct-empty-state cct-empty-state-large">
            <p className="cct-empty-title">Review queue is empty</p>
            <p className="cct-empty-description">Items requiring human review appear here, sorted by priority and source trust level. Voice captures, AI suggestions, and low-trust imports are routed here before sovereign use.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`cct-review-card cct-review-priority-${item.priority}`}>
              <div className="cct-review-card-left">
                <span className={`cct-priority-indicator cct-priority-${item.priority}`} />
                <div className="cct-review-card-info">
                  <h4 className="cct-review-card-title">{item.title}</h4>
                  <p className="cct-review-card-description">{item.description}</p>
                  <div className="cct-review-card-meta">
                    <span className={`cct-trust-badge cct-trust-${item.sourceTrustLevel}`}>
                      {TRUST_LABELS[item.sourceTrustLevel]}
                    </span>
                    <span className="cct-review-category">{item.category}</span>
                    <div className="cct-kernel-tags">
                      {item.kernels.map(k => (
                        <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
                      ))}
                    </div>
                    <span className="cct-review-date">{item.submittedDate}</span>
                  </div>
                </div>
              </div>
              <div className="cct-review-card-right">
                <span className={`cct-status-badge cct-status-${item.status}`}>
                  {STATUS_LABELS[item.status]}
                </span>
                <div className="cct-review-actions">
                  <button className="cct-btn cct-btn-sm cct-btn-approve">Approve</button>
                  <button className="cct-btn cct-btn-sm cct-btn-reject">Reject</button>
                  <button className="cct-btn cct-btn-sm cct-btn-ghost">Defer</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
