# Data Model: React Communication Wrappers

## Communication Component

Represents one public adapter over an owning Pathable source contract.

**Fields**

- `name`: One of the eight governed public component names.
- `baseClass`: Required owning root class.
- `supportedClasses`: Closed set of implemented optional classes.
- `content`: Consumer-supplied React content.
- `className`: Optional additional consumer classes.
- `rootAttributes`: Valid semantic, accessibility, data, and event attributes.

**Validation rules**

- Name and base class map one-to-one to an owning source contract.
- The base class is never replaced by consumer classes.
- Unsupported values never become class names.
- Consumer content and valid attributes remain unchanged.

## Accordion and Accordion Item

**Accordion fields**

- `items`: Ordered array of Accordion Item records.
- `expandedIds`: Optional controlled set of expanded item identifiers.
- `defaultExpandedIds`: Initial uncontrolled expanded set.
- `allowMultiple`: Whether more than one item may be expanded.
- `onExpandedChange`: Optional notification with the resolved expanded set.

**Accordion Item fields**

- `id`: Required stable identifier unique within the Accordion.
- `heading`: Consumer-supplied control label.
- `content`: Consumer-supplied panel content.
- `disabled`: Optional unavailable state.

**Validation rules**

- Each control targets exactly one deterministic panel identifier.
- Duplicate identifiers are invalid and do not target an unrelated panel.
- Single-select mode retains at most one expanded identifier.
- Disabled items do not toggle.

**State transitions**

- Collapsed + activate -> expanded.
- Expanded + activate -> collapsed.
- Expanding an item in single-select mode -> other expanded items collapse.

## Alert and Site Alert

**Alert fields**

- `status`: `info`, `success`, `warning`, `error`, or `emergency`.
- `slim`: Optional compact density.
- `heading`: Optional rich heading content.
- `children`: Rich body content.
- `role`: Valid consumer-overridable live-region role.

**Site Alert fields**

- `status`: `default`, `info`, or `emergency`.
- `slim`: Optional compact density.
- `heading`: Optional rich heading content.
- `children`: Rich body content.
- `role`: Valid consumer-overridable live-region role.

**Validation rules**

- Unknown status resolves to the documented default.
- Slim may combine only with an implemented status.
- Site Alert does not expose warning or dismissal.

## Banner

**Fields**

- `summary`: Consumer-supplied disclosure label or summary.
- `children`: Supporting details controlled by the Banner button.
- `expanded`: Optional controlled expanded state.
- `defaultExpanded`: Initial uncontrolled expanded state.
- `onExpandedChange`: Optional state-change notification.
- `id`: Optional stable relationship prefix; otherwise generated stably.

**Validation rules**

- The button and content share one deterministic relationship.
- `aria-expanded` and hidden state always agree.
- Banner does not dismiss or persist state.

**State transitions**

- Collapsed + activate -> expanded.
- Expanded + activate -> collapsed.

## Modal

**Fields**

- `open`: Consumer-controlled visibility.
- `title`: Required accessible title content.
- `description`: Optional descriptive content.
- `children`: Dialog body content.
- `footer`: Optional action content.
- `onClose`: Required close-request callback.
- `closeLabel`: Accessible close-control label.
- `initialFocusRef`: Optional preferred focus target.

**Validation rules**

- A rendered Modal has a stable accessible name relationship.
- Closing requests do not mutate application persistence.
- Focus never remains trapped after close.
- Missing preferred focus falls back to the close control or first operable item.

**State transitions**

- Closed + consumer sets `open` -> portal mounts, scroll locks, focus enters.
- Open + Escape or close activation -> `onClose` requested.
- Open + consumer sets closed -> portal unmounts, scroll restores, focus returns.

## Process List and Process Item

**Process List fields**

- `items`: Ordered array of Process Item records.

**Process Item fields**

- `id`: Stable item identity.
- `heading`: Rich item heading.
- `body`: Rich explanatory content.

**Validation rules**

- Rendering preserves array order and ordered-list semantics.
- Empty items render an empty ordered list without invented copy.

## Step Indicator and Step

**Step Indicator fields**

- `steps`: Ordered array of Step records.
- `currentStep`: Optional one-based current position.
- `heading`: Optional overall progress heading.

**Step fields**

- `id`: Stable step identity.
- `label`: Rich step label.

**Validation rules**

- A valid current position produces exactly one current step.
- Steps before the current position are completed; later steps are upcoming.
- An absent or out-of-range current position produces no invented current state.

## Summary Box

**Fields**

- `heading`: Optional rich heading content.
- `children`: Rich text, links, or inline content.

**Validation rules**

- Heading and body keep their supplied order.
- Links remain consumer-owned and operable.

## Relationships

- Every wrapper maps to exactly one owning styles contract.
- Accordion owns many ordered Accordion Items and their expanded-state set.
- Banner owns one control-to-content relationship.
- Modal owns one title relationship and one temporary focus lifecycle.
- ProcessList owns many ordered Process Items.
- StepIndicator owns many ordered Steps and derives at most one current state.
- All wrappers share package export and transitive CSS delivery but do not share
  application state.
