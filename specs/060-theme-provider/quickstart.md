# Quickstart: Validating ThemeProvider

This guide proves the feature works end-to-end. It exercises token emission, scoping, the
no-wrapper default path, nesting precedence, `as`/ref behavior, and the `colorScheme` no-op. Full
contracts live in [`contracts/theme-provider.md`](./contracts/theme-provider.md) and the domain
model in [`data-model.md`](./data-model.md).

## Prerequisites

- Repo checked out on branch `060-theme-provider`.
- `pnpm` (see root `package.json` `packageManager` / `engines.node`).
- Dependencies installed: `pnpm install`.

## 1. Emission and scoping (Story 1)

Run the react unit tests:

```bash
pnpm --filter @pathableai/react test:unit
```

Expected: the `ThemeProvider.test.tsx` suite passes, asserting that a partial theme
(`createTheme({ colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' } })`) renders a wrapper
whose `style` declares `--pathable-color-accent: #7c3aed`,
`--pathable-color-action-primary-bg: #7c3aed`, and the other 23 tokens at defaults — and that the
wrapper is the only element carrying those properties (scoping).

Spot-check the emitted surface:

```tsx
import { ThemeProvider, createTheme } from '@pathableai/react'

const brand = createTheme({ colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' } })
// <ThemeProvider theme={brand}>…</ThemeProvider>
//   renders <div style={{ '--pathable-color-accent': '#7c3aed',
//                        '--pathable-color-action-primary-bg': '#7c3aed',
//                        …23 more tokens… }}>…</div>
```

## 2. No-wrapper default path (Story 1 acceptance + edge cases)

```tsx
import { ThemeProvider, defaultTheme } from '@pathableai/react'

// Both render children with NO wrapper element.
<ThemeProvider theme={defaultTheme}>…</ThemeProvider>
<ThemeProvider>…</ThemeProvider>
```

The unit test asserts no extra DOM node is present in these cases (SC-003).

## 3. Nesting precedence (Story 2)

```tsx
<ThemeProvider theme={defaultTheme}>
  <OuterContent />
  <ThemeProvider theme={brand}>
    <InnerContent />
  </ThemeProvider>
</ThemeProvider>
```

The unit test asserts the inner wrapper emits the override value, demonstrating that the CSS
cascade makes the innermost provider win.

## 4. Polymorphism, native props, ref, and colorScheme (Story 3)

The unit test asserts:

- `as="section"` renders a `<section>` wrapper.
- Native props (`id`, `aria-label`, `className`) and a forwarded `ref` land on the wrapper.
- `colorScheme="light"` and `colorScheme="dark"` both render without error (documented no-op).

## 5. SSR / determinism

Output is a pure function of props and module constants (inline `style`, no effects, no browser
globals), so server and client HTML are identical. The unit test exercises render determinism; the
existing server-compatibility check can be run for the package:

```bash
pnpm test:storybook-react-server
```

## 6. Storybook stories (FR-012)

Start the React Storybook and confirm the three deterministic stories render:

```bash
pnpm --filter @pathableai/styles build
pnpm --filter @pathable/storybook-react storybook
```

Expected stories: `Default` (no provider), `PartialOverride` (`accent` + `actionPrimaryBg`), and
`NestedBrandedSection` (inner provider within a default outer). The story contract gate can be run
with:

```bash
pnpm test:storybook-react
```

## 7. Full quality gates

Run the complete validation chain for the changed package plus the token sync check:

```bash
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react test:unit
pnpm --filter @pathableai/react build
pnpm lint:tokens
```

Expected: all exit `0`.

## 8. Publishable-validation spot check

```bash
pnpm --filter @pathableai/react check:types
pnpm --filter @pathableai/react check:package
```

Expected: the new `ThemeProvider` and `ColorScheme` exports resolve through the package entry
point without an Are The Types Wrong / publint failure.

## Acceptance trace

| Spec scenario | Validated by |
| ------------- | ------------ |
| Story 1: partial override emits scoped tokens | `ThemeProvider.test.tsx` (§1) |
| Story 1: no wrapper when resolved theme equals default | `ThemeProvider.test.tsx` (§2) |
| Story 2: innermost provider wins | `ThemeProvider.test.tsx` (§3) |
| Story 3: `as`/ref/native props + `colorScheme` no-op | `ThemeProvider.test.tsx` (§4) |
| SSR / determinism | §5 + `test:storybook-react-server` |
| FR-012 stories | §6 + `test:storybook-react` |
| Vocabulary unchanged | `pnpm lint:tokens` (§7) |
