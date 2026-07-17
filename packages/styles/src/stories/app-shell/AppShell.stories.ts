export default {
  title: 'Application Shell/Desktop Shell',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nDesktop application shell with persistent sidebar containing brand, primary navigation, and account context. Active navigation items are differentiated using color + weight + inset border marker.',
      },
    },
  },
}

const navItems = [
  { label: 'Dashboard', href: '#', active: true },
  { label: 'Tasks', href: '#', active: false },
  { label: 'Reports', href: '#', active: false },
  { label: 'Settings', href: '#', active: false },
]

const sidebar = () => `
  <aside class="pathable-app-shell__sidebar">
    <div class="pathable-app-shell__brand" style="padding: 0.5rem 0;">
      <strong style="font-size: 1.125rem; color: var(--pathable-color-accent, #00365c);">MyApp</strong>
    </div>
    <nav class="pathable-app-shell__nav">
      ${navItems
        .map(
          (item) => `
        <a href="${item.href}" class="pathable-app-shell__nav-item${item.active ? ' pathable-app-shell__nav-item--active' : ''}" ${item.active ? 'aria-current="page"' : ''}>
          ${item.label}
        </a>`,
        )
        .join('')}
    </nav>
    <div class="pathable-app-shell__account" style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--pathable-color-border);">
      <span style="font-size: 0.875rem; color: var(--pathable-color-text-muted, #666);">Signed in as <strong>jane@example.com</strong></span>
    </div>
  </aside>
`

const topbar = () => `
  <header class="pathable-app-shell__topbar">
    <span class="pathable-app-shell__topbar-title">MyApp</span>
  </header>
`

const mainContent = () => `
  <main id="main-content" class="pathable-app-shell__content pathable-app-shell__content--standard">
    <h2 style="margin: 0 0 1rem; font-size: 1.25rem; font-weight: 600;">Dashboard</h2>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
        <h3 style="margin: 0 0 0.75rem; font-size: 1rem; font-weight: 600;">Welcome back, Jane!</h3>
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
          This is the main content area. The sidebar on the left provides persistent
          navigation across all pages. On mobile devices (resize below 1024px), the
          sidebar is replaced by a compact top bar.
        </p>
      </div>
      <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
        <h3 style="margin: 0 0 0.75rem; font-size: 1rem; font-weight: 600;">Recent Activity</h3>
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
          No recent activity to display. Content will appear here as you use the application.
        </p>
      </div>
    </div>
  </main>
`

export const Default = {
  render: () => `
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Desktop application shell with sidebar navigation. Resize below 1024px to see the mobile layout.
    </p>
    <div class="pathable-app-shell">
      ${sidebar()}
      ${topbar()}
      ${mainContent()}
    </div>
  `,
}
