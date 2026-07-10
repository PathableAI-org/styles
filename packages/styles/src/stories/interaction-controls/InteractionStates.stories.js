export default {
  title: 'Interaction Controls/Interaction States',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (SCSS mixins)\n\n**Consumers must**: Include the `interaction-states` mixin in their component SCSS. No JavaScript required.\n\nReusable interaction state mixins that provide consistent hover, focus, active, selected, disabled, and loading behavior across all custom PathAble components.',
      },
    },
  },
}

const demoCard = (state, label, classExtras = '') => `
  <div class="pathable-interaction-states-demo ${classExtras}" style="min-width: 200px;">
    <div style="font-size: 0.875rem; font-weight: 600;">${label}</div>
    <div style="font-size: 0.75rem; margin-top: 0.25rem; opacity: 0.7;">${state}</div>
  </div>
`

export const AllStates = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Interaction States</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Hover over each card to see the hover state. Tab to the rest card to see the focus ring.
      Selected and disabled states are shown below.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      ${demoCard('Rest', 'Rest (hover/focus me)', 'tabindex="0"')}
      ${demoCard('Selected', 'Selected', 'is-selected tabindex="0"')}
      ${demoCard('Disabled', 'Disabled', 'disabled')}
    </div>
  `,
}

export const LoadingState = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Loading State</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      The loading state shows a CSS-only border spinner and prevents interaction.
    </p>
    <div class="pathable-cluster" style="align-items: stretch;">
      ${demoCard('Loading', 'Loading', 'is-loading')}
    </div>
  `,
}

export const Default = AllStates
