import { Form } from '../../../components/Form/Form'
import { Input } from '../../../components/Input/Input'
import { Button } from '../../../components/Button/Button'
import type { FormEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

const defaultChildren = (
  <>
    <label htmlFor="participant-name">Participant name</label>
    <Input id="participant-name" name="participantName" />
    <Button type="submit">Save participant</Button>
  </>
)

const preventSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()
}

const meta = {
  title: 'Components/Form Controls/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native form boundary for collecting and submitting related user input. It wraps the native \`<form>\` with the \`.pathable-form\` class and forwards standard form attributes.

**When to use**: Use Form for a real form submission boundary containing labeled controls and an appropriate submit action. Choose the native form attributes that match the application's submission behavior.

**When not to use**: Do not use Form as a generic layout container or nest one form inside another. It does not manage control state, validation, submission requests, or server responses.

**Underlying element**: Native \`<form>\`. The wrapper does not intercept submission, prevent default browser behavior, or add validation logic.

**Accessibility**: Give the form an accessible name with a visible heading referenced by \`aria-labelledby\` or an appropriate \`aria-label\` when needed. Provide an accessible name for every contained control and a clearly labeled submit action.`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'none',
      description:
        'Labeled form controls and the actions that submit or otherwise operate on the form.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble form class.',
    },
    action: {
      control: { type: 'text' },
      description:
        'Native submission URL. Use onSubmit for consumer-managed submission handling.',
    },
    method: {
      options: ['get', 'post'],
      control: { type: 'select' },
      description: 'Native submission method used by the browser.',
    },
    noValidate: {
      control: { type: 'boolean' },
      description:
        'Disables native constraint validation. Use only when an equivalent accessible validation flow is provided.',
    },
  },
  args: {
    'aria-label': 'Participant details',
    children: defaultChildren,
    method: 'post',
    noValidate: false,
    onSubmit: preventSubmit,
  },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    children: defaultChildren,
  },
}

const submitSpy = fn()

function FormSubmissionStory() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submitSpy(event)
  }

  return (
    <Form aria-label="Save participant" onSubmit={handleSubmit}>
      <label htmlFor="submission-name">Participant name</label>
      <Input
        id="submission-name"
        name="participantName"
        defaultValue="Alex Morgan"
        required
      />
      <Button type="submit">Save participant</Button>
    </Form>
  )
}

export const Submission: Story = {
  render: () => <FormSubmissionStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Save participant' })
    const button = canvas.getByRole('button', { name: 'Save participant' })
    const input = canvas.getByRole('textbox', { name: 'Participant name' })

    await expect(form).toHaveClass('pathable-form')
    await userEvent.click(button)
    await expect(submitSpy).toHaveBeenCalledTimes(1)

    submitSpy.mockClear()
    await userEvent.click(input)
    await expect(input).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(submitSpy).toHaveBeenCalledTimes(1)
  },
}

export const CustomAttributes: Story = {
  render: () => (
    <Form
      id="participant-form"
      action="/participants"
      method="post"
      noValidate
      className="custom-form"
      aria-label="Participant form"
      data-testid="participant-form"
    >
      <label htmlFor="custom-participant-name">Participant name</label>
      <Input id="custom-participant-name" name="participantName" />
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Participant form' })

    await expect(form).toHaveClass('pathable-form', 'custom-form')
    await expect(form).toHaveAttribute('id', 'participant-form')
    await expect(form).toHaveAttribute('action', '/participants')
    await expect(form).toHaveAttribute('method', 'post')
    await expect(form).toHaveAttribute('novalidate')
    await expect(form).toHaveAttribute('data-testid', 'participant-form')
  },
}

export const EmptyContent: Story = {
  args: {
    'aria-label': 'Empty form',
    children: null,
  },
}

export const LongContent: Story = {
  render: () => (
    <Form
      aria-label="Detailed participant information"
      onSubmit={preventSubmit}
    >
      <label htmlFor="long-name">
        Participant full name as it should appear in formal coaching records
      </label>
      <Input id="long-name" name="participantName" />
      <Button type="submit">Save detailed participant information</Button>
    </Form>
  ),
}

export const Narrow: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <Form aria-label="Narrow participant form" onSubmit={preventSubmit}>
      <label htmlFor="narrow-name">
        Participant name and preferred contact
      </label>
      <Input id="narrow-name" name="participantName" />
      <Button type="submit">Save participant details</Button>
    </Form>
  ),
}
