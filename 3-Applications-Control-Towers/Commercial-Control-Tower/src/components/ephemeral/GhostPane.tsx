import React from 'react';
import { EphemeralProposal } from '../../lib/ephemeral/ephemeralTypes';
import { GhostPromotionControl } from './GhostPromotionControl';
import { GhostDismissControl } from './GhostDismissControl';
import { GhostViolationBanner } from './GhostViolationBanner';

interface GhostPaneProps {
  proposal: EphemeralProposal;
  onPromote: (id: string) => void;
  onDismiss: (id: string) => void;
  onHover: (id: string, hovered: boolean) => void;
  onSelect: (id: string) => void;
}

/**
 * GhostPane
 * Individual ghost pane for a single ephemeral proposal.
 * Shows content, badges, promote/dismiss controls.
 * Ephemeral — does not mutate domain state.
 */
export function GhostPane({
  proposal,
  onPromote,
  onDismiss,
  onHover,
  onSelect,
}: GhostPaneProps) {
  return (
    <div
      className={`cct-ghost-pane cct-ghost-pane-${proposal.status.toLowerCase()}`}
      role="listitem"
      onMouseEnter={() => onHover(proposal.id, true)}
      onMouseLeave={() => onHover(proposal.id, false)}
      onClick={() => onSelect(proposal.id)}
      data-trust-state={proposal.trustState}
      data-selected={proposal.selected}
    >
      {proposal.violationState !== 'NONE' && (
        <GhostViolationBanner
          violationState={proposal.violationState}
          proposalId={proposal.id}
        />
      )}
      <div className="cct-ghost-pane-header">
        <span className="cct-badge cct-badge-source">{proposal.source_type}</span>
        <span className="cct-ghost-pane-confidence">
          {Math.round(proposal.confidence * 100)}%
        </span>
        <span className={`cct-badge cct-badge-status-${proposal.status.toLowerCase()}`}>
          {proposal.status}
        </span>
      </div>
      <div className="cct-ghost-pane-source">{proposal.source}</div>
      <div className="cct-ghost-pane-route">{proposal.route_suggestion}</div>
      <div className="cct-ghost-pane-content">
        {Object.entries(proposal.content).map(([key, value]) => (
          <div key={key} className="cct-ghost-pane-field">
            <span className="cct-ghost-pane-field-key">{key}:</span>
            <span className="cct-ghost-pane-field-value">{String(value)}</span>
          </div>
        ))}
      </div>
      <div className="cct-ghost-pane-actions">
        <GhostPromotionControl proposalId={proposal.id} onPromote={onPromote} />
        <GhostDismissControl proposalId={proposal.id} onDismiss={onDismiss} />
      </div>
    </div>
  );
}
