# Component Contracts: Container Layout Primitive

**Feature**: Container Layout Primitive  
**Date**: 2026-08-20  

## Public API Contract

### Export

```typescript
// From @pathable/react
export { Container } from './components/Container/Container.js'
export type { ContainerProps, ContainerSize } from './components/Container/Container.js'
```

### Component Signature

```typescript
function Container<T extends React.ElementType = 'div'>(
  props: ContainerProps<T>,
  ref: React.ComponentRef<T>,
): React.ReactElement
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `T extends React.ElementType` | No | `'div'` | HTML element to render |
| `size` | `'standard' \| 'wide' \| 'full'` | No | `undefined` | Width constraint |
| `className` | `string` | No | `undefined` | Consumer CSS class |
| `children` | `React.ReactNode` | No | `undefined` | Child content |
| `ref` | `React.Ref<...>` | No | — | DOM element ref |
| `...rest` | `Omit<ComponentPropsWithoutRef<T>, ...>` | No | — | Native HTML attributes |

### Element Constraints

- `as` must be a valid HTML element type
- Void elements (`input`, `img`, `br`, `hr`, `area`, `base`, `col`, `embed`, `link`, `meta`, `param`, `source`, `track`, `wbr`) are prevented by TypeScript — they do not accept `children` in their `ComponentPropsWithoutRef`

### Class Contract

| Condition | Classes Applied (in order) |
|-----------|---------------------------|
| `size` omitted | `pathable-container` |
| `size="standard"` | `pathable-container pathable-container--standard` |
| `size="wide"` | `pathable-container pathable-container--wide` |
| `size="full"` | `pathable-container pathable-container--full` |
| Any size + `className="foo"` | `pathable-container pathable-container--{size} foo` |
| Any size + `as="main"` | (same classes, on `<main>` element) |

### DOM Contract

- Exactly one root DOM element
- No wrapper elements
- Children rendered as direct children
- Ref forwarded to root element
- All native HTML attributes pass through to root element
- Server and client output identical

### SCSS Dependency Contract

Component consumes classes from `packages/styles/src/pathable-component-wrappers/pathable-container.scss`:

- `.pathable-container` — base: `width: 100%`, `margin-inline: auto`, `padding-inline`, `box-sizing: border-box`, default `max-width: 1024px`
- `.pathable-container--standard` — `max-width: 1024px`
- `.pathable-container--wide` — `max-width: 1280px`
- `.pathable-container--full` — `max-width: 100%`

No SCSS changes. No CSS custom property overrides. Styles are delivered via the existing `@pathable/styles` CSS bundle imported at the `@pathable/react` package entrypoint.