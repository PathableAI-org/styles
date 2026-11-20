import { expectBodyFont } from '../../shared/body-font'
import { guarantee } from '../../shared/guarantee'

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

export const ForcedColors = {
  parameters: {
    docs: {
      description: {
        story:
          'Run with forced-colors emulation (the test-runner turns it on for this story). The spinner ring keeps a gap: its top border is drawn in a different system colour from its other sides, so its turning can be seen. The play function checks the border colours.',
      },
    },
  },
  render: () => `
    <div class="pathable-loading" aria-live="polite">
      <span class="pathable-loading__spinner" aria-hidden="true"></span>
      <span class="pathable-loading__text">Loading messages...</span>
    </div>
  `,
  play: async ({
    canvasElement,
    step,
  }: {
    canvasElement: HTMLElement
    step: (label: string, play: () => Promise<void>) => Promise<void>
  }) => {
    if (!matchMedia('(forced-colors: active)').matches) {
      throw new Error('Forced colours emulation is not active for this story')
    }
    await guarantee(step, 'loading/forced-colours', async () => {
      const spinner = canvasElement.querySelector('.pathable-loading__spinner')
      if (!spinner) throw new Error('Spinner not found')
      const style = getComputedStyle(spinner)
      if (style.borderTopColor === style.borderRightColor) {
        throw new Error(
          `Spinner ring is closed in forced colours: top ${style.borderTopColor}, right ${style.borderRightColor}`,
        )
      }
    })
  },
}
