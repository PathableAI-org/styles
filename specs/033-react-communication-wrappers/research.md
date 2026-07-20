# Research: React Communication Wrappers

## Source Contract Inventory

| Component | Implemented source surface | Excluded source-story drift |
| --- | --- | --- |
| Accordion | Root, heading, button, content; single or multi disclosure behavior | `pathable-accordion--border-box` is not implemented. |
| Alert | Info, success, warning, error, emergency, slim, and body | Heading and text class names in stories have no Pathable source selector. |
| Banner | Root, header, button, content, guidance, and lock-image disclosure | Current story describes dismissal and uses an unsupported text class. |
| Modal | Root, content, heading, footer, and close | Overlay, dialog, header, title, and body Pathable classes in the story are absent. |
| Process List | Ordered root, item, and heading | The story-only body class is absent. |
| Site Alert | Root, info, emergency, and slim | Warning, body, heading, and text Pathable classes are absent; dismissal is not implemented. |
| Step Indicator | Root, segments, current/completed states, labels, counters, header, and body helpers | No required state gap. |
| Summary Box | Root, heading, text, and link | No required state gap. |

**Decision**: Public React APIs map only the implemented source surface. Source
stories are corrected during implementation so examples do not imply unsupported
selectors or behavior.

**Rationale**: `packages/styles` is authoritative. A story is evidence of
intent, but cannot create a public class or behavior that source does not emit.

**Alternatives considered**: Adding every story-only selector would turn
documentation drift into a new visual contract. Ignoring the drift would leave
the source catalog misleading.

## Component Names and File Boundaries

**Decision**: Export `Accordion`, `Alert`, `Banner`, `Modal`, `ProcessList`,
`SiteAlert`, `StepIndicator`, and `SummaryBox` from matching component folders.

**Rationale**: Each name is the CamelCase form of the owning contract with the
`pathable` prefix removed, matching repository governance and current React
component layout.

**Alternatives considered**: A `Communication` namespace or `Pathable` prefixes
would conflict with existing package conventions and naming policy.

## Interactive Behavior Ownership

**Decision**: Accordion, Banner, and Modal implement their observable behavior
with React state and lifecycle primitives while rendering the verified Pathable
class contract. The package does not import `@pathable/styles/js` automatically.

**Rationale**: The shared JavaScript bundle is a browser-global IIFE that
initializes once against the current document and mutates DOM structure. Modal
initialization moves nodes and manages global attributes; importing it before a
React tree mounts cannot reliably initialize later components. React-owned
behavior preserves the documented interaction model, remains deterministic,
and avoids competing DOM ownership. Consumers still receive all required
behavior from `@pathable/react` without a separate import.

**Alternatives considered**: Auto-importing the global bundle risks server-side
evaluation failures and React/DOM mutation conflicts. Requiring consumers to
initialize it violates the complete-import contract. Adding a third-party
interaction library is unnecessary.

## Banner Contract Resolution

**Decision**: Banner is a disclosure component: its control toggles associated
supporting content and `aria-expanded`. It is not a dismissible notice.

**Rationale**: The implemented shared behavior selects a Banner header control
with `aria-controls` and toggles content visibility. The source story's
"Close banner" and dismissal claim conflict with that behavior and will be
corrected.

**Alternatives considered**: React-only dismissal would create behavior absent
from the verified source contract. Adding a new shared dismissal contract is a
separate feature.

## Site Alert Contract Resolution

**Decision**: SiteAlert is presentational and supports default/info, emergency,
and slim treatments. It does not expose warning or dismissal.

**Rationale**: Those are the only implemented selectors, and no close control or
dismiss state exists in the source contract.

**Alternatives considered**: Mapping warning to a different component would
misrepresent urgency. A React-only close button would invent interaction.

## Structured Content Models

**Decision**: Accordion uses stable item records and controlled/uncontrolled
expanded identifiers. ProcessList uses ordered item records. StepIndicator uses
ordered steps plus a one-based current-step value and derives completed state.

**Rationale**: These bounded models guarantee semantic order, deterministic
identifiers, valid control relationships, and at most one current step while
still accepting rich React content.

**Alternatives considered**: Unstructured children make it difficult for the
wrapper to guarantee relationships and state. Arbitrary HTML strings lose type
safety. Per-step public status permits conflicting current steps.

## Message and Dialog Content Models

**Decision**: Alert, SiteAlert, and SummaryBox accept a heading and rich body
content. Banner accepts a summary and rich supporting details. Modal accepts
controlled open state, title, optional description/footer, close callback and
label, and an optional initial-focus reference.

**Rationale**: Named semantic regions let wrappers apply only implemented
classes and required accessibility relationships while leaving actual content
consumer-owned.

**Alternatives considered**: Raw children alone cannot guarantee dialog naming
or the expected source structure. String-only props prevent links, emphasis,
and composed controls.

## Modal Rendering and Focus

**Decision**: Render an open Modal through a portal to the document body, capture
the active invoking element, move focus to the requested initial target or close
control, contain Tab navigation, close on Escape, restore focus, and lock body
scroll for the open interval.

**Rationale**: This is the React-native equivalent of the verified shared Modal
behavior and avoids clipping or stacking contexts inside consumer layout.

**Alternatives considered**: Inline rendering can be clipped and complicates
background isolation. A third-party dialog dependency expands runtime scope.

## Attribute, Role, and Fallback Policy

**Decision**: Append consumer classes and forward valid root attributes. Alert
and SiteAlert default to the source story's alert role but allow consumers to
override valid live-region semantics. Unsupported optional values resolve to
the documented default without arbitrary class output.

**Rationale**: This preserves native, ARIA, data, event, and composition hooks
while keeping the visual state bounded and avoiding class injection.

**Alternatives considered**: Attribute allowlists drop valid platform features.
Hard-coding all roles prevents consumers from distinguishing static and dynamic
messages.

## Styling, Storybook, and Package Validation

**Decision**: Retain the public compiled-CSS import and runtime styles
dependency. Validate source story corrections, React stories, package build,
declarations, pack contents, publint, and type-package quality independently.

**Rationale**: Consumers already receive CSS transitively. The new wrappers add
no stylesheet. Package and Storybook checks prove different parts of the public
contract and cannot substitute for one another.

**Alternatives considered**: Component-local CSS imports duplicate setup.
Monorepo build alone does not prove published exports or types are usable.

## Clarifications

All technical unknowns are resolved. No `NEEDS CLARIFICATION` markers remain.
