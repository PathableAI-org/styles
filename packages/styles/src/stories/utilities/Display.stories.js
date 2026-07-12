export default {
  title: 'Utilities/Display',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.',
      },
    },
  },
}

const displayValues = [
  { name: 'Flex', class: 'pathable-display-flex' },
  { name: 'Block', class: 'pathable-display-block' },
  { name: 'Inline', class: 'pathable-display-inline' },
  { name: 'Inline Block', class: 'pathable-display-inline-block' },
  { name: 'None', class: 'pathable-display-none' },
]

const sampleStyle =
  'background: var(--pathable-color-bg, #dde2e8); color: var(--pathable-color-text, #00365c); padding: 0.5rem; border: 1px dashed var(--pathable-color-text, #00365c);'

const chipStyle =
  'background: var(--pathable-color-action-primary-bg, #00365c); color: var(--pathable-color-action-primary-text, #fff); padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 2px;'

const markerStyle =
  'background: var(--pathable-color-surface, #fff); color: var(--pathable-color-text-muted, #444); border: 1px solid var(--pathable-color-border, #dde2e8); padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 2px;'

const renderPreview = (cls) => {
  if (cls === 'pathable-display-flex') {
    return `
      <div class="${cls}" style="${sampleStyle} gap: 0.5rem;">
        <span style="${chipStyle}">Item 1</span>
        <span style="${chipStyle}">Item 2</span>
        <span style="${chipStyle}">Item 3</span>
      </div>
    `
  }

  if (cls === 'pathable-display-block') {
    return `
      <div>
        <span style="${markerStyle}">Before</span>
        <span class="${cls}" style="${sampleStyle} margin: 0.375rem 0;">Item 1</span>
        <span style="${markerStyle}">After</span>
      </div>
    `
  }

  if (cls === 'pathable-display-inline') {
    return `
      <p style="margin: 0; line-height: 2.2;">
        <span style="${markerStyle}">Before text</span>
        <span class="${cls}" style="${sampleStyle}">Item 1</span>
        <span style="${markerStyle}">After text</span>
      </p>
    `
  }

  if (cls === 'pathable-display-inline-block') {
    return `
      <p style="margin: 0; line-height: 2.2;">
        <span style="${markerStyle}">Before text</span>
        <span class="${cls}" style="${sampleStyle} width: 7rem; height: 3rem; vertical-align: middle;">Item 1</span>
        <span style="${markerStyle}">After text</span>
      </p>
    `
  }

  return `
    <div>
      <span style="${markerStyle}">Before</span>
      <span class="${cls}" style="${sampleStyle}">Hidden Item</span>
      <span style="${markerStyle}">After</span>
      <span style="color: var(--pathable-color-text-muted, #444); font-size: 0.75rem; margin-left: 0.5rem;">Hidden item occupies no space</span>
    </div>
  `
}

export const AllValues = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Display Utility Classes</h3>
      <p style="color: var(--pathable-color-text-muted, #444); font-size: 0.875rem; margin: 0 0 1.5rem;">
        Classes: <code>.pathable-display-flex</code>, <code>.pathable-display-block</code>, etc.
      </p>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${displayValues
          .map(
            ({ name, class: cls }) => `
          <div style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background: var(--pathable-color-surface, #f9f9f9); border-radius: 4px;">
            <span style="width: 120px; font-weight: 600; font-size: 0.875rem;">${name}</span>
            <div style="flex: 1; min-width: 0;">${renderPreview(cls)}</div>
            <span style="font-family: monospace; font-size: 0.7rem; color: var(--pathable-color-text-muted, #555); margin-left: auto;">.${cls}</span>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  `,
}

export const Default = AllValues

export const ResponsiveVariants = {
  render: () => `
    <div style="padding: 1rem;">
      <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Responsive Display Variants</h3>
      <p style="color: #444; font-size: 0.875rem; margin: 0 0 1rem;">
        Display utilities support responsive breakpoints. Format:
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.mobile-lg\\:pathable-display-flex</code>
          <span style="color: #444; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; flex at 480px+</span>
        </div>
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.tablet\\:pathable-display-none</code>
          <span style="color: #444; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; hidden at 640px+</span>
        </div>
        <div style="padding: 0.75rem; background: #f9f9f9; border-radius: 4px;">
          <code style="font-size: 0.875rem;">.desktop\\:pathable-display-block</code>
          <span style="color: #444; font-size: 0.8rem; margin-left: 0.5rem;">&mdash; block at 1024px+</span>
        </div>
      </div>
      <p style="color: #444; font-size: 0.875rem; margin: 1rem 0 0;">
        Available breakpoints: <code>mobile-lg</code> (480px), <code>tablet</code> (640px), <code>desktop</code> (1024px)
      </p>
    </div>
  `,
}
