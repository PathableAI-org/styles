import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import { Checkbox } from '../../../components/Checkbox/Checkbox'

const meta = {
  title: 'Components/Form Controls/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native checkbox for selecting zero or more options. It owns the accessible label structure and maps the PathAble checkbox input, label, and optional description classes.

**When to use**: Use Checkbox when users may select multiple independent options or confirm a boolean choice. Use a shared \`name\` and a fieldset when presenting a related group of choices.

**When not to use**: Do not use Checkbox for mutually exclusive choices; use a radio group instead. Do not use it for custom toggle behavior that is not a native form value.

**Underlying element**: Native \`<input type="checkbox">\` nested inside a \`<label>\`. The wrapper does not manage checked state, validation, or form submission.

**Accessibility**: The required \`children\` prop supplies the visible accessible label. Use \`aria-describedby\` for external hints or validation messages. The optional description is rendered as supporting content inside the label.

**Supported styling**: The wrapper exposes the default PathAble checkbox contract only. The source \`pathable-checkbox--tile\` story reference is not exposed because that modifier is not implemented by the owning stylesheet contract.`,
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description: 'Visible label text and accessible name for the checkbox.',
    },
    description: {
      control: { type: 'text' },
      description:
        'Optional supporting text rendered inside the checkbox label.',
    },
    defaultChecked: {
      control: { type: 'boolean' },
      description:
        'Initial checked state for an uncontrolled checkbox. Use checked and onChange for controlled state.',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Prevents interaction and form submission. Explain the reason for disabling the choice nearby.',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Marks the checkbox as required for native form validation.',
    },
    name: {
      control: { type: 'text' },
      description: 'Native form field name used when the form is submitted.',
    },
    value: {
      control: { type: 'text' },
      description: 'Native value submitted when the checkbox is checked.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended to the root label after the PathAble checkbox class.',
    },
  },
  args: {
    children: 'Receive session reminders',
    name: 'sessionReminders',
    value: 'enabled',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    children: 'Include employment resources',
    name: 'includeResources',
    value: 'yes',
  },
}

export const Checked: Story = {
  args: {
    children: 'Participant consent received',
    defaultChecked: true,
    name: 'consentReceived',
    value: 'yes',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Archived workflow option',
    disabled: true,
    name: 'archivedOption',
    value: 'archived',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Archived workflow option',
    })

    await expect(checkbox).toBeDisabled()
    await userEvent.tab()
    await expect(checkbox).not.toHaveFocus()
  },
}

export const WithDescription: Story = {
  render: () => (
    <Checkbox
      name="weeklySummary"
      value="enabled"
      description="You can change this preference at any time."
    >
      Send a weekly progress summary
    </Checkbox>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div>
      <Checkbox
        name="agreement"
        value="accepted"
        required
        aria-invalid="true"
        aria-describedby="agreement-error"
      >
        I agree to the participant support terms
      </Checkbox>
      <p id="agreement-error" role="alert">
        Select this checkbox before continuing.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: 'I agree to the participant support terms',
    })

    await expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    await expect(checkbox).toHaveAttribute(
      'aria-describedby',
      'agreement-error',
    )
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Select this checkbox before continuing.',
    )
  },
}

function ControlledCheckboxStory() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox
      name="controlled-reminders"
      value="enabled"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    >
      Enable appointment reminders
    </Checkbox>
  )
}

export const Controlled: Story = {
  render: () => <ControlledCheckboxStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', {
      name: 'Enable appointment reminders',
    })

    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await userEvent.keyboard(' ')
    await expect(checkbox).not.toBeChecked()
  },
}

export const LongContent: Story = {
  render: () => (
    <Checkbox
      name="long-support-option"
      value="integrated"
      description="This description explains how the selection affects the participant's coaching plan and can wrap across multiple lines without changing the native checkbox behavior."
    >
      Include integrated employment coaching, employer partnership planning, and
      workplace communication preparation in the participant's next action plan
    </Checkbox>
  ),
}

export const Narrow: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <Checkbox name="narrow-option" value="selected">
      Show transportation planning resources for this participant
    </Checkbox>
  ),
}

export const FieldsetComposition: Story = {
  render: () => (
    <fieldset>
      <legend>Coaching supports addressed</legend>
      <p id="support-hint">Select all supports addressed in this session.</p>
      <Checkbox
        name="supports"
        value="job-readiness"
        aria-describedby="support-hint"
      >
        Job readiness practice
      </Checkbox>
      <Checkbox
        name="supports"
        value="workplace-communication"
        aria-describedby="support-hint"
      >
        Workplace communication
      </Checkbox>
      <Checkbox
        name="supports"
        value="employer-follow-up"
        aria-describedby="support-hint"
      >
        Employer follow-up
      </Checkbox>
    </fieldset>
  ),
}
