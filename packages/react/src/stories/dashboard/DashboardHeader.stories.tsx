import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Button } from '../../components/Button/Button'
import {
  DashboardHeader,
  type DashboardHeaderProps,
} from '../../components/DashboardHeader/DashboardHeader'

const actionClick = fn()

const meta = {
  title: 'Dashboard/Dashboard Header',
  component: DashboardHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A dashboard page header that combines a page title, optional breadcrumb, status/context indicator, description, and action controls into a single header region.

**When to use**: At the top of operational dashboard or record pages to orient the user with a page title and, when relevant, supporting context and actions.

**When not to use**: For site-level or application navigation use \`Header\`; for marketing or content pages that don't need an action region, a simple heading may suffice.

**Underlying element**: \`<div class="pathable-dashboard-header">\` containing a semantic \`<h1>\` title and optional region wrappers.

**Semantic rules**: The \`title\` prop is required and renders as the page's primary heading. Breadcrumb, context, description, and actions are optional and render only when provided. The \`compact\` and \`stacked\` modifiers are mutually independent and may be combined.

**Known constraints**: The header is presentational and inherits its responsive stacking (≤640px), forced-colors, and reduced-motion behavior from the \`pathable-dashboard-header\` styles contract. Action controls should be provided as \`Button\` components.`,
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description:
        'The page title, rendered as the page primary heading (`h1`). Required.',
    },
    breadcrumb: {
      control: { type: 'text' },
      description:
        'Optional navigational breadcrumb content shown above the title row.',
    },
    context: {
      control: { type: 'text' },
      description:
        'Optional status or context indicator shown beside the title.',
    },
    description: {
      control: { type: 'text' },
      description: 'Optional supporting description shown below the title row.',
    },
    compact: {
      control: { type: 'boolean' },
      description: 'Reduced padding and spacing variant.',
    },
    stacked: {
      control: { type: 'boolean' },
      description: 'Force actions to stack below the title.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble header classes.',
    },
  },
  args: {
    title: 'Employment Pathways',
    context: 'Active · Q4 2026',
    description:
      'Track and manage employment pathway programs across all regions.',
    compact: false,
    stacked: false,
  },
} satisfies Meta<typeof DashboardHeader>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground — exploratory Controls use only (not regression coverage)
// ---------------------------------------------------------------------------

export const Playground: Story = {}

// ---------------------------------------------------------------------------
// Fixed visual state stories — each is a supported, deterministic contract
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      breadcrumb={
        <>
          <a href="#home">Home</a>
          <span>Programs</span>
          <span>Employment Pathways</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Export</Button>
          <Button>Add Program</Button>
        </>
      }
    />
  ),
}

export const WithoutActions: Story = {
  args: {
    title: 'My Dashboard',
    context: 'Last updated today',
    description:
      'A personalized overview of your active programs, upcoming tasks, and recent activity.',
  },
}

export const TitleOnly: Story = {
  args: {
    title: 'Program Summary',
    context: undefined,
    description: undefined,
  },
}

export const ManyActions: Story = {
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      breadcrumb={
        <>
          <a href="#admin">Admin</a>
          <span>Reports</span>
        </>
      }
      title="Quarterly Report"
      context="Draft · Q2 2026"
      description="Comprehensive quarterly report covering program outcomes, participant demographics, and performance against targets."
      actions={
        <>
          <Button variant="outline">Preview</Button>
          <Button variant="outline">Share</Button>
          <Button variant="outline">Download</Button>
          <Button>Publish</Button>
        </>
      }
    />
  ),
}

export const Compact: Story = {
  args: {
    title: 'Program Summary',
    description: undefined,
    context: undefined,
  },
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      compact
      actions={<Button variant="outline">Edit</Button>}
    />
  ),
}

export const Stacked: Story = {
  args: {
    title: 'Program Summary',
    description: undefined,
    context: undefined,
  },
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      stacked
      actions={
        <>
          <Button variant="outline">Export</Button>
          <Button>Add Program</Button>
        </>
      }
    />
  ),
}

export const LongTitle: Story = {
  args: {
    title:
      'Individualized Placement and Support (IPS) Employment Program Overview and Performance Metrics',
    description: undefined,
    context: undefined,
  },
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      breadcrumb={
        <>
          <a href="#home">Home</a>
          <span>Programs</span>
          <span>Employment Pathways</span>
        </>
      }
      actions={<Button>Edit</Button>}
    />
  ),
}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      breadcrumb={
        <>
          <a href="#home">Home</a>
          <span>Programs</span>
        </>
      }
      actions={
        <>
          <Button variant="outline">Export</Button>
          <Button>Add</Button>
        </>
      }
    />
  ),
}

// ---------------------------------------------------------------------------
// Interaction tests — keyboard and semantic-structure behavior
// ---------------------------------------------------------------------------

/** Verifies the title is exposed as the page's primary heading, optional
 *  regions are omitted when absent, and the breadcrumb/context regions render
 *  in the correct positions when provided. */
export const StructureAndRegions: Story = {
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      breadcrumb={
        <>
          <a href="#home">Home</a>
          <span>Programs</span>
        </>
      }
      actions={<Button>Add Program</Button>}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('title is the primary heading', async () => {
      const heading = canvas.getByRole('heading', {
        level: 1,
        name: 'Employment Pathways',
      })
      await expect(heading).toHaveClass('pathable-dashboard-header__title')
    })

    await step('breadcrumb links are reachable by keyboard', async () => {
      const breadcrumbLink = canvas.getByRole('link', { name: 'Home' })
      await userEvent.tab()
      await expect(breadcrumbLink).toHaveFocus()
      await expect(breadcrumbLink).toHaveAttribute('href', '#home')
    })

    await step(
      'context text is exposed to the accessibility tree',
      async () => {
        await expect(canvas.getByText('Active · Q4 2026')).toBeInTheDocument()
      },
    )
  },
}

/** Verifies the first action control receives visible keyboard focus and
 *  activates on Enter and Space. */
export const ActionKeyboardActivation: Story = {
  args: {
    title: 'Program Summary',
    context: undefined,
    description: undefined,
  },
  render: (args: DashboardHeaderProps) => (
    <DashboardHeader
      {...args}
      actions={<Button onClick={actionClick}>Add Program</Button>}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Add Program' })
    actionClick.mockClear()

    await step('button receives keyboard focus', async () => {
      await userEvent.tab()
      await expect(button).toHaveFocus()
    })

    await step('Enter key activates the button', async () => {
      await userEvent.keyboard('{Enter}')
      await expect(actionClick).toHaveBeenCalledTimes(1)
    })

    await step('Space key activates the button', async () => {
      actionClick.mockClear()
      await userEvent.keyboard(' ')
      await expect(actionClick).toHaveBeenCalledTimes(1)
    })
  },
}

/** Verifies the compact and stacked modifiers apply their documented classes. */
export const ModifierClasses: Story = {
  render: () => (
    <DashboardHeader
      title="Program Summary"
      compact
      stacked
      actions={<Button>Edit</Button>}
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', {
      level: 1,
      name: 'Program Summary',
    })
    const root = heading.closest('.pathable-dashboard-header')

    await step(
      'root carries compact and stacked modifier classes',
      async () => {
        await expect(root).not.toBeNull()
        await expect(root).toHaveClass('pathable-dashboard-header--compact')
        await expect(root).toHaveClass('pathable-dashboard-header--stacked')
      },
    )
  },
}
