# Data Model: Filterable Option List

## FilterableOption

One catalog record rendered as a checkbox row.

| Field         | Type             | Required | Rules |
| ------------- | ---------------- | -------- | ----- |
| `id`          | string           | Yes      | Non-empty and unique within `options`; used as selection and form value. |
| `label`       | string           | Yes      | Non-empty concise visible and accessible name; default client-filter source. |
| `description` | display content  | No       | Non-interactive explanatory content referenced as an accessible description. |
| `meta`        | display content  | No       | Non-interactive code/category content referenced as an accessible description. |
| `disabled`    | boolean          | No       | Prevents selection changes and native focus. |

## Selection

An ordered unique collection of option IDs.

### Invariants

- Every ID appears at most once.
- IDs may be absent from the current option result set.
- Removing an option from `options` does not remove its selected ID.
- Selecting appends the ID; deselecting removes only that ID.
- Controlled values remain authoritative.
- Uncontrolled values reset to normalized `defaultValues` on form reset.

### Transitions

| Event | Precondition | Result |
| ----- | ------------ | ------ |
| Select | Group and option enabled; ID not selected | Append ID and notify with complete next selection. |
| Deselect | Group and option enabled; ID selected | Remove ID and notify with complete next selection. |
| Options replaced | Any selection | Keep selection unchanged, including absent IDs. |
| Form reset | Uncontrolled selection | Restore normalized default IDs. |
| Controlled props change | Controlled selection | Render supplied values after stable deduplication. |

## Query

The text in the optional filter control.

### Invariants

- Controlled query is authoritative.
- Uncontrolled query begins at `defaultQuery` and resets to it with the form.
- Surrounding whitespace and case are ignored by the default matcher but remain
  visible in the input and callback value.
- Query changes never clear selection or move focus away from the input.

## VisibleResultSet

The option records currently rendered.

- In client mode, it contains options accepted by the default label matcher or
  consumer predicate.
- In external mode, it is exactly the supplied `options` array.
- Disabled options remain visible when they match.
- Empty-catalog and no-match states contain no fake options.

## Status

A single visible, polite, atomic message derived from selection and results.

| State | Required information |
| ----- | -------------------- |
| Results | Total selected count and visible result count. |
| No matches | No-match statement and total selected count. |
| Empty catalog | No-options statement and total selected count. |

The selected count includes every unique selected ID, including absent and
filtered-out values.

## FormValue

When `name` is present, each unique selected ID maps to one successful hidden
form control with the shared name and the ID as value. The disabled fieldset
suppresses descendant submission through native behavior.
