<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/045-card-sizing-spacing/plan.md

## Semantic prop adoption conventions

This feature (slice 02 of the React Semantic Primitives plan) adds typed sizing
and external-spacing props to the existing `Card` component as an architectural
proof point for the semantic-prop approach.

- The shared type system and pure resolvers live in `packages/react/src/internal/resolvers/`.
- Components adopt semantic props by extending capability interfaces (`SizingProps`, `SpacingProps`) and calling `mergeClasses()` with the documented merge order: required component classes → resolved semantic classes → consumer `className`.
- Semantic props must never introduce wrapper DOM elements — they apply classes to the root element the component already owns.
- `className` remains the escape hatch for application-specific classes; it always appears last in the class attribute and wins on equal CSS specificity.
- Resolvers are pure and deterministic — no browser-only globals — so server/client rendering output is identical.

### Key constraints for this slice

- Only `Card` is modified; no other components or primitives.
- Only `width`, `maxWidth`, `margin`, `marginX`, `marginY`, `marginTop`, `marginBottom` are added.
- Internal padding, typography, color, display, visibility, and layout-participation props are excluded.
- No SCSS or `packages/styles` changes.

### Running the focused command

```bash
# Build the React package
pnpm --filter @pathable/react build

# Run Card component tests
pnpm --filter @pathable/react test
```

<!-- SPECKIT END -->
