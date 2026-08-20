<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/048-stack-primitive/plan.md

## Stack primitive

This feature (slice 06 of the React Semantic Primitives plan) adds a new
`Stack` layout primitive that renders a vertically-stacked flex container
(`flex-direction: column`) with token-based spacing between its immediate
children. It consumes the existing `.pathable-stack` SCSS contract and
`.pathable-flex-align-*` utility classes from `@pathable/styles` with no
SCSS changes.

- The component follows the PascalCase naming convention: `pathable-stack` →
  `Stack`.
- A `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`) maps directly to BEM modifier
  classes (`.pathable-stack--gap-sm`, etc.).
- An `align` prop (`"start"`, `"center"`, `"end"`, `"stretch"`, `"baseline"`)
  maps to existing `align-items` utility classes via the `alignItemsClass`
  resolver.
- Sizing (`width`, `maxWidth`) and external spacing (`margin`, `marginX`,
  `marginY`, directional) props from the shared `SizingProps` and `SpacingProps`
  capability system.
- A polymorphic `as` prop follows the established `Container` pattern.
- Class merging uses `mergeClasses()` with the documented order: base class
  (`pathable-stack`) → gap modifier → alignment → sizing → spacing → consumer
  `className`.
- No wrapper DOM elements — classes apply to the single root element.
- No SCSS or `packages/styles` changes.

### Key constraints

- Only one new component: `Stack`.
- The `gap` prop uses named scale values (`"sm"`, `"md"`, `"lg"`, `"xl"`),
  matching the SCSS modifier class suffixes.
- No `justifyContent` prop — excluded from initial scope.
- No typography, color, tone, display, visibility, or child-wrapping props.
- No changes to `packages/styles`. Stack consumes the existing SCSS contract
  and utility classes as-is.
- The polymorphic `as` pattern follows the established `Container` approach.

### Running the focused command

```bash
# Build the React package
pnpm --filter @pathable/react build

# Run Stack component tests
pnpm --filter @pathable/react test -- --testPathPattern="Stack"
```

<!-- SPECKIT END -->
