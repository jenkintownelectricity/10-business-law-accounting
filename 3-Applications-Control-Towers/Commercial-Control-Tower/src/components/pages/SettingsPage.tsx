import React from 'react';

type KernelStatus = 'active' | 'inactive' | 'error';
type PlatformAttachment = 'connected' | 'disconnected' | 'pending';

interface KernelConfig {
  id: 'business' | 'law' | 'accounting';
  name: string;
  status: KernelStatus;
  version: string;
  lastSync: string;
  entityCount: number;
}

interface PlatformConnection {
  id: string;
  name: string;
  type: string;
  status: PlatformAttachment;
  lastSync: string | null;
}

const KERNEL_CONFIGS: KernelConfig[] = [
  { id: 'business', name: 'Business Kernel', status: 'active', version: '0.1.0', lastSync: '--', entityCount: 0 },
  { id: 'law', name: 'Law Kernel', status: 'active', version: '0.1.0', lastSync: '--', entityCount: 0 },
  { id: 'accounting', name: 'Accounting Kernel', status: 'active', version: '0.1.0', lastSync: '--', entityCount: 0 },
];

const PLATFORM_CONNECTIONS: PlatformConnection[] = [];

export function SettingsPage() {
  return (
    <div className="cct-page cct-page-settings">
      <div className="cct-page-header">
        <h2 className="cct-page-title">Settings</h2>
      </div>

      <div className="cct-settings-layout">
        {/* Settings Navigation */}
        <nav className="cct-settings-nav">
          <ul className="cct-settings-nav-list">
            <li className="cct-settings-nav-item cct-settings-nav-active">
              <a href="#domain">Domain Configuration</a>
            </li>
            <li className="cct-settings-nav-item">
              <a href="#kernels">Kernel Configuration</a>
            </li>
            <li className="cct-settings-nav-item">
              <a href="#platforms">Platform Attachments</a>
            </li>
            <li className="cct-settings-nav-item">
              <a href="#voice">Voice Settings</a>
            </li>
            <li className="cct-settings-nav-item">
              <a href="#review">Review Policies</a>
            </li>
            <li className="cct-settings-nav-item">
              <a href="#receipts">Receipt Configuration</a>
            </li>
            <li className="cct-settings-nav-item">
              <a href="#users">Users &amp; Permissions</a>
            </li>
          </ul>
        </nav>

        {/* Settings Content */}
        <div className="cct-settings-content">
          {/* Domain Configuration */}
          <section id="domain" className="cct-settings-section">
            <h3 className="cct-settings-section-title">Domain Configuration</h3>
            <div className="cct-form">
              <div className="cct-form-group">
                <label className="cct-form-label">Domain Name</label>
                <input type="text" className="cct-form-input" defaultValue="Business Law Accounting" readOnly />
                <p className="cct-form-hint">Sovereign domain identifier. Read-only after initialization.</p>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Domain Version</label>
                <input type="text" className="cct-form-input" defaultValue="0.1.0" readOnly />
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Default Currency</label>
                <select className="cct-form-select" defaultValue="USD">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Default Jurisdiction</label>
                <input type="text" className="cct-form-input" defaultValue="" placeholder="e.g., US-DE, US-NY" />
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Fiscal Year Start</label>
                <select className="cct-form-select" defaultValue="january">
                  <option value="january">January</option>
                  <option value="april">April</option>
                  <option value="july">July</option>
                  <option value="october">October</option>
                </select>
              </div>
            </div>
          </section>

          {/* Kernel Configuration */}
          <section id="kernels" className="cct-settings-section">
            <h3 className="cct-settings-section-title">Kernel Configuration</h3>
            <div className="cct-kernel-config-list">
              {KERNEL_CONFIGS.map(kernel => (
                <div key={kernel.id} className={`cct-kernel-config-card cct-kernel-config-${kernel.id}`}>
                  <div className="cct-kernel-config-header">
                    <span className={`cct-kernel-dot cct-kernel-${kernel.status}`} />
                    <h4 className="cct-kernel-config-name">{kernel.name}</h4>
                    <span className={`cct-status-badge cct-status-${kernel.status}`}>{kernel.status}</span>
                  </div>
                  <div className="cct-kernel-config-details">
                    <div className="cct-kernel-config-stat">
                      <span className="cct-config-label">Version</span>
                      <span className="cct-config-value">{kernel.version}</span>
                    </div>
                    <div className="cct-kernel-config-stat">
                      <span className="cct-config-label">Last Sync</span>
                      <span className="cct-config-value">{kernel.lastSync}</span>
                    </div>
                    <div className="cct-kernel-config-stat">
                      <span className="cct-config-label">Entities</span>
                      <span className="cct-config-value">{kernel.entityCount}</span>
                    </div>
                  </div>
                  <div className="cct-kernel-config-actions">
                    <button className="cct-btn cct-btn-sm cct-btn-ghost">Configure</button>
                    <button className="cct-btn cct-btn-sm cct-btn-ghost">Sync Now</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform Attachments */}
          <section id="platforms" className="cct-settings-section">
            <h3 className="cct-settings-section-title">Platform Attachments</h3>
            <p className="cct-settings-description">Connect external platforms for data import and synchronization. Platforms provide data; the domain retains sovereignty over interpretation and storage.</p>
            {PLATFORM_CONNECTIONS.length === 0 ? (
              <div className="cct-empty-state">
                <p className="cct-empty-description">No platform connections configured.</p>
                <button className="cct-btn cct-btn-primary">Add Platform Connection</button>
              </div>
            ) : (
              <div className="cct-platform-list">
                {PLATFORM_CONNECTIONS.map(platform => (
                  <div key={platform.id} className="cct-platform-card">
                    <div className="cct-platform-info">
                      <h4 className="cct-platform-name">{platform.name}</h4>
                      <span className="cct-platform-type">{platform.type}</span>
                    </div>
                    <span className={`cct-status-badge cct-status-${platform.status}`}>{platform.status}</span>
                    {platform.lastSync && <span className="cct-platform-sync">Last sync: {platform.lastSync}</span>}
                    <button className="cct-btn cct-btn-sm cct-btn-ghost">Configure</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Voice Settings */}
          <section id="voice" className="cct-settings-section">
            <h3 className="cct-settings-section-title">Voice Settings</h3>
            <div className="cct-form">
              <div className="cct-form-group">
                <label className="cct-form-label">Voice Input Language</label>
                <select className="cct-form-select" defaultValue="en-US">
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                </select>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Auto-Normalize Domain Terms</label>
                <label className="cct-toggle">
                  <input type="checkbox" className="cct-toggle-input" defaultChecked />
                  <span className="cct-toggle-switch" />
                  <span className="cct-toggle-label">Automatically normalize legal and accounting terminology</span>
                </label>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Confidence Threshold</label>
                <input type="range" className="cct-form-range" min="50" max="99" defaultValue="80" />
                <p className="cct-form-hint">Minimum confidence for auto-acceptance. Below this threshold, items are routed to the review queue.</p>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Read-Back Voice</label>
                <select className="cct-form-select" defaultValue="default">
                  <option value="default">System Default</option>
                  <option value="professional-1">Professional Voice 1</option>
                  <option value="professional-2">Professional Voice 2</option>
                </select>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Hands-Free Timeout</label>
                <select className="cct-form-select" defaultValue="30">
                  <option value="15">15 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="120">2 minutes</option>
                  <option value="0">No timeout</option>
                </select>
              </div>
            </div>
          </section>

          {/* Review Policies */}
          <section id="review" className="cct-settings-section">
            <h3 className="cct-settings-section-title">Review Policies</h3>
            <div className="cct-form">
              <div className="cct-form-group">
                <label className="cct-form-label">Auto-approve Verified Sources</label>
                <label className="cct-toggle">
                  <input type="checkbox" className="cct-toggle-input" />
                  <span className="cct-toggle-switch" />
                  <span className="cct-toggle-label">Automatically approve items from verified sources</span>
                </label>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">Require Multi-Kernel Review</label>
                <label className="cct-toggle">
                  <input type="checkbox" className="cct-toggle-input" defaultChecked />
                  <span className="cct-toggle-switch" />
                  <span className="cct-toggle-label">Require review from all affected kernels before approval</span>
                </label>
              </div>
              <div className="cct-form-group">
                <label className="cct-form-label">AI Suggestion Routing</label>
                <select className="cct-form-select" defaultValue="always-review">
                  <option value="always-review">Always Route to Review</option>
                  <option value="high-confidence">Auto-accept High Confidence</option>
                  <option value="never">Never Auto-accept</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
