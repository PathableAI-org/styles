# Component API Contract: React Desktop Shell Wrapper

**Feature**: 035-react-desktop-shell-wrapper
**Date**: 2026-08-13

## AppShell

### Interface

```typescript
import { HTMLAttributes, ReactNode } from 'react'

interface BottomNavItem {
  label: string
  icon: ReactNode
  href: string
  active?: boolean
}

type ContentWidth = 'standard' | 'wide'
type MobileNavigation = 'bottom' | 'shared'

interface AppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Main content rendered inside the shell's content area (required). */
  children: ReactNode

  /** Brand content displayed at the top of the sidebar. */
  sidebarBrand?: ReactNode

  /** Navigation content (typically AppShellNavItem elements) rendered in the sidebar nav region. */
  sidebarNav?: ReactNode

  /** Account or organization context displayed at the bottom of the sidebar. */
  sidebarAccount?: ReactNode

  /** When true, the sidebar uses fixed positioning instead of sticky. Default: false. */
  sidebarFixed?: boolean

  /** Title displayed in the mobile top bar. Visible only on viewports < 1024px. */
  topBarTitle?: string

  /** Destinations for the mobile bottom navigation bar. Maximum 5 items. */
  bottomNavItems?: BottomNavItem[]

  /** Content area max-width. Default: 'standard' (1024px). 'wide' = 1280px. */
  contentWidth?: ContentWidth

  /** Content for the global notification or status layer. */
  notification?: ReactNode

  /** Native attributes applied to the main landmark. */
  mainProps?: Omit<
    HTMLAttributes<HTMLElement>,
    'children' | 'dangerouslySetInnerHTML'
  >

  /** Accessible navigation landmark name. Default: 'Primary'. */
  navigationLabel?: string

  /** Consumer-localizable skip-link content. Default: 'Skip to main content'. */
  skipLinkText?: ReactNode

  /** Mobile navigation strategy. Default: 'bottom'. */
  mobileNavigation?: MobileNavigation
}
```

### Props Detail

| Prop | Type | Required | Default | Maps to |
|---|---|---|---|---|
| `children` | `ReactNode` | **Yes** | — | `<main id="main-content" className="pathable-app-shell__content ...">` |
| `sidebarBrand` | `ReactNode` | No | — | `<div className="pathable-app-shell__brand">` (omitted if empty) |
| `sidebarNav` | `ReactNode` | No | — | `<nav className="pathable-app-shell__nav">` (omitted if empty) |
| `sidebarAccount` | `ReactNode` | No | — | `<div className="pathable-app-shell__account">` (omitted if empty) |
| `sidebarFixed` | `boolean` | No | `false` | Adds `pathable-app-shell__sidebar--fixed` modifier |
| `topBarTitle` | `string` | No | — | `<span className="pathable-app-shell__topbar-title">` (renders empty span if undefined) |
| `bottomNavItems` | `BottomNavItem[]` | No | — | `<nav className="pathable-bottom-navigation">` (omitted if empty/undefined) |
| `contentWidth` | `'standard' \| 'wide'` | No | `'standard'` | `pathable-app-shell__content--standard` or `--wide` |
| `notification` | `ReactNode` | No | — | `<div className="pathable-app-shell__notification">` (omitted if empty) |
| `mainProps` | `Omit<HTMLAttributes<HTMLElement>, 'children' \| 'dangerouslySetInnerHTML'>` | No | — | Native main attributes; class names merge and a valid normalized ID controls the skip target |
| `navigationLabel` | `string` | No | `'Primary'` | Accessible name for navigation landmarks |
| `skipLinkText` | `ReactNode` | No | `'Skip to main content'` | Skip-link content; empty values use the default |
| `mobileNavigation` | `'bottom' \| 'shared'` | No | `'bottom'` | Compact bottom items or shared sidebar navigation on mobile |
| `className` | `string` | No | `''` | Merged onto the root `<div className="pathable-app-shell">` |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | No | — | Spread onto the root div |

### Expected DOM Output

```html
<div class="pathable-app-shell">
  <a class="pathable-skipnav" href="#main-content">Skip to main content</a>
  <!-- notification (optional) -->
  <div class="pathable-app-shell__notification">...</div>
  <!-- sidebar (hidden on mobile) -->
  <aside class="pathable-app-shell__sidebar [pathable-app-shell__sidebar--fixed]">
    <div class="pathable-app-shell__brand">...</div>
    <nav class="pathable-app-shell__nav" aria-label="Primary">...</nav>
    <div class="pathable-app-shell__account">...</div>
  </aside>
  <!-- topbar (hidden on desktop) -->
  <header class="pathable-app-shell__topbar">
    <span class="pathable-app-shell__topbar-title">...</span>
  </header>
  <!-- main content (required) -->
  <main id="main-content" class="pathable-app-shell__content [pathable-app-shell__content--standard|--wide]">
    ...
  </main>
  <!-- bottom navigation (hidden on desktop, optional) -->
  <nav class="pathable-bottom-navigation" aria-label="Primary">
    <a class="pathable-bottom-navigation__item [--active]" href="..." [aria-current="page"]>
      <svg class="pathable-icon" aria-hidden="true">...</svg>
      <span>...</span>
    </a>
  </nav>
</div>
```

With `mobileNavigation="shared"`, the root also receives
`pathable-app-shell--shared-navigation`. The sidebar navigation remains the one
navigation landmark at all breakpoints; `bottomNavItems` is not rendered. Below
1024px, CSS presents all sidebar destinations in a horizontally scrollable row
and hides sidebar brand and account regions.

### Empty State Behavior

| Prop | When empty/undefined | Result |
|---|---|---|
| `sidebarBrand` | No `<div className="pathable-app-shell__brand">` rendered |
| `sidebarNav` | No `<nav className="pathable-app-shell__nav">` rendered |
| `sidebarAccount` | No `<div className="pathable-app-shell__account">` rendered |
| `bottomNavItems` | No `<nav className="pathable-bottom-navigation">` rendered |
| `notification` | No `<div className="pathable-app-shell__notification">` rendered |
| `topBarTitle` | `<span className="pathable-app-shell__topbar-title">` renders empty |

---

## AppShellNavItem

### Interface

```typescript
import { AnchorHTMLAttributes, ReactNode } from 'react'

interface AppShellNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Link content (text label, icon + text, etc.) (required). */
  children: ReactNode

  /** Navigation target URL (required). */
  href: string

  /** Whether this item represents the current page. Default: false. */
  active?: boolean
}
```

### Props Detail

| Prop | Type | Required | Default | Maps to |
|---|---|---|---|---|
| `children` | `ReactNode` | **Yes** | — | Rendered inside the anchor element |
| `href` | `string` | **Yes** | — | `href` attribute on the anchor |
| `active` | `boolean` | No | `false` | When `true`: adds `pathable-app-shell__nav-item--active` and `aria-current="page"` |
| `className` | `string` | No | `''` | Merged with the base `pathable-app-shell__nav-item` class |
| `...rest` | `AnchorHTMLAttributes` | No | — | Spread onto the anchor element |

### Expected DOM Output

```html
<!-- Non-active item -->
<a class="pathable-app-shell__nav-item" href="/home">Home</a>

<!-- Active item -->
<a class="pathable-app-shell__nav-item pathable-app-shell__nav-item--active" href="/home" aria-current="page">Home</a>

<!-- With additional className -->
<a class="pathable-app-shell__nav-item pathable-app-shell__nav-item--active custom-class" href="/home" aria-current="page">Home</a>
```

---

## BottomNavItem

### Type Definition

```typescript
interface BottomNavItem {
  /** Display label for the navigation destination (required). */
  label: string

  /** Icon element to display above the label (required). Use an SVG with className="pathable-icon". */
  icon: ReactNode

  /** Navigation target URL (required). */
  href: string

  /** Whether this destination is the current page (optional). Default: false. */
  active?: boolean
}
```

### Expected DOM Output (per item)

```html
<!-- Non-active -->
<a class="pathable-bottom-navigation__item" href="/home">
  <svg class="pathable-icon" aria-hidden="true">...</svg>
  <span>Home</span>
</a>

<!-- Active -->
<a class="pathable-bottom-navigation__item pathable-bottom-navigation__item--active" href="/home" aria-current="page">
  <svg class="pathable-icon" aria-hidden="true">...</svg>
  <span>Home</span>
</a>
```
