/**
 * FocusBreadcrumb
 * Breadcrumb trail showing the focus chain.
 * Example: Overview > Matter 42 > Contract Review
 */

import React from 'react';

export interface BreadcrumbSegment {
  label: string;
  paneId: string;
  active?: boolean;
}

interface FocusBreadcrumbProps {
  segments: BreadcrumbSegment[];
  onSegmentClick?: (paneId: string) => void;
}

const FocusBreadcrumb: React.FC<FocusBreadcrumbProps> = ({
  segments,
  onSegmentClick,
}) => {
  return (
    <nav
      className="focus-breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 16px',
        fontSize: '12px',
        color: '#94a3b8',
        backgroundColor: '#0f172a',
      }}
      aria-label="Focus breadcrumb"
    >
      {segments.map((segment, index) => (
        <React.Fragment key={segment.paneId}>
          {index > 0 && (
            <span style={{ color: '#475569', margin: '0 2px' }}>&gt;</span>
          )}
          <button
            onClick={() => onSegmentClick?.(segment.paneId)}
            style={{
              background: 'none',
              border: 'none',
              cursor: onSegmentClick ? 'pointer' : 'default',
              padding: '2px 4px',
              borderRadius: '3px',
              color: segment.active ? '#e2e8f0' : '#94a3b8',
              fontWeight: segment.active ? 600 : 400,
              fontSize: '12px',
              textDecoration: 'none',
            }}
            aria-current={segment.active ? 'location' : undefined}
          >
            {segment.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default FocusBreadcrumb;
