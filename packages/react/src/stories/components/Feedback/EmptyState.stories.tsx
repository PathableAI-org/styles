import { Button } from '../../../components/Button/Button'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

const DATA_ICON = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
    <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-2h2v10h-2z" />
  </svg>
)

const SEARCH_ICON = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
)

const SETUP_ICON = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M11 9h2V7h-2v2z" />
  </svg>
)

const COMPLETED_ICON = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
)

const meta = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A structured message for a view that has no content to display. It renders the existing PathAble empty-state classes around a semantic heading, explanation, decorative icon, and optional action.

**When to use**: Use EmptyState when a collection has no data, a search has no matches, a feature needs setup, or the user has completed all available work. Explain why the view is empty and provide a useful next action when one exists.

**When not to use**: Do not use EmptyState for loading, errors, or permission failures. Use the corresponding feedback pattern instead. Do not use it as a generic content container.

**Underlying element**: \`<div>\` with a semantic \`<h2>\` heading and \`<p>\` body.

**Variants**: \`no-data\`, \`no-results\`, \`setup-required\`, and \`completed\` map directly to the implemented PathAble modifier classes.

**Slots**: The \`icon\` is decorative and is forced to \`aria-hidden="true"\`. The \`action\` must be an element that accepts \`className\`, such as a native link, \`Link\`, or \`Button\`, so the required PathAble action class can be merged without adding wrapper markup.`,
      },
    },
  },
  argTypes: {
    variant: {
      options: ['no-data', 'no-results', 'setup-required', 'completed'],
      control: { type: 'select' },
      description: 'The empty-state context and matching PathAble modifier.',
    },
    heading: {
      control: { type: 'text' },
      description: 'Primary message rendered as the semantic h2 heading.',
    },
    body: {
      control: { type: 'text' },
      description: 'Explanation rendered as the body paragraph.',
    },
    icon: {
      control: false,
      description:
        'Optional decorative React element. The component adds the icon class and aria-hidden attribute.',
    },
    action: {
      control: false,
      description:
        'Optional action element. It must accept className so the action class can be merged.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble empty-state classes.',
    },
  },
  args: {
    variant: 'no-data',
    icon: DATA_ICON,
    heading: 'No data yet',
    body: 'Data will appear here once it becomes available.',
    action: (
      <a href="#add-item" className="pathable-button">
        Add your first item
      </a>
    ),
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const NoData: Story = {
  args: {
    variant: 'no-data',
    icon: DATA_ICON,
    heading: 'No data yet',
    body: 'Data will appear here once it becomes available. Get started by adding your first item.',
    action: (
      <a href="#add-first-item" className="pathable-button">
        Add your first item
      </a>
    ),
  },
}

export const NoResults: Story = {
  args: {
    variant: 'no-results',
    icon: SEARCH_ICON,
    heading: 'No matching results',
    body: 'Try adjusting your search terms or filters to find what you are looking for.',
    action: (
      <a href="#clear-filters" className="pathable-button">
        Clear all filters
      </a>
    ),
  },
}

export const SetupRequired: Story = {
  args: {
    variant: 'setup-required',
    icon: SETUP_ICON,
    heading: 'Setup required',
    body: 'Complete the initial setup to start using this feature.',
    action: <Button variant="primary">Begin setup</Button>,
  },
}

export const Completed: Story = {
  args: {
    variant: 'completed',
    icon: COMPLETED_ICON,
    heading: 'All caught up',
    body: 'You have completed all items. There is nothing left to review.',
    action: undefined,
  },
}

export const WithoutIcon: Story = {
  args: {
    variant: 'no-data',
    icon: undefined,
    heading: 'Nothing has been added',
    body: 'Add an item to begin building this collection.',
    action: (
      <a href="#add-collection-item" className="pathable-button">
        Add an item
      </a>
    ),
  },
}

export const CustomAttributes: Story = {
  args: {
    variant: 'no-results',
    icon: SEARCH_ICON,
    heading: 'No participant matches',
    body: 'Try a different name or remove one of the active filters.',
    id: 'participant-search-empty-state',
    'aria-label': 'Participant search results',
    'data-testid': 'participant-search-empty-state',
    className: 'custom-empty-state',
    action: (
      <a href="#clear-participant-filters" className="pathable-button">
        Clear filters
      </a>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', {
      name: 'No participant matches',
      level: 2,
    })
    const root = heading.parentElement
    const action = canvas.getByRole('link', { name: 'Clear filters' })

    await expect(root).toHaveClass(
      'pathable-empty-state',
      'pathable-empty-state--no-results',
      'custom-empty-state',
    )
    await expect(root).toHaveAttribute('id', 'participant-search-empty-state')
    await expect(root).toHaveAttribute(
      'aria-label',
      'Participant search results',
    )
    await expect(action).toHaveClass(
      'pathable-empty-state__action',
      'pathable-button',
    )
  },
}

export const AccessibilityCheck: Story = {
  args: {
    variant: 'no-results',
    icon: SEARCH_ICON,
    heading: 'No matching resources',
    body: 'Try adjusting your search terms or clearing your filters.',
    action: (
      <a href="#clear-resource-filters" className="pathable-button">
        Clear filters
      </a>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('empty state has a semantic heading and body', async () => {
      await expect(
        canvas.getByRole('heading', {
          name: 'No matching resources',
          level: 2,
        }),
      ).toBeVisible()
      await expect(
        canvas.getByText(
          'Try adjusting your search terms or clearing your filters.',
        ),
      ).toBeVisible()
    })

    await step('action is a keyboard-accessible link', async () => {
      const action = canvas.getByRole('link', { name: 'Clear filters' })
      await expect(action).toHaveAttribute('href', '#clear-resource-filters')
      await userEvent.tab()
      await expect(action).toHaveFocus()
    })
  },
}

const actionClick = fn()

export const ActionInteraction: Story = {
  render: () => (
    <EmptyState
      variant="no-data"
      icon={DATA_ICON}
      heading="No saved plans"
      body="Create a plan to track the participant's next steps."
      action={<Button onClick={actionClick}>Create a plan</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const action = canvas.getByRole('button', { name: 'Create a plan' })

    await userEvent.tab()
    await expect(action).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(actionClick).toHaveBeenCalledTimes(1)
    await userEvent.keyboard(' ')
    await expect(actionClick).toHaveBeenCalledTimes(2)
  },
}

export const LongContent: Story = {
  args: {
    variant: 'no-data',
    icon: DATA_ICON,
    heading: 'No participant employment coaching plans have been created yet',
    body: 'Once a plan is created, this area will show the participant goals, agreed activities, assigned support, and progress updates for the current coaching period.',
    action: (
      <a href="#create-coaching-plan" className="pathable-button">
        Create a coaching plan
      </a>
    ),
  },
}

export const Narrow: Story = {
  args: {
    variant: 'no-results',
    icon: SEARCH_ICON,
    heading: 'No results',
    body: 'Try adjusting your search or clearing your filters.',
    action: (
      <a href="#clear-filters-narrow" className="pathable-button">
        Clear filters
      </a>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const PageComposition: Story = {
  render: () => (
    <section aria-labelledby="participant-plans-heading">
      <h1 id="participant-plans-heading">Participant plans</h1>
      <EmptyState
        variant="completed"
        icon={COMPLETED_ICON}
        heading="All plans are complete"
        body="There are no remaining participant plans to review."
      />
    </section>
  ),
}
