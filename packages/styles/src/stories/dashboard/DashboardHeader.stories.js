export default {
  title: 'Dashboard/Dashboard Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. The dashboard header uses `.pathable-dashboard-header` with child regions. The page title must be the semantic `h1`.',
      },
    },
  },
}

export const Default = {
  render: () => `
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
        Track and manage employment pathway programs across all regions. View participant progress, outcomes, and key metrics at a glance.
      </p>
    </div>
  `,
}

export const WithoutActions = {
  render: () => `
    <div class="pathable-dashboard-header">
      <div class="pathable-dashboard-header__row">
        <h1 class="pathable-dashboard-header__title">My Dashboard</h1>
        <span class="pathable-dashboard-header__context">Last updated today</span>
      </div>
      <p class="pathable-dashboard-header__description">
        A personalized overview of your active programs, upcoming tasks, and recent activity.
      </p>
    </div>
  `,
}

export const WithManyActions = {
  render: () => `
    <div class="pathable-dashboard-header">
      <div class="pathable-dashboard-header__breadcrumb">
        <a href="#">Admin</a>
        <span>Reports</span>
      </div>
      <div class="pathable-dashboard-header__row">
        <h1 class="pathable-dashboard-header__title">Quarterly Report</h1>
        <span class="pathable-dashboard-header__context">Draft &middot; Q2 2026</span>
        <div class="pathable-dashboard-header__actions">
          <button class="pathable-button pathable-button--outline">Preview</button>
          <button class="pathable-button pathable-button--outline">Share</button>
          <button class="pathable-button pathable-button--outline">Download</button>
          <button class="pathable-button">Publish</button>
        </div>
      </div>
      <p class="pathable-dashboard-header__description">
        Comprehensive quarterly report covering program outcomes, participant demographics, and performance against targets.
      </p>
    </div>
  `,
}

export const Compact = {
  render: () => `
    <div class="pathable-dashboard-header pathable-dashboard-header--compact">
      <div class="pathable-dashboard-header__row">
        <h1 class="pathable-dashboard-header__title">Program Summary</h1>
        <div class="pathable-dashboard-header__actions">
          <button class="pathable-button pathable-button--outline">Edit</button>
        </div>
      </div>
    </div>
  `,
}

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => `
    <div class="pathable-dashboard-header" style="max-width: 375px;">
      <div class="pathable-dashboard-header__breadcrumb">
        <a href="#">Home</a>
        <span>Programs</span>
      </div>
      <div class="pathable-dashboard-header__row">
        <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
        <span class="pathable-dashboard-header__context">Active</span>
        <div class="pathable-dashboard-header__actions">
          <button class="pathable-button pathable-button--outline">Export</button>
          <button class="pathable-button">Add</button>
        </div>
      </div>
      <p class="pathable-dashboard-header__description">
        Track and manage employment pathway programs.
      </p>
    </div>
  `,
}

export const LongTitle = {
  render: () => `
    <div class="pathable-dashboard-header">
      <div class="pathable-dashboard-header__breadcrumb">
        <a href="#">Home</a>
        <span>Programs</span>
        <span>Employment Pathways</span>
        <span>Vocational Rehabilitation</span>
        <span>Customized Employment</span>
      </div>
      <div class="pathable-dashboard-header__row">
        <h1 class="pathable-dashboard-header__title">Individualized Placement and Support (IPS) Employment Program Overview and Performance Metrics</h1>
        <div class="pathable-dashboard-header__actions">
          <button class="pathable-button">Edit</button>
        </div>
      </div>
    </div>
  `,
}
