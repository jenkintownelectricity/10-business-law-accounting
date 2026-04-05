import React from 'react';

type SessionState = 'idle' | 'listening' | 'processing' | 'paused' | 'error';
type CaptureMode = 'dictation' | 'command' | 'listening-session';

interface VoiceSession {
  id: string;
  state: SessionState;
  mode: CaptureMode;
  startTime: string | null;
  duration: number;
  transcriptLines: TranscriptLine[];
  extractedCandidates: ExtractedCandidate[];
  advisoryPackets: AdvisoryPacket[];
  commandHistory: SpokenCommand[];
}

interface TranscriptLine {
  id: string;
  timestamp: string;
  text: string;
  confidence: number;
  reviewed: boolean;
  normalized: boolean;
  editedText: string | null;
}

interface ExtractedCandidate {
  id: string;
  type: string;
  value: string;
  confidence: number;
  kernel: 'business' | 'law' | 'accounting';
  status: 'pending-review' | 'accepted' | 'rejected';
}

interface AdvisoryPacket {
  id: string;
  summary: string;
  kernel: 'business' | 'law' | 'accounting';
  severity: 'info' | 'warning' | 'critical';
  reviewed: boolean;
}

interface SpokenCommand {
  id: string;
  timestamp: string;
  rawText: string;
  normalizedCommand: string;
  executed: boolean;
  result: string | null;
}

const SESSION_STATE_LABELS: Record<SessionState, string> = {
  idle: 'Idle',
  listening: 'Listening',
  processing: 'Processing',
  paused: 'Paused',
  error: 'Error',
};

const INITIAL_SESSION: VoiceSession = {
  id: '',
  state: 'idle',
  mode: 'dictation',
  startTime: null,
  duration: 0,
  transcriptLines: [],
  extractedCandidates: [],
  advisoryPackets: [],
  commandHistory: [],
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function VoiceWorkspacePage() {
  const session = INITIAL_SESSION;

  return (
    <div className="cct-page cct-page-voice">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Voice Workspace</h2>
        <div className="cct-page-actions">
          <div className="cct-voice-session-state">
            <span className={`cct-mic-indicator cct-mic-${session.state}`} />
            <span className="cct-session-state-label">{SESSION_STATE_LABELS[session.state]}</span>
          </div>
        </div>
      </div>

      {/* Session Controls */}
      <div className="cct-voice-controls">
        <div className="cct-voice-controls-primary">
          <div className="cct-mode-selector">
            <label className="cct-filter-label">Mode</label>
            <div className="cct-view-toggle">
              <button className={`cct-view-btn ${session.mode === 'dictation' ? 'cct-view-active' : ''}`}>
                Dictation
              </button>
              <button className={`cct-view-btn ${session.mode === 'command' ? 'cct-view-active' : ''}`}>
                Command
              </button>
              <button className={`cct-view-btn ${session.mode === 'listening-session' ? 'cct-view-active' : ''}`}>
                Listening Session
              </button>
            </div>
          </div>

          <div className="cct-session-controls">
            <button
              className="cct-btn cct-btn-voice-start"
              disabled={session.state === 'listening'}
            >
              Start
            </button>
            <button
              className="cct-btn cct-btn-voice-pause"
              disabled={session.state !== 'listening'}
            >
              Pause
            </button>
            <button
              className="cct-btn cct-btn-voice-stop"
              disabled={session.state === 'idle'}
            >
              Stop
            </button>
          </div>

          <div className="cct-session-timer">
            <span className="cct-timer-display">{formatDuration(session.duration)}</span>
          </div>
        </div>

        <div className="cct-voice-controls-secondary">
          <label className="cct-hands-free-toggle">
            <input type="checkbox" className="cct-toggle-input" />
            <span className="cct-toggle-label">Hands-Free Mode</span>
          </label>
          <button className="cct-btn cct-btn-sm cct-btn-ghost">Read-Back</button>
        </div>
      </div>

      <div className="cct-voice-workspace-grid">
        {/* Dictation / Transcript Entry Area */}
        <section className="cct-voice-panel cct-voice-panel-transcript">
          <h3 className="cct-panel-title">Transcript</h3>
          <div className="cct-transcript-area">
            {session.transcriptLines.length === 0 ? (
              <div className="cct-empty-state">
                <p className="cct-empty-description">
                  {session.state === 'idle'
                    ? 'Start a session to begin capturing voice input.'
                    : 'Listening for input...'}
                </p>
              </div>
            ) : (
              <div className="cct-transcript-lines">
                {session.transcriptLines.map(line => (
                  <div key={line.id} className={`cct-transcript-line ${line.reviewed ? 'cct-transcript-reviewed' : ''}`}>
                    <span className="cct-transcript-time">{line.timestamp}</span>
                    <span className="cct-transcript-text">
                      {line.editedText ?? line.text}
                    </span>
                    <span className={`cct-transcript-confidence ${line.confidence >= 0.9 ? 'cct-confidence-high' : line.confidence >= 0.7 ? 'cct-confidence-medium' : 'cct-confidence-low'}`}>
                      {Math.round(line.confidence * 100)}%
                    </span>
                    <div className="cct-transcript-actions">
                      <button className="cct-btn cct-btn-xs cct-btn-ghost">Edit</button>
                      {!line.reviewed && (
                        <button className="cct-btn cct-btn-xs cct-btn-approve">Accept</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Language Normalization Review */}
        <section className="cct-voice-panel cct-voice-panel-normalization">
          <h3 className="cct-panel-title">Language Normalization</h3>
          <div className="cct-normalization-area">
            <div className="cct-empty-state">
              <p className="cct-empty-description">Normalized terms and domain-specific corrections will appear here for review.</p>
            </div>
          </div>
        </section>

        {/* Extracted Candidates */}
        <section className="cct-voice-panel cct-voice-panel-candidates">
          <h3 className="cct-panel-title">Extracted Candidates</h3>
          <div className="cct-candidates-list">
            {session.extractedCandidates.length === 0 ? (
              <div className="cct-empty-state">
                <p className="cct-empty-description">Structured data candidates extracted from speech will appear here for validation.</p>
              </div>
            ) : (
              session.extractedCandidates.map(candidate => (
                <div key={candidate.id} className={`cct-candidate-item cct-candidate-${candidate.status}`}>
                  <div className="cct-candidate-info">
                    <span className={`cct-kernel-tag cct-kernel-${candidate.kernel}`}>{candidate.kernel}</span>
                    <span className="cct-candidate-type">{candidate.type}</span>
                    <span className="cct-candidate-value">{candidate.value}</span>
                    <span className="cct-candidate-confidence">{Math.round(candidate.confidence * 100)}%</span>
                  </div>
                  <div className="cct-candidate-actions">
                    <button className="cct-btn cct-btn-xs cct-btn-approve">Accept</button>
                    <button className="cct-btn cct-btn-xs cct-btn-reject">Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Advisory Packets */}
        <section className="cct-voice-panel cct-voice-panel-advisory">
          <h3 className="cct-panel-title">Advisory Packets</h3>
          <div className="cct-advisory-list">
            {session.advisoryPackets.length === 0 ? (
              <div className="cct-empty-state">
                <p className="cct-empty-description">Kernel advisory packets triggered by voice input will appear here.</p>
              </div>
            ) : (
              session.advisoryPackets.map(packet => (
                <div key={packet.id} className={`cct-advisory-item cct-advisory-${packet.severity}`}>
                  <span className={`cct-kernel-tag cct-kernel-${packet.kernel}`}>{packet.kernel}</span>
                  <span className="cct-advisory-summary">{packet.summary}</span>
                  {!packet.reviewed && (
                    <button className="cct-btn cct-btn-xs cct-btn-ghost">Review</button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Command History */}
        <section className="cct-voice-panel cct-voice-panel-commands">
          <h3 className="cct-panel-title">Command History</h3>
          <div className="cct-command-list">
            {session.commandHistory.length === 0 ? (
              <div className="cct-empty-state">
                <p className="cct-empty-description">Spoken commands and their execution results will be logged here.</p>
              </div>
            ) : (
              session.commandHistory.map(cmd => (
                <div key={cmd.id} className={`cct-command-item ${cmd.executed ? 'cct-command-executed' : 'cct-command-failed'}`}>
                  <span className="cct-command-time">{cmd.timestamp}</span>
                  <div className="cct-command-detail">
                    <span className="cct-command-raw">{cmd.rawText}</span>
                    <span className="cct-command-normalized">{cmd.normalizedCommand}</span>
                  </div>
                  {cmd.result && <span className="cct-command-result">{cmd.result}</span>}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Read-Back / Summary Panel */}
        <section className="cct-voice-panel cct-voice-panel-readback">
          <h3 className="cct-panel-title">Read-Back Summary</h3>
          <div className="cct-readback-area">
            <div className="cct-empty-state">
              <p className="cct-empty-description">Session summaries and read-back content will appear here after processing.</p>
            </div>
            <div className="cct-readback-controls">
              <button className="cct-btn cct-btn-sm cct-btn-ghost" disabled>Play Read-Back</button>
              <button className="cct-btn cct-btn-sm cct-btn-ghost" disabled>Pause</button>
            </div>
          </div>
        </section>
      </div>

      {/* Routing Review */}
      <div className="cct-routing-review">
        <h3 className="cct-panel-title">Routing Review</h3>
        <p className="cct-routing-description">
          All voice-captured data passes through routing review before sovereign use. Items are validated, normalized, and assigned to the appropriate kernel before integration.
        </p>
        <div className="cct-routing-queue">
          <div className="cct-empty-state">
            <p className="cct-empty-description">No items pending routing review.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
