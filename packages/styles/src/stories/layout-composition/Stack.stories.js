export default {
  title: 'Layout Composition/Stack',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nControls vertical flow between sibling elements using token-based spacing.',
      },
    },
  },
}

const childBlock = (label, color = '#dde2e8') => `
  <div style="background: ${color}; padding: 1rem; border-radius: 4px; border: 1px solid #ccc; text-align: center;">
    <span style="font-size: 0.875rem; color: #333;">${label}</span>
  </div>
`

export const GapSm = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Stack Gap SM</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">Gap: var(--space-8)</p>
    <div class="pathable-stack pathable-stack--gap-sm" style="max-width: 400px;">
      ${childBlock('Item 1')}
      ${childBlock('Item 2')}
      ${childBlock('Item 3')}
    </div>
  `,
}

export const GapMd = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Stack Gap MD (default)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">Gap: var(--space-16)</p>
    <div class="pathable-stack pathable-stack--gap-md" style="max-width: 400px;">
      ${childBlock('Item 1')}
      ${childBlock('Item 2')}
      ${childBlock('Item 3')}
    </div>
  `,
}

export const GapLg = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Stack Gap LG</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">Gap: var(--space-24)</p>
    <div class="pathable-stack pathable-stack--gap-lg" style="max-width: 400px;">
      ${childBlock('Item 1')}
      ${childBlock('Item 2')}
      ${childBlock('Item 3')}
    </div>
  `,
}

export const GapXl = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Stack Gap XL</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">Gap: var(--space-32)</p>
    <div class="pathable-stack pathable-stack--gap-xl" style="max-width: 400px;">
      ${childBlock('Item 1')}
      ${childBlock('Item 2')}
      ${childBlock('Item 3')}
    </div>
  `,
}

export const SingleChild = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Stack with Single Child</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      A stack with only one child renders with no visible spacing effect — gap has no effect with one child.
    </p>
    <div class="pathable-stack" style="max-width: 400px;">
      ${childBlock('Only Child')}
    </div>
  `,
}

export const Default = GapMd
