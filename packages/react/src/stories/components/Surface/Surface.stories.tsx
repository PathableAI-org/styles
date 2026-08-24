import { Surface } from '../../../components/Surface/Surface'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Surface',
  component: Surface,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A semantic visual-container primitive that coordinates foreground, background, border, and elevation into a single \`variant\` prop.

**When to use**: For any container that expresses a coordinated surface treatment — a card, panel, region, or boundary — where background, foreground, border, and depth must stay in sync. Use \`variant\` to select the semantic tone, \`elevation\` to control depth, and \`borderTone\` to signal boundary meaning.

**When not to use**: For raw color or shadow overrides (use \`className\`/\\\`style\\\` as the escape hatch), for card structure with title/media/footer (use \`Card\`), or for page-width layout constraints (use \`Container\`). \`Surface\` is a layout-agnostic treatment, not a layout primitive.

**Underlying element**: \`<div>\` by default; override with \`as\` for semantic landmarks (\`<section>\`, \`<article>\`, \`<aside>\`).

**Known constraints**: \`variant\` values are the shared \`SurfaceTone\` union (\`default\`, \`subtle\`, \`primary\`); \`borderTone\` is \`default\` | \`danger\`; \`elevation\` is limited to verified \`sm\` | \`md\` | \`lg\` | \`xl\` steps. Raw \`color\`/\`background\`/\`borderColor\` props and arbitrary \`box-shadow\` are not supported. Internal padding is not exposed (external spacing only).`,
      },
    },
  },
  argTypes: {
    variant: {
      options: ['default', 'subtle', 'primary'],
      control: { type: 'select' },
      description:
        'Semantic surface tone: coordinated foreground, background, and border.',
    },
    borderTone: {
      options: ['default', 'danger'],
      control: { type: 'select' },
      description: 'Semantic boundary meaning (border color).',
    },
    elevation: {
      options: ['sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      description: 'Verified elevation step (box-shadow).',
    },
    width: {
      options: ['auto', 'full'],
      control: { type: 'select' },
      description: 'Width constraint on the surface root.',
    },
    maxWidth: {
      options: ['mobile', 'mobile-lg', 'tablet', 'desktop'],
      control: { type: 'select' },
      description: 'Maximum width constraint on the surface root.',
    },
    marginX: {
      control: { type: 'text' },
      description: 'Horizontal external margin (e.g., "auto" for centering).',
    },
    as: {
      control: { type: 'text' },
      description: 'The HTML element to render. Defaults to `div`.',
    },
    children: {
      control: false,
      description:
        'Child content rendered as direct children of the surface with no intermediate wrappers.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the surface classes.',
    },
  },
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

const panelContent = (label: string) => (
  <div style={{ padding: '1rem 1.25rem' }}>{label}</div>
)

// ── Variant stories (one per supported variant) ──────────────────

export const Default: Story = {
  render: () => <Surface>{panelContent('Default surface')}</Surface>,
}

export const Subtle: Story = {
  render: () => (
    <Surface variant="subtle">{panelContent('Subtle surface')}</Surface>
  ),
}

export const Primary: Story = {
  render: () => (
    <Surface variant="primary">{panelContent('Primary surface')}</Surface>
  ),
}

// ── Elevation stories ────────────────────────────────────────────

export const ElevatedMedium: Story = {
  render: () => (
    <Surface variant="default" elevation="md">
      {panelContent('Default surface with medium elevation')}
    </Surface>
  ),
}

export const ElevatedLarge: Story = {
  render: () => (
    <Surface variant="subtle" elevation="lg">
      {panelContent('Subtle surface with large elevation')}
    </Surface>
  ),
}

// ── Border-tone stories ──────────────────────────────────────────

export const DangerBoundary: Story = {
  render: () => (
    <Surface variant="default" borderTone="danger">
      {panelContent('Default surface with a danger boundary')}
    </Surface>
  ),
}

// ── Sizing / spacing story ───────────────────────────────────────

export const CenteredConstrained: Story = {
  render: () => (
    <Surface variant="subtle" width="full" maxWidth="desktop" marginX="auto">
      {panelContent('Full-width, desktop-constrained, centered surface')}
    </Surface>
  ),
}
