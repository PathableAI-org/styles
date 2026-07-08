# SCSS Interface Contract: Component Wrapper Package System

## Purpose

This document defines the public SCSS interface for the PathAble component wrapper package system. It describes how component wrappers are structured, how packages are imported, and what consumers can expect from the compiled output.

## 1. Component Wrapper File Format

Each component wrapper is a SCSS partial in `packages/styles/src/pathable-component-wrappers/` following this pattern:

```scss
// packages/styles/src/pathable-component-wrappers/pathable-button.scss
//
// Wraps usa-button component as pathable-button.
// USWDS dependency: uswds-fonts
// JS-driven: No
// Requires .usa-* on DOM: No

@use 'uswds-core' as *;

// Forward the USWDS component source to compile its classes
@forward 'usa-button/src/styles';

// Extend each .usa-* class into a .pathable-* equivalent
.pathable-button {
  @extend .usa-button;
}

.pathable-button--accent-cool {
  @extend .usa-button--accent-cool;
}

.pathable-button--accent-warm {
  @extend .usa-button--accent-warm;
}

.pathable-button--outline {
  @extend .usa-button--outline;
}

.pathable-button--inverse {
  @extend .usa-button--inverse;
}

.pathable-button--base {
  @extend .usa-button--base;
}

.pathable-button--secondary {
  @extend .usa-button--secondary;
}

.pathable-button--big {
  @extend .usa-button--big;
}

.pathable-button--unstyled {
  @extend .usa-button--unstyled;
}
```

### File Naming Convention

- Individual component wrapper: `pathable-{component-name}.scss` (e.g., `pathable-accordion.scss`, `pathable-footer.scss`)
- Bundle packages: `pathable-{bundle-name}.scss` (e.g., `pathable-form-controls.scss`)
- All-in-one entry: `pathable-all.scss`
- Index entry: `_index.scss`

## 2. Component Wrapper Template

The standard template for a component wrapper file:

```scss
// packages/styles/src/pathable-component-wrappers/pathable-{name}.scss
//
// Wraps {uswds-package} component as pathable-{name}.
// USWDS dependencies: {deps}
// JS-driven: {yes/no}
// Requires .usa-* on DOM: {yes/no}

@use 'uswds-core' as *;

// Forward dependencies
{dependency-forwards}

// Forward source
@forward '{uswds-package}/src/styles';
```

Followed by `@extend` statements for each `.usa-{class}` → `.pathable-{class}` mapping.

### For JS-Driven Components

For components that require `.usa-*` retention on the DOM, the wrapper file includes a comment noting the requirement:

```scss
// packages/styles/src/pathable-component-wrappers/pathable-accordion.scss
//
// Wraps usa-accordion component as pathable-accordion.
// USWDS dependencies: uswds-fonts, usa-icon
// JS-driven: Yes — accordion JS selects .usa-accordion__button
// Requires .usa-* on DOM: Yes — keep .usa-accordion for JS to find elements

@use 'uswds-core' as *;

@forward 'uswds-fonts';
@forward 'usa-icon';
@forward 'usa-accordion/src/styles';

.pathable-accordion {
  @extend .usa-accordion;
}

.pathable-accordion__heading {
  @extend .usa-accordion__heading;
}

.pathable-accordion__button {
  @extend .usa-accordion__button;
}

.pathable-accordion__content {
  @extend .usa-accordion__content;
}
```

## 3. Package Entry Points

### Individual Component Import

Consumers import individual wrappers directly from the wrappers directory:

```scss
// Import just button and alert
@forward 'pathable-component-wrappers/pathable-button';
@forward 'pathable-component-wrappers/pathable-alert';
```

These are forwarded from `index.scss`:

```scss
// packages/styles/src/index.scss
// ... existing forwards ...
// Component wrappers (individual imports can be done directly from consumers)
// @forward 'pathable-component-wrappers/pathable-button';
// @forward 'pathable-component-wrappers/pathable-alert';
```

### Bundle Package Import

```scss
// Import all form controls
@forward 'pathable-component-wrappers/pathable-form-controls';

// Import all navigation components
@forward 'pathable-component-wrappers/pathable-navigation';
```

### All-In-One Import

```scss
// Import ALL component wrappers
@forward 'pathable-component-wrappers';
// Or explicitly:
@forward 'pathable-component-wrappers/pathable-all';
```

## 4. Bundle Package Structure

Each bundle package file forwards multiple individual wrappers:

```scss
// pathable-form-controls.scss
@forward 'pathable-character-count';
@forward 'pathable-checkbox';
@forward 'pathable-combo-box';
@forward 'pathable-date-picker';
@forward 'pathable-date-range-picker';
// ... etc
```

## 5. Shared Dependency Deduplication

SCSS `@forward` deduplication handles shared dependencies. For example:

- `pathable-accordion.scss` forwards `uswds-fonts` and `usa-icon`
- `pathable-alert.scss` also forwards `uswds-fonts` and `usa-icon`
- When both are imported together (e.g., via `pathable-communication.scss`), SCSS includes `uswds-fonts` and `usa-icon` only once

This is automatic thanks to Dart Sass module system — `@forward` in a dependency is only resolved once regardless of how many times the dependency is referenced from different entry points.

## 6. Guaranteed Public API

The compiled CSS guarantees:

1. **Component classes**: `.pathable-{component}` for every wrapped component, resolving to the same styles as `.usa-{component}`
2. **Modifier variants**: `.pathable-{component}--{modifier}` for each USWDS modifier class (e.g., `.pathable-button--outline`, `.pathable-card--flag`)
3. **Element sub-classes**: `.pathable-{component}__{element}` for each USWDS child element class (e.g., `.pathable-card__header`, `.pathable-card__body`, `.pathable-card__footer`)
4. **Dual CSS custom properties**: `--pathable-{component}-{property}` and `--usa-{component}-{property}` for component-level styling values

## 7. JS Boundary

Components rendered with `.pathable-*` classes will have the same CSS appearance as `.usa-*` but USWDS JavaScript may not function if it selects DOM nodes by `.usa-*` class names. To ensure JS interactivity for these components, apply both classes:

```html
<!-- JS-driven component: both classes needed -->
<div class="usa-accordion pathable-accordion">
  <h3 class="usa-accordion__heading pathable-accordion__heading">
    <button class="usa-accordion__button pathable-accordion__button">Section 1</button>
  </h3>
  <div class="usa-accordion__content pathable-accordion__content">
    <p>Content here</p>
  </div>
</div>
```

## 8. Excluded Packages

The following USWDS packages are forwarded as infrastructure dependencies but have NO `.pathable-*` class wrappers:

| Package | Reason |
|---------|--------|
| `uswds-core` | Functions, mixins, tokens — no CSS classes output |
| `uswds-elements` | Base element styles (h1-h6, body, etc.) — no `.usa-` classes |
| `uswds-fonts` | Font face `@font-face` declarations — no `.usa-` classes |
| `uswds-helpers` | Utility helpers — covered by utility wrappers (006) |
| `uswds-utilities` | Utility generator — covered by utility wrappers (006) |
| `usa-content` | Forwarded via typography but no direct `.usa-` class |
| `usa-dark-background` | Forwarded via typography but no direct `.usa-` class |
| `usa-display` | Forwarded via typography but no direct `.usa-` class |
| `usa-intro` | Forwarded via typography but no direct `.usa-` class |
| `usa-layout-docs` | Forwarded via layout bundle but no direct `.usa-` class |
| `usa-paragraph` | Forwarded via typography but no direct `.usa-` class |
| `usa-section` | Has `.usa-section` — wrapped in `pathable-section.scss` |
| `usa-site-title` | Minimal styles — wrapped in `pathable-site-title.scss` |

## 9. Consumer Contract

Consumers of the compiled CSS (not SCSS) get:

- A single `dist/styles.css` file containing all imported component wrappers
- The ability to import via SCSS `@forward` for tree-shaken builds
- Guaranteed style parity with USWDS `.usa-*` components
- Dual-named CSS custom properties for component-level customization
- No runtime JavaScript requirement for CSS rendering