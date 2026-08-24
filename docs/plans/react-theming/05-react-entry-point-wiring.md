# 05 — React Entry Point Wiring

Status: NOT STARTED

## Parent Plan

[../react-theming.md](../react-theming.md) — Target state § "Granular CSS Subpath Exports" (consumer usage); Transition Plan Phase 2

## Scope

Make `@pathableai/react` structurally independent of the default theme token layer so consumers who supply their own tokens via `ThemeProvider` do not have to fight a cascade-order battle against the package's own stylesheet. This is a small but high-stakes change to the package's side-effect import, gated on backward compatibility.

## Includes

- Change `packages/react/src/index.ts` from the single side-effect `import '@pathableai/styles'` to importing only the structural layers:

  ```ts
  import '@pathableai/styles/components'
  import '@pathableai/styles/utilities'
  ```

- Verify that a consumer who uses `ThemeProvider` + `@pathableai/react` (without importing theme tokens) renders correctly, with tokens provided solely by the provider.
- Verify backward compatibility for the two existing consumer paths:
  - `@pathableai/react` + `import '@pathableai/styles'` (full default path) renders identically to today.
  - `@pathableai/react` + `import '@pathableai/styles/theme'` renders the default tokens.
- Document the required consumer setup for each path (default vs. ThemeProvider-driven) in the package README or a migration note, including the explicit breaking change: consumers who relied on `@pathableai/react`'s implicit side-effect import of `@pathableai/styles` (without importing it themselves) must now add `import '@pathableai/styles'` (or `@pathableai/styles/theme`) to keep the default token layer.
- Add/adjust any package-content or build checks (`publint`/`attw`) so the new subpath imports resolve in the published package.

## Excludes

- Any changes to the `ThemeProvider` component (see [04](./04-theme-provider.md)).
- Removing the `./theme` subpath or the default `.` → `dist/styles.css` mapping.
- Changing token values or component behavior.

## Dependencies

- [01 — Consolidated Theme Token CSS and Granular Exports](./01-consolidated-theme-token-css.md) (subpath exports must exist).
- [04 — ThemeProvider](./04-theme-provider.md) (the provider-driven path this wiring enables).

## DONE Means

- `@pathableai/react`'s entry point no longer imports the default theme token layer.
- A consumer using `ThemeProvider` renders overridden colors with no hand-written CSS and no cascade fight.
- A consumer using `@pathableai/react` + `import '@pathableai/styles'` renders identically to today.
- Package-content checks (`publint`/`attw`) pass for the new subpath imports.
- Documentation states which CSS the consumer must import for the default vs. themed paths.
- CI passes.
