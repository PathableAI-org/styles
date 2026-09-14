import type { FormEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { Button } from '../../../components/Button/Button'
import { FormGroup } from '../../../components/FormGroup/FormGroup'
import { FormStack } from '../../../components/FormStack/FormStack'
import { Hint } from '../../../components/Hint/Hint'
import { Input } from '../../../components/Input/Input'
import { Label } from '../../../components/Label/Label'
import { Select } from '../../../components/Select/Select'
import { Textarea } from '../../../components/Textarea/Textarea'

const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
}

function Fields({ prefix }: { prefix: string }) {
  return (
    <>
      <FormGroup>
        <Label htmlFor={`${prefix}-name`}>Participant name</Label>
        <Hint id={`${prefix}-name-hint`}>
          Use the name shown on the participant record.
        </Hint>
        <Input
          id={`${prefix}-name`}
          name="participantName"
          aria-describedby={`${prefix}-name-hint`}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor={`${prefix}-service`}>Service area</Label>
        <Select id={`${prefix}-service`} name="service">
          <option>Employment support</option>
          <option>Community access</option>
        </Select>
      </FormGroup>
      <FormGroup>
        <Label htmlFor={`${prefix}-notes`}>Planning notes</Label>
        <Textarea id={`${prefix}-notes`} name="notes" rows={3} />
      </FormGroup>
    </>
  )
}

const meta = {
  title: 'Components/Form Controls/FormStack',
  component: FormStack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A multi-field form layout that renders a native \`<form>\` by default and applies consistent vertical spacing. Supported inputs, selects, and textareas expand to the FormStack width without per-control sizing props.

**When to use**: Use FormStack for settings, wizards, multi-fieldset forms, and responsive FormRow compositions that need more than the short-form measure.

**When not to use**: Use Form for a short, linear USWDS-style form capped near 20rem. Do not nest Form and FormStack; both render a native form by default. Use \`as="div"\` only when FormStack is layout inside an existing form.

**Sizing**: FormStack is unconstrained when \`maxWidth\` is omitted. Use \`tablet\` or \`desktop\` to set a readable maximum on the form. Explicit \`maxWidth\` values on individual controls remain intentional overrides.

**Accessibility**: Give the form an accessible name when needed, preserve label and description associations for every control, and provide a clearly labeled submit action. FormStack owns layout, not field state, validation, or submission behavior.`,
      },
    },
  },
  argTypes: {
    gap: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      description: 'Vertical spacing between direct children.',
    },
    maxWidth: {
      options: ['tablet', 'desktop'],
      control: { type: 'select' },
      description:
        'Optional maximum width for the form. Omit it to use the available container width.',
    },
    as: {
      control: { type: 'text' },
      description:
        'Root element. Defaults to `form`; use `div` only inside an existing form.',
    },
    children: {
      control: false,
      description: 'Form groups, fieldsets, form rows, and form actions.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional classes appended after FormStack classes.',
    },
  },
  args: {
    gap: 'md',
    'aria-label': 'Participant planning',
    onSubmit: preventSubmit,
  },
} satisfies Meta<typeof FormStack>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => (
    <FormStack {...args}>
      <Fields prefix="form-stack-playground" />
      <Button type="submit">Save participant</Button>
    </FormStack>
  ),
}

export const Default: Story = {
  render: () => (
    <FormStack aria-label="Participant planning" onSubmit={preventSubmit}>
      <Fields prefix="form-stack-default" />
      <Button type="submit">Save participant</Button>
    </FormStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Participant planning' })

    await expect(form).toHaveClass('pathable-stack', 'pathable-form-stack')
    for (const control of [
      canvas.getByLabelText('Participant name'),
      canvas.getByLabelText('Service area'),
      canvas.getByLabelText('Planning notes'),
    ]) {
      await expect(window.getComputedStyle(control).maxWidth).toBe('none')
      await expect(control.getBoundingClientRect().width).toBeGreaterThan(480)
    }
  },
}

export const MaxWidthTablet: Story = {
  render: () => (
    <FormStack
      maxWidth="tablet"
      gap="lg"
      aria-label="Constrained participant planning"
      onSubmit={preventSubmit}
    >
      <Fields prefix="form-stack-tablet" />
    </FormStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', {
      name: 'Constrained participant planning',
    })

    await expect(window.getComputedStyle(form).maxWidth).toBe('640px')
    await expect(window.getComputedStyle(form).rowGap).toBe('24px')
  },
}

export const MaxWidthDesktop: Story = {
  render: () => (
    <FormStack
      maxWidth="desktop"
      aria-label="Desktop participant planning"
      onSubmit={preventSubmit}
    >
      <Fields prefix="form-stack-desktop" />
    </FormStack>
  ),
}

export const ExplicitControlConstraint: Story = {
  render: () => (
    <>
      <style>{`.form-stack-consumer-width { max-width: 12rem; }`}</style>
      <FormStack aria-label="Control width override" onSubmit={preventSubmit}>
        <div className="pathable-form-row">
          <FormGroup>
            <Label htmlFor="form-stack-short-code">Short code</Label>
            <Input
              id="form-stack-short-code"
              name="shortCode"
              maxWidth="mobile"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="form-stack-custom-code">
              Custom constrained code
            </Label>
            <Input
              className="form-stack-consumer-width"
              id="form-stack-custom-code"
              name="customCode"
            />
          </FormGroup>
        </div>
      </FormStack>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const shortCode = canvas.getByLabelText('Short code')
    const customCode = canvas.getByLabelText('Custom constrained code')

    await expect(shortCode).toHaveClass('pathable-maxw-mobile')
    await expect(window.getComputedStyle(shortCode).maxWidth).toBe('320px')
    await expect(window.getComputedStyle(customCode).maxWidth).toBe('192px')
    await expect(shortCode.getBoundingClientRect().top).toBeCloseTo(
      customCode.getBoundingClientRect().top,
      0,
    )
  },
}

export const WithFormRow: Story = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => (
    <FormStack
      maxWidth="desktop"
      gap="lg"
      aria-label="Scheduling settings"
      onSubmit={preventSubmit}
    >
      <div className="pathable-form-row">
        <FormGroup>
          <Label htmlFor="form-stack-location">Service location</Label>
          <Hint id="form-stack-location-hint">
            Choose where the participant receives support.
          </Hint>
          <Select
            id="form-stack-location"
            name="location"
            aria-describedby="form-stack-location-hint"
          >
            <option>Community site</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="form-stack-status">Status</Label>
          <Select id="form-stack-status" name="status">
            <option>Active</option>
          </Select>
        </FormGroup>
      </div>
    </FormStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Scheduling settings' })
    const location = canvas.getByLabelText('Service location')
    const status = canvas.getByLabelText('Status')

    await expect(window.innerWidth).toBeGreaterThanOrEqual(1024)
    await expect(form.getBoundingClientRect().width).toBeGreaterThan(480)
    await expect(location.getBoundingClientRect().top).toBeCloseTo(
      status.getBoundingClientRect().top,
      0,
    )
  },
}

export const InsideExistingForm: Story = {
  render: () => (
    <form aria-label="Existing submission form" onSubmit={preventSubmit}>
      <FormStack as="div" maxWidth="tablet">
        <Fields prefix="form-stack-existing-form" />
        <Button type="submit">Save participant</Button>
      </FormStack>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getAllByRole('form')).toHaveLength(1)
    await expect(
      canvas.getByText('Save participant').parentElement,
    ).toHaveClass('pathable-form-stack')
  },
}

export const Narrow: Story = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  render: () => (
    <FormStack
      aria-label="Narrow participant planning"
      onSubmit={preventSubmit}
    >
      <Fields prefix="form-stack-narrow" />
    </FormStack>
  ),
  play: async ({ canvasElement }) => {
    const form = within(canvasElement).getByRole('form', {
      name: 'Narrow participant planning',
    })

    await expect(window.innerWidth).toBe(320)
    await expect(form.scrollWidth).toBeLessThanOrEqual(form.clientWidth + 2)
  },
}
