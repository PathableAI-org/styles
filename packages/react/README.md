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
import { Button, ButtonWrapper, ButtonGroupWrapper } from '@pathable/react'

function App() {
  return (
    <>
      <Button>Click Me</Button>
      <ButtonWrapper variant="primary" size="big">
        Primary
      </ButtonWrapper>
      <ButtonWrapper variant="outline">Outline</ButtonWrapper>
      <ButtonWrapper variant="secondary" disabled>
        Disabled
      </ButtonWrapper>

      <ButtonGroupWrapper>
        <li>
          <ButtonWrapper variant="save">Save</ButtonWrapper>
        </li>
        <li>
          <ButtonWrapper variant="cancel">Cancel</ButtonWrapper>
        </li>
      </ButtonGroupWrapper>
    </>
  )
}
```

The rendered `<button>` element will have the `pathable-button` CSS class applied with all PathAble styling.

### ButtonWrapper Props

| Prop      | Type                                                                                                                                                                                  | Default     | Description                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------ |
| variant   | `'primary' \| 'secondary' \| 'accent-cool' \| 'accent-warm' \| 'outline' \| 'inverse' \| 'base' \| 'unstyled' \| 'save' \| 'continue' \| 'review' \| 'destructive' \| 'low-emphasis'` | `'primary'` | Visual variant of the button   |
| size      | `'default' \| 'big'`                                                                                                                                                                  | `'default'` | Size variant of the button     |
| children  | `React.ReactNode`                                                                                                                                                                     | —           | Button content                 |
| disabled  | `boolean`                                                                                                                                                                             | —           | Whether the button is disabled |
| className | `string`                                                                                                                                                                              | —           | Additional CSS class names     |

### ButtonGroupWrapper Props

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
