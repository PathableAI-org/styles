# @pathable/react

React components for the PathAble design system, wrapping `@pathable/styles` with idiomatic React components.

## Installation

```bash
# In a pnpm workspace
pnpm add @pathable/react
```

No separate installation of `@pathable/styles` is required — styles are included automatically as a dependency.

## Usage

Import the `Table` component and use it like a regular HTML `<table>` element. The component accepts a `presentation` prop to apply different visual styles, and any standard HTML attributes or additional `className` props will be passed down to the native `<table>` element.

### Table Presentations

The `Table` component supports the following visual presentations:

- **`default`**: The standard table style.
- **`borderless`**: A table with no visible borders.
- **`compact`**: A table with reduced row padding for a more compact layout.
- **`striped`**: A table with alternating row background colors for improved readability.

Unsupported presentation values will automatically fall back to the `default` presentation.

```jsx
import { Table } from '@pathable/react'

function MyComponent() {
  return (
    <Table
      presentation="striped"
      className="my-custom-class"
      id="my-table-1"
      aria-label="Data table"
    >
      <thead>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data 1</td>
          <td>Data 2</td>
        </tr>
      </tbody>
    </Table>
  )
}
```

### Props

The `Table` component accepts the following props:

- `children` (`PropTypes.node.isRequired`): The content of the table, including `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` elements.
- `className` (`PropTypes.string`): Additional CSS class names to apply to the table element.
- `presentation` (`PropTypes.oneOf(['default', 'borderless', 'compact', 'striped'])`): The visual presentation of the table. Supported values are 'default', 'borderless', 'compact', and 'striped'. Unsupported values will gracefully fall back to the 'default' presentation. Defaults to 'default'.

Any other standard HTML attributes (e.g., `id`, `aria-label`, `data-testid`) can also be passed directly as props and will be applied to the underlying `<table>` element.

### Accessibility

The `Table` component supports standard accessibility attributes. Ensure proper `scope` attributes for `<th>` elements and `aria-label` or `<caption>` for overall table context are used where appropriate.

### Development

For local development and testing, stories are available in Storybook at `packages/react/src/stories/components/Basic/Table.stories.jsx`. Please note that Storybook build has known issues and may not be fully functional.

### TODO: Add more detailed examples for each presentation
