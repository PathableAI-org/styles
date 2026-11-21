---
name: Shadow
slug: tokens-shadow
kind: token
summary: 'The shadow tokens none and 1 to 5, five levels of soft elevation shadow, applied through the `shadow-<token>` classes.'
uswds: https://designsystem.digital.gov/design-tokens/shadow/
guarantees:
  - id: levels
    claim: The classes shadow-1 to shadow-5 set box-shadow to "0 1px 0.25rem 0", "0 0.25rem 0.5rem 0", "0 0.5rem 1rem 0", "0 0.75rem 1.5rem 0" and "0 1rem 2rem 0", each followed by rgba(0, 0, 0, 0.1).
  - id: none
    claim: The class shadow-none sets box-shadow to none.
  - id: hover-variants
    claim: The classes hover:shadow-1 to hover:shadow-5 and hover:shadow-none exist and set box-shadow on pointer hover.
  - id: no-responsive
    claim: No responsive prefix is emitted for the shadow classes, so tablet:shadow-2 does not exist, and neither do focus:shadow-2, active:shadow-2 or visited:shadow-2.
  - id: no-zero-class
    claim: No shadow-0 or shadow-6 class exists, because the tokens are none and 1 to 5.
---

# Shadow

The shadow tokens none and 1 to 5, five levels of soft elevation shadow,
applied through the `shadow-<token>` classes. Each
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
- the shadow must carry a colour: write the `box-shadow` yourself with the
  hex value from [Color](tokens-color.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: levels -->

## Values

Values are in `rem`, against a 16px root.

| Token  | Class         | PathAble `box-shadow`                   | Notes                          |
| ------ | ------------- | --------------------------------------- | ------------------------------ |
| `none` | `shadow-none` | `none`                                  | Removes a shadow set elsewhere |
| `1`    | `shadow-1`    | `0 1px 0.25rem 0 rgba(0, 0, 0, 0.1)`    | Offset 1px, blur 4px           |
| `2`    | `shadow-2`    | `0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.1)` | Offset 4px, blur 8px           |
| `3`    | `shadow-3`    | `0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1)`    | Offset 8px, blur 16px          |
| `4`    | `shadow-4`    | `0 0.75rem 1.5rem 0 rgba(0, 0, 0, 0.1)` | Offset 12px, blur 24px         |
| `5`    | `shadow-5`    | `0 1rem 2rem 0 rgba(0, 0, 0, 0.1)`      | Offset 16px, blur 32px         |

There is no `0` token: use `none`.

## Utilities

`shadow-<token>` is documented on [Shadow](utilities-shadow.md). It accepts the
`hover:` prefix, so `shadow-1 hover:shadow-4` raises a link or button on hover.
It has no `mobile-lg:`, `tablet:` or `desktop:` prefix, and no `focus:`,
`active:` or `visited:` prefix.

## States

Each state is complete markup for one use of the shadow tokens.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Not using a shadow as the only cue for a boundary, a state or a focus
  indicator: shadows are not drawn in forced-colours mode and are faint at
  10% black.
- Keeping focus indicators separate: a hover shadow does not replace the
  visible focus outline.
- Giving an interactive surface a real control (a link or a button) inside it;
  a shadow does not make a `div` clickable.
