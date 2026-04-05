import React from 'react';

interface Client {
  id: string;
  name: string;
  type: 'individual' | 'corporation' | 'partnership' | 'government' | 'nonprofit';
  contactEmail: string;
  contactPhone: string;
  activeMattersCount: number;
  totalMattersCount: number;
  status: 'active' | 'inactive' | 'prospect';
  jurisdiction: string;
  onboardedDate: string;
}

const PLACEHOLDER_CLIENTS: Client[] = [];

const TYPE_LABELS: Record<Client['type'], string> = {
  individual: 'Individual',
  corporation: 'Corporation',
  partnership: 'Partnership',
  government: 'Government',
  nonprofit: 'Nonprofit',
};

export function ClientsPage() {
  const clients = PLACEHOLDER_CLIENTS;

  return (
    <div className="cct-page cct-page-clients">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Clients</h2>
        <div className="cct-page-actions">
          <button className="cct-btn cct-btn-primary">Add Client</button>
        </div>
      </div>

      <div className="cct-client-summary">
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Active Clients</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Total Matters</span>
        </div>
        <div className="cct-summary-card">
          <span className="cct-summary-number">0</span>
          <span className="cct-summary-label">Prospects</span>
        </div>
      </div>

      <div className="cct-filters">
        <div className="cct-filter-group">
          <label className="cct-filter-label">Status</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>
        <div className="cct-filter-group">
          <label className="cct-filter-label">Type</label>
          <select className="cct-filter-select" defaultValue="all">
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="corporation">Corporation</option>
            <option value="partnership">Partnership</option>
            <option value="government">Government</option>
            <option value="nonprofit">Nonprofit</option>
          </select>
        </div>
        <div className="cct-filter-group cct-filter-search">
          <input type="text" className="cct-filter-input" placeholder="Search clients..." />
        </div>
      </div>

      <div className="cct-table-container">
        <table className="cct-table">
          <thead>
            <tr>
              <th className="cct-th cct-th-sortable">Client Name</th>
              <th className="cct-th">Type</th>
              <th className="cct-th cct-th-sortable">Status</th>
              <th className="cct-th">Jurisdiction</th>
              <th className="cct-th">Contact</th>
              <th className="cct-th cct-th-center cct-th-sortable">Active Matters</th>
              <th className="cct-th cct-th-center">Total Matters</th>
              <th className="cct-th cct-th-sortable">Onboarded</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="cct-td cct-empty-row">
                  <div className="cct-empty-state">
                    <p className="cct-empty-title">No clients in directory</p>
                    <p className="cct-empty-description">Add clients to associate them with matters, contracts, and accounting events.</p>
                  </div>
                </td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id} className="cct-tr cct-tr-clickable">
                  <td className="cct-td cct-td-primary">
                    <a href={`/clients/${client.id}`} className="cct-link">{client.name}</a>
                  </td>
                  <td className="cct-td">
                    <span className="cct-type-badge">{TYPE_LABELS[client.type]}</span>
                  </td>
                  <td className="cct-td">
                    <span className={`cct-status-badge cct-status-${client.status}`}>{client.status}</span>
                  </td>
                  <td className="cct-td">{client.jurisdiction}</td>
                  <td className="cct-td">
                    <div className="cct-contact-info">
                      <span className="cct-contact-email">{client.contactEmail}</span>
                    </div>
                  </td>
                  <td className="cct-td cct-td-center">
                    <span className="cct-count-badge">{client.activeMattersCount}</span>
                  </td>
                  <td className="cct-td cct-td-center">{client.totalMattersCount}</td>
                  <td className="cct-td">{client.onboardedDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
