# SCSS Interface Contract: USWDS Theme Wrapper

## Public API (Guaranteed Stable)

The following symbols are the public API of `@pathable/styles`. Consumers rely on these. They MUST NOT change behavior or availability.

### SCSS Variables

```scss
// Brand color variables (6)
$pathable-blue              // Resolves to hex value via uswds.color("blue-warm-80v")
$intelligent-jade           // Resolves to hex value via uswds.color("mint-cool-30v")
$bright-blue-brooks         // Resolves to hex value via uswds.color("blue-30v")
$tech-teal                  // Resolves to hex value via uswds.color("cyan-60v")
$lived-in-lime              // Resolves to hex value via uswds.color("green-warm-10v")
$shilling-silver            // Resolves to hex value via uswds.color("gray-cool-10")

// Semantic color variables (10)
$pathable-color-bg          // Background color
$pathable-color-surface     // Surface/card background
$pathable-color-text        // Primary text
$pathable-color-text-muted  // Muted/secondary text
$pathable-color-border      // Border color
$pathable-color-link        // Link text
$pathable-color-accent      // Accent color
$pathable-color-focus-ring  // Focus ring
$pathable-color-danger      // Error/danger
$pathable-color-success     // Success/positive
```

### CSS Custom Properties

```css
--pathable-blue
--intelligent-jade
--bright-blue-brooks
--tech-teal
--lived-in-lime
--shilling-silver

--pathable-color-bg
--pathable-color-surface
--pathable-color-text
--pathable-color-text-muted
--pathable-color-border
--pathable-color-link
--pathable-color-accent
--pathable-color-focus-ring
--pathable-color-danger
--pathable-color-success
```

## Internal Module Interface

### _uswds-theme.scss (NEW)

**Role**: Single source of truth for USWDS theme token configuration. This is the settings file referenced in FR-008.

**Consumed by**: `index.scss` via `@forward "uswds-theme"`

**Contains**:

- Single `@use "uswds-core" with (...)` block
- All `$theme-color-*` overrides for base, primary, secondary, accent-warm, accent-cool families
- All state token overrides (error, warning, success, info, disabled)
- Link color and focus color overrides
- Unused grades set to `false`

**Does NOT contain**:

- Any component styles
- Any `@forward "uswds"` calls

### _colors.scss (UPDATED)

**Role**: Defines brand color SCSS variables and CSS custom properties.

**Changes**:

- Was: `$pathable-blue: #00365c;`
- Now: `$pathable-blue: uswds.color("blue-warm-80v");`

**Requires**: `@use "uswds-core" as uswds;` at the top of the file.

### _semantic.scss (UPDATED)

**Role**: Defines semantic/functional color SCSS variables and CSS custom properties.

**Changes**:

- Tokens with `aliasStatus: MUST` now reference `uswds.color(...)`
- Tokens with `aliasStatus: SHOULD` may reference `uswds.color(...)` or remain hardcoded
- Tokens with `aliasStatus: MAY remain` keep their hardcoded hex values

### index.scss (UPDATED)

**Role**: Package entrypoint — forwards all partials to compose the compiled output.

**Changes**:

- Was: `@forward "colors"; @forward "typography"; ...`
- Now: `@forward "uswds-theme";` then existing forwards, no `@forward "uswds"`

**Order matters**: `uswds-theme` must be forwarded first so that `uswds-core` is configured before any other partial uses it.

## Build Contract

```bash
# Before: no load-path needed
sass src/index.scss dist/styles.css

# After: USWDS load-path required
sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css
```

## Consumption Contract

```json
// package.json
{
  "scripts": {
    "build": "sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css"
  },
  "dependencies": {
    "@uswds/uswds": "^3.x"
  }
}
```
