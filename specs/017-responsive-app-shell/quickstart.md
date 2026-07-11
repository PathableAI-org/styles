# Quickstart: Responsive Application Shell

## Installation

The application shell is included in the `@pathable/styles` package. Ensure your project imports the styles:

```scss
// All-in-one import
@use '@pathable/styles/src/pathable-component-wrappers/pathable-all';

// Selective import (app shell + bottom nav)
@use '@pathable/styles/src/pathable-component-wrappers/pathable-app-shell';
```

## Basic Usage

### Desktop Application Shell

```html
<div class="pathable-app-shell">
  <aside class="pathable-app-shell__sidebar">
    <div class="pathable-app-shell__brand">
      <img src="logo.svg" alt="App Name" height="32" />
    </div>
    <nav class="pathable-app-shell__nav">
      <a href="/" class="pathable-app-shell__nav-item pathable-app-shell__nav-item--active" aria-current="page">Home</a>
      <a href="/tasks" class="pathable-app-shell__nav-item">Tasks</a>
      <a href="/settings" class="pathable-app-shell__nav-item">Settings</a>
    </nav>
    <div class="pathable-app-shell__account">
      <span>User Name</span>
    </div>
  </aside>
  <header class="pathable-app-shell__topbar">
    <span class="pathable-app-shell__topbar-title">App Name</span>
  </header>
  <main id="main-content" class="pathable-app-shell__content pathable-app-shell__content--standard">
    <h1>Dashboard</h1>
    <p>Main content goes here.</p>
  </main>
</div>

<!-- Mobile bottom navigation (optional) -->
<nav class="pathable-bottom-navigation" aria-label="Primary">
  <a href="/" class="pathable-bottom-navigation__item pathable-bottom-navigation__item--active" aria-current="page">
    <svg class="pathable-icon" aria-hidden="true" width="20" height="20">
      <use href="#icon-home"></use>
    </svg>
    <span>Home</span>
  </a>
  <a href="/tasks" class="pathable-bottom-navigation__item">
    <svg class="pathable-icon" aria-hidden="true" width="20" height="20">
      <use href="#icon-tasks"></use>
    </svg>
    <span>Tasks</span>
  </a>
  <a href="/settings" class="pathable-bottom-navigation__item">
    <svg class="pathable-icon" aria-hidden="true" width="20" height="20">
      <use href="#icon-settings"></use>
    </svg>
    <span>Settings</span>
  </a>
</nav>

<!-- Skip link (placed before the shell) -->
<a class="pathable-skipnav" href="#main-content">Skip to main content</a>
```

## Key Principles

1. **Framework-neutral**: Pure CSS/SCSS — no JavaScript, routing, or state management.
2. **Responsive by default**: Desktop sidebar at ≥1024px, mobile top-bar + optional bottom nav below 1024px.
3. **Accessible**: Skip link support, logical focus order, visible focus rings, forced-colors mode support.
4. **Customizable via CSS custom properties**: All key dimensions are controlled by `--pathable-app-shell-*` and `--pathable-bottom-navigation-*` properties.

## Common Customizations

```css
:root {
  --pathable-app-shell-sidebar-width: 240px;
  --pathable-app-shell-content-max-width: 1200px;
  --pathable-app-shell-content-max-width--wide: 1440px;
  --pathable-app-shell-topbar-height: 56px;
}
```

## Accessibility Notes

- Add `id="main-content"` to the main content element for skip link targeting
- Use the existing `pathable-skipnav` class (wraps USWDS skipnav) for the skip link
- Mark bottom navigation with `aria-label="Primary"` or equivalent descriptive label
- Provide `aria-label` on icon-only navigation items
- Active navigation items should use `aria-current="page"` for screen reader support

## Storybook

Check the Storybook stories for interactive examples:
- Desktop shell with sidebar and navigation
- Mobile shell with top bar and bottom navigation
- Short and long navigation label variants