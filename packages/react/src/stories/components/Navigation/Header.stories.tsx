import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'

import { Header, type HeaderNavItem } from '../../../components/Header/Header'

const defaultItems = [
  {
    id: 'participants',
    content: 'Participants',
    href: '#participants',
  },
  {
    id: 'sessions',
    content: 'Coaching sessions',
    href: '#sessions',
  },
  {
    id: 'resources',
    content: 'Resources',
    href: '#resources',
  },
] satisfies readonly HeaderNavItem[]

const meta = {
  title: 'Components/Navigation/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A basic site header that orients users and exposes primary navigation. Header renders the PathAble and USWDS class hierarchy required by the installed USWDS mobile-navigation JavaScript.

**When to use**: For a site or application shell with a brand link and one level of primary navigation.

**When not to use**: Do not use Header for page-level headings, secondary navigation, dropdown menus, or unimplemented extended and megamenu variants.

**Underlying elements**: A semantic \`<header>\` containing a native brand link, menu and close buttons, and a labeled \`<nav>\` list.

**JavaScript requirement**: Import \`@pathable/styles/js\` once at the application boundary to enable the mobile open, focus, Escape, and close behavior. Header does not import JavaScript or own open state.

**Static fallback**: Without JavaScript, the brand and navigation remain native links in a labeled navigation landmark. Consumers own destinations, routing, and link callbacks.`,
      },
    },
  },
  argTypes: {
    brand: {
      control: { type: 'text' },
      description: 'Visible brand content inside the home link.',
    },
    brandHref: {
      control: { type: 'text' },
      description: 'Consumer-owned destination for the brand link.',
    },
    items: {
      control: 'object',
      description:
        'Immutable primary-navigation records with stable ids, content, destinations, and optional native anchor attributes.',
    },
    menuLabel: {
      control: { type: 'text' },
      description: 'Visible label for the mobile menu button.',
    },
    closeLabel: {
      control: { type: 'text' },
      description: 'Accessible name for the icon-only mobile close button.',
    },
    navigationLabel: {
      control: { type: 'text' },
      description: 'Accessible name for the primary navigation landmark.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional class names appended to the header root.',
    },
  },
  args: {
    brand: 'PathAble',
    brandHref: '#home',
    items: defaultItems,
    menuLabel: 'Menu',
    closeLabel: 'Close navigation',
    navigationLabel: 'Primary navigation',
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    brand: 'PathAble',
    brandHref: '#home',
    items: defaultItems,
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const MobileMenuInteraction: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const brandLink = canvas.getByRole('link', { name: 'PathAble' })
    const menuButton = canvas.getByText('Menu')
    const navigation = canvas.getByRole('navigation', {
      name: 'Primary navigation',
    })

    if (menuButton.getBoundingClientRect().width === 0) {
      await expect(navigation).toBeVisible()
      return
    }

    await step(
      'keyboard activation opens the real USWDS mobile menu',
      async () => {
        await userEvent.tab()
        await expect(brandLink).toHaveFocus()
        await userEvent.tab()
        await expect(menuButton).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        await expect(navigation).toHaveClass('is-visible')
      },
    )

    await step('USWDS moves focus to the close control', async () => {
      const closeButton = canvas.getByRole('button', {
        name: 'Close navigation',
      })
      await expect(closeButton).toHaveFocus()
    })

    await step('close restores focus to the visible menu control', async () => {
      const closeButton = canvas.getByRole('button', {
        name: 'Close navigation',
      })
      await userEvent.click(closeButton)
      await expect(navigation).not.toHaveClass('is-visible')
      await expect(menuButton).toHaveFocus()
    })
  },
}

export const DesktopNavigation: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const navigation = canvas.getByRole('navigation', {
      name: 'Primary navigation',
    })
    const firstLink = canvas.getByRole('link', { name: 'Participants' })

    await expect(navigation).toBeVisible()
    await userEvent.tab()
    await expect(canvas.getByRole('link', { name: 'PathAble' })).toHaveFocus()
    await userEvent.tab()
    await expect(firstLink).toHaveFocus()
  },
}

export const LongBrandAndLabels: Story = {
  args: {
    brand: 'PathAble Employment Coaching and Community Resource Network',
    items: [
      {
        id: 'participant-planning',
        content: 'Participant planning and progress records',
        href: '#participant-planning',
      },
      {
        id: 'community-resources',
        content: 'Community employment resources and support services',
        href: '#community-resources',
      },
    ],
  },
}

export const CustomAttributes: Story = {
  args: {
    id: 'application-header',
    className: 'consumer-header',
    'data-region': 'global-navigation',
    items: [
      {
        id: 'external-resource',
        content: 'External resource',
        href: 'https://example.com/resource',
        attributes: {
          className: 'consumer-nav-link',
          rel: 'noopener noreferrer',
          target: '_blank',
          'data-destination': 'resource-library',
        },
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const banner = canvas.getByRole('banner')
    const link = canvas.getByRole('link', { name: 'External resource' })

    await expect(banner).toHaveClass(
      'pathable-header',
      'usa-header',
      'consumer-header',
    )
    await expect(banner).toHaveAttribute('data-region', 'global-navigation')
    await expect(link).toHaveClass('usa-nav__link', 'consumer-nav-link')
    await expect(link).toHaveAttribute('target', '_blank')
  },
}

export const StaticFallback: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('banner')).toBeVisible()
    await expect(
      canvas.getByRole('navigation', { name: 'Primary navigation' }),
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('link', { name: 'PathAble' }),
    ).toHaveAttribute('href', '#home')
    await expect(canvas.getAllByRole('link')).toHaveLength(4)
  },
}

export const ApplicationShellComposition: Story = {
  render: () => (
    <>
      <Header
        brand="PathAble"
        brandHref="#dashboard"
        items={defaultItems}
        navigationLabel="Application navigation"
      />
      <main id="dashboard">
        <h1>Participant dashboard</h1>
        <p>Review coaching sessions and employment resources.</p>
      </main>
    </>
  ),
}
