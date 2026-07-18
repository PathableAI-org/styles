export default {
  title: 'Application Shell/Variants',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nApplication shell variants demonstrating long navigation labels, wide content mode, and fixed sidebar positioning.',
      },
    },
  },
}

// Long label navigation items
const longNavItems = [
  { label: 'Program Administration', href: '#', active: true },
  { label: 'Participant Management', href: '#', active: false },
  { label: 'Compliance & Reporting', href: '#', active: false },
  { label: 'System Configuration', href: '#', active: false },
  { label: 'Organization Settings', href: '#', active: false },
]

// Short label navigation items
const shortNavItems = [
  { label: 'Dashboard', href: '#', active: false },
  { label: 'Tasks', href: '#', active: true },
  { label: 'Reports', href: '#', active: false },
]

const sidebar = (items) => `
  <aside class="pathable-app-shell__sidebar">
    <div class="pathable-app-shell__brand" style="padding: 0.5rem 0;">
      <strong style="font-size: 1.125rem; color: var(--pathable-color-accent, #00365c);">MyApp</strong>
    </div>
    <nav class="pathable-app-shell__nav">
      ${items
        .map(
          (item) => `
        <a href="${item.href}" class="pathable-app-shell__nav-item${item.active ? ' pathable-app-shell__nav-item--active' : ''}" ${item.active ? 'aria-current="page"' : ''}>
          ${item.label}
        </a>`,
        )
        .join('')}
    </nav>
    <div class="pathable-app-shell__account" style="margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--pathable-color-border);">
      <span style="font-size: 0.875rem; color: var(--pathable-color-text-muted, #666);">Signed in as <strong>ops@example.com</strong></span>
    </div>
  </aside>
`

const topbar = () => `
  <header class="pathable-app-shell__topbar">
    <span class="pathable-app-shell__topbar-title">MyApp</span>
  </header>
`

const mainContent = (modifier = '') => `
  <main id="main-content" class="pathable-app-shell__content${modifier ? ' ' + modifier : ''}">
    <h2 style="margin: 0 0 1rem; font-size: 1.125rem; font-weight: 600;">Content Area</h2>
    <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
      <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
        This variant demonstrates how the shell adapts to different content and
        sidebar configurations. Resize below 1024px to see the mobile layout.
      </p>
    </div>
  </main>
`

export const LongLabels = {
  render: () => `
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Desktop shell with long navigation labels to verify text wrapping and overflow behavior.
    </p>
    <div class="pathable-app-shell">
      ${sidebar(longNavItems)}
      ${topbar()}
      ${mainContent()}
    </div>
  `,
}

export const WideContent = {
  render: () => `
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Desktop shell with wide content max-width (1280px) for data tables and dashboards.
    </p>
    <div class="pathable-app-shell">
      ${sidebar(shortNavItems)}
      ${topbar()}
      ${mainContent('pathable-app-shell__content--wide')}
    </div>
  `,
}

export const FixedSidebar = {
  render: () => `
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Desktop shell with fixed sidebar positioning. The sidebar stays in place while content scrolls.
    </p>
    <div class="pathable-app-shell">
      ${sidebar(longNavItems).replace('pathable-app-shell__sidebar', 'pathable-app-shell__sidebar pathable-app-shell__sidebar--fixed')}
      ${topbar()}
      ${mainContent()}
    </div>
  `,
}
