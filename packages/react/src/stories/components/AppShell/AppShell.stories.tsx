import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { AppShell, BottomNavItem } from '../../../components/AppShell/AppShell'
import { AppShellNavItem } from '../../../components/AppShell/AppShellNavItem'
import { Icon } from '../../../components/Icon/Icon'

/*
 * Filled artwork from the USWDS icon set (`@uswds/uswds/dist/img/usa-icons`):
 * `home`, `people`, `calendar_today` and `assessment`. `Icon` always applies
 * `.pathable-icon`, which paints with `fill: currentColor`, so stroke-only
 * artwork would render as solid shapes. The bottom navigation sizes each icon
 * through its own rules, so the stories pass no size or paint attributes.
 */

function HomeGlyph() {
  return <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
}

function PeopleGlyph() {
  return (
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  )
}

function CalendarGlyph() {
  return (
    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" />
  )
}

function ReportsGlyph() {
  return (
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
  )
}

function iconNode(glyph: React.ReactNode) {
  return <Icon>{glyph}</Icon>
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '#dashboard', active: true },
  { label: 'Participants', href: '#participants' },
  { label: 'Programs', href: '#programs' },
  { label: 'Reports', href: '#reports' },
  { label: 'Settings', href: '#settings' },
]

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    label: 'Home',
    href: '#home',
    active: true,
    icon: iconNode(<HomeGlyph />),
  },
  {
    label: 'People',
    href: '#people',
    icon: iconNode(<PeopleGlyph />),
  },
  {
    label: 'Calendar',
    href: '#calendar',
    icon: iconNode(<CalendarGlyph />),
  },
  {
    label: 'Reports',
    href: '#reports',
    icon: iconNode(<ReportsGlyph />),
  },
]

function renderSidebarNav() {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <AppShellNavItem key={item.href} href={item.href} active={item.active}>
          {item.label}
        </AppShellNavItem>
      ))}
    </>
  )
}

const meta = {
  title: 'Components/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive application shell that arranges sidebar navigation, ' +
          'mobile top bar, main content, and optional bottom navigation into a ' +
          'PathAble layout. The AppShell component wraps the ' +
          'pathable-app-shell styles contract.\n\n' +
          '**When to use**: For operational tools that need persistent desktop ' +
          'navigation with a sidebar and a compact mobile experience.\n\n' +
          '**When not to use**: For single-purpose marketing or content pages ' +
          'that do not need persistent navigation.\n\n' +
          '**Accessible naming**: The shell always renders a skip link as the ' +
          'first focusable element. Active navigation is communicated with ' +
          'aria-current="page". Use `mainProps` to configure the main landmark ' +
          'and `navigationLabel` to name navigation.\n\n' +
          '**Responsive navigation**: The default `bottom` mode preserves the ' +
          'compact, icon-based bottom navigation. The `shared` mode reuses all ' +
          'sidebar destinations across breakpoints without JavaScript.',
      },
    },
  },
  argTypes: {
    sidebarFixed: {
      control: { type: 'boolean' },
      description:
        'When true, the sidebar uses fixed positioning instead of sticky.',
    },
    contentWidth: {
      options: ['standard', 'wide'],
      control: { type: 'select' },
      description: 'Content max-width: standard (1024px) or wide (1280px).',
    },
    topBarTitle: {
      control: { type: 'text' },
      description: 'Title displayed in the mobile top bar.',
    },
    mobileNavigation: {
      options: ['bottom', 'shared'],
      control: { type: 'select' },
      description:
        'Uses compact bottomNavItems or reuses the sidebar navigation on mobile.',
    },
    navigationLabel: {
      control: { type: 'text' },
      description: 'Accessible name for the primary navigation landmark.',
    },
    skipLinkText: {
      control: { type: 'text' },
      description: 'Consumer-localizable skip-link text.',
    },
    mainProps: {
      control: { type: 'object' },
      description: 'Native attributes applied to the main landmark.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble classes.',
    },
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

// Playground
export const Playground: Story = {
  args: {
    children: <p>Main content area.</p>,
    topBarTitle: 'MyApp',
  },
}

// Desktop shell
export const DesktopShell: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      sidebarAccount={
        <span>
          <strong>J. Doe</strong>
          <br />
          Case Manager
        </span>
      }
      topBarTitle="MyApp"
    >
      <h1>Dashboard</h1>
      <p>
        Main content for the desktop application shell. The sidebar stays
        visible while this content scrolls.
      </p>
    </AppShell>
  ),
}

// Mobile shell
export const MobileShell: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      topBarTitle="MyApp"
      bottomNavItems={BOTTOM_NAV_ITEMS}
    >
      <h1>Dashboard</h1>
      <p>
        On narrow viewports the sidebar is hidden and the top bar plus bottom
        navigation are shown.
      </p>
    </AppShell>
  ),
  globals: {
    viewport: {
      value: 'mobile320',
      isRotated: false,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step(
      'each bottom navigation link renders one 20px filled icon',
      async () => {
        const bottomNav = canvas.getByRole('navigation', { name: 'Primary' })
        const links = within(bottomNav).getAllByRole('link')
        await expect(links).toHaveLength(BOTTOM_NAV_ITEMS.length)

        for (const link of links) {
          // The icons are aria-hidden, so a selector is the only way to them.
          const icons = link.querySelectorAll('.pathable-icon')
          await expect(icons).toHaveLength(1)
          const iconStyle = getComputedStyle(icons[0])

          // Black is the SVG initial fill, so a black text colour would let the
          // fill check pass even without fill: currentColor.
          await expect(iconStyle.color).not.toBe('rgb(0, 0, 0)')
          await expect(iconStyle.width).toBe('20px')
          await expect(iconStyle.height).toBe('20px')

          const shapes = icons[0].querySelectorAll('*')
          await expect(shapes.length).toBeGreaterThan(0)
          for (const shape of shapes) {
            // Filled artwork paints with the text colour and has no outline.
            const shapeStyle = getComputedStyle(shape)
            await expect(shapeStyle.fill).toBe(iconStyle.color)
            await expect(shapeStyle.stroke).toBe('none')
          }
        }
      },
    )
  },
}

// Mobile shell with one shared navigation landmark
export const SharedMobileNavigation: Story = {
  render: () => (
    <AppShell
      mainProps={{
        'aria-label': 'Dashboard workspace',
        id: 'dashboard-main',
        tabIndex: 0,
      }}
      mobileNavigation="shared"
      navigationLabel="Product"
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      skipLinkText="Skip product navigation"
      topBarTitle="PathAble"
    >
      <h1>Shared mobile navigation</h1>
      <p>
        Every desktop navigation destination remains available in one
        horizontally scrollable navigation landmark on narrow viewports.
      </p>
      {Array.from({ length: 24 }, (_, index) => (
        <p key={index}>Scrollable workspace row {index + 1}</p>
      ))}
    </AppShell>
  ),
  globals: {
    viewport: {
      value: 'mobile320',
      isRotated: false,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('one named navigation contains every destination', async () => {
      const navigation = canvas.getByRole('navigation', { name: 'Product' })
      await expect(navigation).toBeVisible()
      await expect(window.innerWidth).toBe(320)
      await expect(within(navigation).getAllByRole('link')).toHaveLength(
        NAV_ITEMS.length,
      )
      await expect(canvas.getAllByRole('navigation')).toHaveLength(1)
      const shell = canvasElement.querySelector('.pathable-app-shell')
      if (!(shell instanceof HTMLElement)) throw new Error('AppShell not found')
      await expect(shell.scrollWidth).toBeLessThanOrEqual(shell.clientWidth)
    })

    await step('main content scrolls without moving navigation', async () => {
      const navigation = canvas.getByRole('navigation', { name: 'Product' })
      const main = canvas.getByRole('main')
      const initialNavigationBounds = navigation.getBoundingClientRect()

      await expect(main.scrollHeight).toBeGreaterThan(main.clientHeight)
      main.scrollTop = main.scrollHeight
      await expect(main.scrollTop).toBeGreaterThan(0)

      const scrolledNavigationBounds = navigation.getBoundingClientRect()
      await expect(scrolledNavigationBounds.top).toBeCloseTo(
        initialNavigationBounds.top,
        0,
      )
      await expect(scrolledNavigationBounds.bottom).toBeLessThanOrEqual(
        window.innerHeight,
      )
      main.scrollTop = 0
    })

    await step('keyboard focus reaches every shared destination', async () => {
      const skipLink = canvas.getByRole('link', {
        name: 'Skip product navigation',
      })
      const navigation = canvas.getByRole('navigation', { name: 'Product' })
      const links = within(navigation).getAllByRole('link')

      await userEvent.tab()
      await expect(skipLink).toHaveFocus()

      for (const link of links) {
        await userEvent.tab()
        await expect(link).toHaveFocus()
      }
    })

    await step(
      'horizontal scrolling reveals the final destination',
      async () => {
        const navigation = canvas.getByRole('navigation', { name: 'Product' })
        const links = within(navigation).getAllByRole('link')
        navigation.scrollLeft = navigation.scrollWidth

        await waitFor(() => {
          const navigationBounds = navigation.getBoundingClientRect()
          const contentRange = document.createRange()
          contentRange.selectNodeContents(links.at(-1)!)
          const contentBounds = contentRange.getBoundingClientRect()
          expect(contentBounds.left).toBeGreaterThanOrEqual(
            navigationBounds.left - 1,
          )
          expect(contentBounds.right).toBeLessThanOrEqual(
            navigationBounds.right + 1,
          )
        })
      },
    )

    await step(
      'custom skip link targets the dashboard main landmark',
      async () => {
        await expect(
          canvas.getByRole('link', { name: 'Skip product navigation' }),
        ).toHaveAttribute('href', '#dashboard-main')
        await expect(
          canvas.getByRole('main', { name: 'Dashboard workspace' }),
        ).toHaveAttribute('tabindex', '0')
      },
    )
  },
}

// Fixed sidebar
export const FixedSidebar: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      sidebarFixed
      topBarTitle="MyApp"
    >
      <h1>Fixed Sidebar</h1>
      <p>
        The sidebar uses fixed positioning, staying in place while content
        scrolls.
      </p>
    </AppShell>
  ),
}

// Wide content
export const WideContent: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      contentWidth="wide"
      topBarTitle="MyApp"
    >
      <h1>Wide Content</h1>
      <p>
        The main content area uses the wide max-width (1280px) for data-dense
        views.
      </p>
    </AppShell>
  ),
}

// Long nav labels
export const LongNavLabels: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={
        <>
          <AppShellNavItem href="#dashboard" active>
            Dashboard and Reporting Overview
          </AppShellNavItem>
          <AppShellNavItem href="#participants">
            Participant Case Management Records
          </AppShellNavItem>
          <AppShellNavItem href="#programs">
            Employment Coaching Programs
          </AppShellNavItem>
          <AppShellNavItem href="#reports">
            Quarterly Outcomes and Metrics
          </AppShellNavItem>
        </>
      }
      topBarTitle="MyApp"
    >
      <h1>Long Navigation Labels</h1>
      <p>Navigation items wrap without overflowing the sidebar boundary.</p>
    </AppShell>
  ),
}

// Narrow viewport
export const NarrowViewport: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      topBarTitle="PathAble"
      bottomNavItems={BOTTOM_NAV_ITEMS}
    >
      <h1>Mobile View</h1>
      <p>All mobile regions are visible at 375px.</p>
    </AppShell>
  ),
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false,
    },
  },
}

// OperationalDashboard composition
export const OperationalDashboard: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      sidebarAccount={
        <span>
          <strong>J. Doe</strong>
          <br />
          Case Manager
        </span>
      }
      notification={
        <span>System maintenance scheduled for Sunday 2:00 AM.</span>
      }
      topBarTitle="PathAble"
      bottomNavItems={BOTTOM_NAV_ITEMS}
    >
      <h1>Operational Dashboard</h1>
      <p>
        A realistic dashboard composition using the AppShell with sidebar
        navigation, a notification banner, and main content.
      </p>
      <div className="pathable-cluster pathable-cluster--gap-md">
        <div
          style={{
            border: '1px solid var(--pathable-color-border)',
            borderRadius: 8,
            padding: '1rem',
          }}
        >
          <strong>Active Participants</strong>
          <p>24</p>
        </div>
        <div
          style={{
            border: '1px solid var(--pathable-color-border)',
            borderRadius: 8,
            padding: '1rem',
          }}
        >
          <strong>Open Programs</strong>
          <p>8</p>
        </div>
        <div
          style={{
            border: '1px solid var(--pathable-color-border)',
            borderRadius: 8,
            padding: '1rem',
          }}
        >
          <strong>Reports Due</strong>
          <p>3</p>
        </div>
      </div>
    </AppShell>
  ),
}

// Interaction test: Skip link activation
export const SkipLinkActivation: Story = {
  render: () => (
    <AppShell
      mainProps={{ tabIndex: -1 }}
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      topBarTitle="MyApp"
    >
      <h1>Dashboard</h1>
      <p>Press Tab to reveal the skip link.</p>
    </AppShell>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('skip link is the first focusable element', async () => {
      const skipLink = canvas.getByRole('link', {
        name: 'Skip to main content',
      })
      await userEvent.tab()
      await expect(skipLink).toHaveFocus()
      await expect(skipLink).toHaveAttribute('href', '#main-content')
      await userEvent.keyboard('{Enter}')
      await expect(canvas.getByRole('main')).toHaveFocus()
    })
  },
}

// Interaction test: Active nav item focus
export const ActiveNavItemFocus: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      topBarTitle="MyApp"
    >
      <h1>Dashboard</h1>
    </AppShell>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step(
      'active nav item has aria-current and active class',
      async () => {
        const activeItem = canvas.getByRole('link', { name: 'Dashboard' })
        await expect(activeItem).toHaveAttribute('aria-current', 'page')
        await expect(activeItem.className).toContain(
          'pathable-app-shell__nav-item--active',
        )
        await userEvent.tab()
        await userEvent.tab()
        await expect(activeItem).toHaveFocus()
        await expect(getComputedStyle(activeItem).outlineStyle).not.toBe('none')
      },
    )

    await step('inactive nav item has no active marker', async () => {
      const inactiveItem = canvas.getByRole('link', { name: 'Participants' })
      await expect(inactiveItem).not.toHaveAttribute('aria-current')
      await expect(inactiveItem.className).not.toContain(
        'pathable-app-shell__nav-item--active',
      )
    })
  },
}

// Interaction test: Responsive layout switch
export const ResponsiveLayoutSwitch: Story = {
  render: () => (
    <AppShell
      sidebarBrand={<strong>PathAble</strong>}
      sidebarNav={renderSidebarNav()}
      topBarTitle="PathAble"
      bottomNavItems={BOTTOM_NAV_ITEMS}
    >
      <h1>Mobile View</h1>
    </AppShell>
  ),
  globals: {
    viewport: {
      value: 'mobile320',
      isRotated: false,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('top bar title is present on mobile', async () => {
      const topBar = canvas.getByRole('banner')
      await expect(topBar).toBeVisible()
      await expect(within(topBar).getByText('PathAble')).toBeInTheDocument()
      const sidebar = canvasElement.querySelector(
        '.pathable-app-shell__sidebar',
      )
      if (!(sidebar instanceof HTMLElement))
        throw new Error('Sidebar not found')
      await expect(sidebar).not.toBeVisible()
    })

    await step(
      'bottom navigation is present with active destination',
      async () => {
        const bottomNav = canvas.getAllByRole('navigation').find((navigation) =>
          within(navigation).queryByRole('link', {
            name: /Home/,
          }),
        )

        if (!bottomNav) {
          throw new Error('Mobile bottom navigation was not rendered')
        }

        await expect(bottomNav).toBeInTheDocument()
        await expect(bottomNav).toBeVisible()
        const activeItem = within(bottomNav).getByRole('link', {
          name: /Home/,
        })
        await expect(activeItem).toHaveAttribute('aria-current', 'page')
      },
    )
  },
}

export const ResponsiveDesktopLayout: Story = {
  ...ResponsiveLayoutSwitch,
  globals: {
    viewport: {
      value: 'desktop',
      isRotated: false,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('desktop exposes the sidebar navigation only', async () => {
      const sidebar = canvasElement.querySelector(
        '.pathable-app-shell__sidebar',
      )
      const topBar = canvasElement.querySelector('.pathable-app-shell__topbar')
      const bottomNav = canvasElement.querySelector(
        '.pathable-bottom-navigation',
      )
      if (!(sidebar instanceof HTMLElement))
        throw new Error('Sidebar not found')
      if (!(topBar instanceof HTMLElement)) throw new Error('Top bar not found')
      if (!(bottomNav instanceof HTMLElement)) {
        throw new Error('Bottom navigation not found')
      }

      await expect(sidebar).toBeVisible()
      await expect(topBar).not.toBeVisible()
      await expect(bottomNav).not.toBeVisible()
      await expect(canvas.getAllByRole('navigation')).toHaveLength(1)
    })
  },
}
