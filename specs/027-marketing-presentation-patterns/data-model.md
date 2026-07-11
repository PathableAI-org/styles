# Data Model: Expressive Marketing and Product-Presentation Patterns

## Overview

This document describes the visual/structural entities for the marketing and product-presentation compositions. These are CSS-only entities — no runtime data, persistence, or state machines.

---

## Entities

### 1. Decorative Background

A visual background treatment applied to a page section. Renders via CSS pseudo-elements and background properties on the container.

**CSS Class**: `.pathable-decorative-bg` (applied to a container element)

**Modifiers**:

| Modifier | Visual Effect | Motion |
|----------|--------------|--------|
| `.pathable-decorative-bg--gradient` | Quiet gradient from top-left to bottom-right using semantic color variables | Static |
| `.pathable-decorative-bg--glow` | Soft radial glow emanating from center or top-center | Static |
| `.pathable-decorative-bg--texture` | Subtle grain or dot-grid texture overlay | Static |
| `.pathable-decorative-bg--organic` | Organic blob/shape using border-radius | Optional (animate via separate `--animated` modifier) |

**Optional animation modifier**: `.pathable-decorative-bg--animated` — enables gentle float/pulse animation on `--organic` variant. Disabled under `prefers-reduced-motion: reduce`.

**Children**:
- None — applied directly to the consumer's container.

**Accessibility**:
- All decorative pseudo-elements are not rendered in the accessibility tree by default.
- Motion variants are non-essential and disabled under `prefers-reduced-motion`.

---

### 2. Screenshot Frame

A visual container for product images that provides device-context appearance without embedding device assumptions into the image itself.

**CSS Class**: `.pathable-screenshot-frame` (wraps `figure` and `figcaption`)

**Elements**:
| Class | Required | Description |
|-------|----------|-------------|
| `.pathable-screenshot-frame__image` | Yes | The `<img>` element; `object-fit: contain` preserves intrinsic ratio |
| `.pathable-screenshot-frame__caption` | No | Optional `<figcaption>` for captions |

**Modifiers**:
| Modifier | Description |
|----------|-------------|
| *(none / default)* | Plain elevated frame with subtle shadow and rounded corners |
| `.pathable-screenshot-frame--browser` | Browser chrome treatment with top bar, navigation dots, optional URL bar |
| `.pathable-screenshot-frame--phone` | Phone device bezel with rounded corners, notch/dynamic island |
| `.pathable-screenshot-frame--dashboard` | Dashboard-style frame with dark background, grid lines |

**Hover behavior** (when frame is interactive/link):
- Default: slight upward lift (`translateY` + shadow increase)
- Under `prefers-reduced-motion: reduce`: lift disabled, no animation

**Accessibility**:
- Interactive frames receive visible keyboard focus indicators.
- Lightbox trigger controls are focusable and receive visible focus.
- Captions are associated with images via `<figure>` / `<figcaption>`.

---

### 3. Bento Tile

A grid cell within a bento collection grid. The grid as a whole uses CSS Grid with named areas; individual tiles are assigned to grid areas based on their type.

**CSS Class**: `.pathable-bento-grid` (container), `.pathable-bento-tile` (individual tile)

**Tile Types**:

| Type Modifier | Visual Span | Intended Content |
|---------------|-------------|------------------|
| `.pathable-bento-tile--featured` | 2 columns × 2 rows (largest) | Hero content, headline + description |
| `.pathable-bento-tile--standard` | 1 column × 1 row (equal) | Feature description, icon + text |
| `.pathable-bento-tile--metric` | 1 column × 1 row (equal) | Number/statistic + label |
| `.pathable-bento-tile--image` | 1 column × 1 row (equal) | Image/media with overlay text |

**Layout Behavior**:
- CSS Grid uses `grid-template-areas` with named regions for each tile type.
- Featured tile occupies top-left or central position by convention.
- Narrow screens (<768px): all tiles collapse to a single-column layout; featured tile spans full width.

**Accessibility**:
- Visual spans MUST NOT change DOM or keyboard tab order. DOM order follows logical reading sequence; CSS Grid `grid-area` handles visual placement.
- Tiles in DOM order: featured → standard → metric → image (regardless of visual position).

---

### 4. Chip Rail

A horizontal row of chip-style items for categories, tags, or topics. Default is a static row; a marquee variant provides optional auto-scrolling.

**CSS Class**: `.pathable-chip-rail` (container, applied to a wrapping element)

**Elements**:
| Class | Required | Description |
|-------|----------|-------------|
| `.pathable-chip-rail__chip` | Yes | Individual chip item (any element — `<span>`, `<a>`, `<button>`) |

**Modifiers**:
| Modifier | Description |
|----------|-------------|
| *(none / default)* | Static horizontal row with overflow-x: auto or flex-wrap (overflow preferred) |
| `.pathable-chip-rail--marquee` | Auto-scrolling marquee with CSS animation |

**Marquee Behavior**:
- Animation pauses on `:hover` and `:focus-within` via `animation-play-state: paused`.
- Animation stops under `prefers-reduced-motion: reduce`.
- Duplicated content for seamless looping is hidden via `aria-hidden="true"` on the duplicate set.

**Accessibility**:
- Default presentation is static with no motion (FR-013).
- Marquee is opt-in (consumers apply `--marquee` modifier).
- Hidden duplicated content is excluded from assistive technology.

---

### 5. Text Highlight

An inline text treatment applied to a `<span>` or similar inline element for visual emphasis of key copy.

**CSS Class**: `.pathable-text-highlight` (applied to an inline element like `<span>`)

**Modifiers**:

| Modifier | Visual Effect | Key CSS Property |
|----------|--------------|-----------------|
| `.pathable-text-highlight--marker` | Solid highlight behind text (like a marker pen) | `background-size`, `box-decoration-break: clone` |
| `.pathable-text-highlight--underline` | Accent-colored underline beneath text | `border-bottom` |
| `.pathable-text-highlight--soft-bg` | Subtle background-color fill | `background-color`, `box-decoration-break: clone` |

**Behavior**:
- Multi-line: `box-decoration-break: clone` ensures each wrapped line fragment gets the full background treatment.
- Forced-colors mode: `--marker` and `--soft-bg` provide a documented fallback using the `Highlight` system color.

**Accessibility**:
- Highlighted text remains readable across line wraps.
- Visual distinction does not rely on color alone (underline variant provides structural cue; marker variant provides strong contrast).