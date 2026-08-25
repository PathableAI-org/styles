# @pathableai/react

## 0.0.4-alpha.6

### Patch Changes

- 0e9d4d0: Add `defaultTheme` export and `createTheme` factory for typed theming.

  - `defaultTheme`: a complete ThemeConfig constant with the 25 default semantic color token values matching the CSS custom properties.
  - `createTheme(input)`: accepts a partial ThemeConfig, deep-merges with defaultTheme, validates all required tokens and color values, and returns a fully resolved ThemeConfig.

- cfbcb6d: Add `ThemeProvider` component, `ThemeProviderProps`, and `ColorScheme` types.

  - `ThemeProvider` accepts an optional `theme?: ThemeConfig` (defaults to `defaultTheme`) and an optional `colorScheme` hook, plus optional `as` prop (defaults to `div`) for the wrapper element.
  - Renders a wrapper element with every resolved `--pathable-color-*` CSS custom property applied as inline `style`.
  - Suppresses the wrapper element when the provided theme deep-equals `defaultTheme`.
  - Supports nesting; an inner `ThemeProvider` overrides its ancestor's resolved tokens.
  - New public exports: `ColorScheme` and `ThemeProviderProps` types.

- 982ee6a: Add the typed theme vocabulary: `ThemeColors` and `ThemeConfig` types, a pure
  `themeColorToken` camelCase-to-kebab-case mapping function, and public re-exports
  of the `TextTone`, `SurfaceTone`, `BorderTone`, and `SurfaceElevation` types.

## 0.0.4-alpha.5

### Patch Changes

- Updated dependencies [7eab2bd]
  - @pathableai/styles@0.0.3-alpha.3

## 0.0.4-alpha.4

### Patch Changes

- cd6d566: Publish the semantic Heading SCSS and typed React contracts with independent document and visual levels, tokenized level-1 weight, and verified accessibility behavior.
- b7cb803: Document IconTile and SegmentedControl usage, props, behavior, and accessibility requirements.
- Updated dependencies [cd6d566]
- Updated dependencies [aad62f4]
  - @pathableai/styles@0.0.3-alpha.2

## 0.0.4-alpha.3

### Patch Changes

- e0eeb31: Harden React SegmentedControl controlled selection, disabled, keyboard, and static one-option behavior.

## 0.0.4-alpha.2

### Patch Changes

- Updated dependencies [647bcbd]
  - @pathableai/styles@0.0.3-alpha.1

## 0.0.4-alpha.1

### Patch Changes

- 5841748: Make Activity List status labels visible and accessible, constrain row metadata,
  and add the typed React ActivityList wrapper.
- Updated dependencies [5841748]
  - @pathableai/styles@0.0.3-alpha.0

## 0.0.4-alpha.0

### Patch Changes

- 3629001: Add DashboardHeader component

## 0.0.3

### Patch Changes

- 994c482: Prevent invalid DateRangePicker drafts from exposing stale ISO form values and keep native validity on the visible date inputs.

## 0.0.2

### Patch Changes

- b0b2fe0: Fix Next.js App Router consumption by using the consumer's React runtime,
  retaining automatic styles, and packaging every compiled CSS asset.
- Updated dependencies [b0b2fe0]
  - @pathableai/styles@0.0.2

## 0.0.1

### Patch Changes

- 2df9552: Align the basic Header markup and mobile navigation styles with the patched
  USWDS runtime, including the overlay and background scroll lock.
- 32579a0: Keep ComboBox required validation on its visible input and prevent duplicate form values from input attributes.
- fix: Release workflow with changesets
- Updated dependencies [2df9552]
- Updated dependencies
  - @pathableai/styles@0.0.1
