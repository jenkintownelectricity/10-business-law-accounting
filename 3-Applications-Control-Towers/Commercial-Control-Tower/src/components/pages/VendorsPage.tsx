import React from 'react';

interface Vendor {
  id: string;
  name: string;
  category: string;
  validationStatus: 'validated' | 'pending-validation' | 'unvalidated' | 'suspended';
  primaryContact: string;
  contractCount: number;
  totalSpend: number;
  currency: string;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const PLACEHOLDER_VENDORS: Vendor[] = [];

const VALIDATION_LABELS: Record<Vendor['validationStatus'], string> = {
  validated: 'Validated',
  'pending-validation': 'Pending Validation',
  unvalidated: 'Unvalidated',
  suspended: 'Suspended',
};

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function VendorsPage() {
  const vendors = PLACEHOLDER_VENDORS;

  return (
    <div className="cct-page cct-page-vendors">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Vendors</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-primary">Add Vendor</button>
        </div>
      </div>

      <div className="cct-vendor-summary">
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Total Vendors</span>
        </div>
        <div className="cct-summary-card cct-summary-success">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Validated</span>
        </div>
        <div className="cct-summary-card cct-summary-warning">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Pending Validation</span>
        </div>
        <div className="cct-summary-card cct-summary-danger">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Suspended</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Validation Status</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All</option>
            <option value="validated">Validated</option>
            <option value="pending-validation">Pending Validation</option>
            <option value="unvalidated">Unvalidated</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Risk Level</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Levels</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="cct-filter-group cct-filter-search">
          <input type="text" className="cct-filter-input" placeholder="Search vendors..." />
        </div>
      </div>

      <div className="cct-table-container">
        <table className="cct-table">
          <thead>
            <tr>
              <th className="cct-th cct-th-sortable">Vendor</th>
              <th className="cct-th">Category</th>
              <th className="cct-th cct-th-sortable">Validation</th>
              <th className="cct-th">Risk</th>
              <th className="cct-th">Contact</th>
              <th className="cct-th cct-th-center">Contracts</th>
              <th className="cct-th cct-th-right cct-th-sortable">Total Spend</th>
              <th className="cct-th cct-th-sortable">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={8} className="cct-td cct-empty-row">
                  <div className="cct-empty-state">
                    <p className="cct-empty-title">No vendors in directory</p>
                    <p className="cct-empty-description">Add vendors to track validation status, contracts, and spend across the domain.</p>
                  </div>
                </td>
              </tr>
            ) : (
              vendors.map(vendor => (
                <tr key={vendor.id} className="cct-tr cct-tr-clickable">
                  <td className="cct-td cct-td-primary">
                    <a href={`/vendors/${vendor.id}`} className="cct-link">{vendor.name}</a>
                  </td>
                  <td className="cct-td">{vendor.category}</td>
                  <td className="cct-td">
                    <span className={`cct-validation-badge cct-validation-${vendor.validationStatus}`}>
                      {VALIDATION_LABELS[vendor.validationStatus]}
                    </span>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-risk-badge cct-risk-${vendor.riskLevel}`}>{vendor.riskLevel}</span>
                  </td>
                  <td className="cct-td">{vendor.primaryContact}</td>
                  <td className="cct-td cct-td-center">{vendor.contractCount}</td>
                  <td className="cct-td cct-td-right cct-td-mono">
                    {formatCurrency(vendor.totalSpend, vendor.currency)}
                  </td>
                  <td className="cct-td">{vendor.lastActivity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
