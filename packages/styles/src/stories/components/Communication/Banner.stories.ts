export default {
  title: 'Components/Communication/Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Status**: CSS-only in this package. The React wrapper at `@pathable/react` provides JS behavior.\n\n**CSS markup**: Requires `.pathable-banner`, `.pathable-banner__header`, `.pathable-banner__button`, `.pathable-banner__content`, `.pathable-banner__guidance`, `.pathable-banner__lock-image`.\n\n**Disclosure behavior (verified)**:\n- The banner is a disclosure widget (expand/collapse), NOT a dismissible notice.\n- The `.pathable-banner__button` uses `aria-controls` to reference the content panel and `aria-expanded` to reflect its state.\n- The `.pathable-banner__content` contains the expandable content.\n- The `.pathable-banner__guidance` wraps the textual guidance.\n- The `.pathable-banner__lock-image` is the lock icon indicating government site.\n\n**Consumers must**: Import `@pathable/styles` CSS. For JS behavior, use `@pathable/react` Banner component or import `@pathable/styles/js`. When using USWDS JS, keep `.usa-banner` on the DOM alongside `.pathable-banner`.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-banner">
      <div class="pathable-banner__header">
        <div class="pathable-banner__guidance">
          <img class="pathable-banner__lock-image" src="https://designsystem.digital.gov/assets/img/lock.svg" alt="" />
          <span>An official website of the PathAble</span>
        </div>
        <button class="pathable-banner__button" aria-expanded="false" aria-controls="banner-content">
          Here's how you know
        </button>
      </div>
      <div class="pathable-banner__content" id="banner-content" hidden>
        <p>Reminder: Session documentation must be completed within 24 hours. <a href="#">View compliance policy</a>.</p>
      </div>
    </div>
  `,
}
