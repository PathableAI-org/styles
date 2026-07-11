export default {
  title: 'Marketing Patterns/Combined',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Restraint & Layering**: These combined examples demonstrate how marketing patterns compose together. Each pattern remains independently usable, but when combined, careful attention to contrast, spacing, and accessibility is essential.\n\n**Layering rules**: Do not stack more than two decorative patterns on the same container. Ensure decorative backgrounds do not obscure text or interactive controls.',
      },
    },
  },
}

export const HeroSection = {
  parameters: {
    docs: {
      description: {
        story:
          'A hero section combining decorative background, screenshot frame, and text highlight.',
      },
    },
  },
  render: () => `
    <div class="pathable-decorative-bg pathable-decorative-bg--gradient" style="padding: 4rem 2rem; border-radius: 12px;">
      <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; max-width: 900px; margin: 0 auto;">
        <div style="flex: 1; min-width: 280px;">
          <h2 style="margin: 0 0 1rem; font-size: 2rem;">
            Transform your
            <span class="pathable-text-highlight pathable-text-highlight--marker">workforce programs</span>
            with Pathable
          </h2>
          <p style="margin: 0 0 1.5rem; font-size: 1.125rem; line-height: 1.6;">
            Streamline case management, track outcomes, and empower participants with
            <span class="pathable-text-highlight pathable-text-highlight--underline">data-driven insights</span>
            that make a real difference.
          </p>
          <div class="pathable-chip-rail">
            <span class="pathable-chip-rail__chip">Case Management</span>
            <span class="pathable-chip-rail__chip">Reporting</span>
            <span class="pathable-chip-rail__chip">Compliance</span>
          </div>
        </div>
        <div style="flex: 1; min-width: 280px;">
          <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser">
            <div class="pathable-screenshot-frame__browser-bar">
              <div class="pathable-screenshot-frame__browser-dots">
                <span></span><span></span><span></span>
              </div>
              <div class="pathable-screenshot-frame__browser-url">app.pathable.com/dashboard</div>
            </div>
            <img class="pathable-screenshot-frame__image" src="https://placehold.co/800x500/e0e0e0/666666?text=Dashboard+Preview" alt="Pathable dashboard preview" loading="lazy" />
          </figure>
        </div>
      </div>
    </div>
  `,
}

export const FeatureShowcase = {
  parameters: {
    docs: {
      description: {
        story:
          'A feature showcase section combining bento grid with text highlights in the description.',
      },
    },
  },
  render: () => `
    <div style="max-width: 900px; margin: 0 auto;">
      <h2 style="margin: 0 0 0.5rem; text-align: center;">Platform Features</h2>
      <p style="margin: 0 0 2rem; text-align: center; color: #666; max-width: 600px; margin-inline: auto;">
        Everything you need for
        <span class="pathable-text-highlight pathable-text-highlight--soft-bg">comprehensive program management</span>
        in one integrated platform.
      </p>
      <div class="pathable-bento-grid">
        <div class="pathable-bento-tile pathable-bento-tile--featured" style="min-height: 250px;">
          <h3 style="margin: 0 0 0.5rem;">All-in-One Platform</h3>
          <p style="margin: 0;">Manage participants, track outcomes, generate reports, and stay compliant — all from a single dashboard.</p>
        </div>
        <div class="pathable-bento-tile pathable-bento-tile--standard" style="min-height: 120px;">
          <h4 style="margin: 0 0 0.25rem;">Case Management</h4>
          <p style="margin: 0; font-size: 0.875rem;">End-to-end participant journey tracking</p>
        </div>
        <div class="pathable-bento-tile pathable-bento-tile--metric" style="min-height: 120px;">
          <span class="pathable-bento-tile__value">10k+</span>
          <span class="pathable-bento-tile__label">Active users</span>
        </div>
        <div class="pathable-bento-tile pathable-bento-tile--image" style="min-height: 180px;">
          <img src="https://placehold.co/400x300/primary/white?text=Analytics" alt="Analytics dashboard screenshot" />
        </div>
        <div class="pathable-bento-tile pathable-bento-tile--image" style="min-height: 180px;">
          <img src="https://placehold.co/400x300/primary-lighter/333?text=Reports" alt="Reports dashboard screenshot" />
        </div>
      </div>
    </div>
  `,
}
