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
  - id: sass-keys
    claim: "letter-spacing(-2) and letter-spacing('ls-neg-2') both return -0.02em, and letter-spacing('neg-2') is a Sass error."
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

## Tokens

| Class suffix | Sass key | Value at PathAble defaults | Notes                       |
| ------------ | -------- | -------------------------- | --------------------------- |
| `neg-3`      | `-3`     | -0.03em                    | Tightest                    |
| `neg-2`      | `-2`     | -0.02em                    |                             |
| `neg-1`      | `-1`     | -0.01em                    |                             |
| `auto`       | `auto`   | `initial`                  | Resets to the browser value |
| `1`          | `1`      | 0.025em                    |                             |
| `2`          | `2`      | 0.1em                      | Uppercase labels            |
| `3`          | `3`      | 0.15em                     | Widest                      |

The system also accepts the long keys `ls-neg-3`, `ls-neg-2`, `ls-neg-1`,
`ls-auto`, `ls-1`, `ls-2` and `ls-3` in Sass. The negative keys are written
`neg-2` in class names and `-2` (a negative number) in Sass functions.
Brand guide: silent. The values are the USWDS defaults.

## Sass

```scss
@use '@pathableai/styles' as *;

.status-label {
  text-transform: uppercase;
  letter-spacing: letter-spacing(2); // 0.1em
}

.page-title {
  @include u-text('ls-neg-1'); // letter-spacing: -0.01em
}
```

`letter-spacing($key)` and `ls($key)` return the value. Use the number keys `-3`
to `3` or `auto`, or the long keys such as `'ls-neg-2'`; the short class name
`'neg-2'` is an error in the function. `u-text('ls-neg-2')` sets the property
from a long key, as do the other `u-text` keys.

## Utilities

| Class           | Property         | Page                                    |
| --------------- | ---------------- | --------------------------------------- |
| `text-ls-<key>` | `letter-spacing` | [Text styles](utilities-text-styles.md) |

`<key>` is `neg-3`, `neg-2`, `neg-1`, `auto`, `1`, `2` or `3`:
`text-ls-2`, `text-ls-neg-1`. There are no responsive or state variants.

## Settings

No `$theme-*` setting changes these values; the seven tokens are fixed by
USWDS and the brand uses the defaults. Only the module's output can be
configured:

| Setting                    | PathAble default                            | USWDS default |
| -------------------------- | ------------------------------------------- | ------------- |
| `$letter-spacing-settings` | `()` (output on; responsive and states off) | same          |
| `$letter-spacing-palettes` | `('palette-letter-spacing-default')`        | same          |

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
