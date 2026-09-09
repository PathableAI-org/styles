# @pathableai/react

## 0.0.5

### Patch Changes

- a9830f4: Load the default theme token layer automatically so React components have complete fallback styling without a separate `@pathableai/styles` import. The defaults use zero selector specificity so application-owned `:root` tokens and scoped `ThemeProvider` values override them regardless of stylesheet order.

  When upgrading `@pathableai/react` from `0.0.4`, remove stylesheet imports added to restore that version's omitted defaults. Use `ThemeProvider` for scoped runtime overrides or application-owned `:root` declarations for global overrides.

- Updated dependencies [a9830f4]
- Updated dependencies [ba07c56]
  - @pathableai/styles@0.0.4

## 0.0.4

### Patch Changes

- 5841748: Make Activity List status labels visible and accessible, constrain row metadata,
  and add the typed React ActivityList wrapper.
- e0eeb31: Harden React SegmentedControl controlled selection, disabled, keyboard, and static one-option behavior.
- cd6d566: Publish the semantic Heading SCSS and typed React contracts with independent document and visual levels, tokenized level-1 weight, and verified accessibility behavior.
- c119150: Add shared semantic color and tone vocabulary (TextTone, SurfaceTone, BorderTone) with pure class resolvers, and migrate Text to consume the shared types.
- c119150: Add sizing and external-spacing props (width, maxWidth, margin) to Card, backed by semantic utility classes with no extra wrapper elements.
- 0e9d4d0: Add `defaultTheme` export and `createTheme` factory for typed theming.

  - `defaultTheme`: a complete ThemeConfig constant with the 25 default semantic color token values matching the CSS custom properties.
  - `createTheme(input)`: accepts a partial ThemeConfig, deep-merges with defaultTheme, validates all required tokens and color values, and returns a fully resolved ThemeConfig.

- c119150: Add Inline (non-wrapping row) and Cluster (wrapping row) layout primitives with constrained gap, alignment, and polymorphic `as` support.
- d755135: Add consumer-configurable AppShell landmarks, skip links, and an opt-in shared
  navigation mode that keeps all destinations available across breakpoints. Keep
  mobile navigation visible while main content scrolls, and add an accessible
  active-text token while preserving existing active-color overrides.
- c119150: Add Container layout primitive with a semantic `size` prop (desktop, tablet, content, full) that standardizes the centered max-width page pattern.
- c119150: Add Text typographic primitive with semantic variant (body, small, caption) and tone (default, muted, danger, success) props, plus new typography and color tokens in styles.
- c119150: Add Surface primitive with variant (default, subtle, primary), elevation, and border tone props coordinating foreground, background, border, and focus treatment, plus new token-driven SCSS modifiers.
- 3629001: Add DashboardHeader component
- b7cb803: Document IconTile and SegmentedControl usage, props, behavior, and accessibility requirements.
- 8bce99a: Ship a cross-platform Agent Skill-shaped consumer guide with focused styling,
  theming, accessibility, and client-boundary guidance. Include the guide in the
  npm package and document an opt-in repository instruction pointer.
- e8ffe78: Change the package entry point to import only the structural style layers (`@pathableai/styles/components` and `@pathableai/styles/utilities`) instead of the full default theme token layer.

  - Consumers who provide their own tokens via `ThemeProvider` no longer import the default token layer, so their tokens are not overridden by a package stylesheet.
  - **Breaking change**: consumers who relied on `@pathableai/react`'s implicit side-effect import of `@pathableai/styles` must now add `import '@pathableai/styles'` (or `import '@pathableai/styles/theme'`) at the application boundary to keep the default token layer.

- c119150: Add Heading primitive with level prop (1–6) controlling both the rendered HTML heading element and visual style, with deliberate document-outline semantics.
- c119150: Add higher-level composition primitives (CardGrid, Page, SidebarLayout, FormStack, SplitLayout) built from existing layout primitives for common application patterns.
- c119150: Add internal semantic-prop type system and pure class resolvers that map typed React prop values to verified @pathableai/styles CSS classes.
- c119150: Add Grid layout primitive for design-system-approved column and gap patterns via a constrained `cols` prop.
- cfbcb6d: Add `ThemeProvider` component, `ThemeProviderProps`, and `ColorScheme` types.

  - `ThemeProvider` accepts an optional `theme?: ThemeConfig` (defaults to `defaultTheme`) and an optional `colorScheme` hook, plus optional `as` prop (defaults to `div`) for the wrapper element.
  - Renders a wrapper element with every resolved `--pathable-color-*` CSS custom property applied as inline `style`.
  - Suppresses the wrapper element when the provided theme deep-equals `defaultTheme`.
  - Supports nesting; an inner `ThemeProvider` overrides its ancestor's resolved tokens.
  - New public exports: `ColorScheme` and `ThemeProviderProps` types.

- 982ee6a: Add the typed theme vocabulary: `ThemeColors` and `ThemeConfig` types, a pure
  `themeColorToken` camelCase-to-kebab-case mapping function, and public re-exports
  of the `TextTone`, `SurfaceTone`, `BorderTone`, and `SurfaceElevation` types.
- f8cee08: Added theming documentation: token vocabulary reference, consumer guide, and acceptance criteria verification (`docs/theming/`). Updated READMEs in both packages with cross-links to the new theming docs. Added Storybook end-to-end test asserting partial-theme color resolution via `ThemeProvider`.
- c119150: Add Box layout primitive with polymorphic `as` prop, shared sizing/spacing capabilities, ref forwarding, and deterministic server-renderable output.
- c119150: Add Stack layout primitive for vertical stacking relationships with constrained gap, child alignment, and polymorphic `as` support.
- c119150: Add width and maxWidth sizing props to Button, TextInput, Select, TextArea, and other form controls with no extra wrapper elements.
- Updated dependencies [5841748]
- Updated dependencies [cd6d566]
- Updated dependencies [aad62f4]
- Updated dependencies [647bcbd]
- Updated dependencies [5c2505a]
- Updated dependencies [7eab2bd]
- Updated dependencies [d755135]
- Updated dependencies [c119150]
- Updated dependencies [c119150]
- Updated dependencies [f8cee08]
  - @pathableai/styles@0.0.3

## 0.0.4-alpha.7

### Patch Changes

- e8ffe78: Change the package entry point to import only the structural style layers (`@pathableai/styles/components` and `@pathableai/styles/utilities`) instead of the full default theme token layer.

  - Consumers who provide their own tokens via `ThemeProvider` no longer import the default token layer, so their tokens are not overridden by a package stylesheet.
  - **Breaking change**: consumers who relied on `@pathableai/react`'s implicit side-effect import of `@pathableai/styles` must now add `import '@pathableai/styles'` (or `import '@pathableai/styles/theme'`) at the application boundary to keep the default token layer.

- f8cee08: Added theming documentation: token vocabulary reference, consumer guide, and acceptance criteria verification (`docs/theming/`). Updated READMEs in both packages with cross-links to the new theming docs. Added Storybook end-to-end test asserting partial-theme color resolution via `ThemeProvider`.
- Updated dependencies [f8cee08]
  - @pathableai/styles@0.0.3-alpha.4

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
