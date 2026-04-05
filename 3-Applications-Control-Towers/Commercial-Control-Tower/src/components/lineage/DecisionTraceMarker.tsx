import React from 'react';

export interface DecisionTraceMarkerProps {
  traceId: string;
  decisionType: 'promotion' | 'rejection' | 'constraint_pass' | 'constraint_fail' | 'violation';
  timestamp: string;
  actor: string;
  description: string;
  receiptId: string;
  className?: string;
}

/**
 * DecisionTraceMarker
 *
 * Marker showing a decision trace point in the timeline.
 * Decisions are immutable records -- this is a read-only visualization.
 */
export const DecisionTraceMarker: React.FC<DecisionTraceMarkerProps> = ({
  traceId,
  decisionType,
  timestamp,
  actor,
  description,
  receiptId,
  className,
}) => {
  const typeLabels: Record<string, string> = {
    promotion: 'Promoted',
    rejection: 'Rejected',
    constraint_pass: 'Constraint Passed',
    constraint_fail: 'Constraint Failed',
    violation: 'Violation Detected',
  };

  const typeIcons: Record<string, string> = {
    promotion: '▲',
    rejection: '▼',
    constraint_pass: '✓',
    constraint_fail: '✗',
    violation: '⚠',
  };

  return (
    <div
      className={`cct-decision-trace-marker cct-decision-trace-marker--${decisionType} ${className || ''}`}
      data-component="decision-trace-marker"
      data-trace-id={traceId}
      data-decision-type={decisionType}
      data-receipt-id={receiptId}
      role="listitem"
      aria-label={`Decision: ${typeLabels[decisionType]}`}
    >
      <span className="cct-decision-trace-marker__icon" aria-hidden="true">
        {typeIcons[decisionType]}
      </span>
      <div className="cct-decision-trace-marker__content">
        <span className="cct-decision-trace-marker__type">{typeLabels[decisionType]}</span>
        <span className="cct-decision-trace-marker__description">{description}</span>
        <div className="cct-decision-trace-marker__meta">
          <span className="cct-decision-trace-marker__actor">{actor}</span>
          <time className="cct-decision-trace-marker__time">{timestamp}</time>
        </div>
      </div>
    </div>
  );
};

export default DecisionTraceMarker;
