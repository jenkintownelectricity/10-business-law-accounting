import React from 'react';

type ReceiptKernel = 'business' | 'law' | 'accounting';
type ReceiptType = 'voice-capture' | 'document-import' | 'api-ingest' | 'manual-entry' | 'email-capture';

interface Receipt {
  id: string;
  title: string;
  type: ReceiptType;
  kernel: ReceiptKernel;
  entityType: string;
  entityId: string;
  entityTitle: string;
  timestamp: string;
  sourceDescription: string;
  dataHash: string;
  verified: boolean;
}

const PLACEHOLDER_RECEIPTS: Receipt[] = [];

const TYPE_LABELS: Record<ReceiptType, string> = {
  'voice-capture': 'Voice Capture',
  'document-import': 'Document Import',
  'api-ingest': 'API Ingest',
  'manual-entry': 'Manual Entry',
  'email-capture': 'Email Capture',
};

export function ReceiptsPage() {
  const receipts = PLACEHOLDER_RECEIPTS;

  return (
    <div className="cct-page cct-page-receipts">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Receipts</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-secondary">Export</button>
        </div>
      </div>

      <div className="cct-receipt-summary">
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Total Receipts</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number cct-kernel-business">0</span>
          <span className="cct-summary-label">Business</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number cct-kernel-law">0</span>
          <span className="cct-summary-label">Law</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number cct-kernel-accounting">0</span>
          <span className="cct-summary-label">Accounting</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Kernel</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Kernels</option>
            <option value="business">Business</option>
            <option value="law">Law</option>
            <option value="accounting">Accounting</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Type</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Types</option>
            <option value="voice-capture">Voice Capture</option>
            <option value="document-import">Document Import</option>
            <option value="api-ingest">API Ingest</option>
            <option value="manual-entry">Manual Entry</option>
            <option value="email-capture">Email Capture</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Entity Type</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Entities</option>
            <option value="matter">Matter</option>
            <option value="contract">Contract</option>
            <option value="obligation">Obligation</option>
            <option value="client">Client</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Time Range</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="this-quarter">This Quarter</option>
          </select>
        </div>
      </div>

      <div className="cct-table-container">
        <table className="cct-table">
          <thead>
            <tr>
              <th className="cct-th cct-th-sortable">Timestamp</th>
              <th className="cct-th">Title</th>
              <th className="cct-th">Type</th>
              <th className="cct-th">Kernel</th>
              <th className="cct-th">Entity</th>
              <th className="cct-th">Source</th>
              <th className="cct-th cct-th-center">Verified</th>
              <th className="cct-th">Hash</th>
            </tr>
          </thead>
          <tbody>
            {receipts.length === 0 ? (
              <tr>
                <td colSpan={8} className="cct-td cct-empty-row">
                  <div className="cct-empty-state">
                    <p className="cct-empty-title">No receipts recorded</p>
                    <p className="cct-empty-description">Receipts provide an immutable audit trail for all domain operations across Business, Law, and Accounting kernels.</p>
                  </div>
                </td>
              </tr>
            ) : (
              receipts.map(receipt => (
                <tr key={receipt.id} className="cct-tr cct-tr-clickable">
                  <td className="cct-td cct-td-mono">{receipt.timestamp}</td>
                  <td className="cct-td cct-td-primary">{receipt.title}</td>
                  <td className="cct-td">
                    <span className="cct-type-badge">{TYPE_LABELS[receipt.type]}</span>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-kernel-tag cct-kernel-${receipt.kernel}`}>{receipt.kernel}</span>
                  </td>
                  <td className="cct-td">
                    <a href={`/${receipt.entityType}s/${receipt.entityId}`} className="cct-link">
                      {receipt.entityTitle}
                    </a>
                  </td>
                  <td className="cct-td">{receipt.sourceDescription}</td>
                  <td className="cct-td cct-td-center">
                    <span className={`cct-verified-badge ${receipt.verified ? 'cct-verified' : 'cct-unverified'}`}>
                      {receipt.verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="cct-td cct-td-mono cct-td-truncate" title={receipt.dataHash}>
                    {receipt.dataHash.substring(0, 12)}...
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
