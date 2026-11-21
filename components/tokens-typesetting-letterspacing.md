---
name: Letter spacing
slug: tokens-typesetting-letterspacing
kind: token
summary: Seven letter-spacing tokens, from tighter than normal (neg-3) to widely spaced (3), plus auto, in em.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/letterspacing/
guarantees:
  - id: tight-values
    claim: text-ls-neg-3, text-ls-neg-2 and text-ls-neg-1 set letter-spacing to -0.03em, -0.02em and -0.01em.
  - id: wide-values
    claim: text-ls-1, text-ls-2 and text-ls-3 set letter-spacing to 0.025em, 0.1em and 0.15em.
  - id: auto-value
    claim: text-ls-auto sets letter-spacing to initial.
  - id: not-responsive
    claim: 'The letter-spacing classes have no mobile-lg:, tablet: or desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Letter spacing

Seven letter-spacing tokens, from tighter than normal (neg-3) to widely spaced
(3), plus auto, in em. Because they are in em, the spacing follows the font
size of the text it is applied to.

## When to use

- Tracking out a short uppercase label or eyebrow, with `text-ls-2`, so small
  capitals stay legible.
- Tightening a large display heading slightly, with `text-ls-neg-1`, when the
  default spacing looks loose at that size.

Use something else when:

- you want to space running text for readability: leave it at `auto`; the
  brand type scale and line heights are tuned without extra tracking;
- you are letting a reader adjust text spacing: they can override it, and your
  layout must allow it.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: scale -->

## Values

| Class suffix | PathAble value | Notes                       |
| ------------ | -------------- | --------------------------- |
| `neg-3`      | -0.03em        | Tightest                    |
| `neg-2`      | -0.02em        |                             |
| `neg-1`      | -0.01em        |                             |
| `auto`       | `initial`      | Resets to the browser value |
| `1`          | 0.025em        |                             |
| `2`          | 0.1em          | Uppercase labels            |
| `3`          | 0.15em         | Widest                      |

The classes are `text-ls-neg-3` to `text-ls-3`. Brand guide: silent. The
values are the USWDS defaults.

## Utilities

| Class           | Property         | Page                                    |
| --------------- | ---------------- | --------------------------------------- |
| `text-ls-<key>` | `letter-spacing` | [Text styles](utilities-text-styles.md) |

`<key>` is `neg-3`, `neg-2`, `neg-1`, `auto`, `1`, `2` or `3`:
`text-ls-2`, `text-ls-neg-1`. There are no responsive or state variants.

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

`auto` compiles to the CSS keyword `initial`, which for `letter-spacing` is
`normal`.

## The consumer owns

- Keeping the text readable at the reader's own text spacing: letter spacing a
  reader sets can override these classes, and the layout must not break.
- Applying tracking to uppercase and short strings only; wide tracking on long
  lowercase text reduces readability.
- Avoiding negative tracking on small text, where letters begin to touch.
