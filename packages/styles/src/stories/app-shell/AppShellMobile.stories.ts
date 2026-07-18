export default {
  title: 'Application Shell/Mobile Shell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nMobile application shell with compact top bar, scrollable main content, and optional bottom navigation (up to 5 destinations). Shows the mobile viewport variant of the app shell.',
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

const mainContent = () => `
  <main id="main-content" class="pathable-app-shell__content">
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
