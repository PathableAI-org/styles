import { within } from 'storybook/test'

import { expectKeyboardFocusIndicator } from '../focus-indicator'

export default {
  title: 'Components/Form Controls/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n**App State to Manage**: value, validation errors\n**Consumers must**: Provide value and validation logic in application framework.',
      },
    },
  },
}

export const Text = {
  render: () => `
<label class="pathable-label" for="input-text">Text input</label>
<input
  id="input-text"
  class="pathable-input pathable-input--text"
  type="text"
  placeholder="Enter text"
/>
  `,
}

export const Default = Text

export const Password = {
  render: () => `
<label class="pathable-label" for="input-password">Password</label>
<input
  id="input-password"
  class="pathable-input pathable-input--password"
  type="password"
  placeholder="Enter password"
/>
  `,
}

export const Email = {
  render: () => `
<label class="pathable-label" for="input-email">Email address</label>
<input
  id="input-email"
  class="pathable-input pathable-input--email"
  type="email"
  placeholder="you@example.com"
/>
  `,
}

export const Search = {
  render: () => `
<label class="pathable-label" for="input-search">Search</label>
<input
  id="input-search"
  class="pathable-input pathable-input--search"
  type="search"
  placeholder="Search…"
/>
  `,
}

export const WorkflowRequiredComplianceField = {
  render: () => `
<form class="pathable-form">
  <label class="pathable-label" for="compliance-field">Funding Authorization Number <span class="pathable-hint">(required)</span></label>
  <span class="pathable-hint" id="compliance-field-hint">
    Enter the participant's funding authorization identifier.
  </span>
  <input
    id="compliance-field"
    name="compliance-field"
    class="pathable-input pathable-input--error"
    type="text"
    aria-describedby="compliance-field-hint compliance-field-error"
    aria-invalid="true"
    placeholder="Enter authorization number"
  />
  <span class="pathable-error-message" id="compliance-field-error" role="alert">
    Funding authorization number is required. Please enter a valid identifier.
  </span>
</form>
  `,
}

export const KeyboardFocus = {
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard focus shows the brand focus outline in `--pathable-color-focus-ring` (Bright Blue Brooks). The play function tabs to the text input and checks the outline.',
      },
    },
  },
  render: () => `
<label class="pathable-label" for="input-keyboard-focus">Text input</label>
<input id="input-keyboard-focus" class="pathable-input" type="text" />
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) =>
    expectKeyboardFocusIndicator(
      canvasElement,
      within(canvasElement).getByRole('textbox', { name: 'Text input' }),
    ),
}

export const ForcedColors = {
  parameters: {
    docs: {
      description: {
        story:
          'Run with forced-colors emulation (the test-runner turns it on for this story). Keyboard focus keeps a visible solid outline in the system `Highlight` colour. The play function tabs to the text input and checks the outline.',
      },
    },
  },
  render: () => `
<label class="pathable-label" for="input-forced-colors">Text input</label>
<input id="input-forced-colors" class="pathable-input" type="text" />
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) =>
    expectKeyboardFocusIndicator(
      canvasElement,
      within(canvasElement).getByRole('textbox', { name: 'Text input' }),
    ),
}
