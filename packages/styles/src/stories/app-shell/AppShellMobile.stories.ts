import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Application Shell/Mobile Shell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.\n\nMobile application shell with compact top bar, scrollable main content, and optional bottom navigation (up to 5 destinations). Shows the mobile viewport variant of the app shell.',
      },
    },
  },
}

const bottomNavItems = [
  { label: 'Home', href: '#', icon: 'home', active: true },
  { label: 'Tasks', href: '#', icon: 'tasks', active: false },
  { label: 'Reports', href: '#', icon: 'reports', active: false },
  { label: 'Settings', href: '#', icon: 'settings', active: false },
]

const topbar = () => `
  <header class="pathable-app-shell__topbar">
    <span class="pathable-app-shell__topbar-title">MyApp</span>
  </header>
`

const bottomNav = () => `
  <nav class="pathable-bottom-navigation" aria-label="Primary">
    ${bottomNavItems
      .map(
        (item) => `
      <a href="${item.href}" class="pathable-bottom-navigation__item${item.active ? ' pathable-bottom-navigation__item--active' : ''}" ${item.active ? 'aria-current="page"' : ''}>
        <svg class="pathable-icon" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="11" y="2" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="2" y="11" width="7" height="7" rx="1" fill="currentColor"/>
          <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor"/>
        </svg>
        <span>${item.label}</span>
      </a>`,
      )
      .join('')}
  </nav>
`

const sharedNavigation = () => `
  <aside class="pathable-app-shell__sidebar">
    <nav class="pathable-app-shell__nav" aria-label="Product">
      ${[
        'Dashboard',
        'Participants',
        'Programs',
        'Reports',
        'Resources',
        'Settings',
      ]
        .map(
          (label, index) => `
        <a href="#${label.toLowerCase()}" class="pathable-app-shell__nav-item${index === 0 ? ' pathable-app-shell__nav-item--active' : ''}" ${index === 0 ? 'aria-current="page"' : ''}>${label}</a>`,
        )
        .join('')}
    </nav>
  </aside>
`

const mainContent = () => `
  <main id="main-content" class="pathable-app-shell__content" tabindex="0">
    <h2 style="margin: 0 0 1rem; font-size: 1.125rem; font-weight: 600;">Home</h2>
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
          Mobile shell with top bar and bottom navigation. The bottom nav supports
          up to five primary destinations with icon and label pairs.
        </p>
      </div>
      <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
          Safe-area padding is applied to the bottom navigation for devices with
          home indicators.
        </p>
      </div>
      <div class="pathable-surface pathable-surface--raised" style="padding: 1rem;">
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
          Content scrolls between the top bar and bottom navigation without being
          obscured by either.
        </p>
      </div>
    </div>
  </main>
`

const longMainContent = () => `
  <main id="main-content" class="pathable-app-shell__content" tabindex="0">
    <h2 style="margin: 0 0 1rem; font-size: 1.125rem; font-weight: 600;">Scrollable workspace</h2>
    ${Array.from(
      { length: 24 },
      (_, index) =>
        `<p style="margin: 0 0 0.75rem;">Workspace row ${index + 1}</p>`,
    ).join('')}
  </main>
`

export const Default = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => `
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Mobile shell with top bar and bottom navigation. Use the viewport resize handles to see the mobile layout (below 1024px).
    </p>
    <div class="pathable-app-shell">
      ${topbar()}
      ${mainContent()}
      ${bottomNav()}
    </div>
  `,
}

export const SharedNavigation = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'The `pathable-app-shell--shared-navigation` modifier keeps one named navigation landmark and every destination available across breakpoints. At narrow widths, the destination row scrolls horizontally without JavaScript.',
      },
    },
  },
  render: () => `
    <div class="pathable-app-shell pathable-app-shell--shared-navigation">
      <a class="pathable-skipnav" href="#main-content">Skip to main content</a>
      ${sharedNavigation()}
      ${topbar()}
      ${longMainContent()}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const shell = canvasElement.querySelector('.pathable-app-shell')
    if (!(shell instanceof HTMLElement)) throw new Error('AppShell not found')
    const navigation = canvas.getByRole('navigation', { name: 'Product' })
    const main = canvas.getByRole('main')
    const initialNavigationBounds = navigation.getBoundingClientRect()

    await expect(window.innerWidth).toBe(320)
    await expect(canvas.getAllByRole('navigation')).toHaveLength(1)
    await expect(shell.scrollWidth).toBeLessThanOrEqual(shell.clientWidth)
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
    await userEvent.tab()
    await expect(
      canvas.getByRole('link', { name: 'Skip to main content' }),
    ).toHaveFocus()
  },
}

export const LegacyActiveColorOverride = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  render: () => `
    <div
      class="pathable-app-shell"
      style="--pathable-bottom-navigation-bg: #00365c; --pathable-bottom-navigation-active-color: #fff; --pathable-color-text-muted: #d9e8f0;"
    >
      ${topbar()}
      ${mainContent()}
      ${bottomNav()}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const activeItem = canvasElement.querySelector(
      '.pathable-bottom-navigation__item--active',
    )
    if (!(activeItem instanceof HTMLElement)) {
      throw new Error('Active bottom-navigation item not found')
    }

    await expect(window.innerWidth).toBe(320)
    await expect(getComputedStyle(activeItem).color).toBe('rgb(255, 255, 255)')
  },
}
