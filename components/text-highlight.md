---
name: TextHighlight
slug: text-highlight
kind: static
summary: An inline mark that draws attention to a phrase inside running text with a marker band, an accent underline or a soft background fill.
styles-class: pathable-text-highlight
variants:
  - axis: style
    default: none
    values: [none, marker, underline, soft-bg]
guarantees:
  - id: marker-band
    status: unverified
    claim: The marker style fills the lower 40% of each line of the phrase with the marker colour and leaves the upper 60% transparent.
  - id: underline
    status: unverified
    claim: The underline style draws a solid 2 px bottom border in the underline colour, 0.1em below the text.
  - id: soft-fill
    status: unverified
    claim: The soft-background style fills the phrase with the fill colour, with 0.15em block and 0.3em inline padding offset by a −0.15em inline margin on each side.
  - id: per-line
    status: unverified
    claim: When the phrase wraps, every line fragment gets its own full band, border, fill and padding.
  - id: type-unchanged
    status: unverified
    claim: No style changes the typeface, size, weight, line height or colour of the text in normal colour mode.
  - id: forced-colours
    status: unverified
    claim: In forced-colours mode the marker and soft-background styles use the system highlight colours and the underline uses the system highlight colour for its border.
  - id: fill-contrast
    status: unverified
    claim: Text in the default text colour keeps a contrast of at least 4.5:1 on the marker band and on the soft-background fill.
  - id: italic
    status: unmet
    claim: Highlighted text is set in italic, the brand's style for highlights.
---

# TextHighlight

An inline mark that draws attention to a phrase inside running text with a
marker band, an accent underline or a soft background fill. Put the class and
one style modifier on a `<span>`, `<em>` or `<strong>` inside a paragraph. It is not interactive and adds no role.

## When to use

- One key phrase in a paragraph of marketing or onboarding copy.
- Sparingly: one highlight in a block of text, not several.

Use something else when:

- the whole paragraph needs to stand out: use `pathable-intro` for a lead
  paragraph;
- the text is a heading or headline: use `pathable-heading` or
  `pathable-display`;
- the words are a link: use `pathable-link`, which the underline style would
  be confused with;
- the words are a status, such as "Pending": use `pathable-tag`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<p class="pathable-text pathable-text--body">
  Your coach can see
  <strong class="pathable-text-highlight pathable-text-highlight--marker">
    every skill you have verified
  </strong>
  on your profile.
</p>
```

## Variants

Add one style modifier to `pathable-text-highlight`. Without one, the phrase
looks like the text around it.

| Axis  | Value       | Class                                | What it is for                                     |
| ----- | ----------- | ------------------------------------ | -------------------------------------------------- |
| style | `none`      | none                                 | No visible mark; only sets per-line wrapping       |
| style | `marker`    | `pathable-text-highlight--marker`    | Highlighter-pen band behind the lower part of text |
| style | `underline` | `pathable-text-highlight--underline` | Accent rule under the text                         |
| style | `soft-bg`   | `pathable-text-highlight--soft-bg`   | Padded background fill behind the whole phrase     |

## Tokens

| What                 | Token                                        | Default theme |
| -------------------- | -------------------------------------------- | ------------- |
| Marker band colour   | `--pathable-text-highlight-marker-color`     | `#e6ebef`     |
| Underline colour     | `--pathable-text-highlight-underline-color`  | `#00365c`     |
| Underline thickness  | `--pathable-text-highlight-underline-height` | `2px`         |
| Soft-background fill | `--pathable-text-highlight-soft-bg-color`    | `#99afbe`     |

The 2 px figure and the contrast figure in the guarantees are those of the
default theme, where the default text colour is `#00365c`: 10.40:1 on the
marker band and 5.49:1 on the soft fill. Set these custom properties on the
highlight, or on a container, to change them.

## Composition

- Put plain text inside, and place the highlight inside a block of text such
  as a `<p>` with `pathable-text`. It inherits the font and colour of that
  text.
- The soft-background fill reaches 0.3em past the text on each side, 0.15em
  of it over the neighbouring space, so keep a space between the highlight and
  the words beside it.
- Do not use a `<mark>`. The class does not reset the browser's styling of
  `<mark>`: its black text stays with every style, and its yellow background
  stays with the underline style.
- The underline style adds 0.1em of padding below the text. In a tight line
  height the rule can touch the line below; keep a line height of 1.5 or more.
- Do not put links or other interactive content inside a highlight.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The italic guarantee is unmet: the highlight does not change the font style.
Wrap the phrase in an `<em>` if it should be italic.

## The consumer owns

- Accessibility. The mark is visual only and is not announced. When the
  emphasis matters to the meaning, use `<em>` or `<strong>` as the element so
  assistive technology can convey it.
- Contrast when you change the text colour or the highlight colours. Muted
  text and link text are also a change of text colour: in the default theme
  both are Tech Teal (`#015a76`), which is 6.42:1 on the marker band but only
  3.39:1 on the soft fill, below 4.5:1. A soft-background highlight in muted
  or link text needs a darker text colour or a lighter fill.
- Using highlights sparingly, so they still draw attention.
- The text and the layout of the paragraph around it.
