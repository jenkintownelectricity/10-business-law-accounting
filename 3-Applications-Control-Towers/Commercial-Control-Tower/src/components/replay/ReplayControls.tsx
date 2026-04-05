import React from 'react';

interface ReplayControlsProps {
  scrubPosition: number;
  onScrub: (position: number) => void;
  onExit: () => void;
}

export function ReplayControls({ scrubPosition, onScrub, onExit }: ReplayControlsProps) {
  return (
    <div className="replay-controls" role="toolbar" aria-label="Replay controls">
      <div className="replay-scrub-rail">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={scrubPosition}
          onChange={e => onScrub(parseFloat(e.target.value))}
          className="replay-scrub-slider"
          aria-label="Timeline position"
        />
        <span className="replay-position">{Math.round(scrubPosition * 100)}%</span>
      </div>
      <button onClick={onExit} className="btn btn--ghost replay-exit-btn">
        Exit Replay
      </button>
    </div>
  );
}
