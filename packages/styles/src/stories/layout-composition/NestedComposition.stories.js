export default {
  title: 'Layout Composition/Nested Composition',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nEnd-to-end page composition using all layout primitives and surface variants together. Demonstrates that all primitives compose gracefully into a complete page.',
      },
    },
  },
}

export const FullPage = {
  render: () => `
    <div class="pathable-container pathable-container--standard">

      <div class="pathable-stack" style="gap: 2rem;">

        <!-- Page header -->
        <header>
          <div class="pathable-cluster pathable-cluster--align-center" style="justify-content: space-between;">
            <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">Page Title</h2>
            <div class="pathable-cluster pathable-cluster--gap-sm">
              <button style="padding: 0.5rem 1rem; background: #00365c; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;">Action</button>
              <button style="padding: 0.5rem 1rem; background: #fff; color: #00365c; border: 1px solid #00365c; border-radius: 4px; cursor: pointer; font-size: 0.875rem;">Secondary</button>
            </div>
          </div>
        </header>

        <!-- Hero split -->
        <div class="pathable-split pathable-split--align-stretch">
          <div class="pathable-surface pathable-surface--raised" style="padding: 2rem;">
            <h3 style="margin: 0 0 0.75rem; font-size: 1.25rem;">Hero Section</h3>
            <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
              This split region showcases how container, split, and surface work together.
              On desktop the hero text and CTA sit side by side.
            </p>
          </div>
          <div class="pathable-surface pathable-surface--brand" style="padding: 2rem; color: #fff;">
            <h3 style="margin: 0 0 0.75rem; font-size: 1.25rem;">Call to Action</h3>
            <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; opacity: 0.9;">
              Brand surface with accent background provides visual contrast.
            </p>
          </div>
        </div>

        <!-- Card grid section -->
        <div class="pathable-stack" style="gap: 1rem;">
          <h3 style="margin: 0; font-size: 1.125rem; font-weight: 600;">Featured Items</h3>
          <div class="pathable-card-grid">
            <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
              <h4 style="margin: 0 0 0.5rem; font-size: 1rem;">Card One</h4>
              <p style="margin: 0; font-size: 0.8rem; color: #555;">Auto-fitting grid</p>
            </div>
            <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
              <h4 style="margin: 0 0 0.5rem; font-size: 1rem;">Card Two</h4>
              <p style="margin: 0; font-size: 0.8rem; color: #555;">Columns adapt to width</p>
            </div>
            <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
              <h4 style="margin: 0 0 0.5rem; font-size: 1rem;">Card Three</h4>
              <p style="margin: 0; font-size: 0.8rem; color: #555;">Never unreasonably narrow</p>
            </div>
          </div>
        </div>

        <!-- Sidebar layout with sticky panel -->
        <div class="pathable-sidebar-layout">
          <main>
            <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
              <h3 style="margin: 0 0 0.75rem; font-size: 1.125rem;">Main Content Area</h3>
              <div class="pathable-stack" style="gap: 0.75rem;">
                <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
                  This content area uses the sidebar layout with main content first (DOM order).
                  The sidebar below contains a sticky panel that follows scrolling.
                </p>
                <p style="margin: 0; font-size: 0.875rem; line-height: 1.6; color: #444;">
                  On mobile (<1024px), the sidebar stacks below this content automatically.
                  The sticky panel becomes static on short viewports (<600px height).
                </p>
              </div>
            </div>
          </main>
          <aside>
            <div class="pathable-sticky-panel">
              <div class="pathable-surface pathable-surface--inset" style="padding: 1.25rem;">
                <h4 style="margin: 0 0 0.5rem; font-size: 1rem;">Inset Sidebar</h4>
                <div class="pathable-stack" style="gap: 0.5rem;">
                  <p style="margin: 0; font-size: 0.8rem; color: #555;">
                    Recessed (inset) surface nested inside the sidebar area.
                  </p>
                  <div class="pathable-surface pathable-surface--interactive" tabindex="0" style="padding: 0.75rem; text-align: center;">
                    <span style="font-size: 0.8rem;">Interactive Element</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <!-- Tags cluster -->
        <div>
          <h4 style="margin: 0 0 0.5rem; font-size: 0.875rem; font-weight: 600;">Tags</h4>
          <div class="pathable-cluster pathable-cluster--gap-sm">
            <span style="display: inline-block; background: #dde2e8; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: #00365c;">Design</span>
            <span style="display: inline-block; background: #dde2e8; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: #00365c;">Layout</span>
            <span style="display: inline-block; background: #dde2e8; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: #00365c;">Responsive</span>
            <span style="display: inline-block; background: #dde2e8; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: #00365c;">Accessibility</span>
            <span style="display: inline-block; background: #dde2e8; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; color: #00365c;">CSS Grid</span>
          </div>
        </div>

      </div>
    </div>
  `,
}

export const Default = FullPage