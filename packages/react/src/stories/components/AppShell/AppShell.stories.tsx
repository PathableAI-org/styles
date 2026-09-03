import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'

import { AppShell, BottomNavItem } from '../../../components/AppShell/AppShell'
import { AppShellNavItem } from '../../../components/AppShell/AppShellNavItem'
import { Icon } from '../../../components/Icon/Icon'

function DashboardGlyph() {
  return (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  )
}

function PeopleGlyph() {
  return (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 5.5a3 3 0 0 1 0 5.5" />
      <path d="M18 14c2.5.6 4 2.4 4 5" />
    </>
  )
}

function CalendarGlyph() {
  return (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </>
  )
}

function ChartGlyph() {
  return (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
    </>
  )
}

function iconNode(glyph: React.ReactNode, size = 20) {
  return (
    <Icon
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyph}
    </Icon>
  )
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
    icon: iconNode(<DashboardGlyph />),
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
    icon: iconNode(<ChartGlyph />),
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
      value: 'mobile1',
      isRotated: false,
    },
  },
}

// Mobile shell with one shared navigation landmark
export const SharedMobileNavigation: Story = {
  render: () => (
    <AppShell
      mainProps={{
        'aria-label': 'Dashboard workspace',
        id: 'dashboard-main',
        tabIndex: -1,
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
    </AppShell>
  ),
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('one named navigation contains every destination', async () => {
      const navigation = canvas.getByRole('navigation', { name: 'Product' })
      await expect(navigation).toBeVisible()
      await expect(within(navigation).getAllByRole('link')).toHaveLength(
        NAV_ITEMS.length,
      )
      await expect(canvas.getAllByRole('navigation')).toHaveLength(1)
    })

    await step(
      'custom skip link targets the dashboard main landmark',
      async () => {
        await expect(
          canvas.getByRole('link', { name: 'Skip product navigation' }),
        ).toHaveAttribute('href', '#dashboard-main')
        await expect(
          canvas.getByRole('main', { name: 'Dashboard workspace' }),
        ).toHaveAttribute('tabindex', '-1')
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
      value: 'mobile1',
      isRotated: false,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('top bar title is present on mobile', async () => {
      const topBar = canvas.getByRole('banner', { hidden: true })
      await expect(within(topBar).getByText('PathAble')).toBeInTheDocument()
    })

    await step(
      'bottom navigation is present with active destination',
      async () => {
        const bottomNav = canvas
          .getAllByRole('navigation', { hidden: true })
          .find((navigation) =>
            within(navigation).queryByRole('link', {
              name: /Home/,
              hidden: true,
            }),
          )

        if (!bottomNav) {
          throw new Error('Mobile bottom navigation was not rendered')
        }

        await expect(bottomNav).toBeInTheDocument()
        const activeItem = within(bottomNav).getByRole('link', {
          name: /Home/,
          hidden: true,
        })
        await expect(activeItem).toHaveAttribute('aria-current', 'page')
      },
    )
  },
}
