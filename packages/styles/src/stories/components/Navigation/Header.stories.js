export default {
  title: 'Components/Navigation/Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component requires USWDS JavaScript for full interactivity (header toggle, nav menu, etc.). Only static CSS documentation is provided here. See the USWDS documentation for JS setup.',
      },
    },
  },
}

export const Default = {
  render: () => `
<header class="pathable-header pathable-header--basic usa-header usa-header--basic">
  <div class="pathable-nav-container">
    <div class="pathable-navbar">
      <div class="pathable-logo" id="basic-logo">
        <em class="pathable-logo__text">
          <a href="#">Site Title</a>
        </em>
      </div>
      <button class="pathable-menu-btn">Menu</button>
    </div>
    <nav class="pathable-nav usa-nav" aria-label="Primary navigation">
      <ul class="pathable-nav__primary">
        <li class="pathable-nav__primary-item">
          <a href="#"><span>Nav Item 1</span></a>
        </li>
        <li class="pathable-nav__primary-item">
          <a href="#"><span>Nav Item 2</span></a>
        </li>
        <li class="pathable-nav__primary-item">
          <a href="#"><span>Nav Item 3</span></a>
        </li>
      </ul>
    </nav>
  </div>
</header>
  `,
}
