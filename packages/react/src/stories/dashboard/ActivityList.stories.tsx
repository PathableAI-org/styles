import { ActivityList } from '../../components/ActivityList/ActivityList'
import type { ActivityItem } from '../../components/ActivityList/ActivityList'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

const viewActivity = fn()

const mixedItems = [
  {
    id: 'completed',
    title: 'Intake assessment completed',
    context: 'Participant: Maria Gonzalez',
    date: <time dateTime="2026-09-30T14:30:00">2:30 PM</time>,
    owner: 'You',
    status: 'completed',
    statusLabel: 'Completed',
    actions: <button onClick={viewActivity}>View assessment</button>,
    attributes: {
      className: 'consumer-activity-row',
      title: 'Assessment activity row',
    },
  },
  {
    id: 'in-progress',
    title: 'Follow-up call scheduled',
    context: 'Provider: Cascade Resources',
    date: <time dateTime="2026-09-30T11:00:00">11:00 AM</time>,
    owner: 'Sara M.',
    status: 'in-progress',
    statusLabel: 'In progress',
  },
  {
    id: 'pending',
    title: 'Benefits review pending',
    context: 'Participant: Robert Torres',
    date: 'October 2',
    owner: 'Alex K.',
    status: 'pending',
    statusLabel: 'Pending',
  },
  {
    id: 'cancelled',
    title: 'Application withdrawn',
    context: 'Participant: Lisa Park',
    date: 'September 29',
    owner: 'System',
    status: 'cancelled',
    statusLabel: 'Cancelled',
  },
] as const satisfies readonly ActivityItem[]

const groupedActivities = [
  { id: 'today', heading: 'Today', items: mixedItems.slice(0, 2) },
  { id: 'earlier', heading: 'Earlier', items: mixedItems.slice(2) },
  { id: 'empty', heading: 'No activity here', items: [] },
] as const

const meta = {
  title: 'Dashboard/Activity List',
  component: ActivityList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A server-compatible dashboard list for ordered activity records.

**When to use**: Present recent tasks or events with status, context, time, owner, and optional consumer-owned actions.

**When not to use**: Do not use ActivityList for data fetching, sorting, filtering, pagination, or workflow status transitions.

**Accessibility**: Supply a readable statusLabel for every item. The label is visible and provides the assistive-technology meaning; marker color and shape are supplementary. Supply accessible names for every action.`,
      },
    },
  },
  argTypes: {
    items: {
      description: 'Ordered ungrouped activity records.',
    },
    groups: {
      description: 'Ordered named groups; mutually exclusive with items.',
    },
    density: {
      control: 'select',
      options: ['default', 'compact', 'comfortable'],
      description: 'Documented Activity List density.',
    },
    emptyContent: {
      control: false,
      description: 'Consumer-authored content shown when no rows remain.',
    },
    groupHeadingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      description: 'Semantic heading level for grouped lists.',
    },
  },
  args: {
    items: mixedItems,
    density: 'default',
  },
} satisfies Meta<typeof ActivityList>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const MixedStatuses: Story = {
  args: {
    items: mixedItems,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step(
      'rows preserve supplied order and visible status meaning',
      async () => {
        const rows = canvas.getAllByRole('listitem')
        await expect(rows).toHaveLength(4)
        await expect(rows[0]).toHaveTextContent('Intake assessment completed')
        await expect(rows[1]).toHaveTextContent('Follow-up call scheduled')
        await expect(rows[2]).toHaveTextContent('Benefits review pending')
        await expect(rows[3]).toHaveTextContent('Application withdrawn')

        for (const label of [
          'Completed',
          'In progress',
          'Pending',
          'Cancelled',
        ]) {
          await expect(canvas.getByText(label)).toBeVisible()
        }
      },
    )

    await step('consumer action remains keyboard operable', async () => {
      viewActivity.mockClear()
      const action = canvas.getByRole('button', { name: 'View assessment' })
      action.focus()
      await expect(action).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await expect(viewActivity).toHaveBeenCalledTimes(1)
      await userEvent.keyboard(' ')
      await expect(viewActivity).toHaveBeenCalledTimes(2)
      await expect(action.closest('[role="listitem"]')).toHaveAttribute(
        'title',
        'Assessment activity row',
      )
    })
  },
}

export const UnknownStatus: Story = {
  args: {
    items: [
      {
        id: 'awaiting-review',
        title: 'Application requires review',
        context: 'Participant: Jordan Lee',
        date: 'September 30',
        owner: 'Morgan K.',
        status: 'awaiting-review',
        statusLabel: 'Awaiting review',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Awaiting review')).toBeVisible()
    const row = canvas.getByRole('listitem')
    await expect(row).toHaveTextContent('Application requires review')
    await expect(
      row.querySelector('.pathable-activity-row__status'),
    ).toHaveAttribute('data-status', 'awaiting-review')
  },
}

export const UngroupedWithoutActions: Story = {
  args: {
    items: mixedItems.map(({ actions: _actions, ...item }) => item),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('list')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument()
  },
}

export const Default: Story = {
  args: { items: undefined, groups: groupedActivities },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    await step('groups are visibly and programmatically named', async () => {
      const heading = canvas.getByRole('heading', { name: 'Today' })
      const list = canvas.getByRole('list', { name: 'Today' })
      await expect(heading.nextElementSibling).toBe(list)
      await expect(list).toHaveAttribute('aria-labelledby', heading.id)
      await expect(within(list).getAllByRole('listitem')).toHaveLength(2)
      await expect(
        canvas.queryByRole('heading', { name: 'No activity here' }),
      ).not.toBeInTheDocument()
    })
  },
}

export const Compact: Story = {
  args: { density: 'compact', items: mixedItems },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('list')).toHaveClass(
      'pathable-activity-list--compact',
    )
  },
}

export const Comfortable: Story = {
  args: { density: 'comfortable', items: mixedItems },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('list')).toHaveClass(
      'pathable-activity-list--comfortable',
    )
  },
}

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: { items: mixedItems.slice(0, 2) },
}

export const LongContent: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: {
    items: [
      {
        id: 'long-content',
        title:
          'A deliberately long localized activity title that remains one line',
        context:
          'A deliberately long context value that must stay within the available row width and height',
        date: 'Wednesday, September 30, 2026 at 2:30 in the afternoon Eastern Daylight Time',
        owner:
          'A case owner with a deliberately long localized display name for containment',
        status: 'awaiting-specialist-review',
        statusLabel:
          'Awaiting specialist review with a deliberately long localized label',
        actions: <button>Review long activity</button>,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByRole('listitem')
    const values = [
      'A deliberately long localized activity title that remains one line',
      'Wednesday, September 30, 2026 at 2:30 in the afternoon Eastern Daylight Time',
      'A case owner with a deliberately long localized display name for containment',
    ]
    for (const value of values) {
      const element = canvas.getByText(value)
      await expect(element).toBeInTheDocument()
      await expect(getComputedStyle(element).textOverflow).toBe('ellipsis')
    }
    const action = canvas.getByRole('button', { name: 'Review long activity' })
    action.focus()
    await expect(action).toHaveFocus()
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
  },
}

export const Empty: Story = {
  args: { items: [], emptyContent: 'No recent activity' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const empty = canvas.getByText('No recent activity')
    await expect(empty).toHaveClass('pathable-activity-list__empty')
    await expect(empty.parentElement).toHaveClass(
      'pathable-activity-list--empty',
    )
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument()
  },
}

export const OnlyEmptyGroups: Story = {
  args: {
    items: undefined,
    groups: [{ id: 'empty', heading: 'Not rendered', items: [] }],
    emptyContent: 'No grouped activity',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('No grouped activity')).toBeVisible()
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument()
    await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole('heading', { name: 'Not rendered' }),
    ).not.toBeInTheDocument()
  },
}

export const EmptyWithoutContent: Story = {
  args: { items: [] },
  play: async ({ canvasElement }) => {
    const root = canvasElement.firstElementChild
    await expect(root).toHaveClass('pathable-activity-list--empty')
    await expect(root).toBeEmptyDOMElement()
    await expect(
      canvasElement.querySelector('.pathable-activity-list__empty'),
    ).not.toBeInTheDocument()
  },
}
