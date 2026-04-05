import React from 'react';
import { EphemeralProposal } from '../../lib/ephemeral/ephemeralTypes';

interface ShadowCalculationProps {
  proposal: EphemeralProposal;
  projectedValues: Record<string, unknown>;
  currentValues: Record<string, unknown>;
}

/**
 * ShadowCalculation
 * Shows shadow calculation / projection from an ephemeral proposal.
 * Displays what would change if the proposal were promoted, without
 * actually mutating any domain state.
 */
export function ShadowCalculation({
  proposal,
  projectedValues,
  currentValues,
}: ShadowCalculationProps) {
  const changedFields = Object.keys(projectedValues).filter(
    (key) => JSON.stringify(projectedValues[key]) !== JSON.stringify(currentValues[key]),
  );

  return (
    <div className="cct-shadow-calculation" role="region" aria-label="Shadow Calculation">
      <div className="cct-shadow-header">
        <span className="cct-shadow-title">Projected Impact</span>
        <span className="cct-badge cct-badge-source">{proposal.source_type}</span>
      </div>
      {changedFields.length === 0 ? (
        <div className="cct-shadow-no-change">No projected changes.</div>
      ) : (
        <div className="cct-shadow-fields">
          {changedFields.map((field) => (
            <div key={field} className="cct-shadow-field">
              <span className="cct-shadow-field-name">{field}</span>
              <div className="cct-shadow-field-values">
                <span className="cct-shadow-current">
                  Current: {String(currentValues[field] ?? 'N/A')}
                </span>
                <span className="cct-shadow-arrow">&rarr;</span>
                <span className="cct-shadow-projected">
                  Projected: {String(projectedValues[field] ?? 'N/A')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cct-shadow-notice">
        Shadow calculation only. No domain state has been modified.
      </div>
    </div>
  );
}
