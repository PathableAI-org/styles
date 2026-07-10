# Research: Reusable Interaction States, Icon Conventions, and Compact Controls

## Unknown Resolutions

### U1: Loading State in Pure CSS

**Decision**: Use a CSS-only spinner approach via an `::after` pseudo-element toggled by a `.pathable-icon-button--loading` modifier class. The loading indicator replaces the icon content by making the SVG invisible (`opacity: 0` or `visibility: hidden`) and rendering a CSS border-based spinner in the pseudo-element that occupies the same dimensions. This prevents layout shift since the pseudo-element is positioned absolutely within the icon button's existing box.

**Rationale**:
- No JavaScript is needed for rendering the loading state — CSS alone can toggle the visual state via class application (consumer JavaScript would toggle the class, but the style logic is pure CSS).
- Using `::after` with a `border`-based spinner (`border-top-color: transparent; border-style: solid; border-radius: 50%`) works across all modern browsers and respects `prefers-reduced-motion` (the animation can be removed).
- The pseudo-element approach reserves space equal to the resting state because it inherits the button's box model dimensions.
- Duplicate activation prevention is a consumer responsibility (applying the loading class and disabling the button), but the CSS class makes the visual feedback consistent.

**Alternatives considered**:
1. Swapping SVG visibility (icon hidden, spinner element shown) — requires two elements in DOM; heavier markup.
2. CSS-only animated gradient background (e.g., shimmer) — less recognizable as a loading state, could be confused with a decorative effect.
3. No loading state — violates FR-005 which explicitly requires loading state support.
4. JS-driven loading timer — violates the no-JS-dependency constraint; purely visual loading feedback does not require JS.

### U2: Default Icon Size for Icon Buttons and Icon Tiles

**Decision**: Three icon sizes — compact (32px), default (44px), large (52px). The default size of 44px matches the WCAG 2.2 minimum touch target recommendation (SC 2.5.8 Target Size minimum 24px; Apple HIG, Material Design, and USWDS all target 44px as the recommended minimum for interactive controls). The compact size (32px) matches the standard USWDS `usa-icon` sizing within toolbar/dense contexts. The large size (52px) accommodates prominent navigation or primary-action icon buttons.

**Rationale**:
- The WCAG 2.5.8 Target Size (AA) minimum is 24x24 CSS pixels — 44px exceeds this by a wide margin.
- The existing `pathable-icon` component (wrapping `usa-icon`) defaults to `1.5em` (approximately 24px in body text) which is too small for a touch target without padding.
- Using fixed pixel sizes (not em-based) ensures consistent touch targets regardless of font-size context. Icon buttons are atomic controls whose target size should be predictable.
- The 44px default aligns with existing `pathable-button` min-height conventions.
- Icon tiles (decorative containers) will match the same three sizes with appropriate internal padding: compact (32px tile, ~20px icon area), default (44px tile, ~28px icon area), large (52px tile, ~36px icon area).

**Alternatives considered**:
1. Single size only (44px) — insufficient for toolbars/compact UIs.
2. Em-based sizing — touch target would vary by context; unpredictable.
3. Sizes following USWDS spacing scale (`units` 4, 5, 6, etc.) — the 44px default aligns with USWDS `units(6)` but the fixed pixel approach is more transparent.

### U3: Segmented Control Keyboard Accessibility

**Decision**: Single-select segmented controls follow the ARIA `radiogroup` pattern using `role="radiogroup"` on the container and `role="radio"` + `aria-checked` on each segment. Arrow key navigation (Left/Right or Up/Down) moves focus between options. Multi-select (toggle button) variants follow the ARIA `toolbar` or `group` pattern with `role="button"` and `aria-pressed` on each segment, navigated via Tab key.

**Rationale**:
- The ARIA Authoring Practices Guide (APG) specifies `radiogroup` for mutually exclusive options within a set — this exactly matches single-select segmented controls.
- The APG specifies `aria-pressed` for toggle buttons that are not mutually exclusive — this matches multi-select segmented controls.
- For single-select: Left/Right arrow navigation with wrapping (from last to first and vice versa) matches user expectations and APG patterns.
- For multi-select: Tab to enter/exit the group, Space to toggle individual items, follows APG toolbar/group patterns.
- The ARIA pattern is documented in examples so consumers can implement it in their framework of choice. The CSS classes handle the visual state; the consumer is responsible for toggling `aria-checked`/`aria-pressed` and managing keyboard event handlers.

**Alternatives considered**:
1. Native `<select>` styling — loses the visual compactness and immediate-availability UX of a segmented control.
2. Custom CSS-only keyboard handling — impossible without JavaScript; the spec accepts that keyboard behavior requires consumer JS (FR-016 says "MUST support keyboard navigation" meaning the CSS must not prevent it, not that CSS provides the JS).
3. Using `<input type="radio">` styling — possible for single-select but not for multi-select toggle buttons; limited styling control.

### U4: Selected vs. Pressed State Distinguishability

**Decision**: The selected (persistent) state uses a visible border/outline change combined with a background tint shift and weight increase, while the pressed (momentary) state uses a drop in elevation (shadow reduction) and no border change. This makes them distinguishable: selected changes the boundary shape, pressed changes the depth.

**Rationale**:
- Color alone is insufficient for distinguishability (FR-003 explicitly requires shape, border, icon, or weight in addition to color).
- Selected state is persistent — a clear boundary marker (e.g., `2px solid` border on the selected side, or an inset border) communicates "this is the current mode."
- Pressed state is momentary and best conveyed via the shadow/elevation change that users already associate with physical button press.
- The existing `pathable-surface--interactive` pattern provides precedent: rest state has `box-shadow: elevation-sm`, hover elevates to `elevation-md`, active drops back to `elevation-sm`. The new selected state adds a distinct border/weight change.
- For segmented controls, the selected segment will additionally use a background fill change (from transparent to surface-color) combined with a subtle border inset and increased font weight — three signals instead of one.

**Alternatives considered**:
1. Icon-only state change (selected shows checkmark) — requires consumer-provided icon; too fragile.
2. Background color change only — violates FR-003 (color alone is insufficient).
3. Underline/bottom-border indicator — common in tab patterns but less appropriate for segmented controls where options are contiguous.

## Best Practice Research

### SCSS Implementation Patterns for Interaction States

**Context**: Interaction states need to be reusable across custom components without copying component-specific selectors.

**Best Practice**:
- Deliver states as an SCSS `%placeholder` (silent class / extend-only class) or a `@mixin` that consumers `@include` in their own selectors. The `@mixin` approach is more flexible because it supports parameterization (e.g., `@include interaction-states($elevate: true, $focus-color: var(--pathable-color-focus-ring))`).
- Each state (hover, focus-visible, focus-within, active, selected, pressed, disabled) becomes a separate mixin or a single combined mixin with named state blocks.
- For consumers who prefer class-based usage (e.g., utility classes), also emit `.pathable-state--hover`, `.pathable-state--focus-visible` etc. as opt-in classes. The primary delivery mechanism is the mixin; classes are secondary.
- Existing `pathable-surface.scss` already implements hover, focus-visible, focus-within, active, and disabled inline via nested selectors. These should be refactored to use the new shared mixins where appropriate.

### Accessibility Patterns for Icon-Only Controls

**Context**: Icon buttons must provide accessible names and visible focus rings on all backgrounds.

**Best Practice**:
- Bare icon buttons (no background) still need a focus ring — use `outline` (not `box-shadow`) for focus to ensure forced-colors mode visibility.
- For inverse surfaces: invert the focus ring color to maintain contrast. Use `mix-blend-mode: difference` or simply change `outline-color` via class modifier.
- Accessible names: the icon button component should document `aria-label`, `aria-labelledby`, and `title` patterns. The CSS does not enforce this — it's a documentation requirement.
- For `forced-colors: active`, use `Outline` or `Highlight` system colors for focus rings.

### Token Reference Mapping

**All tokens needed for this feature**:

| Property | Token(s) |
|---|---|
| Spacing (gap, padding, margins) | `--space-{2,4,8,12,16,24}` |
| Border radius | `--radius-{sm,md,lg,pill}` (4px, 8px, 12px, 9999px) |
| Elevation (shadows) | `--elevation-{none,sm,md}` |
| Surface backgrounds | `--pathable-color-surface` (white), `--pathable-color-bg` (Shilling Silver), `--pathable-color-accent` (Jade), `--pathable-color-text` (PathAble Blue) |
| Borders | `--pathable-color-border`, `--pathable-color-focus-ring` |
| Focus ring | `--pathable-color-focus-ring` |
| Text colors | `--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-on-accent` |
| Danger | `--pathable-color-danger` |
| Breakpoints | `mobile-lg` (480px), `tablet` (640px), `desktop` (1024px) |
| Icon button target sizes | Compact: 32px, Default: 44px, Large: 52px |
| Icon tile sizes | Compact: 32px, Default: 44px, Large: 52px |