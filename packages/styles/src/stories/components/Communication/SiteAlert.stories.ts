export default {
  title: 'Components/Communication/Site Alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only in this package. Dismiss behavior may be provided by external JS.\n\n**Consumers must**: Import `@pathable/styles` CSS.\n\n**CSS markup**: Uses `.pathable-site-alert`, `.pathable-site-alert--info`, `.pathable-site-alert--emergency`, `.pathable-site-alert--slim`. The `--warning` variant is NOT implemented. No `__body`, `__heading`, or `__text` sub-element classes exist — all content uses semantic HTML without absent class names.\n\n**No dismissal built in**: This component does not include dismissal behavior by default. If dismissal is needed, consumers must implement it via external JavaScript.',
      },
    },
  },
}

export const Info = {
  render: () => `
    <div class="pathable-site-alert pathable-site-alert--info" role="alert">
      <h3>Site Notice</h3>
      <p>This site uses cookies to improve your experience.</p>
    </div>
  `,
}

export const Default = Info

export const Emergency = {
  render: () => `
    <div class="pathable-site-alert pathable-site-alert--emergency" role="alert">
      <h3>Emergency Alert</h3>
      <p>Please follow all official guidance and check for updates regularly.</p>
    </div>
  `,
}

export const Slim = {
  render: () => `
    <div class="pathable-site-alert pathable-site-alert--slim" role="alert">
      <p>A slim site alert with minimal padding for compact notifications.</p>
    </div>
  `,
}
