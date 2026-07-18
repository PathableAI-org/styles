export default {
  title: 'Components/Navigation/Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathable/styles/js` to enable interactive behavior.\n\n**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: Mobile menu toggle, responsive navigation\n**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.',
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
          <a href="#">PathAble</a>
        </em>
      </div>
      <button class="pathable-menu-btn">Menu</button>
    </div>
    <nav class="pathable-nav usa-nav" aria-label="Primary navigation">
      <ul class="pathable-nav__primary">
        <li class="pathable-nav__primary-item">
          <a href="#"><span>Participants</span></a>
        </li>
        <li class="pathable-nav__primary-item">
          <a href="#"><span>Coaching Sessions</span></a>
        </li>
        <li class="pathable-nav__primary-item">
          <a href="#"><span>Support Activities</span></a>
        </li>
      </ul>
    </nav>
  </div>
</header>
  `,
}
