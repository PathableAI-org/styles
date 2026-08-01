import { MediaBlock } from '../../../components/MediaBlock/MediaBlock'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'

const PORTRAIT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='8' fill='%2300365c'/%3E%3Ccircle cx='48' cy='35' r='15' fill='%23ffffff' fill-opacity='.85'/%3E%3Cellipse cx='48' cy='82' rx='30' ry='22' fill='%23ffffff' fill-opacity='.85'/%3E%3C/svg%3E"

const participantPortrait = (
  <img
    src={PORTRAIT}
    alt="Portrait of participant Jordan Lee"
    width={96}
    height={96}
  />
)

const meta = {
  title: 'Components/Layout/MediaBlock',
  component: MediaBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A media-and-content composition that applies the existing PathAble media-block regions without changing the semantics of consumer-supplied media or text.

**When to use**: Use MediaBlock for a compact image, icon, illustration, or other media item paired with a title, description, or richer supporting content.

**When not to use**: Do not use MediaBlock as a generic card, interactive control, or image component. Consumers remain responsible for meaningful image alt text, decorative-media handling, and document heading levels.

**Underlying elements**: A root \`<div>\`, a media \`<div>\`, and an optional body \`<div>\`. Title and description are neutral containers, so consumers supply semantic elements such as headings when the document outline requires them.

**Known constraints**: \`media\` is required. The body and each optional title or description region are omitted when their content is absent. MediaBlock adds no layout CSS and does not invent alt text or ARIA semantics.`,
      },
    },
  },
  argTypes: {
    media: {
      control: false,
      description:
        'Required consumer-owned media. Native image, SVG, video, and iframe semantics and attributes are preserved unchanged.',
    },
    title: {
      control: { type: 'text' },
      description:
        'Optional title content rendered in a neutral title region. Supply a heading element when appropriate for the surrounding document outline.',
    },
    description: {
      control: { type: 'text' },
      description:
        'Optional concise supporting content rendered in the description region.',
    },
    children: {
      control: false,
      description:
        'Optional rich body content rendered after the title and description regions.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional root class names appended after the PathAble media-block class.',
    },
  },
  args: {
    media: participantPortrait,
    title: <h3>Jordan Lee</h3>,
    description: 'Employment coaching participant',
  },
} satisfies Meta<typeof MediaBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    media: participantPortrait,
    title: <h3>Jordan Lee</h3>,
    description: 'Employment coaching participant',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('img', { name: 'Portrait of participant Jordan Lee' }),
    ).toHaveAttribute('width', '96')
    await expect(
      canvas.getByRole('heading', { name: 'Jordan Lee', level: 3 }),
    ).toBeVisible()
  },
}

export const WithoutTitle: Story = {
  args: {
    media: participantPortrait,
    title: undefined,
    description: 'Participant profile awaiting an assigned coach.',
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.pathable-media-block__title'),
    ).not.toBeInTheDocument()
    await expect(
      within(canvasElement).getByText(
        'Participant profile awaiting an assigned coach.',
      ),
    ).toBeVisible()
  },
}

export const RichBody: Story = {
  args: {
    media: participantPortrait,
    title: <h3>Jordan Lee</h3>,
    description: 'Current coaching focus',
    children: (
      <>
        <p>Building confidence for workplace communication.</p>
        <ul>
          <li>Practice interview responses</li>
          <li>Review accommodation requests</li>
        </ul>
      </>
    ),
  },
}

export const CustomAttributes: Story = {
  args: {
    media: (
      <img
        src={PORTRAIT}
        alt="Portrait of participant Casey Morgan"
        width={96}
        height={96}
        data-media-source="participant-directory"
      />
    ),
    title: <h3>Casey Morgan</h3>,
    description: 'Program participant',
    id: 'participant-media-block',
    className: 'participant-summary',
    'aria-label': 'Participant summary for Casey Morgan',
    'data-participant-id': 'casey-morgan',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvas.getByLabelText('Participant summary for Casey Morgan')
    const image = canvas.getByRole('img', {
      name: 'Portrait of participant Casey Morgan',
    })

    await expect(root).toHaveClass(
      'pathable-media-block',
      'participant-summary',
    )
    await expect(root).toHaveAttribute('id', 'participant-media-block')
    await expect(root).toHaveAttribute('data-participant-id', 'casey-morgan')
    await expect(image).toHaveAttribute(
      'data-media-source',
      'participant-directory',
    )
    await expect(
      root.querySelector('.pathable-media-block__media'),
    ).toBeInTheDocument()
    await expect(
      root.querySelector('.pathable-media-block__body'),
    ).toBeInTheDocument()
  },
}

export const MediaOnly: Story = {
  args: {
    media: (
      <img
        src={PORTRAIT}
        alt="Portrait of participant Taylor Reed"
        width={96}
        height={96}
      />
    ),
    title: undefined,
    description: undefined,
    children: undefined,
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.pathable-media-block__body'),
    ).not.toBeInTheDocument()
    await expect(
      canvasElement.querySelector('.pathable-media-block__title'),
    ).not.toBeInTheDocument()
    await expect(
      canvasElement.querySelector('.pathable-media-block__description'),
    ).not.toBeInTheDocument()
  },
}

export const LongContent: Story = {
  args: {
    media: participantPortrait,
    title: (
      <h3>
        Jordan Lee employment coaching participation and workplace readiness
        summary
      </h3>
    ),
    description:
      'Jordan is preparing for a customer-service placement and is reviewing communication strategies, workplace accommodations, transportation planning, and follow-up support with the coaching team.',
    children: (
      <p>
        The next session will cover interview practice, a review of current
        goals, and confirmation of the support people who will join the
        placement planning meeting.
      </p>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(/The next session will cover/),
    ).toBeVisible()
  },
}

export const Narrow: Story = {
  args: {
    media: participantPortrait,
    title: <h3>Jordan Lee</h3>,
    description: 'Employment coaching participant',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const ParticipantSummary: Story = {
  render: () => (
    <section aria-labelledby="coaching-participants-heading">
      <h2 id="coaching-participants-heading">Coaching participants</h2>
      <MediaBlock
        media={participantPortrait}
        title={<h3>Jordan Lee</h3>}
        description="Next coaching session: August 7 at 10:00 AM"
      >
        <p>Current goal: prepare for a customer-service placement interview.</p>
        <a href="#jordan-lee-summary">Open participant summary</a>
      </MediaBlock>
    </section>
  ),
}
