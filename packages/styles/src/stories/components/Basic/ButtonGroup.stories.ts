export default {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-button-group">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
}

export const Wrapping = {
  render: () => `
    <div style="max-width: 20rem; padding: 0 0.25rem">
      <div class="pathable-button-group">
        <button class="pathable-button pathable-button--outline">Option One</button>
        <button class="pathable-button pathable-button--outline">Option Two</button>
        <button class="pathable-button pathable-button--outline">Option Three</button>
        <button class="pathable-button pathable-button--outline">Option Four</button>
      </div>
    </div>
  `,
}
