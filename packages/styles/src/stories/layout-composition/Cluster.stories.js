export default {
  title: 'Layout Composition/Cluster',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nWrapping horizontal layout for grouping related items such as tags, buttons, and controls.',
      },
    },
  },
}

const tag = (label) => `
  <span style="display: inline-block; background: #00365c; color: #fff; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem;">
    ${label}
  </span>
`

const button = (label) => `
  <button style="padding: 0.5rem 1rem; background: #fff; border: 1px solid #00365c; border-radius: 4px; font-size: 0.875rem; cursor: pointer;">
    ${label}
  </button>
`

export const GapSm = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Cluster Gap SM</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">Gap: var(--space-4) — compact item grouping</p>
    <div class="pathable-cluster pathable-cluster--gap-sm" style="max-width: 400px; padding: 1rem; background: #f5f7f9; border-radius: 4px;">
      ${tag('HTML')}
      ${tag('CSS')}
      ${tag('JavaScript')}
      ${tag('TypeScript')}
      ${tag('React')}
      ${tag('Vue')}
      ${tag('Svelte')}
      ${tag('Angular')}
    </div>
  `,
}

export const GapMd = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Cluster Gap MD (default)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">Gap: var(--space-8)</p>
    <div class="pathable-cluster" style="max-width: 400px; padding: 1rem; background: #f5f7f9; border-radius: 4px;">
      ${tag('HTML')}
      ${tag('CSS')}
      ${tag('JavaScript')}
      ${tag('TypeScript')}
      ${tag('React')}
      ${tag('Vue')}
      ${tag('Svelte')}
      ${tag('Angular')}
    </div>
  `,
}

export const AlignVariants = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Cluster Alignment Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Items can be aligned to start, center, end, or stretch.
    </p>
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Align Start</span>
        <div class="pathable-cluster pathable-cluster--align-start" style="max-width: 400px; padding: 0.5rem; background: #f5f7f9; border-radius: 4px;">
          ${button('Small')}
          ${button('Medium Button')}
          ${button('Larger Button Here')}
        </div>
      </div>
      <div>
        <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Align Center (default)</span>
        <div class="pathable-cluster" style="max-width: 400px; padding: 0.5rem; background: #f5f7f9; border-radius: 4px;">
          ${button('Small')}
          ${button('Medium Button')}
          ${button('Larger Button Here')}
        </div>
      </div>
      <div>
        <span style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.25rem;">Align End</span>
        <div class="pathable-cluster pathable-cluster--align-end" style="max-width: 400px; padding: 0.5rem; background: #f5f7f9; border-radius: 4px;">
          ${button('Small')}
          ${button('Medium Button')}
          ${button('Larger Button Here')}
        </div>
      </div>
    </div>
  `,
}

export const OverflowWrap = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Overflow Wrap</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      When items exceed the container width, they wrap naturally to the next line.
    </p>
    <div class="pathable-cluster" style="max-width: 300px; padding: 1rem; background: #f5f7f9; border-radius: 4px; border: 1px dashed #ccc;">
      ${tag('One')}
      ${tag('Two')}
      ${tag('Three')}
      ${tag('Four')}
      ${tag('Five')}
      ${tag('Six')}
      ${tag('Seven')}
      ${tag('Eight')}
    </div>
  `,
}

export const Default = GapMd
