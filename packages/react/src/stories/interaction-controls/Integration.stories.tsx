import { useState, type JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { IconButton, IconTile, SegmentedControl } from '../../index'

type ToolbarActionHandlers = {
  readonly onSearch?: () => void
  readonly onNotifications?: () => void
  readonly onEdit?: () => void
  readonly onDownload?: () => void
  readonly onDelete?: () => void
  readonly onSettings?: () => void
}

type IconName =
  | 'alertTriangle'
  | 'bell'
  | 'checkCircle'
  | 'download'
  | 'edit'
  | 'eye'
  | 'file'
  | 'grid'
  | 'info'
  | 'list'
  | 'search'
  | 'settings'
  | 'trash'
  | 'xCircle'

const ICON_PATHS: Record<IconName, JSX.Element> = {
  alertTriangle: (
    <>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  checkCircle: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  eye: (
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </>
  ),
}

function AppIcon({
  name,
  size = 20,
}: {
  readonly name: IconName
  readonly size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

const viewOptions = [
  { value: 'list', label: 'List', icon: <AppIcon name="list" size={16} /> },
  { value: 'grid', label: 'Grid', icon: <AppIcon name="grid" size={16} /> },
  { value: 'detail', label: 'Detail', icon: <AppIcon name="eye" size={16} /> },
] as const

type ViewValue = (typeof viewOptions)[number]['value']

function isViewValue(value: string): value is ViewValue {
  return viewOptions.some((option) => option.value === value)
}

function ViewSwitcherControl({
  initialValue = 'list',
}: {
  readonly initialValue?: ViewValue
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <SegmentedControl
      aria-label="View mode"
      options={viewOptions}
      value={value}
      onValueChange={(nextValue) => {
        if (isViewValue(nextValue)) setValue(nextValue)
      }}
    />
  )
}

function StoryIntro({
  title,
  children,
}: {
  readonly title: string
  readonly children: string
}) {
  return (
    <>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600 }}>
        {title}
      </h3>
      <p
        style={{
          color: 'var(--pathable-color-text-muted, #555)',
          fontSize: '0.875rem',
          margin: '0 0 1rem',
        }}
      >
        {children}
      </p>
    </>
  )
}

function ToolbarActions({
  onSearch,
  onNotifications,
  onEdit,
  onDownload,
  onDelete,
  onSettings,
}: ToolbarActionHandlers) {
  return (
    <div className="pathable-cluster" style={{ alignItems: 'center' }}>
      <IconButton appearance="bare" aria-label="Search" onClick={onSearch}>
        <AppIcon name="search" />
      </IconButton>
      <IconButton
        appearance="bare"
        aria-label="Notifications"
        onClick={onNotifications}
      >
        <AppIcon name="bell" />
      </IconButton>
      <span
        aria-hidden="true"
        style={{
          width: 1,
          height: 24,
          background: 'var(--pathable-color-border, #ccc)',
          display: 'inline-block',
        }}
      />
      <IconButton appearance="subtle" aria-label="Edit" onClick={onEdit}>
        <AppIcon name="edit" />
      </IconButton>
      <IconButton
        appearance="subtle"
        aria-label="Download"
        onClick={onDownload}
      >
        <AppIcon name="download" />
      </IconButton>
      <span
        aria-hidden="true"
        style={{
          width: 1,
          height: 24,
          background: 'var(--pathable-color-border, #ccc)',
          display: 'inline-block',
        }}
      />
      <IconButton appearance="bordered" aria-label="Delete" onClick={onDelete}>
        <AppIcon name="trash" />
      </IconButton>
      <IconButton
        appearance="bordered"
        aria-label="Settings"
        onClick={onSettings}
      >
        <AppIcon name="settings" />
      </IconButton>
    </div>
  )
}

function StatusItem({
  status,
  icon,
  title,
  detail,
}: {
  readonly status: 'success' | 'warning' | 'error' | 'info'
  readonly icon: IconName
  readonly title: string
  readonly detail: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <IconTile shape="circle" status={status} aria-hidden="true">
        <AppIcon name={icon} />
      </IconTile>
      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{detail}</div>
      </div>
    </div>
  )
}

function StatusRowContent() {
  return (
    <div className="pathable-cluster" style={{ alignItems: 'center' }}>
      <StatusItem
        status="success"
        icon="checkCircle"
        title="Compliance Training"
        detail="Completed Apr 12"
      />
      <StatusItem
        status="warning"
        icon="alertTriangle"
        title="Safety Certification"
        detail="Pending review"
      />
      <StatusItem
        status="error"
        icon="xCircle"
        title="Fire Safety Drill"
        detail="Overdue 14 days"
      />
      <StatusItem
        status="info"
        icon="info"
        title="HIPAA Update"
        detail="Available Aug 1"
      />
    </div>
  )
}

function ToolbarPanelDemo(actions: ToolbarActionHandlers) {
  return (
    <>
      <StoryIntro title="Toolbar Panel with Actions">
        A raised surface containing an inline cluster of icon buttons for common
        actions.
      </StoryIntro>
      <div
        className="pathable-surface pathable-surface--raised"
        style={{ padding: '0.75rem 1rem' }}
      >
        <ToolbarActions {...actions} />
      </div>
    </>
  )
}

function StatusRowDemo() {
  return (
    <>
      <StoryIntro title="Status Icon Row">
        A row of status icon tiles indicating the state of related items.
      </StoryIntro>
      <div
        className="pathable-surface pathable-surface--raised"
        style={{ padding: '1rem' }}
      >
        <StatusRowContent />
      </div>
    </>
  )
}

function ViewSwitcherDemo() {
  return (
    <>
      <StoryIntro title="Segmented View Switcher">
        A segmented control for switching between view modes, with icon
        indicators.
      </StoryIntro>
      <div
        className="pathable-surface pathable-surface--raised"
        style={{ padding: '1rem' }}
      >
        <div
          className="pathable-cluster"
          style={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Documents
          </span>
          <ViewSwitcherControl />
        </div>
      </div>
    </>
  )
}

function FullCompositionDemo(actions: ToolbarActionHandlers) {
  return (
    <>
      <StoryIntro title="Full Integration">
        A complete composition: toolbar, view switcher, and status tiles within
        a raised surface panel.
      </StoryIntro>
      <div
        className="pathable-surface pathable-surface--raised"
        style={{ padding: '1.25rem' }}
      >
        <div
          className="pathable-cluster"
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconTile aria-hidden="true">
              <AppIcon name="file" />
            </IconTile>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>
              Training Records
            </span>
          </div>
          <ViewSwitcherControl />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <ToolbarActions {...actions} />
        </div>

        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: 'var(--pathable-color-border, #e0e0e0)',
            margin: '0 0 1rem',
          }}
        />

        <StatusRowContent />
      </div>
    </>
  )
}

const meta = {
  title: 'Interaction Controls/Integration',
  component: FullCompositionDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A composition story demonstrating how the React interaction-control wrappers combine into realistic application surfaces.

**Purpose**: Mirror the styles catalog's Interaction Controls/Integration examples using the public React components: \`IconButton\`, \`IconTile\`, and \`SegmentedControl\`.

**When to use**: As a reference for composing compact toolbar actions, status indicators, and view-mode controls inside Pathable surfaces.

**When not to use**: For single-component API details, use each component's dedicated story. This story defines no new production API.

**Accessibility**: Icon buttons expose names through \`aria-label\`, decorative icon tiles are hidden from assistive technology, and the view switcher uses controlled radiogroup semantics through \`SegmentedControl\`.`,
      },
    },
  },
} satisfies Meta<typeof FullCompositionDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ToolbarPanel: Story = {
  args: {
    onSearch: fn(),
  },
  render: (args) => <ToolbarPanelDemo {...args} />,
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('surface and icon buttons use the class contract', async () => {
      const surface = canvasElement.querySelector('.pathable-surface')
      const searchButton = canvas.getByRole('button', { name: 'Search' })

      await expect(surface).not.toBeNull()
      await expect(surface).toHaveClass(
        'pathable-surface',
        'pathable-surface--raised',
      )
      await expect(searchButton).toHaveClass(
        'pathable-icon-button',
        'pathable-icon-button--bare',
      )
    })

    await step('icon buttons are named and keyboard activatable', async () => {
      const searchButton = canvas.getByRole('button', { name: 'Search' })
      searchButton.focus()
      await expect(searchButton).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect(args.onSearch).toHaveBeenCalledTimes(1)
      await expect(searchButton).toHaveFocus()
    })
  },
}

export const StatusRow: Story = {
  render: () => <StatusRowDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('status tiles use the class contract', async () => {
      const tile = canvasElement.querySelector('.pathable-icon-tile')

      await expect(tile).not.toBeNull()
      await expect(tile).toHaveClass(
        'pathable-icon-tile',
        'pathable-icon-tile--circle',
        'pathable-icon-tile--success',
      )
    })

    await step('status text is visible next to decorative tiles', async () => {
      await expect(canvas.getByText('Compliance Training')).toBeVisible()
      await expect(canvas.getByText('Safety Certification')).toBeVisible()
      await expect(canvas.getByText('Fire Safety Drill')).toBeVisible()
      await expect(canvas.getByText('HIPAA Update')).toBeVisible()
    })
  },
}

export const ViewSwitcher: Story = {
  render: () => <ViewSwitcherDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('view switcher exposes radiogroup semantics', async () => {
      const group = canvas.getByRole('radiogroup', { name: 'View mode' })
      const list = canvas.getByRole('radio', { name: 'List' })

      await expect(group).toHaveClass('pathable-segmented-control')
      await expect(list).toHaveClass(
        'pathable-segmented-control__option',
        'pathable-segmented-control__option--selected',
      )
      await expect(list).toHaveAttribute('aria-checked', 'true')
    })

    await step('arrow key changes the selected view', async () => {
      const list = canvas.getByRole('radio', { name: 'List' })
      list.focus()
      await userEvent.keyboard('{ArrowRight}')
      await expect(canvas.getByRole('radio', { name: 'Grid' })).toHaveAttribute(
        'aria-checked',
        'true',
      )
    })
  },
}

export const FullComposition: Story = {
  args: {
    onDownload: fn(),
  },
  render: (args) => <FullCompositionDemo {...args} />,
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step(
      'composition renders all interaction-control regions',
      async () => {
        const surface = canvasElement.querySelector('.pathable-surface')

        await expect(surface).not.toBeNull()
        await expect(surface).toHaveClass(
          'pathable-surface',
          'pathable-surface--raised',
        )
        await expect(canvas.getByText('Training Records')).toBeVisible()
        await expect(
          canvas.getByRole('button', { name: 'Download' }),
        ).toBeVisible()
        await expect(
          canvas.getByRole('radiogroup', { name: 'View mode' }),
        ).toBeVisible()
        await expect(canvas.getByText('Safety Certification')).toBeVisible()
      },
    )

    await step(
      'toolbar action remains keyboard activatable in composition',
      async () => {
        const exportButton = canvas.getByRole('button', { name: 'Download' })
        exportButton.focus()
        await expect(exportButton).toHaveFocus()
        // Square brackets select the physical Space key code in user-event.
        await userEvent.keyboard('[Space]')
        await expect(args.onDownload).toHaveBeenCalledTimes(1)
        await expect(exportButton).toHaveFocus()
      },
    )
  },
}

export const Narrow: Story = {
  render: () => <FullCompositionDemo />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const Default: Story = {
  ...FullComposition,
  args: {
    onDownload: fn(),
  },
}
