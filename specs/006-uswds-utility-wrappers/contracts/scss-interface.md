# SCSS Interface Contract: Utility Wrappers

**Branch**: `006-uswds-utility-wrappers` | **Date**: 2026-07-07

## Purpose

Define the SCSS interface contract for `_utilities.scss`, the partial that generates `.pathable-*` utility classes and dual `--pathable-*` / `--usa-*` CSS custom properties from the PathAble USWDS theme configuration.

## Source Location

`packages/styles/src/_utilities.scss`

## Dependency Chain

```
_uswds-theme.scss  (USWDS theme config — provides color, spacing, font token values)
       │
       ▼
uswds-core         (USWDS SCSS functions — color(), units(), get-font-stack())
       │
       ▼
_utilities.scss    (NEW — generates utility classes + dual CSS custom properties)
       │
       ▼
index.scss         (entrypoint — forwards _utilities.scss)
       │
       ▼
dist/styles.css    (compiled output)
```

## Public API

### CSS Utility Classes

All utility classes are prefixed with `.pathable-`. Each class sets exactly one CSS property to a single value.

**Base pattern**: `.pathable-{module-base}-{value-name}`

**Responsive pattern**: `.{breakpoint}\:pathable-{module-base}-{value-name}`

**State pattern**: `.{state}\:pathable-{module-base}-{value-name}`

**Example output**:

```css
.pathable-bg-primary {
  background-color: #00365c;
}

.tablet\:pathable-padding-2 {
  @media (min-width: 640px) {
    padding: 1rem;
  }
}

.hover\:pathable-text-base:hover {
  color: #dde2e8;
}
```

### CSS Custom Properties

Each utility value token is emitted as both `--pathable-*` and `--usa-*`:

```css
:root {
  --pathable-bg-primary: #00365c;
  --usa-bg-primary: #00365c;
  --pathable-padding-1: 0.5rem;
  --usa-padding-1: 0.5rem;
}
```

### Guaranteed Modules

The following utility modules MUST be available:

| Module | Class Pattern | CSS Property |
| -------- | -------------- | -------------- |
| background-color | `.pathable-bg-{value}` | `background-color` |
| color | `.pathable-text-{value}` | `color` |
| padding | `.pathable-padding-{n}` | `padding` |
| padding-horizontal | `.pathable-padding-x-{n}` | `padding-left` + `padding-right` |
| padding-vertical | `.pathable-padding-y-{n}` | `padding-top` + `padding-bottom` |
| margin | `.pathable-margin-{n}` | `margin` |
| margin-horizontal | `.pathable-margin-x-{n}` | `margin-left` + `margin-right` |
| margin-vertical | `.pathable-margin-y-{n}` | `margin-top` + `margin-bottom` |
| margin-top | `.pathable-margin-top-{n}` | `margin-top` |
| margin-bottom | `.pathable-margin-bottom-{n}` | `margin-bottom` |
| display | `.pathable-display-{value}` | `display` |
| font-family | `.pathable-font-family-{role}` | `font-family` |
| font-weight | `.pathable-text-{weight}` | `font-weight` |
| border | `.pathable-border-{n}` | `border` |
| border-radius | `.pathable-border-radius-{value}` | `border-radius` |
| flex | `.pathable-flex-{n}` | `flex` |
| align-items | `.pathable-flex-align-{value}` | `align-items` |
| justify-content | `.pathable-flex-justify-{value}` | `justify-content` |
| width | `.pathable-width-{value}` | `width` |
| max-width | `.pathable-maxw-{value}` | `max-width` |
| text-align | `.pathable-text-{alignment}` | `text-align` |

## Configuration Map Pattern

Each utility module is defined as an entry in a SCSS configuration map. The pattern follows:

```scss
$pathable-utilities: (
  'bg': (
    'class': 'pathable-bg',
    'property': 'background-color',
    'values': (
      'primary': uswds.color('blue-warm-80v'),
      'base': uswds.color('gray-cool-10'),
      'surface': uswds.color('white'),
      'transparent': transparent,
    ),
    'responsive': false,
    'state': ('hover', 'focus'),
  ),
  // ... more modules
);
```

## Generation Loop Contract

The SCSS loop that processes the configuration map MUST:

1. For each module entry, extract `class`, `property`, `values`, `responsive`, and `state` keys
2. For each value, generate the base class: `.#{$class}-#{$value-name} { #{$property}: #{$value}; }`
3. If `responsive` is true AND `$theme-utility-breakpoints` enables breakpoints, wrap base class in `@media (min-width: ...)` with breakpoint prefix in the class name
4. If `state` is non-empty, generate `.#{$state}\:#{$class}-#{$value-name}:#{$state} { ... }`
5. Generate `--pathable-#{$value-name}: #{$value}` and `--usa-#{$value-name}: #{$value}` in `:root`

## Constraints

- MUST NOT import USWDS utility modules directly (avoids duplicating full USWDS utility output)
- MUST NOT generate classes for tokens set to `false` in the theme config
- MUST respect `$utilities-use-important` setting (default: `false`)
- MUST forward from `index.scss` before any semantic token partials but after `_uswds-theme.scss`
- All USWDS function calls (color, units, etc.) MUST go through the `uswds` namespace: `uswds.color()`, `uswds.units()`

## Backward Compatibility

- All existing `--pathable-*` and `--usa-*` CSS custom properties MUST remain unchanged
- All existing `.pathable-` prefixed classes (none exist yet) are additive — no breaking changes
- The `index.scss` entrypoint change (adding `@forward '_utilities'`) is purely additive
- Existing docs site pages MUST render identically after refactoring
