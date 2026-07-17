# @pathable/react

React components for the PathAble design system, wrapping `@pathable/styles` with idiomatic React components.

## Installation

```bash
# In a pnpm workspace
pnpm add @pathable/react
```

No separate installation of `@pathable/styles` is required — styles are included automatically as a dependency.

## Usage

```tsx
import { Button, ButtonGroup, Card, List } from '@pathable/react'

function App() {
  return (
    <>
      <Card
        title="Upcoming coaching session"
        footer={<a href="/sessions/42">Open session</a>}
        className="dashboard-card"
      >
        <p>Review the participant notes and prepare the next action plan.</p>
      </Card>

      <Card
        presentation="media"
        title="Resource spotlight"
        media={<img src="/resource.jpg" alt="Resource preview" />}
      >
        <p>Share a helpful resource with the participant.</p>
      </Card>

      <Card
        presentation="workflow"
        title="Employment progress report"
        metadata="Generated today"
        status="Completed"
        actions={<Button variant="secondary">Download report</Button>}
        tabIndex={0}
      >
        <p>All employment goal milestones have been met this period.</p>
      </Card>

      <Button>Click Me</Button>
      <Button variant="primary" size="big">
        Primary
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive" disabled>
        Disabled
      </Button>

      <ButtonGroup>
        <Button variant="save">Save</Button>
        <Button variant="continue">Continue</Button>
      </ButtonGroup>

      <List
        items={[
          'Review participant goals',
          'Prepare coaching resources',
          'Send follow-up notes',
        ]}
      />

      <List
        presentation="ordered"
        items={[
          'Complete intake notes',
          'Schedule follow-up session',
          'Send resource summary',
        ]}
      />

      <List
        presentation="unstyled"
        className="dashboard-list"
        aria-label="Session actions"
        items={[
          {
            content: <a href="/sessions/42">Open session notes</a>,
            key: 'session-notes',
          },
          {
            content: <strong>Confirm next appointment</strong>,
            key: 'next-appointment',
          },
        ]}
      />
    </>
  )
}
```

The rendered components include the corresponding `pathable-*` CSS classes with all PathAble styling. Consumers import components from `@pathable/react`; they do not need to import `@pathable/styles` separately in application code.

### List Props

| Prop         | Type                                       | Default       | Description                         |
| ------------ | ------------------------------------------ | ------------- | ----------------------------------- |
| presentation | `'unordered' \| 'ordered' \| 'unstyled'`   | `'unordered'` | Existing Pathable list presentation |
| items        | `Array<React.ReactNode \| ListItemObject>` | —             | Ordered list item content           |
| children     | `React.ReactNode`                          | —             | Consumer-composed list content      |
| className    | `string`                                   | —             | Additional root element class names |

`ListItemObject` supports `content`, optional `key`, optional `className`, and optional `attributes` for item-level `aria-*`, `data-*`, and standard list item attributes.

### Card Props

| Prop         | Type                                                          | Default  | Description                         |
| ------------ | ------------------------------------------------------------- | -------- | ----------------------------------- |
| children     | `React.ReactNode`                                             | —        | Main card body content              |
| title        | `React.ReactNode`                                             | —        | Card heading content                |
| footer       | `React.ReactNode`                                             | —        | Footer region content               |
| media        | `React.ReactNode`                                             | —        | Media region content                |
| presentation | `'base' \| 'media' \| 'flag' \| 'header-first' \| 'workflow'` | `'base'` | Existing Pathable card presentation |
| metadata     | `React.ReactNode`                                             | —        | Workflow metadata content           |
| status       | `React.ReactNode`                                             | —        | Workflow status content             |
| actions      | `React.ReactNode`                                             | —        | Workflow action content             |
| className    | `string`                                                      | —        | Additional root element class names |

### Button Props

| Prop      | Type                                                                                                                                                                                  | Default     | Description                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| variant   | `'primary' \| 'secondary' \| 'accent-cool' \| 'accent-warm' \| 'outline' \| 'inverse' \| 'base' \| 'unstyled' \| 'save' \| 'continue' \| 'review' \| 'destructive' \| 'low-emphasis'` | `'primary'` | Visual variant of the button   |
| size      | `'default' \| 'big'`                                                                                                                                                                  | `'default'` | Size variant of the button     |
| children  | `React.ReactNode`                                                                                                                                                                     | —           | Button content                 |
| disabled  | `boolean`                                                                                                                                                                             | —           | Whether the button is disabled |
| className | `string`                                                                                                                                                                              | —           | Additional CSS class names     |

### ButtonGroup Props

| Prop      | Type              | Description                |
| --------- | ----------------- | -------------------------- |
| children  | `React.ReactNode` | Button group content       |
| className | `string`          | Additional CSS class names |

## Development

```bash
# Build the package
pnpm build

# Start the standalone React Storybook (port 6007)
pnpm --filter @pathable/storybook-react storybook

# Start the main Storybook (port 6006) with React composition
pnpm --filter @pathable/storybook storybook
```

## Peer Dependencies

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

## License

Proprietary — PathAble
