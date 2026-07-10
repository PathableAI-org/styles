export default {
  title: 'Components/Communication/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathable/styles/js` to enable interactive behavior.\n\n**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: Open/close, focus trapping, keyboard navigation (Escape to close), scroll locking\n**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-modal">
      <div class="pathable-modal__overlay"></div>
      <div class="pathable-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
        <div class="pathable-modal__content">
          <div class="pathable-modal__header">
            <h2 id="modal-heading" class="pathable-modal__title">Add Support Activity</h2>
            <button class="pathable-modal__close" aria-label="Close modal">&times;</button>
          </div>
          <div class="pathable-modal__body">
            <p>Select the type of support activity to add to this participant's coaching plan. Activities are tied to employment goals and require supervisor approval.</p>
          </div>
          <div class="pathable-modal__footer">
            <button class="pathable-button">Add Activity</button>
            <button class="pathable-button pathable-button--outline">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
}
