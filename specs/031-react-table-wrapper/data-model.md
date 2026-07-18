# Data Model: React Table Wrapper

## Entity: Table

Represents the public React wrapper around the existing Pathable table contract.

**Fields**

- `presentation`: One of `default`, `borderless`, `compact`, or `striped`;
  defaults to `default`.
- `children`: Consumer-composed native table content.
- `className`: Optional additional root class names.
- `restAttributes`: Valid root table attributes, including accessibility, data,
  event, and standard table attributes.

**Validation Rules**

- Component name MUST be `Table`.
- Root classes MUST always include `pathable-table`.
- Presentation MUST map only to the documented basic source modifiers.
- Unsupported presentation values MUST resolve to `default`.
- Consumer class names and valid root attributes MUST be preserved.
- Children MUST remain in consumer-supplied order and semantics.

## Entity: Table Content

Represents consumer-composed captions, column groups, headers, bodies, footers,
rows, header cells, data cells, and interactive descendants.

**Validation Rules**

- The wrapper MUST NOT reorder, synthesize, pad, or discard supplied content.
- Native accessibility relationships and attributes MUST remain intact.
- Empty or malformed content MUST not trigger wrapper-generated placeholder
  data or structural correction.

## Entity: Table Presentation

| Value | Existing contract mapping |
|-------|---------------------------|
| `default` | `pathable-table` only |
| `borderless` | `pathable-table pathable-table--borderless` |
| `compact` | `pathable-table pathable-table--compact` |
| `striped` | `pathable-table pathable-table--striped` |

**Relationships**

- A Table has exactly one resolved Table Presentation.
- A Table contains zero or more consumer-composed Table Content nodes.
- Every Table Presentation maps to the owning `packages/styles` contract.

## State Transitions

N/A. The wrapper has no internal state, persistence, sorting, pagination,
selection, or loading lifecycle.
