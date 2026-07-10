# @pathable/react Public API Contract

## Exported Symbols

### `Button`

```tsx
function Button(props: ButtonProps): JSX.Element
```

Renders a native `<button>` HTML element with the `pathable-button` CSS class applied. Used as a proof-of-concept to validate the React package's build and dependency pipeline.

#### Props

```tsx
interface ButtonProps {
  /** Text content rendered inside the <button> element */
  children: ReactNode
}
```

#### Behavior

- Renders a `<button>` element
- Applies the CSS class `pathable-button`
- Renders `children` text inside the button
- No other props are accepted (no `variant`, `onClick`, `disabled`, `type`, `className`, or `style`)

#### Example

```tsx
import { Button } from '@pathable/react'

function App() {
  return <Button>Click Me</Button>
}
```

## Exports Map (package.json)

```json
{
  "exports": {
    ".": "./dist/index.js"
  }
}
```

## Dependencies

- `@pathable/styles`: Runtime dependency (provides compiled CSS)
- `react`: Peer dependency
- `react-dom`: Peer dependency
