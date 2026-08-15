# Data Model: React Activity List Wrapper

## Activity List

Represents one rendered list in flat, grouped, or empty mode.

**Fields**

- `contentMode`: exactly one of flat items or grouped items.
- `density`: `default`, `compact`, or `comfortable`; defaults to `default`.
- `emptyContent`: optional consumer-provided content used when zero rows remain.
- `groupHeadingLevel`: heading level 2 through 6; defaults to 3.
- `className` and `rootAttributes`: optional additive root composition data.

**Validation rules**

- Flat items and groups are mutually exclusive.
- Supplied order is preserved; no sorting or grouping is inferred.
- Unsupported runtime density values resolve to default and never create an
  arbitrary modifier.
- A non-empty list exposes list/listitem semantics; an empty list exposes only
  the empty treatment and supplied content.

## Activity Item

Represents one immutable consumer-supplied row.

**Fields**

- `id`: required stable React key.
- `title`: required inline display content.
- `context`: required inline display content.
- `date`: required inline display content; may contain a semantic `<time>`.
- `owner`: required inline owner or participant content.
- `status`: required documented or unfamiliar status value.
- `statusLabel`: required visible string and sole status meaning exposed to
  assistive technology.
- `actions`: optional consumer-owned named controls or links.
- `attributes`: optional additive row HTML, ARIA, data, event, and class data.

**Validation rules**

- Items render in supplied order and keep complete content in the DOM.
- Item IDs are unique within the resolved list so React keys remain stable.
- Known statuses retain their existing marker treatment. Unknown statuses keep
  their supplied value and label and receive the neutral marker.
- The marker is decorative; the visible status label supplies accessible
  meaning.
- Missing actions produce no empty action container or inactive control.
- Title, context, status, date, and owner text follow the corrected source
  truncation contract without JavaScript content mutation.

## Activity Group

Represents a visible heading and its ordered items.

**Fields**

- `id`: required stable React key.
- `heading`: required visible heading content.
- `items`: readonly ordered Activity Item collection.
- `attributes`: optional additive group-list HTML, ARIA, data, event, and class
  data, excluding owned role and label relationship.
- `generatedHeadingId`: server-stable identifier derived at render time.

**Validation rules**

- Empty groups are omitted.
- Group IDs are unique within the supplied group collection.
- The visible heading immediately precedes its nested list.
- The nested list references the heading through `aria-labelledby`.
- Consumers cannot replace the component-owned list role or label reference.

## Activity Status

| Category | Values | Marker | Label behavior |
| --- | --- | --- | --- |
| documented | `completed`, `in-progress`, `pending`, `cancelled` | Existing source shape/color selector | Supplied label remains visible and accessible. |
| unfamiliar | Any other non-empty consumer value | Neutral base marker | Supplied label remains visible and accessible; no conversion occurs. |

The component does not infer localization, formatting, workflow state, or
transitions from the value.

## Density

| Value | Source class mapping |
| --- | --- |
| `default` | `pathable-activity-list` |
| `compact` | `pathable-activity-list pathable-activity-list--compact` |
| `comfortable` | `pathable-activity-list pathable-activity-list--comfortable` |
| unsupported runtime value | default mapping |

## Empty State

An Activity List is empty when flat items are empty or every supplied group is
empty. Empty output contains the root empty modifier and the empty content
region only. It has no row, heading, group list, status, or fabricated message.

## Relationships

- One Activity List has one resolved Density.
- One flat Activity List contains zero or more Activity Items.
- One grouped Activity List contains zero or more non-empty Activity Groups.
- One Activity Group contains one or more Activity Items.
- Each Activity Item has exactly one Activity Status value and label.
- Each non-empty Activity Group owns one generated heading relationship.

## State Transitions

N/A. The wrapper owns no loading, error, status transition, selection,
mutation, persistence, retry, rollback, or recovery state.

## Behavior Contract Entities

### BehaviorScenarioInstance

Connects one formal scenario to one UIF path, one or more Data Fixtures, a
request-case classification, expected observable feedback, and Behavior
Assertions. The accepted negative and validation behaviors remain successful
product behavior; workflow-schema taxonomy limitations are recorded separately.

### DataFixture

Defines deterministic synthetic Activity Lists, statuses, densities, content,
viewport conditions, empty states, and packed-consumer setup. No production
record, live date, network response, or sensitive data is permitted.

### UIFPath

Defines an observable Storybook, keyboard-action, server-rendering, or package-
consumer path. Paths contain only user or system events; no API call is modeled
because the component owns no service.

### FeedbackView

Represents visible and accessible DOM output, focus/action availability,
responsive containment, empty output, server HTML, or package evidence.

### BehaviorAssertion

Defines observable content, order, role, relationship, class, status fallback,
overflow, focus, export, declaration, or transitive-style expectations used by
formal scenario instances.
