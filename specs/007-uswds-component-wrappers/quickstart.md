# Quickstart: USWDS Component Wrappers

## Overview

The `@pathable/styles` package provides `.pathable-*` CSS class wrappers for every USWDS component, organized into a package system mirroring USWDS conventions. Each `.pathable-{component}` class resolves to the same computed styles as the corresponding `.usa-{component}` class.

## Installation

```bash
pnpm add @pathable/styles
```

## Import Usage

### All Component Wrappers

```scss
// Import ALL pathable component wrappers
@forward '@pathable/styles/src/pathable-component-wrappers';

// Or from compiled CSS
@import '@pathable/styles/dist/styles.css';
```

### Individual Component Wrappers

Import only the components your project needs:

```scss
// Import only button and alert wrappers
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-button';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-alert';
```

### Bundle Packages

Import groups of related components:

```scss
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-form-controls';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-navigation';
```

Available bundles:

| Bundle | Included Components |
|--------|-------------------|
| `pathable-form-controls` | character-count, checkbox, combo-box, date-picker, date-range-picker, error-message, fieldset, file-input, form, form-group, hint, input, input-mask, input-prefix-suffix, label, legend, memorable-date, radio, range, select, textarea, time-picker, validation |
| `pathable-typography` | link, list, prose (plus style-only deps: content, dark-background, display, intro, paragraph) |
| `pathable-navigation` | breadcrumb, header, in-page-navigation, nav, pagination, search, sidenav, skipnav |
| `pathable-layout` | embed-container, layout-grid, media-block, section (plus style-only dep: layout-docs) |
| `pathable-communication` | accordion, alert, banner, card, collection, graphic-list, hero, icon, icon-list, identifier, modal, process-list, site-alert, step-indicator, summary-box, table, tag, tooltip |
| `pathable-all` | All individual component wrappers + all bundles |

## HTML Usage

### Non-JS Components (replace `.usa-*` with `.pathable-*`)

```html
<!-- Button -->
<button class="pathable-button">Submit</button>
<button class="pathable-button pathable-button--outline">Cancel</button>
<button class="pathable-button pathable-button--big">Big Button</button>

<!-- Alert -->
<div class="pathable-alert pathable-alert--info" role="alert">
  <div class="pathable-alert__body">
    <p class="pathable-alert__text">This is an informational alert.</p>
  </div>
</div>

<!-- Card -->
<div class="pathable-card">
  <div class="pathable-card__container">
    <header class="pathable-card__header">
      <h2 class="pathable-card__heading">Card Title</h2>
    </header>
    <div class="pathable-card__body">
      <p>Card content here.</p>
    </div>
    <div class="pathable-card__footer">
      <a class="pathable-button" href="#">Action</a>
    </div>
  </div>
</div>

<!-- Table -->
<table class="pathable-table pathable-table--borderless">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Item 1</td>
      <td>$100</td>
    </tr>
  </tbody>
</table>

<!-- Tag -->
<span class="pathable-tag">New</span>

<!-- Breadcrumb -->
<nav class="pathable-breadcrumb" aria-label="Breadcrumbs">
  <ol class="pathable-breadcrumb__list">
    <li class="pathable-breadcrumb__item">
      <a class="pathable-breadcrumb__link" href="/">Home</a>
    </li>
    <li class="pathable-breadcrumb__item">
      <span class="pathable-breadcrumb__link pathable-breadcrumb__link--current">Current Page</span>
    </li>
  </ol>
</nav>

<!-- Link -->
<a class="pathable-link pathable-link--external" href="https://example.com" target="_blank">External Link</a>

<!-- Footer -->
<footer class="pathable-footer">
  <div class="pathable-footer__primary-section">
    <div class="pathable-footer__primary-content">
      <!-- footer content -->
    </div>
  </div>
  <div class="pathable-footer__secondary-section">
    <div class="pathable-footer__secondary-content">
      &copy; 2026 PathAble AI
    </div>
  </div>
</footer>
```

### JS-Driven Components (keep `.usa-*` + add `.pathable-*`)

For components where USWDS JavaScript queries DOM elements by `.usa-*` class name, apply BOTH classes:

```html
<!-- Accordion: JS selects .usa-accordion__button -->
<div class="usa-accordion pathable-accordion">
  <h3 class="usa-accordion__heading pathable-accordion__heading">
    <button class="usa-accordion__button pathable-accordion__button"
            aria-expanded="false"
            aria-controls="section1">
      Section 1
    </button>
  </h3>
  <div id="section1" class="usa-accordion__content pathable-accordion__content">
    <p>Content</p>
  </div>
</div>

<!-- Banner -->
<section class="usa-banner pathable-banner" aria-label="Official government website">
  <!-- JS-driven, keep both classes -->
</section>
```

**Components requiring `.usa-*` retention:**

| Component | CSS Class(es) to Keep |
|-----------|----------------------|
| Accordion | `.usa-accordion`, `.usa-accordion__button` |
| Banner | `.usa-banner`, `.usa-banner__button` |
| Combo Box | `.usa-combo-box` |
| Date Picker | `.usa-date-picker` |
| Date Range Picker | `.usa-date-range-picker` |
| File Input | `.usa-file-input` |
| Header | `.usa-header`, `.usa-nav`, `.usa-nav__link` |
| In-Page Navigation | `.usa-in-page-nav` |
| Input Mask | `.usa-input-mask` |
| Modal | `.usa-modal`, `.usa-modal__close` |
| Site Alert | `.usa-site-alert` |
| Time Picker | `.usa-time-picker` |
| Tooltip | `.usa-tooltip` |
| Validation | `.usa-validation` |

## CSS Custom Properties

Component-level styling values are available as dual-named CSS custom properties:

```css
.element {
  border-radius: var(--pathable-button-border-radius);
  /* Also available as: */
  border-radius: var(--usa-button-border-radius);
}
```

## Component-to-Class Mapping Reference

| Component | Main Class | Modifier Classes |
|-----------|-----------|-----------------|
| accordion | `.pathable-accordion` | (bordered, multiselectable) |
| alert | `.pathable-alert` | `--info`, `--warning`, `--error`, `--success`, `--emergency`, `--slim` |
| banner | `.pathable-banner` | — |
| breadcrumb | `.pathable-breadcrumb` | — |
| button | `.pathable-button` | `--accent-cool`, `--accent-warm`, `--outline`, `--inverse`, `--base`, `--secondary`, `--big`, `--unstyled` |
| button-group | `.pathable-button-group` | — |
| card | `.pathable-card` | `--flag`, `--header-first` |
| card sections | `.pathable-card__container`, `.pathable-card__header`, `.pathable-card__body`, `.pathable-card__footer`, `.pathable-card__heading`, `.pathable-card__media`, `.pathable-card__media-exdent` | — |
| checkbox | `.pathable-checkbox` | — |
| collection | `.pathable-collection` | — |
| combo-box | `.pathable-combo-box` | — |
| date-picker | `.pathable-date-picker` | — |
| footer | `.pathable-footer` | `--slim` |
| footer sections | `.pathable-footer__primary-section`, `.pathable-footer__secondary-section`, `.pathable-footer__nav`, `.pathable-footer__return-to-top` | — |
| form | `.pathable-form` | — |
| header | `.pathable-header` | `--basic`, `--extended`, `--megamenu` |
| icon | `.pathable-icon` | — |
| identifier | `.pathable-identifier` | — |
| identifier sections | `.pathable-identifier__section`, `.pathable-identifier__container`, `.pathable-identifier__logos`, `.pathable-identifier__logo`, `.pathable-identifier__identity`, `.pathable-identifier__required-links`, `.pathable-identifier__required-links-list`, `.pathable-identifier__usagov`, `.pathable-identifier__metadata` | — |
| input | `.pathable-input` | — |
| layout-grid | `.pathable-grid-container`, `.pathable-grid-row`, `.pathable-grid-col-*`, `.pathable-grid-gap` | — |
| link | `.pathable-link` | `--external`, `--alt` |
| list | `.pathable-list` | — |
| media-block | `.pathable-media-block`, `.pathable-media-block__img`, `.pathable-media-block__body` | — |
| modal | `.pathable-modal` | — |
| nav | `.pathable-nav` | — |
| pagination | `.pathable-pagination` | — |
| process-list | `.pathable-process-list` | — |
| prose | `.pathable-prose` | — |
| radio | `.pathable-radio` | — |
| search | `.pathable-search` | `--big`, `--small` |
| sidenav | `.pathable-sidenav` | — |
| site-alert | `.pathable-site-alert` | `--info`, `--warning`, `--emergency`, `--slim` |
| skipnav | `.pathable-skipnav` | — |
| step-indicator | `.pathable-step-indicator` | — |
| summary-box | `.pathable-summary-box` | — |
| table | `.pathable-table` | `--borderless`, `--compact`, `--striped` |
| tag | `.pathable-tag` | `--big` |
| textarea | `.pathable-textarea` | — |
| tooltip | `.pathable-tooltip` | — |
| validation | `.pathable-validation` | — |

## Docs Site Refactoring Guide

### Step 1: Identify `.usa-*` class references

Search the docs site for `.usa-*` classes in Astro templates and CSS:

```bash
rg '\.usa-' apps/docs/src/
```

### Step 2: Classify each reference

- **Non-JS component**: Replace `.usa-{component}` with `.pathable-{component}`
- **JS-driven component**: Add `.pathable-{component}` alongside existing `.usa-{component}`
- **Utility class**: Use `.pathable-*` utility classes from the utility wrapper system (spec 006)
- **USWDS modifier selector**: Replace `.usa-{class}--{modifier}` with `.pathable-{class}--{modifier}`

### Step 3: Verify output

After refactoring, verify:

1. No remaining `.usa-` class references (except JS-driven components where both are needed)
2. Compiled CSS includes both `.pathable-*` and `.usa-*` classes
3. Visual regression check — docs pages render identically before and after

## Verifying Component Wrappers

Check that wrappers are working by inspecting the compiled CSS:

```bash
# Check that .pathable-button exists and resolves to same rules as .usa-button
rg '\.pathable-button,' packages/styles/dist/styles.css | head -5
rg '\.pathable-accordion,' packages/styles/dist/styles.css | head -5
```