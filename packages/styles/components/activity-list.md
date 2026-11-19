---
name: ActivityList
slug: activity-list
kind: static
summary: A vertical list of activity rows, each showing a status mark and label, a title and context line, a date, an owner and optional trailing actions.
styles-class: pathable-activity-list
variants:
  - axis: density
    default: default
    values: [compact, default, comfortable]
  - axis: empty
    default: default
    values: [default, empty]
guarantees:
  - id: row-gap
    status: unverified
    claim: Rows stack in one column 16 px apart by default, and setting --pathable-activity-list-gap on the list changes that gap.
  - id: density
    status: unverified
    claim: Row padding and the gap between a row's parts are 16, 24 or 32 px and the title is 12, 14 or 16 px at compact, default and comfortable, except that at a viewport 640 px wide or narrower the default row's gap is 16 px.
  - id: single-line-truncation
    status: unverified
    claim: The title, context, status text, date and owner text each stay on one line and end in an ellipsis instead of wrapping or overflowing the row.
  - id: status-shapes
    status: unverified
    claim: The completed, in-progress, pending and cancelled status marks are a filled circle, a filled square, a hollow ring and a 10 by 4 px bar, and any other status value is a 10 px neutral circle.
  - id: hidden-actions
    status: unverified
    claim: The trailing actions are fully transparent until the row is hovered or holds focus, and are always visible on a coarse pointer or at a viewport 640 px wide or narrower.
  - id: narrow-wrap
    status: unverified
    claim: At a viewport 640 px wide or narrower a row wraps, and the date moves to its own full-width line above the rest of the row.
  - id: group-heading-spacing
    status: unverified
    claim: A group heading has a 32 px top margin and a 16 px bottom margin, except a heading that is the first child of its list, which has no top margin; inside a list these add to the list's gap, giving 48 px above and 32 px below by default.
  - id: empty-message
    status: unverified
    claim: With the empty modifier, the empty message is centred with 64 px of padding above and below and 32 px at the sides.
---

# ActivityList

A vertical list of activity rows, each showing a status mark and label, a title
and context line, a date, an owner and optional trailing actions. Put the class
on a container of `pathable-activity-row` elements. The list adds no roles: give
it list semantics yourself.

## When to use

- A scan-friendly feed of recent tasks, sessions or case events, optionally
  grouped under date or status headings.
- A dashboard panel listing work items with a status, a due date and who owns
  each one.

Use something else when:

- the items need columns the reader compares or sorts: use `pathable-table`;
- the items are ordered steps of a process: use `pathable-process-list`;
- the items are cards with images or long descriptions: use
  `pathable-collection`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-activity-list" role="list" aria-label="Recent activity">
  <div class="pathable-activity-row" role="listitem">
    <span
      class="pathable-activity-row__status"
      data-status="completed"
      aria-hidden="true"
    ></span>
    <span class="pathable-activity-row__status-text">Completed</span>
    <div class="pathable-activity-row__body">
      <p class="pathable-activity-row__title">Intake assessment</p>
      <p class="pathable-activity-row__context">Participant: Maria Gonzalez</p>
    </div>
    <span class="pathable-activity-row__date">2:30 PM</span>
    <span class="pathable-activity-row__owner">
      <span class="pathable-activity-row__owner-text">You</span>
    </span>
    <div class="pathable-activity-row__actions">
      <button class="pathable-button pathable-button--outline">View</button>
    </div>
  </div>
</div>
```

## Variants

Add at most one modifier class from each axis to `pathable-activity-list`. A
density modifier also applies to rows in lists nested inside it.

| Axis    | Value         | Class                                 | What it is for                                                           |
| ------- | ------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| density | `compact`     | `pathable-activity-list--compact`     | 16 px row padding and gap, 12 px title                                   |
| density | `default`     | none                                  | 24 px row padding and gap (16 px gap at 640 px or narrower), 14 px title |
| density | `comfortable` | `pathable-activity-list--comfortable` | 32 px row padding and gap, 16 px title                                   |
| empty   | `default`     | none                                  | The list holds rows                                                      |
| empty   | `empty`       | `pathable-activity-list--empty`       | The list holds only an empty message, centred                            |

The empty modifier is a state the application sets when there is nothing to
show; it only styles a `pathable-activity-list__empty` element inside it.

## Tokens

| What                          | Token                                                            |
| ----------------------------- | ---------------------------------------------------------------- |
| Gap between rows              | `--pathable-activity-list-gap`, else `--pathable-space-2`        |
| Group heading size and weight | `--pathable-font-size-heading-sm`, `--pathable-font-weight-bold` |
| Group heading colour          | `--pathable-color-text`                                          |
| Compact padding and gap       | `--pathable-space-2`                                             |
| Comfortable padding and gap   | `--pathable-space-4`                                             |
| Empty message colour          | `--pathable-color-text-muted`                                    |

The pixel figures on this page are those of the default theme. Rows have a
white surface, a 1 px border in the theme border colour and 4 px rounded
corners; on hover the row background changes to the page background colour.

## Composition

- `pathable-activity-list__group-heading`: a heading (such as an `<h3>`) that
  names a group. To group rows, put headings and nested
  `pathable-activity-list` containers inside an outer list, and label each
  nested list with its heading through `aria-labelledby`. The heading's
  margins add to the outer list's gap, so by default a heading has 48 px
  above it and 32 px below it.
- `pathable-activity-row`: one item, a flex row with its parts centred
  vertically. Its parts, in order:
  - `pathable-activity-row__status`: an empty `<span>` with a `data-status`
    of `completed`, `in-progress`, `pending` or `cancelled`. It is a mark
    only; hide it with `aria-hidden="true"`.
  - `pathable-activity-row__status-text`: the status in words. Always include
    it.
  - `pathable-activity-row__body`: takes the remaining width and holds
    `pathable-activity-row__title` and `pathable-activity-row__context`.
  - `pathable-activity-row__date`: the date or time, in muted caption text.
  - `pathable-activity-row__owner`: holds the owner or participant name in
    `pathable-activity-row__owner-text`, which truncates; an avatar or icon
    can sit beside it with an 8 px gap.
  - `pathable-activity-row__actions`: optional trailing controls, kept at
    their own width with an 8 px gap. Each `pathable-button` keeps its own
    0.5rem right margin, so buttons appear 16 px apart and the last one stops
    0.5rem short of the row's padding edge.
- `pathable-activity-list__empty`: the empty message, inside a list with
  `pathable-activity-list--empty`.
- The list fills its container's width; it has no padding of its own.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

Truncation hides the end of long text on screen; the full text stays in the
document.

## The consumer owns

- List semantics: `role="list"` on the list and `role="listitem"` on each row,
  or real `<ul>` and `<li>` elements, and a label for each list.
- The status in words. The status mark is decorative and colour is never the
  only cue; an unrecognised `data-status` value shows a neutral mark.
- The actions: the buttons or links inside `pathable-activity-row__actions`
  keep their own component styling, such as `pathable-button`; the list only
  lays them out and controls their visibility. Hidden actions still receive
  focus and clicks, and appear when focused. Do not put the only route to an
  essential action there.
- Making full text available where truncation could hide meaning, such as in
  a details view.
- The date format, owner names and any data minimisation for sensitive
  records.
