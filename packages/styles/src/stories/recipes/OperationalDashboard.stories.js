export default {
  title: 'Recipes/Operational Dashboard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only. Table sorting, data loading, and toast dismissal are static in this demonstration. ' +
          'Consumers must add JavaScript for sort, pagination, data fetching, and toast auto-dismiss behavior.\n\n' +
          '**Consumers must**: Import `@pathable/styles` CSS. This recipe composes an app shell with sidebar navigation, dashboard header, KPI grid, ' +
          'activity timeline, schedule, responsive data table, and toast notification from existing public CSS classes.\n\n' +
          '**Accessibility notes**: The table uses `<th scope="col">` for column headers. KPI cards include visible trend labels (not just color or icon). ' +
          'Activity rows use `data-status` with `role="img"` and `aria-label` for status indicators. ' +
          'The toast uses `role="status"` for automatic screen-reader announcement. ' +
          'The sidebar navigation uses `aria-current="page"` on the active link. ' +
          'The main content area has `id="main-content"` for skip-navigation targets. ' +
          'Consumers implementing JavaScript must: update `aria-sort` on table headers for sortable columns, use `aria-live` for content updates, and manage focus when loading new data.',
      },
    },
  },
}

/* -------------------------------------------------- */
/* Sidebar                                               */
/* -------------------------------------------------- */
const sidebarHtml = `
<aside class="pathable-app-shell__sidebar">
  <div class="pathable-app-shell__brand" style="padding:0.5rem 0;">
    <strong style="font-size:1.125rem;color:var(--pathable-color-accent);">PathAble</strong>
  </div>
  <nav class="pathable-app-shell__nav">
    <a href="#" class="pathable-app-shell__nav-item pathable-app-shell__nav-item--active" aria-current="page">Dashboard</a>
    <a href="#" class="pathable-app-shell__nav-item">Participants</a>
    <a href="#" class="pathable-app-shell__nav-item">Programs</a>
    <a href="#" class="pathable-app-shell__nav-item">Reports</a>
    <a href="#" class="pathable-app-shell__nav-item">Settings</a>
  </nav>
  <div class="pathable-app-shell__account" style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--pathable-color-border);">
    <span style="font-size:0.875rem;color:var(--pathable-color-text-muted);">Signed in as <strong>admin@example.gov</strong></span>
  </div>
</aside>
`

/* -------------------------------------------------- */
/* Topbar (mobile shell only)                           */
/* -------------------------------------------------- */
const topbarHtml = `
<header class="pathable-app-shell__topbar">
  <span class="pathable-app-shell__topbar-title">PathAble</span>
</header>
`

/* -------------------------------------------------- */
/* Dashboard Header                                      */
/* -------------------------------------------------- */
const dashboardHeaderHtml = `
<div class="pathable-dashboard-header">
  <div class="pathable-dashboard-header__breadcrumb">
    <a href="#">Home</a>
    <span>Programs</span>
    <span>Employment Pathways</span>
  </div>
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title" style="font-family:var(--pathable-font-heading);font-size:1.5rem;font-weight:400;color:var(--pathable-color-text);">Program Overview</h1>
    <span class="pathable-dashboard-header__context">Active &middot; Q4 2026</span>
    <div class="pathable-dashboard-header__actions">
      <button class="pathable-button pathable-button--outline">Export</button>
      <button class="pathable-button">Add Program</button>
    </div>
  </div>
  <p class="pathable-dashboard-header__description">Track and manage Employment Pathways program performance, participant outcomes, and team activity across all regions.</p>
</div>
`

/* -------------------------------------------------- */
/* KPI Grid                                              */
/* -------------------------------------------------- */
const kpiGridHtml = `
<div class="pathable-kpi-grid" style="margin:1.5rem 0;">
  <div class="pathable-kpi-card">
    <p class="pathable-kpi-card__value">1,247</p>
    <p class="pathable-kpi-card__label">Active Participants</p>
    <div class="pathable-kpi-card__trend" data-trend="up">
      <span class="pathable-kpi-card__trend-label">+12% vs last month</span>
    </div>
  </div>
  <div class="pathable-kpi-card">
    <p class="pathable-kpi-card__value">83%</p>
    <p class="pathable-kpi-card__label">Placement Rate</p>
    <div class="pathable-kpi-card__trend" data-trend="up">
      <span class="pathable-kpi-card__trend-label">+5% vs last quarter</span>
    </div>
  </div>
  <div class="pathable-kpi-card">
    <p class="pathable-kpi-card__value">28</p>
    <p class="pathable-kpi-card__label">Pending Reviews</p>
    <div class="pathable-kpi-card__trend" data-trend="neutral">
      <span class="pathable-kpi-card__trend-label">Same as last week</span>
    </div>
  </div>
  <div class="pathable-kpi-card">
    <p class="pathable-kpi-card__value">4.2</p>
    <p class="pathable-kpi-card__label">Avg. Days to Placement</p>
    <div class="pathable-kpi-card__trend" data-trend="down">
      <span class="pathable-kpi-card__trend-label">-0.8 days vs target</span>
    </div>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Activity Timeline                                     */
/* -------------------------------------------------- */
const activities = [
  {
    title: 'Intake assessment completed',
    context: 'Participant: Maria Gonzalez',
    date: '2:30 PM',
    owner: 'You',
    status: 'completed',
  },
  {
    title: 'Quarterly review submitted',
    context: 'Program: Employment Pathways',
    date: '1:15 PM',
    owner: 'Jamie Chen',
    status: 'completed',
  },
  {
    title: 'New participant enrollment',
    context: 'Participant: Robert Kim',
    date: '11:00 AM',
    owner: 'You',
    status: 'in-progress',
  },
  {
    title: 'Compliance audit flagged',
    context: 'Documentation required for Program #204',
    date: '9:45 AM',
    owner: 'Admin',
    status: 'pending',
  },
  {
    title: 'Placement confirmed',
    context: 'Participant: David Okonkwo — TechCorp Industries',
    date: 'Yesterday',
    owner: 'Sam Rivera',
    status: 'completed',
  },
]

const buildActivityRow = (a) => {
  const statusLabels = {
    completed: 'Completed',
    'in-progress': 'In progress',
    pending: 'Pending',
    cancelled: 'Cancelled',
  }
  const statusLabel = statusLabels[a.status] || a.status
  return `
<div class="pathable-activity-row">
  <div class="pathable-activity-row__status" data-status="${a.status}" role="img" aria-label="Status: ${statusLabel}"></div>
  <div class="pathable-activity-row__body">
    <p class="pathable-activity-row__title">${a.title}</p>
    <p class="pathable-activity-row__context">${a.context}</p>
  </div>
  <span class="pathable-activity-row__date">${a.date}</span>
  <span class="pathable-activity-row__owner">${a.owner}</span>
</div>
`
}

const activityListHtml = `
<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
    <h2 style="margin:0;font-family:var(--pathable-font-subheading);font-size:1rem;font-weight:700;color:var(--pathable-color-text);">Recent Activity</h2>
    <a href="#" style="font-size:0.875rem;">View all</a>
  </div>
  <div class="pathable-activity-list">
    <h3 class="pathable-activity-list__group-heading">Today</h3>
    ${activities.slice(0, 4).map(buildActivityRow).join('')}
    <h3 class="pathable-activity-list__group-heading">Yesterday</h3>
    ${activities.slice(4).map(buildActivityRow).join('')}
  </div>
</div>
`

/* -------------------------------------------------- */
/* Schedule                                              */
/* -------------------------------------------------- */
const scheduleItems = [
  {
    title: 'Initial Assessment',
    context: 'New participant intake — Maria Gonzalez',
    date: { month: 'MAR', day: '15', time: '10:00 AM' },
    location: 'Main Office, Room 102',
    status: 'upcoming',
  },
  {
    title: 'Job Readiness Workshop',
    context: 'Group B — Session 4 of 6',
    date: { month: 'MAR', day: '16', time: '9:00 AM' },
    location: 'Training Center, Room 204',
    status: 'upcoming',
  },
  {
    title: 'Follow-up Review',
    context: 'Participant: James Wilson',
    date: { month: 'MAR', day: '14', time: '3:30 PM' },
    location: 'Video Call',
    status: 'completed',
  },
]

const buildScheduleItem = (item) => `
<div class="pathable-schedule-item pathable-schedule-item--${item.status}">
  <div class="pathable-schedule-item__date">
    <span class="pathable-schedule-item__date-month">${item.date.month}</span>
    <span class="pathable-schedule-item__date-day">${item.date.day}</span>
    <span class="pathable-schedule-item__date-time">${item.date.time}</span>
  </div>
  <div class="pathable-schedule-item__body">
    <p class="pathable-schedule-item__title">${item.title}</p>
    <p class="pathable-schedule-item__context">${item.context}</p>
    <ul class="pathable-schedule-item__meta">
      <li><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" style="fill:currentColor;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> ${item.location}</li>
    </ul>
  </div>
  <div class="pathable-schedule-item__status">
    <span class="pathable-schedule-item__status-icon" aria-hidden="true">&bull;</span>
    <span class="pathable-schedule-item__status-label">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
  </div>
</div>
`

const scheduleHtml = `
<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
    <h2 style="margin:0;font-family:var(--pathable-font-subheading);font-size:1rem;font-weight:700;color:var(--pathable-color-text);">Upcoming Schedule</h2>
    <a href="#" style="font-size:0.875rem;">View calendar</a>
  </div>
  <div class="pathable-schedule-list">
    ${scheduleItems.map(buildScheduleItem).join('')}
  </div>
</div>
`

/* -------------------------------------------------- */
/* Table                                                 */
/* -------------------------------------------------- */
const tableData = [
  {
    name: 'Maria Gonzalez',
    program: 'Employment Pathways',
    status: 'Active',
    lastActivity: 'Today, 10:30 AM',
    caseWorker: 'You',
  },
  {
    name: 'James Chen',
    program: 'Youth Services',
    status: 'Completed',
    lastActivity: 'Yesterday',
    caseWorker: 'Sam Rivera',
  },
  {
    name: 'Robert Kim',
    program: 'Employment Pathways',
    status: 'Active',
    lastActivity: 'Mar 12, 2026',
    caseWorker: 'Jamie Chen',
  },
  {
    name: 'Sarah Mitchell',
    program: 'Disability Support',
    status: 'Pending',
    lastActivity: 'Mar 10, 2026',
    caseWorker: 'You',
  },
  {
    name: 'David Okonkwo',
    program: 'Youth Services',
    status: 'Active',
    lastActivity: 'Mar 8, 2026',
    caseWorker: 'Jamie Chen',
  },
]

const buildTableRow = (row) => `
<tr>
  <td>${row.name}</td>
  <td>${row.program}</td>
  <td>${row.status}</td>
  <td>${row.lastActivity}</td>
  <td>${row.caseWorker}</td>
</tr>
`

const tableHtml = `
<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
    <h2 style="margin:0;font-family:var(--pathable-font-subheading);font-size:1rem;font-weight:700;color:var(--pathable-color-text);">Active Participants</h2>
    <a href="#" style="font-size:0.875rem;">View all 1,247</a>
  </div>
  <div class="pathable-table--scrollable">
    <table class="pathable-table pathable-table--borderless pathable-table--striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Program</th>
          <th scope="col">Status</th>
          <th scope="col">Last Activity</th>
          <th scope="col">Case Worker</th>
        </tr>
      </thead>
      <tbody>
        ${tableData.map(buildTableRow).join('')}
      </tbody>
    </table>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Toast                                                 */
/* -------------------------------------------------- */
const toastHtml = `
<div class="pathable-toast__region" style="position:fixed;bottom:1rem;right:1rem;max-width:24rem;z-index:1000;">
  <div class="pathable-toast pathable-toast--success pathable-toast--dismissible" role="status">
    <span class="pathable-toast__icon" aria-hidden="true">&#10003;</span>
    <span class="pathable-toast__message">Export completed. Report ready for download.</span>
    <button class="pathable-toast__dismiss" aria-label="Dismiss notification">&times;</button>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Loading / Skeleton                                    */
/* -------------------------------------------------- */
const skeletonHtml = `
<div class="pathable-dashboard-header" style="opacity:0.6;">
  <div class="pathable-dashboard-header__breadcrumb">
    <div class="pathable-skeleton" aria-hidden="true"><div class="pathable-skeleton--text-heading" style="width:120px;"></div></div>
  </div>
  <div class="pathable-dashboard-header__row">
    <div class="pathable-skeleton" aria-hidden="true" style="margin:0;"><div class="pathable-skeleton--text-heading" style="width:200px;"></div></div>
  </div>
</div>
<div class="pathable-kpi-grid" style="margin:1.5rem 0;opacity:0.6;">
  ${Array.from({ length: 4 }, () => '<div class="pathable-skeleton pathable-skeleton--card" aria-hidden="true" style="height:100px;"></div>').join('')}
</div>
<div style="display:flex;flex-direction:column;gap:1.5rem;opacity:0.6;">
  <div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;">
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--text-heading" style="width:160px;margin-bottom:1rem;"></div>
      <div class="pathable-skeleton--table-row" style="height:44px;margin-bottom:0.5rem;"></div>
      <div class="pathable-skeleton--table-row" style="height:44px;margin-bottom:0.5rem;"></div>
      <div class="pathable-skeleton--table-row" style="height:44px;"></div>
    </div>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Empty State                                           */
/* -------------------------------------------------- */
const emptyContentHtml = `
<div class="pathable-dashboard-header">
  <div class="pathable-dashboard-header__breadcrumb">
    <a href="#">Home</a>
    <span>Programs</span>
  </div>
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title" style="font-family:var(--pathable-font-heading);font-size:1.5rem;font-weight:400;color:var(--pathable-color-text);">Program Overview</h1>
  </div>
</div>
<div class="pathable-empty-state pathable-empty-state--no-data">
  <svg class="pathable-empty-state__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" style="fill:var(--pathable-color-text-muted);">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
    <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-2h2v10h-2z"/>
  </svg>
  <h2 class="pathable-empty-state__heading">No data yet</h2>
  <p class="pathable-empty-state__body">Program data will appear here once participants are enrolled and activities are recorded. Get started by adding your first program.</p>
  <a href="#" class="pathable-empty-state__action pathable-button">Add your first program</a>
</div>
`

/* -------------------------------------------------- */
/* Dashboard Content (all sections)                      */
/* -------------------------------------------------- */
const dashboardContent = `
${dashboardHeaderHtml}
${kpiGridHtml}
<div style="display:flex;flex-direction:column;gap:1.5rem;">
  ${activityListHtml}
  ${scheduleHtml}
  ${tableHtml}
</div>
${toastHtml}
`

/* -------------------------------------------------- */
/* Shell Assembly                                        */
/* -------------------------------------------------- */
const populatedShell = `
<div class="pathable-app-shell">
  ${sidebarHtml}
  ${topbarHtml}
  <main id="main-content" class="pathable-app-shell__content pathable-app-shell__content--standard" style="position:relative;">
    ${dashboardContent}
  </main>
</div>
`

const loadingShell = `
<div class="pathable-app-shell">
  ${sidebarHtml}
  ${topbarHtml}
  <main id="main-content" class="pathable-app-shell__content pathable-app-shell__content--standard">
    ${skeletonHtml}
  </main>
</div>
`

const emptyShell = `
<div class="pathable-app-shell">
  ${sidebarHtml}
  ${topbarHtml}
  <main id="main-content" class="pathable-app-shell__content pathable-app-shell__content--standard">
    ${emptyContentHtml}
  </main>
</div>
`

const mobileShell = `
<div class="pathable-app-shell">
  ${topbarHtml}
  <main id="main-content" class="pathable-app-shell__content">
    ${dashboardContent}
  </main>
  <nav class="pathable-bottom-navigation" aria-label="Primary">
    <a href="#" class="pathable-bottom-navigation__item pathable-bottom-navigation__item--active" aria-current="page">
      <svg class="pathable-icon" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" style="fill:currentColor;">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
      </svg>
      <span>Dashboard</span>
    </a>
    <a href="#" class="pathable-bottom-navigation__item">
      <svg class="pathable-icon" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" style="fill:currentColor;">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
      <span>Team</span>
    </a>
    <a href="#" class="pathable-bottom-navigation__item">
      <svg class="pathable-icon" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" style="fill:currentColor;">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <span>Tasks</span>
    </a>
    <a href="#" class="pathable-bottom-navigation__item">
      <svg class="pathable-icon" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" style="fill:currentColor;">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg>
      <span>Alerts</span>
    </a>
  </nav>
</div>
`

/* -------------------------------------------------- */
/* Exports                                               */
/* -------------------------------------------------- */
export const Populated = {
  parameters: {
    docs: {
      description: {
        story:
          'Full operational dashboard with desktop app shell. Composes sidebar navigation, dashboard header with breadcrumbs, four KPI cards with trend indicators, ' +
          'activity timeline grouped by day, schedule with upcoming/completed items, responsive participant table, and a success toast notification.',
      },
    },
  },
  render: () => populatedShell,
}

export const Loading = {
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard in loading state. Shows skeleton placeholders for KPI cards, activity area, and table region. Uses `<div class="pathable-skeleton">` with `aria-hidden="true"`.',
      },
    },
  },
  render: () => loadingShell,
}

export const Empty = {
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard in empty state. Shows the "No data yet" empty state with a clear heading, body text explaining what will appear, and a primary CTA to add the first program.',
      },
    },
  },
  render: () => emptyShell,
}

export const Mobile = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard at mobile viewport (375px). App shell switches to bottom navigation bar. KPI grid collapses to 2 columns. Table becomes horizontally scrollable. Sections stack vertically with preserved breathing room.',
      },
    },
  },
  render: () => mobileShell,
}

export const Default = Populated
