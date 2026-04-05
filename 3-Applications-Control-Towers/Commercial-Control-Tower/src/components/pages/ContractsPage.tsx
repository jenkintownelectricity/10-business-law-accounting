import React from 'react';

interface Contract {
  id: string;
  title: string;
  parties: string[];
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'under-review';
  financialValue: number | null;
  currency: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  effectiveDate: string;
  expirationDate: string | null;
  matterId: string | null;
  matterTitle: string | null;
  obligationCount: number;
}

const PLACEHOLDER_CONTRACTS: Contract[] = [];

const STATUS_LABELS: Record<Contract['status'], string> = {
  draft: 'Draft',
  active: 'Active',
  expired: 'Expired',
  terminated: 'Terminated',
  'under-review': 'Under Review',
};

const RISK_LABELS: Record<Contract['riskLevel'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

function formatCurrency(value: number | null, currency: string): string {
  if (value === null) return '--';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export function ContractsPage() {
  const contracts = PLACEHOLDER_CONTRACTS;

  return (
    <div className="cct-page cct-page-contracts">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Contracts</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-secondary">Import Contract</button>
          <button className="cct-btn cct-btn-primary">New Contract</button>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Status</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="under-review">Under Review</option>
            <option value="expired">Expired</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Risk Level</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Value Range</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">Any Value</option>
            <option value="over-1m">Over $1M</option>
            <option value="100k-1m">$100K - $1M</option>
            <option value="10k-100k">$10K - $100K</option>
            <option value="under-10k">Under $10K</option>
          </select>
        </div>
      </div>

      <div className="cct-table-container">
        <table className="cct-table">
          <thead>
            <tr>
              <th className="cct-th cct-th-sortable">Contract</th>
              <th className="cct-th">Parties</th>
              <th className="cct-th cct-th-sortable">Status</th>
              <th className="cct-th cct-th-sortable cct-th-right">Financial Value</th>
              <th className="cct-th cct-th-sortable">Risk Level</th>
              <th className="cct-th cct-th-sortable">Effective Date</th>
              <th className="cct-th cct-th-sortable">Expiration</th>
              <th className="cct-th">Matter</th>
              <th className="cct-th cct-th-center">Obligations</th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 ? (
              <tr>
                <td colSpan={9} className="cct-td cct-empty-row">
                  <div className="cct-empty-state">
                    <p className="cct-empty-title">No contracts tracked</p>
                    <p className="cct-empty-description">Add contracts to track parties, obligations, financial values, and risk levels.</p>
                  </div>
                </td>
              </tr>
            ) : (
              contracts.map(contract => (
                <tr key={contract.id} className="cct-tr cct-tr-clickable">
                  <td className="cct-td cct-td-primary">
                    <a href={`/contracts/${contract.id}`} className="cct-link">{contract.title}</a>
                  </td>
                  <td className="cct-td">
                    <div className="cct-parties-list">
                      {contract.parties.map((party, i) => (
                        <span key={i} className="cct-party-chip">{party}</span>
                      ))}
                    </div>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-status-badge cct-status-${contract.status}`}>
                      {STATUS_LABELS[contract.status]}
                    </span>
                  </td>
                  <td className="cct-td cct-td-right cct-td-mono">
                    {formatCurrency(contract.financialValue, contract.currency)}
                  </td>
                  <td className="cct-td">
                    <span className={`cct-risk-badge cct-risk-${contract.riskLevel}`}>
                      {RISK_LABELS[contract.riskLevel]}
                    </span>
                  </td>
                  <td className="cct-td">{contract.effectiveDate}</td>
                  <td className="cct-td">{contract.expirationDate ?? 'Perpetual'}</td>
                  <td className="cct-td">
                    {contract.matterTitle ? (
                      <a href={`/matters/${contract.matterId}`} className="cct-link">{contract.matterTitle}</a>
                    ) : '--'}
                  </td>
                  <td className="cct-td cct-td-center">{contract.obligationCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
