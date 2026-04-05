import React, { useState } from 'react';
import { EphemeralProposal } from '../../lib/ephemeral/ephemeralTypes';

interface GhostDraftProps {
  proposal: EphemeralProposal;
  onPromote: (id: string) => void;
  onDismiss: (id: string) => void;
}

/**
 * GhostDraft
 * Draft view of an ephemeral proposal — editable preview before promotion.
 * Editing here modifies only the ephemeral buffer, never domain truth.
 */
export function GhostDraft({ proposal, onPromote, onDismiss }: GhostDraftProps) {
  const [draftContent, setDraftContent] = useState<Record<string, unknown>>(
    { ...proposal.content },
  );

  const handleFieldChange = (key: string, value: string) => {
    setDraftContent((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="cct-ghost-draft" role="form" aria-label="Ephemeral Draft">
      <div className="cct-ghost-draft-header">
        <span className="cct-ghost-draft-title">Draft Preview</span>
        <span className="cct-badge cct-badge-source">{proposal.source_type}</span>
        <span className="cct-ghost-draft-confidence">
          {Math.round(proposal.confidence * 100)}%
        </span>
      </div>
      <div className="cct-ghost-draft-fields">
        {Object.entries(draftContent).map(([key, value]) => (
          <div key={key} className="cct-ghost-draft-field">
            <label className="cct-ghost-draft-label" htmlFor={`draft-${proposal.id}-${key}`}>
              {key}
            </label>
            <input
              id={`draft-${proposal.id}-${key}`}
              className="cct-ghost-draft-input"
              type="text"
              value={String(value)}
              onChange={(e) => handleFieldChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="cct-ghost-draft-notice">
        Edits modify only the ephemeral buffer. Domain truth is unchanged until promotion.
      </div>
      <div className="cct-ghost-draft-actions">
        <button onClick={() => onPromote(proposal.id)} className="cct-btn-ghost cct-btn-promote">
          Promote Draft
        </button>
        <button onClick={() => onDismiss(proposal.id)} className="cct-btn-ghost cct-btn-dismiss">
          Discard
        </button>
      </div>
    </div>
  );
}
