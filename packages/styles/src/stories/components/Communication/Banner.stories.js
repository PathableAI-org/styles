export default {
  title: 'Components/Communication/Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathable/styles/js` to enable interactive behavior.',
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
