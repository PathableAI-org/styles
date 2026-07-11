export default {
  title: 'Components/Feedback/Loading',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Show/hide the loading indicator in application code. Use `aria-live="polite"` on the container.',
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
    <div class="pathable-loading" aria-live="polite" aria-label="Loading">
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
