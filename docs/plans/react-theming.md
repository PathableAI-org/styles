# React Theming API Plan

## Purpose

This document describes the desired end state for a typed, ergonomic theming
interface in `@pathableai/react`, informed by downstream consumer needs and the
existing architecture of `@pathableai/styles`. It defines what we will build, the
design principles that govern it, and the interfaces consumers will use. A
separate implementation plan will break this into sequenced work items.

## Motivation

`@pathableai/styles` emits a comprehensive set of design tokens as CSS custom
properties on `:root`. `@pathableai/react` consumes those tokens indirectly
through SCSS-owned CSS classes. Downstream React applications that want to
override colors (brand accent, background, action colors, etc.) today must
hand-write CSS that redeclares `--pathable-color-*` tokens on `:root`. This
works, but it is an undocumented, stringly-typed, order-dependent contract with
no TypeScript safety, no discoverability, and no scoping (everything is global
`:root`).

The request for a theming API comes primarily from the Next Level Pre-ETS team,
which builds a Next.js App Router product on top of `@pathableai/react` and
`@pathableai/styles`. Their core ask is: "give us a typed, JS/TS-facing layer
above the CSS custom properties so we can override a handful of colors without
writing raw CSS or fighting cascade order."

This plan also serves future consumers who need runtime theme switching (e.g.
dark mode) or scoped overrides (e.g. a branded section within an otherwise
default-themed page).

## Design Principles (from the React Semantic Primitives Architecture)

These principles from the existing React architecture plan apply equally to
theming:

1. **SCSS is the source of truth.** The React package must not duplicate token
   values, reimplement CSS rules in JavaScript, or invent tokens not emitted by
   the styles package.

2. **Typed semantic props form the foundation.** The theming API should be
   strongly typed, with autocomplete and compile-time errors for invalid keys.

3. **Prefer semantic intent over raw CSS.** The theme interface should expose
   the *design tokens* (colors, spacing, typography), not raw CSS declarations.

4. **Server-safe.** Theming must remain compatible with server rendering. Token
   resolution and class generation must be pure and deterministic.

5. **Never add a wrapper solely for a system prop.** This principle applies
   narrowly to system props on individual components. The `ThemeProvider`
   wrapper is an intentional structural element that scopes a theme subtree —
   analogous to React's own `Context.Provider`, not an incidental layout
   wrapper.

Additional principles specific to theming:

6. **CSS custom properties remain the transport.** The `ThemeProvider` emits
   resolved token values as CSS custom properties on its DOM subtree. Components
   continue to reference `var(--pathable-*)` as they do today. The provider
   is a typed *control layer* above the existing CSS variable mechanism, not a
   replacement for it.

7. **Partial overrides, full defaults.** Consumers override only the tokens they
   care about. All unspecified tokens fall through to the Pathable defaults.
   This is the "indented consumer" model: Pathable's design system is the base,
   with brand/context-specific overrides on top.

8. **Scoped by default, not global.** The provider emits tokens on its wrapper
   element's `style` attribute (or a scoped selector), not on `:root`. This
   means multiple themes can coexist on one page, and overrides do not require
   winning a cascade-order fight against the package's own stylesheet.

## Architecture Overview

```
Consumer application
  │
  ├── import { ThemeProvider, createTheme } from "@pathableai/react"
  │
  ├── const theme = createTheme({ colors: { accent: "#7c3aed" } })
  │
  └── <ThemeProvider theme={theme}>
        <AppShell>...</AppShell>
      </ThemeProvider>
      
ThemeProvider
  │
  ├── Deep-merges partial theme with defaultTheme
  ├── Resolves all token values
  └── Renders a wrapper <div> with:
        style={{ "--pathable-color-accent": "#7c3aed", ... }}
        
CSS (unchanged)
  │
  └── Components reference var(--pathable-color-accent) as before
      The cascade resolver picks up the provider's scoped value,
      falling back to the :root default outside the provider's subtree.
```

## What We Will Build

### 1. `ThemeProvider` Component (highest priority)

A React context provider that accepts a theme configuration object, resolves it
against defaults, and emits the resolved tokens as CSS custom properties on a
wrapper `<div>` (or configurable element) via the `style` prop.

```tsx
import { ThemeProvider } from "@pathableai/react";

<ThemeProvider theme={nlpreetsTheme}>
  <AppShell>...</AppShell>
</ThemeProvider>
```

**Behavior:**

- Wraps children in a `<div data-pathable-theme>` (configurable via `as` prop)
  with inline `style` containing all resolved `--pathable-color-*` custom
  properties.
- Accepts a `theme` prop of type `ThemeConfig` (see below).
- Accepts an optional `colorScheme` prop (`"light"` | `"dark"`) that consumers
  can use to drive runtime dark-mode switching. In the initial implementation,
  this maps to a dedicated `ThemeConfig` field for dark tokens.
- Renders without a wrapper `<div>` when there is no theme override (i.e. when
  the theme equals `defaultTheme`), to avoid unnecessary DOM nodes for the
  default path.
- Merges with `defaultTheme` internally; consumers never need to provide
  a complete theme.

**CSS cascade behavior:**

The inline `style` on the wrapper element takes precedence over `:root`
declarations for the same custom properties, but does not affect other
`:root`-level tokens (typography, spacing, elevation, etc.) unless those are
explicitly included in the theme object. This gives scoping for free: components
inside the provider subtree resolve `var(--pathable-color-accent)` to the
provider's value; components outside the subtree resolve to the `:root` default.

**Multiple providers (nesting):**

Nesting `ThemeProvider` works naturally: the innermost provider's inline style
wins for properties it declares, with fallthrough to outer providers and
ultimately `:root`. This supports use cases like a branded modal or sidebar
within an otherwise default-themed page.

### 2. Typed Theme Configuration (`ThemeConfig`, `ThemeColors`)

A set of TypeScript interfaces that describe the complete theme surface. These
are the public, documented vocabulary of "these are the tokens you may
override."

```ts
// Color tokens — the primary theming surface
interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  link: string;
  accent: string;
  focusRing: string;
  danger: string;
  success: string;
  textSuccess: string;
  actionPrimaryBg: string;
  actionPrimaryText: string;
  actionSecondaryBg: string;
  actionSecondaryText: string;
  statusSuccessBg: string;
  statusSuccessText: string;
  statusWarningBg: string;
  statusWarningText: string;
  statusDangerBg: string;
  statusDangerText: string;
  workflowActive: string;
  workflowComplete: string;
  workflowBlocked: string;
  onAccent: string;
}

interface ThemeConfig {
  colors: ThemeColors;
  // Future: typography, spacing, etc.
}
```

**Key design decisions:**

- **camelCase keys in TypeScript, kebab-case in CSS.** The TypeScript interface
  uses `actionPrimaryBg`; the provider maps it to `--pathable-color-action-primary-bg`.
  This mapping is deterministic and documented. (Alternative: use the kebab-case
  names directly in the TS type. Either is acceptable; the important thing is
  that the mapping is explicit, typed, and documented.)

- **`ThemeColors` is flat.** Each token is a top-level property. This keeps the
  interface simple and autocomplete-friendly. The `--pathable-color-` prefix is
  an implementation concern, not part of the public API shape.

- **The interface is derived from `_semantic.scss`.** The token set in
  `ThemeColors` corresponds 1:1 with the `$semantic-colors` Sass map and the
  `:root` block in `_semantic.scss`. Adding a new semantic token to SCSS
  requires adding the corresponding key to `ThemeColors`.

### 3. `defaultTheme` Export

A constant export containing the complete, resolved Pathable default theme.

```ts
import { defaultTheme } from "@pathableai/react";

// defaultTheme.colors.accent === "#1cae96"
// defaultTheme.colors.bg === "#dde2e8"
```

This serves three purposes:

1. **Documentation.** It is the canonical, machine-readable answer to "what are
   all the tokens and their default values?"
2. **Spread-based extension.** Consumers who prefer to start from the full
   object and override individual keys can do so:

   ```ts
   const myTheme = {
     ...defaultTheme,
     colors: { ...defaultTheme.colors, accent: "#7c3aed" },
   };
   ```

3. **Runtime reference.** Components or tests can import it to inspect defaults
   without parsing compiled CSS.

### 4. `createTheme` Helper

A factory function that accepts a partial `ThemeConfig` and returns a complete,
validated `ThemeConfig` by deep-merging with `defaultTheme`.

```ts
import { createTheme } from "@pathableai/react";

const nlpreetsTheme = createTheme({
  colors: {
    accent: "#7c3aed",
    actionPrimaryBg: "#7c3aed",
    bg: "#f5f7fa",
  },
});
```

**Behavior:**

- Deep-merges the input with `defaultTheme`. Unspecified color tokens fall
  through to defaults.
- Returns a fully-resolved `ThemeConfig`. The return type is `ThemeConfig`, not
  `Partial<ThemeConfig>`, so consumers never need to null-check individual
  tokens.
- Throws a descriptive error at *call time* (not render time) if a required
  token is missing after merging or if a value fails validation (e.g. not a
  valid CSS color string).
- Is serializable — a theme can be defined in a module and passed to
  `ThemeProvider` without any runtime side effects from creation.
- Is pure and deterministic — no side effects, no browser globals.

### 5. Public Tone Type Exports

The semantic tone types (`TextTone`, `SurfaceTone`, `BorderTone`) that
currently live in `packages/react/src/internal/resolvers/tone.ts` will be
re-exported from the public entry point so consumers can share the vocabulary
between component props and theme configuration.

```ts
import type { TextTone, SurfaceTone, BorderTone } from "@pathableai/react";
```

These types are already defined and used internally. Exporting them is a
low-effort, high-value change that gives consumers a shared vocabulary and
enables patterns like mapping theme tokens to tone-specific overrides.

### 6. Consolidated `:root` Token Block (styles package)

The compiled `dist/styles.css` today contains multiple `:root` blocks from
different SCSS partials (`_semantic.scss`, `_colors.scss`,
`_components-custom-properties.scss`, `_utilities.scss`, etc.). This makes the
effective theme hard to reason about — a later block can silently shadow an
earlier one.

We will consolidate all `--pathable-color-*` declarations into a single `:root`
block in `dist/styles.css`. Non-color tokens (typography, spacing, component
custom properties) may remain in separate blocks since they are not part of the
color-theming surface, but within each token category there must be exactly one
`:root` block.

This is a quality-of-life improvement for consumers who read the compiled CSS
to understand the token set, and it eliminates the risk of silent shadowing
between scattered blocks.

### 7. Granular CSS Subpath Exports (styles package)

The `@pathableai/styles` package will offer subpath exports so consumers can
import component styles without also importing the default theme tokens:

```
dist/
  components.css       # component styles referencing var(--pathable-*)
  utilities.css        # utility classes
  theme-default.css    # the default token declarations (single consolidated :root block)
```

Package `exports` map:

```json
{
  "./components": "./dist/components.css",
  "./utilities": "./dist/utilities.css",
  "./theme": "./dist/theme-default.css",
  ".": "./dist/styles.css"  // unchanged — imports everything
}
```

**Consumer usage:**

```ts
// Consumer with ThemeProvider (skips default tokens):
import "@pathableai/styles/components";
import "@pathableai/styles/utilities";
// theme tokens provided by <ThemeProvider>

// Consumer who just wants defaults (unchanged):
import "@pathableai/styles";
```

`@pathableai/react`'s entry point will change from:

```ts
import '@pathableai/styles'
```

to:

```ts
import '@pathableai/styles/components'
import '@pathableai/styles/utilities'
```

This removes the cascade-order fight and makes the theme token layer explicitly
the consumer's responsibility. The `ThemeProvider` emits the tokens; if a
consumer does not use `ThemeProvider`, they import `@pathableai/styles/theme`
(or the full `@pathableai/styles` which includes it) to get the defaults.

## What We Will Not Build (Non-Goals)

These are explicitly out of scope for the initial theming API:

1. **A runtime CSS-in-JS engine.** We are not building a styled-components or
   Emotion equivalent. The `style` prop on a wrapper `<div>` is the mechanism.

2. **Token categories beyond colors.** The initial `ThemeConfig` only includes
   `colors`. Typography, spacing, elevation, and radius tokens may be added in
   future iterations based on demonstrated consumer need, but they are not part
   of the initial scope.

3. **Dark mode token generation.** The `colorScheme` prop on `ThemeProvider`
   provides the *hook* for dark mode, and the `ThemeColors` interface could be
   extended with a parallel `dark` key. But generating dark-mode tokens from
   light-mode tokens (e.g. inverting luminance) is a separate, design-intensive
   feature. The initial implementation supports a consumer-provided dark
   `ThemeColors` object; it does not auto-generate one.

4. **Requiring consumers to compile SCSS.** The `@use 'uswds-core' with (...)`
   pattern remains an escape hatch for power users, but the primary theming
   path is the typed JS/TS API.

5. **Removing the `:root` default token block entirely.** The `:root` block is
   the fallback for consumers who do not use `ThemeProvider`. It remains in
   `theme-default.css` and in the default `@pathableai/styles` import.

## CSS Custom Property Mapping

The mapping from `ThemeColors` keys (camelCase) to CSS custom property names
(kebab-case) is:

| ThemeColors key | CSS custom property |
|---|---|
| `bg` | `--pathable-color-bg` |
| `surface` | `--pathable-color-surface` |
| `text` | `--pathable-color-text` |
| `textMuted` | `--pathable-color-text-muted` |
| `border` | `--pathable-color-border` |
| `link` | `--pathable-color-link` |
| `accent` | `--pathable-color-accent` |
| `focusRing` | `--pathable-color-focus-ring` |
| `danger` | `--pathable-color-danger` |
| `success` | `--pathable-color-success` |
| `textSuccess` | `--pathable-color-text-success` |
| `actionPrimaryBg` | `--pathable-color-action-primary-bg` |
| `actionPrimaryText` | `--pathable-color-action-primary-text` |
| `actionSecondaryBg` | `--pathable-color-action-secondary-bg` |
| `actionSecondaryText` | `--pathable-color-action-secondary-text` |
| `statusSuccessBg` | `--pathable-color-status-success-bg` |
| `statusSuccessText` | `--pathable-color-status-success-text` |
| `statusWarningBg` | `--pathable-color-status-warning-bg` |
| `statusWarningText` | `--pathable-color-status-warning-text` |
| `statusDangerBg` | `--pathable-color-status-danger-bg` |
| `statusDangerText` | `--pathable-color-status-danger-text` |
| `workflowActive` | `--pathable-color-workflow-active` |
| `workflowComplete` | `--pathable-color-workflow-complete` |
| `workflowBlocked` | `--pathable-color-workflow-blocked` |
| `onAccent` | `--pathable-color-on-accent` |

## Value Drift Between Token Layers

The feature request notes that utility tokens (`--pathable-bg-*`,
`--pathable-text-*`) generated from USWDS `color()` mappings can differ from
semantic tokens (`--pathable-color-*`) hard-coded as brand hex values (e.g.
`--pathable-bg-accent: #1dc2ae` vs `--pathable-color-accent: #1cae96`).

The theming API only exposes the **semantic** token layer
(`--pathable-color-*`). The utility token layer is an internal implementation
detail of `_utilities.scss` and the USWDS adapter. Consumers override the
semantic tokens; components reference the semantic tokens. Addressing the drift
between the two layers is a separate quality task for the styles package and is
not in scope for the React theming API.

## Relationship to Existing Architecture

### SCSS remains the source of truth

The `ThemeColors` interface and `defaultTheme` export are derived from
`_semantic.scss`, not the other way around. When a token is added to SCSS, the
corresponding key must be added to `ThemeColors`. A build-time or lint-time
check that the two stay in sync is desirable but not required for the initial
implementation.

### Components are unchanged

Components like `Text`, `Button`, `Card`, etc. continue to reference
`var(--pathable-color-*)` through their SCSS-owned classes. They do not
consume React context or read theme values from props. The `ThemeProvider`
works at the CSS cascade level, which means it is transparent to every
component in the tree.

### System props are unchanged

The existing semantic prop system (`tone`, `variant`, `width`, `maxWidth`,
etc.) continues to work through pure class resolvers. Theme overrides do not
affect class resolution — they only change what CSS custom property value a
class resolves to.

### Server rendering is preserved

- `ThemeProvider` renders a wrapper `<div>` with an inline `style` attribute.
  This is fully server-renderable.
- `createTheme` and `defaultTheme` are pure data. No browser globals.
- No context is consumed during class resolution. Components remain
  deterministic.

## Acceptance Criteria

- [ ] A consumer can pass a typed, partial color theme to `ThemeProvider` and
      see the resolved colors render with no hand-written CSS.
- [ ] Invalid token keys fail at type-check time (TypeScript), not silently at
      runtime.
- [ ] Overrides are scoped to the provider's subtree; components outside the
      subtree render with default tokens.
- [ ] `defaultTheme` is exported and contains the complete default color token
      set.
- [ ] `createTheme` deep-merges partial input with defaults and returns a fully
      resolved `ThemeConfig`.
- [ ] `TextTone`, `SurfaceTone`, and `BorderTone` types are importable from the
      public entry point.
- [ ] A consumer can import `@pathableai/styles/components` and
      `@pathableai/styles/utilities` without also importing the default theme
      tokens.
- [ ] `@pathableai/react` no longer imports the default theme tokens via its
      side-effect import.
- [ ] The `--pathable-color-*` declarations are consolidated into a single
      `:root` block in the compiled stylesheet.
- [ ] All existing components render identically when no `ThemeProvider` is
      present (backward compatibility).
- [ ] All existing components render identically when wrapped in a
      `ThemeProvider` with `defaultTheme`.