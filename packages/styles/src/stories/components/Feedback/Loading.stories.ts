export default {
  title: 'Components/Feedback/Loading',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. Show/hide the loading indicator in application code. Use `aria-live="polite"` on the container.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-loading" aria-live="polite">
      <span class="pathable-loading__spinner" aria-hidden="true"></span>
      <span class="pathable-loading__text">Loading messages...</span>
    </div>
  `,
}

export const SpinnerOnly = {
  render: () => `
    <div class="pathable-loading" role="status" aria-label="Loading">
      <span class="pathable-loading__spinner" aria-hidden="true"></span>
    </div>
  `,
}

export const Large = {
  render: () => `
    <div class="pathable-loading pathable-loading--large" aria-live="polite">
      <span class="pathable-loading__spinner" aria-hidden="true"></span>
      <span class="pathable-loading__text">Loading your dashboard...</span>
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
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    if (!matchMedia('(forced-colors: active)').matches) {
      throw new Error('Forced colours emulation is not active for this story')
    }
    const spinner = canvasElement.querySelector('.pathable-loading__spinner')
    if (!spinner) throw new Error('Spinner not found')
    const style = getComputedStyle(spinner)
    if (style.borderTopColor === style.borderRightColor) {
      throw new Error(
        `Spinner ring is closed in forced colours: top ${style.borderTopColor}, right ${style.borderRightColor}`,
      )
    }
  },
}
