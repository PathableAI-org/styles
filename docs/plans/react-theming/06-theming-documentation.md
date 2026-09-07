# 06 — Theming Documentation and End-to-End Validation

Status: NOT STARTED

## Parent Plan

[../react-theming.md](../react-theming.md) — Target state § "Acceptance Criteria"; Transition Plan Phase 3

## Scope

Prove the complete theming API is correct, safe, and discoverable, and close out every acceptance criterion in the parent plan. This feature ships no new runtime surface; it adds the documentation, cross-cutting checks, and end-to-end evidence that tie features 01–05 into a verified, usable whole.

## Includes

- Produce a token vocabulary reference (a table answering "these are the tokens and what each controls") mapping each `ThemeColors` key to its `--pathable-color-*` property, default value, and role.
- Write a short consumer guide: how to override a few colors with `createTheme` + `ThemeProvider`, how to extend `defaultTheme` directly, and how to choose between the default CSS import and the provider-driven path.
- Add an end-to-end test (Storybook-driven or a small integration test) that renders a representative layout with a partial theme and asserts the resolved colors.
- Verify the full acceptance criteria from the parent plan, including:
  - Invalid keys fail at type-check time.
  - Overrides are scoped to the provider subtree.
  - `defaultTheme` and the full token list are exported and documented.
  - Tone types are importable from the public entry point.
  - Components/utilities CSS can be imported without the default theme tokens.
- Confirm backward compatibility one final time: with no `ThemeProvider`, all existing components render identically to before features 01–05.

## Excludes

- New token categories or new components.
- Dark-mode token generation.
- Removing or renaming any existing component or export.

## Dependencies

- [01](./01-consolidated-theme-token-css.md), [02](./02-theme-token-types.md), [03](./03-default-theme-create-theme.md), [04](./04-theme-provider.md), and [05](./05-react-entry-point-wiring.md) (this feature validates their combined result).

## DONE Means

- The token vocabulary reference and consumer guide exist under `docs/`.
- An end-to-end test demonstrates a partial theme rendering resolved colors.
- Every acceptance criterion in [../react-theming.md](../react-theming.md) is checked off or explicitly addressed.
- Backward compatibility is verified (no-theme rendering is identical to the pre-theming state).
- CI passes.
