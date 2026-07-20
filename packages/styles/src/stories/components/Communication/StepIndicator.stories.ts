export default {
  title: 'Components/Communication/Step Indicator',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\n**Semantic guidance on current/completed states**:\n- Use `.pathable-step-indicator__segment--current` on the active step. Add `aria-current="step"` to the segment element for assistive technology.\n- Use `.pathable-step-indicator__segment--completed` on steps that the user has already completed. Completed steps may be styled with a checkmark or other visual indicator.\n- Steps with neither class are upcoming/incomplete.\n- The step order is read left-to-right (or right-to-left in RTL layouts) and maps to a horizontal progress indicator.\n- All selectors are implemented: `.pathable-step-indicator`, `.pathable-step-indicator__segment`, `.pathable-step-indicator__segment--completed`, `.pathable-step-indicator__segment--current`, `.pathable-step-indicator__segment-label`.',
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
