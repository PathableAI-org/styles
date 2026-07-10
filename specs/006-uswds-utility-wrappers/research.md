# Research: USWDS Utility Wrappers — SCSS Architecture

**Branch**: `006-uswds-utility-wrappers` | **Date**: 2026-07-07

## Background

This research investigates how USWDS v3.x provides utility classes and SCSS functions, and how the `@pathable/styles` package can generate `.pathable-*` utility wrappers without duplicating the full USWDS utility output.

## Decision Record

### R0-1: USWDS Utility Module SCSS API

**Decision**: Use `uswds-core` functions (`color()`, `units()`, `spacing-multiple()`, `get-font-stack()`) directly to resolve theme token values into concrete CSS values, then generate wrapper classes via SCSS `@each` loops over utility configuration maps.

**Rationale**: USWDS exposes all the building blocks needed:

| Function | Purpose | Returns | Example |
| ---------- | --------- | --------- | --------- |
| `color('token-name')` | Resolve USWDS color token to hex | Hex string | `color('blue-warm-80v')` → `#00365c` |
| `units(n)` | Resolve spacing multiple to CSS length | CSS length | `units(2)` → `1rem` |
| `spacing-multiple(n)` | Same as units() | CSS length | `spacing-multiple(4)` → `2rem` |
| `get-font-stack('role')` | Resolve font role to CSS font-family | Font stack string | `get-font-stack('heading')` → font-family declaration |

**Alternatives considered**:

- **Re-importing full USWDS utilities output**: Rejected because it would include all USWDS default classes, not just those scoped to the PathAble theme configuration. The compiled CSS would be unnecessarily large.
- **Manual class writing**: Rejected because it doesn't scale and would diverge from the theme configuration.

### R0-2: PathAble Utility Class Naming Map

**Decision**: Prefix all utility classes with `.pathable-` followed by the USWDS class base and value name, with responsive variants using `{breakpoint}\:pathable-{base}-{value}` and state variants using `{state}\:pathable-{base}-{value}`.

**Rationale**: The `.pathable-` prefix clearly namespaces the utilities to PathAble, avoiding collisions with any `.usa-` classes that might be imported. Responsive/state variant syntax mirrors USWDS's `:` separator convention.

**Alternatives considered**:

- **No prefix**: Rejected because utility class names like `.bg-primary` are too generic and could conflict with other frameworks (Tailwind, Bootstrap, etc.)
- **`.pa-` short prefix**: Rejected because it's less recognizable and less consistent with the `--pathable-*` CSS custom property namespace

### R0-3: Value Token Resolution

**Decision**: Each utility module resolves its values as follows:

| Utility Module | Value Source | SCSS Resolution |
| ---------------- | ------------- | ----------------- |
| background-color | USWDS color tokens | `color($token)` |
| color | USWDS color tokens | `color($token)` |
| padding | USWDS spacing tokens | `units($n)` |
| margin | USWDS spacing tokens | `units($n)` |
| display | CSS keyword values | Direct string |
| font-family | USWDS font roles | `get-font-stack($role)` |
| font-weight | Numeric weight | USWDS `$theme-font-weight-*` vars |
| border | USWDS border tokens | `units($n)` |
| border-radius | USWDS radius tokens | `units($n)` |
| flex | Numeric (1, 2, etc.) | Direct string |
| align-items | CSS keyword values | Direct string |
| justify-content | CSS keyword values | Direct string |
| width | USWDS spacing / percentage | `units($n)` or percentage string |
| max-width | USWDS breakpoint values | USWDS `$theme-*-max-width` |
| text-align | CSS keyword values | Direct string |

**Rationale**: This maps each utility value to its canonical USWDS resolution function, ensuring the PathAble wrapper classes produce exactly the same computed values as the original USWDS classes would.

### R0-4: Responsive and State Variant Strategy

**Decision**:

- Responsive variants will be generated at breakpoints already configured in `_uswds-theme.scss` (`mobile-lg: 480px`, `tablet: 640px`, `desktop: 1024px`)
- State variants will be generated for hover and focus where the underlying USWDS module supports them
- Variant syntax: `.{breakpoint}\:pathable-{base}-{value}` and `.{state}\:pathable-{base}-{value}`

**Rationale**: The theme config in `_uswds-theme.scss` sets `$theme-utility-breakpoints` which controls which breakpoints USWDS generates. Matching this ensures consistency. Hover and focus are the most commonly needed state variants for the docs site.

**Alternatives considered**:

- **No responsive/state variants**: Rejected because FR-006 and FR-007 explicitly require them.
- **All breakpoints enabled**: Rejected to keep output size manageable. Only breakpoints enabled in the theme config will be used.

### R0-5: Dual CSS Custom Property Emission Strategy

**Decision**: Emit dual `--pathable-*` / `--usa-*` CSS custom properties for each utility token value in the same `:root` block pattern used by `_typography.scss`.

**Rationale**: This follows the exact pattern established by the existing `$typography-tokens` map and `:root` block in `_typography.scss`. It creates a single configuration map that emits both namespaces in one `@each` loop.

## SCSS Implementation Pattern

Based on the USWDS source research, the recommended generation pattern is:

```scss
// Pattern for a utility module
$utility-config: (
  'bg': (
    'class': 'pathable-bg',
    'property': 'background-color',
    'values': (
      'primary': uswds.color('blue-warm-80v'),
      'base': uswds.color('gray-cool-10'),
      // ... more tokens
    ),
  ),
  'padding': (
    'class': 'pathable-padding',
    'property': 'padding',
    'values': (
      '1': uswds.units(1),
      '2': uswds.units(2),
      // ... more values
    ),
  ),
  // ... more modules
);

// Generate utility classes and dual CSS custom properties
:root {
  @each $module-name, $module in $utility-config {
    @each $value-name, $value in map.get($module, 'values') {
      --pathable-#{$value-name}: #{$value};
      --usa-#{$value-name}: #{$value};
    }
  }
}

// Generate utility class selectors
@each $module-name, $module in $utility-config {
  $class: map.get($module, 'class');
  $prop: map.get($module, 'property');
  
  @each $value-name, $value in map.get($module, 'values') {
    .#{$class}-#{$value-name} {
      #{$prop}: #{$value};
    }
    
    // Responsive variants
    @each $bp-name, $bp-value in $theme-utility-breakpoints {
      @media (min-width: $bp-value) {
        // .tablet\:pathable-bg-primary
      }
    }
  }
}
```

## Key Dependencies

- `uswds-core` `color()` function — returns hex color from USWDS token string
- `uswds-core` `units()` function — returns CSS length from USWDS spacing token
- `uswds-core` `get-font-stack()` function — returns font-family from USWDS role name
- USWDS `$theme-utility-breakpoints` — breakpoint configuration map
- USWDS `$utilities-use-important` — `!important` flag (currently `false`)

## Files Referenced

- `node_modules/@uswds/uswds/packages/uswds-core/src/styles/functions/units/spacing-multiple.scss`
- `node_modules/@uswds/uswds/packages/uswds-core/src/styles/functions/color/color.scss`
- `node_modules/@uswds/uswds/packages/uswds-core/src/styles/mixins/utilities/_utility-builder.scss`
- `node_modules/@uswds/uswds/packages/uswds-utilities/src/styles/`
