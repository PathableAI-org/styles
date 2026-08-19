# Implementation Plan: Semantic Utility Type System and Class Resolvers

**Feature Branch**: `044-semantic-prop-foundation`
**Spec**: `specs/044-semantic-prop-foundation/spec.md`
**Created**: 2026-08-19

## Technical Context

### Language & Runtime

TypeScript (strict mode), ESM-only, Node-compatible. All resolver code MUST be pure functions with zero browser globals (`window`, `document`, `DOM` APIs). Target: identical server/client output.

### Package & Workspace

- **Owning package**: `packages/react` (`@pathableai/react` v0.0.4-alpha.2)
- **Runtime dependency**: `@pathableai/styles` (workspace-protocol)
- **Package manager**: pnpm (workspace)

### Existing Patterns

- `src/internal/date-picker/` already demonstrates internal (non-exported) code:
  - Pure utility functions (`dateUtils.ts`) that could serve as a resolver pattern
  - Internal components imported directly by callers, never barrel-exported
  - TypeScript includes `src/` so internal code is type-checked and linted
- `src/index.ts` is the single barrel-export entry; only `components/` are re-exported
- Published artifact is `dist/` only (via `"files": ["dist", "README.md"]`)

### Build Chain

- **Bundler**: Vite (`vite.config.ts`) — `lib` mode, ESM-only, React/ReactDOM/styles externalized
- **Type declarations**: `tsc -p tsconfig.build.json` — emits `.d.ts` to `dist/`
- **Lint**: ESLint on `src/` with `--max-warnings=0`
- **Typecheck**: `tsc -p tsconfig.json --noEmit`

### Test Infrastructure (CRITICAL GAP)

**No unit test runner is configured in `packages/react`.** The repo's testing strategy is exclusively Storybook-based via Playwright (`test:storybook` scripts at root). This feature requires pure-TypeScript unit tests for resolvers — adding a test runner (Vitest) is a prerequisite not currently listed in the spec.

> **NEEDS CLARIFICATION**: Test runner choice. The feature spec requires unit tests for pure resolver functions. The repo has no Vitest/Jest config in any package. Options: (A) Add Vitest to `packages/react` as a devDependency, (B) Use a lightweight Node test runner (node --test), (C) Embed tests in the build/typecheck pipeline as assertions.

### In-Scope Changes (`packages/react` only)

- New files under `src/internal/resolvers/`: type definitions, resolver functions, class-merging utility, conflict policy docs
- New test files under a test directory (location TBD by test runner choice)
- Inventory document in `packages/react/` source
- No changes to `packages/styles`

### Out of Scope

- No React component API changes
- No new React components
- No Storybook stories or Storybook-driven tests
- No `packages/styles` SCSS/CSS modifications

### Key Architectural Decisions (from research)

1. **Test runner**: Vitest (see research.md)
2. **Directory structure**: `src/internal/resolvers/` mirroring the existing `src/internal/` pattern
3. **Naming convention**: `{valueType}Class()` for resolvers (e.g., `widthClass`, `marginAllClass`)
4. **Prefix collision**: `pathable-text` ambiguity resolved by naming resolvers after the CSS property (e.g., `textColorClass`, `textWeightClass`, `textAlignClass`), NOT after the class prefix
5. **Class merging**: `mergeClasses()` utility that composes `componentBase | semanticResolved | consumerClassName`
6. **Conflict policy**: Directional props override shorthand (e.g., `marginTop` + `margin` → directional class wins for that axis)

## Constitution Check

### Principle I: @pathable/styles Is the Authoritative Workspace

**PASS** — This feature adds no new visual contracts. Every resolver maps to an existing `@pathable/styles` utility class. The inventory is derived from existing SCSS source.

### Principle IV: Wrapper Packages Preserve Semantic and Visual Parity

**PASS** — This feature is purely additive (internal types + resolvers). No existing component behavior, semantic HTML, or visual output is changed. The resolvers map to existing class contracts.

### Principle X: Accessibility Is a Release Requirement

**N/A** — This feature produces no rendered UI. Resolvers are pure string transformations. No accessibility gates apply.

### Principle XI: Framework Independence

**PASS** — Resolvers are framework-agnostic pure functions. While they live in `packages/react`, they have zero React dependency. They could be extracted to a shared package later.

### Lint Enforcement

**PASS** — All new code will pass ESLint with `--max-warnings=0`. No lint bypasses are needed.

### Gate Categories

- **Wrapper changes require styles validation**: PASS — Every resolver maps to a verified class in the inventory, which is derived from Styles source
- **Commit discipline**: PASS — All changes are within `packages/react` only

### Visual Regression Protection

**N/A** — No visual output is produced by this feature.

### Architecture SSOT Compliance

**PASS** — Research decisions in `research.md`, data model in `data-model.md`, interfaces in `contracts/`. No constitution facts are relocated.

## Scope (R/M/U/O)

| Level | Scope |
|-------|-------|
| **M: Module** | `packages/react` — internal type system and resolver layer |
| **U: Units** | Inventory document, value types, capability interfaces, resolver functions, class-merging utility, conflict policy, unit tests |

## Design Artifacts

- Research decisions and tradeoffs: `./research.md`
- Data model (value types, interfaces, resolver signatures): `./data-model.md`
- Interface contracts (resolver API contracts): `./contracts/`
- Validation path: `./quickstart.md`