---
name: Stack
slug: stack
kind: static
summary: A vertical flex column that puts one token-based gap between adjacent children.
styles-class: pathable-stack
variants:
  - axis: gap
    default: default
    values: [default, gap-sm, gap-md, gap-lg, gap-xl]
guarantees:
  - id: vertical-column
    status: unverified
    claim: Children of a stack sit in one column in source order, and each child that sets neither its own width nor its own alignment stretches across the stack's width, less its own left and right margins.
  - id: gap-sizes
    status: unverified
    claim: The space between adjacent children is 16 px by default and with gap-md, and 8, 24 or 32 px with gap-sm, gap-lg or gap-xl.
  - id: gap-between-only
    status: unverified
    claim: The stack adds no space before its first child, after its last child or around itself, so a stack holding one child with no vertical margins is exactly that child's height.
  - id: margins-add
    status: unverified
    claim: A child's own vertical margins are added to the gap, not collapsed into it.
  - id: custom-gap
    status: unverified
    claim: Setting --pathable-stack-gap on the stack sets the space between its children to that value.
  - id: inherited-gap
    status: unverified
    claim: A stack with no gap modifier inside a stack that has one uses the outer stack's gap, because the custom property inherits.
---

# Stack

A vertical flex column that puts one token-based gap between adjacent
children. Put the class on any block element, such as a `<div>`, `<section>`
or `<ul>`. It adds no role, no padding and no border; it only arranges its
direct children.

## When to use

- Vertical rhythm between sibling blocks: headings and paragraphs, cards in a
  column, sections of a page or panel.
- Replacing ad hoc top and bottom margins with one spacing value.

Use something else when:

- the children belong in one row that never wraps: use `pathable-inline`;
- the children are small items, such as tags or buttons, that should wrap
  onto new lines: use `pathable-cluster`;
- the children are form fields: add `pathable-form-stack` to the stack, which
  widens the controls and removes the field groups' own top margin;
- two regions sit side by side on wide screens: use `pathable-split` or
  `pathable-sidebar-layout`;
- the content needs a centred, width-limited column: wrap it in
  `pathable-container`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section class="pathable-stack pathable-stack--gap-sm">
  <h2 class="pathable-margin-0">Training records</h2>
  <p class="pathable-margin-0">Three courses are due this month.</p>
  <p class="pathable-margin-0">Completed courses move to your history.</p>
</section>
```

## Variants

Add at most one gap modifier to `pathable-stack`.

| Axis | Value     | Class                    | What it is for                            |
| ---- | --------- | ------------------------ | ----------------------------------------- |
| gap  | `default` | none                     | 16 px between children                    |
| gap  | `gap-sm`  | `pathable-stack--gap-sm` | 8 px, for tightly related lines           |
| gap  | `gap-md`  | `pathable-stack--gap-md` | 16 px, the same as the default but stated |
| gap  | `gap-lg`  | `pathable-stack--gap-lg` | 24 px, for separate blocks such as cards  |
| gap  | `gap-xl`  | `pathable-stack--gap-xl` | 32 px, for page sections                  |

For any other gap, set `--pathable-stack-gap` on the stack. The property
inherits: a stack nested inside one with a modifier takes the outer gap unless
it has a modifier of its own. Give nested stacks an explicit modifier, such as
`pathable-stack--gap-md`, when they must keep 16 px.

## Tokens

| What                 | Token                  |
| -------------------- | ---------------------- |
| Gap, overridable     | `--pathable-stack-gap` |
| Default and `gap-md` | `--space-16`           |
| `gap-sm`             | `--space-8`            |
| `gap-lg`             | `--space-24`           |
| `gap-xl`             | `--space-32`           |

The pixel figures are those of the default theme's spacing scale.

## Composition

- Any elements can be children. The gap sits between direct children only;
  wrapping children in another element makes that element the one child.
- A stack is a flex column, so children stretch across its width. A button,
  tag or image placed straight into a stack becomes full width; a
  `pathable-button` stops 8 px short of the right edge because of its own
  right margin, which `pathable-form-stack` removes. To keep
  children at their own width, add `pathable-flex-align-start` to the stack,
  or put the items in a `pathable-cluster` inside it.
- Children's margins do not collapse into the gap: a paragraph's default
  margins are added to it. Nor do they collapse through the stack, so the
  first child's top margin and the last child's bottom margin stay inside
  the stack, as space above and below its content. Remove them, for example
  with `pathable-margin-0`, when the gap alone should space the children.
- The stack has no element classes and no padding. Put it inside a surface,
  card or `pathable-container` for padding and a width limit.
- Stacks nest freely, and so do `pathable-inline` and `pathable-cluster`
  inside a stack.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

## The consumer owns

- Semantics. Use the element that fits the content, such as `<ul>` with
  `<li>` children for a list; the class adds no role.
- Reading order. The stack shows children in source order and does not
  reorder them.
- Children's own margins, widths and alignment.
- Padding, background and width around the stack.
