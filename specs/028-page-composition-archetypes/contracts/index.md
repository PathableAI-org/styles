# Interface Contracts: Page Composition Archetypes

**Phase**: 1 — Design & Contracts
**Date**: 2026-07-11

## Contract Type: Public CSS Class API

This project is a CSS/SCSS library. The interface contract is the set of public CSS classes that consumers use to compose pages.

## Consumer Contract

### Import

```scss
// SCSS — import individual bundles
@use '@pathable/styles/src/pathable-component-wrappers/pathable-marketing-patterns';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-layout-composition';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-navigation';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-discovery';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-dashboard';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-structured-workflow';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-communication';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-form-controls';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-empty-state';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-button';
@use '@pathable/styles/src/pathable-component-wrappers/pathable-typography';

// CSS — simplified import (all classes available)
@import '@pathable/styles';
```

### Composition Rule

Compositions MUST:
- Use only classes documented in each bundle's contract
- Placeholder images via `placehold.co` URLs
- Semantic HTML elements (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<table>`)
- Synthetic, non-personal content

Compositions MUST NOT:
- Contain raw hex color values, arbitrary spacing numbers, or one-off custom CSS
- Use inline `style` attributes for layout/spacing (only for specific placeholder content)
- Import USWDS classes directly — go through the `--pathable-*` / `--usa-*` namespaced wrappers

### Bundle Contracts Per Archetype

See `data-model.md` for the full composition structure model. Each bundle's exact class names are documented in the existing SCSS source files under `packages/styles/src/pathable-component-wrappers/`.

## Testability Contract

Each story:
- Exports at minimum a desktop and mobile variant
- Passes automated Storybook a11y checks (axe-core via storybook-addon-a11y)
- Has framework-neutral semantic HTML available alongside the rendered story
- Links to component/pattern documentation used

## Sequence: No Cross-Boundary Interaction

These are presentation-only compositions. There are no async flows, retry logic, rollback scenarios, or failure paths to document. The compositions render synchronously from static HTML/CSS.