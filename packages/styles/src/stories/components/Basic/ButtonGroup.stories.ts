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

export const Segmented = {
  render: () => `
    <div class="pathable-button-group pathable-button-group--segmented">
      <button class="pathable-button pathable-button--outline">Option One</button>
      <button class="pathable-button pathable-button--outline">Option Two</button>
      <button class="pathable-button pathable-button--outline">Option Three</button>
    </div>
  `,
}

export const NarrowContainer = {
  render: () => `
    <div style="max-width: 20rem; padding: 1.5rem; border: 1px solid currentColor">
      <div class="pathable-button-group">
        <button class="pathable-button pathable-button--outline">Cancel</button>
        <button class="pathable-button">Delete Permanently</button>
        <button class="pathable-button pathable-button--outline">Keep Both Copies</button>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story:
          'In a container too narrow for one row, from 480 px the buttons wrap onto a new line instead of running past the container.',
      },
    },
  },
}
