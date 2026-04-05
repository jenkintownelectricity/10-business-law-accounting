import React from 'react';

interface QueueCounterProps {
  count: number;
  hasUrgent: boolean;
  onClick?: () => void;
}

/**
 * QueueCounter
 * Small counter badge showing number of active queue items.
 * Displays crimson styling when urgent items are present.
 */
export function QueueCounter({ count, hasUrgent, onClick }: QueueCounterProps) {
  if (count === 0) return null;

  return (
    <button
      className={`cct-queue-counter ${hasUrgent ? 'cct-queue-counter-urgent' : ''}`}
      onClick={onClick}
      aria-label={`${count} attention queue item${count !== 1 ? 's' : ''}${hasUrgent ? ', urgent items present' : ''}`}
      type="button"
    >
      <span className="cct-queue-counter-value">{count > 99 ? '99+' : count}</span>
    </button>
  );
}
