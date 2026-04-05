import React from 'react';

interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  kernel?: 'business' | 'law' | 'accounting';
  type?: string;
  actor?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  emptyMessage?: string;
  className?: string;
}

export function Timeline({ events, emptyMessage = 'No events to display', className = '' }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className={`cct-timeline-empty ${className}`}>
        <div className="cct-empty-state">
          <p className="cct-empty-description">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`cct-timeline ${className}`}>
      {events.map((event, index) => (
        <div key={event.id} className="cct-timeline-item">
          <div className="cct-timeline-marker">
            <span
              className={[
                'cct-timeline-dot',
                event.kernel ? `cct-timeline-dot-${event.kernel}` : '',
              ].filter(Boolean).join(' ')}
            />
            {index < events.length - 1 && <span className="cct-timeline-line" />}
          </div>
          <div className="cct-timeline-content">
            <div className="cct-timeline-header">
              <span className="cct-timeline-timestamp">{event.timestamp}</span>
              {event.kernel && (
                <span className={`cct-kernel-tag cct-kernel-${event.kernel}`}>{event.kernel}</span>
              )}
              {event.type && <span className="cct-timeline-type">{event.type}</span>}
            </div>
            <h4 className="cct-timeline-title">{event.title}</h4>
            {event.description && (
              <p className="cct-timeline-description">{event.description}</p>
            )}
            {event.actor && (
              <span className="cct-timeline-actor">{event.actor}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
