import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Interaction Controls/Integration',
  tags: ['autodocs', 'contract-integration'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS presentation with consumer-owned SegmentedControl behavior.\n\n**States verified**: Toolbar actions retain native button semantics and accessible names, status icons remain decorative beside visible text, and the view switcher maintains selection and roving focus during Arrow-key and click navigation. The constrained fixture verifies that the composition contains overflow under narrow, increased-text pressure.\n\n**Consumers must**: Import `@pathableai/styles` CSS. Segmented radiogroups also require application JavaScript for selection state and Arrow-key navigation; use the React wrapper or implement the documented ARIA behavior.\n\nA complete composition demonstrating how icon buttons, icon tiles, segmented controls, and surfaces work together in a realistic UI layout.',
      },
    },
  },
}

const iconButton = (modifiers: string, label: string, iconContent: string) => `
  <button type="button" class="pathable-icon-button ${modifiers}" aria-label="${label}">
    <svg class="pathable-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      ${iconContent}
    </svg>
  </button>
`

const iconTile = (modifiers: string, iconContent: string) => `
  <span class="pathable-icon-tile ${modifiers}" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
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

type IntegrationPlayContext = {
  canvasElement: HTMLElement
  id: string
}

function initializeViewSwitcher(
  canvasElement: HTMLElement,
  groupName = 'View mode',
) {
  const group = within(canvasElement).getByRole('radiogroup', {
    name: groupName,
  })
  const radios = within(group).getAllByRole<HTMLButtonElement>('radio')
  const select = (selected: HTMLButtonElement) => {
    radios.forEach((radio) => {
      const isSelected = radio === selected
      radio.setAttribute('aria-checked', String(isSelected))
      radio.tabIndex = isSelected ? 0 : -1
      radio.classList.toggle(
        'pathable-segmented-control__option--selected',
        isSelected,
      )
    })
  }

  if (group.dataset.segmentedControlReady !== 'true') {
    group.addEventListener('click', (event) => {
      const selected = (
        event.target as HTMLElement
      ).closest?.<HTMLButtonElement>('.pathable-segmented-control__option')
      if (selected && radios.includes(selected)) select(selected)
    })
    group.addEventListener('keydown', (event) => {
      const direction =
        event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? 1
          : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
            ? -1
            : 0

      if (direction === 0) return

      event.preventDefault()
      const activeElement = group.ownerDocument.activeElement
      const current = radios.includes(activeElement as HTMLButtonElement)
        ? (activeElement as HTMLButtonElement)
        : (radios.find(
            (radio) => radio.getAttribute('aria-checked') === 'true',
          ) ?? radios[0])
      const next =
        radios[
          (radios.indexOf(current) + direction + radios.length) % radios.length
        ]

      select(next)
      next.focus()
    })
    group.dataset.segmentedControlReady = 'true'
  }

  return radios
}

async function expectSingleSelection(
  radios: HTMLButtonElement[],
  selected: HTMLButtonElement,
) {
  await expect(
    radios.filter((radio) => radio.getAttribute('aria-checked') === 'true'),
  ).toEqual([selected])
  await expect(radios.filter((radio) => radio.tabIndex === 0)).toEqual([
    selected,
  ])
  await expect(
    radios.filter((radio) =>
      radio.classList.contains('pathable-segmented-control__option--selected'),
    ),
  ).toEqual([selected])
}

async function verifyViewSwitcher(
  canvasElement: HTMLElement,
  groupName = 'View mode',
) {
  const canvas = within(canvasElement)
  const group = canvas.getByRole('radiogroup', { name: groupName })
  const initialRadios = within(group).getAllByRole<HTMLButtonElement>('radio')

  await expect(initialRadios).toHaveLength(3)
  await expectSingleSelection(initialRadios, initialRadios[0])

  const radios = initializeViewSwitcher(canvasElement, groupName)

  await expect(group).toHaveAttribute('data-segmented-control-ready', 'true')
  for (const icon of group.querySelectorAll('svg')) {
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  }
  radios[0].focus()

  await userEvent.keyboard('{ArrowRight}')

  await expect(radios[1]).toHaveFocus()
  await expectSingleSelection(radios, radios[1])

  await userEvent.click(radios[2])
  await expect(radios[2]).toHaveFocus()
  await expectSingleSelection(radios, radios[2])

  await userEvent.keyboard('{ArrowRight}')
  await expect(radios[0]).toHaveFocus()
  await expectSingleSelection(radios, radios[0])
}

async function runIntegrationProof(
  storyId: string,
  capability: string,
  proof: () => Promise<void>,
) {
  try {
    await proof()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`[styles/${storyId}/${capability}] ${message}`, {
      cause: error,
    })
  }
}

async function verifyIconButtonSemantics(
  canvasElement: HTMLElement,
  names: readonly string[],
) {
  const canvas = within(canvasElement)

  for (const name of names) {
    const button = canvas.getByRole('button', { name })
    const icon = button.querySelector<SVGElement>('svg')

    if (!icon) throw new Error(`Integration action "${name}" has no icon`)

    await expect(button.tagName).toBe('BUTTON')
    await expect(button).toHaveAttribute('type', 'button')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  }

  const representativeName = names[0]
  if (!representativeName) {
    throw new Error('Integration fixture needs a representative toolbar action')
  }

  const representativeAction = canvas.getByRole('button', {
    name: representativeName,
  })
  let activations = 0
  representativeAction.addEventListener('click', () => {
    activations += 1
  })
  representativeAction.focus()
  await userEvent.keyboard('{Enter}')
  await expect(activations).toBe(1)
  await userEvent.keyboard(' ')
  await expect(activations).toBe(2)
}

async function verifyDecorativeStatusTiles(
  canvasElement: HTMLElement,
  listName: string,
  labels: readonly string[],
) {
  const canvas = within(canvasElement)
  const list = canvas.getByRole('list', { name: listName })
  const items = within(list).getAllByRole('listitem')

  await expect(items).toHaveLength(labels.length)
  for (const [index, statusItem] of items.entries()) {
    const label = labels[index]
    const tile = statusItem.querySelector('.pathable-icon-tile--circle')

    if (!tile || !label) {
      throw new Error('Each status tile must have a corresponding label')
    }

    await expect(tile).toHaveAttribute('aria-hidden', 'true')
    const icon = tile.querySelector('svg')
    if (!icon) throw new Error(`Integration status "${label}" has no icon`)
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
    await expect(within(statusItem).getByText(label)).toBeVisible()
  }
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
        <span aria-hidden="true" style="width: 1px; height: 24px; background: var(--pathable-color-border, #ccc); display: inline-block;"></span>
        ${iconButton('pathable-icon-button--subtle', 'Edit', ICONS.edit)}
        ${iconButton('pathable-icon-button--subtle', 'Download', ICONS.download)}
        <span aria-hidden="true" style="width: 1px; height: 24px; background: var(--pathable-color-border, #ccc); display: inline-block;"></span>
        ${iconButton('pathable-icon-button--bordered', 'Delete', ICONS.trash)}
        ${iconButton('pathable-icon-button--bordered', 'Settings', ICONS.settings)}
      </div>
    </div>
  `,
  play: async ({ canvasElement, id }: IntegrationPlayContext) => {
    await runIntegrationProof(id, 'integration.toolbar', async () => {
      await verifyIconButtonSemantics(canvasElement, [
        'Search',
        'Notifications',
        'Edit',
        'Download',
        'Delete',
        'Settings',
      ])
    })
  },
}

export const StatusRow = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Status Icon Row</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A row of status icon tiles indicating the state of related items.
    </p>
    <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
      <div class="pathable-cluster" role="list" aria-label="Training statuses" style="align-items: center;">
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--success', ICONS.checkCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Compliance Training</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Completed Apr 12</div>
          </div>
        </div>
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--warning', ICONS.alertTriangle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Safety Certification</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Pending review</div>
          </div>
        </div>
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--error', ICONS.xCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Fire Safety Drill</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Overdue 14 days</div>
          </div>
        </div>
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--info', ICONS.info)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">HIPAA Update</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">Available Aug 1</div>
          </div>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement, id }: IntegrationPlayContext) => {
    await runIntegrationProof(id, 'integration.status-row', async () => {
      await verifyDecorativeStatusTiles(canvasElement, 'Training statuses', [
        'Compliance Training',
        'Safety Certification',
        'Fire Safety Drill',
        'HIPAA Update',
      ])
    })
  },
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
          <button type="button" class="pathable-segmented-control__option pathable-segmented-control__option--selected" role="radio" aria-checked="true" tabindex="0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.list}
            </svg>
            List
          </button>
          <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.grid}
            </svg>
            Grid
          </button>
          <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.eye}
            </svg>
            Detail
          </button>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement, id }: IntegrationPlayContext) => {
    await runIntegrationProof(id, 'integration.view-switcher', async () => {
      await verifyViewSwitcher(canvasElement)
    })
  },
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </span>
          <span style="font-size: 1rem; font-weight: 600;">Training Records</span>
        </div>

        <div class="pathable-segmented-control" role="radiogroup" aria-label="View mode">
          <button type="button" class="pathable-segmented-control__option pathable-segmented-control__option--selected" role="radio" aria-checked="true" tabindex="0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.list}
            </svg>
            List
          </button>
          <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.grid}
            </svg>
            Grid
          </button>
          <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
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
          <span aria-hidden="true" style="width: 1px; height: 24px; background: var(--pathable-color-border, #ccc); display: inline-block;"></span>
          ${iconButton('pathable-icon-button--bare', 'Notifications', ICONS.bell)}
          ${iconButton('pathable-icon-button--bare', 'Settings', ICONS.settings)}
        </div>
      </div>

      <!-- Divider -->
      <div aria-hidden="true" style="height: 1px; background: var(--pathable-color-border, #e0e0e0); margin: 0 0 1rem;"></div>

      <!-- Status row with labeled items -->
      <div class="pathable-cluster" role="list" aria-label="Record statuses" style="align-items: center;">
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--success', ICONS.checkCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Compliance</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">12 records</div>
          </div>
        </div>
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--warning', ICONS.alertTriangle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Pending Review</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">5 records</div>
          </div>
        </div>
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--error', ICONS.xCircle)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Overdue</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">3 records</div>
          </div>
        </div>
        <div role="listitem" style="display: flex; align-items: center; gap: 0.5rem;">
          ${iconTile('pathable-icon-tile--circle pathable-icon-tile--info', ICONS.info)}
          <div>
            <div style="font-size: 0.8rem; font-weight: 600;">Upcoming</div>
            <div style="font-size: 0.75rem; opacity: 0.7;">8 records</div>
          </div>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement, id }: IntegrationPlayContext) => {
    await runIntegrationProof(id, 'integration.full-composition', async () => {
      await verifyViewSwitcher(canvasElement)
      await verifyIconButtonSemantics(canvasElement, [
        'Search records',
        'Add record',
        'Export',
        'Notifications',
        'Settings',
      ])
      await verifyDecorativeStatusTiles(canvasElement, 'Record statuses', [
        'Compliance',
        'Pending Review',
        'Overdue',
        'Upcoming',
      ])
    })
  },
}

export const ContentPressure = {
  render: () => `
    <section aria-labelledby="integration-pressure-heading" style="box-sizing: border-box; width: 320px; max-width: 100%;">
      <h3 id="integration-pressure-heading" style="margin: 0 0 0.5rem; font-size: 2rem; font-weight: 600; overflow-wrap: anywhere;">Constrained integration composition</h3>
      <div class="pathable-surface pathable-surface--raised" style="box-sizing: border-box; min-width: 0; padding: 1rem; font-size: 2rem;">
        <div style="min-width: 0; margin-bottom: 1rem; overflow-wrap: anywhere;">
          Regional training documentation and certification records
        </div>
        <div class="pathable-segmented-control" role="radiogroup" aria-label="Constrained view mode" style="width: 100%; margin-bottom: 1rem;">
          <button type="button" class="pathable-segmented-control__option pathable-segmented-control__option--selected" role="radio" aria-checked="true" tabindex="0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.list}
            </svg>
            Chronological records
          </button>
          <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.grid}
            </svg>
            Responsive card grid
          </button>
          <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
              ${ICONS.eye}
            </svg>
            Expanded details
          </button>
        </div>
        <div class="pathable-cluster" style="align-items: center; margin-bottom: 1rem;">
          ${iconButton('pathable-icon-button--subtle', 'Search constrained records', ICONS.search)}
          ${iconButton('pathable-icon-button--bordered', 'Export constrained records', ICONS.download)}
        </div>
        <div role="list" aria-label="Constrained record status">
          <div role="listitem" style="display: flex; min-width: 0; align-items: center; gap: 0.5rem;">
            ${iconTile('pathable-icon-tile--circle pathable-icon-tile--warning', ICONS.alertTriangle)}
            <span style="min-width: 0; overflow-wrap: anywhere;">Mandatory annual certification remains pending review</span>
          </div>
        </div>
      </div>
    </section>
  `,
  play: async ({ canvasElement, id }: IntegrationPlayContext) => {
    await runIntegrationProof(id, 'integration.content-pressure', async () => {
      const canvas = within(canvasElement)
      const fixture = canvas.getByRole('region', {
        name: 'Constrained integration composition',
      })
      const viewSwitcher = canvas.getByRole('radiogroup', {
        name: 'Constrained view mode',
      })

      await verifyViewSwitcher(canvasElement, 'Constrained view mode')
      await verifyIconButtonSemantics(canvasElement, [
        'Search constrained records',
        'Export constrained records',
      ])
      await verifyDecorativeStatusTiles(
        canvasElement,
        'Constrained record status',
        ['Mandatory annual certification remains pending review'],
      )

      for (const name of [
        'Search constrained records',
        'Export constrained records',
      ]) {
        const bounds = canvas
          .getByRole('button', { name })
          .getBoundingClientRect()
        await expect(bounds.width).toBeCloseTo(44, 3)
        await expect(bounds.height).toBeCloseTo(44, 3)
      }

      await expect(viewSwitcher.scrollWidth).toBeGreaterThan(
        viewSwitcher.clientWidth,
      )
      await expect(fixture.scrollWidth).toBeLessThanOrEqual(fixture.clientWidth)
      await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
        canvasElement.clientWidth,
      )
    })
  },
}

export const Default = FullComposition
