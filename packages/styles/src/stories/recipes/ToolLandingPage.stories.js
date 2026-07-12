export default {
  title: 'Recipes/Tool Landing Page',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (header requires USWDS JavaScript for mobile menu toggle — import `@pathable/styles/js` to enable interactive behavior).\n\n' +
          '**Consumers must**: Import `@pathable/styles` CSS. This recipe composes site header, hero section with branded product state, feature overview, and footer from existing public CSS classes.\n\n' +
          '**Accessibility notes**: The header hamburger menu requires `@pathable/styles/js` for keyboard-accessible toggle behavior. ' +
          'All interactive controls use semantic HTML. The hero buttons are `<a>` elements with clear visual prominence — the primary action ("Try it free") has higher contrast than the secondary outline variant. ' +
          'Landmark regions (`<header>`, `<main>`, `<footer>`) provide screen-reader navigation. ' +
          'Screenshot frames use real component-based product states rather than inaccessible placeholder images.\n\n' +
          '**Which archetype to start from**: Choose this recipe for public-facing tool landing pages. ' +
          'It demonstrates a usable tool preview built from the component library, an audience section, feature highlights, and a CTA.',
      },
    },
  },
}

/* -------------------------------------------------- */
/* Header                                                */
/* -------------------------------------------------- */
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

/* -------------------------------------------------- */
/* Hero — branded, uses real components for preview    */
/* -------------------------------------------------- */
const heroHtml = `
<section style="padding: 3rem 1rem; background-color: var(--pathable-color-bg);">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-split pathable-split--ratio-1-2" style="align-items: center;">
      <div class="pathable-stack pathable-stack--gap-md">
        <p style="margin:0;font-size:0.875rem;font-weight:600;letter-spacing:0.04em;color:var(--pathable-color-accent);text-transform:uppercase;">Intake Assessment Tool</p>
        <h1 style="margin:0;font-family:var(--pathable-font-heading);font-size:2rem;font-weight:400;line-height:1.2;color:var(--pathable-color-text);">
          Streamline participant intake in minutes
        </h1>
        <p style="margin:0;font-size:1.125rem;line-height:1.6;color:var(--pathable-color-text-muted);">
          A guided intake tool that collects participant history, employment background, and support needs — then generates a structured case summary.
        </p>
        <div class="pathable-cluster pathable-cluster--gap-sm">
          <a href="#" class="pathable-button">Try it free</a>
          <a href="#" class="pathable-button pathable-button--outline">See how it works</a>
        </div>
      </div>
      <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin:0;min-width:0;">
        <div class="pathable-screenshot-frame__browser-bar">
          <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
          <div class="pathable-screenshot-frame__browser-url">app.pathable.com/intake/new</div>
        </div>
        <div style="padding:1rem;background:var(--pathable-color-surface);">
          <div class="pathable-record-header" style="margin-bottom:1rem;">
            <div class="pathable-record-header__media">
              <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" style="fill:var(--pathable-color-accent);"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div class="pathable-record-header__body">
              <p style="margin:0;font-size:1rem;font-weight:600;">New Participant</p>
              <ul class="pathable-record-header__metadata" style="margin:0.25rem 0 0;"><li>Intake Form</li></ul>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <div><div style="height:8px;width:80%;background:var(--pathable-color-bg);border-radius:4px;"></div></div>
            <div><div style="height:8px;width:60%;background:var(--pathable-color-bg);border-radius:4px;"></div></div>
            <div><div style="height:8px;width:90%;background:var(--pathable-color-bg);border-radius:4px;"></div></div>
            <div><div style="height:8px;width:70%;background:var(--pathable-color-bg);border-radius:4px;"></div></div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;padding-top:0.75rem;border-top:1px solid var(--pathable-color-border);">
            <div style="height:2rem;width:4rem;background:var(--pathable-color-bg);border-radius:4px;"></div>
            <div style="height:2rem;width:5rem;background:var(--pathable-color-action-primary-bg);border-radius:4px;"></div>
          </div>
        </div>
      </figure>
    </div>
  </div>
</section>
`

/* -------------------------------------------------- */
/* Audience section                                      */
/* -------------------------------------------------- */
const audienceHtml = `
<section style="padding:4rem 1rem;">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-stack pathable-stack--gap-lg" style="align-items:center;text-align:center;">
      <h2 style="margin:0;font-family:var(--pathable-font-heading);font-size:1.5rem;font-weight:400;color:var(--pathable-color-text);">Built for your team</h2>
      <p style="margin:0;font-size:1rem;color:var(--pathable-color-text-muted);max-width:520px;">One tool — three perspectives. Everyone sees the information that matters to them.</p>
      <div class="pathable-cluster pathable-cluster--gap-lg" style="justify-content:center;text-align:left;">
        <div class="pathable-surface pathable-surface--raised" style="padding:2rem;flex:1;min-width:200px;max-width:300px;">
          <h3 style="margin:0 0 0.5rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Case Workers</h3>
          <p style="margin:0;font-size:0.875rem;line-height:1.5;color:var(--pathable-color-text-muted);">Guided prompts reduce paperwork time. Focus on the conversation — the tool captures the details.</p>
        </div>
        <div class="pathable-surface pathable-surface--raised" style="padding:2rem;flex:1;min-width:200px;max-width:300px;">
          <h3 style="margin:0 0 0.5rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Program Managers</h3>
          <p style="margin:0;font-size:0.875rem;line-height:1.5;color:var(--pathable-color-text-muted);">Standardized intake across your team. Real-time dashboards show enrollment trends and bottlenecks.</p>
        </div>
        <div class="pathable-surface pathable-surface--raised" style="padding:2rem;flex:1;min-width:200px;max-width:300px;">
          <h3 style="margin:0 0 0.5rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Administrators</h3>
          <p style="margin:0;font-size:0.875rem;line-height:1.5;color:var(--pathable-color-text-muted);">Intake data feeds directly into compliance reports. No double-entry, no spreadsheet exports.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`

/* -------------------------------------------------- */
/* Feature highlights                                    */
/* -------------------------------------------------- */
const featureHtml = `
<section style="padding:4rem 1rem;background:var(--pathable-color-surface);">
  <div class="pathable-container pathable-container--standard">
    <div class="pathable-stack pathable-stack--gap-lg">
      <div class="pathable-split pathable-split--ratio-1-2" style="align-items:center;">
        <div class="pathable-stack pathable-stack--gap-md">
          <p style="margin:0;font-size:0.875rem;font-weight:600;letter-spacing:0.04em;color:var(--pathable-color-accent);text-transform:uppercase;">Guided Workflow</p>
          <h2 style="margin:0;font-family:var(--pathable-font-subheading);font-size:1.5rem;font-weight:700;line-height:1.3;color:var(--pathable-color-text);">Four steps from blank form to case summary</h2>
          <p style="margin:0;font-size:1rem;line-height:1.6;color:var(--pathable-color-text-muted);">Participant info, assessment, goals, and review — each step validates input and saves progress automatically. Case workers finish intakes in under 15 minutes.</p>
        </div>
        <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin:0;min-width:0;">
          <div class="pathable-screenshot-frame__browser-bar">
            <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
            <div class="pathable-screenshot-frame__browser-url">app.pathable.com/intake/step-2</div>
          </div>
          <div style="padding:1rem;background:var(--pathable-color-surface);">
            <ol class="pathable-step-indicator" style="margin-bottom:1rem;">
              <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed"><span class="pathable-step-indicator__segment-label">Info</span></li>
              <li class="pathable-step-indicator__segment pathable-step-indicator__segment--current"><span class="pathable-step-indicator__segment-label">Assessment</span></li>
              <li class="pathable-step-indicator__segment"><span class="pathable-step-indicator__segment-label">Goals</span></li>
              <li class="pathable-step-indicator__segment"><span class="pathable-step-indicator__segment-label">Review</span></li>
            </ol>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <div style="height:2rem;width:100%;background:var(--pathable-color-bg);border-radius:4px;"></div>
              <div style="height:2rem;width:100%;background:var(--pathable-color-bg);border-radius:4px;"></div>
              <div style="height:5rem;width:100%;background:var(--pathable-color-bg);border-radius:4px;"></div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:0.75rem;">
              <div style="height:2rem;width:5rem;background:var(--pathable-color-bg);border-radius:4px;"></div>
              <div style="height:2rem;width:5rem;background:var(--pathable-color-action-primary-bg);border-radius:4px;"></div>
            </div>
          </div>
        </figure>
      </div>
      <div class="pathable-split pathable-split--ratio-2-1" style="align-items:center;">
        <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin:0;min-width:0;">
          <div class="pathable-screenshot-frame__browser-bar">
            <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
            <div class="pathable-screenshot-frame__browser-url">app.pathable.com/intake/summary</div>
          </div>
          <div style="padding:1rem;background:var(--pathable-color-surface);">
            <p style="margin:0 0 0.5rem;font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);">Case Summary</p>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <div style="display:flex;gap:0.5rem;"><span class="pathable-tag">Employment</span><span class="pathable-tag">Skills Training</span></div>
              <div style="height:3rem;width:100%;background:var(--pathable-color-bg);border-radius:4px;"></div>
              <div style="height:3rem;width:80%;background:var(--pathable-color-bg);border-radius:4px;"></div>
            </div>
            <div class="pathable-cluster pathable-cluster--gap-sm" style="margin-top:0.75rem;justify-content:flex-end;">
              <div class="pathable-kpi-card" style="text-align:center;padding:0.75rem;">
                <p class="pathable-kpi-card__value" style="font-size:1.25rem;">15 min</p>
                <p class="pathable-kpi-card__label" style="font-size:0.75rem;">Avg. completion</p>
              </div>
            </div>
          </div>
        </figure>
        <div class="pathable-stack pathable-stack--gap-md">
          <p style="margin:0;font-size:0.875rem;font-weight:600;letter-spacing:0.04em;color:var(--pathable-color-accent);text-transform:uppercase;">Case Summary</p>
          <h2 style="margin:0;font-family:var(--pathable-font-subheading);font-size:1.5rem;font-weight:700;line-height:1.3;color:var(--pathable-color-text);">One-click summaries ready for review</h2>
          <p style="margin:0;font-size:1rem;line-height:1.6;color:var(--pathable-color-text-muted);">After intake, the tool generates a structured summary with key tags, employment goals, and next steps — ready to share with your team.</p>
        </div>
      </div>
    </div>
  </div>
</section>
`

/* -------------------------------------------------- */
/* CTA band                                              */
/* -------------------------------------------------- */
const ctaHtml = `
<section style="padding:4rem 1rem;background-color:var(--pathable-color-text);">
  <div class="pathable-container pathable-container--standard" style="text-align:center;">
    <div class="pathable-stack pathable-stack--gap-md" style="align-items:center;">
      <h2 style="margin:0;font-family:var(--pathable-font-heading);font-size:1.5rem;font-weight:400;color:#fff;">Ready to simplify your intake process?</h2>
      <p style="margin:0;font-size:1.125rem;color:var(--pathable-color-bg);max-width:480px;">Start with a free intake assessment tool — no setup, no training required.</p>
      <div class="pathable-cluster pathable-cluster--gap-sm" style="justify-content:center;">
        <a href="#" class="pathable-button">Get started free</a>
        <a href="#" class="pathable-button pathable-button--outline" style="color:#fff;box-shadow:inset 0 0 0 2px #fff;">Talk to us</a>
      </div>
    </div>
  </div>
</section>
`

/* -------------------------------------------------- */
/* Footer                                                */
/* -------------------------------------------------- */
const footerHtml = `
<footer class="pathable-footer" style="padding:2rem 1rem;border-top:1px solid var(--pathable-color-border);">
  <div class="pathable-container pathable-container--standard">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:2rem;">
      <div>
        <p style="margin:0 0 0.5rem;font-weight:600;color:var(--pathable-color-text);">PathAble</p>
        <p style="margin:0;font-size:0.875rem;color:var(--pathable-color-text-muted);">Tools that empower workforce programs.</p>
      </div>
      <div class="pathable-cluster pathable-cluster--gap-sm">
        <a href="#" style="font-size:0.875rem;">Privacy</a>
        <a href="#" style="font-size:0.875rem;">Terms</a>
        <a href="#" style="font-size:0.875rem;">Contact</a>
      </div>
    </div>
    <p style="margin:1rem 0 0;font-size:0.75rem;color:var(--pathable-color-text-muted);text-align:center;">&copy; 2026 PathAble. All rights reserved.</p>
  </div>
</footer>
`

/* -------------------------------------------------- */
/* Assemble                                              */
/* -------------------------------------------------- */
const desktopPage = `
${headerHtml}
<main id="main-content">
  ${heroHtml}
  ${audienceHtml}
  ${featureHtml}
  ${ctaHtml}
</main>
${footerHtml}
`

const mobilePage = `
${headerHtml}
<main id="main-content">
  ${heroHtml}
  ${audienceHtml}
  <section style="padding:3rem 1rem;background:var(--pathable-color-surface);">
    <div class="pathable-container pathable-container--standard">
      <div class="pathable-stack pathable-stack--gap-lg">
        <div class="pathable-stack pathable-stack--gap-md">
          <p style="margin:0;font-size:0.875rem;font-weight:600;letter-spacing:0.04em;color:var(--pathable-color-accent);text-transform:uppercase;">Guided Workflow</p>
          <h2 style="margin:0;font-family:var(--pathable-font-subheading);font-size:1.25rem;font-weight:700;line-height:1.3;color:var(--pathable-color-text);">Four steps from blank form to case summary</h2>
          <p style="margin:0;font-size:0.875rem;line-height:1.5;color:var(--pathable-color-text-muted);">Each step validates input and saves progress automatically. Case workers finish intakes in under 15 minutes.</p>
        </div>
        <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="margin:0;min-width:0;">
          <div class="pathable-screenshot-frame__browser-bar">
            <div class="pathable-screenshot-frame__browser-dots"><span></span><span></span><span></span></div>
            <div class="pathable-screenshot-frame__browser-url">app.pathable.com/intake/step-2</div>
          </div>
          <div style="padding:0.75rem;background:var(--pathable-color-surface);">
            <ol class="pathable-step-indicator" style="margin-bottom:0.75rem;">
              <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed"><span class="pathable-step-indicator__segment-label">Info</span></li>
              <li class="pathable-step-indicator__segment pathable-step-indicator__segment--current"><span class="pathable-step-indicator__segment-label">Assessment</span></li>
              <li class="pathable-step-indicator__segment"><span class="pathable-step-indicator__segment-label">Goals</span></li>
              <li class="pathable-step-indicator__segment"><span class="pathable-step-indicator__segment-label">Review</span></li>
            </ol>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <div style="height:2rem;width:100%;background:var(--pathable-color-bg);border-radius:4px;"></div>
              <div style="height:2rem;width:100%;background:var(--pathable-color-bg);border-radius:4px;"></div>
              <div style="height:4rem;width:100%;background:var(--pathable-color-bg);border-radius:4px;"></div>
            </div>
          </div>
        </figure>
        <div class="pathable-stack pathable-stack--gap-md">
          <p style="margin:0;font-size:0.875rem;font-weight:600;letter-spacing:0.04em;color:var(--pathable-color-accent);text-transform:uppercase;">Case Summary</p>
          <h2 style="margin:0;font-family:var(--pathable-font-subheading);font-size:1.25rem;font-weight:700;line-height:1.3;color:var(--pathable-color-text);">One-click summaries ready for review</h2>
          <p style="margin:0;font-size:0.875rem;line-height:1.5;color:var(--pathable-color-text-muted);">After intake, the tool generates a structured summary with key tags, employment goals, and next steps.</p>
        </div>
      </div>
    </div>
  </section>
  ${ctaHtml}
</main>
${footerHtml}
`

/* -------------------------------------------------- */
/* Exports                                               */
/* -------------------------------------------------- */
export const Desktop = {
  parameters: {
    docs: {
      description: {
        story:
          'Full tool landing page at desktop viewport (1280px). Composes header, branded hero with component-based product preview, audience section, alternating feature highlights, CTA band on PathAble Blue background, and footer.',
      },
    },
  },
  render: () => desktopPage,
}

export const Mobile = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'Tool landing page at mobile viewport (375px). Split layouts collapse to vertical stacks. Feature previews stack above descriptions. CTA buttons wrap. All text remains readable with breathing room preserved.',
      },
    },
  },
  render: () => mobilePage,
}

export const Default = Desktop
