# Research for React List Wrapper

## Technical Decisions

### Existing `pathable-list` Contract Is Sufficient

**Decision**: The React `List` component will strictly map to the existing
`packages/styles` `pathable-list` contract and its documented unordered,
ordered, and unstyled presentations.

**Rationale**: The source styles contract already exists in
`packages/styles/src/pathable-component-wrappers/pathable-list.scss`, and the
styles Storybook documents the supported list presentations. The constitution
requires wrapper packages to consume this contract rather than redefine visual
semantics.

**Alternatives considered**: Add new React-only list variants or styling. This
was rejected because wrapper-only visual semantics are constitution violations.

### React Naming Parity

**Decision**: The React component will be named `List`.

**Rationale**: The equivalent `packages/styles` component is `pathable-list`;
removing `pathable` and converting to CamelCase yields `List`.

**Alternatives considered**: Names such as `PathableList` or `ReactList` were
rejected because they do not follow the repo's wrapper naming rule.

### Presentation API

**Decision**: The wrapper will expose a presentation choice for `unordered`,
`ordered`, and `unstyled`, mapping to the documented source contract classes.

**Rationale**: These are the presentations demonstrated in the existing styles
Storybook for `pathable-list`. Planning a bounded presentation API keeps the
wrapper testable and prevents accidental expansion into unsupported variants.

**Alternatives considered**: Infer presentation only from child markup or allow
arbitrary presentation names. Inference alone is less explicit for developers,
and arbitrary names would weaken contract validation.

### Item Rendering Contract

**Decision**: The wrapper will support item-driven rendering while preserving
consumer-provided rich content and attributes; implementation may also preserve
children for ergonomic composition if it remains aligned with the contract.

**Rationale**: The spec requires multiple supplied items in order, rich item
content, empty-list handling, and accessible list semantics. A clear item
contract gives tasks and tests something concrete to validate.

**Alternatives considered**: Require consumers to provide all list markup as
children. This was rejected as the only contract because it would leave too much
of the design-system class structure to consumers.

### Transitive Styling

**Decision**: Keep transitive styling through `packages/react/src/index.js`,
which imports `@pathable/styles/dist/styles.css`.

**Rationale**: The constitution requires consumers to import wrapper packages
without separately importing `@pathable/styles`. The package already follows
this pattern, so the List work should preserve it and validate it.

**Alternatives considered**: Import styles inside the List component or require
consumer-level CSS imports. Component-local style imports would duplicate the
entrypoint concern, and consumer-level imports violate the wrapper package
contract.

### Validation Path

**Decision**: Validate with `packages/react` build, React Storybook build, and a
package-content dry run that confirms the List export and transitive dependency
path.

**Rationale**: These checks prove the component compiles, can be demonstrated,
and remains installable with its style dependency.

**Alternatives considered**: Manual Storybook inspection only. This was
rejected because it does not prove package output or export integrity.

## Clarifications

All planning unknowns are resolved. No `NEEDS CLARIFICATION` markers remain.
