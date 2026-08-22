# Data Model: Heading Primitive

## Domain Entities

### HeadingLevel

The semantic heading level in the document outline.

- **Type**: `1 | 2 | 3 | 4 | 5 | 6`
- **Purpose**: Controls both the rendered HTML heading element (`h1`–`h6`) and, by default, the visual style class.
- **Validation**: Must be an integer in range [1, 6]. TypeScript literal union prevents invalid values at compile time.
- **Required**: Yes — `level` is a required prop with no default.

### VisualHeadingLevel

An optional override for the visual style class independent of the document outline level.

- **Type**: `1 | 2 | 3 | 4 | 5 | 6 | undefined`
- **Purpose**: When set, the visual style class uses this value while the HTML element uses `level`.
- **Validation**: Must be an integer in range [1, 6] if provided. Undefined means "use `level`".
- **Required**: No — defaults to `level` when omitted.

### HeadingProps

The public prop interface for the `Heading` component.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `level` | `HeadingLevel` | Yes | — | Document outline level; controls HTML element |
| `visualLevel` | `HeadingLevel` | No | `level` | Visual style override |
| `className` | `string` | No | — | Consumer class appended after design-system classes |
| `children` | `ReactNode` | No | — | Heading content |
| `style` | `CSSProperties` | No | — | Inline style escape hatch |
| `...nativeProps` | Element-specific | No | — | Native HTML attributes for the heading element |

## Class Resolution Model

### Resolution Order

The heading element receives classes in this deterministic order:

1. `.pathable-heading` (base class)
2. `.pathable-heading--level-{visualLevel ?? level}` (visual style modifier)
3. `className` (consumer-provided, via `mergeClasses()`)

### Mapping Table

| `level` | HTML Element | Scale Entry | Modifier Class | Font Family | Font Size | Weight |
|---------|-------------|-------------|----------------|-------------|-----------|--------|
| 1 | `h1` | `display-lg` | `.pathable-heading--level-1` | Fredoka | 32px | 400 |
| 2 | `h2` | `heading-lg` | `.pathable-heading--level-2` | Poppins | 24px | 700 |
| 3 | `h3` | `heading-md` | `.pathable-heading--level-3` | Poppins | 20px | 700 |
| 4 | `h4` | `heading-sm` | `.pathable-heading--level-4` | Poppins | 18px | 700 |
| 5 | `h5` | `body-md` (bold) | `.pathable-heading--level-5` | Nunito | 16px | 700 |
| 6 | `h6` | `body-sm` (bold) | `.pathable-heading--level-6` | Nunito | 14px | 700 |

### Element-to-Props Mapping

Since `level` determines the exact HTML element, native props are restricted to that element:

| `level` | Element | Native Props Type |
|---------|---------|-------------------|
| 1 | `h1` | `HTMLAttributes<HTMLHeadingElement>` |
| 2 | `h2` | `HTMLAttributes<HTMLHeadingElement>` |
| 3 | `h3` | `HTMLAttributes<HTMLHeadingElement>` |
| 4 | `h4` | `HTMLAttributes<HTMLHeadingElement>` |
| 5 | `h5` | `HTMLAttributes<HTMLHeadingElement>` |
| 6 | `h6` | `HTMLAttributes<HTMLHeadingElement>` |

All heading elements share the same `HTMLHeadingElement` interface, so a single generic props type suffices — no discriminated union is needed for element-specific attributes.

## SCSS Contract Structure

### File: `pathable-heading.scss`

Location: `packages/styles/src/pathable-component-wrappers/pathable-heading.scss`

```scss
.pathable-heading {
  color: var(--pathable-color-text);
  margin: 0;
}

.pathable-heading--level-1 {
  font-family: var(--pathable-font-heading);
  font-size: var(--pathable-font-size-display-lg);
  font-weight: var(--pathable-font-weight-normal);
  line-height: var(--pathable-font-line-height-heading);
}

.pathable-heading--level-2 {
  font-family: var(--pathable-font-subheading);
  font-size: var(--pathable-font-size-heading-lg);
  font-weight: var(--pathable-font-weight-bold);
  line-height: var(--pathable-font-line-height-heading);
}

// ... levels 3-6 follow same pattern
```

### Integration: `pathable-typography.scss`

Add: `@forward 'pathable-heading';`

## State Machine

Heading has no state — it is a pure presentational component. The only "state" is the prop combination:

- **Valid**: `level` ∈ [1,6], `visualLevel` ∈ [1,6] | undefined
- **Invalid**: `level` outside [1,6] — prevented at compile time by TypeScript
- **Visual fallback**: `visualLevel` = undefined → visual class resolves from `level`
- **Identity**: `visualLevel` = `level` → same output as omitting `visualLevel`

## Relationships

- **Heading** depends on the **`pathable-heading` SCSS contract** in `@pathableai/styles` (per constitution Principle I — styles first).
- **Heading** reuses the **`mergeClasses()` utility** and internal class-resolver patterns from the semantic prop foundation (slice 01).
- **Heading** is a sibling of **`Text`** — both are typographic primitives, but `Heading` handles outline-level semantics (h1–h6) while `Text` handles body-text roles (body/small/caption) and tone.
