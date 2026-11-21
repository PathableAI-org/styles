---
name: Paragraph styles
slug: utilities-paragraph-styles
kind: utility
summary: Utility classes that set the line height, line length, alignment and first-line indent of a paragraph of text.
uswds: https://designsystem.digital.gov/utilities/paragraph-styles/
classes:
  - line-height-<family>-<value>
  - measure-<value>
  - text-<alignment>
  - text-indent-<value>
guarantees:
  - id: line-height-text-families
    claim: line-height-body-1 sets line-height to 1, line-height-body-2 to 1.2, line-height-body-3 to 1.4, line-height-body-4 to 1.5, line-height-body-5 to 1.6 and line-height-body-6 to 1.8, and the heading, ui, alt, sans, serif and cond families set the same six values.
  - id: line-height-mono
    claim: line-height-code-2 and line-height-mono-2 set line-height to 1.3, line-height-code-4 to 1.6 and line-height-code-5 to 1.7, so a monospace family differs from the text families at steps 2, 4 and 5.
  - id: measure
    claim: measure-1 sets max-width to 44ex, measure-2 to 60ex, measure-3 to 64ex, measure-4 to 68ex, measure-5 to 72ex, measure-6 to 88ex and measure-none to none.
  - id: alignment
    claim: text-left sets text-align to left, text-center to center, text-right to right and text-justify to justify.
  - id: indent
    claim: text-indent-0 sets text-indent to 0, text-indent-2 to 1rem, text-indent-4 to 2rem and text-indent-neg-2 to -1rem.
  - id: indent-tokens-limited
    claim: The stylesheet has no text-indent-1px, text-indent-2px or text-indent-auto rule, and has text-indent-<token> and text-indent-neg-<token> for the tokens 05, 1, 105, 2, 205, 3, 4, 5, 6, 7, 8, 9, 10 and 15.
  - id: responsive
    claim: 'tablet:line-height-body-4 and desktop:measure-4 exist inside min-width media queries, and tablet:text-left, tablet:text-indent-2 and every hover: variant of these classes do not exist.'
---

# Paragraph styles

Utility classes that set the line height, line length, alignment and
first-line indent of a paragraph of text. `line-height-body-5` sets the line
height of body text, `measure-4` limits a block to a comfortable line length,
`text-center` aligns the text and `text-indent-2` indents the first line. The
classes have no prefix and need no JavaScript.

## When to use

- Set the line height of text that is not in a heading, paragraph or list that
  already has one, such as a quotation in a `<div>`.
- Limit the line length of a block that is wider than the text should be:
  `measure-4` is the default for body text, `measure-6` for a lead.
- Align a short run of text or a figure: `text-center`, `text-right`.
- Indent the first line of a paragraph, or hang a line with a negative indent.

Use something else when:

- the text is inside `pathable-prose`: it sets a line height and a measure for
  its headings, paragraphs and lists already;
- the element is a component with its own type, such as a button or an alert:
  use the component's own class and variant;
- the change is to size, typeface, weight or case: use
  [Font size and family](utilities-font-size-and-family.md) or
  [Text styles](utilities-text-styles.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: measure -->

## Classes

`text-` is the prefix of the colour classes of [Color](utilities-color.md) and
the style classes of [Text styles](utilities-text-styles.md) as well. The word
after the prefix decides which property is set.

| Class pattern                  | Property      | Values                                                                                                   |
| ------------------------------ | ------------- | -------------------------------------------------------------------------------------------------------- |
| `line-height-<family>-<value>` | `line-height` | Family is `ui`, `heading`, `body`, `code`, `alt`, `sans`, `serif`, `mono` or `cond`; value is `1` to `6` |
| `measure-<value>`              | `max-width`   | `1` to `6`, or `none`                                                                                    |
| `text-<alignment>`             | `text-align`  | `left`, `center`, `right`, `justify`                                                                     |
| `text-indent-<value>`          | `text-indent` | A spacing token, or `neg-` followed by one                                                               |

### Line height tokens

The value at each step is normalised by the typeface's cap height, so it
differs between a text family and a monospace family. At PathAble defaults the
text families (`ui`, `heading`, `body`, `alt`, `sans`, `serif`, `cond`) share
one set of values.

| Step | `ui`, `heading`, `body`, `alt`, `sans`, `serif`, `cond` | `code`, `mono` |
| ---- | ------------------------------------------------------- | -------------- |
| `1`  | `1`                                                     | `1`            |
| `2`  | `1.2`                                                   | `1.3`          |
| `3`  | `1.4`                                                   | `1.4`          |
| `4`  | `1.5`                                                   | `1.6`          |
| `5`  | `1.6`                                                   | `1.7`          |
| `6`  | `1.8`                                                   | `1.8`          |

The brand guide's line heights are `line-height-body-5` (1.6) for body text,
`line-height-heading-3` (1.4) for headings and `line-height-body-6` (1.8) for
a lead paragraph.

Some USWDS documentation lists 1.15 for step 2; the 3.14.0 source and the
table above use 1.2.

### Measure tokens

| Token  | `max-width` | Used for              |
| ------ | ----------- | --------------------- |
| `1`    | `44ex`      | Narrow measure        |
| `2`    | `60ex`      |                       |
| `3`    | `64ex`      |                       |
| `4`    | `68ex`      | Default measure       |
| `5`    | `72ex`      |                       |
| `6`    | `88ex`      | Wide measure and lead |
| `none` | `none`      |                       |

`ex` is the height of a lowercase x in the element's font, so the line length
follows the element's own size. A USWDS comment lists `74ex` for token 5; the
3.14.0 source compiles `72ex`.

### Indent tokens

`text-indent-<value>` takes the spacing tokens `0`, `05`, `1`, `105`, `2`,
`205`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10` and `15`, and the negative form
of each except `0` (`text-indent-neg-2`). A token is a multiple of `0.5rem`:
`2` is `1rem`, `4` is `2rem`, `15` is `7.5rem`. A negative value pulls the first
line to the left of the block, as in a hanging indent.

The values these classes take are defined by the design tokens: [Line height](tokens-typesetting-line-height.md) and [Measure](tokens-typesetting-measure.md).

## Variants

| Prefix                                    | `line-height-*`, `measure-*` | `text-<alignment>`, `text-indent-*` |
| ----------------------------------------- | ---------------------------- | ----------------------------------- |
| `mobile-lg:`, `tablet:`, `desktop:`       | Output                       | Not output                          |
| `hover:`, `focus:`, `active:`, `visited:` | Not output                   | Not output                          |

The breakpoints are `min-width` media queries in `em`: `mobile-lg` 30em
(480px), `tablet` 40em (640px) and `desktop` 64em (1024px). For example,
`measure-1 desktop:measure-4` limits a block to 44ex on a phone and 68ex from
1024px up. The alignment classes have no breakpoint variants, so change
alignment at a breakpoint with your own CSS.

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states the CSS a class compiles to at PathAble defaults.

`measure-<value>` sets `max-width` only. It does not centre the block or set a
width, so a measure on a block inside a wider container leaves the block at the
left edge.

## The consumer owns

- Readable line length. Keep running text near `measure-4` (68ex), and do not
  centre or justify text longer than three lines, as the brand guide asks:
  `text-center` is for a short heading or caption, and `text-justify` can leave
  uneven gaps on narrow screens.
- Line height that fits the size. A larger font size with the same line height
  step is tighter, so check the step again when the size changes.
- Indent that suits the content. A first-line indent is for continuous prose;
  lists, forms and headings take none.
- Alignment in right-to-left text: `text-left` and `text-right` are physical,
  so use them only where the layout does not change with the reading
  direction.
