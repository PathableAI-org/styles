<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/052-heading-primitive/plan.md

## Heading Primitive

This feature (slice 10 of the React Semantic Primitives plan) adds a semantic
heading primitive to `@pathable/react`: `Heading`. It renders a heading element
with a design-system-approved typography level, consuming a new
`pathable-heading` SCSS contract from `@pathable/styles`.

### Heading

- A new `pathable-heading.scss` SCSS contract provides a `.pathable-heading`
  base class with level modifiers (`--level-1` through `--level-6`).
- A required `level` prop (`1`–`6`) controls the rendered HTML heading
  element (`h1`–`h6`) and the visual style class.
- An optional `visualLevel` prop (`1`–`6`) allows visual style to diverge
  from document outline level when both are provided; when omitted, visual
  style defaults to matching `level`.
- Level-to-scale mapping: 1=display-lg (Fredoka), 2=heading-lg, 3=heading-md,
  4=heading-sm (Poppins), 5=body-md bold, 6=body-sm bold (Nunito).
- No `as` prop — Heading is always a heading element (`h1`–`h6`).
- No tone/color props, no raw typography props. `className` and `style`
  remain escape hatches.
- Ref forwarding and `mergeClasses()` class composition (base → level
  modifier → consumer className).

### Key constraints

- One new React component: `Heading`.
- One new SCSS file (`pathable-heading.scss`), one SCSS modification
  (`pathable-typography.scss` @forward). No new tokens required.
- No wrapper DOM elements — all classes on the single heading element.
- Deterministic server/client output; `level` is a required prop with no default.

### Running the focused commands

```bash
# Build all packages
pnpm build

# Build the React package
pnpm --filter @pathableai/react build

# Run Heading component tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Heading"

# Run all typography/layout primitive tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Heading|Text|Grid|Inline|Cluster|Stack|Container"
```

<!-- SPECKIT END -->
