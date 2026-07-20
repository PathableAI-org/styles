import { StepIndicator } from '../../../components/StepIndicator/StepIndicator'
import type { Meta, StoryObj } from '@storybook/react'
import { STEPS } from './fixtures'

const meta = {
  title: 'Components/Communication/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A step indicator that shows progress through an ordered sequence of steps.

**When to use**: To show users where they are in a multi-step process and what remains.

**When not to use**: Do not use for unordered processes (use ProcessList). Do not use for fewer than 2 steps.

**Underlying element**: A wrapping \`<div>\` containing an \`<ol>\` with step segments and labels.

**Known constraints**: Current step is 1-based. Invalid or missing currentStep produces no invented current state. Steps before currentStep are marked completed.`,
      },
    },
  },
  argTypes: {
    steps: { description: 'Ordered array of steps with id and label.' },
    currentStep: {
      control: { type: 'number' },
      description: 'One-based current step position.',
    },
    heading: {
      control: { type: 'text' },
      description: 'Optional overall progress heading.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
  args: {
    steps: STEPS,
    currentStep: 2,
  },
} satisfies Meta<typeof StepIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const First: Story = {
  args: { steps: STEPS, currentStep: 1 },
}

export const Middle: Story = {
  args: { steps: STEPS, currentStep: 2 },
}

export const Final: Story = {
  args: { steps: STEPS, currentStep: 4 },
}

export const NoCurrent: Story = {
  args: { steps: STEPS, currentStep: undefined },
}

export const InvalidCurrent: Story = {
  args: { steps: STEPS, currentStep: 99 },
}

export const LongLabels: Story = {
  args: {
    steps: [
      {
        id: 'eligibility',
        label: 'Eligibility Screening and Document Verification Process',
      },
      {
        id: 'enrollment',
        label: 'Complete Program Enrollment Application and Consent Forms',
      },
      {
        id: 'assessment',
        label: 'Initial Needs Assessment and Goal Setting Session',
      },
    ],
    currentStep: 2,
  },
}

export const Narrow: Story = {
  args: { steps: STEPS, currentStep: 2 },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
