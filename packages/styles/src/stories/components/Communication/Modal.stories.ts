export default {
  title: 'Components/Communication/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Status**: The source markup is enhanced by `@pathableai/styles/js`, which creates the wrapper and backdrop, manages visibility, traps focus, handles Escape, locks scrolling, and isolates background content. The React wrapper at `@pathableai/react` owns the equivalent behavior itself.\n\n**CSS markup**: The enhanced structure uses `.pathable-modal-wrapper`, `.pathable-modal-overlay`, `.pathable-modal`, `.pathable-modal__content`, `.pathable-modal__main`, `.pathable-modal__heading`, `.pathable-modal__footer`, and `.pathable-modal__close`.\n\n**Consumers must**: Import `@pathableai/styles` CSS and either import `@pathableai/styles/js` for source markup or use the React `Modal`. Keep matching `.usa-*` classes on source markup for USWDS nested style selectors.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <button class="pathable-button usa-button" type="button" aria-controls="support-activity-modal" data-open-modal>
      Add support activity
    </button>
    <div class="pathable-modal usa-modal" id="support-activity-modal" aria-labelledby="modal-heading" aria-describedby="modal-description">
      <div class="pathable-modal__content usa-modal__content">
        <div class="pathable-modal__main usa-modal__main">
          <h2 class="pathable-modal__heading usa-modal__heading" id="modal-heading">Add Support Activity</h2>
          <div id="modal-description">
            <p>Select the type of support activity to add to this participant's coaching plan. Activities are tied to employment goals and require supervisor approval.</p>
          </div>
          <div class="pathable-modal__footer usa-modal__footer">
            <button class="pathable-button usa-button" type="button" data-close-modal>Add Activity</button>
            <button class="pathable-button usa-button pathable-button--outline usa-button--outline" type="button" data-close-modal>Cancel</button>
          </div>
        </div>
        <button class="pathable-button usa-button pathable-modal__close usa-modal__close" type="button" aria-label="Close modal" data-close-modal>&times;</button>
      </div>
    </div>
  `,
}
