export default {
  title: 'Components/Navigation/Sidenav',
  tags: ['autodocs'],
};

export const Default = {
  render: () => `
<aside class="pathable-sidenav">
  <ul class="pathable-sidenav__sublist">
    <li class="pathable-sidenav__item">
      <a href="#">Parent link</a>
      <ul class="pathable-sidenav__sublist">
        <li class="pathable-sidenav__item">
          <a href="#">Child link</a>
        </li>
        <li class="pathable-sidenav__item">
          <a href="#">Child link</a>
          <ul class="pathable-sidenav__sublist">
            <li class="pathable-sidenav__item">
              <a href="#">Grandchild link</a>
            </li>
            <li class="pathable-sidenav__item">
              <a href="#">Grandchild link</a>
            </li>
          </ul>
        </li>
        <li class="pathable-sidenav__item">
          <a href="#">Child link</a>
        </li>
      </ul>
    </li>
    <li class="pathable-sidenav__item">
      <a href="#">Parent link</a>
    </li>
  </ul>
</aside>
  `,
};