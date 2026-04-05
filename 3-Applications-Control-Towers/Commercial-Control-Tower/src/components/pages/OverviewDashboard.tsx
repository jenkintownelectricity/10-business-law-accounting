import React from 'react';

export function OverviewDashboard() {
  return (
    <div className="cct-overview">
      <div className="cct-overview-header">
        <h2 className="cct-page-title">Overview</h2>
        <div className="cct-overview-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>

      <div className="cct-overview-grid">
        {/* Due Today / Due Soon */}
        <section className="cct-panel cct-panel-priority">
          <h3 className="cct-panel-title">Due Today</h3>
          <div className="cct-panel-body">
            <div className="cct-empty-state">No items due today</div>
          </div>
        </section>

        {/* Active Matters */}
        <section className="cct-panel cct-panel-matters">
          <h3 className="cct-panel-title">Active Matters</h3>
          <div className="cct-panel-count">
            <span className="cct-count-number">0</span>
            <span className="cct-count-label">matters</span>
          </div>
          <div className="cct-kernel-breakdown">
            <span className="cct-kernel-tag cct-kernel-business">Business: 0</span>
            <span className="cct-kernel-tag cct-kernel-law">Law: 0</span>
            <span className="cct-kernel-tag cct-kernel-accounting">Accounting: 0</span>
          </div>
        </section>

        {/* Unresolved Risks */}
        <section className="cct-panel cct-panel-risks">
          <h3 className="cct-panel-title">Unresolved Risks</h3>
          <div className="cct-panel-body">
            <div className="cct-empty-state">No unresolved risks</div>
          </div>
        </section>

        {/* Review Queue */}
        <section className="cct-panel cct-panel-review">
          <h3 className="cct-panel-title">Review Queue</h3>
          <div className="cct-panel-count">
            <span className="cct-count-number">0</span>
            <span className="cct-count-label">items pending review</span>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="cct-panel cct-panel-activity">
          <h3 className="cct-panel-title">Recent Activity</h3>
          <div className="cct-panel-body">
            <div className="cct-empty-state">No recent activity</div>
          </div>
        </section>

        {/* Upcoming Deadlines */}
        <section className="cct-panel cct-panel-deadlines">
          <h3 className="cct-panel-title">Upcoming Deadlines</h3>
          <div className="cct-panel-body">
            <div className="cct-empty-state">No upcoming deadlines</div>
          </div>
        </section>
      </div>
    </div>
  );
}
