export default {
  title: 'Components/Communication/Site Alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Note:** This component requires USWDS JavaScript for full interactivity (site alert dismiss, etc.). Only static CSS documentation is provided here. See the USWDS documentation for JS setup.',
      },
    },
  },
}

export const Info = {
  render: () => `
    <div class="pathable-site-alert pathable-site-alert--info" role="alert">
      <div class="pathable-site-alert__body">
        <h3 class="pathable-site-alert__heading">Site Notice</h3>
        <p class="pathable-site-alert__text">This site uses cookies to improve your experience.</p>
      </div>
    </div>
  `,
}

export const Default = Info

export const Warning = {
  render: () => `
    <div class="pathable-site-alert pathable-site-alert--warning" role="alert">
      <div class="pathable-site-alert__body">
        <h3 class="pathable-site-alert__heading">Scheduled Maintenance</h3>
        <p class="pathable-site-alert__text">This site will be undergoing maintenance on Saturday from 2:00 AM to 6:00 AM EST.</p>
      </div>
    </div>
  `,
}

export const Emergency = {
  render: () => `
    <div class="pathable-site-alert pathable-site-alert--emergency" role="alert">
      <div class="pathable-site-alert__body">
        <h3 class="pathable-site-alert__heading">Emergency Alert</h3>
        <p class="pathable-site-alert__text">Please follow all official guidance and check for updates regularly.</p>
      </div>
    </div>
  `,
}

export const Slim = {
  render: () => `
    <div class="pathable-site-alert pathable-site-alert--slim" role="alert">
      <div class="pathable-site-alert__body">
        <p class="pathable-site-alert__text">A slim site alert with minimal padding for compact notifications.</p>
      </div>
    </div>
  `,
}
