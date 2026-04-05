import React from 'react';

type TrustLevel = 'verified' | 'high' | 'medium' | 'low' | 'unverified';
type ReviewPriority = 'critical' | 'high' | 'normal' | 'low';

interface ReviewQueueItemData {
  id: string;
  title: string;
  description: string;
  sourceTrustLevel: TrustLevel;
  priority: ReviewPriority;
  category: string;
  kernels: Array<'business' | 'law' | 'accounting'>;
  submittedDate: string;
  sourceLabel: string;
}

interface ReviewQueueItemProps {
  item: ReviewQueueItemData;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDefer?: (id: string) => void;
  onSelect?: (id: string) => void;
  selected?: boolean;
  className?: string;
}

const TRUST_LABELS: Record<TrustLevel, string> = {
  verified: 'Verified',
  high: 'High Trust',
  medium: 'Medium Trust',
  low: 'Low Trust',
  unverified: 'Unverified',
};

const PRIORITY_LABELS: Record<ReviewPriority, string> = {
  critical: 'Critical',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

export function ReviewQueueItem({
  item,
  onApprove,
  onReject,
  onDefer,
  onSelect,
  selected = false,
  className = '',
}: ReviewQueueItemProps) {
  return (
    <div
      className={[
        'cct-review-queue-item',
        `cct-review-priority-${item.priority}`,
        selected ? 'cct-review-selected' : '',
        className,
      ].filter(Boolean).join(' ')}
      onClick={onSelect ? () => onSelect(item.id) : undefined}
    >
      <div className="cct-review-queue-item-left">
        <span className={`cct-priority-indicator cct-priority-${item.priority}`} title={PRIORITY_LABELS[item.priority]} />
        <div className="cct-review-queue-item-content">
          <h4 className="cct-review-queue-item-title">{item.title}</h4>
          <p className="cct-review-queue-item-description">{item.description}</p>
          <div className="cct-review-queue-item-meta">
            <span className={`cct-trust-badge cct-trust-${item.sourceTrustLevel}`}>
              {TRUST_LABELS[item.sourceTrustLevel]}
            </span>
            <span className="cct-review-queue-item-source">{item.sourceLabel}</span>
            <span className="cct-review-queue-item-category">{item.category}</span>
            <div className="cct-kernel-tags">
              {item.kernels.map(k => (
                <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
              ))}
            </div>
            <span className="cct-review-queue-item-date">{item.submittedDate}</span>
          </div>
        </div>
      </div>
      <div className="cct-review-queue-item-actions">
        {onApprove && (
          <button
            className="cct-btn cct-btn-sm cct-btn-approve"
            onClick={e => { e.stopPropagation(); onApprove(item.id); }}
          >
            Approve
          </button>
        )}
        {onReject && (
          <button
            className="cct-btn cct-btn-sm cct-btn-reject"
            onClick={e => { e.stopPropagation(); onReject(item.id); }}
          >
            Reject
          </button>
        )}
        {onDefer && (
          <button
            className="cct-btn cct-btn-sm cct-btn-ghost"
            onClick={e => { e.stopPropagation(); onDefer(item.id); }}
          >
            Defer
          </button>
        )}
      </div>
    </div>
  );
}
