<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/050-grid-primitive/plan.md

## Grid Primitive

This feature (slice 08 of the React Semantic Primitives plan) adds a new
CSS Grid layout primitive to `@pathable/react`: `Grid`. It renders a CSS Grid
container with design-system-approved column configurations and token-based
spacing, consuming a new SCSS contract from `@pathable/styles`.

### Grid

- A new `pathable-grid.scss` SCSS contract provides `display: grid` with
  modifier classes for column counts (2, 3, 4), gap control (sm/md/lg/xl),
  separate column and row gap, and alignment (start/center/end/stretch/baseline).
- A `cols` prop (`2`, `3`, or `4`) maps to `.pathable-grid--cols-{n}` modifier
  classes.
- A `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`) maps to
  `.pathable-grid--gap-{size}` modifier classes. Grid gap scale: 8px/16px/24px/32px
  (same as Stack).
- Optional `columnGap` and `rowGap` props map to
  `.pathable-grid--column-gap-{size}` and `.pathable-grid--row-gap-{size}`
  modifier classes for independent axis gap control.
- An `align` prop maps to `.pathable-grid--align-{value}` SCSS modifier classes
  (not utility classes). Grid defaults `align-items: stretch` via browser default.
- Sizing and spacing props from the shared `SizingProps`/`SpacingProps` capability
  system (padding excluded).
- Polymorphic `as` prop, ref forwarding, `mergeClasses()` class composition.

### Key constraints

- One new React component: `Grid`.
- One new SCSS file (`pathable-grid.scss`), one SCSS modification
  (`pathable-layout-composition.scss`).
- No full CSS Grid language (arbitrary `grid-template-columns`, `grid-area`,
  named grid lines).
- No responsive column counts, masonry, or subgrid behavior.
- No typography, color, tone, display, visibility, or child-wrapping props.
- No wrapper DOM elements — all classes on the single root element.

### Running the focused commands

```bash
# Build all packages
pnpm build

# Build the React package
pnpm --filter @pathable/react build

# Run Grid component tests
pnpm --filter @pathable/react test -- --testPathPattern="Grid"

# Run all layout primitive tests
pnpm --filter @pathable/react test -- --testPathPattern="Grid|Inline|Cluster|Stack"
```

<!-- SPECKIT END -->
