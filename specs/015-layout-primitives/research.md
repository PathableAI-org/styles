# Research: Compositional Layout Primitives and Semantic Surfaces

## Unknown Resolutions

### U1: Card Grid Minimum Column Width

**Decision**: Default `--pathable-card-grid-min-width` to `var(--space-48)` (48px token) with a documented recommended minimum of approximately 300px (`--pathable-card-grid-min-width: 300px`). Use CSS Grid `auto-fill` with `minmax()` to auto-calculate column count.

**Rationale**:
- The project's `desktop` breakpoint is 1024px. A minimum column width of 300px yields 3 columns on desktop, 2 on tablet (640px → 2 columns), and 1 on mobile (below 640px → naturally collapses).
- Using `auto-fill, minmax(min(100%, var(--pathable-card-grid-min-width)), 1fr)` prevents cards from exceeding container width and handles single-row scenarios gracefully.
- The `--space-48` token equals 48px which is too narrow for cards — so the recommendation is a separate non-token default of 300px (a reasonable card minimum). The value is exposed as a CSS custom property so consumers can override it per grid instance.
- FR-005 requires cards to "not become unreasonably narrow" — the `minmax()` pattern with a sensible minimum prevents column proliferation.

**Alternatives considered**:
1. Fixed percentage-based grid (e.g., `grid-template-columns: repeat(3, 1fr)`) — too rigid, requires manual override for responsive behavior.
2. `auto-fit` instead of `auto-fill` — `auto-fill` preserves column tracks when fewer items exist (keeps alignment), `auto-fit` collapses empty tracks. The spec says cards should "remain left-aligned" when fewer than fill count — this is a design choice. Recommend `auto-fill` for the card grid.

### U2: Split/Sidebar Collapse Breakpoint

**Decision**: Use the existing `desktop` breakpoint (1024px) as the collapse threshold for both split and sidebar layouts.

**Rationale**:
- The project already defines responsive breakpoints: `mobile-lg` (480px), `tablet` (640px), `desktop` (1024px).
- Both split and sidebar layouts are inherently two-region structures that work best on larger screens. Collapsing at `desktop` (1024px) means:
  - Below 1024px: both regions stack vertically
  - At 1024px and above: regions sit side by side
- This aligns with most content-oriented USWDS layouts, where sidebar navigation typically collapses below `desktop`.
- USWDS's own `usa-layout-docs` (two-column documentation layout) collapses at its `desktop` breakpoint by default, providing precedent within the project.

**Alternatives considered**:
1. `tablet` (640px) — would collapse on many desktop-sized tablets; too conservative for layouts that benefit from side-by-side presentation.
2. `mobile-lg` (480px) — would show side-by-side on most phones in landscape; too aggressive.

### U3: Sticky Panel Viewport Height Threshold

**Decision**: Disable sticky positioning when the viewport height is less than 600px. Implement via `@media (max-height: 599px)` setting `position: static`. The 80% height rule described in the contract is not implementable in pure CSS (it requires knowledge of the element's rendered height), so stickiness is disabled on all viewports shorter than 600px as the practical safe fallback.

**Rationale**:
- WCAG SC 2.4.12 (Focus Not Obscured) requires that keyboard-focusable elements are not hidden by sticky content.
- WCAG SC 1.4.12 (Text Spacing) means sticky content must not overlap when text is resized — a 600px minimum height ensures reasonable space.
- The 80% rule is not implementable in pure CSS (it requires knowledge of the element's rendered height), but disabling sticky on all viewports shorter than 600px provides equivalent practical protection — on those viewports, any sticky panel would occupy a significant portion of the viewport.
- Many common web patterns (e.g., USWDS sticky sidenav) disable stickiness below 600px.
- This can be refined later if specific consumer feedback indicates a need for a different threshold.

**Alternatives considered**:
1. No threshold — always sticky regardless of viewport. Violates WCAG Focus Not Obscured criteria.
2. CSS `position: sticky` with no fallback guard — works but doesn't handle the "viewport too short" case, which the spec explicitly requires (FR-007).
3. JavaScript-based detection — violates the "no JS runtime dependency" constraint.

## Best Practice Research

### SCSS Implementation Patterns for Pure CSS Layout Primitives

**Context**: These primitives are pure CSS (no USWDS base to extend). They differ from existing wrappers that use `@extend .usa-*`.

**Best Practice**:
- Each primitive is a self-contained SCSS file that:
  1. Uses `@use 'uswds-core' as *;` only when referencing USWDS functions/mixins (e.g., `units()`, `color()`)
  2. Defines its selector(s) with full BEM naming
  3. Applies styling via `var(--pathable-*)` CSS custom properties
  4. Provides `--pathable-{primitive}-*` custom properties on the root element for consumer customization
  5. Includes responsive variants using `@media` queries referencing the project's breakpoints
  6. Respects `prefers-reduced-motion` and `forced-colors` media queries
- Surface variants follow a similar pattern but with class-based modifiers on `.pathable-surface`

### Accessibility Considerations for Semantic Surfaces

**Context**: Interactive surfaces need visible focus states, forced-colors mode must preserve boundaries.

**Best Practice**:
- Use `outline` (not `box-shadow`) for focus indicators to ensure forced-colors mode visibility — `outline` is preserved in high-contrast mode while `box-shadow` is stripped.
- Provide `outline: 2px solid transparent` as default with `outline-offset: 2px` to avoid double-outline issues.
- Use `@media (forced-colors: active)` to apply `outline-color: CanvasText` or similar for surface boundaries.
- Interactive surfaces should use `.pathable-surface--interactive:hover`, `.pathable-surface--interactive:focus-visible`, and `.pathable-surface--interactive:focus-within` selectors.
- Nested surfaces maintain contrast: raised-on-inset should still have visible shadow; inset-on-raised should still have visible inset border.

### Token Reference Mapping

**All tokens needed for this feature**:

| Property | Token(s) |
|---|---|
| Spacing (gap, padding) | `--space-{4,8,12,16,24,32,48}` |
| Container max-widths | Standard: 1024px; Wide: 1280px; Full: 100% with gutters |
| Border radius | `--radius-{sm,md,lg}` (4px, 8px, 12px) |
| Elevation (shadows) | `--elevation-{sm,md,lg,xl}` |
| Surface backgrounds | `--pathable-color-surface` (white), `--pathable-color-bg` (Shilling Silver), `--pathable-color-accent` (Jade), `--pathable-color-text` (PathAble Blue) |
| Borders | `--pathable-color-border` |
| Focus ring | `--pathable-color-focus-ring` |
| Breakpoints | `mobile-lg` (480px), `tablet` (640px), `desktop` (1024px) |