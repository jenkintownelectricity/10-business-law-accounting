import React from 'react';

interface ReplayBadgeProps {
  active: boolean;
}

export function ReplayBadge({ active }: ReplayBadgeProps) {
  if (!active) return null;
  return (
    <div className="replay-badge" role="status" aria-label="Replay mode active">
      <span className="replay-badge-dot" />
      <span className="replay-badge-label">REPLAY</span>
    </div>
  );
}
