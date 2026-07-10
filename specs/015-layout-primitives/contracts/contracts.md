# Interface Contracts: Compositional Layout Primitives and Semantic Surfaces

## Overview

This document defines the public API contracts for the new layout primitives and surface variants. Since `@pathable/styles` is an SCSS/CSS library, the "interfaces" are:

1. **SCSS Import Contract** — what consumers import and how selective imports work
2. **CSS Class API Contract** — what class names, modifiers, and BEM structure to expect
3. **CSS Custom Properties Contract** — what customization points exist on each component
4. **Responsive Behavior Contract** — how primitives behave at different viewport sizes

---

## 1. SCSS Import Contract

### Selective Import (individual primitives)

Consumers using SCSS can import only the primitives they need:

```scss
// Import individual primitives
@use '@pathable/styles/src/pathable-component-wrappers/pathable-container';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-stack';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-cluster';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-split';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-card-grid';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-sidebar-layout';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-sticky-panel';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-surface';
```

### Bundle Import (all composition primitives)

```scss
// Import all layout composition primitives at once
@use '@pathable/styles/src/pathable-component-wrappers/pathable-layout-composition';
```

### All-in-One Import

All primitives and surfaces are automatically included when consuming the full package:

```scss
// Already includes everything (existing pattern)
@use '@pathable/styles';
// or
@import '~@pathable/styles/dist/styles.css';
```

### Compiled CSS Consumption (no SCSS)

Consumers who use the compiled `dist/styles.css` get all primitives automatically. No SCSS toolchain required.

---

## 2. CSS Class API Contract

### Class Naming Convention

All primitives follow the established BEM-like naming convention:

| Category | Pattern | Examples |
|---|---|---|
| Primitive root | `.pathable-{name}` | `.pathable-container`, `.pathable-stack`, `.pathable-cluster` |
| Gap modifier | `.pathable-{name}--gap-{sm\|md\|lg\|xl}` | `.pathable-stack--gap-lg`, `.pathable-cluster--gap-sm` |
| Ratio modifier | `.pathable-{name}--ratio-{x-x}` | `.pathable-split--ratio-1-2`, `.pathable-sidebar-layout--ratio-3-1` |
| Align modifier | `.pathable-{name}--align-{start\|center\|end\|stretch}` | `.pathable-split--align-start` |
| Surface variant | `.pathable-surface--{variant}` | `.pathable-surface--raised`, `.pathable-surface--inset` |
| Special modifier | `.pathable-{name}--{special}` | `.pathable-sidebar-layout--sidebar-first`, `.pathable-sticky-panel--static` |
| Container width | `.pathable-container--{standard\|wide\|full}` | `.pathable-container--wide` |

### Surface Variants Contract

| Class | Visual Contract | Required Children |
|---|---|---|
| `.pathable-surface--base` | Subtle border boundary, no background fill, no elevation | None |
| `.pathable-surface--raised` | White/surface background, visible shadow elevation | None |
| `.pathable-surface--inset` | Background fill, inset/internal shadow, recessed appearance | None |
| `.pathable-surface--interactive` | Surface background, visible border, elevation on hover, focus ring | None |
| `.pathable-surface--brand` | Accent/teal background, visible shadow, promotional tone | None |
| `.pathable-surface--inverse` | Dark background (text color), light text, visible shadow | None |

### Semantic HTML Contract

| Primitive | Recommended HTML Element | ARIA Implications |
|---|---|---|
| `.pathable-container` | `<div>` | None — purely presentational |
| `.pathable-stack` | `<div>` | None — purely presentational |
| `.pathable-cluster` | `<div>`, `<nav>`, `<ul>` | If `<nav>`, use `aria-label`. If `<ul>`, add role semantics |
| `.pathable-split` | `<div>`, `<section>` | If used as a region, consider `aria-label` or `aria-labelledby` |
| `.pathable-card-grid` | `<div>`, `<ul>` | If `<ul>`, use `role="list"` for Safari fallback |
| `.pathable-sidebar-layout` | `<div>`, `<main>` + `<aside>` | Use `<main>` for primary, `<aside>` for sidebar with `aria-label` |
| `.pathable-sticky-panel` | `<div>`, `<aside>`, `<nav>` | None specific to sticky behavior |
| `.pathable-surface--*` | `<div>`, `<section>`, `<article>` | If interactive, use `tabindex="0"` or wrap in `<button>`/`<a>` |

---

## 3. CSS Custom Properties Contract

### Primitive-Level Custom Properties

Each primitive exposes a set of CSS custom properties on its root element. Consumers can override these per-instance using inline styles or a stylesheet:

```css
/* Override container max-width for a specific section */
.my-special-section {
  --pathable-container-max-width: 1400px;
}

/* Tighten spacing in a compact card grid */
.my-compact-grid {
  --pathable-card-grid-min-width: 240px;
  --pathable-card-grid-gap: var(--space-16);
}

/* Offset sticky panel from the top */
.my-sidebar-sticky {
  --pathable-sticky-panel-top: 80px; /* below a fixed header */
}
```

### Complete Custom Properties Reference

| Primitive | Property | Default | Accepts |
|---|---|---|---|
| Container | `--pathable-container-max-width` | `1024px` | Any CSS length |
| Container | `--pathable-container-gutter-x` | `var(--space-24)` | Any CSS length |
| Stack | `--pathable-stack-gap` | `var(--space-16)` | Any CSS length |
| Cluster | `--pathable-cluster-gap` | `var(--space-8)` | Any CSS length |
| Cluster | `--pathable-cluster-align` | `center` | `flex-start`, `center`, `flex-end`, `stretch`, `baseline` |
| Split | `--pathable-split-ratio` | `1fr 1fr` | Any grid-template-columns value |
| Split | `--pathable-split-align` | `center` | `flex-start`, `center`, `flex-end`, `stretch` |
| Split | `--pathable-split-gap` | `var(--space-24)` | Any CSS length |
| Card Grid | `--pathable-card-grid-min-width` | `300px` | Any CSS length |
| Card Grid | `--pathable-card-grid-gap` | `var(--space-24)` | Any CSS length |
| Sidebar Layout | `--pathable-sidebar-ratio` | `3fr 1fr` | Any grid-template-columns value |
| Sidebar Layout | `--pathable-sidebar-gap` | `var(--space-24)` | Any CSS length |
| Sticky Panel | `--pathable-sticky-panel-top` | `var(--space-24)` | Any CSS length |
| Surface | `--pathable-surface-border-radius` | `var(--radius-md)` | Any CSS length |
| Surface | `--pathable-surface-transition-duration` | `0.2s` | Any CSS time value |

---

## 4. Responsive Behavior Contract

### Breakpoint Reference

| Breakpoint | Width | Behavior |
|---|---|---|
| Any | Below 1024px | Split collapses to single column; sidebar-layout collapses (sidebar below content) |
| Short viewport | Below 600px height | Sticky panel becomes static |
| Narrow | Below 1024px | Card grid may show fewer columns based on `auto-fill` calculation |
| Narrow landscape | Below 480px + landscape | Card grid goes to single column |

### Responsive Guarantees

- **DOM reading order preserved**: When split or sidebar-layout collapse, the first child in DOM order remains visually first when stacked
- **No content overflow**: All primitives prevent horizontal overflow at any viewport width
- **200% zoom**: All primitives remain functional and readable at 200% browser zoom
- **No unreasonably narrow cards**: Card grid columns never go below `--pathable-card-grid-min-width` (default 300px)

---

## 5. Accessibility Contract

### Focus Management

- Interactive surfaces (`.pathable-surface--interactive`) expose `:hover`, `:focus-visible`, `:focus-within`, `:active`, and `:disabled` states
- Focus indicators use `outline` (not `box-shadow`) to ensure visibility in forced-colors mode
- Sticky panels never obscure focused content (disabled on short viewports)

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .pathable-surface--interactive {
    transition: none;
  }
}
```

Non-essential transitions (elevation changes on interactive surfaces) are removed. Essential transitions (hover-to-active state changes) are preserved.

### Forced Colors / High Contrast

```css
@media (forced-colors: active) {
  .pathable-surface--base {
    outline: 2px solid CanvasText;
  }
  .pathable-surface--raised,
  .pathable-surface--inset {
    outline: 2px solid CanvasText;
  }
  // ... similar for all surface variants
}
```

Every surface variant gains a visible outline boundary in forced-colors mode since `box-shadow` and `background-color` are stripped.

---

## 6. Composition Constraints

### Valid Nesting Patterns

```html
<!-- Page: full composition -->
<div class="pathable-container pathable-container--standard">
  <div class="pathable-stack pathable-stack--gap-lg">

    <!-- Hero section: split layout -->
    <div class="pathable-split pathable-split--ratio-1-2">
      <div class="pathable-surface pathable-surface--raised">
        <h2>Hero heading</h2>
        <p>Hero description</p>
      </div>
      <div class="pathable-surface pathable-surface--brand">
        <!-- CTA content -->
      </div>
    </div>

    <!-- Card grid section -->
    <div class="pathable-card-grid">
      <!-- auto-fitting card grid content -->
    </div>

    <!-- Sidebar layout with sticky panel -->
    <div class="pathable-sidebar-layout">
      <main>
        <!-- Main content -->
      </main>
      <aside>
        <div class="pathable-sticky-panel pathable-surface pathable-surface--raised">
          <!-- Sticky sidebar content -->
        </div>
      </aside>
    </div>

  </div>
</div>
```

### Invalid Patterns

- **Do not** apply multiple surface variant modifiers to the same element (e.g., `.pathable-surface--raised.pathable-surface--inset`)
- **Do not** apply multiple ratio modifiers to split or sidebar layout simultaneously
- **Do not** place sticky panels outside a container that provides `min-height` context for the sticky behavior to operate within
- **Do not** nest interactive surfaces inside other interactive surfaces without testing double-focus scenarios