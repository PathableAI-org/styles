<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/051-text-primitive/plan.md

## Text Primitive

This feature (slice 09 of the React Semantic Primitives plan) adds a semantic
typographic primitive to `@pathable/react`: `Text`. It renders a text element
with design-system-approved typography roles and semantic tone colors,
consuming a new `pathable-text` SCSS contract from `@pathable/styles`.

### Text

- A new `pathable-text.scss` SCSS contract provides a `.pathable-text` base
  class with variant modifiers (`--body`, `--small`, `--caption`) and tone
  modifiers (`--tone-default`, `--tone-muted`, `--tone-danger`,
  `--tone-success`).
- A `variant` prop (`"body"`, `"small"`, `"caption"`) maps to
  `.pathable-text--{variant}` modifier classes. Variants resolve to the
  existing typography scale (body-md, body-sm, caption-md).
- A `tone` prop (`"default"`, `"muted"`, `"danger"`, `"success"`) maps to
  `.pathable-text--tone-{tone}` modifier classes resolving to semantic color
  tokens. `success` uses a new AA-safe `--pathable-color-text-success` token.
- Default rendered element is `p`; `as` supports text elements (`span`,
  `label`, `figcaption`, …) with native props restricted to the selected
  element (generic polymorphic typing).
- No layout props (padding/margin/sizing/display), no raw typography props
  (font size/weight/line-height/family), no heading semantics (Heading is
  separate). `className` and `style` remain escape hatches.
- Ref forwarding and `mergeClasses()` class composition (base → variant →
  tone → consumer className).

### Key constraints

- One new React component: `Text`.
- One new SCSS file (`pathable-text.scss`), one SCSS modification
  (`pathable-typography.scss` @forward), and two additive token changes
  (`_typography.scss` line-height tokens; `_semantic.scss` text-success token).
- No wrapper DOM elements — all classes on the single root element.
- Deterministic server/client output; contrast-safe tone tokens (WCAG AA).

### Running the focused commands

```bash
# Build all packages
pnpm build

# Build the React package
pnpm --filter @pathableai/react build

# Run Text component tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text"

# Run all typography/layout primitive tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text|Grid|Inline|Cluster|Stack|Container"
```

<!-- SPECKIT END -->
