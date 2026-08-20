<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/047-container-primitive/plan.md

## Container primitive

This feature (slice 05 of the React Semantic Primitives plan) adds a new
`Container` layout primitive that renders a centered, width-constrained content
region with horizontal gutter padding. It consumes the existing `.pathable-container`
SCSS contract from `@pathable/styles` with no SCSS changes.

- The component follows the PascalCase naming convention: `pathable-container` →
  `Container`.
- A `size` prop (`"standard"`, `"wide"`, `"full"`) maps directly to BEM modifier
  classes (`.pathable-container--standard`, etc.).
- A polymorphic `as` prop allows rendering as a semantic HTML element (`"main"`,
  `"section"`, `"nav"`, etc.), establishing the pattern for future primitives
  (`Box`).
- Class merging uses `mergeClasses()` with the documented order: base class
  (`pathable-container`) → modifier class → consumer `className`.
- No wrapper DOM elements — classes apply to the single root element.
- No SCSS or `packages/styles` changes.

### Key constraints

- Only one new component: `Container`.
- No `SizingProps` or `SpacingProps` — `size` is the exclusive width mechanism.
- No typography, color, tone, display, or visibility props.
- No changes to `packages/styles`. Container consumes the existing SCSS contract as-is.
- The polymorphic `as` pattern must be implemented without external libraries.

### Running the focused command

```bash
# Build the React package
pnpm --filter @pathable/react build

# Run Container component tests
pnpm --filter @pathable/react test -- --testPathPattern="Container"
```

<!-- SPECKIT END -->
