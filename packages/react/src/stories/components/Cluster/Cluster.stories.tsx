import { Cluster } from '../../../components/Cluster/Cluster'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Cluster',
  component: Cluster,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A layout primitive that arranges children in a wrapping horizontal row with token-based spacing. Cluster creates a flex container that wraps (\`flex-wrap: wrap\`), allowing items to flow onto new lines when the container is too narrow.

**When to use**: For displaying groups of tags, chips, badges, or other inline items that should wrap naturally when space is constrained. Cluster provides even spacing between both items and rows without manual management.

**When not to use**: For non-wrapping horizontal layouts, use Inline. For vertical layouts, use Stack.

**Underlying element**: \`<div>\` by default; override with \`as\` for semantic landmarks (\`<ul>\`, \`<section>\`).

**Known constraints**: Cluster does not accept a \`justify\` prop — wrapping layouts interact non-trivially with \`justify-content\`. Gap values are named (\`sm\`, \`md\`, \`lg\`, \`xl\`) matching the SCSS contract. The default align value is \`center\` via SCSS.`,
      },
    },
  },
  argTypes: {
    gap: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      description:
        'Spacing between items and rows. `sm` = 4px, `md` = 8px (default CSS), `lg` = 16px, `xl` = 24px. Note: Cluster uses a tighter gap scale than Inline/Stack.',
    },
    align: {
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      control: { type: 'select' },
      description:
        'Cross-axis alignment of items within each wrapped row. Defaults to `center` when omitted (via SCSS).',
    },
    as: {
      control: { type: 'text' },
      description: 'Semantic HTML element to render (e.g., "ul", "section").',
    },
  },
} satisfies Meta<typeof Cluster>

export default meta
type Story = StoryObj<typeof meta>

const tag = (label: string, bg: string, color: string, border: string) => (
  <span
    style={{
      background: bg,
      padding: '0.25rem 0.75rem',
      borderRadius: 999,
      color,
      fontWeight: 600,
      fontSize: '0.875rem',
      border: `1px solid ${border}`,
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </span>
)

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
    <Cluster>
      {childBlock('Item A')}
      {childBlockAlt('Item B')}
      {childBlockAccent('Item C')}
    </Cluster>
  ),
}

// ── Gap stories ──────────────────────────────────────────────────

export const GapSmall: Story = {
  args: { gap: 'sm' },
  render: (args) => (
    <Cluster gap={args.gap}>
      {childBlock('Gap SM (4px)')}
      {childBlockAlt('Gap SM (4px)')}
      {childBlockAccent('Gap SM (4px)')}
    </Cluster>
  ),
}

export const GapMedium: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <Cluster gap={args.gap}>
      {childBlock('Gap MD (8px)')}
      {childBlockAlt('Gap MD (8px)')}
      {childBlockAccent('Gap MD (8px)')}
    </Cluster>
  ),
}

export const GapLarge: Story = {
  args: { gap: 'lg' },
  render: (args) => (
    <Cluster gap={args.gap}>
      {childBlock('Gap LG (16px)')}
      {childBlockAlt('Gap LG (16px)')}
      {childBlockAccent('Gap LG (16px)')}
    </Cluster>
  ),
}

export const GapExtraLarge: Story = {
  args: { gap: 'xl' },
  render: (args) => (
    <Cluster gap={args.gap}>
      {childBlock('Gap XL (24px)')}
      {childBlockAlt('Gap XL (24px)')}
      {childBlockAccent('Gap XL (24px)')}
    </Cluster>
  ),
}

// ── Alignment stories ────────────────────────────────────────────

export const AlignStart: Story = {
  render: () => (
    <Cluster gap="md" align="start">
      {tag('JavaScript', '#fff3e0', '#e65100', '#ffe0b2')}
      {tag('TypeScript', '#e8f5e9', '#1b5e20', '#c8e6c9')}
      <div
        style={{
          background: '#e3f2fd',
          padding: '1.5rem 1rem',
          borderRadius: 4,
          color: '#0d47a1',
          fontWeight: 600,
          border: '1px solid #bbdefb',
        }}
      >
        Taller item (start-aligned)
      </div>
      {tag('React', '#f3e5f5', '#4a148c', '#e1bee7')}
    </Cluster>
  ),
}

export const AlignCenter: Story = {
  render: () => (
    <Cluster gap="md" align="center">
      {tag('CSS', '#fff3e0', '#e65100', '#ffe0b2')}
      {tag('SCSS', '#e8f5e9', '#1b5e20', '#c8e6c9')}
      <div
        style={{
          background: '#e3f2fd',
          padding: '1.5rem 1rem',
          borderRadius: 4,
          color: '#0d47a1',
          fontWeight: 600,
          border: '1px solid #bbdefb',
        }}
      >
        Taller item (center-aligned)
      </div>
      {tag('Design System', '#f3e5f5', '#4a148c', '#e1bee7')}
    </Cluster>
  ),
}

// ── Responsive wrapping ─────────────────────────────────────────

export const ResponsiveWrapping: Story = {
  render: () => (
    <div
      style={{
        maxWidth: 400,
        border: '2px dashed #ccc',
        padding: '1rem',
        borderRadius: 8,
      }}
    >
      <p style={{ marginTop: 0, color: '#666', fontSize: '0.875rem' }}>
        Constrained to 400px — resize viewport to see wrapping
      </p>
      <Cluster gap="sm">
        {tag('Accessibility', '#e8f5e9', '#1b5e20', '#c8e6c9')}
        {tag('WCAG', '#e3f2fd', '#0d47a1', '#bbdefb')}
        {tag('ARIA', '#f3e5f5', '#4a148c', '#e1bee7')}
        {tag('Keyboard', '#fff3e0', '#e65100', '#ffe0b2')}
        {tag('Focus', '#e0f7fa', '#006064', '#b2ebf2')}
        {tag('Screen Reader', '#fce4ec', '#880e4f', '#f8bbd0')}
        {tag('Contrast', '#f1f8e9', '#33691e', '#dcedc8')}
        {tag('Semantic HTML', '#ede7f6', '#311b92', '#d1c4e9')}
      </Cluster>
    </div>
  ),
}

// ── Nested layout ────────────────────────────────────────────────

export const NestedLayout: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: 8,
        border: '2px dashed #ccc',
      }}
    >
      <div style={{ fontWeight: 700, color: '#00365c' }}>Container</div>
      <Cluster gap="sm">
        {tag('Tag 1', '#e8f5e9', '#1b5e20', '#c8e6c9')}
        {tag('Tag 2', '#e3f2fd', '#0d47a1', '#bbdefb')}
        {tag('Tag 3', '#f3e5f5', '#4a148c', '#e1bee7')}
        {tag('Tag 4', '#fff3e0', '#e65100', '#ffe0b2')}
        {tag('Tag 5', '#e0f7fa', '#006064', '#b2ebf2')}
      </Cluster>
    </div>
  ),
}
