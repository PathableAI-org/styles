# Data Model: React Desktop Shell Wrapper

**Feature**: 035-react-desktop-shell-wrapper
**Date**: 2026-08-13

## Entities

### AppShell

The top-level layout wrapper component that arranges sidebar, header, navigation, content, and overlay regions into a responsive grid layout.

**React representation**: `<AppShell>` functional component

**Props**:

| Attribute | Type | Required | Default | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | Yes | — | Main content rendered inside `pathable-app-shell__content` |
| `sidebarBrand` | `ReactNode` | No | — | Brand content in the sidebar's brand region |
| `sidebarNav` | `ReactNode` | No | — | Navigation items (typically `AppShellNavItem` elements) |
| `sidebarAccount` | `ReactNode` | No | — | Account/organization context at the bottom of the sidebar |
| `sidebarFixed` | `boolean` | No | `false` | When `true`, sidebar uses fixed positioning instead of sticky |
| `topBarTitle` | `string` | No | — | Title displayed in the mobile top bar |
| `bottomNavItems` | `BottomNavItem[]` | No | — | Destinations for the mobile bottom navigation bar |
| `contentWidth` | `'standard' \| 'wide'` | No | `'standard'` | Content max-width (1024px vs 1280px) |
| `notification` | `ReactNode` | No | — | Content for the global notification/status layer |
| `mainProps` | `Omit<HTMLAttributes<HTMLElement>, 'children' \| 'dangerouslySetInnerHTML'> & { children?: never; dangerouslySetInnerHTML?: never }` | No | — | Native main attributes; content-owning keys are forbidden and runtime-stripped, class names merge, and a valid normalized ID controls the skip target |
| `navigationLabel` | `string` | No | `'Primary'` | Normalized accessible name for navigation landmarks; empty values use the default |
| `skipLinkText` | `ReactNode` | No | `'Skip to main content'` | Consumer-localizable skip-link content; structurally empty values use the default |
| `mobileNavigation` | `'bottom' \| 'shared'` | No | `'bottom'` | Compact bottom items or shared sidebar destinations; unexpected runtime values use `bottom` |
| `className` | `string` | No | `''` | Additional CSS classes merged onto the root element |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | No | — | Passthrough attributes spread onto the root div |

**DOM output**: `<div class="pathable-app-shell [className]">` containing sidebar, skip link, topbar, main content, and notification regions.

**State transitions**: None. AppShell is a stateless layout component. All behavior is driven by CSS responsive breakpoints (1024px threshold) inherited from the styles contract.

**Validation rules**:
- If `sidebarNav` is empty, no `<nav className="pathable-app-shell__nav">` element is rendered.
- If `sidebarAccount` is empty, no `<div className="pathable-app-shell__account">` element is rendered.
- If `topBarTitle` is empty, the mobile top bar still renders with no title text.
- If `bottomNavItems` is empty or undefined, no `<nav className="pathable-bottom-navigation">` is rendered.
- If `sidebarBrand` is empty, no `<div className="pathable-app-shell__brand">` element is rendered.
- If `notification` is empty, no `<div className="pathable-app-shell__notification">` element is rendered.
- `contentWidth` must be `'standard'` or `'wide'` — applies the corresponding modifier class.
- Fixed sidebar: `sidebarFixed === true` adds `pathable-app-shell__sidebar--fixed` modifier.
- `mainProps.id` is trimmed; a missing, empty, non-string, or embedded-whitespace
  value falls back to `main-content`, and the resolved ID determines the
  skip-link target.
- `mainProps` excludes and runtime-strips `children` and
  `dangerouslySetInnerHTML`; main content is supplied only through
  `AppShell.children`.
- Structurally empty `skipLinkText` values fall back to `Skip to main content`.
- `navigationLabel` is trimmed; empty or non-string values fall back to
  `Primary` for every rendered navigation landmark.
- Shared navigation renders no `bottomNavItems`; the sidebar navigation remains the single navigation landmark.
- Any `mobileNavigation` runtime value other than `shared` uses the legacy
  `bottom` behavior.

---

### AppShellNavItem

A sidebar navigation item sub-component rendered as an anchor element with correct BEM classes and active-state attributes.

**React representation**: `<AppShellNavItem>` functional component

**Props**:

| Attribute | Type | Required | Default | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | Yes | — | Link text or label content |
| `href` | `string` | Yes | — | Navigation target URL |
| `active` | `boolean` | No | `false` | Whether this item is the current page |
| `className` | `string` | No | `''` | Additional CSS classes merged onto the anchor |
| `...rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | No | — | Passthrough attributes spread onto the anchor |

**DOM output**: `<a className="pathable-app-shell__nav-item [active ? 'pathable-app-shell__nav-item--active' : ''] [className]" href="[href]" [aria-current="page" when active]>[children]</a>`

**State transitions**: None. Active state is controlled by the `active` prop, not internally managed.

**Validation rules**:
- `href` must be present — this is a required prop.
- When `active` is `true`, `aria-current="page"` is added to the anchor.
- When `active` is `false`, only the base `pathable-app-shell__nav-item` class is applied.

---

### BottomNavItem (value type)

Represents a single destination in the mobile bottom navigation bar.

**Type definition**:

```typescript
interface BottomNavItem {
  /** Display label for the destination (required). */
  label: string
  /** Icon element to display above the label (required). */
  icon: ReactNode
  /** Navigation target URL (required). */
  href: string
  /** Whether this destination is the active page (optional, default false). */
  active?: boolean
}
```

**Validation rules**:
- Maximum 5 items (per spec FR-008). More than 5 items is a consumer error.
- If the array is empty, no bottom navigation bar is rendered.
- `label`, `icon`, and `href` are all required per item.

---

### Sidebar (region)

A persistent vertical panel visible on desktop (≥ 1024px). It is hidden on
mobile in the default bottom-navigation mode and reused as a horizontally
scrollable navigation row in shared-navigation mode.

**React representation**: Not a standalone component — rendered as part of the AppShell's internal JSX.

**DOM output**: `<aside className="pathable-app-shell__sidebar [sidebarFixed ? 'pathable-app-shell__sidebar--fixed' : '']">`

**Behaviors**:
- Default: `position: sticky` — sidebar stays at top during scroll
- Fixed: `position: fixed` — sidebar remains in place while content scrolls
- Scrolls independently when content overflows the viewport (CSS `overflow-y: auto`)
- Hidden on viewports < 1024px in default bottom-navigation mode
- In shared-navigation mode, navigation stays visible while brand and account regions remain desktop-only

**Regions** (in DOM order):
1. Brand: `<div className="pathable-app-shell__brand">` (optional)
2. Navigation: `<nav className="pathable-app-shell__nav">` (optional)
3. Account: `<div className="pathable-app-shell__account">` (optional)

---

### Mobile Top Bar (region)

A compact horizontal bar visible on mobile (< 1024px) and hidden on desktop.

**DOM output**: `<header className="pathable-app-shell__topbar"><span className="pathable-app-shell__topbar-title">[topBarTitle]</span></header>`

**Behaviors**:
- Hidden on viewports ≥ 1024px (CSS media query)
- Height: ~48px (CSS custom property `--pathable-app-shell-topbar-height`)

---

### Main Content (region)

The primary content area.

**DOM output**: `<main id="[valid normalized mainProps.id or 'main-content']" className="pathable-app-shell__content [contentWidth modifier] [mainProps.className]" [...mainProps]>[children]</main>`

**Behaviors**:
- Max-width: 1024px (standard) or 1280px (wide)
- Full width on mobile (< 1024px)
- Center-aligned with auto margins
- Scrollable (CSS `overflow-y: auto`)
- The ID is trimmed; a missing, empty, non-string, or embedded-whitespace ID
  falls back to `main-content` and serves as the skip-link target
- Native main attributes are consumer-owned except `children` and
  `dangerouslySetInnerHTML`; required Pathable classes are preserved

---

### Global Notification Layer (region)

An optional region for system-level messages.

**DOM output**: `<div className="pathable-app-shell__notification">[notification]</div>` (only when `notification` prop provided)

**Behaviors**:
- Positioned with `z-index: 20` (from styles contract)
- Rendered before the sidebar in DOM order

---

### Skip Link (accessibility)

A skip-to-content link, always rendered as the first focusable element.

**DOM output**: `<a className="pathable-skipnav" href="#[main id]">[skipLinkText]</a>`

**Behaviors**:
- Visually hidden until focused (CSS from `pathable-skipnav`)
- On focus: becomes visible and keyboard-operable
- Targets the main landmark ID and defaults to `#main-content`
- Structurally empty content falls back to `Skip to main content`

## Relationships

```
AppShell (<div class="pathable-app-shell">)
├── SkipLink (<a class="pathable-skipnav" href="#main-content">)
├── Notification (<div class="pathable-app-shell__notification">)    [optional]
├── Sidebar (<aside class="pathable-app-shell__sidebar">)
│   ├── Brand (<div class="pathable-app-shell__brand">)              [optional]
│   ├── Nav (<nav class="pathable-app-shell__nav">)                  [optional]
│   │   └── AppShellNavItem[] (0..n items)
│   └── Account (<div class="pathable-app-shell__account">)          [optional]
├── Topbar (<header class="pathable-app-shell__topbar">)
│   └── Title (<span class="pathable-app-shell__topbar-title">)      [optional]
├── Main (<main id="main-content" class="pathable-app-shell__content">)
│   └── children (ReactNode, required)
└── BottomNav (<nav class="pathable-bottom-navigation">)             [optional]
    └── BottomNavItem[] (0..5 items)
```
