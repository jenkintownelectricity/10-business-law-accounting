import React from 'react';

type DockSessionState = 'idle' | 'listening' | 'processing' | 'paused' | 'error';

interface VoiceCommandDockProps {
  sessionState: DockSessionState;
  sessionDuration: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onToggleExpand?: () => void;
  expanded?: boolean;
  className?: string;
}

const STATE_LABELS: Record<DockSessionState, string> = {
  idle: 'Idle',
  listening: 'Listening',
  processing: 'Processing',
  paused: 'Paused',
  error: 'Error',
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function VoiceCommandDock({
  sessionState,
  sessionDuration,
  onStart,
  onPause,
  onStop,
  onToggleExpand,
  expanded = false,
  className = '',
}: VoiceCommandDockProps) {
  const isActive = sessionState === 'listening' || sessionState === 'paused' || sessionState === 'processing';

  return (
    <div className={`cct-voice-dock ${isActive ? 'cct-voice-dock-active' : ''} ${className}`}>
      <div className="cct-voice-dock-indicator">
        <span className={`cct-mic-indicator cct-mic-${sessionState}`} />
        <span className="cct-voice-dock-state">{STATE_LABELS[sessionState]}</span>
      </div>

      {isActive && (
        <span className="cct-voice-dock-timer">{formatDuration(sessionDuration)}</span>
      )}

      <div className="cct-voice-dock-controls">
        {sessionState === 'idle' ? (
          <button className="cct-btn cct-btn-sm cct-btn-voice-start" onClick={onStart}>
            Start
          </button>
        ) : (
          <>
            {sessionState === 'listening' ? (
              <button className="cct-btn cct-btn-sm cct-btn-voice-pause" onClick={onPause}>
                Pause
              </button>
            ) : sessionState === 'paused' ? (
              <button className="cct-btn cct-btn-sm cct-btn-voice-start" onClick={onStart}>
                Resume
              </button>
            ) : null}
            <button className="cct-btn cct-btn-sm cct-btn-voice-stop" onClick={onStop}>
              Stop
            </button>
          </>
        )}
      </div>

      {onToggleExpand && (
        <button
          className="cct-voice-dock-expand"
          onClick={onToggleExpand}
          aria-label={expanded ? 'Collapse voice panel' : 'Expand voice panel'}
        >
          {expanded ? '\u25BC' : '\u25B2'}
        </button>
      )}
    </div>
  );
}
