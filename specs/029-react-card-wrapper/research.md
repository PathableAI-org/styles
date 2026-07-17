# Research for React Card Wrapper

## Technical Decisions

### Adherence to `@pathable/styles` Contract

**Decision**: The React `Card` component will strictly adhere to the existing `packages/styles` card contract. It will not introduce new variants, tokens, or visual semantics not present in the styles package.

**Rationale**: The project constitution mandates that wrapper packages act as thin consumers, leveraging the authoritative styles defined in `@pathable/styles`. This ensures consistency and prevents duplicated styling efforts.

### React Naming Parity

**Decision**: The React component will be named `Card`, directly mapping from `pathable-card` by removing the `pathable` prefix and converting to CamelCase, as per the constitution's React Naming Parity rule.

**Rationale**: This follows the established naming convention for mapping styles components to React components, promoting consistency across the codebase.

### Transitive Styling Inclusion

**Decision**: The React wrapper package will ensure that all necessary styles and assets for the `Card` component are automatically included through its dependency graph and entrypoints. Consumers will not need to import `@pathable/styles` separately for basic card usage.

**Rationale**: This fulfills the constitutional requirement for wrapper packages to provide complete imports for their consumers, simplifying integration and usage.

## Unknowns & Clarifications

### Existing Card Presentations

**Unknown**: The exact list of documented card presentations (beyond base, media, flag, header-first, and workflow) available in `packages/styles` that need to be mapped by the React wrapper.

**Clarification Needed**: A definitive list of all supported card presentations and their corresponding class names or modifiers from `packages/styles` is required. This will ensure comprehensive coverage by the React wrapper.

## Dependencies

### `@pathable/styles` Card Contract

**Dependency**: The React wrapper package depends on the existence and integrity of the `pathable-card` styles contract in `packages/styles`. This includes base, media, flag, header-first, and workflow presentations.

**Best Practices**: Ensure thorough testing of the `Card` component against the styles contract to validate visual and functional parity.

## Build & Validation

### Transitive Dependencies Check

**Task**: Verify that consumers installing only the React wrapper package can import and use the `Card` component with its required styling assets automatically included. This can be achieved through a `pnpm pack --dry-run` or equivalent package-content check.

**Validation**: The check must confirm that the `Card` export and its required transitive styling dependency are present in the built package.
