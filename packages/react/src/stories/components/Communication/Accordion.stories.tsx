import { Accordion } from '../../../components/Accordion/Accordion'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect, fn } from 'storybook/test'
import { ACCORDION_ITEMS, BILL_OF_RIGHTS } from './fixtures'

const meta = {
  title: 'Components/Communication/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A disclosure widget that allows users to show and hide sections of related content.

**When to use**: To organize content into expandable sections that users can navigate through independently. Use when showing all content at once would overwhelm the user.

**When not to use**: Do not use for navigation (use a nav component). Do not use for step-by-step processes (use ProcessList or StepIndicator). Do not use when all content should be visible at once.

**Keyboard behavior**: Enter or Space toggles a panel open or closed. Tab moves focus between accordion buttons.

**Underlying element**: \`<div>\` with \`<button>\` disclosures per the USWDS accordion pattern.`,
      },
    },
  },
  argTypes: {
    items: {
      description:
        'Array of accordion items with id, heading, content, and optional disabled.',
    },
    expandedIds: {
      control: { type: 'object' },
      description: 'Controlled expanded item IDs.',
    },
    defaultExpandedIds: {
      control: { type: 'object' },
      description: 'Default expanded items (uncontrolled).',
    },
    allowMultiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple panels open simultaneously.',
    },
    onExpandedChange: {
      action: 'expandedChange',
      description: 'Called with the array of expanded IDs when toggled.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
  args: {
    items: ACCORDION_ITEMS,
    allowMultiple: false,
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Fixed stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    items: ACCORDION_ITEMS,
  },
}

export const MultipleAllowed: Story = {
  args: {
    items: ACCORDION_ITEMS,
    allowMultiple: true,
  },
}

export const InitiallyExpanded: Story = {
  args: {
    items: ACCORDION_ITEMS,
    defaultExpandedIds: ['first'],
  },
}

export const DisabledItem: Story = {
  args: {
    items: [
      {
        id: 'first',
        heading: 'First Amendment',
        content: (
          <p>
            Congress shall make no law respecting an establishment of religion,
            or prohibiting the free exercise thereof; or abridging the freedom
            of speech, or of the press; or the right of the people peaceably to
            assemble, and to petition the Government for a redress of
            grievances.
          </p>
        ),
      },
      {
        id: 'second',
        heading: 'Second Amendment',
        content: (
          <p>
            A well regulated Militia, being necessary to the security of a free
            State, the right of the people to keep and bear Arms, shall not be
            infringed.
          </p>
        ),
        disabled: true,
      },
      {
        id: 'third',
        heading: 'Third Amendment',
        content: (
          <p>
            No Soldier shall, in time of peace be quartered in any house,
            without the consent of the Owner, nor in time of war, but in a
            manner to be prescribed by law.
          </p>
        ),
      },
    ],
  },
}

export const LongContent: Story = {
  args: {
    items: [
      {
        id: 'rights',
        heading: 'Bill of Rights',
        content: <p>{BILL_OF_RIGHTS.map((r) => r.content).join(' ')}</p>,
      },
    ],
  },
}

export const Narrow: Story = {
  args: {
    items: ACCORDION_ITEMS,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

// ---------------------------------------------------------------------------
// Interaction tests
// ---------------------------------------------------------------------------

export const PointerToggle: Story = {
  args: {
    items: ACCORDION_ITEMS,
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('click expands a collapsed panel', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('click collapses an expanded panel', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const KeyboardToggle: Story = {
  args: {
    items: ACCORDION_ITEMS,
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Tab focuses the first accordion button', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.tab()
      await expect(button).toHaveFocus()
    })

    await step('Enter key expands the panel', async () => {
      await userEvent.keyboard('{Enter}')
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('Space key collapses the panel', async () => {
      await userEvent.keyboard(' ')
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const SingleSelectBehavior: Story = {
  args: {
    items: ACCORDION_ITEMS,
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('open first panel', async () => {
      const button = canvas.getByRole('button', { name: /First Amendment/ })
      await userEvent.click(button)
      await expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    await step('opening second panel closes the first', async () => {
      const firstButton = canvas.getByRole('button', {
        name: /First Amendment/,
      })
      const secondButton = canvas.getByRole('button', {
        name: /Second Amendment/,
      })
      await userEvent.click(secondButton)
      await expect(secondButton).toHaveAttribute('aria-expanded', 'true')
      await expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const DisabledItemBehavior: Story = {
  args: {
    items: [
      {
        id: 'first',
        heading: 'First Amendment',
        content: <p>Congress shall make no law...</p>,
      },
      {
        id: 'second',
        heading: 'Second Amendment',
        content: <p>A well regulated Militia...</p>,
        disabled: true,
      },
    ],
    onClick: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('disabled button is disabled in the DOM', async () => {
      const button = canvas.getByRole('button', { name: /Second Amendment/ })
      await expect(button).toBeDisabled()
    })

    await step('clicking disabled button does not toggle', async () => {
      const button = canvas.getByRole('button', { name: /Second Amendment/ })
      await userEvent.click(button, { skipPointerEventsCheck: true })
      await expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  },
}
