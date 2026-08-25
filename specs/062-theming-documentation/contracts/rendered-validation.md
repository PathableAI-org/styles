# Interface Contract: Rendered End-to-End Validation

This contract defines the rendered proof that a partial theme resolves correctly, stays scoped, and
preserves backward compatibility. It is satisfied by a Storybook story + a browser-executed
assertion (spec FR-006/FR-007/FR-008/FR-009).

## Story contract

Location: `packages/react/src/stories/components/theme/ThemeProvider.stories.tsx` (extended).

- A deterministic, named story renders the React `AppShell` (representative layout) wrapped in
  `<ThemeProvider theme={brand}>` where `brand = createTheme({ colors: { accent: '#7c3aed',
  actionPrimaryBg: '#7c3aed' } })` — the same partial theme as the existing fixture.
- The story is deterministic: fixed colors, synthetic content, no dates/randomness/network
  (constitution XIV).
- The story carries a documentation description explaining intent (partial-theme resolution proof).

## Resolution assertions (browser, via `getComputedStyle`)

The assertion runs in `apps/storybook-react/.storybook/test-runner.js`, keyed to the new story id,
alongside the existing axe hook. It MUST assert:

1. **Overridden tokens resolve to provided values** (FR-006): for a rendered element that references
   `--pathable-color-accent` (or `--pathable-color-action-primary-bg`),
   `getComputedStyle(el).getPropertyValue('…')` equals `#7c3aed`.
2. **Unspecified tokens resolve to defaults** (FR-007): for a rendered element that references a
   non-overridden token (e.g. `--pathable-color-text`), the computed value equals
   `defaultTheme.colors.text` (`#00365c`).
3. **Subtree scoping** (FR-008): an element inside the provider subtree resolves the override,
   while a sibling element outside the subtree resolves the default.
4. **No-wrapper default path** (backward-compat supplement): a `ThemeProvider` with `defaultTheme`
   (or omitted) renders children directly with no wrapper element — confirming the default path is
   structurally unchanged.

Where a token has no convenient rendered consumer, the assertion inspects the provider wrapper's
inline custom property and documents that limitation in a comment.

## Backward-compatibility verification (FR-009)

No-provider rendering is identical to the pre-theming state. This is evidenced by:

- `pnpm test:visual` — visual smoke over canonical stories (all rendered with no `ThemeProvider`).
- `pnpm test:storybook-react` — story contract + axe over the no-provider stories.
- The no-wrapper assertion above (a `ThemeProvider` with `defaultTheme` renders identically to no
  provider).

No bespoke "pre-theming" snapshot is created; the existing stable-story baseline is the reference.

## Measurement rules

- Use `getComputedStyle`, never `element.style` (which reads only inline declarations), for the
  resolution assertions.
- Prefer accessible, observable selectors (role/label/visible text) to reach the element under
  test; avoid `data-testid` where a semantic query suffices (constitution XIV).

## Relationship to other contracts

- Theme emission/scoping semantics: 060 [`theme-provider.md`](../../060-theme-provider/contracts/theme-provider.md).
- Partial→complete resolution: 059 [`create-theme.md`](../../059-default-theme-create-theme/contracts/create-theme.md).
- Default values: 059 [`default-theme.md`](../../059-default-theme-create-theme/contracts/default-theme.md).
