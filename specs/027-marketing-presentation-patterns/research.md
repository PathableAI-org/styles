# Research: Expressive Marketing and Product-Presentation Patterns

## Phase 0: Technical Research and Decision Record

### Decision 1: Composition File Pattern

**Decision**: Each pattern gets its own individual SCSS partial file, following the existing convention (e.g., `pathable-wizard.scss`, `pathable-save-status.scss`). A single bundle file (`pathable-marketing-patterns.scss`) forwards all five partials.

**Rationale**:
- Matches the existing composition pattern (`pathable-structured-workflow.scss` forwards wizard + wizard-actions + workflow-panel + save-status)
- Enables selective imports per FR-020
- Consumers can import individual files or use the all-in-one bundle

**Alternatives considered**:
- Single monolithic file — would violate the selective-import contract pattern
- Placing all patterns in existing bundle files — would mix unrelated concerns

---

### Decision 2: Decorative Background Implementation Strategy

**Decision**: Use CSS pseudo-elements (`::before` on the container) and `background` properties rather than adding wrapper elements. Each variant is a BEM modifier class on an existing container (`.pathable-decorative-bg--gradient`, `--glow`, `--texture`, `--organic`).

**Rationale**:
- Pseudo-elements are naturally removed from the accessibility tree (FR-003) — no `aria-hidden` needed
- No extra markup required from consumers
- Follows the existing modifier-class pattern used in interaction states and page error

**Alternatives considered**:
- Separate wrapper elements — would require consumer markup changes and explicit `aria-hidden`
- SVG background images — would add file dependencies to the package

---

### Decision 3: Screenshot Frame Approach

**Decision**: Use a container element (`.pathable-screenshot-frame`) with a `figure`/`figcaption` structure for semantic association. Frame variants are BEM modifier classes (`--browser`, `--phone`, `--dashboard`, or default plain elevated). The image inside uses `object-fit: contain` to preserve intrinsic ratio. Hover effects use `transform: scale()` with `transition`.

**Rationale**:
- `figure`/`figcaption` provides native semantic association between image and caption (FR-007)
- CSS transforms for hover lift avoid layout reflow
- Motion respects `prefers-reduced-motion` (FR-009)

**Alternatives considered**:
- Browser chrome via CSS borders/box-shadow — works well for simple frames
- SVG frame overlays — more complex, harder to maintain

---

### Decision 4: Bento Grid Layout Strategy

**Decision**: Use CSS Grid with `grid-template-areas` for the bento layout, placing tiles in DOM order with named areas. Featured tiles use larger column/row spans via grid-area assignment. A class-based approach differentiates tile types (`.pathable-bento-tile--featured`, `--standard`, `--metric`, `--image`).

**Rationale**:
- `grid-template-areas` preserves DOM order while allowing visual spans (FR-011)
- CSS Grid collapses naturally on narrow screens by switching to a single column (FR-012)
- No JavaScript required for layout

**Alternatives considered**:
- Flexbox with wrapping — cannot achieve multi-span tile layouts
- Absolute positioning — would risk misalignment and DOM-order issues

---

### Decision 5: Chip Rail Marquee Animation

**Decision**: Use CSS `@keyframes` animation on the chip rail container for the marquee effect. Apply the animation via a separate modifier class (`pathable-chip-rail--marquee`). The animation pauses on `:hover` and `:focus-within` using `animation-play-state: paused`. Reduced motion disables the animation entirely.

**Rationale**:
- CSS-only animation, no JavaScript required (FR-014)
- `:focus-within` handles focus on any child chip
- Duplicated content in the markup is hidden via `aria-hidden="true"` on the duplicate set (FR-015)

**Alternatives considered**:
- JavaScript animation controller — explicitly out of scope per non-goals
- HTML `<marquee>` element — deprecated, inaccessible

---

### Decision 6: Text Highlight Treatment Technique

**Decision**: Use CSS `background` with `background-size` and `background-repeat` properties for marker-style highlights. Underline variant uses `border-bottom`. Soft-background variant uses `background-color` with `box-decoration-break: clone` for proper multi-line wrapping.

**Rationale**:
- `box-decoration-break: clone` is essential for multi-line wrapping (FR-017) — it applies the background to each line fragment individually
- Separates the three variants visually while keeping them inline-level treatments

**Alternatives considered**:
- `<mark>` element for marker style — less flexible for custom colors/branding
- SVG text decoration — over-engineered for simple highlights

---

### Decision 7: Naming Convention for New Patterns

**Decision**: `pathable-{pattern-name}.scss` with BEM classes:
- `.pathable-decorative-bg` / `__*` / `--*`
- `.pathable-screenshot-frame` / `__*` / `--*`
- `.pathable-bento-grid` / `__*` / `--*`
- `.pathable-chip-rail` / `__*` / `--*`
- `.pathable-text-highlight` / `__*` / `--*`

Bundle file: `pathable-marketing-patterns.scss`

**Rationale**: Consistent with existing pattern (`pathable-wizard`, `pathable-workflow-panel`, `pathable-save-status`). Bundle file name follows `pathable-{category}.scss` convention.

**Alternatives considered**:
- Prefixing with `pathable-mkt-` — inconsistent with existing naming
- Single `pathable-expression.scss` — would conflate five distinct concerns