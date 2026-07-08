export default {
  title: 'Components/Link',
  tags: ['autodocs'],
}

export const Default = {
  render: () => '<a href="#" class="pathable-link">Default Link</a>',
}

export const External = {
  render: () =>
    '<a href="#" class="pathable-link pathable-link--external">External Link</a>',
}

export const NavLink = {
  render: () =>
    '<a href="#" class="pathable-link pathable-link--nav">Nav Link</a>',
}
