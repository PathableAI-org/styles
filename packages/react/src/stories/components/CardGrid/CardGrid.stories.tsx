import { CardGrid } from '../../../components/CardGrid/CardGrid'
import { Surface } from '../../../components/Surface/Surface'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/CardGrid',
  component: CardGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A layout primitive for responsive card grids with two modes: cluster (flex-wrap) and auto-fit (CSS Grid).

**When to use**: For displaying a responsive, wrapping collection of card-like surfaces — dashboards, listing pages, search results, resource browsers. Use cluster mode when cards vary in size and should wrap naturally. Use auto-fit mode when all cards share a minimum width and should fill the row.

**When not to use**: For single-item layouts, for fixed-width grids with no wrapping, for page-level scaffolding (use \`Page\`), or for grids where rows and columns need explicit control (use \`Grid\` when available).

**Underlying element**: \`<div>\` by default; override with \`as\` for semantic containers.

**Known constraints**: Gap scales differ between modes: cluster uses the \`pathable-cluster\` scale (sm=4px, md=8px, lg=16px, xl=24px), auto-fit uses the \`pathable-card-grid\` scale (sm=16px, md=24px, lg=32px). Children are rendered directly — apply \`Surface\` or \`Card\` treatment to individual children as needed.

**Migration**: Before: \`<Cluster gap="md"><Surface>...</Surface></Cluster>\` → After: \`<CardGrid gap="md"><Surface>...</Surface></CardGrid>\``,
      },
    },
  },
  argTypes: {
    variant: {
      options: ['cluster', 'auto-fit'],
      control: { type: 'radio' },
      description:
        'Layout mode. "cluster" uses flex-wrap (Cluster composition). "auto-fit" uses CSS Grid auto-fill.',
    },
    gap: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description:
        'Gap between cards. Scale depends on variant: cluster (4/8/16/24px), auto-fit (16/24/32px).',
    },
    as: {
      control: { type: 'text' },
      description: 'The HTML element to render. Defaults to `div`.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the component classes.',
    },
  },
} satisfies Meta<typeof CardGrid>

export default meta
type Story = StoryObj<typeof meta>

const cardContent = (label: string, height?: string) => (
  <div
    style={{
      padding: '1rem',
      minWidth: '120px',
      height: height ?? '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {label}
  </div>
)

// ── Playground (cluster mode default) ──

export const Playground: Story = {
  render: () => <CardGrid>playground</CardGrid>,
}

// ── Cluster mode stories ──

export const ClusterMode: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <CardGrid {...args}>
      <Surface>{cardContent('Card 1')}</Surface>
      <Surface>{cardContent('Card 2')}</Surface>
      <Surface>{cardContent('Card 3')}</Surface>
    </CardGrid>
  ),
}

export const ResponsiveWrapping: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <div
      style={{ maxWidth: '400px', border: '1px dashed #ccc', padding: '1rem' }}
    >
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#666' }}>
        Resize viewport to see wrapping
      </p>
      <CardGrid {...args}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Surface key={i}>{cardContent(`Card ${i}`)}</Surface>
        ))}
      </CardGrid>
    </div>
  ),
}

// ── Auto-fit mode stories ──

export const AutoFitMode: Story = {
  args: { variant: 'auto-fit', gap: 'md' },
  render: (args) => (
    <CardGrid {...args}>
      {[1, 2, 3, 4].map((i) => (
        <Surface key={i}>{cardContent(`Card ${i}`)}</Surface>
      ))}
    </CardGrid>
  ),
}

export const AutoFitSmallGap: Story = {
  args: { variant: 'auto-fit', gap: 'sm' },
  render: (args) => (
    <CardGrid {...args}>
      {[1, 2, 3, 4].map((i) => (
        <Surface key={i}>{cardContent(`Card ${i}`)}</Surface>
      ))}
    </CardGrid>
  ),
}

// ── Narrow viewport ──

export const NarrowViewport: Story = {
  args: { gap: 'md' },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: (args) => (
    <CardGrid {...args}>
      {[1, 2, 3].map((i) => (
        <Surface key={i}>{cardContent(`Card ${i}`)}</Surface>
      ))}
    </CardGrid>
  ),
}

// ── Composition story ──

export const DashboardCardGrid: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <CardGrid {...args}>
      <Surface>
        <div style={{ padding: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
            Total Users
          </strong>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>2,847</span>
        </div>
      </Surface>
      <Surface>
        <div style={{ padding: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
            Active Sessions
          </strong>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>342</span>
        </div>
      </Surface>
      <Surface>
        <div style={{ padding: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
            Revenue
          </strong>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>$12.4k</span>
        </div>
      </Surface>
      <Surface>
        <div style={{ padding: '1rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
            Conversion
          </strong>
          <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>3.2%</span>
        </div>
      </Surface>
    </CardGrid>
  ),
}

// ── Empty state ──

export const Empty: Story = {
  render: () => (
    <CardGrid>
      <Surface>
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--pathable-color-text-muted, #666)',
          }}
        >
          No cards to display
        </div>
      </Surface>
    </CardGrid>
  ),
}
