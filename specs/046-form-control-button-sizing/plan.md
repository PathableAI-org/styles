# Implementation Plan: Form Controls and Button Adopt Sizing Props

**Branch**: `046-form-control-button-sizing` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/046-form-control-button-sizing/spec.md`

## Summary

Add `width` and `maxWidth` semantic sizing props to the `Button`, `Input`, `Select`, and `Textarea` components using the shared `SizingProps` interface and `widthClass`/`maxWidthClass` resolvers from the semantic-prop foundation (slice 01). Each component adopts `mergeClasses` for class composition and applies sizing classes to its owned root element — no wrapper DOM elements are introduced.

**Technical approach**: For each component, extend its TypeScript interface with `SizingProps`, switch from manual class construction (array-join or template-literal) to `mergeClasses`, call `widthClass(width)` and `maxWidthClass(maxWidth)` resolvers, and place resolved classes between the component's base class and the consumer `className`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19

**Primary Dependencies**: `@pathable/styles` (workspace protocol), `@pathable/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (component tests), Storybook interaction tests

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — props resolve to class strings at render time, no extra DOM nodes

**Constraints**: Zero browser dependencies in resolver code; deterministic server/client output; no extra wrapper DOM elements; no changes to `packages/styles`; no padding, margin, display, visibility, typography, or color props

**Scale/Scope**: 4 components (`Button`, `Input`, `Select`, `Textarea`), 2 new optional props per component, ~20 lines of code change per component

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **Changed packages**: `packages/react` only. No changes to `packages/styles`.
- **Owning `packages/styles` contract**: Width and max-width utility classes are already emitted by `@pathable/styles` (`pathable-width-full`, `pathable-width-auto`, `pathable-maxw-{mobile,mobile-lg,tablet,desktop}`).
- **Component naming**: `Button` corresponds to `pathable-button`, `Input` to `pathable-input`, `Select` to `pathable-select`, `Textarea` to `pathable-textarea` — all already follow the CamelCase naming convention.
- **Semantic and visual parity**: All existing component semantic HTML, accessibility behavior, class contracts, design tokens, and visual behavior are preserved. Sizing props only add classes to the root element.

### Consumer and Publishable Validation

- **Transitive imports**: Each component is already self-contained within `@pathable/react`. No new assets are needed; `@pathable/styles` is a transitive dependency.
- **Type safety**: `SizingProps` is already defined with union types constrained to valid CSS class values. Component public APIs are extended with typesafe optional props.
- **Publishable validation**: Not applicable — this is additive only, no exports or entrypoints change.
- **Breaking changes**: None — all existing props and behavior are preserved. Sizing props are purely optional.

### Validation Gates

- **Lint**: ESLint (TypeScript), Prettier. No stylint changes (no CSS changes). No suppressions needed.
- **Type-check**: `tsc --noEmit` must pass for `packages/react`.
- **Build**: `pnpm build` for `@pathable/styles` (unchanged) and `@pathable/react`.
- **Tests**: New component tests for each adopted component's sizing-prop behavior.
- **Accessibility**: Storybook a11y check passes on sizing stories for each component.
- **Package validation**: Additive change, no package contents change required.

### Story and Interaction Requirements

- Existing component stories are already deterministic. New sizing stories will be deterministic fixtures (`<Button width="full" />`, etc.).
- Interactive components (`Button`) must preserve existing keyboard and focus behavior in sizing stories.
- Stories use accessible queries where applicable.
- Stories are deterministic — no dates, random values, or network calls.

### Accessibility

- Existing accessible structure is preserved for every component. Sizing props add no new interactive behavior, ARIA roles, or keyboard requirements.
- Static JSX linting passes on all component source files; rendered a11y check passes on sizing stories.
- Interactive components (`Button`, `Input`, `Select`, `Textarea`) preserve existing keyboard, focus, disabled-state, and form association behavior.
- No a11y exceptions required.

### Responsive and Resilient States

- Sizing props affect the root element only; they apply at all viewport sizes based on the CSS classes applied (width/max-width breakpoint classes are inherently responsive).
- Long content, constrained containers, and increased text size are unaffected — component internal layout is unchanged.
- Disabled, focus, and read-only states are preserved for all components.

### Visual Regression

- Existing component stories serve as visual-regression baseline. New sizing stories provide additional fixtures.
- Visual checks protect: layout (width/max-width), structural integrity (no extra wrappers), and existing visual behavior.

### Documentation Surface Ownership

- **Storybook**: Primary surface — new sizing stories document the `width` and `maxWidth` props per component.
- **Capability matrix**: Records support status for each component/prop combination.
- **Canonical source**: The CSS class contract in `@pathable/styles` → resolver mappings in `packages/react/src/internal/resolvers/` → component adoption.

### Cross-Framework Impact

- No changes to `packages/styles` or shared contracts. Only `packages/react` changed.
- React Storybook builds and tests independently.

### Complexity Tracking

- No constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/046-form-control-button-sizing/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: component audit and merge strategy
├── data-model.md        # Phase 1: Prop-to-class mapping per component
├── quickstart.md        # Phase 1: Validation guide
├── contracts/           # Phase 1: Component sizing contracts
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx              # Modified: extend SizingProps, adopt mergeClasses
│   │   │   └── __tests__/
│   │   │       └── Button.sizing.test.tsx  # NEW
│   │   ├── Input/
│   │   │   ├── Input.tsx               # Modified: extend SizingProps, adopt mergeClasses
│   │   │   └── __tests__/
│   │   │       └── Input.sizing.test.tsx   # NEW
│   │   ├── Select/
│   │   │   ├── Select.tsx              # Modified: extend SizingProps, adopt mergeClasses
│   │   │   └── __tests__/
│   │   │       └── Select.sizing.test.tsx  # NEW
│   │   └── Textarea/
│   │       ├── Textarea.tsx            # Modified: extend SizingProps, adopt mergeClasses
│   │       └── __tests__/
│   │           └── Textarea.sizing.test.tsx # NEW
│   ├── internal/
│   │   └── resolvers/
│   │       ├── index.ts                # Unchanged (already exports SizingProps, widthClass, maxWidthClass)
│   │       ├── types.ts                # Unchanged (SizingProps defined)
│   │       ├── sizing.ts               # Unchanged (widthClass, maxWidthClass)
│   │       └── mergeClasses.ts         # Unchanged (mergeClasses utility)
│   └── stories/
│       └── components/
│           └── Basic/
│               ├── Button.stories.tsx       # Modified: add sizing story
│               ├── Input.stories.tsx        # Modified: add sizing story
│               ├── Select.stories.tsx       # Modified: add sizing story
│               └── Textarea.stories.tsx     # Modified: add sizing story
└── vitest.config.ts
```

**Structure Decision**: Single-package change in `packages/react`. Four existing components gain typed sizing props by importing from the existing internal resolver layer. No new files in the resolver directory. Component test files are co-located with their components following established patterns.

## Design Artifacts

- Research decisions: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`