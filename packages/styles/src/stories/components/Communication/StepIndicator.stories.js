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
      <li class="pathable-step-indicator__step pathable-step-indicator__step--completed">
        <span class="pathable-step-indicator__step-label">Step 1: Create Account</span>
      </li>
      <li class="pathable-step-indicator__step pathable-step-indicator__step--current">
        <span class="pathable-step-indicator__step-label">Step 2: Verify Identity</span>
      </li>
      <li class="pathable-step-indicator__step">
        <span class="pathable-step-indicator__step-label">Step 3: Set Up Profile</span>
      </li>
      <li class="pathable-step-indicator__step">
        <span class="pathable-step-indicator__step-label">Step 4: Complete</span>
      </li>
    </ol>
  `,
}
