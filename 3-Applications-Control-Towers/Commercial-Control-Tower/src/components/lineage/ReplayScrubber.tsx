import React, { useState } from 'react';

export interface ReplayScrubberProps {
  totalSteps: number;
  currentStep: number;
  timestamps: string[];
  onScrub: (step: number) => void;
  onPreview: (step: number) => void;
  isPreviewMode: boolean;
  className?: string;
}

/**
 * ReplayScrubber
 *
 * Scrubber for navigating receipt history.
 * Preview only -- cannot mutate current focus without explicit switch.
 *
 * Contract:
 * - Scrubbing shows a preview of historical state
 * - Preview does NOT change the active workspace
 * - Explicit "Apply" action required to switch focus to replayed state
 * - Scrubber state is serializable for replay persistence
 */
export const ReplayScrubber: React.FC<ReplayScrubberProps> = ({
  totalSteps,
  currentStep,
  timestamps,
  onScrub,
  onPreview,
  isPreviewMode,
  className,
}) => {
  const [hoverStep, setHoverStep] = useState<number | null>(null);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = parseInt(e.target.value, 10);
    onScrub(step);
    onPreview(step);
  };

  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div
      className={`cct-replay-scrubber ${isPreviewMode ? 'cct-replay-scrubber--preview' : ''} ${className || ''}`}
      data-component="replay-scrubber"
      data-preview-mode={isPreviewMode}
      data-total-steps={totalSteps}
      data-current-step={currentStep}
      role="slider"
      aria-label="Receipt history scrubber"
      aria-valuemin={0}
      aria-valuemax={totalSteps - 1}
      aria-valuenow={currentStep}
    >
      {isPreviewMode && (
        <div className="cct-replay-scrubber__preview-banner" role="status">
          PREVIEW MODE -- Not affecting active workspace
        </div>
      )}
      <div className="cct-replay-scrubber__track">
        <div
          className="cct-replay-scrubber__progress"
          style={{ width: `${progress}%` }}
        />
        <input
          type="range"
          className="cct-replay-scrubber__input"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={handleScrub}
          onMouseLeave={() => setHoverStep(null)}
          aria-label="Scrub through receipt history"
        />
      </div>
      <div className="cct-replay-scrubber__info">
        <span className="cct-replay-scrubber__step">
          Step {currentStep + 1} of {totalSteps}
        </span>
        {timestamps[currentStep] && (
          <time className="cct-replay-scrubber__timestamp">{timestamps[currentStep]}</time>
        )}
        {hoverStep !== null && timestamps[hoverStep] && (
          <span className="cct-replay-scrubber__hover-hint">{timestamps[hoverStep]}</span>
        )}
      </div>
    </div>
  );
};

export default ReplayScrubber;
