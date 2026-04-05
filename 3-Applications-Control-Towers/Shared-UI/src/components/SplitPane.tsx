import React from 'react';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftWidth?: string;
  rightWidth?: string;
  minLeftWidth?: string;
  minRightWidth?: string;
  rightCollapsed?: boolean;
  onToggleRight?: () => void;
  className?: string;
}

export function SplitPane({
  left,
  right,
  leftWidth = '60%',
  rightWidth = '40%',
  minLeftWidth = '400px',
  minRightWidth = '300px',
  rightCollapsed = false,
  onToggleRight,
  className = '',
}: SplitPaneProps) {
  return (
    <div className={`cct-split-pane ${rightCollapsed ? 'cct-split-pane-collapsed' : ''} ${className}`}>
      <div
        className="cct-split-pane-left"
        style={{
          width: rightCollapsed ? '100%' : leftWidth,
          minWidth: rightCollapsed ? undefined : minLeftWidth,
        }}
      >
        {left}
      </div>

      {!rightCollapsed && (
        <>
          <div className="cct-split-pane-divider">
            {onToggleRight && (
              <button
                className="cct-split-pane-toggle"
                onClick={onToggleRight}
                aria-label="Toggle right panel"
              >
                &rsaquo;
              </button>
            )}
          </div>
          <div
            className="cct-split-pane-right"
            style={{
              width: rightWidth,
              minWidth: minRightWidth,
            }}
          >
            {right}
          </div>
        </>
      )}

      {rightCollapsed && onToggleRight && (
        <button
          className="cct-split-pane-expand"
          onClick={onToggleRight}
          aria-label="Expand right panel"
        >
          &lsaquo;
        </button>
      )}
    </div>
  );
}
