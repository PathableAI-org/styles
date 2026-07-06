# Research: USWDS Theme Wrapper

## Decisions

### Decision D1: Brand Color to USWDS System Token Mapping

Used CIE76 (deltaE 1976) perceptual color distance against the full USWDS v3.x system palette (569 tokens across 24 color families) via the CivicActions USWDS Color Tool.

| Brand Color | Hex | Theme Family | Base Token | ΔE | Notes |
|-------------|-----|-------------|------------|----|-------|
| PathAble Blue | #00365c | Primary | blue-warm-80v | 5.56 | Same token as USWDS default primary-darker |
| Intelligent Jade | #1cae96 | Secondary | mint-cool-30v | 7.84 | Slightly more saturated teal-green |
| Bright Blue Brooks | #4899e8 | Accent-cool | blue-30v | 10.70 | Slightly brighter, more saturated |
| Lived-in Lime | #d3ff66 | Accent-warm | green-warm-10v | 18.97 | Furthest match — see edge cases in spec |
| Shilling Silver | #dde2e8 | Base | gray-cool-10 | 2.79 | Near-perfect match |
| Tech Teal | #015a76 | accent-cool-dark | cyan-60v | 8.10 | Mapped to accent-cool-dark grade |

**Rationale**: deltaE < 10 is imperceptible to most viewers. Only Lived-in Lime (ΔE=18.97) has a noticeable perceptual difference — documented as anticipated in the spec edge cases.

### Decision D2: Full Grade Mapping Per Family

**Primary family** (blue-warm tokens):
| Grade | USWDS Token | Hex |
|-------|-------------|-----|
| primary-lighter | blue-warm-10 | #e1e7f1 |
| primary-light | blue-warm-20 | #bbcae4 |
| primary | blue-warm-80v | #162e51 |
| primary-vivid | blue-warm-70v | #1a4480 |
| primary-dark | blue-warm-80 | #252f3e |
| primary-darker | blue-warm-90 | #13171f |

**Secondary family** (mint-cool tokens):
| Grade | USWDS Token | Hex |
|-------|-------------|-----|
| secondary-lighter | mint-cool-10 | #c4eeeb |
| secondary-light | mint-cool-20 | #9bd4cf |
| secondary | mint-cool-30v | #1dc2ae |
| secondary-vivid | mint-cool-40v | #00a398 |
| secondary-dark | mint-cool-80v | #123131 |
| secondary-darker | mint-cool-90 | #111818 |

**Accent-cool family** (blue tokens):
| Grade | USWDS Token | Hex |
|-------|-------------|-----|
| accent-cool-lighter | blue-10 | #d9e8f6 |
| accent-cool-light | blue-20 | #aacdec |
| accent-cool | blue-30v | #58b4ff |
| accent-cool-vivid | blue-40v | #2491ff |
| accent-cool-dark | cyan-60v | #00687d |
| accent-cool-darker | blue-90 | #11181d |

**Accent-warm family** (green-warm tokens):
| Grade | USWDS Token | Hex |
|-------|-------------|-----|
| accent-warm-lighter | green-warm-10 | #e7eab7 |
| accent-warm-light | green-warm-20 | #cbd17a |
| accent-warm | green-warm-10v | #e7f434 |
| accent-warm-vivid | green-warm-5v | #f5fbc1 |
| accent-warm-dark | green-warm-80 | #2d2f21 |
| accent-warm-darker | green-warm-90 | #171712 |

**Base family** (gray-cool tokens):
| Grade | USWDS Token | Hex |
|-------|-------------|-----|
| base-lightest | gray-cool-5 | #edeff0 |
| base-lighter | gray-cool-2 | #f7f9fa |
| base-light | gray-cool-3 | #f5f6f7 |
| base | gray-cool-10 | #dfe1e2 |
| base-dark | gray-cool-80 | #2d2e2f |
| base-darker | gray-cool-90 | #1c1d1f |
| base-darkest | gray-90 | #1b1b1b |
| ink | gray-90 | #1b1b1b |

**Tech Teal** (#015a76) — mapped to `cyan-60v` (#00687d, ΔE=8.10) assigned to accent-cool-dark grade. This replaces the default blue-80v for that grade.

### Decision D3: SCSS Architecture for USWDS Wrapper

**Architecture**: Separate `_uswds-theme.scss` partial containing the `@use "uswds-core" with (...)` block. Main `index.scss` forwards this file, then existing partials — without forwarding `uswds` (component styles excluded per FR-006).

**Build configuration**: `--load-path=node_modules/@uswds/uswds/packages` is required so Dart Sass can resolve the `uswds-core` module.

Build command: `sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css`

**Resolving theme tokens to hex values in _colors.scss**:
```scss
@use "uswds-core" as uswds;
$pathable-blue: uswds.color("blue-warm-80v");
```
Do NOT do `$pathable-blue: $theme-color-primary` — that yields the string `"blue-warm-80v"`, not a hex color.

**Token-only output**: Only forward `uswds-core` via the settings file. Do not `@forward "uswds"`.

### Decision D4: State Token Configuration

USWDS state tokens configured in `_uswds-theme.scss`:
- `$theme-color-error`: `"red-60v"` and dark/lighter variants
- `$theme-color-success`: `"mint-cool-30v"` (same as secondary base — Intelligent Jade)
- `$theme-color-warning`: `"gold-20v"`
- `$theme-color-info`: `"blue-30v"` (same as accent-cool base — Bright Blue Brooks)
- `$theme-color-disabled`: `"gray-cool-20"`
- `$theme-link-color`: `"blue-30v"`
- `$theme-focus-color`: `"blue-40v"`

### Decision D5: Unused Grades Set to false

| Setting | Value |
|---------|-------|
| `$theme-color-primary-lightest` | `false` |
| `$theme-color-primary-darkest` | `false` |
| `$theme-color-secondary-lightest` | `false` |
| `$theme-color-secondary-darkest` | `false` |
| `$theme-color-accent-cool-lightest` | `false` |
| `$theme-color-accent-cool-darkest` | `false` |
| `$theme-color-accent-warm-lightest` | `false` |
| `$theme-color-accent-warm-darkest` | `false` |

## Alternatives Considered

| Alternative | Rejected Because |
|-------------|-----------------|
| Forking USWDS to emit CSS custom properties | Maintenance burden, defeats upgradeability |
| Keeping all $pathable-* as hardcoded hex separate from USWDS | Two diverging sources of truth |
| Embedding @use ... with block directly in index.scss | Violates FR-008 (single settings file) |
| Using @import (deprecated SCSS) | Dart Sass dropped @import support |
