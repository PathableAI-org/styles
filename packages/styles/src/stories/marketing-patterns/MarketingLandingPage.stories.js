export default {
  title: 'Marketing Patterns/Marketing Landing Page',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (header requires USWDS JavaScript for mobile menu toggle — import `@pathable/styles/js` to enable interactive behavior)\n\n**Consumers must**: Import `@pathable/styles` CSS. This page composes site header, hero, audience row, alternating feature sections, statistic cards, CTA band, and footer from existing public CSS classes.\n\n**Which archetype to start from**: Choose this archetype for public-facing marketing or product landing pages. Optional patterns include decorative backgrounds, screenshot frames, bento grids, chip rails, and text highlights. See the combined pattern documentation for layering guidance.',
      },
    },
  },
}

const headerHtml = `
<header class="pathable-header pathable-header--basic usa-header usa-header--basic">
  <div class="pathable-nav-container">
    <div class="pathable-navbar">
      <div class="pathable-logo" id="landing-logo">
        <em class="pathable-logo__text">
          <a href="#">PathAble</a>
        </em>
      </div>
      <button class="pathable-menu-btn">Menu</button>
    </div>
    <nav class="pathable-nav usa-nav" aria-label="Primary navigation">
      <ul class="pathable-nav__primary">
        <li class="pathable-nav__primary-item"><a href="#"><span>Platform</span></a></li>
        <li class="pathable-nav__primary-item"><a href="#"><span>Solutions</span></a></li>
        <li class="pathable-nav__primary-item"><a href="#"><span>Resources</span></a></li>
        <li class="pathable-nav__primary-item"><a href="#"><span>Pricing</span></a></li>
      </ul>
    </nav>
  </div>
</header>
`

const heroHtml = `
<section class="pathable-decorative-bg pathable-decorative-bg--gradient" style="padding: 5rem 1rem;">
  <div class="pathable-container pathable-container--standard" style="text-align: center;">
    <div class="pathable-stack pathable-stack--gap-lg" style="align-items: center;">
      <p style="margin: 0; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--pathable-color-text-muted);">
        <span class="pathable-text-highlight pathable-text-highlight--soft-bg">Trusted by 500+ organizations</span>
      </p>
      <h1 style="margin: 0; font-size: 2.5rem; font-weight: 700; line-height: 1.2; max-width: 720px;">
        Streamline your
        <span class="pathable-text-highlight pathable-text-highlight--marker">workforce programs</span>
        with confidence
      </h1>
      <p style="margin: 0; font-size: 1.125rem; line-height: 1.6; color: var(--pathable-color-text-muted); max-width: 560px;">
        From intake to outcomes, PathAble helps you manage participants, track performance, and demonstrate impact — all in one platform.
      </p>
      <div class="pathable-cluster pathable-cluster--gap-sm" style="justify-content: center;">
        <a href="#" class="pathable-button">Get started</a>
        <a href="#" class="pathable-button pathable-button--outline">Watch demo</a>
      </div>
    </div>
  </div>
</section>
`

const audienceHtml = `
<section style="padding: 4rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-cluster pathable-cluster--gap-lg" style="justify-content: center; text-align: center;">
      <div class="pathable-surface pathable-surface--raised" style="padding: 2rem; flex: 1; min-width: 200px; max-width: 300px;">
        <h3 style="margin: 0 0 0.5rem; font-size: 1.125rem; font-weight: 600;">Case Workers</h3>
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.5; color: var(--pathable-color-text-muted);">Simplify documentation and focus on what matters — your participants.</p>
      </div>
      <div class="pathable-surface pathable-surface--raised" style="padding: 2rem; flex: 1; min-width: 200px; max-width: 300px;">
        <h3 style="margin: 0 0 0.5rem; font-size: 1.125rem; font-weight: 600;">Program Managers</h3>
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.5; color: var(--pathable-color-text-muted);">Get real-time visibility into outcomes, compliance, and team performance.</p>
      </div>
      <div class="pathable-surface pathable-surface--raised" style="padding: 2rem; flex: 1; min-width: 200px; max-width: 300px;">
        <h3 style="margin: 0 0 0.5rem; font-size: 1.125rem; font-weight: 600;">Administrators</h3>
        <p style="margin: 0; font-size: 0.875rem; line-height: 1.5; color: var(--pathable-color-text-muted);">Meet reporting requirements and demonstrate funder impact with confidence.</p>
      </div>
    </div>
  </div>
</section>
`

const featureSectionsHtml = `
<section style="padding: 4rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-split pathable-split--ratio-1-2" style="align-items: center;">
      <div class="pathable-stack pathable-stack--gap-md">
        <p style="margin: 0; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--pathable-color-accent);">Case Management</p>
        <h2 style="margin: 0; font-size: 1.75rem; font-weight: 700; line-height: 1.3;">End-to-end participant journey tracking</h2>
        <p style="margin: 0; font-size: 1rem; line-height: 1.6; color: var(--pathable-color-text-muted);">From enrollment to outcome, every step of the participant journey is documented and accessible. Reduce paperwork and spend more time on meaningful interactions.</p>
        <a href="#" class="pathable-button pathable-button--outline">Learn more</a>
      </div>
      <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin: 0;">
        <div class="pathable-screenshot-frame__browser-bar">
          <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
          <div class="pathable-screenshot-frame__browser-url">app.pathable.com/participants</div>
        </div>
        <img class="pathable-screenshot-frame__image" src="https://placehold.co/800x500/e0e0e0/666666?text=Case+Management+Preview" alt="Case management dashboard preview" loading="lazy" />
      </figure>
    </div>
  </div>
</section>
<section style="padding: 4rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-split pathable-split--ratio-2-1" style="align-items: center;">
      <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin: 0;">
        <div class="pathable-screenshot-frame__browser-bar">
          <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
          <div class="pathable-screenshot-frame__browser-url">app.pathable.com/reports</div>
        </div>
        <img class="pathable-screenshot-frame__image" src="https://placehold.co/800x500/e0e0e0/666666?text=Analytics+Preview" alt="Analytics dashboard preview" loading="lazy" />
      </figure>
      <div class="pathable-stack pathable-stack--gap-md">
        <p style="margin: 0; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--pathable-color-accent);">Reporting</p>
        <h2 style="margin: 0; font-size: 1.75rem; font-weight: 700; line-height: 1.3;">Data-driven insights at your fingertips</h2>
        <p style="margin: 0; font-size: 1rem; line-height: 1.6; color: var(--pathable-color-text-muted);">Generate funder-ready reports with a single click. Track outcomes across programs, identify trends, and demonstrate the impact of your work.</p>
        <a href="#" class="pathable-button pathable-button--outline">Explore reports</a>
      </div>
    </div>
  </div>
</section>
`

const statsHtml = `
<section style="padding: 4rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-stack pathable-stack--gap-lg" style="align-items: center; text-align: center;">
      <h2 style="margin: 0; font-size: 1.75rem; font-weight: 700;">Trusted across the country</h2>
      <p style="margin: 0; font-size: 1rem; color: var(--pathable-color-text-muted); max-width: 480px;">Organizations of all sizes rely on PathAble to deliver better outcomes.</p>
      <div class="pathable-card-grid pathable-card-grid--gap-lg" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); max-width: 800px;">
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">500+</p>
          <p class="pathable-kpi-card__label">Organizations</p>
        </div>
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">50K+</p>
          <p class="pathable-kpi-card__label">Participants Served</p>
        </div>
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">98%</p>
          <p class="pathable-kpi-card__label">Satisfaction Rate</p>
        </div>
        <div class="pathable-kpi-card">
          <p class="pathable-kpi-card__value">24/7</p>
          <p class="pathable-kpi-card__label">Support</p>
        </div>
      </div>
    </div>
  </div>
</section>
`

const ctaHtml = `
<section class="pathable-decorative-bg pathable-decorative-bg--glow" style="padding: 4rem 1rem;">
  <div class="pathable-container pathable-container--standard" style="text-align: center;">
    <div class="pathable-stack pathable-stack--gap-md" style="align-items: center;">
      <h2 style="margin: 0; font-size: 1.75rem; font-weight: 700;">Ready to transform your programs?</h2>
      <p style="margin: 0; font-size: 1.125rem; color: var(--pathable-color-text-muted); max-width: 480px;">Join hundreds of organizations already using PathAble to deliver better outcomes.</p>
      <div class="pathable-cluster pathable-cluster--gap-sm" style="justify-content: center; margin-top: 0.5rem;">
        <a href="#" class="pathable-button">Start free trial</a>
        <a href="#" class="pathable-button pathable-button--outline">Talk to sales</a>
      </div>
    </div>
  </div>
</section>
`

const footerHtml = `
<footer class="pathable-footer" style="padding: 2rem 1rem; border-top: 1px solid var(--pathable-color-border);">
  <div class="pathable-container pathable-container--standard">
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2rem;">
      <div>
        <p style="margin: 0 0 0.5rem; font-weight: 600;">PathAble</p>
        <p style="margin: 0; font-size: 0.875rem; color: var(--pathable-color-text-muted);">Empowering workforce programs.</p>
      </div>
      <div class="pathable-cluster pathable-cluster--gap-sm">
        <a href="#" style="font-size: 0.875rem;">Privacy</a>
        <a href="#" style="font-size: 0.875rem;">Terms</a>
        <a href="#" style="font-size: 0.875rem;">Contact</a>
      </div>
    </div>
    <p style="margin: 1rem 0 0; font-size: 0.75rem; color: var(--pathable-color-text-muted); text-align: center;">&copy; 2026 PathAble. All rights reserved.</p>
  </div>
</footer>
`

const pageHtml = `
${headerHtml}
<main id="main-content">
  ${heroHtml}
  ${audienceHtml}
  ${featureSectionsHtml}
  ${statsHtml}
  ${ctaHtml}
</main>
${footerHtml}
`

const mobilePageHtml = `
${headerHtml}
<main id="main-content">
  ${heroHtml}
  ${audienceHtml}
  <section style="padding: 4rem 1rem;">
    <div class="pathable-container pathable-container--standard">
      <div class="pathable-stack pathable-stack--gap-lg">
        <div class="pathable-stack pathable-stack--gap-md">
          <p style="margin: 0; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--pathable-color-accent);">Case Management</p>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 700; line-height: 1.3;">End-to-end participant journey tracking</h2>
          <p style="margin: 0; font-size: 1rem; line-height: 1.6; color: var(--pathable-color-text-muted);">From enrollment to outcome, every step is documented and accessible.</p>
          <a href="#" class="pathable-button pathable-button--outline" style="align-self: flex-start;">Learn more</a>
        </div>
        <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin: 1rem 0 0;">
          <div class="pathable-screenshot-frame__browser-bar">
            <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
            <div class="pathable-screenshot-frame__browser-url">app.pathable.com/participants</div>
          </div>
          <img class="pathable-screenshot-frame__image" src="https://placehold.co/800x500/e0e0e0/666666?text=Case+Management+Preview" alt="Case management dashboard preview" loading="lazy" />
        </figure>
      </div>
    </div>
  </section>
  <section style="padding: 4rem 1rem;">
    <div class="pathable-container pathable-container--standard">
      <div class="pathable-stack pathable-stack--gap-lg">
        <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin: 0;">
          <div class="pathable-screenshot-frame__browser-bar">
            <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
            <div class="pathable-screenshot-frame__browser-url">app.pathable.com/reports</div>
          </div>
          <img class="pathable-screenshot-frame__image" src="https://placehold.co/800x500/e0e0e0/666666?text=Analytics+Preview" alt="Analytics dashboard preview" loading="lazy" />
        </figure>
        <div class="pathable-stack pathable-stack--gap-md">
          <p style="margin: 0; font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--pathable-color-accent);">Reporting</p>
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 700; line-height: 1.3;">Data-driven insights at your fingertips</h2>
          <p style="margin: 0; font-size: 1rem; line-height: 1.6; color: var(--pathable-color-text-muted);">Generate funder-ready reports with a single click.</p>
          <a href="#" class="pathable-button pathable-button--outline" style="align-self: flex-start;">Explore reports</a>
        </div>
      </div>
    </div>
  </section>
  ${statsHtml}
  ${ctaHtml}
</main>
${footerHtml}
`

export const Desktop = {
  parameters: {
    docs: {
      description: {
        story:
          'Full marketing landing page at desktop viewport (1280px+). Composes header, hero, audience row, alternating feature sections, statistics cards, CTA band, and footer.',
      },
    },
  },
  render: () => pageHtml,
}

export const Mobile = {
  parameters: {
    docs: {
      description: {
        story:
          'Marketing landing page at mobile viewport (320px). Sections stack vertically, hero CTA buttons wrap, feature images reflow, cards fill full width.',
      },
    },
  },
  render: () => mobilePageHtml,
}

export const Default = Desktop
