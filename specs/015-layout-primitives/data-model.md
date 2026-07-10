# Data Model: Compositional Layout Primitives and Semantic Surfaces

## Overview

This document defines the SCSS entities (classes, CSS custom properties, and their relationships) for the layout primitive and semantic surface system. Since this feature produces compiled CSS, the "data model" describes the CSS class API and its configurable custom properties.

## Entities

### 1. Container (`.pathable-container`)

A centered layout wrapper that constrains content width with configurable maximum widths.

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-container-max-width` | `1024px` | Maximum content width |
| `--pathable-container-gutter-x` | `var(--space-24)` | Horizontal padding (left + right) |

**Modifier Classes**:

| Class | Effect |
|---|---|
| `.pathable-container--standard` | Max width 1024px (default, suitable for most content pages) |
| `.pathable-container--wide` | Max width 1280px (suitable for data tables, dashboards) |
| `.pathable-container--full` | Max width 100% with constrained gutters (suitable for full-bleed page sections) |

**Behavior**:
- Always horizontally centered via `margin-inline: auto`
- Horizontal padding applied via `--pathable-container-gutter-x`
- 100% width until content hits max-width, then centered

**SCSS Structure**:
```scss
.pathable-container {
  width: 100%;
  max-width: var(--pathable-container-max-width, 1024px);
  margin-inline: auto;
  padding-inline: var(--pathable-container-gutter-x, var(--space-24));
}
```

**Relationships**: Can wrap any other primitive. Typically the outermost element of a page section.

---

### 2. Stack (`.pathable-stack`)

A vertical flow layout that adds consistent spacing between adjacent child elements.

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-stack-gap` | `var(--space-16)` | Vertical gap between children |

**Modifier Classes**:

| Class | Effect |
|---|---|
| `.pathable-stack--gap-sm` | Gap `var(--space-8)` |
| `.pathable-stack--gap-md` | Gap `var(--space-16)` (default) |
| `.pathable-stack--gap-lg` | Gap `var(--space-24)` |
| `.pathable-stack--gap-xl` | Gap `var(--space-32)` |

**Behavior**:
- Uses CSS `display: flex; flex-direction: column` with `gap`
- Only affects *direct* children — does not cascade into nested stacks
- Single child renders with no visible effect (gap has no effect with one child)

**SCSS Structure**:
```scss
.pathable-stack {
  display: flex;
  flex-direction: column;
  gap: var(--pathable-stack-gap, var(--space-16));
}
```

**Relationships**: Children can be any element. Can be nested inside any other primitive.

---

### 3. Cluster (`.pathable-cluster`)

A horizontal wrapping layout for grouping related items (tags, buttons, controls).

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-cluster-gap` | `var(--space-8)` | Horizontal and vertical gap between items |
| `--pathable-cluster-align` | `center` | `align-items` value |

**Modifier Classes**:

| Class | Effect |
|---|---|
| `.pathable-cluster--gap-sm` | Gap `var(--space-4)` |
| `.pathable-cluster--gap-md` | Gap `var(--space-8)` (default) |
| `.pathable-cluster--gap-lg` | Gap `var(--space-16)` |
| `.pathable-cluster--align-start` | `align-items: flex-start` |
| `.pathable-cluster--align-center` | `align-items: center` (default) |
| `.pathable-cluster--align-end` | `align-items: flex-end` |
| `.pathable-cluster--align-stretch` | `align-items: stretch` |

**Behavior**:
- Uses CSS `display: flex; flex-wrap: wrap` with `gap`
- Items wrap naturally when container is too narrow
- No single-child edge case — gap still applies row/column gap

**SCSS Structure**:
```scss
.pathable-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: var(--pathable-cluster-gap, var(--space-8));
  align-items: var(--pathable-cluster-align, center);
}
```

**Relationships**: Children are typically tags, buttons, or pill controls. Can be used inside any other primitive.

---

### 4. Split (`.pathable-split`)

A responsive two-region layout with configurable ratio, alignment, and collapse behavior.

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-split-ratio` | `1fr 1fr` | Grid template columns (desktop) |
| `--pathable-split-align` | `center` | `align-items` value |
| `--pathable-split-gap` | `var(--space-24)` | Gap between regions |

**Modifier Classes**:

| Class | Effect |
|---|---|
| `.pathable-split--ratio-1-2` | `1fr 2fr` — first region narrower |
| `.pathable-split--ratio-2-1` | `2fr 1fr` — second region narrower |
| `.pathable-split--ratio-1-1` | `1fr 1fr` (default) — equal split |
| `.pathable-split--ratio-1-3` | `1fr 3fr` — sidebar + main content ratio |
| `.pathable-split--align-start` | `align-items: flex-start` |
| `.pathable-split--align-center` | `align-items: center` (default) |
| `.pathable-split--align-end` | `align-items: flex-end` |
| `.pathable-split--align-stretch` | `align-items: stretch` |

**Responsive Behavior**:
- Below 1024px (`desktop` breakpoint): collapses to `grid-template-columns: 1fr` — regions stack
- DOM reading order is preserved (first child remains visually first when stacked)

**SCSS Structure**:
```scss
.pathable-split {
  display: grid;
  grid-template-columns: var(--pathable-split-ratio, 1fr 1fr);
  gap: var(--pathable-split-gap, var(--space-24));
  align-items: var(--pathable-split-align, center);
}

@media (max-width: 1023px) {
  .pathable-split {
    grid-template-columns: 1fr;
  }
}
```

**Relationships**: Accepts exactly two direct children (first = primary, second = secondary). Can contain any other primitive.

---

### 5. Card Grid (`.pathable-card-grid`)

An auto-fitting grid layout for cards and tiles that adapts column count to available width.

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-card-grid-min-width` | `300px` | Minimum width for each card column |
| `--pathable-card-grid-gap` | `var(--space-24)` | Gap between cards |

**Modifier Classes**:

| Class | Effect |
|---|---|
| `.pathable-card-grid--gap-sm` | Gap `var(--space-16)` |
| `.pathable-card-grid--gap-md` | Gap `var(--space-24)` (default) |
| `.pathable-card-grid--gap-lg` | Gap `var(--space-32)` |

**Behavior**:
- Uses CSS Grid `grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--pathable-card-grid-min-width, 300px)), 1fr))` — auto-calculates column count
- `auto-fill` preserves column tracks even with fewer items (keeps alignment)
- The `min(100%, ...)` wrapper prevents cards from stretching wider than the container
- Cards never go narrower than `--pathable-card-grid-min-width`

**SCSS Structure**:
```scss
.pathable-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--pathable-card-grid-min-width, 300px)), 1fr));
  gap: var(--pathable-card-grid-gap, var(--space-24));
}
```

**Relationships**: Children are typically `.pathable-card` elements or custom card components. Can be used inside container, stack, split, or sidebar-layout.

---

### 6. Sidebar Layout (`.pathable-sidebar-layout`)

A two-region layout with primary content area and secondary sidebar that collapses below the primary on small screens.

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-sidebar-ratio` | `3fr 1fr` | Ratio of primary to sidebar columns |
| `--pathable-sidebar-gap` | `var(--space-24)` | Gap between regions |

**Modifier Classes**:

| Class | Effect |
|---|---|
| `.pathable-sidebar-layout--ratio-3-1` | `3fr 1fr` (default) — sidebar ~25% width |
| `.pathable-sidebar-layout--ratio-2-1` | `2fr 1fr` — sidebar ~33% width |
| `.pathable-sidebar-layout--ratio-4-1` | `4fr 1fr` — sidebar ~20% width |
| `.pathable-sidebar-layout--sidebar-first` | Sidebar appears first (left side on desktop, top on mobile) |

**Responsive Behavior**:
- At 1024px and above: `grid-template-columns: var(--pathable-sidebar-ratio, 3fr 1fr)` or `1fr 3fr` for sidebar-first
- Below 1024px: collapses to `grid-template-columns: 1fr` (sidebar below content)
- DOM reading order is preserved regardless of visual arrangement

**SCSS Structure**:
```scss
.pathable-sidebar-layout {
  display: grid;
  grid-template-columns: var(--pathable-sidebar-ratio, 3fr 1fr);
  gap: var(--pathable-sidebar-gap, var(--space-24));
}

.pathable-sidebar-layout--sidebar-first {
  grid-template-columns: 1fr var(--pathable-sidebar-ratio, 3fr);
}

@media (max-width: 1023px) {
  .pathable-sidebar-layout,
  .pathable-sidebar-layout--sidebar-first {
    grid-template-columns: 1fr;
  }
}
```

**Relationships**: Accepts exactly two direct children (first = main content / second = sidebar by default). Can contain any other primitive.

---

### 7. Sticky Panel (`.pathable-sticky-panel`)

An optional sticky container that safely becomes static on short or narrow viewports.

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-sticky-panel-top` | `var(--space-24)` | Offset from viewport top when sticky |

**Modifier Classes**:

| Class | Effect |
|---|---|
| `.pathable-sticky-panel--static` | Forces static positioning (no sticky) |

**Behavior**:
- Uses `position: sticky; top: var(--pathable-sticky-panel-top, var(--space-24))` within a `min-height: 100vh` container
- Sticky behavior gated by `@media (min-height: 600px)` — disabled on short viewports
- Falls back to static when:
  1. Viewport height < 600px
  2. Forced static via `.pathable-sticky-panel--static` modifier
  3. Below 1024px (in practice, sidebar layouts stack, making sticky irrelevant)

**SCSS Structure**:
```scss
.pathable-sticky-panel {
  position: sticky;
  top: var(--pathable-sticky-panel-top, var(--space-24));
}

.pathable-sticky-panel--static {
  position: static;
}

@media (max-height: 599px) {
  .pathable-sticky-panel {
    position: static;
  }
}
```

**Relationships**: Typically used as a direct child of sidebar-layout (the sidebar region). Can be used in any context where a sticky container is needed.

---

### 8. Surface (`.pathable-surface`)

A semantic visual container style that conveys depth through token-driven backgrounds, borders, border-radius, and elevation.

**CSS Custom Properties (configurable on element)**:

| Property | Default | Description |
|---|---|---|
| `--pathable-surface-border-radius` | `var(--radius-md)` | Border radius for all surfaces |
| `--pathable-surface-transition-duration` | `0.2s` | Transition duration for interactive states |

**Modifier Classes**:

| Class | Background | Border | Elevation | Use Case |
|---|---|---|---|---|
| `.pathable-surface--base` | transparent | `1px solid var(--pathable-color-border)` | none | Default container boundary |
| `.pathable-surface--raised` | `var(--pathable-color-surface)` | none | `var(--elevation-md)` | Cards, dialogs, dropdowns |
| `.pathable-surface--inset` | `var(--pathable-color-bg)` | none | `inset var(--elevation-sm)` (internal shadow) | Recessed areas, code blocks |
| `.pathable-surface--interactive` | `var(--pathable-color-surface)` | `2px solid transparent` | `var(--elevation-sm)` | Clickable cards, tappable panels |
| `.pathable-surface--brand` | `var(--pathable-color-accent)` | none | `var(--elevation-md)` | Promotional banners, CTAs |
| `.pathable-surface--inverse` | `var(--pathable-color-text)` | none | `var(--elevation-md)` | Dark/contrasting sections |

**Interactive Surface States** (`.pathable-surface--interactive` only):

| State | Visual Change |
|---|---|
| `:hover` | Elevation increases to `var(--elevation-md)`; optional scale transform |
| `:focus-visible` | `outline: 2px solid var(--pathable-color-focus-ring); outline-offset: 2px` |
| `:focus-within` | Same as `:focus-visible` for nested interactive elements |
| `:active` | Elevation drops to `var(--elevation-sm)` or none |
| `:disabled` / `[aria-disabled="true"]` | Reduced opacity, no hover elevation change |

**Accessibility**:
- `@media (forced-colors: active)` — uses `outline` for surface boundaries
- `@media (prefers-reduced-motion: reduce)` — removes transition on interactive surfaces
- Nested surfaces: raised-on-inset uses shadow for boundary; inset-on-raised uses inset shadow for boundary

**Relationships**: Can wrap any element. Can be nested (raised inside inset, etc.). Parent-child surface relationships remain visually distinguishable.

---

## Entity Relationships Diagram

```text
pathable-container
  ├── can contain: any primitive
  ├── children: any elements (stack, cluster, split, card-grid, sidebar-layout, surface)
  └── modifier: standard | wide | full

pathable-stack
  ├── can contain: any elements
  ├── children: any block/inline elements
  └── modifier: gap-sm | gap-md | gap-lg | gap-xl

pathable-cluster
  ├── can contain: inline elements (tags, buttons, controls)
  ├── children: typically <a>, <button>, <span>, <div>
  └── modifier: gap-* | align-*

pathable-split
  ├── can contain: exactly 2 children
  ├── child 1: primary region (any primitive)
  ├── child 2: secondary region (any primitive)
  └── modifier: ratio-* | align-*

pathable-card-grid
  ├── can contain: 1+ cards or tiles
  ├── children: typically .pathable-card or custom card classes
  └── modifier: gap-*

pathable-sidebar-layout
  ├── can contain: exactly 2 children
  ├── child 1: main content (any primitive)
  ├── child 2: sidebar (typically sticky-panel)
  └── modifier: ratio-* | sidebar-first

pathable-sticky-panel
  ├── can be inside: sidebar-layout, split, any container
  └── modifier: static (opt-out of sticky)

pathable-surface
  ├── can wrap: any element or group
  ├── variant: base | raised | inset | interactive | brand | inverse
  └── interactive state: hover | focus-visible | focus-within | active | disabled
```