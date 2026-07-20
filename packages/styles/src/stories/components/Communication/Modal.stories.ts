export default {
  title: 'Components/Communication/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Status**: CSS-only in this package. The React wrapper at `@pathable/react` provides JS behavior (open/close, focus trapping, keyboard Escape, scroll locking).\n\n**CSS markup**: Requires `.pathable-modal`, `.pathable-modal__content`, `.pathable-modal__heading`, `.pathable-modal__footer`, `.pathable-modal__close`.\n\n**Note**: The overlay is rendered by USWDS JS and is not a separate CSS class. The `pathable-modal__heading` replaces the title element. No `__overlay`, `__dialog`, `__header`, or `__title` selectors exist — the markup uses `__heading` for the heading and `__content` as the direct child of `pathable-modal`.\n\n**Consumers must**: Import `@pathable/styles` CSS. For JS behavior, use `@pathable/react` Modal component or import `@pathable/styles/js`. When using USWDS JS, keep `.usa-modal` on the DOM alongside `.pathable-modal`.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-modal">
      <div class="pathable-modal__content">
        <div class="pathable-modal__heading">
          <h2 id="modal-heading">Add Support Activity</h2>
          <button class="pathable-modal__close" aria-label="Close modal">&times;</button>
        </div>
        <p>Select the type of support activity to add to this participant's coaching plan. Activities are tied to employment goals and require supervisor approval.</p>
        <div class="pathable-modal__footer">
          <button class="pathable-button">Add Activity</button>
          <button class="pathable-button pathable-button--outline">Cancel</button>
        </div>
      </div>
    </div>
  `,
}
