import React from 'react';

export type ListeningStatus = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'ERROR';

export interface IronEarMonitorProps {
  status: ListeningStatus;
  sessionActive: boolean;
  advisoryCount: number;
  waveformLevel: number; // 0-1
  className?: string;
}

/**
 * IronEarMonitor
 *
 * Compact monitor for Iron Ear listening status.
 * Shows waveform indicator, session state, advisory count.
 *
 * This is a read-only display. It does not control Iron Ear --
 * all control signals route through VKBUS.
 */
export const IronEarMonitor: React.FC<IronEarMonitorProps> = ({
  status,
  sessionActive,
  advisoryCount,
  waveformLevel,
  className,
}) => {
  const statusLabels: Record<ListeningStatus, string> = {
    IDLE: 'Idle',
    LISTENING: 'Listening',
    PROCESSING: 'Processing',
    ERROR: 'Error',
  };

  const waveformBars = Array.from({ length: 5 }, (_, i) => {
    const threshold = (i + 1) / 5;
    const active = waveformLevel >= threshold && status === 'LISTENING';
    return active;
  });

  return (
    <div
      className={`cct-iron-ear-monitor cct-iron-ear-monitor--${status.toLowerCase()} ${className || ''}`}
      data-component="iron-ear-monitor"
      data-status={status}
      data-session-active={sessionActive}
      role="status"
      aria-label={`Iron Ear: ${statusLabels[status]}`}
    >
      <div className="cct-iron-ear-monitor__waveform" aria-hidden="true">
        {waveformBars.map((active, i) => (
          <span
            key={i}
            className={`cct-iron-ear-monitor__bar ${active ? 'cct-iron-ear-monitor__bar--active' : ''}`}
          />
        ))}
      </div>
      <div className="cct-iron-ear-monitor__info">
        <span className="cct-iron-ear-monitor__status">{statusLabels[status]}</span>
        <span className={`cct-iron-ear-monitor__session ${sessionActive ? 'cct-iron-ear-monitor__session--active' : ''}`}>
          {sessionActive ? 'Session Active' : 'No Session'}
        </span>
      </div>
      {advisoryCount > 0 && (
        <span
          className="cct-iron-ear-monitor__advisory-count"
          aria-label={`${advisoryCount} advisory items`}
        >
          {advisoryCount}
        </span>
      )}
    </div>
  );
};

export default IronEarMonitor;
