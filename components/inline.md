---
name: Inline
slug: inline
kind: static
summary: A horizontal flex row that keeps its children on one line with a token-based gap between them.
styles-class: pathable-inline
variants:
  - axis: gap
    default: default
    values: [default, gap-sm, gap-md, gap-lg, gap-xl]
guarantees:
  - id: one-row
    status: unverified
    claim: Children of an inline sit in one row in source order and never wrap onto a second line, at any container width.
  - id: gap-sizes
    status: unverified
    claim: The space between adjacent children is 16 px by default and with gap-md, and 8, 24 or 32 px with gap-sm, gap-lg or gap-xl.
  - id: gap-between-only
    status: unverified
    claim: The inline adds no space before its first child, after its last child or around itself.
  - id: stretch-height
    status: unverified
    claim: Children that set neither their own height nor their own alignment stretch to the height of the tallest child, and pathable-flex-align-center on the inline centres them vertically instead.
  - id: custom-gap
    status: unverified
    claim: Setting --pathable-inline-gap on the inline sets the space between its children to that value.
  - id: inherited-gap
    status: unverified
    claim: An inline with no gap modifier inside an inline that has one uses the outer inline's gap, because the custom property inherits.
---

# Inline

A horizontal flex row that keeps its children on one line with a token-based
gap between them. Put the class on any block element, such as a `<div>`. It
adds no role, no padding and no border; it only arranges its direct children.

## When to use

- A short, fixed set of items that must stay on one line: an icon tile beside
  its label, a label beside its value, two buttons that always fit.
- Replacing ad hoc left and right margins between siblings with one spacing
  value.

Use something else when:

- the items may not fit the width, such as a list of tags or a row of actions
  on a phone: use `pathable-cluster`, which wraps;
- the children should be one above the other: use `pathable-stack`;
- two content regions sit side by side on wide screens and stack on narrow
  ones: use `pathable-split` or `pathable-sidebar-layout`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<div class="pathable-inline pathable-inline--gap-sm pathable-flex-align-center">
  <span
    class="pathable-icon-tile pathable-icon-tile--compact"
    aria-hidden="true"
  >
    <svg class="pathable-icon" viewBox="0 0 24 24" focusable="false">
      <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
  </span>
  <span>Training record verified</span>
</div>
```

## Variants

Add at most one gap modifier to `pathable-inline`.

| Axis | Value     | Class                     | What it is for                            |
| ---- | --------- | ------------------------- | ----------------------------------------- |
| gap  | `default` | none                      | 16 px between children                    |
| gap  | `gap-sm`  | `pathable-inline--gap-sm` | 8 px, for an icon beside its label        |
| gap  | `gap-md`  | `pathable-inline--gap-md` | 16 px, the same as the default but stated |
| gap  | `gap-lg`  | `pathable-inline--gap-lg` | 24 px, for separate groups                |
| gap  | `gap-xl`  | `pathable-inline--gap-xl` | 32 px, for widely separated groups        |

For any other gap, set `--pathable-inline-gap` on the inline. The property
inherits: an inline nested inside one with a modifier takes the outer gap
unless it has a modifier of its own.

## Tokens

| What                 | Token                   |
| -------------------- | ----------------------- |
| Gap, overridable     | `--pathable-inline-gap` |
| Default and `gap-md` | `--space-16`            |
| `gap-sm`             | `--space-8`             |
| `gap-lg`             | `--space-24`            |
| `gap-xl`             | `--space-32`            |

The pixel figures are those of the default theme's spacing scale.

## Composition

- Any elements can be children. The gap sits between direct children only.
- The row does not centre its children: they stretch to the tallest child's
  height and start at the top. Add `pathable-flex-align-center` to centre
  them, or `pathable-flex-align-baseline` to line up text.
- Children start at the left edge. Add `pathable-flex-justify-between` or
  another justify utility to distribute them along the row.
- Children may shrink to their narrowest content, then overflow the row: the
  row never wraps and does not clip. Text inside a child wraps within it.
  Keep the content short enough for the narrowest screen, or use
  `pathable-cluster`.
- Children keep their own margins, which add to the gap. `pathable-button`
  has an 8 px right margin, so buttons in an inline sit 24 px apart with the
  default gap. Below a 480 px viewport each button is set to full width, so
  the buttons share the row equally.
- The inline has no element classes and no padding. It nests inside
  `pathable-stack`, cards and surfaces.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Semantics. Use the element that fits the content; the class adds no role.
- Reading order. The row shows children in source order, left to right, and
  does not reorder them.
- Fit. Checking that the row's content fits at 320 px wide and at 200 per cent
  text zoom, and switching to `pathable-cluster` or `pathable-stack` when it
  does not.
- Vertical alignment, children's widths and the space around the row.
