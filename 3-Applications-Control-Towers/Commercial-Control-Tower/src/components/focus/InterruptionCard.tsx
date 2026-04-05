import React from 'react';

interface InterruptionCardProps {
  id: string;
  title: string;
  summary: string;
  source: string;
  violationType: string;
  severity: 'critical' | 'high';
  onInspect: (id: string) => void;
  onDefer: (id: string) => void;
  onQuiet: (id: string) => void;
}

/**
 * InterruptionCard
 * Card for critical violations with crimson framing.
 * Shows violation summary with inspect, defer, and quiet actions.
 */
export function InterruptionCard({
  id,
  title,
  summary,
  source,
  violationType,
  severity,
  onInspect,
  onDefer,
  onQuiet,
}: InterruptionCardProps) {
  return (
    <div
      className={`cct-interruption-card cct-interruption-${severity}`}
      role="alert"
      aria-live="assertive"
      style={{ borderColor: 'var(--cct-crimson, #dc2626)' }}
    >
      <div className="cct-interruption-header">
        <span className="cct-badge cct-badge-crimson">{severity.toUpperCase()}</span>
        <span className="cct-interruption-violation-type">{violationType}</span>
        <span className="cct-interruption-source">{source}</span>
      </div>
      <div className="cct-interruption-title">{title}</div>
      <div className="cct-interruption-summary">{summary}</div>
      <div className="cct-interruption-actions">
        <button onClick={() => onInspect(id)} className="cct-btn-ghost cct-btn-inspect">
          Inspect
        </button>
        <button onClick={() => onDefer(id)} className="cct-btn-ghost cct-btn-defer">
          Defer
        </button>
        <button onClick={() => onQuiet(id)} className="cct-btn-ghost cct-btn-quiet">
          Quiet
        </button>
      </div>
    </div>
  );
}
