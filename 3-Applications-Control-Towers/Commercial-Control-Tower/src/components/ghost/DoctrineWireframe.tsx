import React from 'react';
import { ReadOnlyGhostProps } from '../../lib/ghost/ghostReadOnlyContracts';

interface DoctrineWireframeProps extends ReadOnlyGhostProps {
  /** Doctrine field names and their expected types */
  readonly doctrineFields: ReadonlyArray<{
    field: string;
    expectedType: string;
    required: boolean;
  }>;
}

/**
 * DoctrineWireframe
 * Wireframe overlay showing doctrine structure for the current pane.
 * Renders the expected field layout from doctrine as a transparent wireframe,
 * highlighting which fields are present, missing, or divergent.
 * READ-ONLY — no mutation callbacks.
 */
export function DoctrineWireframe({
  deltas,
  visible,
  entityId,
  entityType,
  doctrineFields,
}: DoctrineWireframeProps) {
  if (!visible) return null;

  const missingFields = deltas.filter((d) => d.divergence_type === 'missing');
  const changedFields = deltas.filter((d) => d.divergence_type === 'changed');
  const missingFieldNames = new Set(missingFields.map((d) => d.field));
  const changedFieldNames = new Set(changedFields.map((d) => d.field));

  return (
    <div
      className="cct-doctrine-wireframe"
      role="region"
      aria-label={`Doctrine wireframe for ${entityType} ${entityId}`}
    >
      <div className="cct-wireframe-header">
        <span className="cct-wireframe-title">Doctrine Structure</span>
        <span className="cct-wireframe-entity">{entityType}</span>
      </div>
      <div className="cct-wireframe-fields">
        {doctrineFields.map((field) => {
          let status: 'present' | 'missing' | 'changed' = 'present';
          if (missingFieldNames.has(field.field)) status = 'missing';
          else if (changedFieldNames.has(field.field)) status = 'changed';

          return (
            <div
              key={field.field}
              className={`cct-wireframe-field cct-wireframe-field-${status}`}
            >
              <span className="cct-wireframe-field-name">{field.field}</span>
              <span className="cct-wireframe-field-type">{field.expectedType}</span>
              {field.required && (
                <span className="cct-wireframe-field-required">required</span>
              )}
              <span className={`cct-wireframe-field-status cct-wireframe-status-${status}`}>
                {status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
