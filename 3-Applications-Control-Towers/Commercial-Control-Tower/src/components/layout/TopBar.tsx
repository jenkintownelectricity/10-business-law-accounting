import React from 'react';

export function TopBar() {
  return (
    <header className="cct-topbar">
      <div className="cct-topbar-left">
        <button className="cct-search-trigger" aria-label="Search workspace">
          <span className="cct-search-icon" />
          <span className="cct-search-placeholder">Search matters, contracts, clients...</span>
          <kbd className="cct-search-shortcut">&#x2318;K</kbd>
        </button>
      </div>
      <div className="cct-topbar-right">
        <div className="cct-voice-indicator" title="Voice: Idle">
          <span className="cct-mic-icon cct-mic-idle" />
        </div>
        <div className="cct-user-badge">
          <span className="cct-user-initials">PR</span>
        </div>
      </div>
    </header>
  );
}
