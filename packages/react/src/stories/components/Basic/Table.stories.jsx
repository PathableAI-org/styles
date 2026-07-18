// packages/react/src/stories/components/Basic/Table.stories.jsx
import React from 'react'
import { Table } from '../../../components/Table/Table'

export default {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        // Removed the problematic description string
      },
    },
  },
  argTypes: {
    presentation: {
      control: 'select',
      options: ['default', 'borderless', 'compact', 'striped'],
      description: 'The visual presentation of the table.',
      defaultValue: 'default',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names to apply to the table.',
    },
    children: {
      control: 'none', // Children are content, not a direct prop to control here
      description:
        'The content of the table, typically including `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements.',
    },
    // other HTML attributes can be controlled via ...rest, but not explicitly listed here
  },
}

// --- Story: Default Table ---
export const Default = {
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

// --- Story: Borderless Table ---
export const Borderless = {
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

// --- Story: Compact Table ---
export const Compact = {
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

// --- Story: Striped Table ---
export const Striped = {
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

// --- Story: Table with Custom Attributes ---
export const CustomAttributes = {
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

// --- Story: Table with Additional ClassNames ---
export const AdditionalClassNames = {
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

// --- Story: Table with Empty Body ---
export const EmptyBody = {
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

// --- Story: Table with Rich Cell Content ---
export const RichCellContent = {
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
              This is a cell with <strong>rich content</strong> including
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

// --- Story: Invalid Presentation (fallback to default) ---
export const InvalidPresentation = {
  name: 'Invalid Presentation (fallback)',
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
