---
name: Shadow
slug: tokens-shadow
kind: token
summary: 'The shadow tokens none and 1 to 5, five levels of soft elevation shadow, applied through the `shadow-<token>` classes and the `u-shadow()` mixin.'
uswds: https://designsystem.digital.gov/design-tokens/shadow/
guarantees:
  - id: levels
    status: unverified
    claim: The classes shadow-1 to shadow-5 set box-shadow to "0 1px 0.25rem 0", "0 0.25rem 0.5rem 0", "0 0.5rem 1rem 0", "0 0.75rem 1.5rem 0" and "0 1rem 2rem 0", each followed by rgba(0, 0, 0, 0.1).
  - id: none
    status: unverified
    claim: The class shadow-none sets box-shadow to none, and u-shadow('none') outputs box-shadow none.
  - id: hover-variants
    status: unverified
    claim: The classes hover:shadow-1 to hover:shadow-5 and hover:shadow-none exist and set box-shadow on pointer hover.
  - id: no-responsive
    status: unverified
    claim: No responsive prefix is emitted for the shadow classes, so tablet:shadow-2 does not exist, and neither do focus:shadow-2, active:shadow-2 or visited:shadow-2.
  - id: invalid-token
    status: unverified
    claim: u-shadow(6) and u-shadow(0) are Sass compile errors, because the tokens are none and 1 to 5.
  - id: no-function
    status: unverified
    claim: There is no shadow() Sass function; the value is read through the u-shadow() mixin.
---

# Shadow

The shadow tokens none and 1 to 5, five levels of soft elevation shadow,
applied through the `shadow-<token>` classes and the `u-shadow()` mixin. Each
level is a drop shadow with a larger offset and blur than the one before and
the same 10% black colour. See the
[USWDS shadow tokens](https://designsystem.digital.gov/design-tokens/shadow/).

## When to use

- Lifting a surface above the page: a card, a menu or a dialog.
- A hover response on a clickable card, one level up.

Use something else when:

- the surface only needs a boundary: use a border
  ([Border](utilities-border.md)), which shows in forced-colours mode while a
  shadow does not;
- the shadow must carry a colour: write the `box-shadow` yourself with
  `color()`; see [Color](tokens-color.md#sass).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: levels -->

## Tokens

Values are at the PathAble default of `rem` output (16px root).

| Token    | Class         | `box-shadow`                            | Notes                          |
| -------- | ------------- | --------------------------------------- | ------------------------------ |
| `'none'` | `shadow-none` | `none`                                  | Removes a shadow set elsewhere |
| `1`      | `shadow-1`    | `0 1px 0.25rem 0 rgba(0, 0, 0, 0.1)`    | Offset 1px, blur 4px           |
| `2`      | `shadow-2`    | `0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.1)` | Offset 4px, blur 8px           |
| `3`      | `shadow-3`    | `0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1)`    | Offset 8px, blur 16px          |
| `4`      | `shadow-4`    | `0 0.75rem 1.5rem 0 rgba(0, 0, 0, 0.1)` | Offset 12px, blur 24px         |
| `5`      | `shadow-5`    | `0 1rem 2rem 0 rgba(0, 0, 0, 0.1)`      | Offset 16px, blur 32px         |

The `0` token was replaced by `'none'`; `u-shadow(0)` is an error.

## Sass

`u-shadow()` sets `box-shadow` from a token. There is no `shadow()` function:

```scss
@use '@pathableai/styles' as *;

.resource-card {
  @include u-shadow(1);

  &:hover {
    @include u-shadow(3);
  }
}
```

## Utilities

`shadow-<token>` is documented on [Shadow](utilities-shadow.md). It accepts the
`hover:` prefix, so `shadow-1 hover:shadow-4` raises a surface on hover. It has
no `mobile-lg:`, `tablet:` or `desktop:` prefix, and no `focus:`, `active:` or
`visited:` prefix, by default.

## Settings

| Setting                     | PathAble default                                     | Controls                                        |
| --------------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| `$box-shadow-settings`      | `()`, giving output on, hover on, other variants off | Which variants the `shadow-<token>` classes get |
| `$box-shadow-palettes`      | `('palette-box-shadow-default')`                     | Which tokens become classes                     |
| `$box-shadow-manual-values` | `()`                                                 | Extra class values                              |

```scss
@use '@pathableai/styles' with (
  $box-shadow-settings: (
    responsive: true,
  )
);
```

## States

Each state is complete markup for one use of the shadow tokens.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour that was read from the package source and that no test
checks yet (`status: unverified`).

## The consumer owns

- Not using a shadow as the only cue for a boundary, a state or a focus
  indicator: shadows are not drawn in forced-colours mode and are faint at
  10% black.
- Keeping focus indicators separate: a hover shadow does not replace the
  visible focus outline.
- Giving an interactive surface a real control (a link or a button) inside it;
  a shadow does not make a `div` clickable.
