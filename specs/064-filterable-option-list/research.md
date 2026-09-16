# Research: Filterable Option List

## Decision 1 - Use `FilterableOptionList` as the public name

**Decision**: Name the class contract `pathable-filterable-option-list` and the
React component `FilterableOptionList`.

**Rationale**: The name is domain-neutral and follows package naming parity.
`Checklist` already names the USWDS validation checklist contract in the Styles
package and would create semantic confusion.

**Alternatives considered**: `Checklist`, `FilterableChecklist`, and
`MultiSelectOptionList`. The first two collide with validation terminology; the
last understates filtering as a defining behavior.

## Decision 2 - Use native checkbox-group semantics

**Decision**: Render a native fieldset and legend containing a labeled search
input, one status node, and a list of native checkboxes.

**Rationale**: Checkboxes provide the expected multi-select semantics, Tab order,
Space activation, disabled behavior, and form familiarity without custom focus
management.

**Alternatives considered**: ARIA listbox with `aria-multiselectable` and a
checkbox-in-listbox hybrid. Listbox requires a different keyboard model, while
focusable checkboxes inside options create conflicting interaction semantics.

## Decision 3 - Support controlled and uncontrolled state

**Decision**: Support `values`/`onValuesChange` and
`defaultValues`/`onValuesChange`, plus equivalent controlled or uncontrolled
query props.

**Rationale**: Applications need synchronized state, while simple forms should
not need wrapper state. This follows established native-control and ComboBox
expectations.

**Alternatives considered**: Controlled-only, which adds avoidable consumer
plumbing, and uncontrolled-only, which cannot support application coordination.

## Decision 4 - Preserve selection order and absent values

**Decision**: Deselect by removal, append a newly selected ID, and otherwise
preserve existing order. Deduplicate values by first occurrence. Keep IDs absent
from the current options.

**Rationale**: External result sets may be partial or transient. Reordering
selections to match a partial option list would lose information and make
callbacks unstable.

**Alternatives considered**: Always sorting by current option order and dropping
unknown IDs. Both break server-backed filtering and hidden selections.

## Decision 5 - Offer client and external filtering modes

**Decision**: Client mode defaults to trimmed case-insensitive label substring
matching and accepts an optional predicate. External mode reports query changes
and renders supplied options unchanged.

**Rationale**: The library owns a useful default shell while products retain
domain matching and server-backed policy.

**Alternatives considered**: Client-only filtering, which cannot represent
remote catalogs, and external-only filtering, which makes the common local case
needlessly verbose.

## Decision 6 - Keep labels textual and details descriptive

**Decision**: Option labels are strings. Descriptions and metadata accept
non-interactive React content and share an `aria-describedby` relationship from
the checkbox.

**Rationale**: Text labels provide a deterministic default filter value and a
concise accessible name. Details remain available without bloating the name.

**Alternatives considered**: Arbitrary label nodes with a separate search string
and putting all details inside the label. Both increase API ambiguity; the latter
produces overly verbose names.

## Decision 7 - Submit selection through hidden successful controls

**Decision**: When `name` is set, render one hidden input per selected unique ID.
Visual checkboxes do not carry the submission name.

**Rationale**: Filtered and externally unloaded selected checkboxes may not be in
the DOM. Hidden controls ensure every selected value is submitted once without
duplicates from visible checked boxes.

**Alternatives considered**: Naming visible checkboxes only, which drops hidden
selections, and serializing one delimited value, which is not native repeated
field behavior.

## Decision 8 - Restore uncontrolled defaults on form reset

**Decision**: The client component listens to its owning form's reset event and
restores uncontrolled selection and query defaults.

**Rationale**: A form primitive that owns state should preserve expected native
reset behavior.

**Alternatives considered**: Documenting reset as consumer-owned. That would
make uncontrolled form usage surprising and incomplete.

## Decision 9 - Use one visible live status

**Decision**: Render one polite atomic status containing total selection count
and current result state. Distinguish empty catalog from no matches.

**Rationale**: A single channel avoids competing announcements while leaving
the same information visible to all users.

**Alternatives considered**: Separate selection and result live regions and
screen-reader-only output. Multiple regions over-announce; hidden-only output
withholds useful feedback from sighted users.

## Decision 10 - Fail fast on invalid option IDs

**Decision**: Throw a descriptive error for empty or duplicate option IDs before
rendering ambiguous rows.

**Rationale**: IDs define selection identity, callback values, React keys, and
form values. Guessing or silently dropping records would hide data defects.

**Alternatives considered**: First-wins deduplication, generated replacement IDs,
and development-only warnings. Each permits production behavior to diverge from
the supplied catalog.

## Decision 11 - Establish a dedicated Styles-first composition

**Decision**: Add a dedicated framework-neutral stylesheet and Styles story,
reusing existing PathAble fieldset, legend, input, label, and checkbox classes.

**Rationale**: The option region, status, row details, scrolling, and resilient
layout are a reusable visual contract that cannot be owned privately by React.

**Alternatives considered**: React-only CSS and utility-only composition. The
first violates package ownership; the second does not provide a stable component
contract for other frameworks.

## Decision 12 - Classify the React component as `client-ssr`

**Decision**: The component's React Storybook meta declares `client-ssr` with a
reason covering internal query/selection state, form-reset synchronization, and
event handlers. Server-rendered initial markup must remain meaningful.

**Rationale**: Hooks and callbacks require a client boundary, but the initial
fieldset and selected state can render on the server and hydrate deterministically.

**Alternatives considered**: Pretending the component is server-compatible by
default or marking it client-only. The former contradicts runtime behavior; the
latter understates useful SSR output.

## Decision 13 - Keep Storybook coverage package-local initially

**Decision**: Prove static visual semantics in Styles Storybook and interactive
behavior in React Storybook without adding a shared rollout capability in the
initial change.

**Rationale**: The repository requires Styles-first proof before shared rollout,
and the feature can receive complete package-level evidence without adding a
cross-package manifest prematurely.

**Alternatives considered**: Immediate shared contract registration. This adds
coordination cost before another framework consumes the behavior.
