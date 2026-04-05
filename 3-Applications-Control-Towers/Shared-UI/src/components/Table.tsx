import React from 'react';

type SortDirection = 'asc' | 'desc' | null;

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string) => void;
  onRowClick?: (row: T) => void;
  compact?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  compact = false,
  emptyMessage = 'No data',
  emptyDescription,
  className = '',
}: TableProps<T>) {
  const handleHeaderClick = (column: Column<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  return (
    <div className={`cct-table-container ${className}`}>
      <table className={`cct-table ${compact ? 'cct-table-compact' : ''}`}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={[
                  'cct-th',
                  col.sortable ? 'cct-th-sortable' : '',
                  col.align === 'center' ? 'cct-th-center' : '',
                  col.align === 'right' ? 'cct-th-right' : '',
                  sortColumn === col.key ? 'cct-th-sorted' : '',
                ].filter(Boolean).join(' ')}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => handleHeaderClick(col)}
              >
                <span className="cct-th-content">
                  {col.header}
                  {col.sortable && sortColumn === col.key && (
                    <span className="cct-sort-indicator">
                      {sortDirection === 'asc' ? '\u2191' : '\u2193'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="cct-td cct-empty-row">
                <div className="cct-empty-state">
                  <p className="cct-empty-title">{emptyMessage}</p>
                  {emptyDescription && <p className="cct-empty-description">{emptyDescription}</p>}
                </div>
              </td>
            </tr>
          ) : (
            data.map(row => (
              <tr
                key={String(row[keyField])}
                className={`cct-tr ${onRowClick ? 'cct-tr-clickable' : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={[
                      'cct-td',
                      col.align === 'center' ? 'cct-td-center' : '',
                      col.align === 'right' ? 'cct-td-right' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
