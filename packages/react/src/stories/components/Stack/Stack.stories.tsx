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

const childBlock = (color: string, label: string) => (
  <div
    style={{
      background: color,
      padding: '1rem 1.5rem',
      borderRadius: 4,
      color: '#fff',
      fontWeight: 600,
    }}
  >
    {label}
  </div>
)

// ── Default (no props) ───────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Stack>
      {childBlock('#1cae96', 'Stack Item A')}
      {childBlock('#00365c', 'Stack Item B')}
      {childBlock('#4899e8', 'Stack Item C')}
    </Stack>
  ),
}

// ── Gap stories ──────────────────────────────────────────────────

export const GapSmall: Story = {
  args: { gap: 'sm' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('#1cae96', 'Gap SM (8px)')}
      {childBlock('#00365c', 'Gap SM (8px)')}
      {childBlock('#4899e8', 'Gap SM (8px)')}
    </Stack>
  ),
}

export const GapMedium: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('#1cae96', 'Gap MD (16px)')}
      {childBlock('#00365c', 'Gap MD (16px)')}
      {childBlock('#4899e8', 'Gap MD (16px)')}
    </Stack>
  ),
}

export const GapLarge: Story = {
  args: { gap: 'lg' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('#1cae96', 'Gap LG (24px)')}
      {childBlock('#00365c', 'Gap LG (24px)')}
      {childBlock('#4899e8', 'Gap LG (24px)')}
    </Stack>
  ),
}

export const GapExtraLarge: Story = {
  args: { gap: 'xl' },
  render: (args) => (
    <Stack gap={args.gap}>
      {childBlock('#1cae96', 'Gap XL (32px)')}
      {childBlock('#00365c', 'Gap XL (32px)')}
      {childBlock('#4899e8', 'Gap XL (32px)')}
    </Stack>
  ),
}

// ── Alignment stories ────────────────────────────────────────────

export const AlignCenter: Story = {
  args: { gap: 'md', align: 'center' },
  render: (args) => (
    <Stack gap={args.gap} align={args.align}>
      <div
        style={{
          background: '#1cae96',
          padding: '1rem',
          borderRadius: 4,
          color: '#fff',
          width: '60%',
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        Centered (60% width)
      </div>
      <div
        style={{
          background: '#00365c',
          padding: '1rem',
          borderRadius: 4,
          color: '#fff',
          width: '40%',
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        Centered (40% width)
      </div>
    </Stack>
  ),
}

export const AlignStart: Story = {
  args: { gap: 'md', align: 'start' },
  render: (args) => (
    <Stack gap={args.gap} align={args.align}>
      <div
        style={{
          background: '#1cae96',
          padding: '1rem',
          borderRadius: 4,
          color: '#fff',
          width: '60%',
          fontWeight: 600,
        }}
      >
        Start-aligned (60% width)
      </div>
      <div
        style={{
          background: '#00365c',
          padding: '1rem',
          borderRadius: 4,
          color: '#fff',
          width: '80%',
          fontWeight: 600,
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
      {childBlock('#1cae96', 'Header Section')}
      <Stack gap="sm">
        {childBlock('#00365c', 'Sub-item 1')}
        {childBlock('#00365c', 'Sub-item 2')}
        {childBlock('#00365c', 'Sub-item 3')}
      </Stack>
      {childBlock('#4899e8', 'Footer Section')}
    </Stack>
  ),
}

// ── With sizing ──────────────────────────────────────────────────

export const FullWidthCentered: Story = {
  args: { gap: 'md', width: 'full', maxWidth: 'desktop', marginX: 'auto' },
  render: (args) => (
    <Stack
      gap={args.gap}
      width={args.width!}
      maxWidth={args.maxWidth!}
      marginX={args.marginX! as 'auto'}
    >
      {childBlock('#1cae96', 'Full-width, desktop-constrained, centered')}
      {childBlock('#00365c', 'Item 2')}
      {childBlock('#4899e8', 'Item 3')}
    </Stack>
  ),
}
