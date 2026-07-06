# Context Digest: S02-integration-02 — Foundational Theme Settings

## Goal
Create `packages/styles/src/_uswds-theme.scss` with the complete USWDS theme color configuration.

## Key Token Mappings (from research.md)

### Primary (blue-warm): PathAble Blue #00365c
- primary-lighter: blue-warm-10, primary-light: blue-warm-20, primary: blue-warm-80v, primary-vivid: blue-warm-70v, primary-dark: blue-warm-80, primary-darker: blue-warm-90

### Secondary (mint-cool): Intelligent Jade #1cae96
- secondary-lighter: mint-cool-10, secondary-light: mint-cool-20, secondary: mint-cool-30v, secondary-vivid: mint-cool-40v, secondary-dark: mint-cool-80v, secondary-darker: mint-cool-90

### Accent-cool (blue): Bright Blue Brooks #4899e8
- accent-cool-lighter: blue-10, accent-cool-light: blue-20, accent-cool: blue-30v, accent-cool-vivid: blue-40v, accent-cool-dark: cyan-60v (Tech Teal #015a76), accent-cool-darker: blue-90

### Accent-warm (green-warm): Lived-in Lime #d3ff66
- accent-warm-lighter: green-warm-10, accent-warm-light: green-warm-20, accent-warm: green-warm-10v, accent-warm-vivid: green-warm-5v, accent-warm-dark: green-warm-80, accent-warm-darker: green-warm-90

### Base (gray-cool): Shilling Silver #dde2e8
- base-lightest: gray-cool-5, base-lighter: gray-cool-2, base-light: gray-cool-3, base: gray-cool-10, base-dark: gray-cool-80, base-darker: gray-cool-90, base-darkest: gray-90, ink: gray-90

### State Tokens
- error: red-60v (dark: red-70v, lighter: red-10)
- warning: gold-20v (dark: gold-30v, lighter: gold-5)
- success: mint-cool-30v (dark: mint-cool-40v, lighter: mint-cool-5)
- info: blue-30v (dark: blue-40v, lighter: blue-5)
- disabled: gray-cool-20 (dark: gray-30)

### Link/Focus
- theme-link-color: "blue-30v", theme-link-visited-color: "blue-30v", theme-focus-color: "blue-40v"

### Unused Grades (set to false)
- primary-lightest, primary-darkest, secondary-lightest, secondary-darkest, accent-cool-lightest, accent-cool-darkest, accent-warm-lightest, accent-warm-darkest

## Pattern
Use `@use "uswds-core" with (...) { ... }` block. Example:
```scss
@use "uswds-core" with (
  $theme-color-primary: "blue-warm-80v",
  $theme-color-primary-dark: "blue-warm-80",
  $theme-color-primary-darker: "blue-warm-90"
);
```