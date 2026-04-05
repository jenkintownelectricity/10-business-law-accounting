import React from 'react';

interface Matter {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'closed' | 'on-hold';
  priority: 'critical' | 'high' | 'medium' | 'low';
  kernels: Array<'business' | 'law' | 'accounting'>;
  clientName: string;
  openDate: string;
  nextDeadline: string | null;
  obligationCount: number;
  contractCount: number;
}

const PLACEHOLDER_MATTERS: Matter[] = [];

const STATUS_LABELS: Record<Matter['status'], string> = {
  active: 'Active',
  pending: 'Pending',
  closed: 'Closed',
  'on-hold': 'On Hold',
};

const PRIORITY_LABELS: Record<Matter['priority'], string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function MattersPage() {
  const matters = PLACEHOLDER_MATTERS;
  const filterStatus = 'all';
  const filterKernel = 'all';

  return (
    <div className="cct-page cct-page-matters">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Matters</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-primary">New Matter</button>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Status</label>
          <select className="cct-filter-select" defaultValue={filterStatus}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="on-hold">On Hold</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Kernel</label>
          <select className="cct-filter-select" defaultValue={filterKernel}>
            <option value="all">All Kernels</option>
            <option value="business">Business</option>
            <option value="law">Law</option>
            <option value="accounting">Accounting</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Priority</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="cct-table-container">
        <table className="cct-table">
          <thead>
            <tr>
              <th className="cct-th cct-th-sortable">Matter</th>
              <th className="cct-th cct-th-sortable">Client</th>
              <th className="cct-th">Kernels</th>
              <th className="cct-th cct-th-sortable">Status</th>
              <th className="cct-th cct-th-sortable">Priority</th>
              <th className="cct-th cct-th-sortable">Next Deadline</th>
              <th className="cct-th cct-th-center">Contracts</th>
              <th className="cct-th cct-th-center">Obligations</th>
            </tr>
          </thead>
          <tbody>
            {matters.length === 0 ? (
              <tr>
                <td colSpan={8} className="cct-td cct-empty-row">
                  <div className="cct-empty-state">
                    <p className="cct-empty-title">No matters yet</p>
                    <p className="cct-empty-description">Create a matter to begin tracking work across business, law, and accounting domains.</p>
                  </div>
                </td>
              </tr>
            ) : (
              matters.map(matter => (
                <tr key={matter.id} className="cct-tr cct-tr-clickable">
                  <td className="cct-td cct-td-primary">
                    <a href={`/matters/${matter.id}`} className="cct-matter-link">
                      {matter.title}
                    </a>
                  </td>
                  <td className="cct-td">{matter.clientName}</td>
                  <td className="cct-td">
                    <div className="cct-kernel-tags">
                      {matter.kernels.map(k => (
                        <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
                      ))}
                    </div>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-status-badge cct-status-${matter.status}`}>
                      {STATUS_LABELS[matter.status]}
                    </span>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-priority-indicator cct-priority-${matter.priority}`}>
                      {PRIORITY_LABELS[matter.priority]}
                    </span>
                  </td>
                  <td className="cct-td">{matter.nextDeadline ?? '--'}</td>
                  <td className="cct-td cct-td-center">{matter.contractCount}</td>
                  <td className="cct-td cct-td-center">{matter.obligationCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
