# 09 — Text Primitive

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 4 and Suggested Slice 9

## Scope

Implement `Text`, a typographic primitive that lets applications express semantic text roles (`body`, `small`, `caption`, etc.) rather than raw font or palette values.

## Includes

- Audit existing SCSS typography tokens, text utility classes, and semantic roles in `@pathable/styles`. Record findings.
- Formalize any missing semantic typography classes or tokens in `@pathable/styles` before exposing React APIs. If SCSS work is needed, it becomes a prerequisite task in this feature's implementation.
- Implement a `Text` component exported from `@pathable/react`.
- Default rendered element is `p` (a suitable block-level text element), supporting `as` for `span`, `label`, `figcaption`, and other valid inline/block text elements.
- Expose a `variant` prop with validated values: `"body"`, `"small"`, `"caption"`, and additional roles verified from the SCSS audit.
- Expose a `tone` prop with semantic values: `"default"`, `"muted"`, `"danger"`, `"success"`, and additional tones verified from SCSS.
- Map React semantic roles to SCSS typography classes deterministically.
- Merge resolved typography classes, native element props (appropriate to the selected element), consumer `className`, and ref forwarding.
- Unit-test: each variant maps to the correct class; each tone maps to the correct class; `as` changes the rendered element and restricts valid native props; ref forwarding works; no extra wrapper elements.
- Evaluate contrast, forced-colors behavior, and theming impact for each supported variant/tone combination.
- Add Storybook stories: `<Text variant="body">`, `<Text variant="small" tone="muted">`, `<Text variant="caption" tone="danger">`.
- Provide accessibility evidence for supported roles (semantic element choice, contrast, forced-colors).

## Excludes

- `Heading` — that is a separate feature (see [10](./10-heading.md)).
- `Surface` tone modeling.
- Raw font size, font weight, line height, or font family props — these are non-semantic escape hatches that `className` and `style` already provide.

## Dependencies

- [01 — Semantic Utility Type System and Class Resolvers](./01-semantic-prop-foundation.md)
- [04 — Box Primitive](./04-box-primitive.md) (polymorphic patterns, class merging)

## DONE Means

- `Text` is exported from `@pathable/react`.
- `<Text variant="body">` renders a `<p>` with the correct typography class.
- `<Text variant="small" tone="muted">` renders with the correct variant and tone classes.
- Every supported `variant` and `tone` value maps to a verified SCSS class.
- Audit document exists in the feature branch recording which SCSS contracts support which roles.
- Unit tests cover variant/tone combinations, `as`/ref behavior, and edge cases (unknown variant, missing tone).
- Storybook stories exist and render.
- Contrast and forced-colors behavior is validated (evidence documented in the feature branch or as a checklist item).
- Server/client output is identical.
- CI passes.