import { ProcessList } from '../../../components/ProcessList/ProcessList'
import type { Meta, StoryObj } from '@storybook/react'
import { LONG_CONTENT, PROCESS_ITEMS } from './fixtures'

const meta = {
  title: 'Components/Communication/ProcessList',
  component: ProcessList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `An ordered list that presents a sequence of process steps.

**When to use**: To display a multi-step process with ordered steps where each step has a heading and explanatory content.

**When not to use**: Do not use for progress tracking (use StepIndicator). Do not use for unordered lists of items.

**Underlying element**: \`<ol>\` with \`<li>\` children.

**Known constraints**: Items are rendered in array order. Body content is semantic consumer content without a wrapper class.`,
      },
    },
  },
  argTypes: {
    items: {
      description: 'Ordered array of process items with id, heading, and body.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
  args: {
    items: PROCESS_ITEMS,
  },
} satisfies Meta<typeof ProcessList>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    items: PROCESS_ITEMS,
  },
}

export const Empty: Story = {
  args: {
    items: [],
  },
}

export const LongContent: Story = {
  args: {
    items: [
      { id: 'step-1', heading: 'Research Phase', body: <p>{LONG_CONTENT}</p> },
      { id: 'step-2', heading: 'Design Phase', body: <p>{LONG_CONTENT}</p> },
    ],
  },
}

export const Narrow: Story = {
  args: {
    items: PROCESS_ITEMS,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
