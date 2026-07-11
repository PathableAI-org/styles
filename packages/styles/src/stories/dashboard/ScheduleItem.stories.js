export default {
  title: 'Dashboard/Schedule Item',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Each schedule item uses `.pathable-schedule-item` with a status modifier class (--cancelled, --completed, --tentative, --upcoming). Status labels are always visible text — never rely on color alone. Use `.pathable-schedule-list` as the wrapping container.',
      },
    },
  },
}

const scheduleItem = (
  month,
  day,
  time,
  title,
  context,
  location,
  status,
  statusLabel,
) => `
  <div class="pathable-schedule-item pathable-schedule-item--${status}">
    <div class="pathable-schedule-item__date">
      <span class="pathable-schedule-item__date-month">${month}</span>
      <span class="pathable-schedule-item__date-day">${day}</span>
      <span class="pathable-schedule-item__date-time">${time}</span>
    </div>
    <div class="pathable-schedule-item__body">
      <p class="pathable-schedule-item__title">${title}</p>
      <p class="pathable-schedule-item__context">${context}</p>
      <ul class="pathable-schedule-item__meta">
        <li>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${location}
        </li>
        <li>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          PT
        </li>
      </ul>
    </div>
    <div class="pathable-schedule-item__status">
      <span class="pathable-schedule-item__status-icon" aria-hidden="true">
        ${status === 'completed' ? '&#10003;' : status === 'cancelled' ? '&#10007;' : status === 'tentative' ? '&#9888;' : '&#9679;'}
      </span>
      <span class="pathable-schedule-item__status-label">${statusLabel}</span>
    </div>
    <div class="pathable-schedule-item__actions">
      <button class="pathable-button pathable-button--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Details</button>
    </div>
  </div>
`

export const Default = {
  render: () => `
    <div class="pathable-schedule-list">
      ${scheduleItem('MAR', '15', '10:00 AM', 'Initial Assessment', 'New participant intake and evaluation', 'Main Office, Room 204', 'upcoming', 'Upcoming')}
      ${scheduleItem('MAR', '16', '2:00 PM', 'Employment Plan Review', 'Quarterly progress review', 'Virtual - Zoom', 'completed', 'Completed')}
      ${scheduleItem('MAR', '18', '11:30 AM', 'Provider Meeting', 'Collaboration with community partners', 'Community Center', 'tentative', 'Tentative')}
      ${scheduleItem('MAR', '12', '9:00 AM', 'Workshop: Resume Building', 'Canceled due to presenter conflict', 'Training Room B', 'cancelled', 'Cancelled')}
    </div>
  `,
}

export const Upcoming = {
  render: () => `
    <div class="pathable-schedule-list">
      ${scheduleItem('MAR', '20', '1:00 PM', 'Job Coaching Session', 'One-on-one coaching with participant', 'Career Center', 'upcoming', 'Upcoming')}
      ${scheduleItem('MAR', '22', '10:30 AM', 'Team Standup', 'Weekly team sync', 'Conference Room A', 'upcoming', 'Upcoming')}
    </div>
  `,
}

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => `
    <div class="pathable-schedule-list" style="max-width: 375px;">
      ${scheduleItem('MAR', '15', '10:00 AM', 'Initial Assessment', 'New participant intake', 'Main Office', 'upcoming', 'Upcoming')}
      ${scheduleItem('MAR', '16', '2:00 PM', 'Plan Review', 'Quarterly review', 'Virtual', 'completed', 'Completed')}
    </div>
  `,
}

export const LongContext = {
  render: () => `
    <div class="pathable-schedule-list">
      ${scheduleItem('MAR', '20', '1:00 PM', 'Comprehensive Vocational Rehabilitation Assessment and Planning Session', 'Initial intake evaluation for new participant including skills assessment, career interest inventory, and goal setting', 'Downtown Resource Center, 3rd Floor Conference Room 312', 'upcoming', 'Upcoming')}
    </div>
  `,
}
