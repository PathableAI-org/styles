# Quickstart: Page Composition Archetypes

**Phase**: 1 — Design & Contracts
**Date**: 2026-07-11

## Purpose

This quickstart guide helps developers and content creators quickly understand which page archetype to use and how to compose pages from existing public CSS classes.

## Archetype Selection Guide

| If you need... | Start from... |
|----------------|---------------|
| A public-facing product or marketing site | **Marketing Landing Page** |
| A browsable collection of resources with filters and search | **Resource Directory** |
| An internal tools or operations status view | **Operational Dashboard** |
| A guided multi-step form or review flow | **Structured Workflow** |

## Optional Patterns Per Archetype

| Archetype | Required Patterns | Optional Patterns |
|-----------|------------------|-------------------|
| Landing page | Header, hero, footer, layout composition | Decorative backgrounds, screenshot frames, bento grids, chip rails, text highlights, statistics band |
| Resource directory | Search, filter bar, resource cards, pagination | Wayfinder, empty state, sorting |
| Operational dashboard | App shell, KPI cards, responsive table | Activity list, schedule, toasts, loading/skeleton, empty state, bottom navigation |
| Structured workflow | Step indicator, form controls, workflow panel | Save status, validation summary, record header |

## Minimal HTML Structure Pattern

Each archetype follows this general pattern:

```html
<!-- Import the CSS bundle -->
<link rel="stylesheet" href="path/to/styles.css">

<!-- Compose sections using public classes -->
<body class="pathable-container pathable-container--page">
  <header class="pathable-header">...</header>
  <main>
    <section class="pathable-stack pathable-stack--gap-lg">...</section>
    <!-- More sections... -->
  </main>
  <footer class="pathable-footer">...</footer>
</body>
```

## Development Workflow

1. Choose an archetype from the selection guide
2. Open the matching Storybook story for reference HTML
3. Copy the framework-neutral HTML from the story's "Show code" panel
4. Adapt synthetic content to real content
5. Import required bundles (see `contracts/index.md` for import paths)
6. Test with keyboard navigation, zoom, reduced motion, and forced-colors mode

## Related Documentation

- [Feature spec](./spec.md) — full requirements and success criteria
- [Data model](./data-model.md) — composition structure per archetype
- [Interface contracts](./contracts/index.md) — public CSS class API contract
- [Existing patterns](../027-marketing-presentation-patterns/spec.md) — foundational marketing patterns