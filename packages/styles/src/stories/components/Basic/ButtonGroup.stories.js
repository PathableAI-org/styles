export default {
  title: 'Components/Button Group',
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

export const Default = {
  render: () => `
    <div class="pathable-button-group">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
}

export const Segmented = {
  render: () => `
    <div class="pathable-button-group pathable-button-group--segmented">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
}
