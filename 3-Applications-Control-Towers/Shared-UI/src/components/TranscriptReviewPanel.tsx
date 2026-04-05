import React from 'react';

interface TranscriptLine {
  id: string;
  timestamp: string;
  originalText: string;
  normalizedText: string | null;
  confidence: number;
  status: 'pending' | 'accepted' | 'rejected' | 'edited';
  editedText: string | null;
}

interface TranscriptReviewPanelProps {
  lines: TranscriptLine[];
  onAccept: (lineId: string) => void;
  onReject: (lineId: string) => void;
  onEdit: (lineId: string, newText: string) => void;
  onAcceptAll: () => void;
  title?: string;
  className?: string;
}

export function TranscriptReviewPanel({
  lines,
  onAccept,
  onReject,
  onEdit,
  onAcceptAll,
  title = 'Transcript Review',
  className = '',
}: TranscriptReviewPanelProps) {
  const pendingCount = lines.filter(l => l.status === 'pending').length;

  return (
    <div className={`cct-transcript-review ${className}`}>
      <div className="cct-transcript-review-header">
        <h3 className="cct-panel-title">{title}</h3>
        <div className="cct-transcript-review-actions">
          <span className="cct-transcript-review-count">{pendingCount} pending</span>
          {pendingCount > 0 && (
            <button className="cct-btn cct-btn-sm cct-btn-approve" onClick={onAcceptAll}>
              Accept All
            </button>
          )}
        </div>
      </div>

      <div className="cct-transcript-review-body">
        {lines.length === 0 ? (
          <div className="cct-empty-state">
            <p className="cct-empty-description">No transcript lines to review.</p>
          </div>
        ) : (
          <div className="cct-transcript-lines">
            {lines.map(line => (
              <div
                key={line.id}
                className={`cct-transcript-review-line cct-transcript-${line.status}`}
              >
                <div className="cct-transcript-review-line-header">
                  <span className="cct-transcript-time">{line.timestamp}</span>
                  <span className={`cct-confidence-badge ${
                    line.confidence >= 0.9 ? 'cct-confidence-high' :
                    line.confidence >= 0.7 ? 'cct-confidence-medium' :
                    'cct-confidence-low'
                  }`}>
                    {Math.round(line.confidence * 100)}%
                  </span>
                  <span className={`cct-status-badge cct-status-badge-sm cct-status-${line.status}`}>
                    {line.status}
                  </span>
                </div>

                <div className="cct-transcript-review-line-text">
                  <div className="cct-transcript-original">
                    <span className="cct-transcript-text-label">Original</span>
                    <span className="cct-transcript-text-value">{line.originalText}</span>
                  </div>
                  {line.normalizedText && line.normalizedText !== line.originalText && (
                    <div className="cct-transcript-normalized">
                      <span className="cct-transcript-text-label">Normalized</span>
                      <span className="cct-transcript-text-value">{line.normalizedText}</span>
                    </div>
                  )}
                  {line.editedText && (
                    <div className="cct-transcript-edited">
                      <span className="cct-transcript-text-label">Edited</span>
                      <span className="cct-transcript-text-value">{line.editedText}</span>
                    </div>
                  )}
                </div>

                {line.status === 'pending' && (
                  <div className="cct-transcript-review-line-actions">
                    <button
                      className="cct-btn cct-btn-xs cct-btn-approve"
                      onClick={() => onAccept(line.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="cct-btn cct-btn-xs cct-btn-reject"
                      onClick={() => onReject(line.id)}
                    >
                      Reject
                    </button>
                    <button
                      className="cct-btn cct-btn-xs cct-btn-ghost"
                      onClick={() => {
                        const newText = line.normalizedText ?? line.originalText;
                        onEdit(line.id, newText);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
