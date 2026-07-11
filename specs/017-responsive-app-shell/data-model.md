# Data Model: Responsive Application Shell Pattern

## Entities

### ApplicationShell

The top-level layout container. Orchestrates the arrangement of all shell regions.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `display` | CSS value | `grid` | Uses CSS Grid for region layout |
| `grid-template-areas` | Desktop | `"sidebar main"` | Desktop layout: sidebar on left, content on right |
| `grid-template-areas` | Mobile | `"topbar" "main" "bottomnav"` | Mobile: top bar, content scrolls, optional bottom nav |
| `grid-template-columns` | Desktop | `var(--pathable-app-shell-sidebar-width, 280px) 1fr` | Sidebar width + remaining content |
| `grid-template-rows` | Desktop | `1fr` | Single row, full height |
| `grid-template-rows` | Mobile | `auto 1fr auto` | Top bar (auto), content (fill), bottom nav (auto) |
| `min-height` | CSS value | `100dvh` | Full viewport height |

**Relationships**:
- Contains exactly one `Sidebar` visible on desktop
- Contains exactly one `MobileTopBar` visible on mobile
- Contains at most one `MobileBottomNavigation` visible on mobile
- Contains exactly one `MainContent` region
- May contain a `GlobalNotificationLayer`

---

### Sidebar

The persistent vertical panel on desktop, hidden on mobile.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | CSS custom property | `280px` | Set via `--pathable-app-shell-sidebar-width` |
| `position` | CSS value | `sticky` or `fixed` (configurable) | Controlled via `.pathable-app-shell__sidebar--fixed` modifier |
| `overflow` | CSS value | `auto` | Independent scrolling when nav content overflows |
| `grid-area` | CSS value | `sidebar` | Maps to grid area in shell layout |

**Regions** (children, provided by consumer via semantic class names):
- `.pathable-app-shell__brand` — Brand lockup area
- `.pathable-app-shell__nav` — Primary navigation list
- `.pathable-app-shell__account` — Account or organization summary

**Relationships**:
- Visible only on viewports >= 1024px
- Hidden via `display: none` below 1024px
- Owned by `ApplicationShell`

---

### MobileTopBar

A compact horizontal bar at the top of the viewport on mobile.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `height` | CSS value | `48px` | Compact height, configurable via `--pathable-app-shell-topbar-height` |
| `position` | CSS value | `sticky` | Sticks to top of viewport on scroll |
| `grid-area` | CSS value | `topbar` | Maps to grid area in mobile layout |
| `z-index` | CSS value | `10` | Above content but below overlays |

**Relationships**:
- Visible only on viewports < 1024px
- Hidden via `display: none` at 1024px and above
- Owned by `ApplicationShell`

---

### MobileBottomNavigation

An optional fixed navigation bar at the bottom of the viewport on mobile.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `max-items` | Integer | `5` | Up to five primary destinations |
| `position` | CSS value | `sticky` | Sticks to bottom of viewport |
| `height` | CSS value | `auto` | Content-driven, labels wrap at narrow widths |
| `safe-area` | CSS env() | `env(safe-area-inset-bottom, 0px)` | Padding for home indicators |
| `grid-area` | CSS value | `bottomnav` | Maps to grid area in mobile layout |

**Variants**:
- `.pathable-bottom-navigation` — base class applied to the `<nav>` element
- `.pathable-bottom-navigation__item` — individual navigation items
- `.pathable-bottom-navigation__item--active` — active destination styling

**Relationships**:
- Visible only on viewports < 1024px
- Present only when at least one navigation item is provided (no empty bar)
- Owned by `ApplicationShell`

---

### MainContent

The primary scrollable content area.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `max-width` | CSS custom property | `1024px` | Standard width: `--pathable-app-shell-content-max-width` |
| `max-width (wide)` | CSS custom property | `1280px` | Wide width: `--pathable-app-shell-content-max-width--wide` |
| `padding` | CSS custom property | `var(--space-24)` | Content gutters: `--pathable-app-shell-content-padding` |
| `grid-area` | CSS value | `main` | Maps to grid area in all layouts |
| `overflow` | CSS value | `auto` | Independent scrolling |

**Variants**:
- `.pathable-app-shell__content--standard` — uses standard max-width (default)
- `.pathable-app-shell__content--wide` — uses wide max-width

**Relationships**:
- Always visible regardless of viewport
- Accepts an `id="main-content"` attribute as the skip link target
- Owned by `ApplicationShell`

---

### GlobalNotificationLayer

An optional overlay or banner region for system-level messages.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | CSS value | `relative` | In-flow banner at top of main content |
| `z-index` | CSS value | `20` | Above sidebar, top bar, and bottom nav |

**Relationships**:
- Positioned above main content on all viewports
- Must not be obscured by any fixed navigation region (FR-015)
- Owned by `ApplicationShell`

---

## State Transitions

### Viewport-based transitions (CSS `@media`)

| From State | Trigger | To State |
|-----------|---------|----------|
| Desktop shell (sidebar visible) | Viewport < 1024px | Mobile shell (top bar + content + optional bottom nav) |
| Mobile shell | Viewport >= 1024px | Desktop shell |

### Navigation state

| State | Selector | Visual Cues |
|-------|----------|-------------|
| Default | `.pathable-app-shell__nav-item` | Normal weight, no border marker |
| Active | `.pathable-app-shell__nav-item--active` or `[aria-current="page"]` | Heavier weight + inset border marker + color change |
| Active (sidebar) | same | Inset left border `2px solid var(--pathable-color-accent)` |
| Active (bottom nav) | same | Top border or background shape + weight + color |

## Validation Rules

- Bottom navigation MUST NOT render when zero items are provided (no empty bar)
- Active navigation MUST use at least two sensory cues (color + weight/border/marker/shape)
- Fixed regions MUST NOT obscure focused content, dialogs, or toast notifications
- Focus order MUST follow DOM order across all breakpoints
- All color, spacing, elevation, and radius values MUST reference PathAble design tokens (CSS custom properties) — no hardcoded values