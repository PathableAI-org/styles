# Research: Brand Color Fidelity & Token Architecture

## Unknown Resolved: Semantic Token Color Values

**Decision**: The new semantic tokens will use the following color values, all derived from existing USWDS-mapped values consistent with the current design system approach:

### Action Role Tokens

| Token | Value | Source | Rationale |
| ------- | ------- | -------- | ----------- |
| `--pathable-color-action-primary-bg` | `#162e51` | `blue-warm-80v` (PathAble Blue mapped) | Strong brand identity, high contrast with white text (13.60:1) |
| `--pathable-color-action-primary-text` | `#ffffff` | White | Maximum contrast for legibility |
| `--pathable-color-action-secondary-bg` | `#1dc2ae` | `mint-cool-30v` (Intelligent Jade mapped) | Supporting brand color, good contrast with dark text (6.08:1 with PathAble Blue) |
| `--pathable-color-action-secondary-text` | `#162e51` | PathAble Blue mapped | Dark text on Jade provides 6.08:1 contrast (PASS AA) |

**Rationale**: Primary action uses PathAble Blue (strong brand, high contrast). Secondary action uses Intelligent Jade with PathAble Blue text (contrast verified at 6.08:1). White text on Intelligent Jade fails AA (2.24:1), so dark text is required.

### Status Role Tokens

| Token | Value | Source | Rationale |
| ------- | ------- | -------- | ----------- |
| `--pathable-color-status-success-bg` | `#1dc2ae` | `mint-cool-30v` (Intelligent Jade mapped) | Success = green semantic |
| `--pathable-color-status-success-text` | `#162e51` | PathAble Blue mapped | 6.08:1 contrast on Jade (PASS AA) |
| `--pathable-color-status-warning-bg` | `#f5a623` | `gold-20v` (USWDS warning) | Standard warning color |
| `--pathable-color-status-warning-text` | `#162e51` | PathAble Blue mapped | 6.71:1 contrast on gold (PASS AA) |
| `--pathable-color-status-danger-bg` | `#dc3545` | `red-60v` (existing danger) | Error/danger semantic |
| `--pathable-color-status-danger-text` | `#ffffff` | White | 4.53:1 contrast on danger (PASS AA) |

**Rationale**: Success uses Intelligent Jade (same as accent, consistent). Warning uses gold-20v with dark text (6.71:1). Danger uses existing red with white text (4.53:1, just barely AA).

### Workflow State Tokens

| Token | Value | Source | Rationale |
| ------- | ------- | -------- | ----------- |
| `--pathable-color-workflow-active` | `#58b4ff` | `blue-30v` (Bright Blue Brooks mapped) | Bright, attention-getting blue |
| `--pathable-color-workflow-complete` | `#1dc2ae` | `mint-cool-30v` (Intelligent Jade mapped) | Positive completion |
| `--pathable-color-workflow-blocked` | `#dc3545` | `red-60v` (existing danger) | Error/blocked semantic |

**Rationale**: Workflow tokens are indicator colors (not backgrounds for text), so they follow semantic convention: active = bright blue, complete = green, blocked = red.

## Unknown Resolved: Contrast Ratios for Brand Pairings

### Key Findings (Exact Brand Hex Values)

| Pairing | Ratio | WCAG AA (Normal Text) | WCAG AA (Large Text) | Status |
| --------- | ------- | ---------------------- | ---------------------- | -------- |
| White on PathAble Blue `#00365c` | 12.48:1 | PASS | PASS | ✅ Approved |
| Shilling Silver on PathAble Blue | 9.58:1 | PASS | PASS | ✅ Approved |
| White on Tech Teal `#015a76` | 7.71:1 | PASS | PASS | ✅ Approved |
| White on Intelligent Jade `#1cae96` | 2.78:1 | FAIL | FAIL | ❌ Do not use for text |
| White on Bright Blue Brooks `#4899e8` | 3.00:1 | FAIL | FAIL | ❌ Do not use for normal text |
| Lived-In Lime on white `#d3ff66` | 1.15:1 | FAIL | FAIL | ❌ Do not use for text |
| Lived-In Lime on PathAble Blue | 10.86:1 | PASS | PASS | ✅ Approved as accent on dark |

### Key Findings (USWDS Mapped Values)

| Pairing | Ratio | WCAG AA (Normal Text) | Status |
| --------- | ------- | ---------------------- | -------- |
| White on PathAble Blue (mapped) `#162e51` | 13.60:1 | PASS | ✅ Approved |
| White on Tech Teal (mapped) `#00687d` | 6.41:1 | PASS | ✅ Approved |
| White on Intelligent Jade (mapped) `#1dc2ae` | 2.24:1 | FAIL | ❌ Do not use for text |
| White on Bright Blue Brooks (mapped) `#58b4ff` | 2.24:1 | FAIL | ❌ Do not use for text |
| Muted text on Shilling Silver | 4.89:1 | PASS | ⚠️ Just barely passes |
| Link color on white | 2.24:1 | FAIL | ❌ Documented issue |

### Decisions

- **Intelligent Jade** and **Bright Blue Brooks** with white text FAIL AA for normal text. These should be marked as "do not use for small text" in the Brand / Color Usage page. They may be used for large text (18pt+ or 14pt bold) where the threshold is 3:1.
- **Lived-In Lime** on white FAILS all thresholds. Should only be used as an accent on dark backgrounds.
- **Link color** (`blue-30v` / `#58b4ff`) on white FAILS AA (2.24:1). This is a pre-existing issue in the current semantic tokens. Documented as a known concern in the Brand / Color Usage page.

## Unknown Resolved: Storybook Brand / Color Usage Page Approach

**Decision**: Inline HTML in the story file, following the existing pattern used by other utility stories (e.g., `BackgroundColors.stories.js`).

**Rationale**: All existing stories use inline HTML strings in `.stories.js` files. Using a separate HTML template would be inconsistent with the codebase pattern. The page will be a single story with multiple sections (exact brand colors, USWDS mapping, semantic tokens, approved pairings, failed pairings), rendered as a single HTML template with CSS styling for the documentation layout.

**Approach**:

- New file at `packages/styles/src/stories/brand/ColorUsage.stories.js`
- Single default export with `title: 'Brand/Color Usage'`
- Uses inline HTML with inline styles for the documentation layout (color swatches, tables)
- The page is a single "story" that renders the full documentation page
- Follows the existing pattern of `BackgroundColors.stories.js` for swatch rendering

## Token Value Reference

### Current Semantic Tokens (unchanged, backward compatible)

```css
--pathable-color-bg: #dfe1e2        /* gray-cool-10 (Shilling Silver) */
--pathable-color-surface: #ffffff    /* White */
--pathable-color-text: #162e51       /* blue-warm-80v (PathAble Blue) */
--pathable-color-text-muted: #00687d /* cyan-60v (Tech Teal) */
--pathable-color-border: #dfe1e2     /* gray-cool-10 (Shilling Silver) */
--pathable-color-link: #58b4ff       /* blue-30v (Bright Blue Brooks) */
--pathable-color-accent: #1dc2ae     /* mint-cool-30v (Intelligent Jade) */
--pathable-color-focus-ring: #4497f5 /* blue-40v */
--pathable-color-danger: #dc3545     /* red-60v */
--pathable-color-success: #1dc2ae    /* mint-cool-30v (Intelligent Jade) */
```

### New Brand Fidelity Tokens (exact hex values)

```css
--pathable-brand-pathable-blue: #00365c
--pathable-brand-intelligent-jade: #1cae96
--pathable-brand-bright-blue-brooks: #4899e8
--pathable-brand-tech-teal: #015a76
--pathable-brand-lived-in-lime: #d3ff66
--pathable-brand-shilling-silver: #dde2e8
```

### New Semantic Tokens (action roles)

```css
--pathable-color-action-primary-bg: #162e51
--pathable-color-action-primary-text: #ffffff
--pathable-color-action-secondary-bg: #1dc2ae
--pathable-color-action-secondary-text: #162e51
```

### New Semantic Tokens (status roles)

```css
--pathable-color-status-success-bg: #1dc2ae
--pathable-color-status-success-text: #162e51
--pathable-color-status-warning-bg: #f5a623
--pathable-color-status-warning-text: #162e51
--pathable-color-status-danger-bg: #dc3545
--pathable-color-status-danger-text: #ffffff
```

### New Semantic Tokens (workflow roles)

```css
--pathable-color-workflow-active: #58b4ff
--pathable-color-workflow-complete: #1dc2ae
--pathable-color-workflow-blocked: #dc3545
```
