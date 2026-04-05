import React from 'react';

interface Obligation {
  id: string;
  description: string;
  type: 'performance' | 'payment' | 'delivery' | 'reporting' | 'compliance' | 'other';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue' | 'waived';
  complianceStatus: 'compliant' | 'at-risk' | 'non-compliant' | 'not-assessed';
  deadline: string | null;
  sourceContractId: string;
  sourceContractTitle: string;
  responsibleParty: string;
  kernels: Array<'business' | 'law' | 'accounting'>;
  matterId: string | null;
}

const PLACEHOLDER_OBLIGATIONS: Obligation[] = [];

const TYPE_LABELS: Record<Obligation['type'], string> = {
  performance: 'Performance',
  payment: 'Payment',
  delivery: 'Delivery',
  reporting: 'Reporting',
  compliance: 'Compliance',
  other: 'Other',
};

const STATUS_LABELS: Record<Obligation['status'], string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue',
  waived: 'Waived',
};

const COMPLIANCE_LABELS: Record<Obligation['complianceStatus'], string> = {
  compliant: 'Compliant',
  'at-risk': 'At Risk',
  'non-compliant': 'Non-Compliant',
  'not-assessed': 'Not Assessed',
};

export function ObligationsPage() {
  const obligations = PLACEHOLDER_OBLIGATIONS;

  return (
    <div className="cct-page cct-page-obligations">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Obligations</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-primary">Track Obligation</button>
        </div>
      </div>

      <div className="cct-obligation-summary">
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Total Active</span>
        </div>
        <div className="cct-summary-card cct-summary-warning">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Overdue</span>
        </div>
        <div className="cct-summary-card cct-summary-danger">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Non-Compliant</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Due This Week</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Status</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
            <option value="waived">Waived</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Compliance</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All</option>
            <option value="compliant">Compliant</option>
            <option value="at-risk">At Risk</option>
            <option value="non-compliant">Non-Compliant</option>
            <option value="not-assessed">Not Assessed</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Type</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Types</option>
            <option value="performance">Performance</option>
            <option value="payment">Payment</option>
            <option value="delivery">Delivery</option>
            <option value="reporting">Reporting</option>
            <option value="compliance">Compliance</option>
          </select>
        </div>
      </div>

      <div className="cct-table-container">
        <table className="cct-table">
          <thead>
            <tr>
              <th className="cct-th cct-th-sortable">Obligation</th>
              <th className="cct-th">Type</th>
              <th className="cct-th cct-th-sortable">Status</th>
              <th className="cct-th">Compliance</th>
              <th className="cct-th cct-th-sortable">Deadline</th>
              <th className="cct-th">Source Contract</th>
              <th className="cct-th">Responsible</th>
              <th className="cct-th">Kernels</th>
            </tr>
          </thead>
          <tbody>
            {obligations.length === 0 ? (
              <tr>
                <td colSpan={8} className="cct-td cct-empty-row">
                  <div className="cct-empty-state">
                    <p className="cct-empty-title">No obligations tracked</p>
                    <p className="cct-empty-description">Obligations are extracted from contracts and tracked for compliance and deadline adherence.</p>
                  </div>
                </td>
              </tr>
            ) : (
              obligations.map(ob => (
                <tr key={ob.id} className="cct-tr cct-tr-clickable">
                  <td className="cct-td cct-td-primary">{ob.description}</td>
                  <td className="cct-td">
                    <span className="cct-type-badge">{TYPE_LABELS[ob.type]}</span>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-status-badge cct-status-${ob.status}`}>
                      {STATUS_LABELS[ob.status]}
                    </span>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-compliance-badge cct-compliance-${ob.complianceStatus}`}>
                      {COMPLIANCE_LABELS[ob.complianceStatus]}
                    </span>
                  </td>
                  <td className="cct-td">{ob.deadline ?? '--'}</td>
                  <td className="cct-td">
                    <a href={`/contracts/${ob.sourceContractId}`} className="cct-link">
                      {ob.sourceContractTitle}
                    </a>
                  </td>
                  <td className="cct-td">{ob.responsibleParty}</td>
                  <td className="cct-td">
                    <div className="cct-kernel-tags">
                      {ob.kernels.map(k => (
                        <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
