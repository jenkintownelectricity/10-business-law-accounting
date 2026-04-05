import React from 'react';

type MatterStatus = 'active' | 'pending' | 'closed' | 'on-hold';
type MatterPriority = 'critical' | 'high' | 'medium' | 'low';
type DetailTab = 'overview' | 'contracts' | 'obligations' | 'accounting' | 'evidence' | 'timeline' | 'decisions';

interface MatterDetail {
  id: string;
  title: string;
  description: string;
  status: MatterStatus;
  priority: MatterPriority;
  kernels: Array<'business' | 'law' | 'accounting'>;
  clientId: string;
  clientName: string;
  openDate: string;
  lastActivity: string;
  assignee: string;
  jurisdiction: string;
  referenceNumber: string;
}

interface FollowUpAction {
  id: string;
  title: string;
  dueDate: string | null;
  completed: boolean;
  kernel: 'business' | 'law' | 'accounting';
  priority: 'high' | 'normal' | 'low';
}

interface MatterNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  source: 'manual' | 'dictated' | 'system';
}

const PLACEHOLDER_MATTER: MatterDetail = {
  id: 'placeholder',
  title: 'Matter Title',
  description: '',
  status: 'active',
  priority: 'medium',
  kernels: ['business', 'law', 'accounting'],
  clientId: '',
  clientName: '--',
  openDate: '--',
  lastActivity: '--',
  assignee: '--',
  jurisdiction: '--',
  referenceNumber: '--',
};

const PLACEHOLDER_ACTIONS: FollowUpAction[] = [];
const PLACEHOLDER_NOTES: MatterNote[] = [];

const STATUS_LABELS: Record<MatterStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  closed: 'Closed',
  'on-hold': 'On Hold',
};

const PRIORITY_LABELS: Record<MatterPriority, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const TAB_LABELS: Record<DetailTab, string> = {
  overview: 'Overview',
  contracts: 'Contracts',
  obligations: 'Obligations',
  accounting: 'Accounting',
  evidence: 'Evidence',
  timeline: 'Timeline',
  decisions: 'Decisions',
};

export function MatterDetailPage() {
  const matter = PLACEHOLDER_MATTER;
  const actions = PLACEHOLDER_ACTIONS;
  const notes = PLACEHOLDER_NOTES;
  const activeTab = 'overview' as DetailTab;
  const focusMode = false;

  return (
    <div className={`cct-page cct-page-matter-detail ${focusMode ? 'cct-focus-mode' : ''}`}>
      {/* Matter Header */}
      <div className="cct-detail-header">
        <div className="cct-detail-header-top">
          <a href="/matters" className="cct-back-link">All Matters</a>
          <div className="cct-detail-header-actions">
            <button className={`cct-btn cct-btn-sm ${focusMode ? 'cct-btn-primary' : 'cct-btn-ghost'}`}>
              {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
            </button>
            <span className="cct-hands-free-indicator" title="Hands-free read-back available">
              <span className="cct-mic-icon cct-mic-idle" />
            </span>
            <button className="cct-btn cct-btn-sm cct-btn-ghost">Edit</button>
            <button className="cct-btn cct-btn-sm cct-btn-ghost">Actions</button>
          </div>
        </div>

        <div className="cct-detail-header-main">
          <h2 className="cct-detail-title">{matter.title}</h2>
          <div className="cct-detail-badges">
            <span className={`cct-status-badge cct-status-${matter.status}`}>
              {STATUS_LABELS[matter.status]}
            </span>
            <span className={`cct-priority-indicator cct-priority-${matter.priority}`}>
              {PRIORITY_LABELS[matter.priority]}
            </span>
            <div className="cct-kernel-tags">
              {matter.kernels.map(k => (
                <span key={k} className={`cct-kernel-tag cct-kernel-${k}`}>{k}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="cct-detail-meta-row">
          <div className="cct-detail-meta-item">
            <span className="cct-meta-label">Client</span>
            <a href={`/clients/${matter.clientId}`} className="cct-link">{matter.clientName}</a>
          </div>
          <div className="cct-detail-meta-item">
            <span className="cct-meta-label">Reference</span>
            <span className="cct-meta-value">{matter.referenceNumber}</span>
          </div>
          <div className="cct-detail-meta-item">
            <span className="cct-meta-label">Jurisdiction</span>
            <span className="cct-meta-value">{matter.jurisdiction}</span>
          </div>
          <div className="cct-detail-meta-item">
            <span className="cct-meta-label">Opened</span>
            <span className="cct-meta-value">{matter.openDate}</span>
          </div>
          <div className="cct-detail-meta-item">
            <span className="cct-meta-label">Assignee</span>
            <span className="cct-meta-value">{matter.assignee}</span>
          </div>
          <div className="cct-detail-meta-item">
            <span className="cct-meta-label">Last Activity</span>
            <span className="cct-meta-value">{matter.lastActivity}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="cct-detail-tabs">
        {(Object.keys(TAB_LABELS) as DetailTab[]).map(tab => (
          <button
            key={tab}
            className={`cct-detail-tab ${activeTab === tab ? 'cct-detail-tab-active' : ''}`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Split Pane Content */}
      <div className="cct-detail-split">
        {/* Left Pane: Matter Info */}
        <div className="cct-detail-pane-left">
          {activeTab === 'overview' && (
            <div className="cct-detail-overview">
              {/* Description */}
              <section className="cct-detail-section">
                <h3 className="cct-detail-section-title">Description</h3>
                <div className="cct-detail-description">
                  {matter.description || <span className="cct-empty-inline">No description provided</span>}
                </div>
              </section>

              {/* Key Constraints (Focus Mode shows these prominently) */}
              <section className="cct-detail-section cct-detail-section-constraints">
                <h3 className="cct-detail-section-title">Key Constraints</h3>
                <div className="cct-empty-state">
                  <p className="cct-empty-description">No constraints identified yet.</p>
                </div>
              </section>

              {/* Follow-up Actions */}
              <section className="cct-detail-section">
                <h3 className="cct-detail-section-title">
                  Follow-up Actions
                  <button className="cct-btn cct-btn-xs cct-btn-ghost">Add</button>
                </h3>
                {actions.length === 0 ? (
                  <div className="cct-empty-state">
                    <p className="cct-empty-description">No follow-up actions.</p>
                  </div>
                ) : (
                  <ul className="cct-action-list">
                    {actions.map(action => (
                      <li key={action.id} className={`cct-action-item ${action.completed ? 'cct-action-complete' : ''}`}>
                        <input
                          type="checkbox"
                          className="cct-action-checkbox"
                          defaultChecked={action.completed}
                        />
                        <div className="cct-action-info">
                          <span className="cct-action-title">{action.title}</span>
                          <div className="cct-action-meta">
                            <span className={`cct-kernel-tag cct-kernel-${action.kernel}`}>{action.kernel}</span>
                            {action.dueDate && <span className="cct-action-due">Due: {action.dueDate}</span>}
                            <span className={`cct-priority-indicator cct-priority-${action.priority}`}>
                              {action.priority}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Notes */}
              <section className="cct-detail-section">
                <h3 className="cct-detail-section-title">
                  Notes
                  <button className="cct-btn cct-btn-xs cct-btn-ghost">Add Note</button>
                  <button className="cct-btn cct-btn-xs cct-btn-ghost">Dictate</button>
                </h3>
                {notes.length === 0 ? (
                  <div className="cct-empty-state">
                    <p className="cct-empty-description">No notes. Add notes manually or via voice dictation.</p>
                  </div>
                ) : (
                  <div className="cct-notes-list">
                    {notes.map(note => (
                      <div key={note.id} className="cct-note-item">
                        <div className="cct-note-header">
                          <span className="cct-note-author">{note.author}</span>
                          <span className="cct-note-timestamp">{note.timestamp}</span>
                          {note.source === 'dictated' && <span className="cct-note-source">Dictated</span>}
                        </div>
                        <div className="cct-note-content">{note.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Active Decisions (Focus Mode core) */}
              <section className="cct-detail-section cct-detail-section-decisions">
                <h3 className="cct-detail-section-title">Active Decisions</h3>
                <div className="cct-empty-state">
                  <p className="cct-empty-description">No active decision threads for this matter.</p>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="cct-detail-tab-content">
              <div className="cct-empty-state">
                <p className="cct-empty-title">No contracts linked</p>
                <p className="cct-empty-description">Link contracts to this matter to track parties, obligations, and financial values.</p>
                <button className="cct-btn cct-btn-primary">Link Contract</button>
              </div>
            </div>
          )}

          {activeTab === 'obligations' && (
            <div className="cct-detail-tab-content">
              <div className="cct-empty-state">
                <p className="cct-empty-title">No obligations tracked</p>
                <p className="cct-empty-description">Obligations from linked contracts will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'accounting' && (
            <div className="cct-detail-tab-content">
              <div className="cct-empty-state">
                <p className="cct-empty-title">No accounting events</p>
                <p className="cct-empty-description">Accounting entries related to this matter will appear here.</p>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="cct-detail-tab-content">
              <div className="cct-empty-state">
                <p className="cct-empty-title">No evidence collected</p>
                <p className="cct-empty-description">Documents, receipts, and other evidence linked to this matter will appear here.</p>
                <button className="cct-btn cct-btn-primary">Add Evidence</button>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="cct-detail-tab-content">
              <div className="cct-empty-state">
                <p className="cct-empty-title">No timeline events</p>
                <p className="cct-empty-description">A chronological history of all matter events will build here as work progresses.</p>
              </div>
            </div>
          )}

          {activeTab === 'decisions' && (
            <div className="cct-detail-tab-content">
              <div className="cct-empty-state">
                <p className="cct-empty-title">No decision threads</p>
                <p className="cct-empty-description">Decision threads for this matter with kernel assessments will appear here.</p>
                <button className="cct-btn cct-btn-primary">Start Decision Thread</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Evidence / Receipts / Timeline */}
        <div className="cct-detail-pane-right">
          <div className="cct-detail-right-header">
            <h3 className="cct-detail-right-title">Evidence &amp; Receipts</h3>
          </div>
          <div className="cct-detail-right-content">
            <div className="cct-empty-state">
              <p className="cct-empty-description">Supporting evidence, receipts, and timeline events for the current view.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
