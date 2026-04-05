import React from 'react';

type PlaybackState = 'idle' | 'playing' | 'paused' | 'completed';

interface ReadbackSection {
  id: string;
  label: string;
  content: string;
  kernel?: 'business' | 'law' | 'accounting';
}

interface ReadbackSummaryPanelProps {
  title?: string;
  sections: ReadbackSection[];
  playbackState: PlaybackState;
  currentSectionId: string | null;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkipToSection: (sectionId: string) => void;
  className?: string;
}

const PLAYBACK_LABELS: Record<PlaybackState, string> = {
  idle: 'Ready',
  playing: 'Playing',
  paused: 'Paused',
  completed: 'Completed',
};

export function ReadbackSummaryPanel({
  title = 'Read-Back Summary',
  sections,
  playbackState,
  currentSectionId,
  onPlay,
  onPause,
  onStop,
  onSkipToSection,
  className = '',
}: ReadbackSummaryPanelProps) {
  return (
    <div className={`cct-readback-panel ${className}`}>
      <div className="cct-readback-header">
        <h3 className="cct-panel-title">{title}</h3>
        <div className="cct-readback-status">
          <span className={`cct-playback-indicator cct-playback-${playbackState}`} />
          <span className="cct-playback-label">{PLAYBACK_LABELS[playbackState]}</span>
        </div>
      </div>

      <div className="cct-readback-controls">
        {playbackState === 'idle' || playbackState === 'completed' ? (
          <button
            className="cct-btn cct-btn-sm cct-btn-primary"
            onClick={onPlay}
            disabled={sections.length === 0}
          >
            {playbackState === 'completed' ? 'Replay' : 'Play'}
          </button>
        ) : playbackState === 'playing' ? (
          <button className="cct-btn cct-btn-sm cct-btn-secondary" onClick={onPause}>
            Pause
          </button>
        ) : (
          <button className="cct-btn cct-btn-sm cct-btn-primary" onClick={onPlay}>
            Resume
          </button>
        )}
        {(playbackState === 'playing' || playbackState === 'paused') && (
          <button className="cct-btn cct-btn-sm cct-btn-ghost" onClick={onStop}>
            Stop
          </button>
        )}
      </div>

      <div className="cct-readback-body">
        {sections.length === 0 ? (
          <div className="cct-empty-state">
            <p className="cct-empty-description">No summary content available for read-back.</p>
          </div>
        ) : (
          <div className="cct-readback-sections">
            {sections.map(section => (
              <div
                key={section.id}
                className={[
                  'cct-readback-section',
                  currentSectionId === section.id ? 'cct-readback-section-active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onSkipToSection(section.id)}
              >
                <div className="cct-readback-section-header">
                  <span className="cct-readback-section-label">{section.label}</span>
                  {section.kernel && (
                    <span className={`cct-kernel-tag cct-kernel-${section.kernel}`}>{section.kernel}</span>
                  )}
                </div>
                <p className="cct-readback-section-content">{section.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
