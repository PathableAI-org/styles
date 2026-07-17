# Data Model: React List Wrapper

## Entity: List

Represents the React wrapper component that renders a Pathable list.

**Fields**

- `presentation`: One of `unordered`, `ordered`, or `unstyled`; defaults to
  `unordered`.
- `items`: Optional ordered collection of List Item values.
- `children`: Optional consumer-provided node content for composition.
- `className`: Optional additional root class names.
- `restAttributes`: Optional valid list attributes, including `aria-*`,
  `data-*`, and other safe root attributes.

**Validation Rules**

- Component name MUST be `List`.
- Root class list MUST include `pathable-list`.
- Presentation MUST map only to documented `packages/styles` list
  presentations.
- Consumer `className` MUST be preserved without replacing `pathable-list`.
- Item order MUST match the order supplied by the developer.
- The component MUST NOT introduce wrapper-only visual semantics.

## Entity: List Item

Represents one supplied item rendered within a List.

**Fields**

- `content`: Required renderable content unless the item is intentionally empty.
- `key`: Optional stable identity for repeated items.
- `className`: Optional list-item class names for consumer composition.
- `attributes`: Optional valid item attributes, including `aria-*` and `data-*`.

**Validation Rules**

- Rich content MUST be preserved without flattening text or dropping accessible
  labels.
- Item content MUST render inside valid list item semantics when item-driven
  rendering is used.
- Empty lists MUST not create misleading placeholder items.

## Entity: List Presentation

Represents the documented visual treatment selected for a List.

**Values**

- `unordered`: Renders unordered list semantics and maps to the existing
  unordered Pathable list presentation.
- `ordered`: Renders ordered list semantics and preserves user-visible item
  sequence.
- `unstyled`: Renders list semantics while applying the existing unstyled
  Pathable presentation.

**Relationships**

- A List has exactly one List Presentation.
- A List has zero or more List Items.
- A List Presentation maps to an existing `packages/styles` class, modifier, or
  documented pattern.

## State Transitions

N/A. The feature defines a presentational component wrapper with no persistence,
remote state, or internal lifecycle state beyond rendering supplied props.
