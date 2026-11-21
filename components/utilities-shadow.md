---
name: Shadow
slug: utilities-shadow
kind: utility
summary: Utility classes that raise an element off the page with one of five drop shadows, or remove its shadow.
uswds: https://designsystem.digital.gov/utilities/shadow/
classes:
  - shadow-<value>
  - hover:shadow-<value>
guarantees:
  - id: levels
    claim: shadow-1 sets box-shadow to 0 1px 0.25rem 0 rgba(0, 0, 0, 0.1), shadow-2 to 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.1), shadow-3 to 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1), shadow-4 to 0 0.75rem 1.5rem 0 rgba(0, 0, 0, 0.1) and shadow-5 to 0 1rem 2rem 0 rgba(0, 0, 0, 0.1).
  - id: none
    claim: shadow-none sets box-shadow to none.
  - id: hover-variant
    claim: hover:shadow-3 sets box-shadow to 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1) only while the element is hovered, and hover:shadow-none exists.
  - id: no-other-variants
    claim: 'The stylesheet has no mobile-lg:, tablet: or desktop: variant of any shadow class and no focus:, active: or visited: variant.'
  - id: six-values-only
    claim: The stylesheet has exactly the six classes shadow-none and shadow-1 to shadow-5, and no shadow-0 or shadow-6.
---

# Shadow

Utility classes that raise an element off the page with one of five drop
shadows, or remove its shadow. `shadow-1` is the lightest and `shadow-5` the
deepest; `shadow-none` clears a shadow set elsewhere. Every shadow is black at
10% opacity, offset straight down. The classes have no prefix and need no
JavaScript.

## When to use

- Lift a one-off panel, popover container or sticky bar above the content
  behind it: `shadow-2` for a panel, `shadow-4` for a popover.
- Raise a panel on hover with `hover:shadow-3`.
- Remove a shadow that a component draws, with `shadow-none`.

Use something else when:

- the element is a component that already has a shadow, such as a card or a
  modal: use the component's own class and variant;
- the element needs an edge that stays visible in high contrast or forced
  colours: use a border from [Border](utilities-border.md), because shadows are
  removed in forced colours mode.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: levels -->

## Classes

| Class pattern    | Property     | Values                                                 |
| ---------------- | ------------ | ------------------------------------------------------ |
| `shadow-<value>` | `box-shadow` | `none`, `1`, `2`, `3`, `4`, `5`, as in the table below |

| Token  | `box-shadow` at PathAble defaults       |
| ------ | --------------------------------------- |
| `none` | `none`                                  |
| `1`    | `0 1px 0.25rem 0 rgba(0, 0, 0, 0.1)`    |
| `2`    | `0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.1)` |
| `3`    | `0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1)`    |
| `4`    | `0 0.75rem 1.5rem 0 rgba(0, 0, 0, 0.1)` |
| `5`    | `0 1rem 2rem 0 rgba(0, 0, 0, 0.1)`      |

The shadow values are USWDS defaults. The brand guide does not define
elevation, and USWDS has no setting that changes the tokens; to use another
shadow, write your own `box-shadow` in your own class.

The values these classes take are defined by the design tokens: [Shadow](tokens-shadow.md).

## Variants

| Prefix                              | Output     | Notes                                                        |
| ----------------------------------- | ---------- | ------------------------------------------------------------ |
| `mobile-lg:`, `tablet:`, `desktop:` | Not output | `$box-shadow-settings` has `responsive: false`               |
| `hover:`                            | Output     | `hover:shadow-1` to `hover:shadow-5` and `hover:shadow-none` |
| `focus:`, `active:`, `visited:`     | Not output | Set the key to `true` in `$box-shadow-settings` to output it |

A hover shadow gives no cue to keyboard or touch users, so it never carries
meaning alone.

## Sass

`u-shadow()` sets `box-shadow` from a token. It takes one argument, a number
or a string, and `!important` as a last argument.

```scss
@use '@pathableai/styles' as *;

.referral-popover {
  @include u-shadow(4);
}

.referral-card {
  @include u-shadow(1);

  &:hover {
    @include u-shadow(3);
  }
}
```

## Settings

| Setting                      | PathAble default                                                         | What it does                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `$output-these-utilities`    | `default` (every module)                                                 | A list of module names to output; the module of this page is `box-shadow`                                    |
| `$box-shadow-settings`       | `output: true`, `responsive: false`, `hover: true`, other states `false` | Which prefixes the module outputs                                                                            |
| `$box-shadow-palettes`       | `('palette-box-shadow-default')`                                         | The value set; add a palette to change which tokens have classes                                             |
| `$box-shadow-manual-values`  | `()`                                                                     | A map of extra tokens, such as `('inset': inset 0 2px 4px rgba(0, 0, 0, 0.1))`, which outputs `shadow-inset` |
| `$utilities-use-important`   | `false`                                                                  | Appends `!important` to every utility rule                                                                   |
| `$theme-utility-breakpoints` | `mobile-lg`, `tablet` and `desktop` on                                   | Which responsive prefixes exist                                                                              |

Pass settings in the `with (...)` clause of the first `@use '@pathableai/styles'`
in your build, for example:

```scss
@use '@pathableai/styles' with (
  $box-shadow-settings: (
    hover: false,
  )
  ;
);
```

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

A shadow is drawn outside the box and takes no space. It is clipped by an
ancestor that has `overflow` set to anything other than `visible`.

## The consumer owns

- Whether a shadow is enough. A shadow at 10% opacity is faint, and forced
  colours mode removes it, so a boundary that a person needs to find has a
  border as well.
- Space around the element, so the shadow is not cut off by a neighbour or by
  an ancestor's overflow.
- Contrast of any content: a shadow adds no contrast between an element and
  the surface behind it.
- Keeping the number of levels small. Use one level for one kind of surface,
  across the application.
