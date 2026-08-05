import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'

import { Sidenav, type SidenavItem } from '../../../components/Sidenav/Sidenav'

const flatItems: readonly SidenavItem[] = [
  { id: 'sessions', content: "Today's sessions", href: '#sessions' },
  { id: 'participants', content: 'Participants', href: '#participants' },
  { id: 'reports', content: 'Reports', href: '#reports' },
]

const nestedItems: readonly SidenavItem[] = [
  { id: 'overview', content: 'Overview', href: '#overview' },
  {
    id: 'participants',
    content: 'Participants',
    href: '#participants',
    children: [
      { id: 'all-participants', content: 'All participants', href: '#all' },
      { id: 'add-participant', content: 'Add participant', href: '#add' },
    ],
  },
  { id: 'settings', content: 'Settings', href: '#settings' },
]

const meta = {
  title: 'Components/Navigation/Sidenav',
  component: Sidenav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A side-navigation landmark for persistent application or section navigation. Sidenav renders a semantic \`<aside>\` with recursive lists and native anchors using the existing PathAble Sidenav classes.

**When to use**: For a stable hierarchy of destinations beside application content. Supply an accessible name and derive \`currentId\` from the application's routing state.

**When not to use**: Do not use Sidenav for disclosure menus, client-side routing, or content that needs wrapper-owned expansion state. The component never intercepts navigation or owns active state.

**Underlying elements**: \`<aside>\`, \`<ul>\`, \`<li>\`, native \`<a>\` links, and text for records without \`href\`.

**Known constraints**: Item IDs should be stable and unique. If duplicate IDs are supplied, only the first depth-first match receives current-page semantics. Unknown or omitted current IDs mark nothing current.`,
      },
    },
  },
  argTypes: {
    items: {
      control: 'none',
      description:
        'Immutable recursive navigation records. Records may forward list-item, anchor, and child-list attributes.',
    },
    currentId: {
      control: { type: 'text' },
      description:
        'ID derived from consumer routing state. The first matching record receives current-page semantics.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional class names appended to the Sidenav root.',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessible name for the complementary navigation landmark.',
    },
  },
  args: {
    'aria-label': 'Participant navigation',
    items: nestedItems,
    currentId: 'all-participants',
  },
} satisfies Meta<typeof Sidenav>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Flat: Story = {
  args: { items: flatItems, currentId: 'sessions' },
}

export const Nested: Story = {
  args: { items: nestedItems, currentId: 'add-participant' },
}

export const CurrentItem: Story = {
  args: { items: nestedItems, currentId: 'all-participants' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('link', { name: 'All participants', current: 'page' }),
    ).toHaveClass('pathable-current')
  },
}

export const NoCurrentItem: Story = {
  args: { items: nestedItems, currentId: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link', { current: 'page' })).toBeNull()
  },
}

export const UnknownCurrentId: Story = {
  args: { items: nestedItems, currentId: 'missing-page' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('link', { current: 'page' })).toBeNull()
  },
}

export const DuplicateCurrentIds: Story = {
  args: {
    currentId: 'duplicate',
    items: [
      { id: 'duplicate', content: 'First match', href: '#first' },
      {
        id: 'group',
        content: 'Group',
        children: [{ id: 'duplicate', content: 'Later match', href: '#later' }],
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const currentLinks = canvas.getAllByRole('link', { current: 'page' })
    await expect(currentLinks).toHaveLength(1)
    await expect(currentLinks[0]).toHaveAccessibleName('First match')
  },
}

export const TextWithoutHref: Story = {
  args: {
    currentId: 'participants',
    items: [
      {
        id: 'participants',
        content: 'Participants',
        children: [
          { id: 'all-participants', content: 'All participants', href: '#all' },
        ],
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const section = canvas.getByText('Participants')
    await expect(
      canvas.queryByRole('link', { name: 'Participants' }),
    ).toBeNull()
    await expect(section).toHaveAttribute('aria-current', 'page')
  },
}

export const LongLabels: Story = {
  args: {
    currentId: 'plan',
    items: [
      {
        id: 'resources',
        content:
          'Employment coaching resources and workplace readiness materials',
        href: '#resources',
      },
      {
        id: 'plan',
        content:
          'Individual employment plan review and participant follow-up actions',
        href: '#plan',
      },
    ],
  },
}

export const Narrow: Story = {
  args: { items: nestedItems, currentId: 'add-participant' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const CustomAttributes: Story = {
  args: {
    className: 'application-sidenav',
    currentId: 'all-participants',
    items: [
      {
        id: 'participants',
        content: 'Participants',
        attributes: { 'data-level': 'primary' },
        children: [
          {
            id: 'all-participants',
            content: 'All participants',
            href: '#all',
            linkClassName: 'participant-link',
            linkAttributes: { rel: 'bookmark' },
          },
        ],
        listClassName: 'participant-tools',
        listAttributes: { 'aria-label': 'Participant tools' },
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const navigation = canvas.getByRole('complementary', {
      name: 'Participant navigation',
    })
    const link = canvas.getByRole('link', { name: 'All participants' })
    await expect(navigation).toHaveClass(
      'pathable-sidenav',
      'application-sidenav',
    )
    await expect(
      canvas.getByRole('list', { name: 'Participant tools' }),
    ).toHaveClass('pathable-sidenav__sublist', 'participant-tools')
    await expect(link).toHaveClass('pathable-current', 'participant-link')
    await expect(link).toHaveAttribute('rel', 'bookmark')
  },
}

export const KeyboardTraversal: Story = {
  args: { items: nestedItems, currentId: 'all-participants' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const links = canvas.getAllByRole('link')

    await step('links follow native depth-first tab order', async () => {
      for (const link of links) {
        await userEvent.tab()
        await expect(link).toHaveFocus()
      }
    })
  },
}

export const ApplicationNavigation: Story = {
  render: () => (
    <div className="pathable-display-flex pathable-flex-align-start">
      <Sidenav
        aria-label="Application navigation"
        items={nestedItems}
        currentId="overview"
      />
      <main id="application-content" className="pathable-margin-x-4">
        <h1>Participant overview</h1>
        <p>Review current sessions, goals, and follow-up actions.</p>
      </main>
    </div>
  ),
}
