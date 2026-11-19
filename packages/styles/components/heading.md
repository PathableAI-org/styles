---
name: Heading
slug: heading
kind: static
summary: A heading style that sets the type size, typeface and weight of one of six levels, independent of the heading element it sits on.
styles-class: pathable-heading
variants:
  - axis: level
    default: none
    values: [none, level-1, level-2, level-3, level-4, level-5, level-6]
guarantees:
  - id: level-size
    status: unverified
    claim: Levels 1 to 6 set the font size to 2, 1.5, 1.25, 1.125, 1 and 0.875rem, which is 32, 24, 20, 18, 16 and 14 px at a 16 px root font size.
  - id: level-typeface
    status: unverified
    claim: Level 1 uses the heading typeface at weight 400, levels 2 to 4 the subheading typeface at weight 700, and levels 5 and 6 the body typeface at weight 700.
  - id: line-height
    status: unverified
    claim: The line height is 1.25 times the font size at levels 1 to 4 and 1.5 times at levels 5 and 6.
  - id: no-margin
    status: unverified
    claim: The heading has zero margin on every side, at every level and with no level.
  - id: level-not-element
    status: unverified
    claim: The level modifier alone sets the size, so an `<h2>` with `pathable-heading--level-4` renders at the same 1.125rem (18 px) as an `<h4>` with it.
  - id: scales-with-root
    status: unmet
    claim: Every level's font size follows the root font size, so at a 200% root font size every level's size doubles.
  - id: text-colour
    status: unverified
    claim: Outside `pathable-section--dark` and `pathable-dark-background`, the heading text is the theme text colour at every level, with a contrast of 12.48:1 on the white surface colour.
  - id: dark-background-contrast
    status: unmet
    claim: Inside `pathable-dark-background`, the heading text has a contrast of at least 4.5:1 on the container background, or 3:1 for large text.
  - id: no-level
    status: unverified
    claim: Without a level modifier the class sets only the colour and the zero margin, and the typeface, size, weight and line height come from other rules.
---

# Heading

A heading style that sets the type size, typeface and weight of one of six
levels, independent of the heading element it sits on. Put the class and one
level modifier on an `<h1>` to `<h6>`. The class adds no role and no semantics:
the element you choose is the heading level assistive technology announces.

## When to use

- Page titles, section headings and card headings in application UI.
- Any heading whose visual size must differ from its document level, such as
  an `<h2>` that should look like a level 4.

Use something else when:

- the text is a large marketing headline in a hero: use `pathable-display`;
- the text is a lead paragraph under a page title: use `pathable-intro`;
- the text is body copy or a caption: use `pathable-text` with
  `pathable-text--body`, `pathable-text--small` or `pathable-text--caption`;
- the text is a hint under a form field: use `pathable-hint`;
- the text is a short phrase inside a sentence that needs emphasis: use
  `pathable-text-highlight`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<h1 class="pathable-heading pathable-heading--level-1">Training records</h1>
<h2 class="pathable-heading pathable-heading--level-3">Recently completed</h2>
```

## Variants

Add one level modifier to `pathable-heading`.

| Axis  | Value     | Class                       | What it is for                                                  |
| ----- | --------- | --------------------------- | --------------------------------------------------------------- |
| level | `none`    | none                        | Colour and zero margin only; the font is not set                |
| level | `level-1` | `pathable-heading--level-1` | 2rem (32 px) heading typeface, regular, for the page title      |
| level | `level-2` | `pathable-heading--level-2` | 1.5rem (24 px) subheading typeface, bold, for major sections    |
| level | `level-3` | `pathable-heading--level-3` | 1.25rem (20 px) subheading typeface, bold, for sections         |
| level | `level-4` | `pathable-heading--level-4` | 1.125rem (18 px) subheading typeface, bold, for subsections     |
| level | `level-5` | `pathable-heading--level-5` | 1rem (16 px) body typeface, bold, for small group headings      |
| level | `level-6` | `pathable-heading--level-6` | 0.875rem (14 px) body typeface, bold, for the smallest headings |

## Tokens

Every value comes from a theme token. The text colour at every level is
`--pathable-color-text`, except inside `pathable-section--dark`, which colours
heading elements itself.

| Level | Typeface                     | Font size                         | Weight                          | Line height                           |
| ----- | ---------------------------- | --------------------------------- | ------------------------------- | ------------------------------------- |
| 1     | `--pathable-font-heading`    | `--pathable-font-size-display-lg` | `--pathable-font-weight-normal` | `--pathable-font-line-height-heading` |
| 2     | `--pathable-font-subheading` | `--pathable-font-size-heading-lg` | `--pathable-font-weight-bold`   | `--pathable-font-line-height-heading` |
| 3     | `--pathable-font-subheading` | `--pathable-font-size-heading-md` | `--pathable-font-weight-bold`   | `--pathable-font-line-height-heading` |
| 4     | `--pathable-font-subheading` | `--pathable-font-size-heading-sm` | `--pathable-font-weight-bold`   | `--pathable-font-line-height-heading` |
| 5     | `--pathable-font-body`       | `--pathable-font-size-body-md`    | `--pathable-font-weight-bold`   | `--pathable-font-line-height-body`    |
| 6     | `--pathable-font-body`       | `--pathable-font-size-body-sm`    | `--pathable-font-weight-bold`   | `--pathable-font-line-height-body`    |

In the default theme the typefaces are Fredoka (heading), Poppins
(subheading) and Nunito (body), and the text colour is `#00365c`. The sizes,
line heights, colour and contrast figure in the guarantees are those of the
default theme. The sizes are in rem and follow the root font size; the pixel
figures are those at a 16 px root. A theme that changes these tokens changes
them.

The package ships Nunito at weights 400 and 600 only. Levels 5 and 6 ask for
weight 700, so they render in Nunito SemiBold (600) unless your application
loads a 700 face of Nunito.

## Composition

- Put the class on a real heading element, `<h1>` to `<h6>`, and pick the
  element for the document outline and the level modifier for the look.
- Use the class and a level modifier together. A level modifier on its own
  sets the font but not the colour or the zero margin.
- The heading has no margin. Space it from the content around it with the
  layout, such as `pathable-stack` with a gap modifier.
- Put plain text or inline content inside, such as a link. There are no
  element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The scales-with-root guarantee is unmet. Today the font-size tokens are fixed
px values, so the level sizes do not follow the user's default font size.

The dark-background-contrast guarantee is unmet: today the heading is drawn in
the theme text colour inside `pathable-dark-background`, which in the default
theme is the same colour as the container background. Do not put a
`pathable-heading` in that container yet.

## The consumer owns

- Accessibility. Keep the heading elements in a logical order without skipped
  levels; the level modifier changes only the look, never what is announced.
- Keeping headings short. A statement longer than one sentence belongs in body
  text, such as `pathable-text`.
- Spacing above and below the heading, and wrapping in narrow containers.
- The background: the contrast figure holds on the surface colour, not on a
  coloured or dark panel. Inside `pathable-section--dark`, the section colours
  every `<h1>` to `<h6>` `#4899e8`, so the heading is drawn in that colour, not
  the theme text colour.
