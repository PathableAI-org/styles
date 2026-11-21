---
name: Search
slug: search
kind: static
summary: A site or section search form that joins a text field and a submit button in one row, in a default, big or small size.
styles-class: pathable-search
variants:
  - axis: size
    default: default
    values: [big, default, small]
guarantees:
  - id: row-layout
    status: unverified
    claim: A pathable-search element that has role="search" lays its children out in one flex row, so the field and the button sit side by side; without that role the form is not a flex container.
  - id: control-height
    status: unverified
    claim: By default the field and the submit button are 2rem (32 px at a 16 px root) tall, the field text is 0.93rem, and the submit button has no margin.
  - id: joined-edges
    status: unverified
    claim: The search field has no right border and square right corners, and the submit button has square left corners, so the two read as one control.
  - id: submit-width
    status: unverified
    claim: Below a viewport width of 480 px the submit button is 3rem (48 px) wide with no padding; from 480 px it is as wide as its content plus 1rem (16 px) of padding on each side.
  - id: touch-target
    status: unverified
    claim: At a viewport width of 639.84 px or narrower, or on a coarse pointer, the field and the submit button inside the search are at least 2.75rem (44 px) tall and the button is at least 2.75rem wide.
  - id: big-size
    status: unverified
    claim: With the big modifier, from a viewport width of 480 px the field and the submit button are 3rem (48 px) tall, the field text is 0.99rem, the button text is 1.49rem and the button has 2rem (32 px) of padding on each side; below 480 px the big search matches the default.
  - id: small-size
    status: unverified
    claim: With the small modifier the submit button has 0.75rem (12 px) of padding on each side and is at least 3rem (48 px) wide, whatever its content.
  - id: scoped-input-rules
    status: unmet
    claim: An input of type search outside a pathable-search keeps the pathable-input look, which is 2.5rem tall with 0.5rem of padding and a 1 px border on all four sides; today the search rules reach it too and make it 2rem tall with no right border.
---

# Search

A site or section search form that joins a text field and a submit button in
one row, in a default, big or small size. Put the class on a `<form>` that has
`role="search"`. The form works without JavaScript: the browser submits it.

## When to use

- A search box for a whole application or one section of it, such as finding a
  participant, a case note or an appointment.
- A prominent search at the top of a page, in the big size.
- A compact search in a toolbar or a header, in the small size.

Use something else when:

- the field is one of several inputs that narrow a list: use `pathable-form-group`
  with your own fields and a submit button;
- the field has no submit button and filters a list as the user types: use a
  plain `pathable-input` with a label.

A search that opens from a header button, and the script that shows and hides
it, is not part of this component. This page covers the static form only.

## Example

<!-- package: styles -->

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- /package -->

<!-- example: default -->

## States

Each state is complete markup for one size of the search. Copy the one closest
to what you need.

<!-- examples -->

## Variants

Add at most one size modifier to `pathable-search`.

| Axis | Value     | Class                    | What it is for                                                     |
| ---- | --------- | ------------------------ | ------------------------------------------------------------------ |
| size | `big`     | `pathable-search--big`   | A prominent search; 48 px tall controls from 480 px wide           |
| size | `default` | none                     | A search in a page or panel; 32 px tall controls                   |
| size | `small`   | `pathable-search--small` | A compact search for a toolbar or header; a narrower submit button |

## Tokens

None. The sizes, type and spacing are fixed values in the compiled stylesheet,
not custom properties, so a theme does not change them.

## Composition

- The form is the block: `<form class="pathable-search" role="search">`.
  The role is needed twice: it makes the form a search landmark, and the
  row layout is applied to a `pathable-search` that has it.
- Inside the form, in this order: a `<label>` with `pathable-sr-only`, a
  `<input type="search">` with `pathable-input`, and a
  `<button type="submit">` with `pathable-button`. The component has no
  element classes.
- The submit button holds an inline SVG with `pathable-icon` and
  `aria-hidden="true"`, followed by its name in a `pathable-sr-only` span. The
  icon is 1em, so it grows with the button text in the big size. Keep visible
  button text out of this button: below 480 px the button is a fixed 3rem
  wide, and a word such as "Search" does not fit.
- The search field is a `pathable-input`, so it is at most 30rem wide and
  takes the remaining width of the row.
- Known caveat: the search styles include rules on every
  `input[type="search"]`, with no `pathable-search` ahead of them. They
  apply to any input of type search on the page, such as a
  `pathable-input` outside a search form: it becomes 2rem tall, loses its right
  border and its right corners, and its padding changes. Do not use
  `type="search"` outside a `pathable-search` until `scoped-input-rules` is met;
  use `type="text"` with `inputmode="search"` there.
- At a viewport 639.84 px wide or narrower, or on a coarse pointer, the field
  and the button grow to 44 px tall so that they are easy to tap.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The pixel figures assume a 16 px root font size, and the breakpoints follow
the viewport.

## The consumer owns

- The landmark name: an `aria-label` on the form that says what is searched,
  such as "Search participants", and that differs from any other search
  landmark on the page.
- The field's name: a `<label>` whose `for` matches the field's `id`, hidden
  with `pathable-sr-only` because the button shows the purpose.
- The button's name, in a `pathable-sr-only` span, and `type="submit"`.
- The form's `action`, `method` and the field's `name`, and what the
  server does with the query.
- Not using `pathable-search` for filters or for a form with other fields.
- Search results, suggestions and the empty-results message.
