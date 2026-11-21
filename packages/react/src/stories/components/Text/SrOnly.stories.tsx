import type { Meta, StoryObj } from '@storybook/react'
import { useId } from 'react'
import { expect, within } from 'storybook/test'

import { SrOnly } from '../../../components/SrOnly/SrOnly'

const inlineExample = (
  <a href="/participants/42/edit">
    Edit<SrOnly> Jordan Lee&apos;s profile</SrOnly>
  </a>
)

function UpcomingSessions() {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId}>
      <SrOnly as="h2" id={titleId}>
        Upcoming sessions
      </SrOnly>
      <p>Three sessions are booked for this week.</p>
    </section>
  )
}

const headingExample = <UpcomingSessions />

const meta = {
  title: 'Components/SrOnly',
  component: SrOnly,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Text that is hidden visually but still read by screen readers. It renders a \`<span>\` with the \`.pathable-sr-only\` class.

**When to use**: Add context sighted users get from the layout, such as the row name after several "Edit" links, status text beside an indicator that is hidden from assistive technology, or a heading for a region whose purpose is obvious visually (\`as="h2"\` to \`as="h6"\`).

**When not to use**: Do not hide content from everyone (use the \`hidden\` attribute), and do not put focusable content inside: it stays hidden when focused. Use \`Skipnav\` for a skip link. When sighted users would also benefit from the text, show it with \`Label\` or \`Hint\`.

**Underlying element**: \`<span>\` by default. \`as\` accepts only non-focusable text elements: \`span\`, \`p\` and \`h2\` to \`h6\`.

**Writing**: Start hidden text with a space when it continues a visible phrase, so screen readers do not run the words together.`,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description:
        'The hidden text. Keep it short and consistent with what the page shows.',
    },
    as: {
      control: { type: 'select' },
      options: ['span', 'p', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description:
        'The element to render. Use a heading level to name a region whose purpose is clear visually; use `span` inside a phrase.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble sr-only class.',
    },
  },
  args: {
    children: 'Hidden text for screen readers',
  },
} satisfies Meta<typeof SrOnly>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  render: (args) => (
    <p>
      Visible text
      <SrOnly {...args} />
    </p>
  ),
  args: {
    children: ' with more context for screen readers',
  },
  play: async ({ canvasElement }) => {
    const hidden = within(canvasElement).getByText(
      'with more context for screen readers',
    )
    await expect(hidden.tagName).toBe('SPAN')
    await expect(hidden).toHaveClass('pathable-sr-only')
    const box = hidden.getBoundingClientRect()
    await expect(box.width).toBeLessThanOrEqual(1)
    await expect(box.height).toBeLessThanOrEqual(1)
  },
}

export const InLink: Story = {
  render: () => inlineExample,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: "Edit Jordan Lee's profile" }),
    ).toBeInTheDocument()
  },
}

export const RegionHeading: Story = {
  render: () => headingExample,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', {
      level: 2,
      name: 'Upcoming sessions',
    })
    await expect(heading).toHaveClass('pathable-sr-only')
    await expect(
      canvas.getByRole('region', { name: 'Upcoming sessions' }),
    ).toBeInTheDocument()
  },
}

export const RowActions: Story = {
  render: () => (
    <table className="pathable-table">
      <caption>Participants</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {['Jordan Lee', 'Sam Rivera', 'Alex Kim'].map((name) => (
          <tr key={name}>
            <td>{name}</td>
            <td>
              <a href={`#edit-${name.toLowerCase().replace(' ', '-')}`}>
                Edit<SrOnly> {name}&apos;s profile</SrOnly>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    for (const name of ['Jordan Lee', 'Sam Rivera', 'Alex Kim']) {
      await expect(
        canvas.getByRole('link', { name: `Edit ${name}'s profile` }),
      ).toBeInTheDocument()
    }
  },
}

export const LongContent: Story = {
  render: () => (
    <p>
      Report
      <SrOnly>
        {' '}
        for the participant employment coaching progress, action plan and
        appointment history over the last twelve months
      </SrOnly>
    </p>
  ),
  play: async ({ canvasElement }) => {
    const hidden = within(canvasElement).getByText(
      /for the participant employment coaching progress/u,
    )
    await expect(hidden).toHaveClass('pathable-sr-only')
  },
}

export const Narrow: Story = {
  render: () => inlineExample,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
