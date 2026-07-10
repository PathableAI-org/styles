# @pathable/react

React components for the PathAble design system, wrapping `@pathable/styles` with idiomatic React components.

## Installation

```bash
# In a pnpm workspace
pnpm add @pathable/react

# Or from npm
npm install @pathable/react
```

No separate installation of `@pathable/styles` is required — styles are included automatically as a dependency.

## Usage

```tsx
import { Button } from '@pathable/react'

function App() {
  return <Button>Click Me</Button>
}
```

The rendered `<button>` element will have the `pathable-button` CSS class applied with all PathAble styling.

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