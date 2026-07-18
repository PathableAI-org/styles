import { Table } from '../../../components/Table/Table'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: React component\n\n**Consumers must**: Import from `@pathable/react`. No additional CSS import required.',
      },
    },
  },
  argTypes: {
    presentation: {
      control: 'select',
      options: ['default', 'borderless', 'compact', 'striped'],
      description: 'The visual presentation of the table.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to apply to the table.',
    },
    children: {
      control: 'none',
      description:
        'The content of the table, typically including `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements.',
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

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
            <th>Name</th>
            <th>Role</th>
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
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </thead>
        <tbody>{/* Empty state */}</tbody>
      </>
    ),
  },
}

export const RichCellContent: Story = {
  args: {
    presentation: 'default',
    children: (
      <>
        <thead>
          <tr>
            <th>Description</th>
            <th>Details</th>
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
