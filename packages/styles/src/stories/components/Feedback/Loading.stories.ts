import { expectBodyFont } from '../../shared/body-font'
export default {
  title: 'Components/Feedback/Loading',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. Keep a live region, such as an element with `role="status"`, on the page before loading starts, and add and remove the indicator inside it so its text is announced. Do not put `aria-live` on the indicator itself when you add and remove it. For a ring with no visible text, put a `pathable-sr-only` span that says what is loading inside the region, so it has text to announce. Show and remove the indicator in application code.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div role="status">
      <div class="pathable-loading">
        <span class="pathable-loading__spinner" aria-hidden="true"></span>
        <span class="pathable-loading__text">Loading messages...</span>
      </div>
    </div>
  `,
  play: ({ canvasElement }: { canvasElement: HTMLElement }) =>
    expectBodyFont(canvasElement, ['.pathable-loading__text']),
}

export const SpinnerOnly = {
  render: () => `
    <div role="status">
      <div class="pathable-loading">
        <span class="pathable-loading__spinner" aria-hidden="true"></span>
        <span class="pathable-sr-only">Loading messages</span>
      </div>
    </div>
  `,
}

export const Large = {
  render: () => `
    <div role="status">
      <div class="pathable-loading pathable-loading--large">
        <span class="pathable-loading__spinner" aria-hidden="true"></span>
        <span class="pathable-loading__text">Loading your dashboard...</span>
      </div>
    </div>
  `,
}
