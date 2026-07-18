export default {
  title: 'Components/Navigation/Skipnav',
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
<a class="pathable-skipnav" href="#main-content">
  Skip to main content
</a>
  `,
}
