---
name: Measure
slug: tokens-typesetting-measure
kind: token
summary: Six line-length tokens, 44ex to 88ex, plus none, that limit how wide a block of text can grow.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/measure/
guarantees:
  - id: scale-values
    claim: measure-1 to measure-6 set max-width to 44ex, 60ex, 64ex, 68ex, 72ex and 88ex.
  - id: none-value
    claim: measure-none sets max-width to none.
  - id: default-measure
    claim: measure-4 sets max-width to 68ex, the line length PathAble uses for running text.
  - id: max-width-only
    claim: A measure class sets only max-width and does not set width, margin or font size.
  - id: responsive-variants
    claim: 'Each measure class has mobile-lg:, tablet: and desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Measure

Six line-length tokens, 44ex to 88ex, plus none, that limit how wide a block
of text can grow. Measure is the maximum width of a line, in `ex`, so it scales
with the text's own font size and typeface.

## When to use

- Keeping a paragraph, a summary or a notice at a readable line length when its
  container is wider, with `measure-4`.
- Limiting a short intro or a form hint to a narrower line (`measure-1` to
  `measure-3`), or a lead paragraph to a wider one (`measure-6`).

Use something else when:

- you want to size a layout column or card: use the width and grid utilities;
- the text sits in a narrow column already: measure only caps width, it never
  widens a block.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: scale -->

## Values

| Key    | PathAble value | Use                              |
| ------ | -------------- | -------------------------------- |
| `1`    | 44ex           | Narrow text                      |
| `2`    | 60ex           |                                  |
| `3`    | 64ex           |                                  |
| `4`    | 68ex           | The default for running text     |
| `5`    | 72ex           |                                  |
| `6`    | 88ex           | Wide text and the lead paragraph |
| `none` | `none`         | No limit                         |

Brand guide: silent. The values and the default measure are the USWDS defaults.
The USWDS website lists 74ex for key `5`; USWDS 3.14.0 compiles 72ex, and that
is the value on this page.
The `ex` unit is the x-height of the element's own font, so the same key gives a
slightly different pixel width in a different typeface or size.

## Utilities

| Class           | Property    | Page                                              |
| --------------- | ----------- | ------------------------------------------------- |
| `measure-<key>` | `max-width` | [Paragraph styles](utilities-paragraph-styles.md) |

`<key>` is `1` to `6` or `none`: `measure-4`, `measure-none`. The responsive
prefixes `mobile-lg:`, `tablet:` and `desktop:` also work, for example
`desktop:measure-5`. Width utilities set `width` and `max-width` by spacing
units and are separate.

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

A measure class does not centre or align the block: a block narrower than its
container sits at the start of it.

## The consumer owns

- Aligning the limited block (for example with an auto margin) when the
  design needs it centred.
- Keeping content readable at narrow widths and large text sizes, where the
  container, not the measure, sets the line length.
- Not using measure to hide overflow: long unbroken strings still need
  wrapping rules.
