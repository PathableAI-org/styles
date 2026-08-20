# Implementation Plan: Container Layout Primitive

**Branch**: `047-container-primitive` | **Date**: 2026-08-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/047-container-primitive/spec.md`

## Summary

Implement the `Container` React component — a layout primitive that renders a centered, width-constrained content region with horizontal gutter padding. It consumes the existing `.pathable-container` SCSS contract from `@pathable/styles` and exposes a `size` prop that maps to BEM modifier classes. This is the first polymorphic `as`-prop component in `@pathable/react`, establishing the pattern that future primitives (including `Box`) will follow.

**Technical approach**: A single new component file at `packages/react/src/components/Container/Container.tsx`. Build a local size-class resolver (no shared resolver needed — the `size` prop domain is unique to Container). Use `mergeClasses` for class composition. Implement polymorphic `as` prop typing and ref forwarding using standard React patterns without an external polymorphic library. Apply classes to the single root element only — no wrapper DOM elements.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19

**Primary Dependencies**: `@pathable/styles` (workspace protocol), `@pathable/react` (this package), Vitest, Storybook

**Storage**: N/A

**Testing**: Vitest (component tests), Storybook interaction tests

**Target Platform**: Web — server-side rendering (Next.js/Remix-compatible) and client-side hydration

**Project Type**: Monorepo library — `packages/react` extends `packages/styles`

**Performance Goals**: No measurable impact — component resolves a single class string at render time with no extra DOM nodes

**Constraints**: Zero browser dependencies in resolver code; deterministic server/client output; no extra wrapper DOM elements; no changes to `packages/styles`; no sizing, spacing, typography, color, display, or visibility props

**Scale/Scope**: 1 new component, 1 prop (`size`), 3 supported values, ~40 lines of component code, ~60 lines of test code

**Unknowns**: None. The SCSS contract (`.pathable-container`, `.pathable-container--standard`, `.pathable-container--wide`, `.pathable-container--full`) is verified and ready for consumption. The polymorphic `as` pattern needs to be defined since `Box` does not exist yet — Container establishes it.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- **Changed packages**: `packages/react` only. No changes to `packages/styles`.
- **Owning `packages/styles` contract**: The `.pathable-container` component wrapper in `packages/styles/src/pathable-component-wrappers/pathable-container.scss` defines the base container behavior (full width, `margin-inline: auto` centering, `padding-inline` gutter, border-box) and three modifier classes (`--standard` at 1024px, `--wide` at 1280px, `--full` at 100%).
- **Component naming**: `Container` maps to `pathable-container` following Constitution Principle IV (CamelCase of styles component name, removing `pathable` prefix).
- **Source-first sequencing**: The SCSS contract already exists in `packages/styles`. This feature only adds the React wrapper — no styles changes needed.
- **Semantic and visual parity**: The component applies only existing `@pathable/styles` classes. No private CSS, no style overrides.
- **No wrapper-only styling**: No new CSS or SCSS is introduced. The component is a pure class-name consumer.

### Consumer and Publishable Validation

- **Transitive imports**: `@pathable/styles` is already a workspace dependency of `@pathable/react`. The styles CSS is imported at the React package entrypoint. Consumers get container styles automatically.
- **Type safety**: The `size` prop is a typed union (`'standard' | 'wide' | 'full'`). The polymorphic `as` prop constrains accepted native props per element type. TypeScript generics ensure proper ref typing and prevent void elements.
- **Publishable validation**: One new component export added to the barrel file. No breaking changes.
- **Breaking changes**: None — this is a new component.

### Validation Gates

- **Lint**: ESLint (TypeScript), Prettier. No stylelint changes (no CSS changes). No suppressions needed.
- **Type-check**: `tsc --noEmit` must pass for `packages/react`.
- **Build**: `pnpm build` for `@pathable/react`. `@pathable/styles` is unchanged.
- **Tests**: New component tests for `Container` covering size-to-class mapping, no-wrapper-element assertion, ref forwarding, `as` behavior, empty size, class merging with `className`, and native prop passthrough.
- **Accessibility**: Storybook a11y check passes on Container stories.
- **Package validation**: Additive change — new component export only.

### Story and Interaction Requirements

- Stories are deterministic fixtures (`<Container size="standard">Content</Container>`, etc.) with no uncontrolled randomness, dates, or network calls.
- Container is a layout primitive with no interactive behavior — no interaction tests needed beyond basic rendering verification. Keyboard and focus behavior are inherited from child content, not the Container itself.
- Stories document each `size` value with visible child content to demonstrate centering and gutter padding.

### Accessibility

- Container itself has no interactive behavior, no ARIA roles to communicate, and no focus obligation.
- When `as` is used to render a landmark element (`<main>`, `<nav>`, `<section>`), the semantics are correct by construction — the element tag communicates the landmark role.
- The polymorphic typing prevents `as` on void elements (elements that cannot contain children), avoiding invalid HTML.
- Storybook a11y checks pass on Container stories with no exceptions required.

### Responsive and Resilient States

- The SCSS contract uses fixed max-width values (not breakpoint-dependent). Each `size` renders appropriately at all viewports.
- Long content, constrained containers, and increased text size are handled by the CSS contract's `width: 100%` and `box-sizing: border-box`.
- Container has no loading, empty, error, disabled, or read-only states.

### Visual Regression

- Container stories serve as visual-regression fixtures for each `size` value.
- Visual checks protect: layout (max-width, centering, gutters), structural integrity (no extra wrappers), and spacing behavior.

### Documentation Surface Ownership

- **Storybook**: Primary surface — Container stories document the component and each `size` value.
- **Spec and plan**: This feature's specification and plan are the canonical requirements and design source.
- **Canonical source**: The CSS class contract in `@pathable/styles` → Container component in `packages/react`.

### Cross-Framework Impact

- No changes to `packages/styles` or shared contracts. Only `packages/react` changed.
- React Storybook builds and tests independently.

### Complexity Tracking

- **Polymorphic `as` prop**: Container is the first component in `@pathable/react` to implement the polymorphic `as` pattern. This complexity is justified — Container's role as a layout primitive demands semantic HTML element selection, and the pattern will be reused by `Box` and future primitives. The implementation follows standard React polymorphic patterns without external libraries, keeping the dependency footprint minimal.

## Project Structure

### Documentation (this feature)

```text
specs/047-container-primitive/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: polymorphic pattern and SCSS contract verification
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
│   │   └── Container/
│   │       ├── Container.tsx              # NEW: Component implementation
│   │       └── __tests__/
│   │           └── Container.test.tsx     # NEW: Component tests
│   ├── internal/
│   │   └── resolvers/
│   │       ├── mergeClasses.ts            # Unchanged (class merge utility)
│   │       └── index.ts                   # Unchanged (barrel exports)
│   └── index.ts                           # Modified: add Container export
└── src/stories/
    └── components/
        └── Container/
            └── Container.stories.tsx      # NEW: Storybook stories
```

**Structure Decision**: Single new component in its own `Container/` directory following the established PascalCase naming convention. No changes to internal resolvers — the `size` prop's class mapping is a local string map within the component file. Tests are co-located. Stories follow the existing story directory structure.

## Design Artifacts

- Research decisions: `./research.md`
- Internal object design: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`