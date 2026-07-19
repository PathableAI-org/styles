import { Table } from '../../../components/Table/Table'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from 'storybook/test'

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A semantic table component for displaying tabular data. Wraps standard HTML \`<table>\` with \`.pathable-table\` and optional presentation modifier classes.

**When to use**: For displaying structured tabular data with rows and columns. Use a \`<caption>\` element or \`aria-label\` to give the table an accessible name. Use \`scope="col"\` or \`scope="row"\` on \`<th>\` elements to identify header cells.

**When not to use**: Do not use Table for layout purposes. Do not use Table when the data is better represented as a list, card grid, or chart.

**Underlying element**: \`<table>\`.

**Accessibility**: Consumers must provide an accessible name via \`<caption>\` or \`aria-label\`. Each \`<th>\` should use \`scope="col"\` or \`scope="row"\` to define header relationships.

**Known constraints**: The component provides styling only. Sorting, filtering, pagination, and row selection are not built in — consumers manage those behaviors externally. Unsupported \`presentation\` values fall back to \`default\`.`,
      },
    },
  },
  argTypes: {
    presentation: {
      options: ['default', 'borderless', 'compact', 'striped'],
      control: { type: 'select' },
      description:
        'The table presentation. \`default\`: standard bordered table. \`borderless\`: no borders between cells. \`compact\`: reduced cell padding. \`striped\`: alternating row backgrounds for readability.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names to apply to the table element.',
    },
    children: {
      control: 'none',
      description:
        'Table content. Must include standard HTML table elements: \`<caption>\`, \`<thead>\`, \`<tbody>\`, \`<tr>\`, \`<th>\`, \`<td>\`.',
    },
  },
  args: {
    presentation: 'default',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Playground — renders a default table for visual inspection
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    children: (
      <>
        <caption>Team members by role and department</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Doe</td>
            <td>Designer</td>
            <td>Product</td>
          </tr>
          <tr>
            <td>John Smith</td>
            <td>Developer</td>
            <td>Engineering</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

// ---------------------------------------------------------------------------
// Fixed state stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    presentation: 'default',
    children: (
      <>
        <caption>Team members by role and department</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Doe</td>
            <td>Designer</td>
            <td>Product</td>
          </tr>
          <tr>
            <td>John Smith</td>
            <td>Developer</td>
            <td>Engineering</td>
          </tr>
          <tr>
            <td>Alice Johnson</td>
            <td>Manager</td>
            <td>Operations</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

export const Borderless: Story = {
  args: {
    presentation: 'borderless',
    children: (
      <>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Doe</td>
            <td>Designer</td>
            <td>Product</td>
          </tr>
          <tr>
            <td>John Smith</td>
            <td>Developer</td>
            <td>Engineering</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

export const Compact: Story = {
  args: {
    presentation: 'compact',
    children: (
      <>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Doe</td>
            <td>Designer</td>
            <td>Product</td>
          </tr>
          <tr>
            <td>John Smith</td>
            <td>Developer</td>
            <td>Engineering</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

export const Striped: Story = {
  args: {
    presentation: 'striped',
    children: (
      <>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Doe</td>
            <td>Designer</td>
            <td>Product</td>
          </tr>
          <tr>
            <td>John Smith</td>
            <td>Developer</td>
            <td>Engineering</td>
          </tr>
          <tr>
            <td>Alice Johnson</td>
            <td>Manager</td>
            <td>Operations</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

export const CustomAttributes: Story = {
  args: {
    presentation: 'default',
    id: 'my-custom-table',
    'data-testid': 'custom-table-element',
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test User</td>
            <td>Tester</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

export const AdditionalClassNames: Story = {
  args: {
    presentation: 'compact',
    className: 'my-extra-table-styling',
    children: (
      <>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Widget</td>
            <td>100</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

export const EmptyBody: Story = {
  args: {
    presentation: 'default',
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Header 1</th>
            <th scope="col">Header 2</th>
          </tr>
        </thead>
        <tbody>{/* Empty state */}</tbody>
      </>
    ),
  },
}

// ---------------------------------------------------------------------------
// Rich cell content
// ---------------------------------------------------------------------------

export const RichCellContent: Story = {
  args: {
    presentation: 'default',
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              This is a cell with <strong>rich content</strong> including{' '}
              <em>multiple elements</em>.
            </td>
            <td>
              <p>Another paragraph here.</p>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </>
    ),
  },
}

export const UnsupportedPresentationFallback: Story = {
  name: 'Unsupported Presentation (fallback)',
  args: {
    presentation: 'unsupported-value',
    children: (
      <>
        <caption>Fallback table — unsupported presentation value</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jane Doe</td>
            <td>Designer</td>
          </tr>
        </tbody>
      </>
    ),
  },
}

// ---------------------------------------------------------------------------
// Long content
// ---------------------------------------------------------------------------

export const LongContent: Story = {
  args: {
    presentation: 'default',
    children: (
      <>
        <caption>
          Participant progress notes across all coaching sessions
        </caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Session</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2026-07-01</td>
            <td>Intake Assessment</td>
            <td>
              Initial meeting to discuss employment goals, review background,
              and outline the coaching program structure. Participant expressed
              interest in customer service roles.
            </td>
          </tr>
          <tr>
            <td>2026-07-08</td>
            <td>Resume Workshop</td>
            <td>
              Reviewed and updated resume format, added recent volunteer
              experience, and identified key skills to highlight for prospective
              employers in the service sector.
            </td>
          </tr>
        </tbody>
      </>
    ),
  },
}

// ---------------------------------------------------------------------------
// Narrow viewport
// ---------------------------------------------------------------------------

export const Narrow: Story = {
  args: {
    presentation: 'compact',
    children: (
      <>
        <caption>Upcoming sessions</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Topic</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jul 15</td>
            <td>Interview Prep</td>
          </tr>
          <tr>
            <td>Jul 22</td>
            <td>Job Search</td>
          </tr>
        </tbody>
      </>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// ---------------------------------------------------------------------------
// Accessibility check
// ---------------------------------------------------------------------------

/** Verifies the table renders with correct table semantics including
 *  caption, column headers, and row data. */
export const AccessibilityCheck: Story = {
  args: {
    children: (
      <>
        <caption>Session attendance</caption>
        <thead>
          <tr>
            <th scope="col">Participant</th>
            <th scope="col">Attended</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>J. Doe</td>
            <td>12 of 12</td>
            <td>Complete</td>
          </tr>
        </tbody>
      </>
    ),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('table has caption for accessible name', async () => {
      const table = canvas.getByRole('table')
      await expect(table).toBeVisible()
      await expect(table).toHaveAccessibleName('Session attendance')
    })

    await step('column headers are present', async () => {
      const headers = canvas.getAllByRole('columnheader')
      await expect(headers).toHaveLength(3)
    })

    await step('table has expected row count', async () => {
      const rows = canvas.getAllByRole('row')
      // header row + 1 data row
      await expect(rows).toHaveLength(2)
    })
  },
}
