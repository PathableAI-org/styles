---
name: Border
slug: utilities-border
kind: utility
summary: Utility classes that set the width, sides, style, colour and corner radius of an element's border.
uswds: https://designsystem.digital.gov/utilities/border/
classes:
  - border
  - border-<side>
  - border-<width>
  - border-<side>-<width>
  - border-width-<width>
  - border-<side>-width-<width>
  - border-<style>
  - border-<token>
  - radius-<value>
  - radius-<corner>-<value>
guarantees:
  - id: default-border
    claim: border sets border to 1px solid, and border-top, border-right, border-bottom and border-left each set a 1px solid border on that side only.
  - id: width-tokens
    claim: border-1px sets border to 1px solid, border-2px to 2px solid, border-05 to 0.25rem solid, border-1 to 0.5rem solid and border-3 to 1.5rem solid, and border-0 sets border to 0 solid.
  - id: side-width
    claim: border-y-2px sets border-top and border-bottom to 2px solid, border-x-2px sets border-left and border-right to 2px solid, and border-left-05 sets border-left to 0.25rem solid.
  - id: width-only
    claim: border-width-2px sets border-width to 2px and nothing else, border-width-0 sets border-width to 0, border-top-width-05 sets border-top-width to 0.25rem, and border-x-width-1px sets border-left-width and border-right-width to 1px, so none of them sets a style or a colour.
  - id: style-classes
    claim: border-dashed sets border-style to dashed, border-dotted to dotted and border-solid to solid, and none of them sets a width or a colour.
  - id: color-classes
    claim: 'border-primary sets border-color to #00365c, border-primary-vivid to #015a76, border-secondary to #1cae96, border-base to #dde2e8 and border-error to #dc3545, and none of them sets a width or a style.'
  - id: radius-tokens
    claim: radius-0 sets border-radius to 0, radius-sm to 2px, radius-md to 0.25rem, radius-lg to 0.5rem and radius-pill to 99rem, and radius-top-lg sets only the two top corners to 0.5rem.
  - id: responsive-variants
    claim: tablet:border-2px sets border to 2px solid inside a min-width 40em media query, and tablet:border-primary and tablet:radius-md exist, while tablet:border-dashed does not.
  - id: hover-variant
    claim: 'hover:border-primary sets border-color to #00365c only while the element is hovered, and hover:radius-md does not exist.'
---

# Border

Utility classes that set the width, sides, style, colour and corner radius of
an element's border. A width class such as `border-2px` sets a solid border
that takes the element's text colour; `border-primary` sets the colour only;
`radius-md` rounds the corners. Combine one class from each group, with no
prefix and no JavaScript.

## When to use

- Draw a rule above or beside a block, such as `border-top-1px border-base`
  between two sections of a form.
- Outline a one-off panel: `border-1px border-base radius-md`.
- Round the corners of an element that has no component class, or restore a
  corner on one side with `radius-top-0`.

Use something else when:

- the element is a component with its own border, such as a card, a table or a
  text input: use the component's class and variant;
- the element is a selected or focused state that needs an outline rather than
  a border: use [Outline](utilities-outline.md), which does not change the
  layout;
- the colour is the only thing to change: use the colour classes of
  [Color](utilities-color.md) for the text and surface, and the colour classes
  on this page for the border.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: widths-and-sides -->

## Classes

A border has three parts: width, style and colour. The width classes set the
width and a `solid` style together, and take the colour from the element's text
colour (`currentcolor`) unless a colour class is added.

| Class pattern                                    | Property                                | Values                                                            |
| ------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------- |
| `border`                                         | `border`                                | `1px solid`                                                       |
| `border-<side>`                                  | `border-<side>`                         | `1px solid`; side is `top`, `right`, `bottom`, `left`, `x` or `y` |
| `border-<width>`                                 | `border`                                | Width token followed by `solid`                                   |
| `border-<side>-<width>`                          | `border-<side>`                         | Width token followed by `solid`, for the same sides as above      |
| `border-width-<width>`                           | `border-width`                          | Width token only: no style, no colour                             |
| `border-<side>-width-<width>`                    | `border-<side>-width`                   | Width token only, for the same sides as above                     |
| `border-solid`, `border-dashed`, `border-dotted` | `border-style`                          | `solid`, `dashed`, `dotted`                                       |
| `border-<token>`                                 | `border-color`                          | A colour token, such as `primary`, `base` or `error`              |
| `radius-<value>`                                 | `border-radius`                         | `0`, `sm`, `md`, `lg`, `pill`                                     |
| `radius-<corner>-<value>`                        | Two `border-<corner>-radius` properties | Corner is `top`, `right`, `bottom` or `left`; value as above      |

`x` is left and right, `y` is top and bottom. Use the width-only classes
(`border-width-2px`, `border-bottom-width-05`) to change the width of a border
that another class already styles, for example `border border-width-2px`.
They are not output with the responsive or `hover:` prefixes.

### Width tokens

| Token | Width            |
| ----- | ---------------- |
| `0`   | `0`              |
| `1px` | `1px`            |
| `2px` | `2px`            |
| `05`  | `0.25rem` (4px)  |
| `1`   | `0.5rem` (8px)   |
| `105` | `0.75rem` (12px) |
| `2`   | `1rem` (16px)    |
| `205` | `1.25rem` (20px) |
| `3`   | `1.5rem` (24px)  |

### Radius tokens

| Token  | Radius          |
| ------ | --------------- |
| `0`    | `0`             |
| `sm`   | `2px`           |
| `md`   | `0.25rem` (4px) |
| `lg`   | `0.5rem` (8px)  |
| `pill` | `99rem`         |

### Colour tokens

The colour classes use the same tokens and values as [Color](utilities-color.md):
the theme tokens (`border-primary`, `border-base`, `border-accent-cool-dark`),
the state tokens (`border-error`, `border-success`), `border-black`,
`border-white`, `border-transparent`, and the basic and grayscale colours.
The USWDS system palette classes such as `border-red-50v` and
`border-gray-cool-30` are not part of PathAble's CSS; see
[System palette classes not in PathAble's CSS](utilities-color.md#system-palette-classes-not-in-pathables-css).

The values these classes take are defined by the design tokens: [Color tokens](tokens-color.md), [Spacing units](tokens-spacing-units.md) and [Shadow](tokens-shadow.md).

## Variants

| Prefix                              | Output for                                                                                        | Not output for                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `mobile-lg:`, `tablet:`, `desktop:` | Border shorthand and side classes, `border-<width>`, `border-<token>`, and every `radius-*` class | `border-width-*`, `border-solid`, `border-dashed`, `border-dotted` |
| `hover:`                            | Border shorthand and side classes, `border-<width>`, `border-<token>`                             | `border-width-*`, `border-<style>` and every `radius-*` class      |
| `focus:`, `active:`, `visited:`     | None                                                                                              | Every class                                                        |

The breakpoints are `min-width` media queries in `em`: `mobile-lg` 30em
(480px), `tablet` 40em (640px) and `desktop` 64em (1024px). For example,
`border-1px tablet:border-2px` is 1px wide on a phone and 2px from 640px up.

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states the CSS a class compiles to at PathAble defaults.

A colour or style class never draws a border on its own: it sets only
`border-color` or `border-style`, and an element with no border style draws no
border. Put a width class, which also sets `solid`, on the same element.

## The consumer owns

- A width on every element that has a colour or style class: `border-dashed`
  and `border-primary` change nothing without a width class such as `border-1px`.
- Contrast of a border that carries meaning, such as the edge of an input or
  a card. A border that marks a boundary a user needs to find has to reach 3:1
  against the surface behind it; `border-base` (`#dde2e8`) on white does not.
- The size of the box. A border adds to the size of an element that does not
  use `box-sizing: border-box`, so check the layout when you add one.
- Corners that meet. Rounded corners on a child inside a rounded parent need
  the same radius, or the parent needs to clip its children.
