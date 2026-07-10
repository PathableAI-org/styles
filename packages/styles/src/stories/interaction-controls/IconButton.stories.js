export default {
  title: 'Interaction Controls/IconButton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (with CSS-driven interactive states)\n\n**Consumers must**: Import `@pathable/styles` CSS. Icon buttons require an accessible name via `aria-label` on the button element.',
      },
    },
  },
}

const closeIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
  </svg>
`

const iconButton = (variant, label) => `
  <button class="pathable-icon-button ${variant}" aria-label="${label}">
    ${closeIcon}
  </button>
`

export const AllVariants = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">All Appearance Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Icon buttons in all five appearance variants. Hover and focus each button to see the interactive state transitions.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      ${iconButton('pathable-icon-button--bare', 'Bare')}
      ${iconButton('pathable-icon-button--subtle', 'Subtle')}
      ${iconButton('pathable-icon-button--bordered', 'Bordered')}
      ${iconButton('pathable-icon-button--inverse', 'Inverse')}
      ${iconButton('pathable-icon-button--destructive', 'Destructive')}
    </div>
  `,
}

export const AllSizes = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">All Size Variants</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Compact (32px), default (44px), and large (52px) icon buttons using the subtle variant. WCAG minimum touch target is 44px.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      <div style="text-align: center;">
        <button class="pathable-icon-button pathable-icon-button--subtle pathable-icon-button--compact" aria-label="Close">
          ${closeIcon}
        </button>
        <div style="font-size: 0.75rem; margin-top: 0.25rem; color: #666;">Compact (32px)</div>
      </div>
      <div style="text-align: center;">
        <button class="pathable-icon-button pathable-icon-button--subtle" aria-label="Close">
          ${closeIcon}
        </button>
        <div style="font-size: 0.75rem; margin-top: 0.25rem; color: #666;">Default (44px)</div>
      </div>
      <div style="text-align: center;">
        <button class="pathable-icon-button pathable-icon-button--subtle pathable-icon-button--large" aria-label="Close">
          ${closeIcon}
        </button>
        <div style="font-size: 0.75rem; margin-top: 0.25rem; color: #666;">Large (52px)</div>
      </div>
    </div>
  `,
}

export const CircleShape = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Circle Shape</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Icon buttons with the \`--circle\` modifier in bare, subtle, and bordered variants. Circular shape uses \`border-radius: 50%\`.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      ${iconButton('pathable-icon-button--bare pathable-icon-button--circle', 'Bare Circle')}
      ${iconButton('pathable-icon-button--subtle pathable-icon-button--circle', 'Subtle Circle')}
      ${iconButton('pathable-icon-button--bordered pathable-icon-button--circle', 'Bordered Circle')}
    </div>
  `,
}

export const OnDifferentSurfaces = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">On Different Surfaces</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Bare icon buttons on base, brand, and inverse surfaces. Tab through to verify focus ring visibility across all surface types.
    </p>
    <div class="pathable-cluster pathable-cluster--gap-lg" style="align-items: center;">
      <div class="pathable-surface pathable-surface--base" style="padding: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">
        <button class="pathable-icon-button pathable-icon-button--bare" aria-label="Close">
          ${closeIcon}
        </button>
      </div>
      <div class="pathable-surface pathable-surface--brand" style="padding: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">
        <button class="pathable-icon-button pathable-icon-button--bare" aria-label="Close">
          ${closeIcon}
        </button>
      </div>
      <div class="pathable-surface pathable-surface--inverse" style="padding: 1.5rem; display: inline-flex; align-items: center; justify-content: center;">
        <button class="pathable-icon-button pathable-icon-button--bare" aria-label="Close">
          ${closeIcon}
        </button>
      </div>
    </div>
    <p style="color: #888; font-size: 0.8rem; margin-top: 0.75rem;">
      Surfaces (left to right): base, brand (<code>.pathable-surface--brand</code>), inverse (<code>.pathable-surface--inverse</code>).
    </p>
  `,
}

export const Default = AllVariants
