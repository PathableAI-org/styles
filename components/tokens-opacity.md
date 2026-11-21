---
name: Opacity
slug: tokens-opacity
kind: token
summary: 'The opacity tokens 0 to 100 in steps of 10, which set how transparent an element is through the `opacity-<token>` classes.'
uswds: https://designsystem.digital.gov/design-tokens/opacity/
guarantees:
  - id: classes
    claim: The classes opacity-0, opacity-10 through opacity-90 and opacity-100 set opacity to the token divided by 100, so opacity-0 sets opacity to 0, opacity-50 to 0.5 and opacity-100 to 1.
  - id: steps-of-ten
    claim: Only the eleven classes opacity-0, opacity-10 to opacity-90 in tens and opacity-100 exist, so opacity-55 does not exist.
  - id: no-variants
    claim: No responsive or state prefix is emitted for the opacity classes, so tablet:opacity-50 and hover:opacity-50 do not exist.
---

# Opacity

The opacity tokens 0 to 100 in steps of 10, which set how transparent an
element is through the `opacity-<token>` classes.
The token is a percentage: `50` is `opacity: 0.5`. See the
[USWDS opacity tokens](https://designsystem.digital.gov/design-tokens/opacity/).

## When to use

- Fading a decorative element, an overlay or an image.
- A hover or loading treatment that lowers an element's weight.

Use something else when:

- you want a see-through colour but opaque content: opacity affects the whole
  element including its text and children, so use a colour token with its own
  alpha or a lighter grade from [color theme tokens](tokens-color-theme-tokens.md);
- the element must look disabled: use the control's own disabled state, not
  opacity, so contrast and semantics stay correct.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: steps -->

## Values

| Token | Class         | PathAble value |
| ----- | ------------- | -------------- |
| `0`   | `opacity-0`   | `0`            |
| `10`  | `opacity-10`  | `0.1`          |
| `20`  | `opacity-20`  | `0.2`          |
| `30`  | `opacity-30`  | `0.3`          |
| `40`  | `opacity-40`  | `0.4`          |
| `50`  | `opacity-50`  | `0.5`          |
| `60`  | `opacity-60`  | `0.6`          |
| `70`  | `opacity-70`  | `0.7`          |
| `80`  | `opacity-80`  | `0.8`          |
| `90`  | `opacity-90`  | `0.9`          |
| `100` | `opacity-100` | `1`            |

## Utilities

`opacity-<token>` is documented on [Display](utilities-display.md). No
`mobile-lg:`, `tablet:` or `desktop:` prefix and no `hover:`, `focus:`,
`active:` or `visited:` prefix exists for it.

## States

Each state is complete markup for one use of the opacity tokens.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Contrast: opacity lowers the contrast of text and borders in the element,
  so never apply it to text that must stay readable.
- Not using opacity or `opacity-0` to hide content from assistive technology
  or the keyboard: a transparent element is still focusable and announced.
  Use `hidden` or `display-none` instead.
- Naming a faded decorative image or swatch as decorative (`aria-hidden="true"`
  or an empty `alt`), and putting its meaning in text.
