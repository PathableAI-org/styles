export default {
  title: 'Components/Communication/Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Note:** This component requires USWDS JavaScript for full interactivity (banner dismiss, etc.). Only static CSS documentation is provided here. See the USWDS documentation for JS setup.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-banner">
      <div class="pathable-banner__content">
        <p class="pathable-banner__text">This is an official government website. <a href="#">Learn more</a>.</p>
        <button class="pathable-banner__button" aria-label="Close banner">
          Close
        </button>
      </div>
    </div>
  `,
}
