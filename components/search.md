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
    claim: A pathable-search form that has role="search" lays its children out in one flex row, so the field and the button sit side by side.
  - id: control-height
    claim: By default the field and the submit button are 2rem (32 px at a 16 px root) tall, the field text is 0.93rem, and the submit button has no margin.
  - id: joined-edges
    claim: The search field has no right border and square right corners, and the submit button has square left corners, so the two read as one control.
  - id: submit-width
    claim: Below a viewport width of 480 px the submit button shows only its icon, 3rem (48 px) wide with no padding, and its text stays available to assistive technology; from 480 px the submit text is visible, the icon is hidden and the button is as wide as its content plus 1rem (16 px) of padding on each side.
  - id: touch-target
    claim: At a viewport width of 639.84 px or narrower, or on a coarse pointer, the field and the submit button inside the search are at least 2.75rem (44 px) tall and the button is at least 2.75rem wide.
  - id: big-size
    claim: With the big modifier, from a viewport width of 480 px the field and the submit button are 3rem (48 px) tall, the field text is 1rem (the sm size), the button text is 1.5rem (the lg size) and the button has 2rem (32 px) of padding on each side; below 480 px the big search matches the default.
  - id: small-size
    claim: With the small modifier the submit button shows only its icon at every width, with 0.75rem (12 px) of padding on each side and a width of at least 3rem (48 px).
  - id: scoped-input-rules
    claim: An input of type search outside a pathable-search form keeps the pathable-input look, which is 2.5rem tall with 0.5rem of padding and a 1 px border on all four sides.
---

# Search

A site or section search form that joins a text field and a submit button in
one row, in a default, big or small size. Put the class on a `<form>` that has
`role="search"`, inside a `<section>` that names it. The form works without JavaScript: the browser submits it.

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

<!-- css-files -->

<!-- example: default -->

## States

Each state is complete markup for one size of the search, and one with a
longer, translated submit label. Copy the one closest to what you need.

<!-- examples -->

## Variants

Add at most one size modifier to `pathable-search`.

| Axis | Value     | Class                    | What it is for                                                                |
| ---- | --------- | ------------------------ | ----------------------------------------------------------------------------- |
| size | `big`     | `pathable-search--big`   | A prominent search; 48 px tall controls from 480 px wide, visible submit text |
| size | `default` | none                     | A search in a page or panel; 32 px tall controls, visible submit text         |
| size | `small`   | `pathable-search--small` | A compact search for a toolbar or header; an icon-only submit button          |

## Composition

- `<section aria-label>`: the wrapper that names the search region, such as
  "Participant search".
- `pathable-search`: the block, a `<form class="pathable-search" role="search">`
  inside the section. The role makes the form a search landmark.
- Inside the form, in this order: a `<label>` with `pathable-sr-only` whose
  `for` matches the field's `id`, an `<input type="search">` with
  `pathable-input` and a `name`, and a `<button type="submit">` with
  `pathable-button`.
- `pathable-search__submit-text`: the `<span>` in the button that holds the
  visible word "Search" in the default and big sizes. Below 480 px it is
  visually hidden and the icon shows instead. The small size has no submit
  text element; its button holds a visually hidden `pathable-sr-only` span with
  the name.
- `pathable-search__submit-icon`: the `<svg class="pathable-icon">` in the
  button, with `aria-hidden="true"`, that references the sprite with
  `<use href="/assets/img/sprite.svg#search">`.
- The submit text is the visible label and may be longer or translated, as in
  the `long-label` example; the button is as wide as its text from 480 px.
- The search field is a `pathable-input`, so it is at most 30rem wide and
  takes the remaining width of the row.
- Use `type="search"` only inside a `pathable-search`; elsewhere use
  `type="text"` with `inputmode="search"`.
- At a viewport 639.84 px wide or narrower, or on a coarse pointer, the field
  and the button grow to 44 px tall so that they are easy to tap.

## Guarantees

The guarantees are the list in the front matter at the top of this page. The
pixel figures assume a 16 px root font size, and the breakpoints follow the
viewport.

## The consumer owns

- The landmark name: an `aria-label` on the wrapping `<section>` that says
  what is searched, such as "Participant search", and that differs from any
  other search landmark on the page.
- The field's name: a `<label>` whose `for` matches the field's `id`, hidden
  with `pathable-sr-only`.
- The button's text, in the page's language, and `type="submit"`. In the small
  size, the name goes in a `pathable-sr-only` span.
- The form's `action`, `method` and the field's `name`, and what the
  server does with the query.
- Not using `pathable-search` for filters or for a form with other fields.
- Search results, suggestions and the empty-results message.
