import { SummaryBox } from '../../../components/SummaryBox/SummaryBox'
import type { Meta, StoryObj } from '@storybook/react'
import { LONG_CONTENT } from './fixtures'

const meta = {
  title: 'Components/Communication/SummaryBox',
  component: SummaryBox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A summary box that highlights key information or action items. Provides a visually distinct container for important takeaways.

**When to use**: To draw attention to key information, action items, or important context that the user should not miss.

**When not to use**: Do not use SummaryBox for general content that is not critical. Do not use SummaryBox as a replacement for headings or section titles.

**Underlying element**: \`<div>\`

**Known constraints**: The component does not support status variants. Use Alert for status-dependent messaging.`,
      },
    },
  },
  argTypes: {
    heading: {
      control: { type: 'text' },
      description: 'Summary box heading rendered with the __heading class.',
    },
    children: {
      control: { type: 'text' },
      description:
        'Summary box body content rendered inside the __text container.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after PathAble classes.',
    },
  },
  args: {
    heading: 'Key Information',
    children: 'This is a summary box with important information.',
  },
} satisfies Meta<typeof SummaryBox>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    heading: 'Key Information',
    children: (
      <p>
        This summary box highlights important information that users should
        review before proceeding.
      </p>
    ),
  },
}

export const WithLink: Story = {
  args: {
    heading: 'Related Resources',
    children: (
      <>
        <p>Review the following documents for more information:</p>
        <ul>
          <li>
            <a className="pathable-summary-box__link" href="#/">
              Eligibility Requirements
            </a>
          </li>
          <li>
            <a className="pathable-summary-box__link" href="#/">
              Application Instructions
            </a>
          </li>
          <li>
            <a className="pathable-summary-box__link" href="#/">
              Frequently Asked Questions
            </a>
          </li>
        </ul>
      </>
    ),
  },
}

export const RichContent: Story = {
  args: {
    heading: 'Application Checklist',
    children: (
      <>
        <p>
          Before submitting your application, ensure you have completed the
          following:
        </p>
        <ul>
          <li>Personal information section</li>
          <li>Employment history</li>
          <li>References</li>
          <li>Supporting documents</li>
        </ul>
        <p>Incomplete applications may be delayed.</p>
      </>
    ),
  },
}

export const LongContent: Story = {
  args: {
    heading: 'Summary of Benefits',
    children: <p>{LONG_CONTENT}</p>,
  },
}

export const Narrow: Story = {
  args: {
    heading: 'Key Information',
    children: <p>This summary box displayed in a narrow viewport.</p>,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
