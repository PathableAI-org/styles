export default {
  title: 'Components/Communication/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '**Note:** This component requires USWDS JavaScript for full interactivity (modal open/close toggle, etc.). Only static CSS documentation is provided here. See the USWDS documentation for JS setup.',
      },
    },
  },
};

export const Default = {
  render: () => `
    <div class="pathable-modal">
      <div class="pathable-modal__overlay"></div>
      <div class="pathable-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
        <div class="pathable-modal__content">
          <div class="pathable-modal__header">
            <h2 id="modal-heading" class="pathable-modal__title">Modal Title</h2>
            <button class="pathable-modal__close" aria-label="Close modal">&times;</button>
          </div>
          <div class="pathable-modal__body">
            <p>This is the modal body content. Modals display content that requires user attention.</p>
          </div>
          <div class="pathable-modal__footer">
            <button class="pathable-button">Confirm</button>
            <button class="pathable-button pathable-button--outline">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
};