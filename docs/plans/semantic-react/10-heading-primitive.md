# 10 — Heading Primitive

Status: DONE

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 4 and Suggested Slice 10

## Scope

Implement `Heading`, a semantic heading primitive with deliberate separation of HTML document-outline level and visual style. Unlike a generic `Text` with a large font, `Heading` ensures the rendered heading element and its visual treatment are intentionally chosen and constrained.

## Includes

- Audit existing SCSS heading styles, tokens, and semantic level-to-style mappings in `@pathable/styles`. Record findings.
- Formalize any missing SCSS heading contracts before exposing React APIs.
- Implement a `Heading` component exported from `@pathable/react`.
- Expose a `level` prop with values `1` through `6`, which controls the rendered HTML heading element (`h1`–`h6`).
- The visual style defaults to matching the `level` (level 2 renders `h2` with heading-2 styles). Optionally support a separate `visualLevel` prop for cases where document outline and visual hierarchy must differ — if included, this must be explicit, constrained to `1`–`6`, and documented with rationale and accessibility guidance.
- No `as` override that would produce a non-heading element — `Heading` is always a heading.
- Merge resolved heading classes, native heading element props (appropriate to the level), consumer `className`, and ref forwarding.
- Unit-test: each level renders the correct heading element with the correct class; `visualLevel` (if included) maps correctly; ref forwarding works; no wrapper elements.
- Evaluate contrast, forced-colors, and theming for each heading level.
- Add Storybook stories: `<Heading level={2}>Creator Studio</Heading>`, all levels, and (if included) `visualLevel` examples.
- Provide accessibility evidence: heading levels are exposed correctly to assistive technology, visual style does not break document outline expectations.

## Excludes

- `Text` variant behavior — `Heading` is a distinct primitive; use `Text` for body text (see [09](./09-text-primitive.md)).
- Tone or color props on `Heading` (headings use the default foreground color; override via `className` if needed).
- Auto-generated heading anchors or IDs.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [09 — Text Primitive](./09-text-primitive.md) (shared typography patterns, SCSS audit context)

## DONE Means

- `Heading` is exported from `@pathable/react`.
- `<Heading level={2}>` renders an `<h2>` with the correct heading style class.
- Every `level` value 1–6 maps to a verified SCSS class.
- If `visualLevel` is included, it is constrained, documented, and accessibility-reviewed.
- Unit tests cover all levels, `visualLevel` (if present), ref forwarding, and edge cases.
- Storybook stories exist and render for all levels.
- Contrast and forced-colors validation evidence is documented.
- Server/client output is identical.
- CI passes.
