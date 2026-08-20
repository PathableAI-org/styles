<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/049-inline-cluster-primitives/plan.md

## Inline and Cluster primitives

This feature (slice 07 of the React Semantic Primitives plan) adds two new
horizontal layout primitives to `@pathable/react`: `Inline` (non-wrapping row,
`flex-direction: row`) and `Cluster` (wrapping row, `flex-wrap: wrap`). Both
consume SCSS contracts from `@pathable/styles` with token-based spacing.

### Inline

- A new `pathable-inline.scss` SCSS contract provides `display: flex;
flex-direction: row` with CSS custom property–based gap control.
- A `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`) maps to
  `.pathable-inline--gap-{size}` modifier classes. Gap scale: 8px/16px/24px/32px
  (same as Stack).
- An `align` prop maps to `.pathable-flex-align-{value}` utility classes via
  `alignItemsClass()`.
- A `justify` prop maps to `.pathable-flex-justify-{value}` utility classes via
  `justifyContentClass()`.
- Sizing and spacing props from the shared `SizingProps`/`SpacingProps` capability
  system (padding excluded).
- Polymorphic `as` prop, ref forwarding, `mergeClasses()` class composition.

### Cluster

- The existing `.pathable-cluster` SCSS contract is modified: add `--gap-xl`
  modifier (`var(--space-24)`) and `--align-baseline` modifier.
- A `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`) maps to
  `.pathable-cluster--gap-{size}` modifier classes. Cluster gap scale is tighter:
  4px/8px/16px/24px.
- An `align` prop maps to `.pathable-cluster--align-{value}` SCSS modifier
  classes (not utility classes). Cluster defaults `align-items: center` via SCSS.
- No `justify` prop — wrapping behavior interacts non-trivially with
  `justify-content`.
- Same sizing, spacing, polymorphic, and ref forwarding patterns as Inline.

### Key constraints

- Two new React components: `Inline` and `Cluster`.
- One new SCSS file (`pathable-inline.scss`), two SCSS modifications
  (`pathable-cluster.scss`, `pathable-layout-composition.scss`).
- No typography, color, tone, display, visibility, or child-wrapping props.
- No wrapper DOM elements — all classes on the single root element.

### Running the focused commands

```bash
# Build all packages
pnpm build

# Build the React package
pnpm --filter @pathable/react build

# Run Inline component tests
pnpm --filter @pathable/react test -- --testPathPattern="Inline"

# Run Cluster component tests
pnpm --filter @pathable/react test -- --testPathPattern="Cluster"

# Run all layout primitive tests
pnpm --filter @pathable/react test -- --testPathPattern="Inline|Cluster|Stack"
```

<!-- SPECKIT END -->
