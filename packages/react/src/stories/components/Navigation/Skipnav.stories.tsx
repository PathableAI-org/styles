import { Skipnav } from '../../../components/Skipnav/Skipnav'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  title: 'Components/Navigation/Skipnav',
  component: Skipnav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A keyboard-accessible skip link that helps users bypass repeated navigation and move directly to the page's main content. It wraps a native \`<a>\` element with the \`.pathable-skipnav\` class.

**When to use**: Place Skipnav near the beginning of the page or application shell when repeated navigation appears before the main content. Set \`href\` to the unique \`id\` of the main content landmark.

**When not to use**: Do not use Skipnav as a general-purpose link or button. Use \`Link\` for normal navigation and \`Button\` for actions.

**Underlying element**: Native \`<a>\` (HTMLAnchorElement). The CSS-only implementation does not require JavaScript.

**Accessibility**: Provide meaningful link text and ensure the target element exists, has a unique \`id\`, and contains the page's primary content. Consumers are responsible for the target landmark and routing behavior.`,
      },
    },
  },
  argTypes: {
    href: {
      control: { type: 'text' },
      description:
        'Fragment or URL for the main content target. For in-page skipping, point this to the unique id of the main content landmark.',
    },
    children: {
      control: { type: 'text' },
      description:
        'Visible link text that tells users where the skip link leads.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble Skipnav class.',
    },
  },
  args: {
    href: '#main-content',
    children: 'Skip to main content',
  },
} satisfies Meta<typeof Skipnav>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    href: '#main-content-default',
    children: 'Skip to main content',
  },
}

export const CustomAttributes: Story = {
  args: {
    href: '#custom-main-content',
    children: 'Skip to the participant dashboard',
    className: 'custom-skipnav',
    id: 'custom-skipnav',
    'aria-label': 'Skip to the participant dashboard',
    'data-testid': 'custom-skipnav',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', {
      name: 'Skip to the participant dashboard',
    })

    await expect(link).toHaveClass('pathable-skipnav', 'custom-skipnav')
    await expect(link).toHaveAttribute('href', '#custom-main-content')
    await expect(link).toHaveAttribute('id', 'custom-skipnav')
  },
}

export const LongLabel: Story = {
  args: {
    href: '#long-content',
    children:
      'Skip past the navigation and go directly to the participant employment coaching progress and action plan content',
  },
}

export const Narrow: Story = {
  args: {
    href: '#narrow-main-content',
    children: 'Skip to main content',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const AccessibilityCheck: Story = {
  args: {
    href: '#accessible-main-content',
    children: 'Skip to accessible main content',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step(
      'skip link has the correct role and accessible name',
      async () => {
        const link = canvas.getByRole('link', {
          name: 'Skip to accessible main content',
        })
        await expect(link).toBeVisible()
      },
    )

    await step('skip link points to its content target', async () => {
      const link = canvas.getByRole('link', {
        name: 'Skip to accessible main content',
      })
      await expect(link).toHaveAttribute('href', '#accessible-main-content')
    })
  },
}

export const KeyboardFocus: Story = {
  args: {
    href: '#keyboard-main-content',
    children: 'Skip to keyboard content',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', {
      name: 'Skip to keyboard content',
    })

    await userEvent.tab()
    await expect(link).toHaveFocus()
  },
}

export const KeyboardActivation: Story = {
  args: {
    href: '#activated-main-content',
    children: 'Skip to activated content',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', {
      name: 'Skip to activated content',
    })

    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    await expect(link).toHaveFocus()
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
}

export const PageComposition: Story = {
  render: () => (
    <>
      <Skipnav href="#page-main-content">Skip to main content</Skipnav>
      <nav aria-label="Primary navigation">
        <a href="#sessions">Sessions</a>
        <a href="#resources">Resources</a>
      </nav>
      <main id="page-main-content">
        <h1>Participant dashboard</h1>
        <p>Review coaching sessions and agreed action plans.</p>
      </main>
    </>
  ),
}
