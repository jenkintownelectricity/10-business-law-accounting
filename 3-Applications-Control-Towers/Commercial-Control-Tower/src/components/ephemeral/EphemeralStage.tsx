import React from 'react';
import { EphemeralProposal } from '../../lib/ephemeral/ephemeralTypes';
import { GhostPane } from './GhostPane';

interface EphemeralStageProps {
  proposals: EphemeralProposal[];
  onPromote: (id: string) => void;
  onDismiss: (id: string) => void;
  onHover: (id: string, hovered: boolean) => void;
  onSelect: (id: string) => void;
}

/**
 * EphemeralStage
 * Container for all ephemeral proposals in the workstation.
 * Renders active proposals as ghost panes. Does not mutate domain state.
 */
export function EphemeralStage({
  proposals,
  onPromote,
  onDismiss,
  onHover,
  onSelect,
}: EphemeralStageProps) {
  if (proposals.length === 0) return null;

  return (
    <div className="cct-ephemeral-stage" role="region" aria-label="Ephemeral Proposals">
      <div className="cct-ephemeral-stage-header">
        <span className="cct-ephemeral-stage-title">Proposals</span>
        <span className="cct-ephemeral-stage-count">{proposals.length}</span>
      </div>
      <div className="cct-ephemeral-stage-list" role="list">
        {proposals.map((proposal) => (
          <GhostPane
            key={proposal.id}
            proposal={proposal}
            onPromote={onPromote}
            onDismiss={onDismiss}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
