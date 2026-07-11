# Contracts: Responsive Application Shell Pattern

## Overview

This document describes the framework-neutral SCSS/CSS interface contracts for the responsive application shell. These contracts define how consuming applications use the shell regions in their HTML markup.

## CSS Class API

### Application Shell Layout

```html
<div class="pathable-app-shell">
  <!-- Sidebar (desktop only) -->
  <aside class="pathable-app-shell__sidebar">
    <div class="pathable-app-shell__brand">...</div>
    <nav class="pathable-app-shell__nav">
      <a href="/dashboard" class="pathable-app-shell__nav-item pathable-app-shell__nav-item--active" aria-current="page">Dashboard</a>
      <a href="/reports" class="pathable-app-shell__nav-item">Reports</a>
    </nav>
    <div class="pathable-app-shell__account">...</div>
  </aside>

  <!-- Mobile top bar (mobile only) -->
  <header class="pathable-app-shell__topbar">
    <span class="pathable-app-shell__topbar-title">App Name</span>
  </header>

  <!-- Main content -->
  <main id="main-content" class="pathable-app-shell__content pathable-app-shell__content--standard">
    ...
  </main>
</div>

<!-- Mobile bottom navigation (optional, mobile only) -->
<nav class="pathable-bottom-navigation" aria-label="Primary">
  <a href="/dashboard" class="pathable-bottom-navigation__item pathable-bottom-navigation__item--active" aria-current="page">
    <svg class="pathable-icon" aria-hidden="true">...</svg>
    <span>Dashboard</span>
  </a>
  <a href="/tasks" class="pathable-bottom-navigation__item">
    <svg class="pathable-icon" aria-hidden="true">...</svg>
    <span>Tasks</span>
  </a>
  <a href="/settings" class="pathable-bottom-navigation__item">
    <svg class="pathable-icon" aria-hidden="true">...</svg>
    <span>Settings</span>
  </a>
</nav>
```

### Shell Elements

| Class | Element | Required | Description |
|-------|---------|----------|-------------|
| `.pathable-app-shell` | Container | Yes | Top-level shell wrapper |
| `.pathable-app-shell__sidebar` | `<aside>` | Yes | Desktop sidebar panel |
| `.pathable-app-shell__brand` | `<div>` | No | Brand lockup region |
| `.pathable-app-shell__nav` | `<nav>` | No | Primary navigation list |
| `.pathable-app-shell__nav-item` | `<a>` | No | Individual navigation link |
| `.pathable-app-shell__nav-item--active` | modifier | No | Active navigation state |
| `.pathable-app-shell__account` | `<div>` | No | Account/organization context |
| `.pathable-app-shell__topbar` | `<header>` | No | Mobile top bar (required if mobile) |
| `.pathable-app-shell__topbar-title` | `<span>` | No | Top bar title |
| `.pathable-app-shell__content` | `<main>` | Yes | Main content region, skip link target (`id="main-content"`) |
| `.pathable-app-shell__content--standard` | modifier | No | Standard max-width (1024px) |
| `.pathable-app-shell__content--wide` | modifier | No | Wide max-width (1280px) |
| `.pathable-app-shell__notification` | `<div>` | No | Global notification/status layer |

### Bottom Navigation Elements

| Class | Element | Required | Description |
|-------|---------|----------|-------------|
| `.pathable-bottom-navigation` | `<nav>` | Yes | Bottom navigation bar container |
| `.pathable-bottom-navigation__item` | `<a>` or `<button>` | Yes | Individual nav destination |
| `.pathable-bottom-navigation__item--active` | modifier | No | Active destination |

### Modifier Classes

| Modifier | Target | Effect |
|----------|--------|--------|
| `.pathable-app-shell__sidebar--fixed` | `__sidebar` | Makes sidebar `position: fixed` instead of `sticky` |
| `.pathable-app-shell__content--standard` | `__content` | Applies standard max-width (default) |
| `.pathable-app-shell__content--wide` | `__content` | Applies wide max-width |

## CSS Custom Properties

### Shell Layout

| Property | Default | Description |
|----------|---------|-------------|
| `--pathable-app-shell-sidebar-width` | `280px` | Sidebar width on desktop |
| `--pathable-app-shell-topbar-height` | `48px` | Mobile top bar height |
| `--pathable-app-shell-content-max-width` | `1024px` | Standard content max-width |
| `--pathable-app-shell-content-max-width--wide` | `1280px` | Wide content max-width |
| `--pathable-app-shell-content-padding` | `var(--space-24)` | Content area horizontal padding |
| `--pathable-app-shell-sidebar-gap` | `var(--space-8)` | Gap between sidebar regions (brand, nav, account) |
| `--pathable-app-shell-sidebar-padding` | `var(--space-16)` | Sidebar inner padding |
| `--pathable-app-shell-nav-item-padding-x` | `var(--space-12)` | Navigation item horizontal padding |
| `--pathable-app-shell-nav-item-padding-y` | `var(--space-8)` | Navigation item vertical padding |
| `--pathable-app-shell-nav-item-indicator-width` | `3px` | Active indicator inset border width |
| `--pathable-app-shell-nav-item-radius` | `var(--radius-sm)` | Navigation item border radius |

### Bottom Navigation

| Property | Default | Description |
|----------|---------|-------------|
| `--pathable-bottom-navigation-bg` | `var(--pathable-color-surface)` | Bottom nav background |
| `--pathable-bottom-navigation-safe-area` | `env(safe-area-inset-bottom, 0px)` | Safe area padding |
| `--pathable-bottom-navigation-item-gap` | `var(--space-4)` | Gap between icon and label |
| `--pathable-bottom-navigation-active-color` | `var(--pathable-color-accent)` | Active item color |
| `--pathable-bottom-navigation-active-indicator-width` | `3px` | Active indicator bar width |

## Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Skip link targets main content | Consumer adds `id="main-content"` to `__content` element; shell documentation directs use of existing `pathable-skipnav` |
| Focus order follows DOM order | Desktop: sidebar (brand → nav → account) → content; Mobile: top bar → content → bottom nav |
| Fixed regions don't obscure focused content, dialogs, or toasts | All fixed/sticky regions use appropriate `z-index`; overlays use higher `z-index` values |
| Visible focus on navigation items | Each `__nav-item` has `:focus-visible` outline using `var(--pathable-color-focus-ring)` |
| Active state uses color + additional cue | Sidebar: inset left border + font-weight; Bottom nav: top border/background + font-weight |
| Forced-colors mode | `@media (forced-colors: active)` blocks preserve boundaries and active indicators |
| Icon-only items have accessible names | Consumer responsibility via `aria-label`; documented in usage guidance |
| Bottom nav uses `<nav>` with `aria-label` | Consumer adds `aria-label="Primary"` or equivalent |

## Consumption Patterns

### Selective Import

```scss
// Import only the app shell layout (no bottom navigation)
@use 'packages/styles/src/pathable-component-wrappers/pathable-app-shell';
```

### Bundle Import

```scss
// Import all navigation patterns including shell
@use 'packages/styles/src/pathable-component-wrappers/pathable-navigation';
```

### All-in-one Import

```scss
// Import everything
@use 'packages/styles/src/pathable-component-wrappers/pathable-all';
```