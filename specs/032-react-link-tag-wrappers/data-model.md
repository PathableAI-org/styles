# Data Model: React Link and Tag Wrappers

## Entity: Link

Represents the public React wrapper around the existing Pathable link contract.

**Fields**

- `presentation`: `default` or `external`; defaults to `default`.
- `children`: Consumer-supplied link content.
- `className`: Optional additional root class names.
- `restAttributes`: Valid anchor attributes, including destination,
  relationship, accessibility, data, event, and standard anchor attributes.

**Validation Rules**

- Component name MUST be `Link` and the root MUST be a native anchor.
- Root classes MUST always include `pathable-link`.
- External presentation MUST add only `pathable-link--external`.
- Unsupported presentation values MUST resolve to default.
- Content, consumer classes, and valid attributes MUST be preserved.
- The wrapper MUST NOT infer `href`, `target`, `rel`, or other navigation policy.

## Entity: Tag

Represents the public React wrapper around the existing Pathable tag contract.

**Fields**

- `size`: `default` or `big`; defaults to `default`.
- `children`: Consumer-supplied inline content.
- `className`: Optional additional root class names.
- `restAttributes`: Valid span attributes, including accessibility, data, event,
  and standard span attributes.

**Validation Rules**

- Component name MUST be `Tag` and the root MUST be a span.
- Root classes MUST always include `pathable-tag`.
- Big size MUST add only `pathable-tag--big`.
- Unsupported size values MUST resolve to default.
- Content, consumer classes, and valid attributes MUST be preserved.
- The wrapper MUST NOT add selection, dismissal, navigation, or button behavior.

## Value Mappings

| Entity | Public value | Existing contract mapping |
|--------|--------------|---------------------------|
| Link | `default` | `pathable-link` |
| Link | `external` | `pathable-link pathable-link--external` |
| Tag | `default` | `pathable-tag` |
| Tag | `big` | `pathable-tag pathable-tag--big` |

## Relationships

- Each Link has exactly one resolved Link presentation.
- Each Tag has exactly one resolved Tag size.
- Each resolved value maps to exactly one implemented owning styles contract.
- Link and Tag share package export and transitive-style delivery but have no
  runtime dependency on one another.

## State Transitions

N/A. Neither wrapper owns internal state, persistence, navigation lifecycle,
selection, dismissal, or asynchronous behavior.
