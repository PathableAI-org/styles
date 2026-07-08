export default {
  title: 'Components/Navigation/Breadcrumb',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<nav class="pathable-breadcrumb" aria-label="Breadcrumbs">
  <ol class="pathable-breadcrumb__list">
    <li class="pathable-breadcrumb__list-item">
      <a class="pathable-breadcrumb__link" href="#">Home</a>
    </li>
    <li class="pathable-breadcrumb__list-item">
      <a class="pathable-breadcrumb__link" href="#">Federal Contracting</a>
    </li>
    <li class="pathable-breadcrumb__list-item">
      <a class="pathable-breadcrumb__link" href="#">Contracting Assistance Programs</a>
    </li>
    <li class="pathable-breadcrumb__list-item" aria-current="page">
      Women-Owned Small Businesses
    </li>
  </ol>
</nav>
  `,
}
