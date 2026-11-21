---
name: Outline
slug: utilities-outline
kind: utility
summary: Utility classes that draw a solid outline of a set width and colour around an element without changing its size.
uswds: https://designsystem.digital.gov/utilities/outline/
classes:
  - outline-<width>
  - outline-<token>
guarantees:
  - id: width-tokens
    claim: outline-0 sets outline to 0 solid, outline-1px to 1px solid, outline-2px to 2px solid and outline-05 to 0.25rem solid.
  - id: no-other-widths
    claim: The stylesheet has no outline-1, outline-105, outline-2, outline-205 or outline-3 rule, and no class for outline-offset.
  - id: color-classes
    claim: 'outline-primary sets outline-color to #00365c, outline-accent-cool to #4899e8, outline-secondary-dark to #0d7a63, outline-white to white and outline-transparent to transparent, and none of them sets a width or a style.'
  - id: color-tokens-match-color-page
    claim: Every theme and state colour token that has a bg-<token> class has an outline-<token> class with the same colour value, and outline-red-50v does not exist.
  - id: no-variants
    claim: 'The stylesheet has no mobile-lg:, tablet:, desktop:, hover:, focus:, active: or visited: variant of any outline class.'
---

# Outline

Utility classes that draw a solid outline of a set width and colour around an
element without changing its size. `outline-2px` draws a 2px outline in the
element's text colour and `outline-accent-cool` sets its colour to Bright Blue
Brooks. An outline sits outside the border box, takes no space and does not
move the content around it. The classes have no prefix and need no JavaScript.

## When to use

- Mark a region for attention without moving the layout, such as the row of
  a table that a person just edited.
- Draw a static outline on an element that already has its own border, when a
  second ring is needed.

Use something else when:

- the element needs a border that is part of its box: use
  [Border](utilities-border.md);
- the outline is the focus indicator of a control: do not use these classes.
  They are always on and have no `focus:` variant. Controls draw their focus
  ring in the component stylesheet, in Bright Blue Brooks (`#4899e8`), and a
  consumer keeps it;
- a shadow gives the depth you want: use [Shadow](utilities-shadow.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: widths -->

## Classes

| Class pattern     | Property        | Values                                                      |
| ----------------- | --------------- | ----------------------------------------------------------- |
| `outline-<width>` | `outline`       | Width token followed by `solid`                             |
| `outline-<token>` | `outline-color` | A colour token, such as `primary`, `accent-cool` or `white` |

A width class sets the width and `solid` together; a colour class sets only
`outline-color`. With no colour class the outline takes the element's text
colour. Put both on one element for a visible outline in a chosen colour.

### Width tokens

| Token | Width           |
| ----- | --------------- |
| `0`   | `0`             |
| `1px` | `1px`           |
| `2px` | `2px`           |
| `05`  | `0.25rem` (4px) |

There is no `outline-1`, `outline-2` or `outline-3`, and no class for
`outline-offset`.

### Colour tokens

The colour classes use the same tokens and values as
[Color](utilities-color.md): the theme tokens (`outline-primary`,
`outline-accent-cool`, `outline-base-dark`), the state tokens
(`outline-error`, `outline-success-dark`), `outline-black`, `outline-white`,
`outline-transparent`, and the basic and grayscale colours. The USWDS system
palette (`outline-red-50v`, `outline-gray-cool-30`) is not output by default;
see
[System palette classes not output by default](utilities-color.md#system-palette-classes-not-output-by-default).

The values these classes take are defined by the design tokens: [Spacing units](tokens-spacing-units.md) and [Color tokens](tokens-color.md).

## Variants

| Prefix                                    | Output     |
| ----------------------------------------- | ---------- |
| `mobile-lg:`, `tablet:`, `desktop:`       | Not output |
| `hover:`, `focus:`, `active:`, `visited:` | Not output |

`$outline-settings` and `$outline-color-settings` have `responsive: false` and
every state `false`. Set a key to `true` to output that prefix for the module.

## Sass

`u-outline()` sets the outline width and colour from its arguments. It sets
`outline-width` and `outline-style: solid` for a width and `outline-color` for
a colour token, and takes both in one call. `u-outline-color()` sets only the
colour.

```scss
@use '@pathableai/styles' as *;

.support-plan-row--updated {
  @include u-outline(2px, 'accent-cool');
}

.support-plan-row--archived {
  @include u-outline-color('base-dark');
  outline-offset: 2px;
}
```

Quote half values (`'05'`) so they stay strings. Add `!important` as the last
argument to output `!important`. Offset is not a utility; set `outline-offset`
in your own rule.

## Settings

| Setting                                                  | PathAble default                                         | What it does                                                                                 |
| -------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `$output-these-utilities`                                | `default` (every module)                                 | A list of module names to output; the modules of this page are `outline` and `outline-color` |
| `$outline-settings`, `$outline-color-settings`           | `output: true`, `responsive: false`, every state `false` | Which prefixes each module outputs                                                           |
| `$outline-palettes`                                      | `('palette-outline-default')`                            | The width tokens                                                                             |
| `$outline-color-palettes`                                | `('palette-outline-color-default')`                      | The colour tokens of the module, added to those of `$global-color-palettes`                  |
| `$global-color-palettes`                                 | `('palette-color-default')`                              | The colour palettes shared by the colour modules; see [Color](utilities-color.md#settings)   |
| `$outline-manual-values`, `$outline-color-manual-values` | `()`                                                     | A map of extra tokens                                                                        |
| `$utilities-use-important`                               | `false`                                                  | Appends `!important` to every utility rule                                                   |

Pass settings in the `with (...)` clause of the first `@use '@pathableai/styles'`
in your build, for example:

```scss
@use '@pathableai/styles' with (
  $outline-settings: (
    hover: true,
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

The classes never move the layout: an outline is drawn outside the border box
and is not part of the element's size. It can be clipped by an ancestor that
has `overflow` set, and it overlaps its neighbours when they sit closer than
the outline's width.

## The consumer owns

- Focus indicators. A control keeps its component focus ring; do not remove it
  and do not rely on `outline-<token>` for focus, because the classes cannot
  respond to focus.
- Space around the element. An outline does not push neighbours away, so leave
  at least the outline's width of margin where outlined elements are adjacent.
- Contrast. An outline that marks a state a person needs to see has to reach
  3:1 against the surface behind it; `outline-accent-cool` (`#4899e8`) on white
  is 3.00:1 and on `base-light` it is lower.
- Meaning that does not rely on outline colour alone: add text or an icon.
