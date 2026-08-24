# Data Model: Promote Repeated Composition Patterns

**Feature**: 056-promote-composition-patterns
**Date**: 2026-08-24

## Component-to-SCSS Contract Mappings

Each promoted primitive maps prop values to `pathable-*` BEM CSS class modifiers. The mappings below document the prop domain, the underlying SCSS contract, and the resulting CSS classes.

---

## CardGrid

| Prop | Type | Default | SCSS Contract | CSS Classes |
|------|------|---------|---------------|-------------|
| `variant` | `"cluster" \| "auto-fit"` | `"cluster"` | — | Switches between `pathable-cluster` / `pathable-card-grid` root |
| `gap` | `CardGridClusterGap \| CardGridAutoGap` | varies by variant | `pathable-cluster` / `pathable-card-grid` | `pathable-cluster--gap-{value}` or `pathable-card-grid--gap-{value}` |
| `children` | `ReactNode` | — | — | Each child in cluster mode is automatically wrapped with `pathable-surface` visual treatment |
| `className` | `string?` | — | — | Appended after design-system classes |
| `as` | `ElementType?` | `"div"` | — | Root element override |

**Cluster mode gap values** (`CardGridClusterGap`): `"sm"` (4px), `"md"` (8px), `"lg"` (16px), `"xl"` (24px)

**Auto-fit mode gap values** (`CardGridAutoGap`): `"sm"` (16px), `"md"` (24px), `"lg"` (32px)

### CardGrid Props Interface

```ts
interface CardGridProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  variant?: 'cluster' | 'auto-fit'
  gap?: CardGridClusterGap | CardGridAutoGap
  as?: ElementType
  className?: string
}
```

### Rendered HTML (cluster mode, default)

```html
<div class="pathable-cluster pathable-cluster--gap-sm">
  <div class="pathable-surface pathable-surface--base">...</div>
  <div class="pathable-surface pathable-surface--base">...</div>
</div>
```

### Rendered HTML (auto-fit mode, default)

```html
<div class="pathable-card-grid pathable-card-grid--gap-md">
  <div>...</div>
  <div>...</div>
</div>
```

---

## Page

| Prop | Type | Default | SCSS Contract | CSS Classes |
|------|------|---------|---------------|-------------|
| `size` | `"standard" \| "wide" \| "full"` | `"standard"` | `pathable-container` | `pathable-container--{size}` |
| `gap` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | `pathable-stack` | `pathable-stack--gap-{value}` |
| `as` | `ElementType?` | `"main"` | — | Root element (landmark) |
| `children` | `ReactNode` | — | — | Wrapped in Container → Stack |
| `className` | `string?` | — | — | Appended to Container |

**Gap values**: `"sm"` (8px), `"md"` (16px), `"lg"` (24px), `"xl"` (32px) — per `pathable-stack` scale.

### Rendered HTML

```html
<main class="pathable-container pathable-container--standard">
  <div class="pathable-stack pathable-stack--gap-md">
    <section>...</section>
    <section>...</section>
  </div>
</main>
```

**Important**: the outer element is `Container` with its `size` prop. The inner children are wrapped in `Stack` with the `gap` prop. The `className` override applies to `Container`. The `as` prop overrides `<main>`.

---

## SidebarLayout

| Prop | Type | Default | SCSS Contract | CSS Classes |
|------|------|---------|---------------|-------------|
| `ratio` | `"1-1" \| "2-1" \| "3-1" \| "4-1"` | `"3-1"` | `pathable-sidebar-layout` | `pathable-sidebar-layout--ratio-{value}` |
| `sidebarFirst` | `boolean` | `false` | `pathable-sidebar-layout` | `pathable-sidebar-layout--sidebar-first` |
| `sidebarSticky` | `boolean` | `false` | `pathable-sticky-panel` | Wraps sidebar in `pathable-sticky-panel` div |
| `children` | `ReactNode` | — | — | Two children: first = main, second = sidebar |
| `className` | `string?` | — | — | Appended to root div |

### Rendered HTML

```html
<div class="pathable-sidebar-layout pathable-sidebar-layout--ratio-3-1">
  <main>Main content</main>
  <aside>
    <div class="pathable-sticky-panel">Sidebar content</div>
  </aside>
</div>
```

**Ordering**: When `sidebarFirst` is `true`, the `<aside>` renders before `<main>` in DOM order and `pathable-sidebar-layout--sidebar-first` is added.

---

## SplitLayout

| Prop | Type | Default | SCSS Contract | CSS Classes |
|------|------|---------|---------------|-------------|
| `ratio` | `"1-1" \| "1-2" \| "2-1" \| "1-3"` | `"1-1"` | `pathable-split` | `pathable-split--ratio-{value}` |
| `align` | `"center" \| "start" \| "end" \| "stretch"` | `"center"` | `pathable-split` | `pathable-split--align-{value}` |
| `children` | `ReactNode` | — | — | Exactly two children: left panel, right panel |
| `as` | `ElementType?` | `"div"` | — | Root element override |
| `className` | `string?` | — | — | Appended to root div |

### Rendered HTML

```html
<div class="pathable-split pathable-split--ratio-1-1 pathable-split--align-stretch">
  <div class="pathable-surface--raised">Left panel</div>
  <div class="pathable-surface--brand">Right panel</div>
</div>
```

---

## FormStack

| Prop | Type | Default | SCSS Contract | CSS Classes |
|------|------|---------|---------------|-------------|
| `gap` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | `pathable-stack` | `pathable-stack--gap-{value}` |
| `maxWidth` | `"tablet" \| "content" \| undefined` | `undefined` | — | `pathable-s-maxw-tablet` or `pathable-s-maxw-content` |
| `as` | `ElementType?` | `"form"` | — | Root element (default `<form>`) |
| `children` | `ReactNode` | — | — | Typically `FormGroup` children; gap applied via Stack |
| `className` | `string?` | — | — | Appended to root `<form>` |

**Gap values**: `"sm"` (8px), `"md"` (16px), `"lg"` (24px), `"xl"` (32px) — per `pathable-stack` scale.

### Rendered HTML

```html
<form class="pathable-stack pathable-stack--gap-md pathable-s-maxw-tablet">
  <div class="pathable-form-group">...</div>
  <div class="pathable-form-group">...</div>
</form>
```

---

## Gap Scale Cross-Reference

| Value | stack | cluster | card-grid |
|-------|-------|---------|-----------|
| sm    | 8px   | 4px     | 16px      |
| md    | 16px  | 8px     | 24px      |
| lg    | 24px  | 16px    | 32px      |
| xl    | 32px  | 24px    | —         |

Components that compose `Stack` (Page, FormStack) use the stack scale.
Components that compose `Cluster` (CardGrid cluster mode) use the cluster scale.
Components that use `pathable-card-grid` (CardGrid auto-fit mode) use the card-grid scale.
Components that use their own SCSS contracts (SidebarLayout, SplitLayout) use `--pathable-*-gap` custom properties directly and do not expose `gap` as a prop.

---

## Entity Relationships

```
Container ──► Page
Stack ──────► Page, FormStack
Cluster ────► CardGrid (cluster mode)
Surface ────► CardGrid (cluster mode, per-child treatment)
Grid (CSS) ─► CardGrid (auto-fit mode), SidebarLayout, SplitLayout
form ───────► FormStack (default root element)
main/aside ─► SidebarLayout (semantic landmarks)
```