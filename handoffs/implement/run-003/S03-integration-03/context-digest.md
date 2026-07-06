# Context Digest: S03-integration-03 — Brand Color & Semantic Token Aliasing

## Goal
Update `_colors.scss`, `_semantic.scss`, and `index.scss` to alias all brand and semantic tokens to USWDS system tokens via `uswds.color()`.

## Key Rules
- Use `uswds.color("token-name")` (NOT `$theme-color-primary` which returns a string)
- Both `_colors.scss` and `_semantic.scss` need `@use "uswds-core" as uswds;` at top
- Keep `$pathable-color-danger: #dc3545` hardcoded (no USWDS mapping, aliasStatus: MAY remain)
- Keep `$pathable-color-surface: #ffffff` hardcoded (pure white, aliasStatus: MAY remain)
- brand-colors map values must be updated alongside the SCSS variables
- semantic-colors map values must be updated alongside the SCSS variables
- `index.scss`: add `@forward "uswds-theme";` FIRST, before all existing forwards

## Brand Color Mappings
- $pathable-blue → uswds.color("blue-warm-80v")
- $intelligent-jade → uswds.color("mint-cool-30v")
- $bright-blue-brooks → uswds.color("blue-30v")
- $tech-teal → uswds.color("cyan-60v")
- $lived-in-lime → uswds.color("green-warm-10v")
- $shilling-silver → uswds.color("gray-cool-10")

## Semantic Token Mappings (MUST)
- $pathable-color-text → uswds.color("blue-warm-80v")
- $pathable-color-text-muted → uswds.color("cyan-60v")
- $pathable-color-link → uswds.color("blue-30v")
- $pathable-color-accent → uswds.color("mint-cool-30v")
- $pathable-color-focus-ring → uswds.color("blue-40v")
- $pathable-color-success → uswds.color("mint-cool-30v")

## Semantic Token Mappings (SHOULD — optional but recommended)
- $pathable-color-bg → uswds.color("gray-cool-10")
- $pathable-color-border → uswds.color("gray-cool-10")

## Semantic Tokens (MAY remain — keep hardcoded)
- $pathable-color-surface: #ffffff
- $pathable-color-danger: #dc3545

## CSS Custom Properties
These are automatically derived from the SCSS variables via interpolation (#{$var}), so they update automatically when the variables change.