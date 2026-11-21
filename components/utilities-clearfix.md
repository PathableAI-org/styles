---
name: Clearfix
slug: utilities-clearfix
kind: utility
summary: A utility class that makes a container grow to contain its floated children.
uswds: https://designsystem.digital.gov/utilities/clearfix/
classes:
  - clearfix
guarantees:
  - id: after
    status: unverified
    claim: clearfix adds an ::after pseudo-element with empty content, display block and clear both.
  - id: contains-floats
    status: unverified
    claim: A clearfix element whose only children are float-left and float-right blocks has a height of at least the taller of the two.
  - id: element-unchanged
    status: unverified
    claim: clearfix sets no property on the element itself, only on its ::after pseudo-element.
  - id: not-responsive
    status: unverified
    claim: The stylesheet contains no tablet:clearfix class and no hover:clearfix class.
---

# Clearfix

A utility class that makes a container grow to contain its floated children.
The class name is `clearfix`, unprefixed, and the matching Sass mixin is also
`clearfix`, with no `u-` prefix.

## When to use

- A container whose children use [`float-left`](utilities-float.md) or
  `float-right`, so the container would otherwise collapse to zero height and
  the next block would ride up beside the floats.

Use something else when:

- the container can be a flex row instead: use `display-flex` from the
  [display](utilities-display.md) and [flex](utilities-flex.md) utilities,
  which contain their children without clearing.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: contain-floats -->

## Classes

| Class pattern | Property                                                | Values                         |
| ------------- | ------------------------------------------------------- | ------------------------------ |
| `clearfix`    | `::after { content: ''; display: block; clear: both; }` | none; the class takes no value |

## Variants

- **Responsive.** None. `clearfix` is output without `mobile-lg:`, `tablet:` or
  `desktop:` variants.
- **State.** None. No `hover:`, `focus:`, `active:` or `visited:` variants.

## Sass

`clearfix` is a mixin without the `u-` prefix. It writes the `::after` rule for
you, so include it at the top level of the selector:

```scss
@use '@pathableai/styles' as *;

.plan-header {
  @include clearfix;
}
```

## Settings

The matching USWDS module is `clearfix`. PathAble does not override it, so
USWDS defaults apply:

| Setting                    | Default                             | Effect                                                            |
| -------------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `$output-these-utilities`  | `default` (every module)            | A list such as `('float', 'clearfix')` outputs only those modules |
| `$clearfix-settings`       | `output: true`, `responsive: false` | Set `output: false` to omit the class                             |
| `$utilities-use-important` | `false`                             | `true` outputs every utility with `!important`                    |

The module also takes `active`, `focus`, `hover` and `visited` keys, all
`false` here:

```scss
@use '@pathableai/styles' with (
  $clearfix-settings: (
    output: false,
  )
);
```

## States

Each state is complete markup for one use of the utility. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour that was read from the package source and that no test
checks yet (`status: unverified`).

## The consumer owns

- Putting the class on the parent of the floats, not on a float.
- Using the class only where floats are used; a container with no floated
  children needs nothing.
- Avoiding another `::after` rule on the same element, which would replace the
  clearing one.
