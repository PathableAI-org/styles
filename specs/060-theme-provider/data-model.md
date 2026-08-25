# Data Model: ThemeProvider Component

This document describes the domain entities introduced by the feature and their relationships.
The design is one stateless React component, one union type, and one derived style object; there
is no runtime state, persistence, or lifecycle beyond render. It reuses (does not redefine) the
vocabulary and data layer from features 058 and 059.

## Entities

### 1. `ThemeProvider` (component)

- **Kind**: Stateless React function component, wrapped with `forwardRef`.
- **Definition**: `export const ThemeProvider = forwardRef<HTMLElement, ThemeProviderProps>(...)`.
- **Behavior**:
  1. Default `theme` to `defaultTheme` when omitted.
  2. If `theme.colors` deep-equals `defaultTheme.colors` (key-wise over `THEME_COLOR_KEYS`),
     return `children` as-is (fragment, no wrapper).
  3. Otherwise build the color style object from `theme.colors` via `THEME_COLOR_TOKEN_MAP`,
     choose `as ?? 'div'`, and render `<Component ref style className {...rest}>children</Component>`.
- **Invariants**: pure/deterministic (FR-009/FR-010); SSR-safe (no effects/globals); emits all 25
  `--pathable-color-*` properties (FR-004); adds no wrapper when default (FR-006); forwards `ref`
  only when a wrapper exists.
- **Relationship**: Consumes `ThemeConfig` (input), `defaultTheme` (identity), `THEME_COLOR_KEYS`
  and `THEME_COLOR_TOKEN_MAP` (emission).

### 2. `ThemeProviderProps`

- **Kind**: Literal interface.
- **Definition**:
  ```ts
  export type ColorScheme = 'light' | 'dark'

  export interface ThemeProviderProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
    theme?: ThemeConfig
    colorScheme?: ColorScheme
    as?: React.ElementType
    children?: React.ReactNode
  }
  ```
- **Fields**:
  - `theme?: ThemeConfig` — complete resolved theme; defaults to `defaultTheme`.
  - `colorScheme?: ColorScheme` — forward-compatible no-op hook (FR-008).
  - `as?: ElementType` — wrapper element type; defaults to `div` (FR-005).
  - `children?: ReactNode` — subtree.
  - Inherited `HTMLAttributes<HTMLElement>` (minus `color`) — forwarded native props incl.
    `className`, `id`, `data-*`, `aria-*`.
- **Relationship**: The public props type; exported for consumers and for generated declarations.

### 3. `ColorScheme`

- **Kind**: String literal union type.
- **Definition**: `export type ColorScheme = 'light' | 'dark'`.
- **Invariants**: `'dark'` is accepted but a documented no-op in this release (dark tokens not
  modeled).
- **Relationship**: The type of the `colorScheme` prop.

### 4. Resolved color style object (derived value)

- **Kind**: Plain object of CSS custom properties produced at render.
- **Definition**: `{ [THEME_COLOR_TOKEN_MAP[key]]: theme.colors[key] for key of THEME_COLOR_KEYS }`.
- **Fields**: 25 `--pathable-color-*` string values, one per semantic color token.
- **Invariants**: every key present, every value a string (FR-004/FR-009); serializable.
- **Relationship**: Passed as the wrapper's `style`; makes the subtree's token resolution
  self-contained.

### Reused entities (not redefined here)

| Entity | Source | Role in this feature |
| ------ | ------ | -------------------- |
| `ThemeConfig` / `ThemeColors` | feature 058 `tokens.ts` | Input type; complete color vocabulary |
| `THEME_COLOR_KEYS` | feature 058 `tokens.ts` | Iteration + equality key set |
| `THEME_COLOR_TOKEN_MAP` | feature 058 `tokens.ts` | camelCase → `--pathable-color-*` mapping |
| `defaultTheme` | feature 059 `defaultTheme.ts` | Identity value for the no-wrapper guard; prop default |
| `createTheme` | feature 059 `createTheme.ts` | Consumer-side partial → resolved `ThemeConfig` (not called by the provider) |

## State transitions

None — no runtime state, mutations, or lifecycle events. The rendered output is a pure function
of the props and module constants.

## Validation rules summary

| Rule | Enforcement |
| ---- | ----------- |
| Emits all 25 `--pathable-color-*` on the wrapper | `ThemeProvider.test.tsx` (assert style keys/values) |
| No wrapper when theme equals `defaultTheme` | `ThemeProvider.test.tsx` (assert no extra node) |
| Wrapper is configurable via `as`; native props + `ref` forwarded | `ThemeProvider.test.tsx` |
| `colorScheme` accepted without error (`light` and `dark`) | `ThemeProvider.test.tsx` |
| `theme` omitted → resolves to `defaultTheme`, no wrapper | `ThemeProvider.test.tsx` |
| Deterministic / serializable output | render + style-object assertions; no effects/globals |
| Key vocabulary unchanged | existing `pnpm lint:tokens` (feature 058) |
