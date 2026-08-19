# Implementation Plan: Card Sizing and Spacing Props

**Branch**: `045-card-sizing-spacing` | **Date**: 2026-08-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/045-card-sizing-spacing/spec.md`

## Summary

Add `width`, `maxWidth`, `margin`, `marginX`, `marginY`, `marginTop`, and `marginBottom` props to the `Card` component using the shared type system and pure resolvers from the semantic-prop foundation (slice 01). This is the architectural proof point: if `Card` accepts typed semantic props, maps them to existing CSS classes, preserves its public markup, and behaves identically during server and client rendering, the core approach is validated.

**Technical approach**: Extend `Card`'s TypeScript interface with `SizingProps` and `SpacingProps` from the internal resolver layer, call the existing `widthClass`, `maxWidthClass`, `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass` resolvers, and use `mergeClasses` to compose required component classes, resolved semantic classes, and consumer `className`.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19

**Primary Dependencies**: `@pathable/styles` (workspace protocol), `@pathable/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (unit + component tests), Storybook interaction tests, React Testing Library

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration, React 19

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — props resolve to class strings at render time, no extra DOM nodes or network calls

**Constraints**: Zero browser dependencies in resolver code; deterministic server/client output; no extra wrapper DOM elements; no existing component behavior changes

**Scale/Scope**: One component (`Card`), 7 new optional props, ~100 lines of code changed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **Changed packages**: `packages/react` only. No changes to `packages/styles`.
- **Owning `packages/styles` contract**: Width, max-width, and margin utility classes are already emitted by `@pathable/styles` (`pathable-width-full`, `pathable-width-auto`, `pathable-maxw-*`, `pathable-margin-*`, etc.).
- **Component naming**: Card is already named as `Card` in `packages/react`, corresponding to the `pathable-card` class in `packages/styles`. No rename.
- **Semantic and visual parity**: Card's existing semantic HTML (`<div>` root, `pathable-card__header`, `pathable-card__body`, `pathable-card__footer` structure), accessibility behavior, class contracts, and design tokens are unchanged. Semantic props only add classes to the root element.

### Consumer and Publishable Validation

- **Transitive imports**: Card already imports `@pathable/styles` CSS through the React package entrypoint. No new assets needed.
- **Type safety**: `SizingProps` and `SpacingProps` are already defined with union types constrained to valid CSS class values. Card's public API is extended with typesafe optional props.
- **Publishable validation**: Not applicable — this is additive only, no exports or entrypoints change.
- **Breaking changes**: None — all existing Card props and behavior are preserved.

### Validation Gates

- **Lint**: ESLint (TypeScript), Prettier, Stylelint (no CSS changes). No suppressions needed.
- **Type-check**: `tsc --noEmit` must pass for `packages/react`.
- **Build**: `pnpm build` for `@pathable/styles` (unchanged) and `@pathable/react`.
- **Tests**: New unit tests for Card prop resolution; existing tests pass.
- **Accessibility**: Storybook a11y check passes on Card stories.
- **Package validation**: Additive change, no package contents change required.

### Story and Interaction Requirements

- Card stories are already deterministic. New stories for sizing/spacing props will be deterministic fixtures (`<Card width="full" />`, `<Card maxWidth="tablet" marginX="auto" />`).
- No interactive behavior change — Card remains a non-interactive container.
- Stories use accessible queries where applicable for the runtime-initialization contract (`packages/storybook-contracts`).
- Stories are deterministic — no dates, random values, or network calls.

### Accessibility

- Card's existing accessible structure is preserved. Semantic props add no new interactive behavior, ARIA roles, or keyboard requirements.
- Static JSX linting passes on Card source; rendered a11y check passes on Card stories.
- No a11y exceptions required.

### Responsive and Resilient States

- Sizing and spacing props affect the root element only; they apply at all viewport sizes identically based on the CSS classes applied.
- Long content, constrained containers, and increased text size are unaffected — Card's internal layout is unchanged.
- No new interactive states (loading, empty, error, disabled, read-only) apply to this feature.

### Visual Regression

- Existing Card stories serve as visual-regression baseline. New sizing/spacing stories provide additional fixtures.
- Visual checks protect: layout (width/max-width), spacing (margin), and structural integrity (no extra wrappers).

### Documentation Surface Ownership

- **Storybook**: Primary surface — new Card sizing/spacing stories document supported props and patterns.
- **Canonical source**: The CSS class contract in `@pathable/styles` → resolver mappings in `packages/react/src/internal/resolvers/` → component adoption in Card. Storybook demonstrates, resolvers verify.

### Cross-Framework Impact

- No changes to `packages/styles` or shared contracts. Only `packages/react` changed.
- React Storybook builds and tests independently.

### Complexity Tracking

- No constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/045-card-sizing-spacing/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: margin-initial-auto and class-merge decisions
├── data-model.md        # Phase 1: Prop-to-class mapping model
├── quickstart.md        # Phase 1: Validation guide
├── contracts/           # Phase 1: Interface contracts
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── components/
│   │   └── Card/
│   │       ├── Card.tsx          # Modified: extend with SizingProps + SpacingProps
│   │       └── __tests__/
│   │           └── Card.sizingSpacing.test.tsx  # NEW: component tests
│   ├── internal/
│   │   └── resolvers/
│   │       ├── index.ts          # Unchanged (already exports sizing/spacing resolvers)
│   │       ├── types.ts          # Unchanged (SizingProps, SpacingProps defined)
│   │       ├── sizing.ts         # Unchanged (widthClass, maxWidthClass)
│   │       ├── spacing.ts        # Potentially modified (add auto to margin resolvers)
│   │       └── mergeClasses.ts   # Unchanged (used by Card)
│   └── stories/
│       └── components/
│           └── Basic/
│               └── Card.stories.tsx  # Modified: add sizing/spacing stories
└── vitest.config.ts
```

**Structure Decision**: Single-package change in `packages/react`. Card gains typed semantic props by importing from the existing internal resolver layer. Resolver changes may be needed to support `marginX="auto"` (see research.md).

## Design Artifacts

- Internal object design: `./data-model.md`
- Validation path: `./quickstart.md`
- Visual validation decisions: `./research.md`