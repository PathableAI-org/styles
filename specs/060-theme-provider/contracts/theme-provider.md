# Interface Contract: `ThemeProvider`

Module: `@pathableai/react` → `packages/react/src/theme/ThemeProvider.tsx`, forwarded through
`theme/index.ts` and `src/index.ts`.

## Signature

```ts
export type ColorScheme = 'light' | 'dark'

export interface ThemeProviderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  theme?: ThemeConfig
  colorScheme?: ColorScheme
  as?: React.ElementType
  children?: React.ReactNode
}

export const ThemeProvider: React.ForwardRefExoticComponent<
  ThemeProviderProps & React.RefAttributes<HTMLElement>
>
```

## Preconditions

- `theme`, when provided, must be a **complete** `ThemeConfig` (all 25 `colors` present as valid
  CSS color strings). Partial themes must be resolved to a `ThemeConfig` via `createTheme`
  *before* being passed in. The provider performs no validation and trusts its input (validation
  belongs to `createTheme`, feature 059).
- `theme` may be omitted; it defaults to `defaultTheme`.

## Behavior

- If `theme` is omitted or `theme.colors` key-wise equals `defaultTheme.colors`, the component
  returns `children` directly (no wrapper element; the forwarded `ref` is not attached).
- Otherwise, it renders a wrapper element (`as ?? 'div'`) carrying:
  - `style` — all 25 `--pathable-color-*` custom properties derived from `theme.colors` via
    `THEME_COLOR_TOKEN_MAP`;
  - `ref` — the forwarded ref;
  - `className` — the consumer's class name, if any;
  - every other inherited native prop via rest spread (`id`, `data-*`, `aria-*`, …).
- `colorScheme` is accepted and ignored (documented no-op in this release); it is never forwarded
  to the DOM.
- Nesting is resolved by the CSS cascade: the innermost provider's inline style wins for every
  token it emits (and every provider emits all 25 tokens, so an inner provider fully shields its
  subtree).

## Postconditions

- The subtree resolves `var(--pathable-color-*)` to the provider's values; sibling content outside
  the subtree resolves to the design system's `:root` defaults (or an outer provider's values).
- Non-color tokens (typography, spacing, elevation, radius) are unaffected.
- Output is identical server-side and client-side (pure, serializable, no effects).

## CSS custom property mapping (consumed, not defined here)

The mapping is the existing `THEME_COLOR_TOKEN_MAP` from feature 058
([`theme-types.md`](../../058-theme-token-types/contracts/theme-types.md)): each `ThemeColorKey`
(camelCase) maps to a `--pathable-color-*` name (kebab-case). Example: `actionPrimaryBg` →
`--pathable-color-action-primary-bg`.

## Examples

```tsx
import { ThemeProvider, createTheme, defaultTheme } from '@pathableai/react'

// Partial override (Story 1): accent + action button background; 23 others at defaults.
const brand = createTheme({ colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' } })

<ThemeProvider theme={brand}>
  <AppShell>…</AppShell>
</ThemeProvider>

// Default identity (edge case): no wrapper element is rendered.
<ThemeProvider theme={defaultTheme}>…</ThemeProvider>
<ThemeProvider>…</ThemeProvider>

// Polymorphic + native props (FR-005).
<ThemeProvider as="section" theme={brand} id="branded-region" aria-label="Brand region">
  …
</ThemeProvider>

// Nested scoping (Story 2): innermost provider wins.
<ThemeProvider theme={defaultTheme}>
  <PageContent />
  <ThemeProvider theme={brand}>
    <BrandedSidebar />
  </ThemeProvider>
</ThemeProvider>
```

## Verification

`packages/react/src/theme/__tests__/ThemeProvider.test.tsx` asserts:

- All 25 `--pathable-color-*` properties are present on the wrapper `style` with correct values.
- No wrapper node is rendered when the theme equals `defaultTheme` (or is omitted).
- The wrapper element type follows `as`; native props and `ref` are forwarded to the wrapper.
- Nested providers: the innermost wrapper's override value is emitted (cascade precedence).
- `colorScheme="light"` and `colorScheme="dark"` both render without error (no-op).
- Output contains no effects/globals; render is deterministic.

## Relationship to other contracts

- Input type `ThemeConfig`/`ThemeColors`, key vocabulary, and the CSS custom property mapping:
  feature 058 [`contracts/theme-types.md`](../../058-theme-token-types/contracts/theme-types.md).
- Default values and partial→complete resolution: feature 059
  [`contracts/default-theme.md`](../../059-default-theme-create-theme/contracts/default-theme.md)
  and [`contracts/create-theme.md`](../../059-default-theme-create-theme/contracts/create-theme.md).
