# Research: Page Composition Archetypes

**Phase**: 0 — Outline & Research
**Date**: 2026-07-11

## Research Questions & Findings

### RQ-1: Are all required base patterns implemented and available?
**Status**: Confirmed

All patterns required by the four archetypes are already implemented:

| Pattern | Needed By | Status |
|---------|-----------|--------|
| Decorative backgrounds | Marketing landing page | ✅ Implemented as `pathable-decorative-background.scss` |
| Screenshot frames | Marketing landing page | ✅ Implemented as `pathable-screenshot-frame.scss` |
| Bento grids | Marketing landing page, Resource directory | ✅ Implemented as `pathable-bento-grid.scss` |
| Chip rails | Marketing landing page | ✅ Implemented as `pathable-chip-rail.scss` |
| Text highlights | Marketing landing page, Structured workflow | ✅ Implemented as `pathable-text-highlight.scss` |
| Site header | Marketing landing page | ✅ Implemented as `pathable-header.scss` |
| Footer | Marketing landing page | ✅ Implemented as `pathable-footer.scss` |
| Search | Resource directory | ✅ Implemented as `pathable-search.scss` |
| Wayfinder | Resource directory | ✅ Implemented as `pathable-wayfinder.scss` |
| Filter bar | Resource directory | ✅ Implemented as `pathable-filter-bar.scss` |
| Filter pills | Resource directory | ✅ Implemented as `pathable-filter-pill.scss` |
| Resource card | Resource directory | ✅ Implemented as `pathable-resource-card.scss` |
| Pagination | Resource directory | ✅ Implemented as `pathable-pagination.scss` |
| App shell | Operational dashboard | ✅ Implemented as `pathable-app-shell.scss` |
| Dashboard header | Operational dashboard | ✅ Implemented as `pathable-dashboard-header.scss` |
| KPI cards | Operational dashboard | ✅ Implemented as `pathable-kpi-grid.scss` |
| Activity list | Operational dashboard | ✅ Implemented as `pathable-activity-list.scss` |
| Schedule items | Operational dashboard | ✅ Implemented as `pathable-schedule-item.scss` |
| Responsive tables | Operational dashboard | ✅ Implemented via `pathable-table.scss` + `pathable-table-modifiers.scss` |
| Toasts | Operational dashboard | ✅ Implemented as `pathable-toast.scss` |
| Loading/skeleton | Operational dashboard | ✅ Implemented as `pathable-loading.scss` + `pathable-skeleton.scss` |
| Empty states | Operational dashboard, Resource directory | ✅ Implemented as `pathable-empty-state.scss` |
| Bottom navigation | Operational dashboard | ✅ Implemented as part of `pathable-app-shell.scss` (mobile variant exists in Storybook) |
| Step indicator | Structured workflow | ✅ Implemented as `pathable-step-indicator.scss` |
| Workflow panel | Structured workflow | ✅ Implemented as `pathable-workflow-panel.scss` |
| Save status | Structured workflow | ✅ Implemented — custom properties exist |
| Validation summary | Structured workflow | ✅ Implemented as `pathable-summary-box.scss` |
| Form controls | Structured workflow | ✅ Implemented via `pathable-form-controls` bundle |
| Container/Stack/Cluster | All archetypes | ✅ Layout composition bundle exists |

**Decision**: No new SCSS component wrappers are needed. All four archetypes can be composed from existing public CSS classes.

### RQ-2: Does the CSS custom property contract support sufficient token variety for all four archetypes?
**Status**: Confirmed

The `_components-custom-properties.scss` file defines dual `--pathable-*` / `--usa-*` namespaced properties for every component category used. Color, spacing, and typography tokens are derived from USWDS via `uswds-core` functions. No new custom properties are needed — archetypes consume existing tokens at the component level.

**Decision**: Token coverage is adequate.

### RQ-3: Does the existing Storybook configuration support viewport addon, a11y addon, and CSF 3 format?
**Status**: Assumed available per spec assumptions. Verify during Phase 1.

The project uses CSF 3 with `autodocs` tags, string-template `render` functions, and `parameters.docs.description.story` markdown. The existing story structure is well-suited for page compositions.

**Decision**: Storybook configuration matches requirements. Each story follows the existing pattern described in `Container.stories.js` for consistency.

### RQ-4: What synthetic content strategy should be used?
**Status**: Resolved

Use the existing project conventions:
- `placehold.co` for placeholder images (already used in existing stories)
- Lorem ipsum or descriptive placeholder text
- Fake organization/person names for dashboard examples
- No real personal or sensitive information

**Decision**: Adopt existing placeholder patterns observed in stories like `DecorativeBackground`, `BentoGrid`, and `Container`.

## Architecture Decisions

| Decision | Choice | Rationale | Alternatives Considered |
|----------|--------|-----------|------------------------|
| Story organization | One story file per archetype under `stories/marketing-patterns/` | Keeps all new compositions in the already-established marketing-patterns directory alongside existing pattern stories | Separate archetype directory: rejected — adds unnecessary directory nesting |
| HTML composition style | Static HTML template literals in CSF 3 render functions | Matches all existing project stories exactly | JSX/component approach: rejected — project is framework-agnostic |
| Content placeholder images | `placehold.co` with appropriate dimensions | Matches existing story convention | Unsplash/Gravatar: rejected — introduces external dependency; custom SVGs: over-engineering for placeholder content |
| Accessibility verification | Automated Storybook a11y checks + manual zoom/reduced-motion/forced-colors review | Matches project standard from constitution Principle VIII | Dedicated test suite: rejected — Storybook tooling is sufficient for presentation-only compositions |
| Dual viewport variants | One story export per viewport per archetype (desktop + mobile) | Clear naming, independently testable, visual regression-friendly | Responsive story with viewport addon only: rejected — harder to visually regression test a single story at multiple breakpoints |