export default {
  title: 'Dashboard/Table Modifiers',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. These table modifier classes extend the existing `.pathable-table` base component. Sortable columns require `aria-sort` attribute. Selected rows require `aria-selected="true"`. Row actions use `.pathable-table__row-actions` within a table with `.pathable-table--has-actions`.',
      },
    },
  },
}

export const Sortable = {
  render: () => `
    <table class="pathable-table pathable-table--sortable pathable-table--borderless">
      <thead>
        <tr>
          <th aria-sort="ascending">Participant Name</th>
          <th aria-sort="none">Status</th>
          <th aria-sort="none">Program</th>
          <th aria-sort="descending">Start Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Maria Gonzalez</td>
          <td>Active</td>
          <td>Employment Pathways</td>
          <td>2026-01-15</td>
        </tr>
        <tr>
          <td>James Chen</td>
          <td>Completed</td>
          <td>Skills Training</td>
          <td>2025-11-01</td>
        </tr>
        <tr>
          <td>Sarah Mitchell</td>
          <td>Active</td>
          <td>Job Placement</td>
          <td>2026-02-28</td>
        </tr>
      </tbody>
    </table>
  `,
}

export const Selected = {
  render: () => `
    <table class="pathable-table pathable-table--selected pathable-table--borderless">
      <thead>
        <tr>
          <th>Participant</th>
          <th>Status</th>
          <th>Program</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Maria Gonzalez</td>
          <td>Active</td>
          <td>Employment Pathways</td>
        </tr>
        <tr aria-selected="true">
          <td>James Chen</td>
          <td>Completed</td>
          <td>Skills Training</td>
        </tr>
        <tr>
          <td>Sarah Mitchell</td>
          <td>Active</td>
          <td>Job Placement</td>
        </tr>
      </tbody>
    </table>
  `,
}

export const WithActions = {
  render: () => `
    <table class="pathable-table pathable-table--has-actions pathable-table--borderless">
      <thead>
        <tr>
          <th>Participant</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Maria Gonzalez</td>
          <td>Active</td>
          <td>
            <div class="pathable-table__row-actions">
              <button class="pathable-button pathable-button--outline">Edit</button>
              <button class="pathable-button pathable-button--outline">View</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>James Chen</td>
          <td>Completed</td>
          <td>
            <div class="pathable-table__row-actions">
              <button class="pathable-button pathable-button--outline">Edit</button>
              <button class="pathable-button pathable-button--outline">View</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>Sarah Mitchell</td>
          <td>Active</td>
          <td>
            <div class="pathable-table__row-actions">
              <button class="pathable-button pathable-button--outline">Edit</button>
              <button class="pathable-button pathable-button--outline">View</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  `,
}

export const Loading = {
  render: () => `
    <table class="pathable-table pathable-table--loading pathable-table--borderless">
      <thead>
        <tr>
          <th>Participant</th>
          <th>Status</th>
          <th>Program</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Loading...</td><td>Loading...</td><td>Loading...</td></tr>
        <tr><td>Loading...</td><td>Loading...</td><td>Loading...</td></tr>
        <tr><td>Loading...</td><td>Loading...</td><td>Loading...</td></tr>
      </tbody>
    </table>
  `,
}

export const Empty = {
  render: () => `
    <table class="pathable-table pathable-table--empty pathable-table--borderless">
      <thead>
        <tr>
          <th>Participant</th>
          <th>Status</th>
          <th>Program</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="3">
            <span class="pathable-table__empty-message">No participants match the current filters.</span>
          </td>
        </tr>
      </tbody>
    </table>
  `,
}

export const Scrollable = {
  render: () => `
    <div class="pathable-table--scrollable" tabindex="0" style="max-width: 450px;" role="region" aria-label="Scrollable table">
      <table class="pathable-table pathable-table--borderless pathable-table--sortable">
        <thead>
          <tr>
            <th aria-sort="none">Participant Name</th>
            <th aria-sort="none">Status</th>
            <th aria-sort="none">Program</th>
            <th aria-sort="none">Start Date</th>
            <th aria-sort="none">Region</th>
            <th aria-sort="none">Case Manager</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Maria Gonzalez</td>
            <td>Active</td>
            <td>Employment Pathways</td>
            <td>2026-01-15</td>
            <td>Seattle</td>
            <td>Jane Doe</td>
          </tr>
          <tr>
            <td>James Chen</td>
            <td>Completed</td>
            <td>Skills Training</td>
            <td>2025-11-01</td>
            <td>Portland</td>
            <td>John Smith</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
}
