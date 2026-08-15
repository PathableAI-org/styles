# Research: React Activity List Wrapper

## Source-First Visual Contract

### Visible status text

**Decision**: Preserve `.pathable-activity-row__status[data-status]` as the
decorative shape and color marker, mark it hidden from assistive technology,
and render the consumer label immediately after it as a visible
`.pathable-activity-row__status-text` sibling. The text uses existing tokens
and single-line ellipsis containment.

**Rationale**: This is the narrowest correction that makes the status text
both visible and naturally available to assistive technology while retaining
the existing marker geometry, known-state selectors, neutral unknown-state
fallback, forced-colors shapes, and density behavior. One visible text node is
the source of accessible meaning, so no duplicate `role="img"` or `aria-label`
is needed.

**Alternatives considered**: Keeping only `role="img"` plus `aria-label` fails
the visible-text requirement. Nesting text inside the fixed marker conflicts
with its dimensions and current hidden-text rule. Rebuilding markers with
pseudo-elements expands selector and forced-colors risk. React-only CSS would
violate the source-authority boundary.

### Date and owner containment

**Decision**: Make the date shrinkable with `min-width: 0`, bounded width,
hidden overflow, and ellipsis while retaining its existing mobile width and
ordering. Keep the owner as a flex container, make it shrinkable, and add a
`.pathable-activity-row__owner-text` child that owns single-line ellipsis.

**Rationale**: The accepted requirements authorize this source-first repair.
Text-overflow is reliable on the date element and on an explicit owner-text
child, but not on anonymous text inside a flex owner container. Complete values
remain in the DOM and consumer-supplied `<time>`, accessible descriptions, and
attributes remain intact.

**Alternatives considered**: Wrapping contradicts the accepted truncation
rule. Fixed widths or line clamps create a new visual contract. Applying
ellipsis only to the flex owner container is unreliable. JavaScript
truncation would remove content and duplicate presentation behavior.

### Preserved source behavior

**Decision**: Leave known and unknown status shapes, forced-colors overrides,
default/compact/comfortable spacing, title/context truncation, action
hover/focus/coarse-pointer visibility, the 640-pixel viewport breakpoint,
date-first mobile order, empty state, and reduced-motion behavior otherwise
unchanged.

**Rationale**: The clarification authorizes only visible status and metadata
containment corrections. Holding the remaining selectors stable minimizes
cross-consumer regression risk and keeps the work from becoming a row-layout
redesign.

**Alternatives considered**: Container queries, new tokens, changed density,
new status meanings, broad row reflow, or altered action visibility all exceed
the accepted scope.

### Source documentation alignment

**Decision**: Update every repository-owned Activity List row example in the
canonical Dashboard story and the Dashboard Overview and Operational Dashboard
compositions. Each example receives a decorative marker, visible status text,
and explicit owner-text wrapper; the canonical story also adds deterministic
long-content and unknown-status evidence.

**Rationale**: Shared source stories are executable contracts. Leaving any
repository-owned composition on marker-only status markup would preserve the
documented accessibility drift and weaken cross-catalog validation.

**Alternatives considered**: Updating React only violates source-first parity.
Updating only the canonical primitive leaves composed documentation
contradictory. Retaining marker `aria-label` beside visible text risks duplicate
announcements and label drift.

## React Public Contract

### Structured content model

**Decision**: Expose mutually exclusive flat `items` or grouped `groups` data.
Each item has a stable ID, rich inline title/context/date/owner content, a
status value and string label, optional consumer action content, and optional
row attributes. Groups have a stable ID, heading, ordered items, and optional
group attributes. The list supports density, empty content, heading level, and
valid root attributes.

**Rationale**: Structured records let the wrapper guarantee order, stable
keys, source BEM regions, visible status labels, group omission, empty
behavior, and deterministic server output. A discriminated content union
prevents ambiguous precedence. Rich inline nodes preserve `<time>`, links, and
localized markup while the string status label prevents visible and accessible
status meanings from diverging.

**Alternatives considered**: Raw children or compound subcomponents cannot
guarantee required structure and labeling. A mixed heading/item array is less
ergonomic. Independently optional `items` and `groups` create undefined
precedence. String-only row fields prevent valid inline semantics.

### Status and density resolution

**Decision**: Preserve the supplied status value in `data-status`; the four
documented values match existing selectors and unfamiliar values naturally
retain the neutral base marker. Render the supplied `statusLabel` verbatim.
Default density adds no modifier; compact and comfortable map to their existing
modifiers; unsupported runtime density values resolve to default.

**Rationale**: The component does not infer, localize, or silently convert
business status. Bounded density resolution prevents undocumented modifier
classes while remaining deterministic for untyped runtime input.

**Alternatives considered**: Auto-formatting status tokens changes consumer
language. Converting unknown statuses loses meaning. Boolean density flags can
conflict. Arbitrary modifier construction weakens the source contract.

### Semantic grouped and flat markup

**Decision**: Flat content uses the root as `role="list"` with direct
`role="listitem"` rows. Grouped content uses an unroled outer visual container;
each visible heading is immediately followed by a nested
`.pathable-activity-list[role="list"]` whose `aria-labelledby` references that
heading. Empty groups are filtered. A server-stable React `useId` prefix plus
group position creates unique heading IDs; the supplied group ID remains the
React key.

**Rationale**: Named nested lists preserve direct list/listitem ownership,
reuse existing gap styling without a new visual class, and satisfy both visual
adjacency and programmatic association. `useId` is hydration-stable and is
explicitly treated as server-compatible by the repository audit.

**Alternatives considered**: A single list containing headings breaks direct
list/listitem ownership. Native `ul`/`li` introduces unreset browser list
presentation. Consumer-generated IDs create collision risk. Sections add
unnecessary landmarks. `display: contents` wrappers have accessibility risk.

### Attribute ownership and empty output

**Decision**: Preserve root, row, and group HTML/ARIA/data/event attributes and
merge consumer classes after required Pathable classes. Omit consumer ownership
of `children`, structural roles, and group `aria-labelledby`. Reapply required
classes and semantics after spreading consumer attributes. When no rows remain,
render only the empty root modifier and supplied empty content region; do not
fabricate a default message.

**Rationale**: Consumers retain legitimate composition hooks without being able
to erase the component's required class and semantic contract. Empty output
stays deterministic and consumer-authored.

**Alternatives considered**: Attribute allowlists drop valid platform
attributes. Unrestricted trailing spreads can replace owned semantics. A built-
in empty message invents product copy.

### Server-first package surface

**Decision**: Keep `ActivityList` free of a client directive, browser globals,
effects, state, event ownership, formatting, sorting, filtering, fetching, and
persistence. Export the component and all consumer-facing types from the root
entrypoint, which retains its existing `@pathableai/styles` side-effect import.

**Rationale**: All content, links, labels, and relationships are available in
initial output. Consumer-provided actions can be client components without
making this presentational wrapper client-only. Root exports and generated
declarations provide the complete package contract while the existing
dependency graph supplies styles.

**Alternatives considered**: A client boundary weakens server compatibility
without owned behavior. Component-local style imports duplicate entrypoint
responsibility. Internal-only types make the public declaration surface
incomplete.

## Behavior and Validation Decisions

### Scenario taxonomy adaptation

**Decision**: Preserve negative and validation intent in the Phase 0 drafts.
In formal scenario instances, represent their executable successful behavior
as positive instances and record `case_coverage_blockers` for
`CASE-NEGATIVE-001`, `CASE-VALIDATION-001`, and `CASE-SEMANTIC-002`. Represent
the successful alternate case as positive while retaining
`CASE-ALTERNATE-002` in its source and request-case metadata.

**Rationale**: The formal schema forces every negative or validation instance
to be a failed request with an error code and failure feedback, and it has no
alternate type. The accepted missing-action, unknown-status, known-status, and
group-association cases are successful omission or conformance behavior. An
explicit schema-taxonomy blocker preserves traceability without inventing
product failures.

**Alternatives considered**: Fake error codes would create requirements that
do not exist. Silently relabeling the checklist cases erases traceability.
Changing workflow schemas is outside this feature's M + U scope.

### Test level, fixtures, and external systems

**Decision**: Use deterministic in-memory synthetic fixture families in source
and React Storybook for browser, accessibility, responsive, and visual
evidence. Use the existing packed Next App Router consumer for package and
server-output evidence. No API mocks or external systems are required.

**Rationale**: The component owns no service, network, authorization, storage,
or mutation. Browser Storybook proves rendered behavior; the advisory server
audit proves source compatibility; the packed Next fixture proves consumer
exports, declarations, initial HTML, and transitive CSS. Each evidence surface
answers a different risk.

**Alternatives considered**: A service mock invents an integration. Workspace
builds alone do not validate packed manifests or downstream rendering. Strict
server-audit mode is not a feature gate because the repository retains a known
six-finding baseline.

### Error and fallback branches

**Decision**: Validate unfamiliar status as a neutral successful fallback,
missing actions as successful omission, empty groups as successful omission,
and zero rows as the consumer-supplied empty state. Treat loading, service
errors, permissions, state conflicts, retries, rollback, and recovery as not
applicable or consumer-owned.

**Rationale**: These are the only specified fallback branches. The wrapper has
no mutation or service boundary from which operational error semantics could
arise.

**Alternatives considered**: Adding loading, failure, permission, or rollback
variants would broaden the source contract and public API.

### Story and documentation matrix

**Decision**: Add deterministic React Playground, grouped Default,
UngroupedWithoutActions, MixedStatuses, UnknownStatus, Compact, Comfortable,
Mobile, LongContent, and Empty stories under `Dashboard/Activity List`.
Browser play coverage uses accessible roles and visible text for ordering,
status meaning, group labeling, omitted empty groups/actions, and native action
focus/activation. README guidance remains the package-consumer reference;
Storybook remains the exhaustive executable state catalog.

**Rationale**: Fixed stories satisfy the constitution's regression and
documentation responsibilities. Accessible queries verify the public semantic
contract rather than private CSS selectors or test IDs.

**Alternatives considered**: A Playground alone is not deterministic
regression evidence. CSS-only assertions miss semantic and keyboard outcomes.
Tagging the component client-only would misclassify it.

### Visual validation carry-forward

**Decision**: Keep all five Visual Item IDs at L0 repository-contract evidence
and validate them through stable browser-rendered fixtures:

- `VIS-001`: known and unknown status labels and markers plus all densities.
- `VIS-002`: long title/context/status/date/owner content at 375, 768, and 1280
  pixels, increased text, mobile date ordering, action availability, and no
  horizontal overflow.
- `VIS-003`: immediately adjacent grouped headings with resolving
  `aria-labelledby`, stable order, and omitted empty groups.
- `VIS-004`: unchanged desktop hover/focus action reveal, coarse/mobile
  visibility, focus containment, and absent-action omission.
- `VIS-005`: exact empty modifier/content structure and the complete named
  source and React catalog state matrix.

**Rationale**: L0 means no external screenshot is a planning prerequisite; it
does not waive visual regression, responsive, or computed-style evidence. Both
Styles and React Storybooks must pass independently because the shared source
contract changes.

**Alternatives considered**: Provider screenshot approval is unrelated to this
repository-owned contract. Serialized DOM alone cannot prove overflow,
ellipsis, focus, spacing, or marker fidelity.

### Package and release evidence

**Decision**: Validate Styles and React builds, lint, formatting, both
Storybooks, rendered accessibility, visual/quality gates, advisory server
compatibility, package contents and declarations, the packed Next consumer,
and existing shared behavior contracts. Add patch Changesets for both affected
packages and validate Changesets status; do not publish.

**Rationale**: The source CSS contract and public React API are both consumer-
visible. A real packed consumer is required to prove declaration exports,
rewritten package metadata, transitive styles, and server-rendered output.

**Alternatives considered**: A monorepo build cannot prove the packed consumer
surface. Publishing is outside the user's authorization. Adding Activity List
to the shared DOM-behavior harness would incorrectly make the wrapper own its
consumer actions.

## Clarification Status

All feature and technical unknowns are resolved. The formal behavior contracts
retain explicit workflow-schema taxonomy blockers, but these do not represent
product or implementation ambiguity and do not block task generation.
