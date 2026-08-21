# Data Model: Text Primitive

**Feature**: Text Primitive
**Date**: 2026-08-21

## Overview

The `Text` component has a simple data model: typed prop values (`variant`, `tone`) map to CSS class names via lookup tables, and a polymorphic `as` prop selects the rendered text element. There are no data entities, state transitions, or persisted data. This document describes the type design, class-mapping tables, and the prop-to-class resolution flow.

## Entities

### Text (React Component)

A typographic primitive in `@pathable/react` that renders a text element with a design-system typography role and semantic tone.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `as` | `C extends keyof React.JSX.IntrinsicElements` (default `'p'`) | No | Text-content element to render. Restricted to valid text elements (at minimum `p`, `span`, `label`, `figcaption`, `em`, `strong`, `small`, `time`). Native props are typed against the selected element. |
| `variant` | `TextVariant = 'body' \| 'small' \| 'caption'` | No | Semantic typography role. Maps to `.pathable-text--{variant}`. Defaults to `body` (base class) when omitted. |
| `tone` | `TextTone = 'default' \| 'muted' \| 'danger' \| 'success'` | No | Semantic text color meaning. Maps to `.pathable-text--tone-{tone}`. No tone class (base color) when omitted. |
| `children` | `ReactNode` | No | Text content (or inline markup) to render. |
| `className` | `string` | No | Consumer CSS class(es) appended after all component classes. |
| `ref` | `ForwardedRef<Element>` | No (via forwardRef) | DOM reference to root element. |
| Native props | see `TextProps<C>` | No | Props valid for the selected element (id, aria-*, data-*, event handlers, style). |

**Invariants**:
- Renders exactly one DOM element (no wrappers).
- Default element is `<p>`.
- The rendered element is always one of the supported text-content elements; heading elements (`h1`–`h6`) are excluded (Heading is a separate primitive).
- Native props accepted are restricted to those valid for the selected element (type-level contract, FR-012).
- The class attribute order is: base → variant modifier → tone modifier → consumer `className`.
- No layout, spacing, sizing, or raw-typography props are exposed (FR-016/FR-019).

**Excluded props** (type-blocked or absent by design):
- `fontFamily`, `fontSize`, `fontWeight`, `lineHeight` — raw typography escape hatches are excluded (FR-016); `className`/`style` remain the escape hatches.
- `padding`, `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom`, `width`, `maxWidth`, `display` — layout props belong to layout primitives (FR-019).
- `heading`/heading-level props — the `Heading` primitive owns document-outline semantics (FR-020).
- `color` (raw HTML attribute) — `tone` is the semantic surface.

**Invalid input handling**:
- Invalid `variant` value at runtime: `TEXT_VARIANT_CLASS[variant]` returns `undefined` and the class is silently omitted (base class still applies). TypeScript prevents this at compile time.
- Invalid `tone` value at runtime: `TEXT_TONE_CLASS[tone]` returns `undefined` and the class is silently omitted (base color applies). TypeScript prevents this at compile time.
- Omitted `variant`: no variant modifier class; base `.pathable-text` provides the body typography defaults.
- Omitted `tone` (or explicit `tone="default"`): base color (`--pathable-color-text`) applies; `tone="default"` emits `.pathable-text--tone-default` for explicit determinism.
- Void or non-text element for `as`: allowed at runtime but produces a React warning; the public type contract constrains `as` to text-content elements.

### `.pathable-text` SCSS Contract (New)

| Property | Value |
|----------|-------|
| File | `packages/styles/src/pathable-component-wrappers/pathable-text.scss` |
| Base class | `.pathable-text` |
| Base behavior | `font-family: var(--pathable-font-body)`; `color: var(--pathable-text-color, var(--pathable-color-text))`; font-size/line-height/weight driven by per-role custom properties |
| Variant modifiers | `.pathable-text--body` (body-md 16/24), `.pathable-text--small` (body-sm 14/20), `.pathable-text--caption` (caption-md 12/16) |
| Tone modifiers | `.pathable-text--tone-default` (`--pathable-color-text`), `--tone-muted` (`--pathable-color-text-muted`), `--tone-danger` (`--pathable-color-danger`), `--tone-success` (`--pathable-color-text-success` NEW) |
| Registration | Added to `pathable-typography.scss` via `@forward 'pathable-text'` |

### Token additions (packages/styles)

| Token | File | Value intent |
|-------|------|--------------|
| `--pathable-font-line-height-body: 1.5` (existing) | `_typography.scss` | reused for `body` |
| `--pathable-font-line-height-body-sm` (≈1.43) | `_typography.scss` (additive) | for `small` |
| `--pathable-font-line-height-caption-md` (≈1.33) | `_typography.scss` (additive) | for `caption` |
| `--pathable-color-text-success` | `_semantic.scss` (additive) | deep jade (AA-safe on surface) |

These are additive; no existing token is renamed or removed.

## Types

### Text Variant

```typescript
export type TextVariant = 'body' | 'small' | 'caption'
```

String literal union. Each value maps to a BEM modifier class suffix.

### Variant Class Map

```typescript
const TEXT_VARIANT_CLASS: Record<TextVariant, string> = {
  body: 'pathable-text--body',
  small: 'pathable-text--small',
  caption: 'pathable-text--caption',
}
```

### Text Tone Prop

```typescript
export type TextTone = 'default' | 'muted' | 'danger' | 'success'
```

String literal union. Each maps to a tone modifier class suffix.

### Tone Class Map

```typescript
const TEXT_TONE_CLASS: Record<TextTone, string> = {
  default: 'pathable-text--tone-default',
  muted: 'pathable-text--tone-muted',
  danger: 'pathable-text--tone-danger',
  success: 'pathable-text--tone-success',
}
```

### Polymorphic Props

```typescript
export type TextOwnProps = {
  variant?: TextVariant
  tone?: TextTone
  children?: ReactNode
  className?: string
}

export type TextProps<C extends keyof React.JSX.IntrinsicElements = 'p'> =
  TextOwnProps & Omit<React.ComponentPropsWithRef<C>, keyof TextOwnProps | 'color'>
```

**Design decisions**:
- Generic over `C extends keyof React.JSX.IntrinsicElements` so consumers choose the rendered element and get exactly that element's native props (FR-012).
- `TextOwnProps` are omitted from the inherited native props so the component's own props win.
- Default type parameter `'p'` gives ergonomic `<Text>` usage without explicit generics.
- The component casts `ComponentPropsWithRef<C>['ref']` to an acceptable forwarded-ref type; type safety for consumers is preserved at the call site.

### Component Props Interface

```typescript
export interface TextProps extends React.ComponentPropsWithRef<Bounds> {}
```

Where `TextOwnProps` + per-element props are composed as above. `TextVariant` and `TextTone` are exported for consumer use.

## Prop-to-Class Resolution Flow

```text
Text props
  │
  ├─ variant ────► TEXT_VARIANT_CLASS[variant] ─► "pathable-text--{variant}" or undefined
  ├─ tone ────────► TEXT_TONE_CLASS[tone] ──────► "pathable-text--tone-{tone}" or undefined
  ├─ className ───► string (consumer-provided, passed through)
  └─ rest ────────► native props spread onto the rendered element (typed by `as`)
```

All resolved class strings are passed to `mergeClasses` in order, which filters out falsy values and joins with spaces.

### mergeClasses Call

```typescript
const classes = mergeClasses(
  'pathable-text',                                      // 1. base class (always)
  variant ? TEXT_VARIANT_CLASS[variant] : undefined,    // 2. variant modifier
  tone ? TEXT_TONE_CLASS[tone] : undefined,             // 3. tone modifier
  className,                                            // 4. consumer class (last)
)
```

## Component Structure

```typescript
const TextInner = <C extends keyof React.JSX.IntrinsicElements = 'p'>(
  { as, variant, tone, children, className = '', ...rest }: TextProps<C>,
  ref: React.ForwardedRef<Element>,
) => {
  const Component = (as ?? 'p') as React.ElementType
  const classes = mergeClasses(
    'pathable-text',
    variant ? TEXT_VARIANT_CLASS[variant] : undefined,
    tone ? TEXT_TONE_CLASS[tone] : undefined,
    className,
  )
  return (
    <Component className={classes} ref={ref} {...(rest as React.ComponentProps<string>)}>
      {children}
    </Component>
  )
}

export const Text = forwardRef<Element, TextProps>(TextInner) as <C extends 'p'>(
  props: TextProps<C>,
) => React.ReactElement | null
```

## Exports

Added to `packages/react/src/index.ts`:

```typescript
export { Text } from './components/Text/Text.js'
export type { TextProps, TextVariant, TextTone } from './components/Text/Text.js'
```

## Test Data Model

| Test Subject | Input | Expected Class(es) on Root |
|--------------|-------|----------------------------|
| Base (no props) | `<Text />` | `<p class="pathable-text">` |
| variant="body" | `<Text variant="body" />` | `<p class="pathable-text pathable-text--body">` |
| variant="small" | `<Text variant="small" />` | `pathable-text pathable-text--small` |
| variant="caption" | `<Text variant="caption" />` | `pathable-text pathable-text--caption` |
| tone="muted" | `<Text tone="muted" />` | `pathable-text pathable-text--tone-muted` |
| tone="danger" | `<Text tone="danger" />` | `pathable-text pathable-text--tone-danger` |
| tone="success" | `<Text tone="success" />` | `pathable-text pathable-text--tone-success` |
| tone="default" | `<Text tone="default" />` | `pathable-text pathable-text--tone-default` (explicit default) |
| variant + tone | `<Text variant="small" tone="muted" />` | `pathable-text pathable-text--small pathable-text--tone-muted` |
| as="span" | `<Text as="span" />` | `<span class="pathable-text">` |
| as="label" | `<Text as="label" htmlFor="x" />` | `<label class="pathable-text" for="x">` |
| as="figcaption" | `<Text as="figcaption" />` | `<figcaption class="pathable-text">` |
| className | `<Text className="custom" />` | `pathable-text custom` (custom last) |
| ref forwarding | `ref` passed | `ref.current` is the DOM element (tag matches `as`) |
| children | `<Text>Hello</Text>` | Text content present on the single root |
| Server vs client | Any prop combination | Identical class string and markup |
| No wrapper | any props | No intermediate elements between root and children |
| Unknown variant/tone (runtime cast) | `variant="bogus" as never` | class silently omitted; base class only (documented fallback) |
| Native prop invalid for element | `as="p"` + `htmlFor` at compile time | Type error (compile-time contract) |

## Relationships

- **Text ↔ design-system typography tokens**: each variant maps to a `--pathable-font-*` size/line-height/weight token; the `pathable-text` SCSS resolves the values. No JS duplicates token values.
- **Text ↔ design-system semantic color**: each tone maps to a `--pathable-color-text*`/`-danger`/`-success` semantic token; contrast obligations are verified in research.md.
- **Text ↔ polymorphic pattern**: follows the layout primitives' `as`+`forwardRef`+`mergeClasses` pattern, but with generic per-element props to meet FR-012.
- **Text ↔ Heading**: `Text` owns body/small/caption roles; `Heading` (separate feature) owns heading-level/outline semantics (FR-020).
- **Text ↔ `className`**: `className` remains the composable escape hatch for utilities not yet surfaced as props (FR-016).