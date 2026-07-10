# SCSS Interface Contract: USWDS Typography Settings

## Public API (Guaranteed Stable)

The following symbols are the public API of `@pathable/styles`. Consumers rely on these. They MUST NOT change behavior or availability.

### SCSS Variables (Existing — Preserved)

```scss
// Font family variables (5)
$pathable-font-heading              // Fredoka font stack
$pathable-font-alternate-heading     // Montserrat Bold font stack
$pathable-font-subheading            // Poppins Bold font stack
$pathable-font-body                  // Nunito font stack
$pathable-font-mono                  // Monospace font stack

// Typography scale variables (9)
$ui-display-lg                       // 32px
$ui-heading-lg                       // 24px
$ui-heading-md                       // 20px
$ui-heading-sm                       // 18px
$ui-body-lg                          // 18px
$ui-body-md                          // 16px
$ui-body-sm                          // 14px
$ui-label-md                         // 14px
$ui-label-sm                         // 12px
$ui-caption-md                       // 12px
```

### SCSS Variables (New — Added)

```scss
// Font weight (if not already defined)
$pathable-font-weight-semibold       // 600 (for Nunito labels)
```

### CSS Custom Properties (Existing — Preserved)

```css
--pathable-font-heading
--pathable-font-alternate-heading
--pathable-font-subheading
--pathable-font-body
--pathable-font-mono

--ui-display-lg
--ui-heading-lg
--ui-heading-md
--ui-heading-sm
--ui-body-lg
--ui-body-md
--ui-body-sm
--ui-label-md
--ui-label-sm
--ui-caption-md
```

### CSS Custom Properties (New — Dual Naming)

```css
/* PathAble naming — font role */
--pathable-font-heading
--pathable-font-body
--pathable-font-mono
--pathable-font-alt

/* PathAble naming — font size */
--pathable-font-size-display-lg
--pathable-font-size-heading-lg
--pathable-font-size-heading-md
--pathable-font-size-heading-sm
--pathable-font-size-body-lg
--pathable-font-size-body-md
--pathable-font-size-body-sm
--pathable-font-size-label-md
--pathable-font-size-label-sm
--pathable-font-size-caption-md

/* PathAble naming — font weight */
--pathable-font-weight-normal
--pathable-font-weight-semibold
--pathable-font-weight-bold

/* PathAble naming — line height */
--pathable-font-line-height-body

/* USWDS naming — font role */
--usa-font-heading
--usa-font-body
--usa-font-mono
--usa-font-alt

/* USWDS naming — font size */
--usa-font-size-h1
--usa-font-size-h2
--usa-font-size-h3
--usa-font-size-h4
--usa-font-size-h5
--usa-font-size-h6
--usa-font-size-body
--usa-font-size-display
--usa-font-size-lead

/* USWDS naming — font weight */
--usa-font-weight-normal
--usa-font-weight-semibold
--usa-font-weight-bold

/* USWDS naming — line height */
--usa-font-line-height-body
--usa-font-line-height-heading
```

## Internal Module Interface

### _uswds-theme.scss (UPDATED)

**Role**: Single source of truth for ALL USWDS theme token configuration (color AND typography). This is the settings file referenced in FR-011.

**Consumed by**: `index.scss` via `@forward "uswds-theme"`

**Additions**:

- `$theme-typeface-tokens` — custom typeface token definitions for Fredoka, Nunito, Poppins, Montserrat
- `$theme-font-type-sans` — set to the primary custom typeface (or kept as reference)
- `$theme-font-role-heading` → `"fredoka"` (custom typeface token)
- `$theme-font-role-body` → `"nunito"` (custom typeface token)
- `$theme-font-role-ui` → `"nunito"` (custom typeface token)
- `$theme-font-role-code` → `"mono"` (built-in)
- `$theme-font-role-alt` → `"montserrat"` or `"poppins"` (custom typeface token)
- `$theme-type-scale-*` — customized for PathAble type scale
- `$theme-font-weight-semibold` → `600`
- `$theme-h1-font-size` through `$theme-h6-font-size`
- `$theme-body-font-size`, `$theme-body-line-height`
- `$theme-heading-line-height`
- `$theme-prose-font-family`, `$theme-lead-*`
- `$theme-display-font-size`, `$theme-small-font-size`
- `$theme-text-measure-*`
- `$theme-heading-margin-top`, `$theme-paragraph-margin-top`
- `$theme-respect-user-font-size`: `true`

**Does NOT contain**:

- `@font-face` rules (those go in `_fonts.scss`)
- Any component styles

### _fonts.scss (NEW)

**Role**: Contains `@font-face` declarations for all self-hosted brand typefaces.

**Consumed by**: `index.scss` via `@forward "fonts"` (must be forwarded before `_uswds-theme`)

**Contains**:

- `@font-face` for Fredoka Regular (400)
- `@font-face` for Nunito Regular (400)
- `@font-face` for Nunito SemiBold (600)
- `@font-face` for Poppins Bold (700)
- `@font-face` for Montserrat Bold (700)

**Font path**: Uses `$theme-font-path` (defaults to `../fonts` relative to compiled CSS)

### _typography.scss (UPDATED)

**Role**: Defines PathAble typography SCSS variables, typography scale, and CSS custom properties.

**Changes**:

- Existing `$pathable-font-*` variables and `--pathable-font-*` CSS custom properties preserved
- NEW: `$typography-tokens` map added as single source of truth for dual-named CSS custom properties
- NEW: `--usa-font-*` CSS custom properties added alongside existing `--pathable-font-*` ones
- Values remain consistent with `_uswds-theme.scss` typography settings

**Requires**: `_uswds-theme.scss` to be forwarded first.

### index.scss (UPDATED)

**Role**: Package entrypoint — forwards all partials to compose the compiled output.

**Changes**:

- Before: `@forward "uswds-theme"; @forward "colors"; @forward "typography"; ...`
- After: `@forward "fonts"; @forward "uswds-theme"; @forward "colors"; @forward "typography"; ...`

**Order matters**: `fonts` must be forwarded first so `@font-face` rules are available. `uswds-theme` must be forwarded before `colors`, `typography`, and `semantic` so `uswds-core` is configured before those partials use it.

## Build Contract

```bash
# Build command (unchanged — USWDS load-path already required)
sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css
```

## Consumption Contract

```json
// package.json (unchanged)
{
  "dependencies": {
    "@uswds/uswds": "^3.x"
  }
}
```

## Dual Naming Convention

The dual `--pathable-font-*` / `--usa-font-*` naming convention is implemented via a single SCSS map:

```scss
$typography-tokens: (
  'font-heading': $pathable-font-heading,
  'font-body': $pathable-font-body,
  'font-mono': $pathable-font-mono,
  'font-alt': $pathable-font-alternate-heading,
  'font-size-body-md': $ui-body-md,
  'font-weight-normal': 400,
  'font-weight-bold': 700,
  // ... etc
);

:root {
  @each $name, $value in $typography-tokens {
    --pathable-#{$name}: #{$value};
    --usa-#{$name}: #{$value};
  }
}
```

This ensures that:

1. The two namespaces always resolve to identical values
2. Adding a new token requires editing only one map entry
3. The `--usa-*` namespace is derived from the `--pathable-*` source of truth
