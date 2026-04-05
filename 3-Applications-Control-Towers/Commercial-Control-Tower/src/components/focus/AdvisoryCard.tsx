import React from 'react';

interface AdvisoryCardProps {
  id: string;
  title: string;
  summary: string;
  source: string;
  confidence?: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  onPreview: (id: string) => void;
  onDismiss: (id: string) => void;
  onPromote: (id: string) => void;
}

export function AdvisoryCard({ id, title, summary, source, confidence, urgency, onPreview, onDismiss, onPromote }: AdvisoryCardProps) {
  return (
    <div className={`cct-advisory-card cct-advisory-${urgency}`} role="listitem">
      <div className="cct-advisory-header">
        <span className={`cct-badge cct-badge-${urgency}`}>{urgency}</span>
        <span className="cct-advisory-source">{source}</span>
        {confidence !== undefined && <span className="cct-advisory-confidence">{Math.round(confidence * 100)}%</span>}
      </div>
      <div className="cct-advisory-title">{title}</div>
      <div className="cct-advisory-summary">{summary}</div>
      <div className="cct-advisory-actions">
        <button onClick={() => onPreview(id)} className="cct-btn-ghost">Preview</button>
        <button onClick={() => onPromote(id)} className="cct-btn-ghost cct-btn-promote">Inspect</button>
        <button onClick={() => onDismiss(id)} className="cct-btn-ghost cct-btn-dismiss">Dismiss</button>
      </div>
    </div>
  );
}
