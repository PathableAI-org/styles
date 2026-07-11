# Contracts: Expressive Marketing and Product-Presentation Patterns

## Public CSS Class Namespace

All classes are prefixed with `pathable-` following project-wide convention.

### Decorative Background

| Class | Purpose | Applied to |
|-------|---------|------------|
| `.pathable-decorative-bg` | Base class — establishes pseudo-element layer | Any section/container |
| `.pathable-decorative-bg--gradient` | Quiet gradient treatment | Same element |
| `.pathable-decorative-bg--glow` | Radial glow treatment | Same element |
| `.pathable-decorative-bg--texture` | Subtle texture/grain overlay | Same element |
| `.pathable-decorative-bg--organic` | Organic shape treatment | Same element |
| `.pathable-decorative-bg--animated` | Optional gentle float/pulse animation | Same element (adds animation to `--organic`) |

### Screenshot Frame

| Class | Purpose | Applied to |
|-------|---------|------------|
| `.pathable-screenshot-frame` | Base class — establishes frame container | `<figure>` element |
| `.pathable-screenshot-frame__image` | Contained image | `<img>` element |
| `.pathable-screenshot-frame__caption` | Optional caption | `<figcaption>` element |
| `.pathable-screenshot-frame--browser` | Browser chrome variant | Same `<figure>` element |
| `.pathable-screenshot-frame--phone` | Phone bezel variant | Same `<figure>` element |
| `.pathable-screenshot-frame--dashboard` | Dashboard-frame variant | Same `<figure>` element |

### Bento Grid

| Class | Purpose | Applied to |
|-------|---------|------------|
| `.pathable-bento-grid` | Grid container | `<section>` or `<div>` wrapper |
| `.pathable-bento-tile` | Individual tile | Each cell `<div>` |
| `.pathable-bento-tile--featured` | Featured / hero tile | Same tile element |
| `.pathable-bento-tile--standard` | Standard equal tile | Same tile element |
| `.pathable-bento-tile--metric` | Metric (number+label) tile | Same tile element |
| `.pathable-bento-tile--image` | Image-emphasis tile | Same tile element |

### Chip Rail

| Class | Purpose | Applied to |
|-------|---------|------------|
| `.pathable-chip-rail` | Base class — establishes horizontal chip row | `<div>` wrapper |
| `.pathable-chip-rail__chip` | Individual chip item | `<span>`, `<a>`, or `<button>` |
| `.pathable-chip-rail--marquee` | Optional auto-scrolling marquee variant | Same wrapper element |

### Text Highlight

| Class | Purpose | Applied to |
|-------|---------|------------|
| `.pathable-text-highlight` | Base class — establishes inline treatment | `<span>` element |
| `.pathable-text-highlight--marker` | Marker/highlighter-pen style | Same element |
| `.pathable-text-highlight--underline` | Accent underline style | Same element |
| `.pathable-text-highlight--soft-bg` | Subtle background fill style | Same element |

---

## CSS Custom Properties

Dual naming: each property has a `--pathable-` (primary) and `--usa-` (backward-compat alias) variant.

### Decorative Background

| Custom Property | Default | Description |
|----------------|---------|-------------|
| `--pathable-decorative-bg-gradient` | via `color('primary-lighter')` + `color('primary-lightest')` | Gradient endpoint colors |
| `--pathable-decorative-bg-glow-color` | via `color('primary-light')` | Glow color |
| `--pathable-decorative-bg-glow-size` | via `units('mobile')` | Glow radial size |
| `--pathable-decorative-bg-organic-color` | via `color('primary-lighter')` | Organic shape fill color |
| `--pathable-decorative-bg-organic-size` | 300px | Organic shape dimensions |
| `--pathable-decorative-bg-opacity` | 0.15 | Default opacity for decorative layers |

### Screenshot Frame

| Custom Property | Default | Description |
|----------------|---------|-------------|
| `--pathable-screenshot-frame-radius` | `radius('md')` | Frame border-radius |
| `--pathable-screenshot-frame-shadow` | Custom box-shadow | Frame elevation |
| `--pathable-screenshot-frame-hover-lift` | `-4px` | Hover translateY offset |

### Bento Grid

| Custom Property | Default | Description |
|----------------|---------|-------------|
| `--pathable-bento-gap` | `units(2)` | Gap between tiles |
| `--pathable-bento-tile-radius` | `radius('md')` | Tile border-radius |
| `--pathable-bento-tile-padding` | `units(3)` | Tile internal padding |

### Chip Rail

| Custom Property | Default | Description |
|----------------|---------|-------------|
| `--pathable-chip-rail-gap` | `units(1)` | Gap between chips |
| `--pathable-chip-rail-chip-radius` | `radius('md')` | Chip border-radius |
| `--pathable-chip-rail-chip-padding-x` | `units(1.5)` | Chip horizontal padding |
| `--pathable-chip-rail-chip-padding-y` | `units(0.5)` | Chip vertical padding |
| `--pathable-chip-rail-marquee-speed` | `30s` | Duration of one marquee cycle |

### Text Highlight

| Custom Property | Default | Description |
|----------------|---------|-------------|
| `--pathable-text-highlight-marker-color` | `color('primary-lighter')` | Marker highlight color |
| `--pathable-text-highlight-underline-color` | `color('primary')` | Underline accent color |
| `--pathable-text-highlight-soft-bg-color` | `color('primary-lightest')` | Soft background color |
| `--pathable-text-highlight-underline-height` | `2px` | Underline thickness |

---

## Selective Import Paths

Each pattern can be imported individually:

```scss
// Individual imports
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-decorative-background';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-screenshot-frame';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-bento-grid';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-chip-rail';
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-text-highlight';
```

Or as a combined set:

```scss
// Combined import
@forward '@pathable/styles/src/pathable-component-wrappers/pathable-marketing-patterns';
```

---

## Compilation Contract

- All patterns compile via the existing `pnpm build` pipeline (Dart Sass with `--load-path=node_modules/@uswds/uswds/packages`).
- Selective imports compile independently without producing classes from unrelated components.
- The bundle file `pathable-marketing-patterns.scss` is forwarded from `pathable-all.scss` to be included in the all-in-one build.