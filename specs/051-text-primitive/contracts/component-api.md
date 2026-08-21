# Component Interface Contracts: Text

## Component API Contract

### Public Export

```typescript
// packages/react/src/index.ts
export { Text } from './components/Text/Text.js'
export type { TextProps, TextVariant, TextTone } from './components/Text/Text.js'
```

### Package Entry

The `Text` component is accessible from the `@pathableai/react` package root:

```typescript
import { Text } from '@pathableai/react'
import type { TextProps, TextVariant, TextTone } from '@pathableai/react'
```

### Component Signature

```typescript
export const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<Element>>
```

`Text` is polymorphic over the rendered element via a generic default `'p'`. Consumers may write `<Text as="span">…</Text>`; native props are then typed against `HTMLElement` (span).

### Props

```typescript
export type TextVariant = 'body' | 'small' | 'caption'

export type TextTone = 'default' | 'muted' | 'danger' | 'success'

export type TextOwnProps = {
  variant?: TextVariant
  tone?: TextTone
  children?: React.ReactNode
  className?: string
}

export type TextProps<C extends keyof React.JSX.IntrinsicElements = 'p'> =
  TextOwnProps & Omit<React.ComponentPropsWithRef<C>, keyof TextOwnProps | 'color'>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | text-content element key | `'p'` | Element to render; native props restricted to the selected element |
| `variant` | `'body' \| 'small' \| 'caption'` | `'body'` | Semantic typography role |
| `tone` | `'default' \| 'muted' \| 'danger' \| 'success'` | (none) | Semantic text color meaning |
| `children` | `ReactNode` | — | Text content |
| `className` | `string` | `''` | Consumer class appended last |
| `ref` | `ForwardedRef<Element>` | — | DOM reference to root |
| native props | per `C` | — | e.g. `id`, `aria-*`, `data-*`, `style`, event handlers |

## HTML Output Contract

### Default Render (No Props)

```tsx
<Text>Example</Text>
```

```html
<p class="pathable-text">Example</p>
```

### With Variant

```tsx
<Text variant="small">Example</Text>
```

```html
<p class="pathable-text pathable-text--small">Example</p>
```

### With Variant and Tone

```tsx
<Text variant="small" tone="muted">Example</Text>
```

```html
<p class="pathable-text pathable-text--small pathable-text--tone-muted">Example</p>
```

### With Variant, Tone, and Native Props

```tsx
<Text variant="caption" tone="danger" id="error-note" data-testid="err">
  This field is required.
</Text>
```

```html
<p class="pathable-text pathable-text--caption pathable-text--tone-danger" id="error-note" data-testid="err">
  This field is required.
</p>
```

### With as="span"

```tsx
<Text as="span" tone="muted">Inline note</Text>
```

```html
<span class="pathable-text pathable-text--tone-muted">Inline note</span>
```

### With as="label"

```tsx
<Text as="label" variant="small" htmlFor="email">Email address</Text>
```

```html
<label class="pathable-text pathable-text--small" for="email">Email address</label>
```

### With as="figcaption"

```tsx
<Text as="figcaption" variant="caption" tone="muted">Figure 1. Usage over time</Text>
```

```html
<figcaption class="pathable-text pathable-text--caption pathable-text--tone-muted">Figure 1. Usage over time</figcaption>
```

### With Consumer className

```tsx
<Text variant="body" className="intro-copy">Hello</Text>
```

```html
<p class="pathable-text pathable-text--body intro-copy">Hello</p>
```

### With Explicit Default Tone

```tsx
<Text tone="default">Example</Text>
```

```html
<p class="pathable-text pathable-text--tone-default">Example</p>
```

Explicit `tone="default"` renders the explicit class; omitting `tone` renders the base color. Both have identical visual outcome.

### With Ref Forwarding

```tsx
const ref = useRef<HTMLParagraphElement>(null)
<Text ref={ref}>Example</Text>
// ref.current instanceof HTMLParagraphElement === true
// ref.current.className includes "pathable-text"
```

### With as and Ref

```tsx
const ref = useRef<HTMLLabelElement>(null)
<Text as="label" ref={ref} htmlFor="x">Label</Text>
// ref.current instanceof HTMLLabelElement === true
// ref.current.tagName === "LABEL"
```

## Class Merge Order Contract

The `class` attribute on the root element MUST contain classes in this relative order:

1. `pathable-text` (always present)
2. `pathable-text--{variant}` (if `variant` prop is set)
3. `pathable-text--tone-{tone}` (if `tone` prop is set)
4. Consumer `className` value (if provided)

No other classes MUST appear. No wrapper elements MUST exist — the rendered element is the single root, and children (text or inline nodes) are its direct content.

## SSR Contract

For all supported prop combinations, the DOM output (element tag, class attribute string, native attributes, child structure) MUST be identical when rendered server-side and client-side. No browser-only resolution or hydration may modify the class string or element structure. Class resolution is pure (no `window`/`document`/`navigator`/`localStorage`).

## Type-Safety Contract (FR-012)

- `variant` and `tone` accept only the validated union values; invalid values are compile-time errors.
- Native props are restricted to the selected `as` element at the type level. `htmlFor` is accepted for `as="label"` and rejected for `as="p"`.
- `as` is constrained to `keyof React.JSX.IntrinsicElements`; consumers passing a heading element (`h1`–`h6`) get a type that is permitted at the type level but semantically out of scope (documented misuse; `Heading` is the sanctioned path).

## Scope Boundaries

### Included in Text

- Semantic typography roles: `body`, `small`, `caption` via `.pathable-text--{variant}`
- Semantic tones: `default`, `muted`, `danger`, `success` via `.pathable-text--tone-{tone}`
- Default `p` element with `as` for `span`, `label`, `figcaption`, and other text elements
- Ref forwarding, consumer `className` composition
- Native text-element props (typed per selected element)
- Deterministic server/client rendering

### Excluded from Text

- Raw typography props: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` (escape hatch: `className`/`style`)
- Layout props: `padding`, `margin*`, `width`, `maxWidth`, `display`, `textAlign`
- `color` raw HTML attribute
- Heading levels / document-outline semantics (the `Heading` primitive)
- `asChild` composition model