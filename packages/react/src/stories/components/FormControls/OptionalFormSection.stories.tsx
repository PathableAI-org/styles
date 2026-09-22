import { useState, type FormEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { Checkbox } from '../../../components/Checkbox/Checkbox'
import { Fieldset } from '../../../components/Fieldset/Fieldset'
import { FormGroup } from '../../../components/FormGroup/FormGroup'
import { Input } from '../../../components/Input/Input'
import { Label } from '../../../components/Label/Label'
import { OptionalFormSection } from '../../../components/OptionalFormSection/OptionalFormSection'
import { Radio } from '../../../components/Radio/Radio'
import { Textarea } from '../../../components/Textarea/Textarea'

function ControlledExample() {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <p aria-live="polite">
        Section is {expanded ? 'expanded' : 'collapsed'}.
      </p>
      <OptionalFormSection
        heading="Communication preferences"
        headingLevel={3}
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <FormGroup>
          <Label>Email for updates</Label>
          <Input name="updatesEmail" type="email" />
        </FormGroup>
      </OptionalFormSection>
    </>
  )
}

function KeyboardAndFormRetentionExample() {
  const [submitCount, setSubmitCount] = useState(0)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitCount((count) => count + 1)
  }

  return (
    <form aria-label="Optional details form" onSubmit={handleSubmit}>
      <OptionalFormSection heading="Optional service details" headingLevel={3}>
        <FormGroup>
          <Label>Service notes</Label>
          <Input name="serviceNotes" />
        </FormGroup>
        <Checkbox name="followUp" value="yes">
          Request follow-up
        </Checkbox>
      </OptionalFormSection>
      <button type="submit">Save profile</button>
      <output aria-live="polite">Submit count: {submitCount}</output>
    </form>
  )
}

const meta = {
  title: 'Components/Form Controls/OptionalFormSection',
  component: OptionalFormSection,
  tags: ['autodocs', 'behavior-contract', 'client-ssr'],
  parameters: {
    rendering: {
      reason:
        'Owns disclosure state and event handling while preserving meaningful server-rendered HTML.',
    },
    docs: {
      description: {
        component: `A disclosure for optional form content that keeps its children mounted when collapsed, preserving field values and normal form submission.

**When to use**: Use OptionalFormSection to shorten forms by initially hiding fields that many people do not need. Choose a heading level that fits the surrounding document hierarchy.

**When not to use**: Do not use it for general page-content accordions, to clear or disable values, or to hide required fields. Applications remain responsible for expanding a section when a hidden invalid field needs attention.

**Underlying elements**: A root div contains a native heading with a button of type button and an always-mounted region. The panel uses the native hidden attribute when collapsed.

**Accessibility**: The button and region receive stable reciprocal ID relationships. Native button activation supports click, Enter, and Space without submitting a containing form. There is no disabled state or animation.`,
      },
    },
  },
  argTypes: {
    heading: {
      control: { type: 'text' },
      description: 'Required non-empty visible heading and disclosure name.',
    },
    headingLevel: {
      options: [2, 3, 4, 5, 6],
      control: { type: 'select' },
      description: 'Required semantic heading level in the surrounding page.',
    },
    expanded: {
      control: { type: 'boolean' },
      description:
        'Consumer-owned expanded state. Omit it for internally owned state.',
    },
    defaultExpanded: {
      control: { type: 'boolean' },
      description: 'Initial expanded state for an uncontrolled section.',
    },
    onExpandedChange: {
      action: 'expanded changed',
      description: 'Called with the requested next expanded state.',
    },
    children: {
      control: false,
      description: 'Form controls or supporting optional content.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional classes appended to the root div.',
    },
    id: {
      control: { type: 'text' },
      description: 'Optional native root div ID forwarded unchanged.',
    },
  },
  args: {
    heading: 'Additional participant details',
    headingLevel: 3,
    children: (
      <FormGroup>
        <Label>Preferred name</Label>
        <Input name="preferredName" />
      </FormGroup>
    ),
  },
} satisfies Meta<typeof OptionalFormSection>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    heading: 'Add transportation details',
    headingLevel: 3,
    children: (
      <FormGroup>
        <Label>Transportation notes</Label>
        <Textarea name="transportationNotes" rows={3} />
      </FormGroup>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: 'Add transportation details',
    })
    const region = canvas.getByRole('region', { hidden: true })
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toHaveAttribute('aria-controls', region.id)
    await expect(region).toHaveAttribute('aria-labelledby', button.id)
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(region).toBeVisible()
  },
}

export const InitiallyExpanded: Story = {
  args: {
    heading: 'Alternate contact details',
    headingLevel: 3,
    defaultExpanded: true,
    children: (
      <FormGroup>
        <Label>Alternate email</Label>
        <Input name="alternateEmail" type="email" />
      </FormGroup>
    ),
  },
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: 'Communication preferences',
    })
    await expect(canvas.getByText('Section is collapsed.')).toBeVisible()
    await userEvent.click(button)
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByText('Section is expanded.')).toBeVisible()
  },
}

export const FormGroupComposition: Story = {
  render: () => (
    <OptionalFormSection
      heading="Employment information"
      headingLevel={3}
      defaultExpanded
    >
      <FormGroup>
        <Label>Current employer</Label>
        <Input name="employer" />
      </FormGroup>
      <FormGroup>
        <Label>Employment goals</Label>
        <Textarea name="employmentGoals" rows={4} />
      </FormGroup>
    </OptionalFormSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Current employer')).toHaveAttribute(
      'name',
      'employer',
    )
    await expect(canvas.getByLabelText('Employment goals')).toHaveAttribute(
      'name',
      'employmentGoals',
    )
  },
}

export const FieldsetComposition: Story = {
  render: () => (
    <OptionalFormSection
      heading="Contact preferences"
      headingLevel={3}
      defaultExpanded
    >
      <Fieldset>
        <legend>Preferred contact method</legend>
        <Radio name="contactMethod" value="email">
          Email
        </Radio>
        <Radio name="contactMethod" value="phone">
          Phone
        </Radio>
      </Fieldset>
    </OptionalFormSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Preferred contact method' }),
    ).toHaveClass('pathable-fieldset')
    await expect(canvas.getByRole('radio', { name: 'Email' })).toHaveAttribute(
      'name',
      'contactMethod',
    )
  },
}

export const KeyboardAndFormRetention: Story = {
  render: () => <KeyboardAndFormRetentionExample />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Optional details form' })
    const button = canvas.getByRole('button', {
      name: 'Optional service details',
    })
    await step(
      'uses native keyboard activation and retains focus',
      async () => {
        await userEvent.tab()
        await expect(button).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        await expect(button).toHaveAttribute('aria-expanded', 'true')
        await expect(button).toHaveFocus()
        await expect(canvas.getByText('Submit count: 0')).toBeVisible()
      },
    )
    await step('retains and submits values while collapsed', async () => {
      const notes = canvas.getByRole('textbox', { name: 'Service notes' })
      await userEvent.type(notes, 'Evening appointments')
      await userEvent.click(
        canvas.getByRole('checkbox', { name: 'Request follow-up' }),
      )
      button.focus()
      await userEvent.keyboard(' ')
      await expect(button).toHaveAttribute('aria-expanded', 'false')
      await expect(button).toHaveFocus()
      await expect(Object.fromEntries(new FormData(form))).toEqual({
        serviceNotes: 'Evening appointments',
        followUp: 'yes',
      })
      await expect(notes).toHaveValue('Evening appointments')
      await userEvent.tab()
      const saveButton = canvas.getByRole('button', { name: 'Save profile' })
      await expect(saveButton).toHaveFocus()
      await userEvent.click(saveButton)
      await expect(canvas.getByText('Submit count: 1')).toBeVisible()
    })
  },
}

export const RetainedValues: Story = {
  render: () => (
    <OptionalFormSection
      heading="Optional scheduling preferences"
      headingLevel={3}
      defaultExpanded
    >
      <label htmlFor="retained-time">Preferred time</label>
      <input id="retained-time" name="preferredTime" />
      <label htmlFor="retained-frequency">Frequency</label>
      <select id="retained-frequency" name="frequency" defaultValue="weekly">
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </OptionalFormSection>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: 'Optional scheduling preferences',
    })
    const time = canvas.getByLabelText('Preferred time')
    const frequency = canvas.getByLabelText('Frequency')
    await userEvent.type(time, 'Evenings')
    await userEvent.selectOptions(frequency, 'monthly')
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    await expect(time).toHaveValue('Evenings')
    await expect(frequency).toHaveValue('monthly')
  },
}

export const CollapsedSubmit: Story = {
  render: () => (
    <form aria-label="Collapsed optional form">
      <OptionalFormSection heading="Optional referral" headingLevel={3}>
        <label htmlFor="collapsed-referral">Referral source</label>
        <input
          id="collapsed-referral"
          name="referralSource"
          defaultValue="Community partner"
        />
      </OptionalFormSection>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', {
      name: 'Collapsed optional form',
    })
    await expect(Object.fromEntries(new FormData(form))).toEqual({
      referralSource: 'Community partner',
    })
  },
}

export const MultipleInstances: Story = {
  render: () => (
    <>
      {Array.from({ length: 10 }, (_, index) => (
        <OptionalFormSection
          key={index}
          heading={`Optional section ${index + 1}`}
          headingLevel={3}
        >
          Section {index + 1} content
        </OptionalFormSection>
      ))}
    </>
  ),
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole('button')
    const ids = buttons.map((button) => button.getAttribute('aria-controls'))
    await expect(new Set(ids).size).toBe(10)
  },
}

export const SsrStableInitialMarkup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A deterministic collapsed fixture for reviewing the meaningful initial HTML emitted during server rendering and preserved during hydration.',
      },
    },
  },
  args: {
    heading: 'Server-rendered optional details',
    headingLevel: 3,
    children: (
      <FormGroup>
        <Label>Server optional field</Label>
        <Input name="serverOptionalField" defaultValue="retained" />
      </FormGroup>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', {
      name: 'Server-rendered optional details',
    })
    const region = canvas.getByRole('region', { hidden: true })
    await expect(button).toHaveAttribute('aria-controls', region.id)
    await expect(region).toHaveAttribute('aria-labelledby', button.id)
    await expect(region).toHaveAttribute('hidden')
  },
}

export const LongContent: Story = {
  args: {
    heading:
      'Add employment, workplace accessibility, transportation, and ongoing coaching details',
    headingLevel: 3,
    defaultExpanded: true,
    children: (
      <FormGroup>
        <Label>Additional support information</Label>
        <Textarea name="supportInformation" rows={8} />
      </FormGroup>
    ),
  },
}

export const Narrow: Story = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  render: () => (
    <div style={{ boxSizing: 'border-box', maxWidth: 320 }}>
      <OptionalFormSection
        heading="Add transportation and workplace accessibility details"
        headingLevel={3}
        defaultExpanded
      >
        <FormGroup>
          <Label>Support details</Label>
          <Textarea name="narrowSupportDetails" rows={4} />
        </FormGroup>
      </OptionalFormSection>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.firstElementChild as HTMLElement
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 2)
  },
}

export const IncreasedText: Story = {
  render: () => (
    <div
      style={{ boxSizing: 'border-box', fontSize: '2rem', maxWidth: '32rem' }}
    >
      <OptionalFormSection
        heading="Add communication accommodation details"
        headingLevel={3}
        defaultExpanded
      >
        <FormGroup>
          <Label>Communication preferences</Label>
          <Textarea name="communicationPreferences" rows={4} />
        </FormGroup>
      </OptionalFormSection>
    </div>
  ),
}

export const ForcedColors: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A stable expanded fixture for reviewing the disclosure in forced-colors mode.',
      },
    },
  },
  render: () => (
    <div style={{ background: 'Canvas', color: 'CanvasText', padding: '1rem' }}>
      <OptionalFormSection
        heading="Add accessibility preferences"
        headingLevel={3}
        defaultExpanded
      >
        <FormGroup>
          <Label>Accessibility notes</Label>
          <Textarea name="accessibilityNotes" rows={4} />
        </FormGroup>
      </OptionalFormSection>
    </div>
  ),
}
