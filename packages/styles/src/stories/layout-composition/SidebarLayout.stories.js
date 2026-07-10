export default {
  title: 'Layout Composition/Sidebar Layout',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nPrimary content plus secondary sidebar. Collapses below 1024px — sidebar stacks below main content, preserving DOM reading order.',
      },
    },
  },
}

const mainContent = () => `
  <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
    <h3 style="margin: 0 0 0.75rem; font-size: 1.125rem; font-weight: 600;">Main Content</h3>
    <div class="pathable-stack" style="gap: 0.75rem;">
      <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
        This is the primary content area. It takes up most of the layout width
        on desktop and appears first in the DOM, ensuring logical reading order
        on both desktop and mobile.
      </p>
      <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
        On mobile (below 1024px), the sidebar will stack below this content.
      </p>
    </div>
  </div>
`

const sidebar = () => `
  <div class="pathable-surface pathable-surface--inset" style="padding: 1.25rem;">
    <h4 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Sidebar</h4>
    <div class="pathable-stack" style="gap: 0.5rem;">
      <p style="margin: 0; font-size: 0.8rem; color: #555;">Sidebar navigation or widgets appear here.</p>
      <p style="margin: 0; font-size: 0.8rem; color: #555;">On mobile this section stacks below the main content.</p>
    </div>
  </div>
`

export const DefaultLayout = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Default Sidebar Layout (3:1)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Main content + sidebar at 3:1 ratio. Resize below 1024px to see sidebar stack below content.
    </p>
    <div class="pathable-sidebar-layout">
      ${mainContent()}
      ${sidebar()}
    </div>
  `,
}

export const SidebarFirst = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Sidebar First</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Sidebar appears on the left on desktop, stacks on top on mobile.
    </p>
    <div class="pathable-sidebar-layout pathable-sidebar-layout--sidebar-first">
      ${sidebar()}
      ${mainContent()}
    </div>
  `,
}

export const Ratio2to1 = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Ratio 2:1 (wider sidebar)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Main content to sidebar ratio of 2:1 — sidebar takes up ~33% width.
    </p>
    <div class="pathable-sidebar-layout pathable-sidebar-layout--ratio-2-1">
      ${mainContent()}
      ${sidebar()}
    </div>
  `,
}

export const Default = DefaultLayout