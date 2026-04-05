import React from 'react';

type EventType = 'invoice' | 'payment' | 'expense' | 'journal-entry' | 'accrual' | 'adjustment';
type EventStatus = 'pending' | 'posted' | 'voided' | 'reconciled';

interface AccountingEvent {
  id: string;
  date: string;
  type: EventType;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
  status: EventStatus;
  matterId: string | null;
  matterTitle: string | null;
  period: string;
}

const PLACEHOLDER_EVENTS: AccountingEvent[] = [];

const TYPE_LABELS: Record<EventType, string> = {
  invoice: 'Invoice',
  payment: 'Payment',
  expense: 'Expense',
  'journal-entry': 'Journal Entry',
  accrual: 'Accrual',
  adjustment: 'Adjustment',
};

const STATUS_LABELS: Record<EventStatus, string> = {
  pending: 'Pending',
  posted: 'Posted',
  voided: 'Voided',
  reconciled: 'Reconciled',
};

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export function AccountingPage() {
  const events = PLACEHOLDER_EVENTS;
  const currentPeriod = 'Q2 2026';

  return (
    <div className="cct-page cct-page-accounting">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Accounting</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-secondary">Export Ledger</button>
          <button className="cct-btn cct-btn-primary">New Entry</button>
        </div>
      </div>

      <div className="cct-accounting-summary">
        <div className="cct-summary-card">
          <span className="cct-summary-label">Current Period</span>
          <span className="cct-summary-value">{currentPeriod}</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-label">Pending Entries</span>
          <span className="cct-summary-number">0</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-label">Unreconciled</span>
          <span className="cct-summary-number">0</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-label">Outstanding Invoices</span>
          <span className="cct-summary-number">0</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Period</label>
          <select className="cct-filter-select" defaultValue="current">
            <option value="current">Current Period</option>
            <option value="q1-2026">Q1 2026</option>
            <option value="q4-2025">Q4 2025</option>
            <option value="q3-2025">Q3 2025</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Type</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Types</option>
            <option value="invoice">Invoices</option>
            <option value="payment">Payments</option>
            <option value="expense">Expenses</option>
            <option value="journal-entry">Journal Entries</option>
            <option value="accrual">Accruals</option>
            <option value="adjustment">Adjustments</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Status</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="posted">Posted</option>
            <option value="reconciled">Reconciled</option>
            <option value="voided">Voided</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">View</label>
          <div className="cct-view-toggle">
            <button className="cct-view-btn cct-view-active">Events</button>
            <button className="cct-view-btn">Ledger</button>
            <button className="cct-view-btn">Invoices</button>
          </div>
        </div>
      </div>

      <div className="cct-table-container">
        <table className="cct-table">
          <thead>
            <tr>
              <th className="cct-th cct-th-sortable">Date</th>
              <th className="cct-th">Type</th>
              <th className="cct-th cct-th-sortable">Description</th>
              <th className="cct-th">Debit</th>
              <th className="cct-th">Credit</th>
              <th className="cct-th cct-th-sortable cct-th-right">Amount</th>
              <th className="cct-th cct-th-sortable">Status</th>
              <th className="cct-th">Matter</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={8} className="cct-td cct-empty-row">
                  <div className="cct-empty-state">
                    <p className="cct-empty-title">No accounting events</p>
                    <p className="cct-empty-description">Accounting events, invoices, and journal entries will appear here as they are created or imported.</p>
                  </div>
                </td>
              </tr>
            ) : (
              events.map(event => (
                <tr key={event.id} className="cct-tr cct-tr-clickable">
                  <td className="cct-td cct-td-mono">{event.date}</td>
                  <td className="cct-td">
                    <span className="cct-type-badge">{TYPE_LABELS[event.type]}</span>
                  </td>
                  <td className="cct-td cct-td-primary">{event.description}</td>
                  <td className="cct-td cct-td-mono">{event.debitAccount}</td>
                  <td className="cct-td cct-td-mono">{event.creditAccount}</td>
                  <td className="cct-td cct-td-right cct-td-mono">
                    {formatCurrency(event.amount, event.currency)}
                  </td>
                  <td className="cct-td">
                    <span className={`cct-status-badge cct-status-${event.status}`}>
                      {STATUS_LABELS[event.status]}
                    </span>
                  </td>
                  <td className="cct-td">
                    {event.matterTitle ? (
                      <a href={`/matters/${event.matterId}`} className="cct-link">{event.matterTitle}</a>
                    ) : '--'}
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
