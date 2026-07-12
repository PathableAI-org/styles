export default {
  title: 'Components/Communication/Step Indicator',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <ol class="pathable-step-indicator">
      <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed">
        <span class="pathable-step-indicator__segment-label">Step 1: Create Account</span>
      </li>
      <li class="pathable-step-indicator__segment pathable-step-indicator__segment--current" aria-current="step">
        <span class="pathable-step-indicator__segment-label">Step 2: Verify Identity</span>
      </li>
      <li class="pathable-step-indicator__segment">
        <span class="pathable-step-indicator__segment-label">Step 3: Set Up Profile</span>
      </li>
      <li class="pathable-step-indicator__segment">
        <span class="pathable-step-indicator__segment-label">Step 4: Complete</span>
      </li>
    </ol>
  `,
}
