export default {
  title: 'Layout Composition/Sticky Panel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nOptional sticky container that sticks on large viewports and safely becomes static on short viewports (<600px height) to prevent content obscuring.',
      },
    },
  },
}

export const WithSidebarLayout = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Sticky Panel in Sidebar</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      The sidebar panel sticks when scrolling on viewports taller than 600px.
      Scroll this container to see the sticky behavior. On viewports shorter than 600px,
      the panel becomes static.
    </p>
    <div style="max-height: 400px; overflow-y: auto; border: 1px solid #dde2e8; border-radius: 8px; padding: 1rem;" tabindex="0" role="region" aria-label="Scrollable content demonstrating sticky panel behavior">
      <div class="pathable-sidebar-layout">
        <div class="pathable-stack" style="gap: 1rem;">
          <div class="pathable-surface pathable-surface--raised" style="padding: 2rem;">
            <span style="font-size: 0.875rem;">Scroll down to see sticky behavior</span>
          </div>
          <div class="pathable-surface pathable-surface--raised" style="padding: 6rem 2rem;">
            <span style="font-size: 0.875rem;">More content — keep scrolling</span>
          </div>
          <div class="pathable-surface pathable-surface--raised" style="padding: 6rem 2rem;">
            <span style="font-size: 0.875rem;">Almost there</span>
          </div>
          <div class="pathable-surface pathable-surface--raised" style="padding: 6rem 2rem;">
            <span style="font-size: 0.875rem;">Bottom of content</span>
          </div>
        </div>
        <div class="pathable-sticky-panel">
          <div class="pathable-surface pathable-surface--raised" style="padding: 1.25rem;">
            <h4 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Sticky Sidebar</h4>
            <p style="margin: 0; font-size: 0.8rem; color: #555;">
              This panel sticks while scrolling. On short viewports (&lt;600px height),
              it becomes static to avoid obscuring focused content.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
}

export const StaticModifier = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Static Modifier</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Apply the <code>--static</code> modifier to force static positioning regardless of viewport height.
    </p>
    <div class="pathable-sticky-panel pathable-sticky-panel--static">
      <div class="pathable-surface pathable-surface--raised" style="padding: 1.25rem;">
        <h4 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Always Static</h4>
        <p style="margin: 0; font-size: 0.8rem; color: #555;">
          This panel is forced to static via the <code>--static</code> modifier class.
        </p>
      </div>
    </div>
  `,
}

export const Default = WithSidebarLayout
