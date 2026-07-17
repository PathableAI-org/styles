export default {
  title: 'Brand/Color Usage',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.',
      },
    },
  },
}

const brandColors = [
  {
    name: 'PathAble Blue',
    exact: '#00365c',
    token: 'blue-warm-80v',
    mapped: '#162e51',
    deltaE: '5.56',
    use: 'Primary brand — backgrounds, navigation, headings',
  },
  {
    name: 'Intelligent Jade',
    exact: '#1cae96',
    token: 'mint-cool-30v',
    mapped: '#1dc2ae',
    deltaE: '7.84',
    use: 'Secondary brand — accents, success indicators',
  },
  {
    name: 'Bright Blue Brooks',
    exact: '#4899e8',
    token: 'blue-30v',
    mapped: '#58b4ff',
    deltaE: '10.70',
    use: 'Links, interactive elements',
  },
  {
    name: 'Tech Teal',
    exact: '#015a76',
    token: 'cyan-60v',
    mapped: '#00687d',
    deltaE: '8.10',
    use: 'Muted text, supporting backgrounds',
  },
  {
    name: 'Lived-In Lime',
    exact: '#d3ff66',
    token: 'green-warm-10v',
    mapped: '#e7f434',
    deltaE: '18.97',
    use: 'Accent on dark backgrounds, highlights',
  },
  {
    name: 'Shilling Silver',
    exact: '#dde2e8',
    token: 'gray-cool-10',
    mapped: '#dfe1e2',
    deltaE: '2.79',
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
  { name: 'link', token: '--pathable-color-link', value: '#4899e8' },
  { name: 'accent', token: '--pathable-color-accent', value: '#1cae96' },
  {
    name: 'focus-ring',
    token: '--pathable-color-focus-ring',
    value: '#4497f5',
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
    value: '#00365c',
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
    value: '#00365c',
  },
  {
    name: 'status-warning-bg',
    token: '--pathable-color-status-warning-bg',
    value: '#f5a623',
  },
  {
    name: 'status-warning-text',
    token: '--pathable-color-status-warning-text',
    value: '#00365c',
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
    bg: 'PathAble Blue',
    bgHex: '#162e51',
    ratio: '13.60:1',
    level: 'AAA',
  },
  {
    foreground: 'White',
    bg: 'Tech Teal',
    bgHex: '#00687d',
    ratio: '6.41:1',
    level: 'AA',
  },
  {
    foreground: 'PathAble Blue',
    bg: 'Intelligent Jade',
    bgHex: '#1dc2ae',
    ratio: '6.08:1',
    level: 'AA',
  },
  {
    foreground: 'PathAble Blue',
    bg: 'Gold warning',
    bgHex: '#f5a623',
    ratio: '6.71:1',
    level: 'AA',
  },
  {
    foreground: 'White',
    bg: 'Danger',
    bgHex: '#dc3545',
    ratio: '4.53:1',
    level: 'AA',
  },
  {
    foreground: 'Shilling Silver',
    bg: 'PathAble Blue',
    bgHex: '#162e51',
    ratio: '9.58:1',
    level: 'AAA',
  },
]

const failedPairings = [
  {
    foreground: 'White',
    bg: 'Intelligent Jade',
    bgHex: '#1dc2ae',
    ratio: '2.24:1',
    issue: 'Fails AA (small text)',
  },
  {
    foreground: 'White',
    bg: 'Bright Blue Brooks',
    bgHex: '#58b4ff',
    ratio: '2.24:1',
    issue: 'Fails AA (small text)',
  },
  {
    foreground: 'Lived-In Lime',
    fgHex: '#e7f434',
    bg: 'White',
    bgHex: '#ffffff',
    ratio: '1.21:1',
    issue: 'Fails all levels',
  },
  {
    foreground: 'Bright Blue Brooks',
    fgHex: '#58b4ff',
    bg: 'White',
    bgHex: '#ffffff',
    ratio: '2.24:1',
    issue: 'Link color — decorative use only on light backgrounds',
  },
]

export const Default = {
  render: () => `
    <div style="font-family: system-ui, sans-serif; max-width: 960px; margin: 0 auto; padding: 2rem; color: #162e51;">

      <!-- Section 1: Introduction -->
      <section style="margin-bottom: 3rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Brand Color Usage</h1>
        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 1rem; color: #00687d;">
          The design system preserves brand semantics through USWDS token mapping, not exact brand reproduction.
        </p>
        <p style="font-size: 0.875rem; line-height: 1.6; margin: 0; color: #555;">
          Each PathAble brand color has been mapped to the closest USWDS v3.x system token.
          The table below shows the exact brand hex, the USWDS token it maps to, the resulting mapped hex,
          and the perceptual difference (ΔE76) between them. Values below 10 are imperceptible to most viewers.
        </p>
      </section>

      <!-- Section 2: Brand Color Swatches -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Brand Color Swatches</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
          ${brandColors
            .map(
              (c) => `
            <div style="flex: 0 0 280px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background: #fff;">
              <div style="height: 80px; background-color: ${c.mapped}; display: flex; align-items: flex-end; padding: 0.5rem;">
                <span style="background: rgba(0,0,0,0.5); color: #fff; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">${c.token}</span>
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
                  <div>
                    <div style="color: #555; margin-bottom: 0.125rem;">Mapped</div>
                    <div style="display: flex; align-items: center; gap: 0.25rem;">
                      <span style="display: inline-block; width: 12px; height: 12px; border-radius: 2px; background: ${c.mapped}; border: 1px solid rgba(0,0,0,0.1);"></span>
                      ${c.mapped}
                    </div>
                  </div>
                  <div>
                    <div style="color: #555; margin-bottom: 0.125rem;">ΔE</div>
                    <div style="font-weight: 600;">${c.deltaE}</div>
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

      <!-- Section 3: USWDS Mapping Table -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">USWDS Mapping Table</h2>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
            <thead>
              <tr style="background: #162e51; color: #fff;">
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Brand Color</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Exact Hex</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">USWDS Token</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Mapped Hex</th>
                <th style="padding: 0.5rem 0.75rem; text-align: center;">ΔE</th>
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
                  <td style="padding: 0.5rem 0.75rem; font-family: monospace;">${c.token}</td>
                  <td style="padding: 0.5rem 0.75rem; font-family: monospace;">
                    <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
                      <span style="display: inline-block; width: 10px; height: 10px; border-radius: 2px; background: ${c.mapped}; border: 1px solid rgba(0,0,0,0.1);"></span>
                      ${c.mapped}
                    </span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem; text-align: center; font-family: monospace; ${parseFloat(c.deltaE) > 10 ? 'color: #c00; font-weight: 600;' : ''}">${c.deltaE}</td>
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
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Semantic Tokens</h2>

        <!-- General -->
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #00687d;">General</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem;">
          ${generalTokens
            .map(
              (t) => `
            <div style="flex: 0 0 140px; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); background: #fff;">
              <div style="height: 48px; background-color: ${t.value}; ${['#ffffff', '#dde2e8', '#dfe1e2', '#e7f434'].includes(t.value) ? 'border-bottom: 1px solid #ddd;' : ''}"></div>
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
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #00687d;">Action</h3>
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
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #00687d;">Status</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem;">
          ${statusTokens
            .map((t) => {
              const isLightBg = ['#00365c', '#dc3545'].includes(t.value)
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
        <h3 style="font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; color: #00687d;">Workflow</h3>
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
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Color Pairings</h2>

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
                      <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${p.foreground === 'White' ? '#fff' : p.foreground === 'PathAble Blue' ? '#162e51' : p.foreground === 'Shilling Silver' ? '#dfe1e2' : '#ddd'}; border: 1px solid rgba(0,0,0,0.15);"></span>
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
                      <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${p.fgHex || (p.foreground === 'White' ? '#fff' : p.foreground === 'Lived-In Lime' ? '#e7f434' : p.foreground === 'Bright Blue Brooks' ? '#58b4ff' : p.foreground === 'PathAble Blue' ? '#162e51' : '#ddd')}; border: 1px solid rgba(0,0,0,0.15);"></span>
                      ${p.foreground}${p.fgHex ? ` (${p.fgHex})` : ''}
                    </span>
                  </td>
                  <td style="padding: 0.5rem 0.75rem;">
                    <span style="display: flex; align-items: center; gap: 0.375rem;">
                      <span style="display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: ${p.bgHex}; border: 1px solid rgba(0,0,0,0.1);"></span>
                      ${p.bg}${p.bgHex && p.bg !== 'White' ? ` (${p.bgHex})` : p.bg === 'White' ? ' (#ffffff)' : ''}
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
