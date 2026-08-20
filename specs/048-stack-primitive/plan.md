# Implementation Plan: Stack Layout Primitive

**Branch**: `048-stack-primitive` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/048-stack-primitive/spec.md`

## Summary

Implement the `Stack` React component — a layout primitive that renders a vertically-stacked flex container (`flex-direction: column`) with token-based spacing between its immediate children. It consumes the existing `.pathable-stack` SCSS component wrapper and `.pathable-flex-align-*` utility classes from `@pathable/styles`. It exposes a `gap` prop that maps to gap modifier classes, an `align` prop that maps to alignment utility classes, and sizing/external-spacing props from the shared capability system. The component follows the polymorphic `as` and ref-forwarding pattern established by `Container`.

**Technical approach**: A single new component file at `packages/react/src/components/Stack/Stack.tsx`. The `gap` prop uses a local size-to-class record (one-to-one mapping, no resolver module needed). The `align` prop uses the existing `alignItemsClass` resolver from `internal/resolvers/alignment.ts`. Sizing and spacing props use the existing `widthClass`, `maxWidthClass`, and `margin*Class` resolvers from `internal/resolvers/sizing.ts` and `spacing.ts`. Class composition uses `mergeClasses`. Apply all classes to the single root element — no wrapper DOM elements.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19

**Primary Dependencies**: `@pathable/styles` (workspace protocol), `@pathable/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (component tests), Storybook interaction tests

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — component resolves a class string at render time with no extra DOM nodes

**Constraints**: Zero browser dependencies in resolver code; deterministic server/client output; no extra wrapper DOM elements; no changes to `packages/styles`; no typography, color, display, visibility, or child-wrapping props

**Scale/Scope**: 1 new component, 2 new props (`gap`, `align`), 7 existing props shared via `SizingProps`/`SpacingProps`, ~50 lines of component code, ~100 lines of test code

**Unknowns**: None. The SCSS contract (`.pathable-stack`, `.pathable-stack--gap-sm/md/lg/xl`) is verified and ready for consumption. The `.pathable-flex-align-*` utility classes are verified. The polymorphic `as` pattern is established by `Container`. The sizing/spacing resolver infrastructure is complete.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **Changed packages**: `packages/react` only. No changes to `packages/styles`.
- **Owning `packages/styles` contract**: The `.pathable-stack` component wrapper in `packages/styles/src/pathable-component-wrappers/pathable-stack.scss` defines the base stack behavior (`display: flex; flex-direction: column;` with default gap `var(--space-16)`) and four gap modifier classes (`--gap-sm` at 8px, `--gap-md` at 16px, `--gap-lg` at 24px, `--gap-xl` at 32px). The `.pathable-flex-align-{value}` utility classes in `packages/styles/src/_utilities.scss` provide `align-items` values (`center`, `start`, `end`, `stretch`, `baseline`).
- **Component naming**: `Stack` maps to `pathable-stack` following Constitution Principle IV (CamelCase of styles component name, removing `pathable` prefix).
- **Source-first sequencing**: The SCSS contract already exists in `packages/styles`. This feature only adds the React wrapper — no styles changes needed.
- **Semantic and visual parity**: The component applies only existing `@pathable/styles` classes. No private CSS, no style overrides.
- **No wrapper-only styling**: No new CSS or SCSS is introduced. The component is a pure class-name consumer.

### Consumer and Publishable Validation

- **Transitive imports**: `@pathable/styles` is already a workspace dependency of `@pathable/react`. The styles CSS is imported at the React package entrypoint. Consumers get stack styles automatically.
- **Type safety**: The `gap` prop is a typed union (`'sm' | 'md' | 'lg' | 'xl'`). The `align` prop is a typed union (`'start' | 'center' | 'end' | 'stretch' | 'baseline'`). Sizing and spacing props use existing typed unions from `SizingProps`/`SpacingProps`. The polymorphic `as` prop constrains accepted native props per element type.
- **Publishable validation**: One new component export added to the barrel file. No breaking changes.
- **Breaking changes**: None — this is a new component.

### Validation Gates

- **Lint**: ESLint (TypeScript), Prettier. No stylelint changes (no CSS changes). No suppressions needed.
- **Type-check**: `tsc --noEmit` must pass for `packages/react`.
- **Build**: `pnpm build` for `@pathable/react`. `@pathable/styles` is unchanged.
- **Tests**: New component tests for `Stack` covering gap-to-class mapping, align-to-class mapping, sizing/spacing prop mappings, no-wrapper-element assertion, ref forwarding, `as` behavior, missing props, class merging with `className`, and native prop passthrough. A component test verifies the immediate-child layout contract: a wrapper between Stack and its intended children breaks the gap/alignment relationship.
- **Accessibility**: Storybook a11y check passes on Stack stories.
- **Package validation**: Additive change — new component export only.

### Story and Interaction Requirements

- Stories are deterministic fixtures (`<Stack gap="sm"><span>A</span><span>B</span></Stack>`, etc.) with no uncontrolled randomness, dates, or network calls.
- Stories document each `gap` value with visible child content to demonstrate vertical spacing.
- Stories document common alignment combinations (`align="center"`, `align="start"`).
- A nested layout story demonstrates Stack combined with other primitives (e.g., Stack inside Container).
- Stack is a layout primitive with no interactive behavior — no interaction tests needed beyond basic rendering verification. Keyboard and focus behavior are inherited from child content, not the Stack itself.

### Accessibility

- Stack itself has no interactive behavior, no ARIA roles to communicate, and no focus obligation.
- When `as` is used to render a landmark element (`<section>`, `<nav>`, `<main>`), the semantics are correct by construction — the element tag communicates the landmark role.
- The polymorphic typing prevents `as` on void elements (elements that cannot contain children), avoiding invalid HTML.
- Storybook a11y checks pass on Stack stories with no exceptions required.
- When `as="ol"` or `as="ul"` with `<li>` children, the list semantics are preserved and valid.

### Responsive and Resilient States

- The SCSS contract uses fixed gap values (no breakpoint-dependent gaps). Each `gap` renders appropriately at all viewports.
- The `flex-direction: column` behavior is viewport-independent. Children stack vertically at all widths.
- Stack has no loading, empty, error, disabled, or read-only states. An empty Stack renders an empty flex container — valid and non-breaking.
- The `align-items` values interact with the natural cross-axis width of children. Alignment at narrow viewports behaves predictably.

### Visual Regression

- Stack stories serve as visual-regression fixtures for each `gap` value and alignment combination.
- Visual checks protect: layout (vertical stacking, flex-direction column, gap spacing), alignment (cross-axis child positioning), and structural integrity (no extra wrappers, children in document order).

### Documentation Surface Ownership

- **Storybook**: Primary surface — Stack stories document the component, each `gap` value, alignment combinations, and nested compositions.
- **Spec and plan**: This feature's specification and plan are the canonical requirements and design source.
- **Canonical source**: The CSS class contract in `@pathable/styles` → Stack component in `packages/react`.

### Cross-Framework Impact

- No changes to `packages/styles` or shared contracts. Only `packages/react` changed.
- React Storybook builds and tests independently.

### Complexity Tracking

- **gap prop with named scale**: `Stack` uses named gap values (`"sm"`, `"md"`, `"lg"`, `"xl"`) rather than numeric spacing scale indices. This is appropriate because the SCSS contract's modifier classes use these names (`.pathable-stack--gap-sm`, etc.). A numeric API would require a mapping layer not present in the SCSS class names.
- **Multiple resolver domains**: `Stack` combines three resolver domains (local gap record, existing `alignItemsClass`, existing `SizingProps`/`SpacingProps` resolvers) in a single component. This is more complex than `Container` (which uses only a local size record and no shared resolvers) but is justified — `Stack` is a layout primitive and must participate in its parent layout via sizing/spacing, control child alignment, and control child spacing via gap.

## Project Structure

### Documentation (this feature)

```text
specs/048-stack-primitive/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: SCSS contract verification and resolver reuse analysis
├── data-model.md        # Phase 1: Prop-to-class mapping and type design
├── quickstart.md        # Phase 1: Validation guide
├── contracts/           # Phase 1: Component interface contracts
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── components/
│   │   └── Stack/
│   │       ├── Stack.tsx              # NEW: Component implementation
│   │       └── __tests__/
│   │           └── Stack.test.tsx     # NEW: Component tests
│   ├── internal/
│   │   └── resolvers/
│   │       ├── alignment.ts           # Unchanged (alignItemsClass used by Stack)
│   │       ├── sizing.ts              # Unchanged (widthClass, maxWidthClass used by Stack)
│   │       ├── spacing.ts             # Unchanged (margin*Class used by Stack)
│   │       ├── mergeClasses.ts        # Unchanged (class merge utility)
│   │       └── index.ts               # Unchanged (barrel exports)
│   └── index.ts                       # Modified: add Stack export
└── src/stories/
    └── components/
        └── Stack/
            └── Stack.stories.tsx      # NEW: Storybook stories
```

**Structure Decision**: Single new component in its own `Stack/` directory following the established PascalCase naming convention (same as `Container/`). The `gap` prop's class mapping is a local constant within the component file (same pattern as `Container`'s `CONTAINER_SIZE_CLASS`). The `align` prop uses the existing `alignItemsClass` resolver. Sizing and spacing props use existing resolvers. No new resolver modules needed. Tests are co-located. Stories follow the existing story directory structure.

## Design Artifacts

- Research decisions: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`