# Props Contract: React Link and Tag Wrappers

## `Link` Component

| Prop | Type | Required | Default | Description | Contract Mapping |
|------|------|----------|---------|-------------|------------------|
| `presentation` | `'default' \| 'external'` | No | `'default'` | Selects an implemented Link treatment. | Adds the existing external modifier only when selected. |
| `children` | `ReactNode` | No | `undefined` | Consumer-supplied link content. | Preserved unchanged inside the anchor. |
| `className` | `string` | No | `''` | Additional root classes. | Appended without replacing `pathable-link`. |
| `...rest` | valid anchor attributes | No | `{}` | Destination, relationship, event, `aria-*`, `data-*`, and standard anchor attributes. | Forwarded to the root anchor. |

### Link Class Mapping

| Resolved presentation | Required class output |
|-----------------------|-----------------------|
| `default` | `pathable-link` |
| `external` | `pathable-link pathable-link--external` |
| unsupported value | `pathable-link` |

### Link Behavioral Rules

- The wrapper renders a native anchor.
- The wrapper does not infer or override `href`, `target`, `rel`, or download behavior.
- Consumer children, classes, and valid root attributes are preserved.
- Unsupported values never become arbitrary class names.

## `Tag` Component

| Prop | Type | Required | Default | Description | Contract Mapping |
|------|------|----------|---------|-------------|------------------|
| `size` | `'default' \| 'big'` | No | `'default'` | Selects an implemented Tag size. | Adds the existing big modifier only when selected. |
| `children` | `ReactNode` | No | `undefined` | Consumer-supplied inline content. | Preserved unchanged inside the span. |
| `className` | `string` | No | `''` | Additional root classes. | Appended without replacing `pathable-tag`. |
| `...rest` | valid span attributes | No | `{}` | Event, `aria-*`, `data-*`, and standard span attributes. | Forwarded to the root span. |

### Tag Class Mapping

| Resolved size | Required class output |
|---------------|-----------------------|
| `default` | `pathable-tag` |
| `big` | `pathable-tag pathable-tag--big` |
| unsupported value | `pathable-tag` |

### Tag Behavioral Rules

- The wrapper renders a span and does not invent interactive semantics.
- Consumer children, classes, and valid root attributes are preserved.
- Unsupported values never become arbitrary class names.
- Consumers need no separate `@pathable/styles` import for either component.
