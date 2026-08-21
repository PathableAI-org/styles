import { useRef } from 'react'
import { Text } from '../../../components/Text/Text'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A typographic primitive that expresses semantic text roles and tones instead of raw font or palette values.

**When to use**: For any body, small, or caption text that should follow the design system's typography scale and semantic color meanings (\`default\`, \`muted\`, \`danger\`, \`success\`).

**When not to use**: For headings — use the \`Heading\` primitive for document-outline semantics. \`Text\` does not accept raw font size/weight/line-height/family props, nor layout props (margin, padding, width, display); use \`className\`/\`style\` as the escape hatch.

**Underlying element**: \`<p>\` by default; override with \`as\` for \`span\`, \`label\`, \`figcaption\`, and other text elements. Native props are restricted to the selected element.

**Accessibility**: All supported tone colors pass WCAG AA contrast on the default surface. Color is never the sole signal for meaning — roles are conveyed through element semantics and typography, and tones work in forced-colors mode.`,
      },
    },
  },
  argTypes: {
    variant: {
      options: ['body', 'small', 'caption'],
      control: { type: 'select' },
      description:
        'Semantic typography role. `body` = 16px, `small` = 14px, `caption` = 12px (design-system scale).',
    },
    tone: {
      options: ['default', 'muted', 'danger', 'success'],
      control: { type: 'select' },
      description:
        'Semantic text color meaning mapped to design-system tokens (AA contrast on default surface).',
    },
    as: {
      control: { type: 'text' },
      description:
        'The element to render. Defaults to `p`. Use `span`, `label`, `figcaption`, `em`, `strong`, `small`, `time`.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the Text classes.',
    },
    children: {
      control: { type: 'text' },
      description: 'Text content or inline markup rendered inside the element.',
    },
  },
  args: {
    children: 'Sample text.',
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

// ── Default (no props) ─────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Text>Default paragraph text — applies the body typography role.</Text>
  ),
}

// ── US1: Semantic roles ────────────────────────────────────────────

export const Body: Story = {
  render: () => (
    <Text variant="body">
      Body text is the default reading role for paragraphs (16px/24px).
    </Text>
  ),
}

export const Small: Story = {
  render: () => (
    <Text variant="small">
      Small text (14px/20px) for compact supporting copy.
    </Text>
  ),
}

export const Caption: Story = {
  render: () => (
    <Text variant="caption">
      Caption text (12px/16px) for figure captions and fine print.
    </Text>
  ),
}

// ── US2: Tones ─────────────────────────────────────────────────────

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text variant="body" tone="default">
        Default tone — normal text color.
      </Text>
      <Text variant="body" tone="muted">
        Muted tone — secondary emphasis.
      </Text>
      <Text variant="body" tone="danger">
        Danger tone — error conditions.
      </Text>
      <Text variant="body" tone="success">
        Success tone — positive confirmations.
      </Text>
    </div>
  ),
}

export const SmallMuted: Story = {
  render: () => (
    <Text variant="small" tone="muted">
      Small, muted supporting text.
    </Text>
  ),
}

export const CaptionDanger: Story = {
  render: () => (
    <Text variant="caption" tone="danger">
      Caption text conveying an error or required-field note.
    </Text>
  ),
}

// ── US3: As another element ────────────────────────────────────────

export const AsSemanticElements: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text>
        Rendered as a paragraph (<code>p</code>).
      </Text>
      <Text as="span" tone="muted">
        Inline text as a <code>span</code>.
      </Text>
      <Text as="label" variant="small" htmlFor="example-input">
        A form <code>label</code> with htmlFor.
      </Text>
      <Text as="figcaption" variant="caption" tone="muted">
        A figure caption as <code>figcaption</code>.
      </Text>
    </div>
  ),
}

// ── US4: Composition, refs, SSR-safe ───────────────────────────────

export const Composition: Story = {
  render: () => {
    const ref = useRef<HTMLSpanElement>(null)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Text variant="body" className="story-intro-copy" id="intro-copy">
          A paragraph with a consumer <code>className</code> and <code>id</code>
          , composed after the Text classes.
        </Text>
        <Text as="span" variant="caption" tone="danger" ref={ref}>
          A <code>caption</code> tone, rendered as a <code>span</code> with a
          forwarded ref.
        </Text>
      </div>
    )
  },
}
