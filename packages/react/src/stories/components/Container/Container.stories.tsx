import { Container } from '../../../components/Container/Container'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A layout primitive that establishes a constrained page-width region with consistent horizontal gutters. The Container standardizes the common "centered content with a max-width and page-gutter padding" pattern into a single component.

**When to use**: For wrapping page content in a centered, width-constrained region. Use \`size="standard"\` for content pages, \`size="wide"\` for dashboards and data tables, and \`size="full"\` for full-bleed sections.

**When not to use**: Container size options are fixed. For arbitrary max-width constraints use a plain element with the \`pathable-maxw-*\` CSS utility classes, or use \`Box\` once that primitive is available. Container is opinionated about width and gutter behavior.

**Underlying element**: \`<div>\` by default; override with \`as\` for semantic landmarks (\`<main>\`, \`<section>\`, \`<nav>\`).

**Known constraints**: Container does not accept arbitrary \`width\` or \`maxWidth\` props. The \`size\` prop is the exclusive width-control mechanism. No typography, color, spacing, or display props are supported.`,
      },
    },
  },
  argTypes: {
    size: {
      options: ['standard', 'wide', 'full'],
      control: { type: 'select' },
      description:
        'The width constraint for the container. `standard` is 1024px for content pages, `wide` is 1280px for dashboards and data tables, `full` is 100% for full-bleed sections.',
    },
    as: {
      control: { type: 'text' },
      description:
        'The HTML element to render. Defaults to `div`. Use `main`, `section`, or `nav` for semantic landmark elements.',
    },
    children: {
      control: { type: 'text' },
      description:
        'Child content rendered as direct children of the container with no intermediate wrappers.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the container classes. Use for consumer-specific overrides only.',
    },
  },
  args: {
    size: 'standard',
    children: 'Container content goes here.',
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Fixed visual state stories — each is a supported, deterministic contract
// ---------------------------------------------------------------------------

export const Standard: Story = {
  args: {
    size: 'standard',
  },
  render: (args) => (
    <Container size={args.size}>
      <div style={{ background: '#e8f5e9', padding: '2rem', borderRadius: 4 }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Standard Container — 1024px</h3>
        <p style={{ margin: 0, color: '#555' }}>
          This container is constrained to 1024px max-width with horizontal
          gutter padding. Suitable for content pages, forms, and reading
          layouts.
        </p>
      </div>
    </Container>
  ),
}

export const Wide: Story = {
  args: {
    size: 'wide',
  },
  render: (args) => (
    <Container size={args.size}>
      <div style={{ background: '#e3f2fd', padding: '2rem', borderRadius: 4 }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Wide Container — 1280px</h3>
        <p style={{ margin: 0, color: '#555' }}>
          This container is constrained to 1280px max-width. Suitable for
          dashboards, data tables, and content that benefits from more
          horizontal space.
        </p>
      </div>
    </Container>
  ),
}

export const Full: Story = {
  args: {
    size: 'full',
  },
  render: (args) => (
    <Container size={args.size}>
      <div style={{ background: '#fff3e0', padding: '2rem', borderRadius: 4 }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>Full Container — 100%</h3>
        <p style={{ margin: 0, color: '#555' }}>
          This container spans the full width of its parent. Suitable for hero
          sections, banners, and full-bleed layouts. Horizontal gutters are
          still applied.
        </p>
      </div>
    </Container>
  ),
}

// ---------------------------------------------------------------------------
// Long content — verifies text overflow and wrapping at constrained widths
// ---------------------------------------------------------------------------

export const LongContent: Story = {
  args: {
    size: 'standard',
  },
  render: (args) => (
    <Container size={args.size}>
      <p>
        This is a long paragraph of text that demonstrates how content wraps
        within a constrained container. The container applies horizontal gutter
        padding and a maximum width, so text should wrap naturally without
        overflowing. This paragraph is intentionally long to test wrapping
        behavior across different viewport sizes and container widths.
      </p>
    </Container>
  ),
}

// ---------------------------------------------------------------------------
// Semantic landmark — demonstrates as="main" usage
// ---------------------------------------------------------------------------

export const AsMain: Story = {
  args: {
    size: 'standard',
  },
  render: (args) => (
    <Container as="main" size={args.size}>
      <div style={{ background: '#f3e5f5', padding: '2rem', borderRadius: 4 }}>
        <h3 style={{ margin: '0 0 0.5rem' }}>&lt;main&gt; Landmark</h3>
        <p style={{ margin: 0, color: '#555' }}>
          This container renders as a `&lt;main&gt;` element, providing a
          semantic landmark for the page's primary content.
        </p>
      </div>
    </Container>
  ),
}
