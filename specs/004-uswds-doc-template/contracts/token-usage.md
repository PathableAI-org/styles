# Interface Contract: Design Token Usage in Astro Docs Page Frame

**Phase**: 1 | **Feature**: 004-uswds-doc-template | **Date**: 2026-07-06

## Purpose

This contract documents the mapping between `@pathable/styles` CSS custom properties (`--pathable-*`) and the layout regions of the USWDS-inspired documentation page. Every component in `apps/docs/src/components/` MUST comply with this mapping — no hardcoded color, font, spacing, or radius values.

## Contract

### Color Tokens

| Token | Value (resolved) | Layout Usage | CSS Property | Components |
| --- | --- | --- | --- | --- |
| `--pathable-color-bg` | `#dfe1e2` (Shilling Silver) | Page body background | `background-color` | PageFrame (body), ContentProse |
| `--pathable-color-surface` | `#ffffff` (White) | Header, sidebar, footer backgrounds | `background-color` | PageFrame (.header), Sidebar wrapper, Footer |
| `--pathable-color-text` | `#162e51` (PathAble Blue) | Body and navigation text | `color` | HorizontalNav, Sidebar, ContentProse, Footer |
| `--pathable-color-text-muted` | `#00687d` (Tech Teal) | Secondary/subtle text | `color` | Footer secondary, muted nav items |
| `--pathable-color-border` | `#dfe1e2` (Shilling Silver) | Borders and dividers | `border-*-color` | Header bottom border, sidebar borders, footer dividers |
| `--pathable-color-link` | `#58b4ff` (Bright Blue Brooks) | Hyperlinks in content | `color` | ContentProse (`a` tags), Footer links |
| `--pathable-color-accent` | `#1dc2ae` (Intelligent Jade) | Active/current indicators | `color`, `border-bottom-color`, `background-color` | HorizontalNav active item, Sidebar current page |
| `--pathable-color-focus-ring` | `#2491ff` (Blue) | Focus outlines | `outline-color`, `outline` | SkipNav, all interactive elements |
| `--pathable-color-danger` | `#dc3545` (Red) | Error states | `color`, `background-color` | ContentProse (error states, if any) |
| `--pathable-color-success` | `#1dc2ae` (Intelligent Jade) | Success states | `color`, `background-color` | ContentProse (success states, if any) |

### Typography Tokens

| Token | Value | Layout Usage | CSS Property | Components |
| --- | --- | --- | --- | --- |
| `--pathable-font-heading` | Fredoka | All headings (h1-h6) | `font-family` | ContentProse (h1-h6), HorizontalNav (site title) |
| `--pathable-font-body` | Nunito | Body text and navigation | `font-family` | ContentProse (p, li, etc.), HorizontalNav, Sidebar, Footer |

### Spacing Tokens

| Token | Value | Layout Usage | CSS Property |
| --- | --- | --- | --- |
| `--space-4` | 4px | Tiny gaps | `gap`, `margin`, `padding` |
| `--space-8` | 8px | Compact spacing | `padding`, `gap` |
| `--space-12` | 12px | Small spacing | `padding`, `margin` |
| `--space-16` | 16px | Default spacing | `padding`, `gap`, `margin` |
| `--space-24` | 24px | Section spacing | `padding`, `margin` |
| `--space-32` | 32px | Large section spacing | `padding` |
| `--space-48` | 48px | Extra-large spacing | `padding`, `margin` |

### Elevation Tokens

| Token | Value | Layout Usage | CSS Property |
| --- | --- | --- | --- |
| `--elevation-sm` | `0px 1px 2px 0px rgba(0, 54, 92, 0.12)` | Subtle shadows | `box-shadow` |
| `--elevation-md` | `0px 4px 8px 0px rgba(0, 54, 92, 0.16)` | Navigation elevation | `box-shadow` |

### Radius Tokens

| Token | Value | Layout Usage | CSS Property |
|---|---|---|---|
| `--radius-sm` | 4px | Small border radius | `border-radius` |
| `--radius-md` | 8px | Default border radius | `border-radius` |

## Compliance Rules

1. **No hardcoded values**: Every color, font-family, spacing, elevation, and radius value in component `<style>` blocks MUST reference a `--pathable-*` or `--space-*` or `--elevation-*` or `--radius-*` CSS custom property, either directly via `var(...)` or via a Starlight variable that itself maps to a `--pathable-*` property.

2. **Exceptions**: The ONLY allowed exceptions are:
   - Semantic white/black for overlay backgrounds (`.usa-overlay` equivalent) — use `rgba(0, 0, 0, X)` or similar
   - `transparent` for transitions
   - `currentColor` or `inherit`/`initial`/`unset`
   - Viewport-relative sizes (`vw`, `vh`) for full-screen elements
   - Pixel values for `max-width` of content area (readability constraint)

3. **`usa-*` classes**: Where `.usa-*` utility classes are used (e.g., `.grid-container`, `.grid-row`, `.grid-gap`), they resolve to USWDS theme colors via the `@pathable/styles` configuration. This is acceptable but should be limited to grid/layout utilities.

4. **Audit**: Before closing this feature, inspect every component `<style>` block and verify compliance. The checklist in `specs/004-uswds-doc-template/checklists/requirements.md` includes this as a validation step.
