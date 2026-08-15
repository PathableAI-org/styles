export default {
  title: 'Dashboard/Activity List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. The activity list uses `.pathable-activity-list` containing `.pathable-activity-row` children. Groups are separated by `.pathable-activity-list__group-heading`. Status uses `data-status` attribute (completed, in-progress, pending, cancelled) and must always include a visible text label.',
      },
    },
  },
}

const activityRow = (
  title,
  context,
  date,
  owner,
  status,
  actions,
  statusLabel,
) => `
  <div class="pathable-activity-row" role="listitem">
    <span class="pathable-activity-row__status" data-status="${status}" aria-hidden="true"></span>
    <span class="pathable-activity-row__status-text">${statusLabel || statusLabels[status] || status}</span>
    <div class="pathable-activity-row__body">
      <p class="pathable-activity-row__title">${title}</p>
      <p class="pathable-activity-row__context">${context}</p>
    </div>
    <span class="pathable-activity-row__date">${date}</span>
    <span class="pathable-activity-row__owner"><span class="pathable-activity-row__owner-text">${owner}</span></span>
    ${actions ? `<div class="pathable-activity-row__actions">${actions}</div>` : ''}
  </div>
`

const statusLabels = {
  completed: 'Completed',
  'in-progress': 'In progress',
  pending: 'Pending',
  cancelled: 'Cancelled',
}

export const Default = {
  render: () => `
    <div class="pathable-activity-list">
      <h3 id="activity-today" class="pathable-activity-list__group-heading">Today</h3>
      <div class="pathable-activity-list" role="list" aria-labelledby="activity-today">
        ${activityRow('Intake assessment completed', 'Participant: Maria Gonzalez', '2:30 PM', 'You', 'completed', '<button class="pathable-button pathable-button--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View</button>')}
        ${activityRow('Employment plan review', 'Participant: James Chen', '1:15 PM', 'You', 'completed', '<button class="pathable-button pathable-button--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View</button>')}
        ${activityRow('Follow-up call scheduled', 'Provider: Cascade Resources', '11:00 AM', 'Sara M.', 'in-progress', '<button class="pathable-button pathable-button--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Reschedule</button>')}
      </div>
      <h3 id="activity-yesterday" class="pathable-activity-list__group-heading">Yesterday</h3>
      <div class="pathable-activity-list" role="list" aria-labelledby="activity-yesterday">
        ${activityRow('Placement confirmation', 'Participant: David Kim', '4:45 PM', 'You', 'completed')}
        ${activityRow('Training module assigned', 'Module: Workplace Communication', '10:30 AM', 'System', 'pending')}
      </div>
    </div>
  `,
}

export const Compact = {
  render: () => `
    <div class="pathable-activity-list pathable-activity-list--compact" role="list">
      ${activityRow('Intake assessment completed', 'Participant: Maria Gonzalez', '2:30 PM', 'You', 'completed')}
      ${activityRow('Employment plan review', 'Participant: James Chen', '1:15 PM', 'You', 'completed')}
      ${activityRow('Follow-up call scheduled', 'Provider: Cascade Resources', '11:00 AM', 'Sara M.', 'in-progress')}
    </div>
  `,
}

export const Comfortable = {
  render: () => `
    <div class="pathable-activity-list pathable-activity-list--comfortable" role="list">
      ${activityRow('Intake assessment completed', 'Participant: Maria Gonzalez', '2:30 PM', 'You', 'completed')}
      ${activityRow('Employment plan review', 'Participant: James Chen', '1:15 PM', 'You', 'completed')}
    </div>
  `,
}

export const WithMixedStatuses = {
  render: () => `
    <div class="pathable-activity-list" role="list">
      ${activityRow('Placement confirmed', 'Participant: Sarah Mitchell', 'Mar 15', 'You', 'completed')}
      ${activityRow('Job interview scheduled', 'Employer: TechCorp', 'Mar 18', 'You', 'in-progress')}
      ${activityRow('Benefits review pending', 'Participant: Robert Torres', 'Mar 20', 'Alex K.', 'pending')}
      ${activityRow('Application withdrawn', 'Participant: Lisa Park', 'Mar 14', 'System', 'cancelled')}
    </div>
  `,
}

export const Mobile = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => `
    <div class="pathable-activity-list" role="list" style="max-width: 375px;">
      ${activityRow('Intake completed', 'Maria Gonzalez', '2:30 PM', 'You', 'completed', '<button class="pathable-button pathable-button--outline" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">View</button>')}
      ${activityRow('Plan review', 'James Chen', '1:15 PM', 'You', 'completed')}
      ${activityRow('Call scheduled', 'Cascade Resources', '11:00 AM', 'Sara M.', 'in-progress')}
    </div>
  `,
}

export const Empty = {
  render: () => `
    <div class="pathable-activity-list pathable-activity-list--empty">
      <div class="pathable-activity-list__empty">
        <p>No recent activity to display.</p>
      </div>
    </div>
  `,
}

export const LongContent = {
  render: () => `
    <div class="pathable-activity-list" role="list" style="max-width: 48rem;">
      ${activityRow(
        'Localized activity title that remains on one line while preserving the complete supplied text in the document',
        'Participant context with deliberately extended localized-looking content for constrained layouts',
        'Wednesday, September 30, 2026 at 11:45 in the morning',
        'Alexandria Montgomery-Rivera, Regional Program Coordinator',
        'in-progress',
        '<button class="pathable-button pathable-button--outline">Review details</button>',
      )}
    </div>
  `,
}

export const UnknownStatus = {
  render: () => `
    <div class="pathable-activity-list" role="list">
      ${activityRow('Application requires review', 'Participant: Jordan Lee', 'Sep 30', 'Morgan K.', 'awaiting-review', undefined, 'Awaiting review')}
    </div>
  `,
}
