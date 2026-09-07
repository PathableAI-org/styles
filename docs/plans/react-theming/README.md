# React Theming — Transition Plan

This document describes how we move from the current state to the end state
defined in [`../react-theming.md`](../react-theming.md). It is a high-level
sequence of phases, ordered by dependency and risk. A separate implementation
plan will break each phase into concrete, testable work items.

> **Source of truth:** the target API and design principles live in
> [`../react-theming.md`](../react-theming.md). This README only describes _how_
> we get there.

---

## Current State (summary)

- `@pathableai/styles` compiles a single `dist/styles.css` with multiple
  scattered `:root` blocks (semantic colors, brand colors, component custom
  properties, utilities).
- `@pathableai/styles` `exports` map points `.` at that one file; there are no
  granular subpath exports for components vs. utilities vs. theme.
- `@pathableai/react`'s entry point has a side-effect `import '@pathableai/styles'`.
- `@pathableai/react` has an internal, well-typed semantic-prop resolver layer,
  including tone types (`TextTone`, `SurfaceTone`, `BorderTone`) that are
  **not** re-exported publicly.
- There is no `ThemeProvider`, no `ThemeConfig` type, no `defaultTheme`, no
  `createTheme`.

## Target State (summary)

- Consumers can pass a typed, partial theme object to a `ThemeProvider` and
  override a handful of colors with no hand-written CSS and no cascade fight.
- The token vocabulary is a public, typed export (`ThemeConfig`, `ThemeColors`,
  `defaultTheme`).
- A `createTheme` helper deep-merges partial input with defaults.
- Semantic tone types are importable from the public entry point.
- `@pathableai/styles` ships granular subpath exports (components / utilities /
  theme), and `@pathableai/react` no longer imports the default theme tokens.
- `--pathable-color-*` declarations are consolidated into a single `:root`
  block.

---

## Sequencing Rationale

The work splits into two layers:

- **Styles package (contract layer)** — consolidates and splits the compiled
  CSS, which hardens the underlying contract the React API will sit on.
- **React package (API layer)** — introduces the typed theming surface.

The React API can technically be built _before_ the styles package is split,
because inline `style` values win the cascade over `:root` regardless of how the
stylesheet is organized. However, doing the styles-package work first:

1. removes the cascade-order ambiguity that makes the current theme hard to
   reason about (the feature request's pain point #5), and
2. makes the "consumer supplies their own theme tokens" path real before the
   React layer depends on it.

For this reason the plan does the **contract-layer consolidation first**, then
the **core API**, then the **wiring/hardening**, and finally **validation and
documentation**.

Backward compatibility is preserved throughout: at every phase boundary the
default _rendered output_ is unchanged. Concretely, a consumer who already
imports `@pathableai/styles` (directly or transitively) must see identical
rendering with no `ThemeProvider`.

One deliberate exception is the Phase 2 entry-point change: `@pathableai/react`
stops implicitly importing the default theme tokens as a side effect (today
`packages/react/src/index.ts` imports `@pathableai/styles` in full). A consumer
who relied on that implicit import without importing `@pathableai/styles`
themselves must add `import '@pathableai/styles'` (or
`@pathableai/styles/theme`). This is a one-line, documented migration — see
feature [05](./05-react-entry-point-wiring.md) — and is a breaking change only
in the sense that the default-token import is no longer implicit.

---

## Feature breakdown

The transition is broken into six PR-sized features, one file each in this
directory. They are ordered by dependency and map onto the phases below.

| #                                          | Feature                                           | Phase | Layer         |
| ------------------------------------------ | ------------------------------------------------- | ----- | ------------- |
| [01](./01-consolidated-theme-token-css.md) | Consolidated theme token CSS and granular exports | 0     | styles        |
| [02](./02-theme-token-types.md)            | Theme token types and vocabulary                  | 1     | react         |
| [03](./03-default-theme-create-theme.md)   | Default theme and `createTheme`                   | 1     | react         |
| [04](./04-theme-provider.md)               | `ThemeProvider`                                   | 1     | react         |
| [05](./05-react-entry-point-wiring.md)     | React entry point wiring                          | 2     | react         |
| [06](./06-theming-documentation.md)        | Theming documentation and end-to-end validation   | 3     | cross-cutting |

Each feature file follows the same Scope / Includes / Excludes / Dependencies /
DONE Means structure used elsewhere in `docs/plans/`.

---

## Phase 0 — Contract consolidation (styles package)

**Goal:** produce a single, legible theme token layer and a splittable stylesheet.

**Key changes:**

1. Consolidate all `--pathable-color-*` declarations into exactly one `:root`
   block in the source SCSS (and therefore the compiled CSS).
2. Split the build output into three entry points:
   - `components.css` — component styles that reference `var(--pathable-*)`
   - `utilities.css` — utility classes
   - `theme-default.css` — the single consolidated `:root` token block
3. Add `exports` subpaths: `./components`, `./utilities`, `./theme`, keeping
   `.` → `dist/styles.css` unchanged as the combined default.

**Deliverables:**

- Consolidated `:root` block(s) in `packages/styles/src/`.
- Updated `sass` build producing the three `dist/*.css` files.
- Updated `packages/styles/package.json` `exports` map.

**Exit criteria:**

- `dist/styles.css` contains exactly one `:root` block for `--pathable-color-*`.
- `dist/components.css`, `dist/utilities.css`, and `dist/theme-default.css` exist
  and, combined, match the current `dist/styles.css` behavior.
- `import '@pathableai/styles'` renders identically to today.

---

## Phase 1 — Theme vocabulary and core API (React package)

**Goal:** introduce the typed theming surface that delivers the bulk of the
ergonomic win (feature request priority items 1–3).

**Key changes:**

1. Define `ThemeColors` and `ThemeConfig` interfaces, and the camelCase →
   kebab-case mapping table (see `../react-theming.md` § CSS Custom Property
   Mapping).
2. Export `defaultTheme` (the complete default color token set).
3. Implement `createTheme(partial)` — pure, deep-merging, validating, returning
   a fully resolved `ThemeConfig`.
4. Implement `ThemeProvider` — a context provider that emits resolved tokens as
   inline CSS custom properties on a wrapper element.
5. Re-export the tone types (`TextTone`, `SurfaceTone`, `BorderTone`) from the
   public entry point.

**Deliverables:**

- New modules under `packages/react/src/` (theme types, `defaultTheme`,
  `createTheme`, `ThemeProvider`).
- Public re-exports from `packages/react/src/index.ts`.

**Exit criteria:**

- A consumer can render with `<ThemeProvider theme={createTheme({ colors: { accent: '#7c3aed' } })}>`.
- Invalid token keys fail at type-check time.
- `createTheme` returns a complete `ThemeConfig`; unspecified tokens fall through
  to defaults.
- `defaultTheme` and the tone types are importable from `@pathableai/react`.

**Dependencies:** none beyond the existing styles package. This phase can be
built and merged independently of Phase 0 if sequencing changes.

---

## Phase 2 — Wiring (React entry point)

**Goal:** make the React package structurally independent of the default theme
token layer, so consumers who supply their own tokens don't fight the cascade.

**Key changes:**

1. Change `@pathableai/react`'s side-effect import from
   `import '@pathableai/styles'` to:

   ```ts
   import '@pathableai/styles/components'
   import '@pathableai/styles/utilities'
   ```

2. Ensure the default path still works: consumers who do **not** use
   `ThemeProvider` must import the theme tokens themselves (either
   `@pathableai/styles/theme` or the full `@pathableai/styles`).

**Deliverables:**

- Updated `packages/react/src/index.ts`.

**Exit criteria:**

- `@pathableai/react` no longer pulls in `--pathable-color-*` declarations via
  its side-effect import.
- A consumer using `ThemeProvider` + `@pathableai/react` sees no default-token
  cascade fight.
- A consumer using `@pathableai/react` + `import '@pathableai/styles'` still
  renders correctly (backward compatibility).

**Dependencies:** Phase 0 (subpath exports) and Phase 1.

---

## Phase 3 — Validation and documentation

**Goal:** prove the new API is correct, safe, and discoverable.

**Key changes:**

1. Add unit tests for `createTheme` (deep merge, validation errors, determinism)
   and `ThemeProvider` (emitted custom properties, scoping, nesting, no-op when
   theme equals defaults).
2. Add Storybook examples demonstrating partial overrides, `defaultTheme`, and
   (if supported) a `colorScheme` switch.
3. Add a SCSS↔TypeScript sync check (lint or test) so a token added to
   `_semantic.scss` without a matching `ThemeColors` key fails the build.
4. Document the token vocabulary (a generated or hand-maintained table answering
   "these are the tokens and what each controls").

**Deliverables:**

- Test coverage under `packages/react/src/**/*.test.ts`.
- Storybook stories in `apps/storybook-react/`.
- Sync-check script or lint rule.
- Docs describing the token list.

**Exit criteria:**

- All acceptance criteria in `../react-theming.md` are demonstrably met.

---

## Consumer-facing change summary

| Before                                                       | After                                                            |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| Hand-write CSS re-declaring `--pathable-color-*` on `:root`  | `createTheme({ colors: {...} })` + `<ThemeProvider theme={...}>` |
| Tokens undiscoverable (reverse-engineered from compiled CSS) | `defaultTheme` + documented `ThemeColors` type                   |
| Typos fail silently                                          | Typos fail at type-check time                                    |
| Global-only, order-dependent overrides                       | Scoped, cascade-free overrides                                   |
| One monolithic stylesheet import                             | Granular `components` / `utilities` / `theme` subpaths           |
| Tone types inaccessible                                      | `TextTone`, `SurfaceTone`, `BorderTone` importable               |

## Risks and mitigations

- **Backward compatibility regression.** Mitigation: the default
  `import '@pathableai/styles'` path and no-`ThemeProvider` rendering are
  invariant at every phase boundary, verified by existing snapshot/Storybook
  coverage.
- **SCSS↔TypeScript drift.** Mitigation: the Phase 3 sync check makes a missing
  `ThemeColors` key a build failure.
- **Inline-style scoping surprises.** Mitigation: `ThemeProvider` renders no
  wrapper when the theme equals `defaultTheme`, and tests assert the exact DOM
  structure.
- **`colorScheme` scope creep.** Mitigation: dark-mode token _generation_ is a
  non-goal; only the hook is provided. A consumer-supplied dark `ThemeColors`
  object is the supported mechanism.
