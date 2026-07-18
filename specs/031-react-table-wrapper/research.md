# Research for React Table Wrapper

## Technical Decisions

### Existing Source Contract Is Sufficient

**Decision**: Map the wrapper exclusively to `pathable-table` and its existing
basic modifiers: borderless, compact, and striped.

**Rationale**: The source SCSS and basic Storybook stories already define these
presentations. The constitution requires the React package to consume that
contract without redefining its visuals.

**Alternatives considered**: Add React-only table styling or broaden the first
wrapper to every dashboard modifier. React-only styles violate governance;
advanced modifiers involve application state and composition beyond the basic
wrapper requested.

### Component Naming

**Decision**: Export the component as `Table`.

**Rationale**: Removing the `pathable` prefix from `pathable-table` and applying
CamelCase produces the constitutionally required name.

**Alternatives considered**: `PathableTable` and `DataTable` were rejected
because they break naming parity or imply data orchestration absent from the
source contract.

### Semantic Composition Contract

**Decision**: Accept consumer-composed native table children and render them
unchanged inside the root table element.

**Rationale**: This preserves captions, table sections, header scopes, spans,
interactive cell content, and accessible relationships without inventing an
incomplete wrapper data schema.

**Alternatives considered**: A `columns` and `rows` API was rejected because it
would add a parallel data model, constrain valid table markup, and expand scope
into keys, formatting, sorting, and state behavior.

### Presentation Resolution

**Decision**: Expose `default`, `borderless`, `compact`, and `striped`; resolve
unsupported values to `default` and never generate arbitrary modifier classes.

**Rationale**: The bounded values directly match the basic source stories and
make fallback behavior deterministic and testable.

**Alternatives considered**: Boolean modifier props increase conflicting-state
combinations. Passing arbitrary modifier names weakens source-contract safety.

### Attribute and Class Preservation

**Decision**: Append consumer `className` after the required Pathable classes
and forward remaining valid table props to the root table.

**Rationale**: This matches existing wrappers and preserves labels, handlers,
and composition hooks without surrendering the required base class.

**Alternatives considered**: An allowlist would risk dropping valid native,
ARIA, or data attributes and would need ongoing maintenance.

### Transitive Styling and Validation

**Decision**: Preserve the existing public-entrypoint style import and verify
with the package build, React Storybook build, and package-content dry run.

**Rationale**: The entrypoint already imports compiled Pathable styles and the
package declares `@pathable/styles` as a runtime dependency. These checks prove
compilation, demonstration, export integrity, and publish contents.

**Alternatives considered**: Component-local CSS import or consumer-managed CSS
was rejected as redundant or contrary to the complete-import constitution rule.

## Clarifications

All technical unknowns are resolved. No `NEEDS CLARIFICATION` markers remain.
