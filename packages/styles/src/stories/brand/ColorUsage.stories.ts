export default {
  title: 'Brand/Color Usage',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.',
      },
    },
  },
}

const brandColors = [
  {
    name: 'PathAble Blue',
    exact: '#00365c',
    role: 'Primary',
    use: 'Primary brand — text, navigation, primary actions',
  },
  {
    name: 'Intelligent Jade',
    exact: '#1cae96',
    role: 'Primary',
    use: 'Accents, success indicators, secondary actions (dark text only)',
  },
  {
    name: 'Bright Blue Brooks',
    exact: '#4899e8',
    role: 'Primary',
    use: 'Focus ring, interactive accents and large graphics; not for small text on white',
  },
  {
    name: 'Tech Teal',
    exact: '#015a76',
    role: 'Secondary',
    use: 'Links, muted text, supporting backgrounds',
  },
  {
    name: 'Lived-In Lime',
    exact: '#d3ff66',
    role: 'Secondary',
    use: 'Sparing accent on dark backgrounds; never text on light backgrounds',
  },
  {
    name: 'Shilling Silver',
    exact: '#dde2e8',
    role: 'Secondary',
    use: 'Page backgrounds, borders, light surfaces',
  },
]

const generalTokens = [
  { name: 'bg', token: '--pathable-color-bg', value: '#dde2e8' },
  { name: 'surface', token: '--pathable-color-surface', value: '#ffffff' },
  { name: 'text', token: '--pathable-color-text', value: '#00365c' },
  {
    name: 'text-muted',
    token: '--pathable-color-text-muted',
    value: '#015a76',
  },
  { name: 'border', token: '--pathable-color-border', value: '#dde2e8' },
  { name: 'link', token: '--pathable-color-link', value: '#015a76' },
  { name: 'accent', token: '--pathable-color-accent', value: '#1cae96' },
  {
    name: 'focus-ring',
    token: '--pathable-color-focus-ring',
    value: '#4899e8',
  },
  { name: 'danger', token: '--pathable-color-danger', value: '#dc3545' },
  { name: 'success', token: '--pathable-color-success', value: '#1cae96' },
]

const actionTokens = [
  {
    name: 'action-primary-bg',
    token: '--pathable-color-action-primary-bg',
    value: '#00365c',
  },
  {
    name: 'action-primary-text',
    token: '--pathable-color-action-primary-text',
    value: '#ffffff',
  },
  {
    name: 'action-secondary-bg',
    token: '--pathable-color-action-secondary-bg',
    value: '#1cae96',
  },
  {
    name: 'action-secondary-text',
    token: '--pathable-color-action-secondary-text',
    value: '#001a33',
  },
]

const statusTokens = [
  {
    name: 'status-success-bg',
    token: '--pathable-color-status-success-bg',
    value: '#1cae96',
  },
  {
    name: 'status-success-text',
    token: '--pathable-color-status-success-text',
    value: '#001a33',
  },
  {
    name: 'status-warning-bg',
    token: '--pathable-color-status-warning-bg',
    value: '#f5a623',
  },
  {
    name: 'status-warning-text',
    token: '--pathable-color-status-warning-text',
    value: '#001a33',
  },
  {
    name: 'status-danger-bg',
    token: '--pathable-color-status-danger-bg',
    value: '#dc3545',
  },
  {
    name: 'status-danger-text',
    token: '--pathable-color-status-danger-text',
    value: '#ffffff',
  },
]

const workflowTokens = [
  {
    name: 'workflow-active',
    token: '--pathable-color-workflow-active',
    value: '#4899e8',
  },
  {
    name: 'workflow-complete',
    token: '--pathable-color-workflow-complete',
    value: '#1cae96',
  },
  {
    name: 'workflow-blocked',
    token: '--pathable-color-workflow-blocked',
    value: '#dc3545',
  },
]

const approvedPairings = [
  {
    foreground: 'White',
    fgHex: '#ffffff',
    bg: 'PathAble Blue',
    bgHex: '#00365c',
    ratio: '12.48:1',
    level: 'AAA',
  },
  {
    foreground: 'PathAble Blue',
    fgHex: '#00365c',
    bg: 'Shilling Silver',
    bgHex: '#dde2e8',
    ratio: '9.58:1',
    level: 'AAA',
  },
  {
    foreground: 'Lived-In Lime',
    fgHex: '#d3ff66',
    bg: 'PathAble Blue',
    bgHex: '#00365c',
    ratio: '10.86:1',
    level: 'AAA',
  },
  {
    foreground: 'White',
    fgHex: '#ffffff',
    bg: 'Tech Teal',
    bgHex: '#015a76',
    ratio: '7.71:1',
    level: 'AAA',
  },
  {
    foreground: 'Tech Teal (link)',
    fgHex: '#015a76',
    bg: 'White',
    bgHex: '#ffffff',
    ratio: '7.71:1',
    level: 'AAA',
  },
  {
    foreground: 'On-accent',
    fgHex: '#001a33',
    bg: 'Intelligent Jade',
    bgHex: '#1cae96',
    ratio: '6.31:1',
    level: 'AA',
  },
  {
    foreground: 'On-accent',
    fgHex: '#001a33',
    bg: 'Bright Blue Brooks',
    bgHex: '#4899e8',
    ratio: '5.85:1',
    level: 'AA',
  },
  {
    foreground: 'On-accent',
    fgHex: '#001a33',
    bg: 'Warning amber',
    bgHex: '#f5a623',
    ratio: '8.67:1',
    level: 'AAA',
  },
  {
    foreground: 'White',
    fgHex: '#ffffff',
    bg: 'Danger',
    bgHex: '#dc3545',
    ratio: '4.53:1',
    level: 'AA',
  },
  {
    foreground: 'White',
    fgHex: '#ffffff',
    bg: 'Bright Blue Brooks',
    bgHex: '#4899e8',
    ratio: '3.00:1',
    level: 'AA large text only',
  },
]

const failedPairings = [
  {
    foreground: 'White',
    fgHex: '#ffffff',
    bg: 'Intelligent Jade',
    bgHex: '#1cae96',
    ratio: '2.78:1',
    issue: 'Fails all text sizes, despite appearing in the brand book',
  },
  {
    foreground: 'PathAble Blue',
    fgHex: '#00365c',
    bg: 'Intelligent Jade',
    bgHex: '#1cae96',
    ratio: '4.48:1',
    issue: 'Fails AA for small text; use on-accent (#001a33)',
  },
  {
    foreground: 'Bright Blue Brooks',
    fgHex: '#4899e8',
    bg: 'White',
    bgHex: '#ffffff',
    ratio: '3.00:1',
    issue: 'Fails AA for small text; large text and graphics only',
  },
  {
    foreground: 'Lived-In Lime',
    fgHex: '#d3ff66',
    bg: 'White',
    bgHex: '#ffffff',
    ratio: '1.15:1',
    issue: 'Fails all levels',
  },
]

export const Default = {
  render: () => `
    <div style="font-family: system-ui, sans-serif; max-width: 960px; margin: 0 auto; padding: 2rem; color: #00365c;">

      <!-- Section 1: Introduction -->
      <section style="margin-bottom: 3rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 1rem; color: #00365c;">Brand Color Usage</h1>
        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 1rem; color: #015a76;">
          Every component color comes from the exact brand palette. Lighter and darker shades are
          derived from the brand colors, and the 10% tints match the brand book's tertiary colors.
        </p>
        <p style="font-size: 0.875rem; line-height: 1.6; margin: 0; color: #555;">
          Primary colors (PathAble Blue, Intelligent Jade, Bright Blue Brooks) should be the most prominent.
          Secondary colors (Tech Teal, Lived-In Lime, Shilling Silver) are accents and should never dominate.
        </p>
      </section>

      <!-- Section 2: Brand Color Swatches -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #00365c;">Brand Color Swatches</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
          ${brandColors
            .map(
              (c) => `
            <div style="flex: 0 0 280px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background: #fff;">
              <div style="height: 80px; background-color: ${c.exact}; display: flex; align-items: flex-end; padding: 0.5rem;">
                <span style="background: rgba(0,0,0,0.5); color: #fff; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">${c.role}</span>
              </div>
              <div style="padding: 0.75rem;">
                <div style="font-weight: 700; font-size: 0.875rem; margin-bottom: 0.375rem;">${c.name}</div>
                <div style="display: flex; gap: 0.75rem; font-size: 0.7rem; font-family: monospace; margin-bottom: 0.5rem;">
                  <div>
                    <div style="color: #555; margin-bottom: 0.125rem;">Exact</div>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                      <span style="display: inline-block; width: 12px; height: 12px; border-radius: 2px; background: ${c.exact}; border: 1px solid rgba(0,0,0,0.1);"></span>
                      ${c.exact}
                    </div>
                  </div>
                </div>
                <div style="font-size: 0.7rem; color: #444;">${c.use}</div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </section>

      <!-- Section 3: Color Hierarchy -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #00365c;">Color Hierarchy</h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
            <thead>
              <tr style="background: #00365c; color: #fff;">
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Brand Color</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Hex</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Role</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Usage</th>
              </tr>
            </thead>
            <tbody>
              ${brandColors
                .map(
                  (c, i) => `
                <tr style="border-bottom: 1px solid #eee; ${i % 2 === 0 ? 'background: #f9f9f9;' : ''}">
                  <td style="padding: 0.5rem 0.75rem; font-weight: 600;">${c.name}</td>
                  <td style="padding: 0.5rem 0.75rem; font-family: monospace;">
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 2px; background: ${c.exact}; border: 1px solid rgba(0,0,0,0.1);"></span>
                      ${c.exact}
                    </span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem;">${c.role}</td>
                  <td style="padding: 0.5rem 0.75rem; font-size: 0.75rem; color: #555;">${c.use}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Section 4: Semantic Tokens -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #00365c;">Semantic Tokens</h2>

        <!-- General -->
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #015a76;">General</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem;">
          ${generalTokens
            .map(
              (t) => `
            <div style="flex: 0 0 140px; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); background: #fff;">
              <div style="height: 48px; background-color: ${t.value}; ${['#ffffff', '#dde2e8', '#d3ff66'].includes(t.value) ? 'border-bottom: 1px solid #ddd;' : ''}"></div>
              <div style="padding: 0.5rem;">
                <div style="font-weight: 600; font-size: 0.7rem; margin-bottom: 0.125rem;">${t.name}</div>
                <div style="font-family: monospace; font-size: 0.6rem; color: #555;">${t.value}</div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>

        <!-- Action -->
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #015a76;">Action</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem;">
          ${actionTokens
            .map(
              (t) => `
            <div style="flex: 0 0 180px; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); background: #fff;">
              <div style="height: 48px; background-color: ${t.value};"></div>
              <div style="padding: 0.5rem;">
                <div style="font-weight: 600; font-size: 0.7rem; margin-bottom: 0.125rem;">${t.name}</div>
                <div style="font-family: monospace; font-size: 0.6rem; color: #555;">${t.value}</div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>

        <!-- Status -->
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #015a76;">Status</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem;">
          ${statusTokens
            .map((t) => {
              const isLightBg = ['#00365c', '#001a33', '#dc3545'].includes(
                t.value,
              )
                ? false
                : true
              return `
              <div style="flex: 0 0 160px; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); background: ${t.value}; padding: 0.75rem;">
                <div style="font-weight: 600; font-size: 0.7rem; margin-bottom: 0.125rem; color: ${isLightBg ? '#00365c' : '#fff'};">${t.name}</div>
                <div style="font-family: monospace; font-size: 0.6rem; color: ${isLightBg ? '#555' : 'rgba(255,255,255,0.7)'};">${t.value}</div>
              </div>
            `
            })
            .join('')}
        </div>

        <!-- Workflow -->
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #015a76;">Workflow</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
          ${workflowTokens
            .map(
              (t) => `
            <div style="flex: 0 0 160px; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); background: ${t.value}; padding: 0.75rem;">
              <div style="font-weight: 600; font-size: 0.7rem; margin-bottom: 0.125rem; color: ${t.value === '#4899e8' ? '#00365c' : '#fff'};">${t.name}</div>
              <div style="font-family: monospace; font-size: 0.6rem; color: ${t.value === '#4899e8' ? '#555' : 'rgba(255,255,255,0.7)'};">${t.value}</div>
            </div>
          `,
            )
            .join('')}
        </div>
      </section>

      <!-- Section 5: Color Pairings -->
      <section>
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #00365c;">Color Pairings</h2>

        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem; color: #1a7d38;">Approved Pairings</h3>
        <div style="overflow-x: auto; margin-bottom: 2rem;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
            <thead>
              <tr style="background: #1a7d38; color: #fff;">
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Foreground</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Background</th>
                <th style="padding: 0.5rem 0.75rem; text-align: center;">Contrast Ratio</th>
                <th style="padding: 0.5rem 0.75rem; text-align: center;">WCAG Level</th>
              </tr>
            </thead>
            <tbody>
              ${approvedPairings
                .map(
                  (p, i) => `
                <tr style="border-bottom: 1px solid #eee; ${i % 2 === 0 ? 'background: #f6fdf6;' : ''}">
                  <td style="padding: 0.5rem 0.75rem;">
                    <span style="display: flex; align-items: center; gap: 0.375rem;">
                      <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${p.fgHex}; border: 1px solid rgba(0,0,0,0.15);"></span>
                      ${p.foreground}
                    </span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem;">
                    <span style="display: flex; align-items: center; gap: 0.375rem;">
                      <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${p.bgHex}; border: 1px solid rgba(0,0,0,0.1);"></span>
                      ${p.bg} (${p.bgHex})
                    </span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem; text-align: center; font-family: monospace; font-weight: 600;">${p.ratio}</td>
                  <td style="padding: 0.5rem 0.75rem; text-align: center;">
                    <span style="background: #1a7d38; color: #fff; padding: 0.125rem 0.5rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600;">${p.level}</span>
                  </td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.75rem; color: #c00;">Do Not Use — Failed Pairings</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
            <thead>
              <tr style="background: #c00; color: #fff;">
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Foreground</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Background</th>
                <th style="padding: 0.5rem 0.75rem; text-align: center;">Contrast Ratio</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Issue</th>
              </tr>
            </thead>
            <tbody>
              ${failedPairings
                .map(
                  (p, i) => `
                <tr style="border-bottom: 1px solid #eee; ${i % 2 === 0 ? 'background: #fff5f5;' : ''}">
                  <td style="padding: 0.5rem 0.75rem;">
                    <span style="display: flex; align-items: center; gap: 0.375rem;">
                      <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${p.fgHex}; border: 1px solid rgba(0,0,0,0.15);"></span>
                      ${p.foreground} (${p.fgHex})
                    </span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem;">
                    <span style="display: flex; align-items: center; gap: 0.375rem;">
                      <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${p.bgHex}; border: 1px solid rgba(0,0,0,0.1);"></span>
                      ${p.bg} (${p.bgHex})
                    </span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem; text-align: center; font-family: monospace; font-weight: 600; color: #c00;">${p.ratio}</td>
                  <td style="padding: 0.5rem 0.75rem; color: #c00; font-size: 0.75rem;">${p.issue}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  `,
}
