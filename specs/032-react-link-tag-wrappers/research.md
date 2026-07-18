# Research for React Link and Tag Wrappers

## Technical Decisions

### Existing Source Contracts Are Sufficient

**Decision**: Map the wrappers exclusively to the implemented `pathable-link`
base/external classes and `pathable-tag` base/big classes.

**Rationale**: The source SCSS defines these treatments, and the constitution
requires React wrappers to consume existing visual contracts without redefining them.

**Alternatives considered**: Expose the Link Storybook `nav` example or create
React-only treatments. The `pathable-link--nav` class has no source definition,
and wrapper-only styles violate source ownership.

### Component and Root Element Mapping

**Decision**: Export `Link` as a native anchor and `Tag` as a span.

**Rationale**: The names follow repository parity rules. The root elements match
the owning basic stories and preserve familiar browser and assistive-technology behavior.

**Alternatives considered**: `PathableLink`/`PathableTag` break naming parity.
Polymorphic roots would broaden the first contract and could allow semantics
that do not match the owning component.

### Bounded Variant Resolution

**Decision**: Link accepts `default` or `external`; Tag accepts `default` or
`big`. Unsupported values resolve to default without arbitrary modifier output.

**Rationale**: Bounded values keep every public visual state traceable to the
source contract and provide deterministic fallback behavior.

**Alternatives considered**: Boolean props or arbitrary modifier strings create
conflicting states or bypass the source-contract boundary.

### Consumer-Owned Navigation Policy

**Decision**: The external Link presentation changes only its class. Consumers
remain responsible for `href`, `target`, `rel`, download behavior, routing, and handlers.

**Rationale**: Presentation cannot reliably determine whether a destination
should open a new context or which relationship policy an application requires.

**Alternatives considered**: Automatically setting `target="_blank"` and
`rel` was rejected because it silently changes behavior beyond the styles contract.

### Attribute and Content Preservation

**Decision**: Append consumer `className`, forward remaining valid root props,
and render children unchanged.

**Rationale**: This preserves native, ARIA, data, event, and composition hooks
without surrendering the required base classes.

**Alternatives considered**: Attribute allowlists risk dropping valid platform
attributes and require ongoing maintenance.

### Transitive Styling and Validation

**Decision**: Preserve the public-entrypoint style import and validate with the
React package build, React Storybook build, and package-content dry run.

**Rationale**: The entrypoint imports compiled Pathable styles and the package
declares `@pathable/styles` as a runtime dependency. These checks cover compile,
examples, exports, and publish contents.

**Alternatives considered**: Component-local CSS imports duplicate setup;
consumer-managed CSS conflicts with the complete-import constitution rule.

## Clarifications

All technical unknowns are resolved. No `NEEDS CLARIFICATION` markers remain.
