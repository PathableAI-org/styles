export default {
  title: 'Interaction Controls/Integration',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nA complete composition demonstrating how icon buttons, icon tiles, segmented controls, and surfaces work together in a realistic UI layout.',
      },
    },
  },
}

const iconButton = (modifiers, label, iconContent) => `
  <button class="pathable-icon-button ${modifiers}" aria-label="${label}">
    <svg class="pathable-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${iconContent}
    </svg>
  </button>
`

const iconTile = (modifiers, label, iconContent) => `
  <span class="pathable-icon-tile ${modifiers}" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${iconContent}
    </svg>
  </span>
`

// Shared SVG icon paths
const ICONS = {
  search:
    '<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />',
  settings:
    '<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />',
  trash:
    '<polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />',
  checkCircle:
    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />',
  xCircle:
    '<circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />',
  alertTriangle:
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />',
  info: '<circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />',
  list: '<line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />',
  grid: '<rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />',
}

export const ToolbarPanel = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Toolbar Panel with Actions</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A raised surface containing an inline cluster of icon buttons (bare, subtle, bordered) for common actions.
    </p>
    <div class="pathable-surface pathable-surface--raised" style="padding: 0.75rem 1rem;">
      <div class="pathable-cluster" style="align-items: center;">
        ${iconButton('pathable-icon-button--bare', 'Search', ICONS.search)}
        ${iconButton('pathable-icon-button--bare', 'Notifications', ICONS.bell)}
        <span style="width: 1px; height: 24px; background: var(--pathable-color-border, #ccc); display: inline-block;"></span>
        ${iconButton('pathable-icon-button--subtle', 'Edit', ICONS.edit)}
        ${iconButton('pathable-icon-button--subtle', 'Download', ICONS.download)}
        <span style="width: 1px; height: 24px; background: var(--pathable-color-border, #ccc); display: inline-block;"></span>
        ${iconButton('pathable-icon-button--bordered', 'Delete', ICONS.trash)}
        ${iconButton('pathable-icon-button--bordered', 'Settings', ICONS.settings)}
      </div>
    </div>
  `,
}

export const StatusRow = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Status Icon Row</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A row of status icon tiles indicating the state of related items.
    </p>
    <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
      <div class="pathable-cluster" style="align-items: center;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--success', 'Completed', ICONS.checkCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Compliance Training</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Completed Apr 12</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--warning', 'Pending Review', ICONS.alertTriangle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Safety Certification</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Pending review</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--error', 'Missing', ICONS.xCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Fire Safety Drill</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Overdue 14 days</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--info', 'Info', ICONS.info)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">HIPAA Update</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Available Aug 1</div>
          </div>
        </div>
      </div>
    </div>
  `,
}

export const ViewSwitcher = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Segmented View Switcher</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A segmented control for switching between view modes, with icon indicators.
    </p>
    <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
      <div class="pathable-cluster" style="align-items: center; justify-content: space-between;">
        <span style="font-size: 0.875rem; font-weight: 600;">Documents</span>
        <div class="pathable-segmented-control" role="radiogroup" aria-label="View mode">
          <button class="pathable-segmented-control__option pathable-segmented-control__option--selected" role="radio" aria-checked="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${ICONS.list}
            </svg>
            List
          </button>
          <button class="pathable-segmented-control__option" role="radio" aria-checked="false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${ICONS.grid}
            </svg>
            Grid
          </button>
          <button class="pathable-segmented-control__option" role="radio" aria-checked="false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${ICONS.eye}
            </svg>
            Detail
          </button>
        </div>
      </div>
    </div>
  `,
}

export const FullComposition = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Full Integration</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A complete composition: toolbar, view switcher, and status tiles within a raised surface panel.
    </p>
    <div class="pathable-surface pathable-surface--raised" style="padding: 1.25rem;">
      <!-- Header row: title + segmented view switcher -->
      <div class="pathable-cluster" style="align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="pathable-icon-tile" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <span style="font-size: 1rem; font-weight: 600;">Training Records</span>
        </div>

        <div class="pathable-segmented-control" role="radiogroup" aria-label="View mode">
          <button class="pathable-segmented-control__option pathable-segmented-control__option--selected" role="radio" aria-checked="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${ICONS.list}
            </svg>
            List
          </button>
          <button class="pathable-segmented-control__option" role="radio" aria-checked="false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${ICONS.grid}
            </svg>
            Grid
          </button>
          <button class="pathable-segmented-control__option" role="radio" aria-checked="false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${ICONS.eye}
            </svg>
            Detail
          </button>
        </div>
      </div>

      <!-- Toolbar action buttons -->
      <div style="margin-bottom: 1rem;">
        <div class="pathable-cluster" style="align-items: center;">
          ${iconButton('pathable-icon-button--subtle', 'Search records', ICONS.search)}
          ${iconButton('pathable-icon-button--subtle', 'Add record', ICONS.edit)}
          ${iconButton('pathable-icon-button--bordered', 'Export', ICONS.download)}
          <span style="width: 1px; height: 24px; background: var(--pathable-color-border, #ccc); display: inline-block;"></span>
          ${iconButton('pathable-icon-button--bare', 'Notifications', ICONS.bell)}
          ${iconButton('pathable-icon-button--bare', 'Settings', ICONS.settings)}
        </div>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background: var(--pathable-color-border, #e0e0e0); margin: 0 0 1rem;"></div>

      <!-- Status row with labeled items -->
      <div class="pathable-cluster" style="align-items: center;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--success', 'Completed', ICONS.checkCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Compliance</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">12 records</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--warning', 'Pending', ICONS.alertTriangle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Pending Review</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">5 records</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--error', 'Overdue', ICONS.xCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Overdue</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">3 records</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--info', 'Upcoming', ICONS.info)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Upcoming</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">8 records</div>
          </div>
        </div>
      </div>
    </div>
  `,
}

export const Default = FullComposition
