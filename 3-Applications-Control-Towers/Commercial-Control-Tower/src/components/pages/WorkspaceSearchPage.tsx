import React from 'react';

type SearchScope = 'all' | 'matters' | 'contracts' | 'obligations' | 'clients' | 'vendors' | 'decisions' | 'receipts';
type SearchResultType = 'matter' | 'contract' | 'obligation' | 'client' | 'vendor' | 'decision' | 'receipt' | 'deadline';

interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  kernels: Array<'business' | 'law' | 'accounting'>;
  matchScore: number;
  lastModified: string;
  url: string;
}

interface SavedView {
  id: string;
  name: string;
  query: string;
  scope: SearchScope;
  filters: Record<string, string>;
  resultCount: number;
}

const PLACEHOLDER_RESULTS: SearchResult[] = [];
const PLACEHOLDER_SAVED_VIEWS: SavedView[] = [];

const QUICK_ACTIONS = [
  { id: 'new-matter', label: 'New Matter', shortcut: 'M' },
  { id: 'new-contract', label: 'New Contract', shortcut: 'C' },
  { id: 'new-obligation', label: 'Track Obligation', shortcut: 'O' },
  { id: 'new-entry', label: 'New Accounting Entry', shortcut: 'A' },
  { id: 'new-decision', label: 'New Decision Thread', shortcut: 'D' },
  { id: 'voice-start', label: 'Start Voice Session', shortcut: 'V' },
  { id: 'review-queue', label: 'Open Review Queue', shortcut: 'R' },
];

const SCOPE_LABELS: Record<SearchScope, string> = {
  all: 'Everywhere',
  matters: 'Matters',
  contracts: 'Contracts',
  obligations: 'Obligations',
  clients: 'Clients',
  vendors: 'Vendors',
  decisions: 'Decisions',
  receipts: 'Receipts',
};

const TYPE_LABELS: Record<SearchResultType, string> = {
  matter: 'Matter',
  contract: 'Contract',
  obligation: 'Obligation',
  client: 'Client',
  vendor: 'Vendor',
  decision: 'Decision',
  receipt: 'Receipt',
  deadline: 'Deadline',
};

export function WorkspaceSearchPage() {
  const results = PLACEHOLDER_RESULTS;
  const savedViews = PLACEHOLDER_SAVED_VIEWS;
  const currentQuery = '';
  const currentScope: SearchScope = 'all';

  return (
    <div className="cct-page cct-page-search">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Workspace Search</h2>
      </div>

      {/* Search Input */}
      <div className="cct-search-container">
        <div className="cct-search-bar">
          <span className="cct-search-bar-icon" />
          <input
            type="text"
            className="cct-search-input"
            placeholder="Search across all matters, contracts, clients, and more..."
            defaultValue={currentQuery}
            autoFocus
          />
          <kbd className="cct-search-shortcut-inline">&#x2318;K</kbd>
        </div>
        <div className="cct-search-scope">
          {(Object.keys(SCOPE_LABELS) as SearchScope[]).map(scope => (
            <button
              key={scope}
              className={`cct-scope-btn ${currentScope === scope ? 'cct-scope-active' : ''}`}
            >
              {SCOPE_LABELS[scope]}
            </button>
          ))}
        </div>
      </div>

      <div className="cct-search-layout">
        {/* Main Results */}
        <div className="cct-search-results">
          {currentQuery === '' ? (
            <div className="cct-search-empty">
              {/* Quick Actions */}
              <div className="cct-quick-actions">
                <h3 className="cct-section-title">Quick Actions</h3>
                <div className="cct-quick-actions-grid">
                  {QUICK_ACTIONS.map(action => (
                    <button key={action.id} className="cct-quick-action-btn">
                      <span className="cct-quick-action-label">{action.label}</span>
                      <kbd className="cct-quick-action-shortcut">{action.shortcut}</kbd>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches placeholder */}
              <div className="cct-recent-searches">
                <h3 className="cct-section-title">Recent Searches</h3>
                <div className="cct-empty-state">
                  <p className="cct-empty-description">No recent searches</p>
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="cct-empty-state cct-empty-state-large">
              <p className="cct-empty-title">No results found</p>
              <p className="cct-empty-description">Try adjusting your search terms or broadening the scope.</p>
            </div>
          ) : (
            <div className="cct-results-list">
              <div className="cct-results-header">
                <span className="cct-results-count">{results.length} results</span>
              </div>
              {results.map(result => (
                <a key={result.id} href={result.url} className="cct-result-item">
                  <div className="cct-result-header">
                    <span className={`cct-result-type cct-result-type-${result.type}`}>
                      {TYPE_LABELS[result.type]}
                    </span>
                    <h4 className="cct-result-title">{result.title}</h4>
                  </div>
                  <p className="cct-result-snippet">{result.snippet}</p>
                  <div className="cct-result-meta">
                    <div className="cct-kernel-tags">
                      {result.kernels.map(k => (
                        <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
                      ))}
                    </div>
                    <span className="cct-result-date">{result.lastModified}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Saved Views Sidebar */}
        <div className="cct-search-sidebar">
          <h3 className="cct-section-title">Saved Views</h3>
          {savedViews.length === 0 ? (
            <div className="cct-empty-state">
              <p className="cct-empty-description">Save frequently-used searches as views for quick access.</p>
            </div>
          ) : (
            <div className="cct-saved-views-list">
              {savedViews.map(view => (
                <button key={view.id} className="cct-saved-view-item">
                  <span className="cct-saved-view-name">{view.name}</span>
                  <span className="cct-saved-view-count">{view.resultCount}</span>
                </button>
              ))}
            </div>
          )}
          <button className="cct-btn cct-btn-sm cct-btn-ghost cct-btn-full-width">Save Current Search</button>
        </div>
      </div>
    </div>
  );
}
