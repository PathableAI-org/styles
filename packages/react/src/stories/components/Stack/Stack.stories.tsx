import { Stack } from '../../../components/Stack/Stack'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A layout primitive that defines a vertical stacking relationship among its immediate children. Stack replaces ad-hoc \`flex-direction: column\` utility strings with a semantic abstraction.

**When to use**: For laying out a sequence of content blocks — such as a page header, body section, and footer — in a vertical stack with consistent token-based spacing. Use the \`gap\` prop to control vertical spacing between children.

**When not to use**: Stack is for vertical layouts only. For wrapping horizontal layouts, use Inline or Cluster (upcoming). For grid layouts, use Grid (upcoming). Stack does not wrap or re-order children.

**Underlying element**: \`<div>\` by default; override with \`as\` for semantic landmarks (\`<section>\`, \`<nav>\`, \`<ol>\`).

**Known constraints**: Stack does not accept typography, color, tone, display, visibility, or child-wrapping props. Gap values are named (\`sm\`, \`md\`, \`lg\`, \`xl\`) matching the SCSS contract. \`justifyContent\` is not yet exposed.`,
      },
    },
  },
  argTypes: {
    gap: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      description:
        'Vertical spacing between children. `sm` = 8px, `md` = 16px (default CSS), `lg` = 24px, `xl` = 32px.',
    },
    align: {
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      control: { type: 'select' },
      description:
        'Cross-axis alignment of children within the stack. Defaults to `stretch` when omitted.',
    },
    width: {
      options: ['auto', 'full'],
      control: { type: 'select' },
      description: 'Width constraint on the stack root.',
    },
    maxWidth: {
      options: ['mobile', 'mobile-lg', 'tablet', 'desktop'],
      control: { type: 'select' },
      description: 'Maximum width constraint on the stack root.',
    },
    marginX: {
      control: { type: 'text' },
      description: 'Horizontal external margin (e.g., "auto" for centering).',
    },
    as: {
      control: { type: 'text' },
      description:
        'The HTML element to render. Defaults to `div`. Use `section`, `nav`, `ol`, or `ul` for semantic elements.',
    },
    children: {
      control: false,
      description:
        'Child content rendered as direct children of the stack with no intermediate wrappers.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the stack classes.',
    },
  },
  args: {
    gap: 'md',
  },
} satisfies Meta<typeof Stack>

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
    }}
  >
    {label}
  </div>
)

// ── Default (no props) ───────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Stack>
      {childBlock('Stack Item A')}
      {childBlockAlt('Stack Item B')}
      {childBlockAccent('Stack Item C')}
    </Stack>
  ),
}

// ── Gap stories ──────────────────────────────────────────────────

export const GapSmall: Story = {
  args: { gap: 'sm' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('Gap SM (8px)')}
      {childBlockAlt('Gap SM (8px)')}
      {childBlockAccent('Gap SM (8px)')}
    </Stack>
  ),
}

export const GapMedium: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('Gap MD (16px)')}
      {childBlockAlt('Gap MD (16px)')}
      {childBlockAccent('Gap MD (16px)')}
    </Stack>
  ),
}

export const GapLarge: Story = {
  args: { gap: 'lg' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('Gap LG (24px)')}
      {childBlockAlt('Gap LG (24px)')}
      {childBlockAccent('Gap LG (24px)')}
    </Stack>
  ),
}

export const GapExtraLarge: Story = {
  args: { gap: 'xl' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('Gap XL (32px)')}
      {childBlockAlt('Gap XL (32px)')}
      {childBlockAccent('Gap XL (32px)')}
    </Stack>
  ),
}

// ── Alignment stories ────────────────────────────────────────────

export const AlignCenter: Story = {
  render: () => (
    <Stack gap="md" align="center">
      <div
        style={{
          background: '#e8f5e9',
          padding: '1rem',
          borderRadius: 4,
          color: '#1b5e20',
          fontWeight: 600,
          border: '1px solid #c8e6c9',
          width: '60%',
          textAlign: 'center',
        }}
      >
        Centered (60% width)
      </div>
      <div
        style={{
          background: '#e3f2fd',
          padding: '1rem',
          borderRadius: 4,
          color: '#0d47a1',
          fontWeight: 600,
          border: '1px solid #bbdefb',
          width: '40%',
          textAlign: 'center',
        }}
      >
        Centered (40% width)
      </div>
    </Stack>
  ),
}

export const AlignStart: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <div
        style={{
          background: '#e8f5e9',
          padding: '1rem',
          borderRadius: 4,
          color: '#1b5e20',
          fontWeight: 600,
          border: '1px solid #c8e6c9',
          width: '60%',
        }}
      >
        Start-aligned (60% width)
      </div>
      <div
        style={{
          background: '#e3f2fd',
          padding: '1rem',
          borderRadius: 4,
          color: '#0d47a1',
          fontWeight: 600,
          border: '1px solid #bbdefb',
          width: '80%',
        }}
      >
        Start-aligned (80% width)
      </div>
    </Stack>
  ),
}

// ── Nested layout ────────────────────────────────────────────────

export const NestedLayout: Story = {
  render: () => (
    <Stack gap="lg">
      {childBlock('Header Section')}
      <Stack gap="sm">
        {childBlockAlt('Sub-item 1')}
        {childBlockAlt('Sub-item 2')}
        {childBlockAlt('Sub-item 3')}
      </Stack>
      {childBlockAccent('Footer Section')}
    </Stack>
  ),
}

// ── With sizing ──────────────────────────────────────────────────

export const FullWidthCentered: Story = {
  render: () => (
    <Stack gap="md" width="full" maxWidth="desktop" marginX="auto">
      {childBlock('Full-width, desktop-constrained, centered')}
      {childBlockAlt('Item 2')}
      {childBlockAccent('Item 3')}
    </Stack>
  ),
}
