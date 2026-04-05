import React from 'react';

export type SpineStage = 'SIGNAL' | 'PROMOTION' | 'CONSTRAINT' | 'KERNEL' | 'RECEIPT';

export interface SpineStageState {
  stage: SpineStage;
  status: 'pending' | 'active' | 'complete' | 'error';
  timestamp?: string;
  receiptId?: string;
}

export interface OrchestrationSpineProps {
  stages: SpineStageState[];
  activeStage: SpineStage;
  className?: string;
}

const STAGE_ORDER: SpineStage[] = ['SIGNAL', 'PROMOTION', 'CONSTRAINT', 'KERNEL', 'RECEIPT'];

const STAGE_LABELS: Record<SpineStage, string> = {
  SIGNAL: 'Signal',
  PROMOTION: 'Promotion',
  CONSTRAINT: 'Constraint',
  KERNEL: 'Kernel',
  RECEIPT: 'Receipt',
};

/**
 * OrchestrationSpine
 *
 * Visual spine showing the execution flow:
 * Signal -> Promotion -> Constraint -> Kernel -> Receipt
 *
 * This is a read-only visualization of the VKBUS execution pipeline.
 * It does not control or influence execution -- it only reflects state.
 */
export const OrchestrationSpine: React.FC<OrchestrationSpineProps> = ({
  stages,
  activeStage,
  className,
}) => {
  const getStageState = (stage: SpineStage): SpineStageState => {
    return stages.find(s => s.stage === stage) || {
      stage,
      status: 'pending',
    };
  };

  return (
    <div
      className={`cct-orchestration-spine ${className || ''}`}
      data-component="orchestration-spine"
      data-active-stage={activeStage}
      role="navigation"
      aria-label="Orchestration execution flow"
    >
      <ol className="cct-orchestration-spine__stages">
        {STAGE_ORDER.map((stage, index) => {
          const stageState = getStageState(stage);
          const isActive = stage === activeStage;
          return (
            <li
              key={stage}
              className={`cct-orchestration-spine__stage cct-orchestration-spine__stage--${stageState.status} ${isActive ? 'cct-orchestration-spine__stage--active' : ''}`}
              data-stage={stage}
              data-status={stageState.status}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="cct-orchestration-spine__marker">
                {index + 1}
              </span>
              <span className="cct-orchestration-spine__label">
                {STAGE_LABELS[stage]}
              </span>
              {stageState.receiptId && (
                <span className="cct-orchestration-spine__receipt-ref">
                  {stageState.receiptId.slice(0, 8)}
                </span>
              )}
              {index < STAGE_ORDER.length - 1 && (
                <span className="cct-orchestration-spine__connector" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default OrchestrationSpine;
