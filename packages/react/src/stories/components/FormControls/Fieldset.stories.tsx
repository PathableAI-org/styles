import { Input } from '../../../components/Input/Input'
import { Fieldset } from '../../../components/Fieldset/Fieldset'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

const defaultChildren = (
  <>
    <legend>Participant details</legend>
    <label htmlFor="participant-name">Participant name</label>
    <Input id="participant-name" name="participantName" />
  </>
)

const meta = {
  title: 'Components/Form Controls/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native grouping element for related form controls. It wraps the native \`<fieldset>\` with the \`.pathable-fieldset\` class and forwards standard fieldset attributes.

**When to use**: Use Fieldset to group related controls that share a topic or instruction. Provide a meaningful native \`<legend>\` as the group's accessible name.

**When not to use**: Do not use Fieldset as a generic layout container or to group unrelated controls. Use a semantic section or layout component when a form relationship is not intended.

**Underlying element**: Native \`<fieldset>\`. The wrapper does not manage form state, validation, focus, or submission.

**Accessibility**: Include a visible \`<legend>\` as the first child when the group needs an accessible name. Fieldset preserves the native disabled behavior for its descendant controls.`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'none',
      description:
        'Related form controls with a meaningful legend as the group name.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble fieldset class.',
    },
    disabled: {
      control: { type: 'boolean' },
      description:
        'Disables descendant form controls using native fieldset behavior.',
    },
    name: {
      control: { type: 'text' },
      description: 'Optional native fieldset name forwarded unchanged.',
    },
  },
  args: {
    children: defaultChildren,
  },
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    children: defaultChildren,
  },
}

export const FormComposition: Story = {
  render: () => (
    <Fieldset>
      <legend>Preferred contact method</legend>
      <label htmlFor="contact-email">Email</label>
      <Input id="contact-email" name="contactMethod" type="email" />
      <label htmlFor="contact-phone">Phone</label>
      <Input id="contact-phone" name="contactMethod" type="tel" />
    </Fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', {
      name: 'Preferred contact method',
    })
    const email = canvas.getByRole('textbox', { name: 'Email' })
    const phone = canvas.getByRole('textbox', { name: 'Phone' })

    await expect(group).toHaveClass('pathable-fieldset')
    await expect(email).toHaveAttribute('name', 'contactMethod')
    await expect(phone).toHaveAttribute('name', 'contactMethod')
  },
}

export const Disabled: Story = {
  render: () => (
    <Fieldset disabled>
      <legend>Archived participant details</legend>
      <label htmlFor="archived-name">Participant name</label>
      <Input id="archived-name" name="archivedName" />
    </Fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', {
      name: 'Participant name',
    })

    await expect(input).toBeDisabled()
  },
}

export const CustomAttributes: Story = {
  render: () => (
    <Fieldset
      id="participant-details"
      name="participantDetails"
      className="custom-fieldset"
      data-testid="participant-details"
    >
      <legend>Participant details</legend>
      <p>Provide the information available for this participant.</p>
    </Fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Participant details' })

    await expect(group).toHaveClass('pathable-fieldset', 'custom-fieldset')
    await expect(group).toHaveAttribute('id', 'participant-details')
    await expect(group).toHaveAttribute('name', 'participantDetails')
    await expect(group).toHaveAttribute('data-testid', 'participant-details')
  },
}

export const RichLegend: Story = {
  render: () => (
    <Fieldset>
      <legend>
        <strong>Employment</strong> and coaching preferences
      </legend>
      <label htmlFor="coaching-goal">Primary coaching goal</label>
      <Input id="coaching-goal" name="coachingGoal" />
    </Fieldset>
  ),
}

export const EmptyContent: Story = {
  render: () => (
    <Fieldset>
      <legend>Optional details</legend>
    </Fieldset>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Fieldset>
      <legend>
        Participant employment goals, workplace support needs, and preferred
        coaching communication details
      </legend>
      <label htmlFor="long-details">Additional details</label>
      <Input id="long-details" name="longDetails" />
    </Fieldset>
  ),
}

export const Narrow: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <Fieldset>
      <legend>Transportation and workplace readiness support</legend>
      <label htmlFor="transportation-details">Support details</label>
      <Input id="transportation-details" name="transportationDetails" />
    </Fieldset>
  ),
}
