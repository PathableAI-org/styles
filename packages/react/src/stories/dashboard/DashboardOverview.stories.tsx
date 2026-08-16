import type { JSX } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { ActivityList, Button, DashboardHeader, Table } from '../../index'

const addProgram = fn()

function DashboardOverviewDemo(): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <DashboardHeader
        breadcrumb={
          <>
            <a href="#home">Home</a>
            <span>Programs</span>
            <span>Employment Pathways</span>
          </>
        }
        title="Employment Pathways"
        context="Active · Q4 2026"
        description="Track and manage employment pathway programs across all regions."
        actions={
          <>
            <Button variant="outline">Export</Button>
            <Button onClick={addProgram}>Add Program</Button>
          </>
        }
      />
      <div className="pathable-kpi-grid">{populatedKpis}</div>
      <ActivityList
        groups={[{ id: 'today', heading: 'Today', items: todayActivities }]}
        groupHeadingLevel={2}
      />
    </div>
  )
}

function kpiCard(
  value: string,
  label: string,
  trend?: 'up' | 'down' | 'neutral',
  trendLabel?: string,
  loading?: boolean,
  unavailable?: boolean,
): JSX.Element {
  const classes = ['pathable-kpi-card']
  if (loading) classes.push('pathable-kpi-card--loading')
  if (unavailable) classes.push('pathable-kpi-card--unavailable')

  return (
    <div key={label} className={classes.join(' ')}>
      {loading ? (
        <>
          <div className="pathable-kpi-card__value" aria-hidden="true" />
          <div className="pathable-kpi-card__label" aria-hidden="true" />
        </>
      ) : (
        <>
          <p className="pathable-kpi-card__value">
            {unavailable ? <span>N/A</span> : value}
          </p>
          <p className="pathable-kpi-card__label">{label}</p>
          {trend ? (
            <div className="pathable-kpi-card__trend" data-trend={trend}>
              <span className="pathable-kpi-card__trend-label">
                {trendLabel}
              </span>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

const populatedKpis = [
  kpiCard('1,247', 'Active Participants', 'up', '+12% from last month'),
  kpiCard('86%', 'Placement Rate', 'up', '+5% from last quarter'),
  kpiCard('342', 'New Enrollments', 'down', '-5% from last month'),
  kpiCard('28', 'Partner Organizations', 'neutral', 'No change'),
]

const loadingKpis = [
  kpiCard('', '', undefined, undefined, true),
  kpiCard('', '', undefined, undefined, true),
  kpiCard('', '', undefined, undefined, true),
]

const unavailableKpis = [
  kpiCard('N/A', 'Active Participants', undefined, undefined, undefined, true),
  kpiCard('N/A', 'Placement Rate', undefined, undefined, undefined, true),
  kpiCard('N/A', 'New Enrollments', undefined, undefined, undefined, true),
]

const todayActivities = [
  {
    id: 'completed',
    title: 'Intake assessment completed',
    context: 'Participant: Maria Gonzalez',
    date: '2:30 PM',
    owner: 'You',
    status: 'completed',
    statusLabel: 'Completed',
  },
  {
    id: 'in-progress',
    title: 'Follow-up call scheduled',
    context: 'Provider: Cascade Resources',
    date: '11:00 AM',
    owner: 'Sara M.',
    status: 'in-progress',
    statusLabel: 'In progress',
  },
] as const

const meta = {
  title: 'Dashboard/Dashboard Overview',
  component: DashboardOverviewDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A pattern/composition story that assembles the dashboard header, a KPI summary region, and an activity list into a cohesive program-overview page, mirroring the styles catalog's \`Dashboard Overview\`.

**Purpose**: Demonstrate how the dashboard primitives (\`DashboardHeader\`, \`ActivityList\`, \`Button\`, \`Table\`) compose into a real overview page. The KPI region is rendered with the documented \`pathable-kpi-*\` classes compiled into \`@pathable/styles\`.

**When to use**: As the reference for an operational dashboard overview page - a page title, key metrics, and recent activity.

**When not to use**: For single-component states, use that component's own story. This story defines no new production API.

**Known constraints**: Deterministic fixture content only; the KPI region uses styles-contract classes since a dedicated KPI React wrapper is tracked separately.`,
      },
    },
  },
} satisfies Meta<typeof DashboardOverviewDemo>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground - exploratory Controls use only (not regression coverage)
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Populated - full composed overview page
// ---------------------------------------------------------------------------

export const Populated: Story = {
  render: () => <DashboardOverviewDemo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('title is the single primary heading', async () => {
      const heading = canvas.getByRole('heading', {
        level: 1,
        name: 'Employment Pathways',
      })
      await expect(heading).toHaveClass('pathable-dashboard-header__title')
      await expect(canvas.queryAllByRole('heading', { level: 1 })).toHaveLength(
        1,
      )
    })

    await step('Add Program button activates on Enter and Space', async () => {
      const button = canvas.getByRole('button', { name: 'Add Program' })
      button.focus()
      await expect(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect(addProgram).toHaveBeenCalledTimes(1)
      await userEvent.keyboard(' ')
      await expect(addProgram).toHaveBeenCalledTimes(2)
    })

    await step('KPI cards and activity rows render', async () => {
      await expect(canvas.getByText('1,247')).toBeVisible()
      await expect(canvas.getByText('Active Participants')).toBeVisible()
      await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
    })
  },
}

// ---------------------------------------------------------------------------
// Loading - page while metrics are loading
// ---------------------------------------------------------------------------

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <DashboardHeader
        title="Employment Pathways"
        description="Loading dashboard data..."
      />
      <div className="pathable-kpi-grid">{loadingKpis}</div>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Empty - page with no program data yet
// ---------------------------------------------------------------------------

export const Empty: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <DashboardHeader
        title="Employment Pathways"
        description="No program data available yet. Add a program to get started."
        actions={<Button>Add Program</Button>}
      />
      <div className="pathable-kpi-grid">{unavailableKpis}</div>
      <Table presentation="borderless" className="pathable-table--empty">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>
              <span className="pathable-table__empty-message">
                No recent activity.
              </span>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  ),
}

// ---------------------------------------------------------------------------
// Mobile - narrow viewport wrap/stack behavior
// ---------------------------------------------------------------------------

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <DashboardHeader
        title="Employment Pathways"
        context="Active · Q4 2026"
        actions={
          <>
            <Button variant="outline">Export</Button>
            <Button>Add Program</Button>
          </>
        }
      />
      <div className="pathable-kpi-grid">{populatedKpis.slice(0, 3)}</div>
      <ActivityList items={todayActivities} />
    </div>
  ),
}
