# 13 — Audit of Real Application Layouts

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 5 and Suggested Slice 13

## Scope

Audit real application code that consumes `@pathable/react` to identify repeated layout patterns, common utility-class combinations, and candidates for higher-level composition primitives ([14](./14-promote-composition-patterns.md)). This is a research and documentation feature; no new components ship here.

## Includes

- Search representative application repositories for:
  - Repeated `className` strings combining the same utility classes (e.g. `"pathable-width-full pathable-max-width-desktop pathable-margin-x-auto pathable-padding-x-4"`).
  - Repeated nesting of `Box` and layout primitives with the same prop configurations.
  - Common page-level structures (`header` + `main` + `footer` inside a `Container`).
  - Repeated `Stack` + form-control patterns.
  - Action-bar / button-group arrangements.
- For each identified pattern, record:
  - Frequency (how many occurrences across applications).
  - Intent (what the pattern expresses — page shell, sidebar layout, form layout, action grouping, etc.).
  - Whether the pattern is domain-specific (belongs in an application) or reusable (candidate for `@pathable/react`).
- Produce an audit document listing patterns grouped by category and ranked by frequency and reusability.
- For each reusable candidate, draft a rough API sketch and note any SCSS contracts that would need to exist or be verified.
- Distinguish true composition primitives (layout relationships, shared app shell) from incidental combinations (one-off styling).

## Excludes

- Implementing any new components.
- Modifying existing component APIs.
- Migrating application code.

## Dependencies

- Features [02](./02-card-sizing-spacing.md) through [12](./12-surface-primitive.md) should be substantially complete so the audit evaluates real usage of the new primitives, not just utility-class patterns.

## DONE Means

- An audit document exists in `docs/plans/semantic-react/` (or in the feature branch) listing:
  - Each identified pattern with frequency count, intent, and domain/reusable classification.
  - API sketches for reusable candidates.
  - Notes on SCSS contract gaps or verification needed.
- The document's findings directly inform the candidate list in [14](./14-promote-composition-patterns.md).
- No code changes are required.