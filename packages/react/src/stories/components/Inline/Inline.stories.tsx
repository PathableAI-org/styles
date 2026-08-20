import { Inline } from '../../../components/Inline/Inline'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Inline',
  component: Inline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A layout primitive that arranges children in a single horizontal row with token-based spacing. Inline creates a non-wrapping flex container (\`flex-direction: row\`) that does not wrap — children remain on one row regardless of container width.

**When to use**: For laying out horizontal rows of items — such as navigation links, toolbar buttons, or status indicators — where items should stay on one line.

**When not to use**: For wrapping horizontal layouts where items should flow to new lines, use Cluster. For vertical layouts, use Stack.

**Underlying element**: \`<div>\` by default; override with \`as\` for semantic landmarks (\`<nav>\`, \`<section>\`).

**Known constraints**: Inline does not accept typography, color, tone, display, visibility, or child-wrapping props. Gap values are named (\`sm\`, \`md\`, \`lg\`, \`xl\`) matching the SCSS contract. Children that exceed the container width will overflow — use Cluster for wrapping layouts.`,
      },
    },
  },
  argTypes: {
    gap: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      description:
        'Horizontal spacing between children. `sm` = 8px, `md` = 16px (default CSS), `lg` = 24px, `xl` = 32px.',
    },
    align: {
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      control: { type: 'select' },
      description:
        'Cross-axis alignment of children within the row. Defaults to `stretch` when omitted.',
    },
    justify: {
      options: ['start', 'center', 'end', 'between', 'around'],
      control: { type: 'select' },
      description:
        'Inline-axis distribution of children along the row. Defaults to `start` when omitted.',
    },
    as: {
      control: { type: 'text' },
      description: 'Semantic HTML element to render (e.g., "nav", "section").',
    },
  },
} satisfies Meta<typeof Inline>

export default meta
type Story = StoryObj<typeof meta>

const childBlock = (label: string) => (
  <div
    style={{
      background: '#e8f5e9',
      padding: '1rem 1.5rem',
      borderRadius: 4,
      color: '#1b5e20',
      fontWeight: 600,
      border: '1px solid #c8e6c9',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
)

const childBlockAlt = (label: string) => (
  <div
    style={{
      background: '#e3f2fd',
      padding: '1rem 1.5rem',
      borderRadius: 4,
      color: '#0d47a1',
      fontWeight: 600,
      border: '1px solid #bbdefb',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
)

const childBlockAccent = (label: string) => (
  <div
    style={{
      background: '#f3e5f5',
      padding: '1rem 1.5rem',
      borderRadius: 4,
      color: '#4a148c',
      fontWeight: 600,
      border: '1px solid #e1bee7',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </div>
)

// ── Default (no props) ───────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Inline>
      {childBlock('Item A')}
      {childBlockAlt('Item B')}
      {childBlockAccent('Item C')}
    </Inline>
  ),
}

// ── Gap stories ──────────────────────────────────────────────────

export const GapSmall: Story = {
  args: { gap: 'sm' },
  render: (args) => (
    <Inline gap={args.gap}>
      {childBlock('Gap SM (8px)')}
      {childBlockAlt('Gap SM (8px)')}
      {childBlockAccent('Gap SM (8px)')}
    </Inline>
  ),
}

export const GapMedium: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <Inline gap={args.gap}>
      {childBlock('Gap MD (16px)')}
      {childBlockAlt('Gap MD (16px)')}
      {childBlockAccent('Gap MD (16px)')}
    </Inline>
  ),
}

export const GapLarge: Story = {
  args: { gap: 'lg' },
  render: (args) => (
    <Inline gap={args.gap}>
      {childBlock('Gap LG (24px)')}
      {childBlockAlt('Gap LG (24px)')}
      {childBlockAccent('Gap LG (24px)')}
    </Inline>
  ),
}

export const GapExtraLarge: Story = {
  args: { gap: 'xl' },
  render: (args) => (
    <Inline gap={args.gap}>
      {childBlock('Gap XL (32px)')}
      {childBlockAlt('Gap XL (32px)')}
      {childBlockAccent('Gap XL (32px)')}
    </Inline>
  ),
}

// ── Alignment stories ────────────────────────────────────────────

export const AlignCenter: Story = {
  render: () => (
    <Inline gap="md" align="center">
      {childBlock('Center-aligned')}
      <div
        style={{
          background: '#e3f2fd',
          padding: '2rem 1.5rem',
          borderRadius: 4,
          color: '#0d47a1',
          fontWeight: 600,
          border: '1px solid #bbdefb',
        }}
      >
        Taller item
      </div>
      {childBlockAccent('Center-aligned')}
    </Inline>
  ),
}

export const AlignStart: Story = {
  render: () => (
    <Inline gap="md" align="start">
      {childBlock('Start-aligned')}
      <div
        style={{
          background: '#e3f2fd',
          padding: '2rem 1.5rem',
          borderRadius: 4,
          color: '#0d47a1',
          fontWeight: 600,
          border: '1px solid #bbdefb',
        }}
      >
        Taller item
      </div>
      {childBlockAccent('Start-aligned')}
    </Inline>
  ),
}

export const JustifyBetween: Story = {
  render: () => (
    <Inline gap="md" justify="between">
      {childBlock('Left')}
      {childBlockAlt('Center-ish')}
      {childBlockAccent('Right')}
    </Inline>
  ),
}

export const JustifyCenter: Story = {
  render: () => (
    <Inline gap="md" justify="center">
      {childBlock('Left')}
      {childBlockAlt('Right')}
    </Inline>
  ),
}

// ── Sizing & spacing ─────────────────────────────────────────────

export const FullWidthCentered: Story = {
  render: () => (
    <Inline
      gap="md"
      width="full"
      maxWidth="desktop"
      marginX="auto"
      justify="between"
    >
      {childBlock('Left')}
      {childBlockAlt('Center')}
      {childBlockAccent('Right')}
    </Inline>
  ),
}

// ── Nested layout ────────────────────────────────────────────────

export const NestedLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontWeight: 700, color: '#00365c' }}>
          Inline inside Stack
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: '#f5f5f5',
            padding: '1rem',
            borderRadius: 8,
            border: '2px dashed #ccc',
          }}
        >
          <div style={{ fontWeight: 600, color: '#666' }}>Stack</div>
          <Inline gap="sm">
            {childBlock('Nav 1')}
            {childBlockAlt('Nav 2')}
            {childBlockAccent('Nav 3')}
          </Inline>
        </div>
      </div>
    </div>
  ),
}
