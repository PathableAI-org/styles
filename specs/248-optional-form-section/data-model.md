# Data Model: Optional Form Section

## OptionalFormSection

A titled disclosure shell around arbitrary optional form content.

| Field | Type | Required | Rules |
| ----- | ---- | -------- | ----- |
| `heading` | string | Yes | Must contain at least one non-whitespace character; supplies visible button text and the content region's accessible name. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | Yes | Selects the semantic heading element; no default is inferred. |
| `children` | display/form content | Yes | Rendered exactly once and always retained in the content container. |
| `expanded` | boolean | No | When defined, is the authoritative controlled state. |
| `defaultExpanded` | boolean | No | Initial uncontrolled state; defaults to `false` and is ignored in controlled mode. |
| `onExpandedChange` | `(expanded: boolean) => void` | No | Receives the requested next state after activation in either state mode. |
| root attributes | `div` attributes | No | `id`, `className`, `aria-*`, `data-*`, and other applicable attributes are forwarded to the neutral root. |

### Invariants

- The heading is a non-empty string and the heading level is 2-6.
- Exactly one native disclosure button appears inside exactly one selected
  heading element.
- The button has `type="button"`, an `aria-expanded` value matching effective
  state, and `aria-controls` referencing the content ID.
- The content region references the button with `aria-labelledby`.
- Button and content IDs are unique between instances and stable across SSR and
  hydration.
- Children remain mounted in expanded and collapsed states.
- Collapse changes presentation only; it does not disable or rewrite children.
- No disabled or animated transition state exists in v1.

## ExpandedState

The current visible/collapsed condition of one section.

| Mode | Authority | Initial value | Activation result |
| ---- | --------- | ------------- | ----------------- |
| Uncontrolled | Component memory | `defaultExpanded ?? false` | Component stores the inverse state, then reports it. |
| Controlled | `expanded` prop | Current `expanded` value | Component reports the inverse state but renders the supplied value until props change. |

### Transitions

| Event | Precondition | Result |
| ----- | ------------ | ------ |
| Pointer, Enter, or Space activation | Disclosure button is focused/activated | Request `!effectiveExpanded`; native button retains focus and does not submit the form. |
| Controlled prop update | `expanded` is defined | Render the supplied state and synchronize `aria-expanded`/`hidden`. |
| Parent rerender | Either mode | Preserve uncontrolled state and descendant identity. |
| Unmount/remount | Uncontrolled mode | Initialize again from `defaultExpanded`; descendant lifecycle also restarts normally. |

## HeadingControl

The native button nested in the selected heading element.

- Its accessible name is the `heading` string.
- It owns disclosure activation and no form value.
- It remains in sequential navigation regardless of expanded state.
- It never has `disabled` in the v1 contract.
- Its generated ID labels the content region.

## DisclosedContent

The persistent content region containing `children`.

| Effective state | DOM presence | `hidden` | Presentation/navigation | Form participation |
| --------------- | ------------ | -------- | ----------------------- | ------------------ |
| Expanded | Present | Absent | Visible; descendants participate normally. | Native successful-control rules apply. |
| Collapsed | Present | Present | Hidden; descendants leave presentation and sequential navigation. | Native successful-control rules still apply because controls are not disabled or removed. |

### Child Ownership

- Child controls own values, names, fieldset grouping, validity, and events.
- The section does not clone children or infer field associations.
- The application owns validation timing, error summaries, expansion for hidden
  invalid fields, and resulting focus movement.
- A collapsed browser-invalid control can be difficult for native constraint
  validation to focus; applications using such controls must coordinate
  expansion or use their application validation flow.

## InstanceRelationship

One opaque generated identity pair per mounted section.

| Identifier | Referenced by | Purpose |
| ---------- | ------------- | ------- |
| Button ID | Content `aria-labelledby` | Names the disclosed region. |
| Content ID | Button `aria-controls` | Identifies the controlled content. |

Visible heading text is not used as an identifier, so instances with duplicate
headings remain collision-free.
