<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/053-semantic-color-tones/plan.md

## Semantic Color and Tone Model

This feature (slice 11 of the React Semantic Primitives plan) formalizes the
shared semantic color/tone vocabulary consumed by `Text` (09), future
`Surface` (12), and other primitives. It delivers a tone vocabulary document,
shared internal TypeScript types (`TextTone`, `SurfaceTone`, `BorderTone`),
and migration of `Text`'s inline `tone` union onto the shared type.

### Tone vocabulary

- `TextTone` = `default | muted | danger | success` — fully grounded in the
  existing `pathable-text.scss` tone contract (`pathable-text--tone-*`),
  all token-driven with WCAG AA contrast on `--pathable-color-surface`.
- `SurfaceTone` = `default | subtle | primary` and `BorderTone` =
  `default | danger` are forward-declared types; their SCSS contracts are
  tracked gaps owned by feature 12 (`Surface`) and future boundary work.
- Tone types are internal (not part of the public `@pathable/react` export),
  distinct from the flat utility color types in `colorTone.ts`.

### Key constraints

- No new SCSS files, no new tokens, no new React components.
- `Text`'s `tone` prop consumes the shared `TextTone` with no change to
  rendered classes; the tone→class mapping moves to a pure `textToneClass`
  resolver in `internal/resolvers/tone.ts`.
- Deterministic server/client output; no browser dependencies in resolvers.

### Running the focused commands

```bash
# Build all packages
pnpm build

# Build the React package
pnpm --filter @pathableai/react build

# Run the tone resolver tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="tone"

# Run the Text component tests (unchanged after type migration)
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text"

# Run all typography/layout primitive tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text|Grid|Inline|Cluster|Stack|Container|Heading"
```

<!-- SPECKIT END -->
