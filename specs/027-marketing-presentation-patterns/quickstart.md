# Quickstart: Expressive Marketing and Product-Presentation Patterns

## Overview

This feature adds five CSS composition patterns for marketing and product-presentation pages:
- Decorative backgrounds (gradient, radial glow, texture, organic shape)
- Screenshot frames (plain, browser, phone, dashboard)
- Bento grids (featured, standard, metric, image tiles)
- Chip rails (static overflow + opt-in marquee)
- Text highlights (marker, underline, soft-background)

## Prerequisites

- Node.js (see root `engines.node` range)
- `pnpm` installed globally
- Project dependencies installed: `pnpm install`

## Build

Build the full styles package:

```bash
cd packages/styles
pnpm build
```

This compiles `src/index.scss` to `dist/styles.css` including the new patterns through `pathable-all.scss`.

## Selective Import Verification

Test that individual patterns compile independently:

```bash
cd packages/styles
pnpm exec sass --load-path=node_modules/@uswds/uswds/packages test/selective-import.scss test/selective-import.css
```

Verify only expected classes are present:

```bash
rg '\.pathable-(decorative-bg|screenshot-frame|bento-grid|bento-tile|chip-rail|text-highlight)' test/selective-import.css
```

## Storybook

Start the Storybook server:

```bash
cd packages/styles
pnpm storybook
```

Navigate to the **Marketing Patterns** section to view and interact with all patterns:

- `Marketing Patterns/Decorative Background` — all four background variants with and without animation
- `Marketing Patterns/Screenshot Frame` — plain, browser, phone, and dashboard frame variants
- `Marketing Patterns/Bento Grid` — mixed tile layouts, responsive collapse
- `Marketing Patterns/Chip Rail` — static and marquee variants
- `Marketing Patterns/Text Highlight` — marker, underline, and soft-background variants
- `Marketing Patterns/Combined` — combined examples demonstrating restraint

## Key Files

| File | Purpose |
|------|---------|
| `src/pathable-component-wrappers/pathable-decorative-background.scss` | Decorative background recipes |
| `src/pathable-component-wrappers/pathable-screenshot-frame.scss` | Screenshot presentation frames |
| `src/pathable-component-wrappers/pathable-bento-grid.scss` | Bento collection grid |
| `src/pathable-component-wrappers/pathable-chip-rail.scss` | Chip rail with optional marquee |
| `src/pathable-component-wrappers/pathable-text-highlight.scss` | Text highlight treatments |
| `src/pathable-component-wrappers/pathable-marketing-patterns.scss` | Bundle forwarding all five |
| `src/_components-custom-properties.scss` | CSS custom property token definitions |
| `src/stories/marketing-patterns/` | Storybook stories for each pattern |
| `test/selective-import.scss` | Selective import test |