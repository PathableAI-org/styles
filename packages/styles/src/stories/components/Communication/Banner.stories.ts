export default {
  title: 'Components/Communication/Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathable/styles/js` to enable interactive behavior.\n\n**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: Dismiss, keyboard navigation\n**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-banner">
      <div class="pathable-banner__content">
        <p class="pathable-banner__text">Reminder: Session documentation must be completed within 24 hours. <a href="#">View compliance policy</a>.</p>
        <button class="pathable-banner__button" aria-label="Close banner">
          Close
        </button>
      </div>
    </div>
  `,
}
