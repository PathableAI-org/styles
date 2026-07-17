export default {
  title: 'Components/Navigation/Sidenav',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n**App State to Manage**: active navigation item\n**Consumers must**: Provide state management for active navigation item in application framework.',
      },
    },
  },
}

export const Default = {
  render: () => `
<aside class="pathable-sidenav">
  <ul class="pathable-sidenav__sublist">
    <li class="pathable-sidenav__item">
      <a href="#" class="pathable-current" aria-current="page">Today's Sessions</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Participants</a>
      <ul class="pathable-sidenav__sublist">
        <li class="pathable-sidenav__item">
          <a href="#">All Participants</a>
        </li>
        <li class="pathable-sidenav__item">
          <a href="#">Add Participant</a>
        </li>
      </ul>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Approvals</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Reports</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Templates</a>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Settings</a>
    </li>
  </ul>
</aside>
  `,
}
