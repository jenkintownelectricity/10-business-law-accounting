import React from 'react';

type SessionStatus = 'idle' | 'active' | 'paused' | 'completed' | 'error';

interface ExtractedCandidate {
  id: string;
  type: string;
  value: string;
  confidence: number;
  kernel: 'business' | 'law' | 'accounting';
  status: 'pending' | 'accepted' | 'rejected';
}

interface AdvisoryPacket {
  id: string;
  kernel: 'business' | 'law' | 'accounting';
  summary: string;
  severity: 'info' | 'warning' | 'critical';
  reviewed: boolean;
}

interface ListeningSessionPanelProps {
  status: SessionStatus;
  duration: number;
  candidateCount: number;
  candidates: ExtractedCandidate[];
  advisoryPackets: AdvisoryPacket[];
  onAcceptCandidate: (id: string) => void;
  onRejectCandidate: (id: string) => void;
  onReviewAdvisory: (id: string) => void;
  className?: string;
}

const STATUS_LABELS: Record<SessionStatus, string> = {
  idle: 'Not Started',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  error: 'Error',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function ListeningSessionPanel({
  status,
  duration,
  candidateCount,
  candidates,
  advisoryPackets,
  onAcceptCandidate,
  onRejectCandidate,
  onReviewAdvisory,
  className = '',
}: ListeningSessionPanelProps) {
  return (
    <div className={`cct-listening-session ${className}`}>
      <div className="cct-listening-session-header">
        <h3 className="cct-panel-title">Listening Session</h3>
        <div className="cct-listening-session-status">
          <span className={`cct-session-status-dot cct-session-${status}`} />
          <span className="cct-session-status-label">{STATUS_LABELS[status]}</span>
          {status !== 'idle' && (
            <span className="cct-session-duration">{formatDuration(duration)}</span>
          )}
        </div>
      </div>

      <div className="cct-listening-session-summary">
        <div className="cct-session-stat">
          <span className="cct-session-stat-number">{candidateCount}</span>
          <span className="cct-session-stat-label">Candidates Extracted</span>
        </div>
        <div className="cct-session-stat">
          <span className="cct-session-stat-number">{candidates.filter(c => c.status === 'pending').length}</span>
          <span className="cct-session-stat-label">Pending Review</span>
        </div>
        <div className="cct-session-stat">
          <span className="cct-session-stat-number">{advisoryPackets.filter(p => !p.reviewed).length}</span>
          <span className="cct-session-stat-label">Unreviewed Advisories</span>
        </div>
      </div>

      {/* Extracted Candidates */}
      <div className="cct-listening-section">
        <h4 className="cct-listening-section-title">Extracted Candidates</h4>
        {candidates.length === 0 ? (
          <div className="cct-empty-state">
            <p className="cct-empty-description">No candidates extracted yet.</p>
          </div>
        ) : (
          <div className="cct-candidate-list">
            {candidates.map(candidate => (
              <div key={candidate.id} className={`cct-candidate-row cct-candidate-${candidate.status}`}>
                <span className={`cct-kernel-tag cct-kernel-${candidate.kernel}`}>{candidate.kernel}</span>
                <span className="cct-candidate-type">{candidate.type}</span>
                <span className="cct-candidate-value">{candidate.value}</span>
                <span className="cct-candidate-confidence">{Math.round(candidate.confidence * 100)}%</span>
                {candidate.status === 'pending' && (
                  <div className="cct-candidate-actions">
                    <button
                      className="cct-btn cct-btn-xs cct-btn-approve"
                      onClick={() => onAcceptCandidate(candidate.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="cct-btn cct-btn-xs cct-btn-reject"
                      onClick={() => onRejectCandidate(candidate.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
                {candidate.status !== 'pending' && (
                  <span className={`cct-candidate-status-label cct-candidate-status-${candidate.status}`}>
                    {candidate.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advisory Packets */}
      <div className="cct-listening-section">
        <h4 className="cct-listening-section-title">Advisory Packets</h4>
        {advisoryPackets.length === 0 ? (
          <div className="cct-empty-state">
            <p className="cct-empty-description">No advisory packets generated.</p>
          </div>
        ) : (
          <div className="cct-advisory-list">
            {advisoryPackets.map(packet => (
              <div key={packet.id} className={`cct-advisory-row cct-advisory-${packet.severity}`}>
                <span className={`cct-kernel-tag cct-kernel-${packet.kernel}`}>{packet.kernel}</span>
                <span className={`cct-advisory-severity cct-severity-${packet.severity}`}>
                  {packet.severity}
                </span>
                <span className="cct-advisory-summary">{packet.summary}</span>
                {!packet.reviewed && (
                  <button
                    className="cct-btn cct-btn-xs cct-btn-ghost"
                    onClick={() => onReviewAdvisory(packet.id)}
                  >
                    Review
                  </button>
                )}
                {packet.reviewed && (
                  <span className="cct-advisory-reviewed">Reviewed</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
