import { Breadcrumb } from '../../../components/Breadcrumb/Breadcrumb'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'

const defaultItems = [
  { content: 'Home', href: '#home', key: 'home' },
  { content: 'Participants', href: '#participants', key: 'participants' },
  {
    content: 'Coaching notes',
    current: true,
    key: 'coaching-notes',
  },
]

const meta = {
  title: 'Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A navigation landmark that shows a user's location within a site hierarchy. Breadcrumb renders a semantic \`<nav>\` containing an ordered list and maps item links and the current page to the PathAble breadcrumb classes.

**When to use**: For hierarchical navigation where users may need to move back to a parent page or understand their current location. Use concise labels and mark exactly one current page.

**When not to use**: Do not use Breadcrumb as the primary site navigation, a progress indicator, or a replacement for a page heading. Omit it when the page has no meaningful hierarchy.

**Underlying elements**: \`<nav>\`, \`<ol>\`, \`<li>\`, and optional \`<a>\` links.

**Known constraints**: Breadcrumb owns the semantic list structure and PathAble nested classes. Consumers provide item content, destinations, and current-page meaning. Items without an \`href\` render as text; current items render as text with \`aria-current=\"page\"\`.`,
      },
    },
  },
  argTypes: {
    items: {
      control: 'none',
      description:
        'Breadcrumb records containing content, optional href values, and one current item. Use attributes for item-level metadata and linkAttributes for native link behavior.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble breadcrumb class.',
    },
    'aria-label': {
      control: { type: 'text' },
      description:
        'Accessible name for the breadcrumb navigation landmark. Use a concise label such as Breadcrumbs.',
    },
  },
  args: {
    'aria-label': 'Breadcrumbs',
    items: defaultItems,
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    items: defaultItems,
  },
}

export const CurrentPage: Story = {
  args: {
    items: [
      { content: 'Home', href: '#home', key: 'home' },
      { content: 'Resources', href: '#resources', key: 'resources' },
      {
        content: 'Employment coaching guide',
        current: true,
        key: 'guide',
      },
    ],
  },
}

export const RichContent: Story = {
  args: {
    items: [
      { content: 'Home', href: '#home', key: 'home' },
      {
        content: (
          <>
            Employment <strong>resources</strong>
          </>
        ),
        href: '#resources',
        key: 'resources',
      },
      {
        content: <em>Resume workshop</em>,
        current: true,
        key: 'workshop',
      },
    ],
  },
}

export const CustomAttributes: Story = {
  args: {
    className: 'custom-breadcrumb',
    items: [
      {
        content: 'Home',
        href: '#home',
        key: 'home',
        className: 'home-item',
        attributes: { 'data-testid': 'home-item' },
        linkClassName: 'home-link',
        linkAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      },
      {
        content: 'Current page',
        current: true,
        key: 'current',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const navigation = canvas.getByRole('navigation', { name: 'Breadcrumbs' })
    const homeLink = canvas.getByRole('link', { name: 'Home' })

    await expect(navigation).toHaveClass(
      'pathable-breadcrumb',
      'custom-breadcrumb',
    )
    await expect(homeLink).toHaveClass('pathable-breadcrumb__link', 'home-link')
    await expect(homeLink).toHaveAttribute('target', '_blank')
  },
}

export const Empty: Story = {
  args: {
    items: [],
  },
}

export const LongLabels: Story = {
  args: {
    items: [
      {
        content: 'Home',
        href: '#home',
        key: 'home',
      },
      {
        content:
          'Employment coaching resources and workplace readiness materials',
        href: '#resources',
        key: 'resources',
      },
      {
        content:
          'Preparing for a successful interview and follow-up conversation',
        current: true,
        key: 'interview',
      },
    ],
  },
}

export const Narrow: Story = {
  args: {
    items: [
      { content: 'Home', href: '#home', key: 'home' },
      { content: 'Resources', href: '#resources', key: 'resources' },
      { content: 'Current guide', current: true, key: 'guide' },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const AccessibilityCheck: Story = {
  args: {
    items: [
      { content: 'Home', href: '#home', key: 'home' },
      { content: 'Accessible page', current: true, key: 'accessible' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const navigation = canvas.getByRole('navigation', { name: 'Breadcrumbs' })
    const items = canvas.getAllByRole('listitem')
    const current = canvas.getByText('Accessible page')

    await expect(navigation).toBeVisible()
    await expect(items).toHaveLength(2)
    await expect(current).toHaveAttribute('aria-current', 'page')
  },
}

export const KeyboardFocus: Story = {
  args: {
    items: [
      { content: 'Home', href: '#home', key: 'home' },
      { content: 'Current page', current: true, key: 'current' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const homeLink = canvas.getByRole('link', { name: 'Home' })

    await userEvent.tab()
    await expect(homeLink).toHaveFocus()
  },
}

export const PageHeaderComposition: Story = {
  render: () => (
    <header>
      <Breadcrumb
        aria-label="Page location"
        items={[
          { content: 'Home', href: '#home', key: 'home' },
          { content: 'Participant resources', current: true, key: 'resources' },
        ]}
      />
      <h1>Participant resources</h1>
      <p>Find coaching materials and prepare for your next session.</p>
    </header>
  ),
}
