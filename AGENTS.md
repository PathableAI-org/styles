<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/054-surface-primitive/plan.md

## Surface Primitive

This feature (slice 12 of the React Semantic Primitives plan) implements the
`Surface` semantic visual-container primitive. `Surface` coordinates
foreground, background, border, elevation, and focus treatment into a single
semantic `variant` prop, plus optional `borderTone` and `elevation`
refinements. It ships only because the conditional precondition is met:
concrete application compositions repeatedly consume the coordinated
`pathable-surface` treatment (see `research.md`).

### Surface model

- `variant` = `SurfaceTone` = `default | subtle | primary` — the semantic tone
  axis (background + foreground + default border), resolved by new
  `pathable-surface--tone-*` modifiers on the existing `pathable-surface.scss`
  contract.
- `borderTone` = `BorderTone` = `default | danger` — the boundary meaning axis,
  resolved by new `pathable-surface--border-*` modifiers.
- `elevation` = `sm | md | lg | xl` — the depth axis, resolved by new
  `pathable-surface--elevation-*` modifiers mapping to `--elevation-*` tokens.
- Tone types (`SurfaceTone`/`BorderTone`) and the tone resolvers are internal;
  `Surface` and `SurfaceProps` are public exports. `variant` is chosen over
  `tone` because it selects an entire coordinated treatment.

### Key constraints

- Source-first: extend the `packages/styles` `pathable-surface.scss` contract
  before exposing the React `Surface` wrapper; no new tokens, no forked values.
- No raw `color`/`background`/`borderColor` props; no arbitrary `box-shadow`;
  no internal padding (external spacing only).
- Deterministic server/client output; no browser dependencies in resolvers.

### Running the focused commands

```bash
# Build all packages
pnpm build

# Build the React package
pnpm --filter @pathableai/react build

# Run the surface resolver/component tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Surface"

# Run the existing primitive suite (no regressions)
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text|Grid|Inline|Cluster|Stack|Container|Heading|Card"
```

<!-- SPECKIT END -->
