# Acceptance verification record

This record closes out the 11 acceptance criteria in the parent theming plan
([`docs/plans/react-theming.md`](../../plans/react-theming.md), "Acceptance
Criteria"). Each criterion is marked satisfied with an evidence pointer. The
runtime surface was delivered by features 057 through 061; this feature (062)
verifies and documents it rather than rebuilding it.

## Parent acceptance criteria

| #   | Criterion                                                                                                                                | Status    | Evidence                                                                                                                                                                                                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | A consumer can pass a typed, partial color theme to `ThemeProvider` and see the resolved colors render with no hand-written CSS          | Satisfied | Rendered test: `AppShellUnderPartialTheme` story plus browser assertion in `apps/storybook-react/.storybook/test-runner.js` (FR-006); `specs/060-theme-provider/contracts/theme-provider.md`                                                 |
| 2   | Invalid token keys fail at type-check time, not silently at runtime                                                                      | Satisfied | `pnpm --filter @pathableai/react typecheck` (the mapped `ThemeColors`/`DeepPartial<ThemeConfig>` type rejects unknown keys via excess-property checking); `tokens.test.ts` asserts `themeColorToken('accentColour')` is `undefined` (FR-011) |
| 3   | Overrides are scoped to the provider subtree; components outside render with defaults                                                    | Satisfied | Rendered test scoping assertion (`outsideAccent` resolves `#1cae96`), FR-008                                                                                                                                                                 |
| 4   | `defaultTheme` is exported and contains the complete default color token set                                                             | Satisfied | `packages/react/src/theme/__tests__/defaultTheme.test.ts` (25 keys); `specs/059-default-theme-create-theme/contracts/default-theme.md` (FR-012)                                                                                              |
| 5   | `createTheme` deep-merges partial input with defaults and returns a fully resolved `ThemeConfig`                                         | Satisfied | `packages/react/src/theme/__tests__/createTheme.test.ts`; `specs/059-default-theme-create-theme/contracts/create-theme.md`                                                                                                                   |
| 6   | `TextTone`, `SurfaceTone`, and `BorderTone` are importable from the public entry point                                                   | Satisfied | `pnpm --filter @pathableai/react check:types` (attw); `specs/058-theme-token-types/contracts/tone-exports.md` (FR-013)                                                                                                                       |
| 7   | A consumer can import `@pathableai/styles/components` and `@pathableai/styles/utilities` without also importing the default theme tokens | Satisfied | `pnpm test:next-consumer`; `specs/061-react-entry-point-wiring/contracts/styles-subpaths.md` (FR-014)                                                                                                                                        |
| 8   | `@pathableai/react` no longer imports the default theme tokens via its side-effect import                                                | Satisfied | `pnpm test:next-consumer`; `specs/061-react-entry-point-wiring/contracts/react-entry-point.md`                                                                                                                                               |
| 9   | The `--pathable-color-*` declarations are consolidated into a single `:root` block                                                       | Satisfied | `pnpm lint:tokens`; `specs/057-package-exports/contracts/package-exports.md`                                                                                                                                                                 |
| 10  | All existing components render identically when no `ThemeProvider` is present                                                            | Satisfied | `pnpm test:visual` plus `pnpm test:storybook-react` over the no-provider stories (FR-009)                                                                                                                                                    |
| 11  | All existing components render identically when wrapped in a `ThemeProvider` with `defaultTheme`                                         | Satisfied | `specs/060-theme-provider/contracts/theme-provider.md` no-wrapper optimization; rendered test (d), the `Default` story renders no wrapper                                                                                                    |

## Cross-cutting verification gates

These gates were run to confirm the evidence pointers above are current:

```text
pnpm lint:tokens                              # 25-key set: SCSS vs THEME_COLOR_KEYS
pnpm --filter @pathableai/react typecheck     # FR-011: invalid keys rejected at type-check
pnpm --filter @pathableai/react check:types   # FR-013: tone types importable (attw)
pnpm test:next-consumer                       # FR-014: structural subpaths independent
pnpm test:storybook-react                     # FR-006/007/008/009 + a11y
pnpm test:visual                              # FR-009: no-provider visual smoke
```

## No new runtime surface (FR-015)

This feature changes only `docs/`, story files, and the Storybook test-runner
config. It adds no token categories, no components, no dark-mode tokens, and
renames or removes no component or export.
