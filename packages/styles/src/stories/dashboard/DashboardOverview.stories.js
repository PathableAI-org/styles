export default {
  title: 'Dashboard/Dashboard Overview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — composition example\n\n**Consumers must**: Import `@pathable/styles` CSS. This story composes the dashboard header, KPI grid, and activity list into a cohesive dashboard overview page, demonstrating how the patterns work together.',
      },
    },
  },
}

export const Populated = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div class="pathable-dashboard-header">
        <div class="pathable-dashboard-header__breadcrumb">
          <a href="#">Home</a>
          <span>Programs</span>
          <span>Employment Pathways</span>
        </div>
        <div class="pathable-dashboard-header__row">
          <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
          <span class="pathable-dashboard-header__context">Active &middot; Q4 2026</span>
          <div class="pathable-dashboard-header__actions">
            <button class="pathable-button pathable-button--outline">Export</button>
            <button class="pathable-button">Add Program</button>
          </div>
        </div>
        <p class="pathable-dashboard-header__description">
          Track and manage employment pathway programs across all regions.
        </p>
      </div>

      <div class="pathable-kpi-grid">
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">1,247</p>
          <p class="pathable-kpi-card__label">Active Participants</p>
          <div class="pathable-kpi-card__trend" data-trend="up">
            <span class="pathable-kpi-card__trend-label">+12% from last month</span>
          </div>
        </div>
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">86%</p>
          <p class="pathable-kpi-card__label">Placement Rate</p>
          <div class="pathable-kpi-card__trend" data-trend="up">
            <span class="pathable-kpi-card__trend-label">+5% from last quarter</span>
          </div>
        </div>
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">342</p>
          <p class="pathable-kpi-card__label">New Enrollments</p>
          <div class="pathable-kpi-card__trend" data-trend="down">
            <span class="pathable-kpi-card__trend-label">-5% from last month</span>
          </div>
        </div>
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">28</p>
          <p class="pathable-kpi-card__label">Partner Organizations</p>
          <div class="pathable-kpi-card__trend" data-trend="neutral">
            <span class="pathable-kpi-card__trend-label">No change</span>
          </div>
        </div>
      </div>

      <div class="pathable-activity-list">
        <h3 class="pathable-activity-list__group-heading">Today</h3>
        <div class="pathable-activity-row">
          <div class="pathable-activity-row__status" data-status="completed" role="img" aria-label="completed">
            <span class="pathable-activity-row__status-text pathable-sr-only">completed</span>
          </div>
          <div class="pathable-activity-row__body">
            <p class="pathable-activity-row__title">Intake assessment completed</p>
            <p class="pathable-activity-row__context">Participant: Maria Gonzalez</p>
          </div>
          <span class="pathable-activity-row__date">2:30 PM</span>
          <span class="pathable-activity-row__owner">You</span>
        </div>
        <div class="pathable-activity-row">
          <div class="pathable-activity-row__status" data-status="in-progress" role="img" aria-label="in progress">
            <span class="pathable-activity-row__status-text pathable-sr-only">in progress</span>
          </div>
          <div class="pathable-activity-row__body">
            <p class="pathable-activity-row__title">Follow-up call scheduled</p>
            <p class="pathable-activity-row__context">Provider: Cascade Resources</p>
          </div>
          <span class="pathable-activity-row__date">11:00 AM</span>
          <span class="pathable-activity-row__owner">Sara M.</span>
        </div>
      </div>
    </div>
  `,
}

export const Loading = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div class="pathable-dashboard-header">
        <div class="pathable-dashboard-header__row">
          <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
        </div>
        <p class="pathable-dashboard-header__description">Loading dashboard data...</p>
      </div>

      <div class="pathable-kpi-grid">
        <div class="pathable-kpi-card pathable-kpi-card--loading">
          <div class="pathable-kpi-card__value" aria-hidden="true"></div>
          <div class="pathable-kpi-card__label" aria-hidden="true"></div>
        </div>
        <div class="pathable-kpi-card pathable-kpi-card--loading">
          <div class="pathable-kpi-card__value" aria-hidden="true"></div>
          <div class="pathable-kpi-card__label" aria-hidden="true"></div>
        </div>
        <div class="pathable-kpi-card pathable-kpi-card--loading">
          <div class="pathable-kpi-card__value" aria-hidden="true"></div>
          <div class="pathable-kpi-card__label" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  `,
}

export const Empty = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div class="pathable-dashboard-header">
        <div class="pathable-dashboard-header__row">
          <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
        </div>
        <p class="pathable-dashboard-header__description">
          No program data available yet. Add a program to get started.
        </p>
        <div class="pathable-dashboard-header__actions">
          <button class="pathable-button">Add Program</button>
        </div>
      </div>

      <div class="pathable-kpi-grid">
        <div class="pathable-kpi-card pathable-kpi-card--unavailable">
          <p class="pathable-kpi-card__value"><span>N/A</span></p>
          <p class="pathable-kpi-card__label">Active Participants</p>
        </div>
        <div class="pathable-kpi-card pathable-kpi-card--unavailable">
          <p class="pathable-kpi-card__value"><span>N/A</span></p>
          <p class="pathable-kpi-card__label">Placement Rate</p>
        </div>
      </div>

      <table class="pathable-table pathable-table--empty pathable-table--borderless">
        <thead>
          <tr><th>Activity</th><th>Date</th></tr>
        </thead>
        <tbody>
          <tr><td colspan="2"><span class="pathable-table__empty-message">No recent activity.</span></td></tr>
        </tbody>
      </table>
    </div>
  `,
}
