export default {
  title: 'Layout Composition/Container',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nCenters content horizontally with configurable max-width and consistent gutters.',
      },
    },
  },
}

const containerContent = `
  <div class="pathable-stack" style="background: #f5f7f9; padding: 1rem; border-radius: 4px; text-align: center;">
    <span style="font-size: 0.875rem; color: #555;">Content inside container</span>
  </div>
`

export const Standard = {
  render: () => `
    <h3 style="margin: 0 0 1rem; font-size: 1rem; font-weight: 600;">Standard Container (default)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Max-width: 1024px — suitable for most content pages.
    </p>
    <div class="pathable-container pathable-container--standard" style="background: #e8f0f8; border: 1px dashed #00365c; padding: 1rem 0;">
      ${containerContent}
    </div>
  `,
}

export const Wide = {
  render: () => `
    <h3 style="margin: 0 0 1rem; font-size: 1rem; font-weight: 600;">Wide Container</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Max-width: 1280px — suitable for data tables and dashboards.
    </p>
    <div class="pathable-container pathable-container--wide" style="background: #e8f0f8; border: 1px dashed #00365c; padding: 1rem 0;">
      ${containerContent}
    </div>
  `,
}

export const Full = {
  render: () => `
    <h3 style="margin: 0 0 1rem; font-size: 1rem; font-weight: 600;">Full Container</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Max-width: 100% with constrained gutters — suitable for full-bleed page sections.
    </p>
    <div class="pathable-container pathable-container--full" style="background: #e8f0f8; border: 1px dashed #00365c; padding: 1rem 0;">
      ${containerContent}
    </div>
  `,
}

export const ResponsiveDemo = {
  render: () => `
    <h3 style="margin: 0 0 1rem; font-size: 1rem; font-weight: 600;">Responsive Behavior</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Resize the viewport to see containers center and constrain width at each breakpoint.
      Standard (1024px) vs Wide (1280px) vs Full (100%).
    </p>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div class="pathable-container pathable-container--standard" style="background: #dde2e8; padding: 0.75rem 0; border-radius: 4px;">
        <div style="text-align: center; font-size: 0.875rem;">Standard</div>
      </div>
      <div class="pathable-container pathable-container--wide" style="background: #dde2e8; padding: 0.75rem 0; border-radius: 4px;">
        <div style="text-align: center; font-size: 0.875rem;">Wide</div>
      </div>
      <div class="pathable-container pathable-container--full" style="background: #dde2e8; padding: 0.75rem 0; border-radius: 4px;">
        <div style="text-align: center; font-size: 0.875rem;">Full</div>
      </div>
    </div>
  `,
}

export const Default = Standard
