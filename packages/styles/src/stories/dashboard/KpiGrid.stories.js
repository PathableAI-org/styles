export default {
  title: 'Dashboard/KPI Grid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. The KPI grid uses `.pathable-kpi-grid` with `.pathable-kpi-card` children. Trends use `data-trend` attribute (up/down/neutral) and must always include visible text or an icon label in addition to color.',
      },
    },
  },
}

const kpiCard = (value, label, trend, icon) => `
  <div class="pathable-kpi-card">
    ${icon ? `<div class="pathable-kpi-card__icon" aria-hidden="true">${icon}</div>` : ''}
    <p class="pathable-kpi-card__value">${value}</p>
    <p class="pathable-kpi-card__label">${label}</p>
    ${
      trend
        ? `<div class="pathable-kpi-card__trend" data-trend="${trend}" data-trend-label="${trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'No change'}">
      <span class="pathable-kpi-card__trend-label">${trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : '0%'} from last month</span>
    </div>`
        : ''
    }
  </div>
`

export const Default = {
  render: () => `
    <div class="pathable-kpi-grid">
      ${kpiCard('1,247', 'Active Participants', 'up')}
      ${kpiCard('86%', 'Placement Rate', 'up')}
      ${kpiCard('342', 'New Enrollments', 'down')}
      ${kpiCard('28', 'Partner Organizations', 'neutral')}
    </div>
  `,
}

export const TwoColumns = {
  render: () => `
    <div class="pathable-kpi-grid pathable-kpi-grid--columns-2" style="max-width: 500px;">
      ${kpiCard('$2.4M', 'Program Budget', 'up')}
      ${kpiCard('73%', 'Funds Utilized', 'neutral')}
    </div>
  `,
}

export const WithIcons = {
  render: () => `
    <div class="pathable-kpi-grid">
      ${kpiCard('1,247', 'Active Participants', 'up', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>')}
      ${kpiCard('86%', 'Placement Rate', 'up', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>')}
      ${kpiCard('342', 'New Enrollments', 'down', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>')}
      ${kpiCard('28', 'Partners', 'neutral', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>')}
    </div>
  `,
}

export const SingleCard = {
  render: () => `
    <div class="pathable-kpi-grid" style="max-width: 300px;">
      ${kpiCard('1,247', 'Active Participants', 'up')}
    </div>
  `,
}

export const Loading = {
  render: () => `
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
  `,
}

export const Unavailable = {
  render: () => `
    <div class="pathable-kpi-grid">
      <div class="pathable-kpi-card pathable-kpi-card--unavailable">
        <p class="pathable-kpi-card__value"><span>N/A</span></p>
        <p class="pathable-kpi-card__label">Active Participants</p>
      </div>
      <div class="pathable-kpi-card pathable-kpi-card--unavailable">
        <p class="pathable-kpi-card__value"><span>N/A</span></p>
        <p class="pathable-kpi-card__label">Placement Rate</p>
      </div>
      <div class="pathable-kpi-card pathable-kpi-card--unavailable">
        <p class="pathable-kpi-card__value"><span>N/A</span></p>
        <p class="pathable-kpi-card__label">New Enrollments</p>
      </div>
    </div>
  `,
}

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => `
    <div class="pathable-kpi-grid" style="max-width: 375px;">
      ${kpiCard('1,247', 'Active Participants', 'up')}
      ${kpiCard('86%', 'Placement Rate', 'up')}
      ${kpiCard('342', 'New Enrollments', 'down')}
    </div>
  `,
}

export const LongLabel = {
  render: () => `
    <div class="pathable-kpi-grid">
      ${kpiCard('99.7%', 'Average Participant Satisfaction Rating Across All Programs', 'up')}
      ${kpiCard('1,247', 'Total Number of Active Participants Currently Enrolled in Programs', 'neutral')}
    </div>
  `,
}

export const LargeValue = {
  render: () => `
    <div class="pathable-kpi-grid">
      ${kpiCard('1,234,567', 'Total Service Hours Delivered', 'up')}
      ${kpiCard('$12,456,789', 'Total Grant Funding Awarded', 'up')}
    </div>
  `,
}
