<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/046-form-control-button-sizing/plan.md

## Semantic prop adoption conventions

This feature (slice 03 of the React Semantic Primitives plan) adds typed sizing
props (`width`, `maxWidth`) to the existing form control components (`Button`,
`Input`, `Select`, `Textarea`) using the shared resolver infrastructure.

- The shared type system and pure resolvers live in `packages/react/src/internal/resolvers/`.
- Components adopt semantic props by extending `SizingProps` and calling
  `mergeClasses()` with the documented merge order: required component classes
  → resolved semantic classes → consumer `className`.
- Semantic props must never introduce wrapper DOM elements — they apply classes
  to the root element the component already owns.
- `className` remains the escape hatch for application-specific classes; it
  always appears last in the class attribute and wins on equal CSS specificity.
- Resolvers are pure and deterministic — no browser-only globals — so
  server/client rendering output is identical.

### Key constraints for this slice

- Only `Button`, `Input`, `Select`, and `Textarea` are modified.
- Only `width` and `maxWidth` from `SizingProps` are added.
- Padding, margin, display, visibility, typography, and color props are excluded.
- No SCSS or `packages/styles` changes.

### Running the focused command

```bash
# Build the React package
pnpm --filter @pathable/react build

# Run component tests
pnpm --filter @pathable/react test
```

<!-- SPECKIT END -->
