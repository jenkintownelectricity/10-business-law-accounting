import React from 'react';

/**
 * Doctrine Pane
 * Read-only view of frozen domain doctrine.
 *
 * Rules:
 * - READ-ONLY — no mutation path
 * - FROZEN badge always visible
 * - Contextual breadcrumb when possible
 * - Source reference displayed
 * - No edit controls
 */

export interface DoctrineEntry {
  id: string;
  title: string;
  category: 'domain_root' | 'trust_stack' | 'kernel_stack' | 'constraint_families' | 'commercial_orchestration' | 'voice_language';
  version: string;
  frozen_at: string;
  content: string;
  source_path: string;
}

interface DoctrinePaneProps {
  entries: DoctrineEntry[];
  activeEntryId?: string;
  contextBreadcrumb?: string[];
}

export function DoctrinePane({ entries, activeEntryId, contextBreadcrumb }: DoctrinePaneProps) {
  const activeEntry = entries.find(e => e.id === activeEntryId) || entries[0];

  return (
    <div className="doctrine-pane" role="region" aria-label="Frozen Doctrine">
      <div className="doctrine-header">
        <div className="doctrine-title-row">
          <h2 className="doctrine-title">Doctrine</h2>
          <span className="badge badge--frozen">FROZEN</span>
          <span className="badge badge--readonly">READ-ONLY</span>
        </div>
        {contextBreadcrumb && contextBreadcrumb.length > 0 && (
          <nav className="doctrine-breadcrumb" aria-label="Doctrine context">
            {contextBreadcrumb.map((crumb, i) => (
              <span key={i} className="doctrine-crumb">
                {i > 0 && <span className="doctrine-crumb-sep">/</span>}
                {crumb}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="doctrine-nav">
        {entries.map(entry => (
          <button
            key={entry.id}
            className={`doctrine-nav-item ${entry.id === activeEntry?.id ? 'doctrine-nav-active' : ''}`}
            aria-current={entry.id === activeEntry?.id ? 'page' : undefined}
          >
            <span className="doctrine-nav-category">{entry.category.replace(/_/g, ' ')}</span>
            <span className="doctrine-nav-label">{entry.title}</span>
            <span className="doctrine-nav-version">{entry.version}</span>
          </button>
        ))}
      </div>

      {activeEntry && (
        <div className="doctrine-content">
          <div className="doctrine-meta">
            <span className="doctrine-meta-item">Version: {activeEntry.version}</span>
            <span className="doctrine-meta-item">Frozen: {activeEntry.frozen_at}</span>
            <span className="doctrine-meta-item">Source: {activeEntry.source_path}</span>
          </div>
          <div className="doctrine-body" aria-readonly="true">
            <pre className="doctrine-text">{activeEntry.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
