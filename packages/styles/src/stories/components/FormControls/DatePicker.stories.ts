import { userEvent, within, expect } from 'storybook/test'
import {
  verifyLabeledControl,
  type StoryHarness,
} from '@pathable/storybook-contracts'

export default {
  title: 'Components/Form Controls/Date Picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Note:** This component uses USWDS JavaScript for interactivity. Import `@pathableai/styles/js` to enable interactive behavior.\n\n**Interaction Model**: Requires USWDS JS\n**USWDS JS Behaviors**: Calendar open/close, date selection, keyboard navigation, month/year navigation\n**Shared semantics verified**: the date input has an accessible name from its label.\n**Consumers must**: Import `@pathableai/styles/js` to enable interactive behavior.',
      },
    },
  },
}

function harnessFor(root: HTMLElement): StoryHarness {
  return {
    root,
    within,
    userEvent,
    expect,
  }
}

export const Default = {
  render: () => `
<div class="pathable-date-picker">
  <label class="pathable-label" for="date-picker-example">Date</label>
  <div class="pathable-date-picker__wrapper">
    <input
      id="date-picker-example"
      class="pathable-input pathable-input--date"
      type="text"
      pattern="\\d{4}-\\d{2}-\\d{2}"
      placeholder="YYYY-MM-DD"
    />
  </div>
</div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)

    await verifyLabeledControl(harness, /Date/i)
  },
}
