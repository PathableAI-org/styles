# Data Model: Form Controls and Button Adopt Sizing Props

**Feature**: specs/046-form-control-button-sizing
**Date**: 2026-08-20

## Entity: Sizing Adapter per Component

Each component extends the shared `SizingProps` interface and maps sizing values to CSS classes via the shared resolvers. The mapping is identical across all four components — this is by design: the resolver layer standardizes the value-to-class contract.

### Props Added to Every Component

| Prop | Type | Source Interface | Resolver | Example Output |
|---|---|---|---|---|
| `width` | `Width` (`'auto'` \| `'full'`) | `SizingProps` | `widthClass` | `pathable-width-full` |
| `maxWidth` | `MaxWidth` (`'mobile'` \| `'mobile-lg'` \| `'tablet'` \| `'desktop'`) | `SizingProps` | `maxWidthClass` | `pathable-maxw-tablet` |

### Width Values

```text
'auto' | 'full'
```

### MaxWidth Values

```text
'mobile' (320px) | 'mobile-lg' (480px) | 'tablet' (640px) | 'desktop' (1024px)
```

Px values are informational — tied to `@pathable/styles` breakpoint definitions.

---

## Entity: Button Component Props

### Added Props

| Prop | Type | Resolver |
|---|---|---|
| `width` | `Width` | `widthClass` |
| `maxWidth` | `MaxWidth` | `maxWidthClass` |

### Existing Props (preserved, unmodified)

| Prop | Type | Notes |
|---|---|---|
| `variant` | `ButtonVariant` | `'default'` \| `'outline'` \| `'rounded'` \| `'secondary'` \| `'accent'` \| `'base'` \| `'unstyled'` |
| `size` | `ButtonSize` | `'default'` \| `'big'` |
| `disabled` | `boolean` | Native button disabled |
| `className` | `string` | Consumer CSS class |
| `children` | `ReactNode` | Button content |
| `...rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | Native attributes, handlers |

### Class Merge Order

```
pathable-button → variantClass → sizeClass → widthClass(width) → maxWidthClass(maxWidth) → consumer className
```

### Root Element

`<button type="button">`

---

## Entity: Input Component Props

### Added Props

| Prop | Type | Resolver |
|---|---|---|
| `width` | `Width` | `widthClass` |
| `maxWidth` | `MaxWidth` | `maxWidthClass` |

### Existing Props (preserved, unmodified)

| Prop | Type | Notes |
|---|---|---|
| `className` | `string` | Consumer CSS class |
| `children` | `never` | Explicitly forbidden (void element) |
| `...rest` | `InputHTMLAttributes<HTMLInputElement>` | Native attributes, type, value, placeholder, disabled |

### Class Merge Order

```
pathable-input → widthClass(width) → maxWidthClass(maxWidth) → consumer className
```

### Root Element

`<input>`

---

## Entity: Select Component Props

### Added Props

| Prop | Type | Resolver |
|---|---|---|
| `width` | `Width` | `widthClass` |
| `maxWidth` | `MaxWidth` | `maxWidthClass` |

### Existing Props (preserved, unmodified)

| Prop | Type | Notes |
|---|---|---|
| `className` | `string` | Consumer CSS class |
| `children` | `ReactNode` | `<option>` elements |
| `...rest` | `SelectHTMLAttributes<HTMLSelectElement>` | Native attributes, value, disabled |

### Class Merge Order

```
pathable-select → widthClass(width) → maxWidthClass(maxWidth) → consumer className
```

### Root Element

`<select>`

---

## Entity: Textarea Component Props

### Added Props

| Prop | Type | Resolver |
|---|---|---|
| `width` | `Width` | `widthClass` |
| `maxWidth` | `MaxWidth` | `maxWidthClass` |

### Existing Props (preserved, unmodified)

| Prop | Type | Notes |
|---|---|---|
| `className` | `string` | Consumer CSS class |
| `children` | `never` | Explicitly forbidden (children not valid in React for textarea) |
| `...rest` | `TextareaHTMLAttributes<HTMLTextAreaElement>` | Native attributes, value, rows, placeholder, disabled |

### Class Merge Order

```
pathable-textarea → widthClass(width) → maxWidthClass(maxWidth) → consumer className
```

### Root Element

`<textarea>`

---

## Invariants (Applies to All Four Components)

1. Each component always renders exactly one root element — no extra wrappers are introduced
2. Each component's existing semantic HTML structure, ARIA roles, and accessibility behavior is unchanged
3. Native HTML attribute passthrough is preserved (`id`, `data-*`, `aria-*`, `disabled`, `placeholder`, `type`, event handlers)
4. Server-rendered output is identical to client-rendered output for all sizing-prop combinations
5. Omitting sizing props produces identical DOM to the pre-feature component
6. The `mergeClasses` utility enforces the documented merge order: required component classes → resolved semantic classes → consumer `className`
7. No ref forwarding is added or changed — components that don't currently support it remain unchanged