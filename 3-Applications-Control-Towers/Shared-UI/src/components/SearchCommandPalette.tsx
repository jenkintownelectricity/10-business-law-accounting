import React from 'react';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  url: string;
  kernels?: Array<'business' | 'law' | 'accounting'>;
}

interface QuickAction {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

interface SearchCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (query: string) => void;
  results: SearchResult[];
  quickActions: QuickAction[];
  recentSearches: string[];
  onSelectResult: (result: SearchResult) => void;
  onSelectAction: (action: QuickAction) => void;
  isLoading?: boolean;
  className?: string;
}

export function SearchCommandPalette({
  isOpen,
  onClose,
  query,
  onQueryChange,
  results,
  quickActions,
  recentSearches,
  onSelectResult,
  onSelectAction,
  isLoading = false,
  className = '',
}: SearchCommandPaletteProps) {
  if (!isOpen) return null;

  const showResults = query.length > 0;
  const showQuickActions = query.length === 0;

  return (
    <div className={`cct-command-palette-overlay ${className}`} onClick={onClose}>
      <div className="cct-command-palette" onClick={e => e.stopPropagation()}>
        <div className="cct-command-palette-input-wrapper">
          <span className="cct-command-palette-icon" />
          <input
            type="text"
            className="cct-command-palette-input"
            placeholder="Search or type a command..."
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            autoFocus
          />
          <button className="cct-command-palette-close" onClick={onClose}>
            <kbd>Esc</kbd>
          </button>
        </div>

        <div className="cct-command-palette-body">
          {isLoading && (
            <div className="cct-command-palette-loading">
              <span className="cct-loading-indicator" />
              <span>Searching...</span>
            </div>
          )}

          {showQuickActions && (
            <>
              {recentSearches.length > 0 && (
                <div className="cct-command-palette-section">
                  <h4 className="cct-command-palette-section-title">Recent</h4>
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      className="cct-command-palette-item"
                      onClick={() => onQueryChange(search)}
                    >
                      <span className="cct-command-palette-item-icon cct-icon-recent" />
                      <span className="cct-command-palette-item-label">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="cct-command-palette-section">
                <h4 className="cct-command-palette-section-title">Quick Actions</h4>
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    className="cct-command-palette-item"
                    onClick={() => onSelectAction(action)}
                  >
                    <span className="cct-command-palette-item-icon cct-icon-action" />
                    <span className="cct-command-palette-item-label">{action.label}</span>
                    {action.shortcut && (
                      <kbd className="cct-command-palette-shortcut">{action.shortcut}</kbd>
                    )}
                  </button>
                ))}
              </div>

              <div className="cct-command-palette-section">
                <h4 className="cct-command-palette-section-title">Navigate</h4>
                {['Matters', 'Contracts', 'Obligations', 'Accounting', 'Clients', 'Vendors'].map(page => (
                  <button key={page} className="cct-command-palette-item">
                    <span className="cct-command-palette-item-icon cct-icon-nav" />
                    <span className="cct-command-palette-item-label">Go to {page}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {showResults && !isLoading && (
            <div className="cct-command-palette-section">
              <h4 className="cct-command-palette-section-title">
                {results.length > 0 ? `${results.length} results` : 'No results'}
              </h4>
              {results.map(result => (
                <button
                  key={result.id}
                  className="cct-command-palette-item"
                  onClick={() => onSelectResult(result)}
                >
                  <span className={`cct-command-palette-item-icon cct-icon-${result.type}`} />
                  <div className="cct-command-palette-item-content">
                    <span className="cct-command-palette-item-label">{result.title}</span>
                    {result.subtitle && (
                      <span className="cct-command-palette-item-subtitle">{result.subtitle}</span>
                    )}
                  </div>
                  <span className="cct-command-palette-item-type">{result.type}</span>
                  {result.kernels && (
                    <div className="cct-kernel-tags">
                      {result.kernels.map(k => (
                        <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="cct-command-palette-footer">
          <span className="cct-command-palette-hint">
            <kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate
            <kbd>&crarr;</kbd> Select
            <kbd>Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
