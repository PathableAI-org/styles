import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

import {
  IconTile,
  type IconTileShape,
  type IconTileSize,
  type IconTileStatus,
} from '../../components/IconTile/IconTile'

function BellIcon({ meaningful = false, label = 'Notifications' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={meaningful ? 'img' : undefined}
      aria-label={meaningful ? label : undefined}
      aria-hidden={meaningful ? undefined : true}
      focusable="false"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function CheckCircleIcon({ label = 'Success' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function XCircleIcon({ label = 'Error' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

function AlertTriangleIcon({ label = 'Warning' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function InfoIcon({ label = 'Information' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function MeaningfulStatusIcon({
  status,
  label,
}: {
  status: Exclude<IconTileStatus, 'default'>
  label: string
}) {
  switch (status) {
    case 'success':
      return <CheckCircleIcon label={label} />
    case 'error':
      return <XCircleIcon label={label} />
    case 'warning':
      return <AlertTriangleIcon label={label} />
    case 'info':
      return <InfoIcon label={label} />
    default: {
      const exhaustiveStatus: never = status
      throw new Error(`Unsupported IconTile status: ${exhaustiveStatus}`)
    }
  }
}

const meta = {
  title: 'Interaction Controls/Icon Tile',
  component: IconTile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A non-interactive icon container that applies the PathAble icon tile visual contract for decorative icons, status indicators, and compact inline icon-and-text patterns.

**When to use**: Use IconTile when an icon needs a consistent square or circular container, status color treatment, or alignment beside short text. It is appropriate for decorative supporting icons and meaningful status icons.

**When not to use**: Do not use IconTile for actions. Use IconButton when the icon is clickable, and use visible text or a labelled Button when the symbol is unfamiliar.

**Underlying element**: A generic \`<span>\` with \`.pathable-icon-tile\` and optional modifier classes.

**Accessibility**: Decorative tiles should receive \`aria-hidden="true"\`. Meaningful status icons should expose the SVG with \`role="img"\` and \`aria-label\`. IconTile itself does not add focus, button semantics, or accessible names.

**Known constraints**: IconTile does not provide icons, labels, tooltips, actions, or live status announcements. Consumers own the SVG semantics and nearby visible text.`,
      },
    },
  },
  argTypes: {
    size: {
      options: ['compact', 'default', 'large'],
      control: { type: 'select' },
      description:
        'Tile size. Compact is 32px, default is 44px, and large is 52px through the styles contract.',
    },
    shape: {
      options: ['square', 'circle'],
      control: { type: 'select' },
      description:
        'Square or circular presentation. Shape does not change semantics.',
    },
    status: {
      options: ['default', 'success', 'error', 'warning', 'info'],
      control: { type: 'select' },
      description:
        'Optional foreground status treatment. Status meaning must also be available through text or SVG accessible naming.',
    },
    children: {
      control: false,
      description:
        'Consumer-provided SVG icon. Decorative SVGs should be hidden from assistive technology.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble IconTile classes.',
    },
    'aria-hidden': {
      control: { type: 'boolean' },
      description:
        'Use true when the tile is decorative and nearby text already communicates the meaning.',
    },
  },
  args: {
    size: 'default',
    shape: 'square',
    status: 'default',
    'aria-hidden': true,
    children: <BellIcon />,
  },
} satisfies Meta<typeof IconTile>

export default meta
type Story = StoryObj<typeof meta>
type StatusFixture =
  | { status: 'default'; label: string; accessibleName: undefined }
  | {
      status: Exclude<IconTileStatus, 'default'>
      label: string
      accessibleName: string
    }

const tileShapes = ['square', 'circle'] satisfies IconTileShape[]
const sizeFixtures = [
  ['compact', 'Compact'],
  ['default', 'Default'],
  ['large', 'Large'],
] satisfies [IconTileSize, string][]
const statusFixtures = [
  { status: 'default', label: 'Default', accessibleName: undefined },
  {
    status: 'success',
    label: 'Success',
    accessibleName: 'Training record verified',
  },
  {
    status: 'error',
    label: 'Error',
    accessibleName: 'Missing required documentation',
  },
  {
    status: 'warning',
    label: 'Warning',
    accessibleName: 'Approval pending review',
  },
  { status: 'info', label: 'Info', accessibleName: 'Three new messages' },
] satisfies StatusFixture[]
const allVariantFixtures = [
  { size: 'default', status: 'default' },
  { size: 'compact', status: 'default' },
  { size: 'large', status: 'default' },
  { size: 'default', status: 'success' },
  { size: 'default', status: 'error' },
  { size: 'default', status: 'warning' },
  { size: 'default', status: 'info' },
] satisfies { size: IconTileSize; status: IconTileStatus }[]
const meaningfulStatusIconCount = statusFixtures.filter(
  (fixture) => fixture.status !== 'default',
).length

function getIconTileForLabel(labelElement: HTMLElement) {
  const tile = labelElement.parentElement?.querySelector<HTMLElement>(
    '.pathable-icon-tile',
  )

  if (!tile) {
    throw new Error(`Expected IconTile next to ${labelElement.textContent}`)
  }

  return tile
}

function getSvgIcon(tile: HTMLElement) {
  const icon = tile.querySelector<SVGElement>('svg')

  if (!icon) {
    throw new Error('Expected IconTile to contain an svg icon')
  }

  return icon
}

function LongContentExample() {
  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <IconTile status="warning" aria-hidden="true">
        <AlertTriangleIcon />
      </IconTile>
      <span>
        Approval pending review from the regional compliance coordinator for the
        extended safety certification package
      </span>
    </span>
  )
}

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('.pathable-icon-tile')
    const icon = tile?.querySelector('svg')

    await expect(tile).toHaveClass('pathable-icon-tile')
    await expect(tile).not.toHaveClass(
      'pathable-icon-tile--compact',
      'pathable-icon-tile--large',
      'pathable-icon-tile--circle',
    )
    await expect(tile).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  },
}

export const SquareAndCircle: Story = {
  render: () => (
    <div className="pathable-cluster pathable-cluster--gap-lg">
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <IconTile aria-hidden="true">
          <BellIcon />
        </IconTile>
        <span>Square tile</span>
      </span>
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <IconTile shape="circle" aria-hidden="true">
          <BellIcon />
        </IconTile>
        <span>Circle tile</span>
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const squareLabel = canvas.getByText('Square tile')
    const circleLabel = canvas.getByText('Circle tile')
    const squareTile = getIconTileForLabel(squareLabel)
    const circleTile = getIconTileForLabel(circleLabel)

    await expect(squareLabel).toBeVisible()
    await expect(circleLabel).toBeVisible()
    await expect(squareTile).toHaveClass('pathable-icon-tile')
    await expect(squareTile).not.toHaveClass('pathable-icon-tile--circle')
    await expect(circleTile).toHaveClass(
      'pathable-icon-tile',
      'pathable-icon-tile--circle',
    )
    await expect(squareTile).toHaveAttribute('aria-hidden', 'true')
    await expect(circleTile).toHaveAttribute('aria-hidden', 'true')
  },
}

export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {tileShapes.map((shape) => (
        <div
          key={shape}
          role="group"
          aria-label={`${shape} icon tile sizes`}
          className="pathable-cluster pathable-cluster--gap-lg"
        >
          {sizeFixtures.map(([size, label]) => (
            <span
              key={size}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <IconTile size={size} shape={shape} aria-hidden="true">
                <BellIcon />
              </IconTile>
              <span>
                {label}
                {shape === 'circle' ? ' Circle' : ''}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const shape of tileShapes) {
      const group = within(
        canvas.getByRole('group', { name: `${shape} icon tile sizes` }),
      )

      for (const [size, label] of sizeFixtures) {
        const visibleLabel = group.getByText(
          `${label}${shape === 'circle' ? ' Circle' : ''}`,
        )
        const tile = getIconTileForLabel(visibleLabel)
        const icon = getSvgIcon(tile)

        await expect(tile).toHaveClass('pathable-icon-tile')
        await expect(tile).toHaveAttribute('aria-hidden', 'true')
        await expect(icon).toHaveAttribute('aria-hidden', 'true')
        if (size === 'default') {
          await expect(tile).not.toHaveClass(
            'pathable-icon-tile--compact',
            'pathable-icon-tile--large',
          )
        } else {
          await expect(tile).toHaveClass(`pathable-icon-tile--${size}`)
        }
        if (shape === 'circle') {
          await expect(tile).toHaveClass('pathable-icon-tile--circle')
        } else {
          await expect(tile).not.toHaveClass('pathable-icon-tile--circle')
        }
      }
    }
  },
}

export const CircleSizes: Story = {
  render: () => (
    <div className="pathable-cluster pathable-cluster--gap-lg">
      {(
        [
          ['compact', 'Compact circle'],
          ['default', 'Default circle'],
          ['large', 'Large circle'],
        ] satisfies [IconTileSize, string][]
      ).map(([size, label]) => (
        <span
          key={size}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <IconTile size={size} shape="circle" aria-hidden="true">
            <BellIcon />
          </IconTile>
          <span>{label}</span>
        </span>
      ))}
    </div>
  ),
}

export const StatusVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {tileShapes.map((shape) => (
        <div
          key={shape}
          role="group"
          aria-label={`${shape} icon tile statuses`}
          className="pathable-cluster pathable-cluster--gap-lg"
        >
          {statusFixtures.map((fixture) => (
            <span
              key={fixture.status}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <IconTile
                shape={shape}
                status={fixture.status}
                aria-hidden={fixture.status === 'default' ? true : undefined}
              >
                {fixture.status === 'default' ? (
                  <BellIcon />
                ) : (
                  <MeaningfulStatusIcon
                    status={fixture.status}
                    label={fixture.accessibleName}
                  />
                )}
              </IconTile>
              <span>{fixture.label}</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const shape of tileShapes) {
      const group = within(
        canvas.getByRole('group', { name: `${shape} icon tile statuses` }),
      )
      const defaultLabel = group.getByText('Default')
      const defaultTile = getIconTileForLabel(defaultLabel)

      await expect(defaultTile).toHaveClass('pathable-icon-tile')
      await expect(defaultTile).toHaveAttribute('aria-hidden', 'true')
      if (shape === 'circle') {
        await expect(defaultTile).toHaveClass('pathable-icon-tile--circle')
      } else {
        await expect(defaultTile).not.toHaveClass('pathable-icon-tile--circle')
      }
      await expect(group.queryAllByRole('img')).toHaveLength(
        meaningfulStatusIconCount,
      )

      for (const fixture of statusFixtures) {
        if (fixture.status === 'default') continue

        const icon = group.getByRole('img', {
          name: fixture.accessibleName,
        })
        const tile = icon.parentElement

        await expect(icon).toBeVisible()
        await expect(icon).toHaveAttribute('focusable', 'false')
        await expect(tile).toHaveClass(
          'pathable-icon-tile',
          `pathable-icon-tile--${fixture.status}`,
        )
        if (shape === 'circle') {
          await expect(tile).toHaveClass('pathable-icon-tile--circle')
        } else {
          await expect(tile).not.toHaveClass('pathable-icon-tile--circle')
        }
      }
    }
  },
}

export const InlineAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <IconTile status="success" aria-hidden="true">
          <CheckCircleIcon />
        </IconTile>
        <span>Training record verified</span>
      </span>
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <IconTile status="error" aria-hidden="true">
          <XCircleIcon />
        </IconTile>
        <span>Missing required documentation</span>
      </span>
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <IconTile status="warning" aria-hidden="true">
          <AlertTriangleIcon />
        </IconTile>
        <span>Approval pending review</span>
      </span>
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <IconTile shape="circle" status="info" aria-hidden="true">
          <InfoIcon />
        </IconTile>
        <span>3 new messages</span>
      </span>
    </div>
  ),
}

export const LongContent: Story = {
  render: () => <LongContentExample />,
}

export const Narrow: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <LongContentExample />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tileShapes.map((shape) => (
        <div key={shape}>
          <strong className="pathable-display-block pathable-margin-bottom-2">
            {shape === 'square' ? 'Square' : 'Circle'}
          </strong>
          <div
            role="group"
            aria-label={`${shape} icon tile variants`}
            className="pathable-cluster pathable-cluster--gap-lg"
          >
            {allVariantFixtures.map(({ size, status }) => (
              <IconTile
                key={`${size}-${status}`}
                size={size}
                shape={shape}
                status={status}
                data-variant={`${shape}-${size}-${status}`}
                aria-hidden="true"
              >
                <BellIcon />
              </IconTile>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    for (const shape of tileShapes) {
      const group = canvas.getByRole('group', {
        name: `${shape} icon tile variants`,
      })
      const tiles = group.querySelectorAll('.pathable-icon-tile')

      await expect(tiles).toHaveLength(allVariantFixtures.length)
      for (const { size, status } of allVariantFixtures) {
        const tile = group.querySelector<HTMLElement>(
          `[data-variant="${shape}-${size}-${status}"]`,
        )

        if (!tile) {
          throw new Error(
            `Missing IconTile variant: ${shape}-${size}-${status}`,
          )
        }

        const icon = getSvgIcon(tile)

        await expect(tile).toHaveClass('pathable-icon-tile')
        await expect(tile).toHaveAttribute('aria-hidden', 'true')
        await expect(icon).toHaveAttribute('aria-hidden', 'true')
        if (size === 'default') {
          await expect(tile).not.toHaveClass(
            'pathable-icon-tile--compact',
            'pathable-icon-tile--large',
          )
        } else {
          await expect(tile).toHaveClass(`pathable-icon-tile--${size}`)
        }
        if (status === 'default') {
          await expect(tile).not.toHaveClass(
            'pathable-icon-tile--success',
            'pathable-icon-tile--error',
            'pathable-icon-tile--warning',
            'pathable-icon-tile--info',
          )
        } else {
          await expect(tile).toHaveClass(`pathable-icon-tile--${status}`)
        }
        if (shape === 'circle') {
          await expect(tile).toHaveClass('pathable-icon-tile--circle')
        } else {
          await expect(tile).not.toHaveClass('pathable-icon-tile--circle')
        }
      }
    }
    await expect(canvas.queryAllByRole('img')).toHaveLength(0)
  },
}

export const Default: Story = AllVariants

export const CustomAttributes: Story = {
  render: () => (
    <IconTile
      status="info"
      className="custom-icon-tile"
      data-state="informational"
      aria-hidden="true"
    >
      <InfoIcon />
    </IconTile>
  ),
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('.pathable-icon-tile')

    await expect(tile).toHaveClass('pathable-icon-tile', 'custom-icon-tile')
    await expect(tile).toHaveAttribute('data-state', 'informational')
  },
}

export const UnsupportedValuesFallback: Story = {
  render: () => (
    <IconTile
      size={'unsupported' as IconTileSize}
      shape={'unsupported' as IconTileShape}
      status={'unsupported' as IconTileStatus}
      aria-hidden="true"
    >
      <BellIcon />
    </IconTile>
  ),
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector('.pathable-icon-tile')

    await expect(tile).toBeTruthy()
    await expect(tile).toHaveClass('pathable-icon-tile')
    await expect(tile.className).not.toContain('unsupported')
  },
}

export const StatusRowComposition: Story = {
  render: () => (
    <div className="pathable-surface pathable-surface--raised pathable-padding-4">
      <div className="pathable-cluster pathable-cluster--gap-lg">
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <IconTile shape="circle" status="success" aria-hidden="true">
            <CheckCircleIcon />
          </IconTile>
          <span>Compliance complete</span>
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <IconTile shape="circle" status="warning" aria-hidden="true">
            <AlertTriangleIcon />
          </IconTile>
          <span>Safety review pending</span>
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <IconTile shape="circle" status="error" aria-hidden="true">
            <XCircleIcon />
          </IconTile>
          <span>Fire drill overdue</span>
        </span>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Compliance complete')).toBeVisible()
    await expect(canvas.getByText('Safety review pending')).toBeVisible()
    await expect(canvas.getByText('Fire drill overdue')).toBeVisible()
  },
}
