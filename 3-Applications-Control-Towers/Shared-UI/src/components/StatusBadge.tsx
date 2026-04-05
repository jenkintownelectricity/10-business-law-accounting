import React from 'react';

type BadgeVariant = 'active' | 'pending' | 'closed' | 'on-hold' | 'draft' | 'expired' |
  'terminated' | 'under-review' | 'overdue' | 'completed' | 'waived' | 'in-progress' |
  'posted' | 'voided' | 'reconciled' | 'escalated' | 'deferred' | 'resolved' |
  'open' | 'in-review' | 'approved' | 'rejected' | 'inactive' | 'prospect' |
  'validated' | 'pending-validation' | 'unvalidated' | 'suspended' |
  'connected' | 'disconnected' | 'error' | 'info' | 'warning' | 'critical' | 'neutral';

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, variant, size = 'md', className = '' }: StatusBadgeProps) {
  const effectiveVariant = variant ?? status.toLowerCase().replace(/\s+/g, '-') as BadgeVariant;

  return (
    <span
      className={[
        'cct-status-badge',
        `cct-status-${effectiveVariant}`,
        size === 'sm' ? 'cct-status-badge-sm' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {status}
    </span>
  );
}
