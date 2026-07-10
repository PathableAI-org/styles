export default {
  title: 'Components/Navigation/Breadcrumb',
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
<nav class="pathable-breadcrumb" aria-label="Breadcrumbs">
  <ol class="pathable-breadcrumb__list">
    <li class="pathable-breadcrumb__list-item">
      <a class="pathable-breadcrumb__link" href="#">Home</a>
    </li>
    <li class="pathable-breadcrumb__list-item">
      <a class="pathable-breadcrumb__link" href="#">Participants</a>
    </li>
    <li class="pathable-breadcrumb__list-item">
      <a class="pathable-breadcrumb__link" href="#">J. Doe</a>
    </li>
    <li class="pathable-breadcrumb__list-item" aria-current="page">
      Coaching Notes
    </li>
  </ol>
</nav>
  `,
}
