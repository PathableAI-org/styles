export default {
  title: 'Components/Tag',
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
  render: () => '<span class="pathable-tag">Default Tag</span>',
}

export const Big = {
  render: () => '<span class="pathable-tag pathable-tag--big">Big Tag</span>',
}
