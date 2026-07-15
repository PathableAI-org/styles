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
import { Button, ButtonGroup } from '@pathable/react'

function App() {
  return (
    <>
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
    </>
  )
}
```

The rendered `<button>` element will have the `pathable-button` CSS class applied with all PathAble styling.

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
