import { ErrorMessage } from '../../../components/ErrorMessage/ErrorMessage'
import { FormGroup } from '../../../components/FormGroup/FormGroup'
import { Hint } from '../../../components/Hint/Hint'
import { Input } from '../../../components/Input/Input'
import { Label } from '../../../components/Label/Label'
import { Select } from '../../../components/Select/Select'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import {
  verifyHintErrorAssociation,
  verifyLabeledControl,
  type StoryHarness,
} from '@pathable/storybook-contracts'

const defaultChildren = (
  <>
    <Label>Participant name</Label>
    <Input name="participantName" />
  </>
)

function harnessFor(root: HTMLElement): StoryHarness {
  return { root, within, userEvent, expect }
}

const meta = {
  title: 'Components/Form Controls/FormGroup',
  component: FormGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A visual wrapper for the content associated with one form control. It wraps a native \`<div>\` with the \`.pathable-form-group\` class and forwards standard div attributes.

**When to use**: Use FormGroup to apply PathAble form-group styling around a control, its label, and related hint or validation content.

**When not to use**: Do not use FormGroup as a semantic group for related controls or as a replacement for \`<fieldset>\`. It does not manage form state, validation, or disabled descendants.

**Underlying element**: Native \`<div>\`. The wrapper associates one direct PathAble Label and any direct Hint or ErrorMessage children with one supported control, but it does not manage values, validation, focus, or submission.

**Accessibility**: Compose one Label and any Hint or ErrorMessage children directly with one Input, Select, Textarea, or Range to receive stable IDs and associations automatically. Explicit non-empty IDs and ARIA attributes are preserved. A non-empty \`aria-labelledby\` opts out of automatic Label wiring; an explicit \`aria-describedby\`, including an empty string, opts out of description wiring. Multiple direct controls, including mixed PathAble and native controls, disable automatic wiring. Use a native \`<fieldset>\` when controls need a shared group name.`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'none',
      description:
        'A label, form control, and any related hint or validation content.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble form-group class.',
    },
    id: {
      control: { type: 'text' },
      description: 'Optional native div ID forwarded unchanged.',
    },
  },
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof FormGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    children: defaultChildren,
  },
}

export const FormComposition: Story = {
  tags: ['behavior-contract', 'contract-form-group'],
  render: () => (
    <FormGroup>
      <Label>Service area</Label>
      <Hint>Choose the category that applies.</Hint>
      <Select name="serviceArea" defaultValue="" aria-invalid="true">
        <option value="" disabled>
          Select a service area
        </option>
        <option value="employment">Employment</option>
        <option value="housing">Housing</option>
      </Select>
      <ErrorMessage>Choose a service area.</ErrorMessage>
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const harness = harnessFor(canvasElement)

    await verifyLabeledControl(harness, 'Service area')
    await verifyHintErrorAssociation(
      harness,
      'Service area',
      'Choose the category that applies.',
      'Choose a service area.',
    )
  },
}

export const ValidationComposition: Story = {
  render: () => (
    <FormGroup>
      <Label htmlFor="invalid-email">Participant email</Label>
      <Input
        id="invalid-email"
        name="participantEmail"
        type="email"
        defaultValue="not-an-email"
        aria-invalid="true"
        aria-describedby="invalid-email-error"
      />
      <ErrorMessage id="invalid-email-error" role="alert">
        Enter a valid email address.
      </ErrorMessage>
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Participant email' })
    const error = canvas.getByRole('alert')

    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute(
      'aria-describedby',
      'invalid-email-error',
    )
    await expect(error).toHaveTextContent('Enter a valid email address.')
  },
}

export const CustomAttributes: Story = {
  render: () => (
    <FormGroup
      id="participant-details"
      className="custom-form-group"
      data-testid="participant-details"
      title="Participant details"
    >
      <Label htmlFor="custom-participant-name">Participant name</Label>
      <Input id="custom-participant-name" name="participantName" />
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const label = canvas.getByText('Participant name')
    const group = label.parentElement

    await expect(group).toHaveClass('pathable-form-group', 'custom-form-group')
    await expect(group).toHaveAttribute('id', 'participant-details')
    await expect(group).toHaveAttribute('data-testid', 'participant-details')
    await expect(group).toHaveAttribute('title', 'Participant details')
  },
}

export const EmptyContent: Story = {
  render: () => <FormGroup />,
}

export const LongContent: Story = {
  render: () => (
    <FormGroup>
      <Label>Participant employment details</Label>
      <Input name="employmentDetails" />
      <Hint>
        Include the participant&apos;s employment goals, workplace support
        needs, communication preferences, and any other details that should be
        available during coaching follow-up.
      </Hint>
    </FormGroup>
  ),
}

export const Narrow: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <FormGroup>
      <Label>Workplace support details</Label>
      <Input name="workplaceSupport" />
    </FormGroup>
  ),
}
