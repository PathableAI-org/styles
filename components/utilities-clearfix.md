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
    claim: clearfix adds an ::after pseudo-element with empty content, display block and clear both.
  - id: contains-floats
    claim: A clearfix element whose only children are float-left and float-right blocks has a height of at least the taller of the two.
  - id: element-unchanged
    claim: clearfix sets no property on the element itself, only on its ::after pseudo-element.
  - id: not-responsive
    claim: The stylesheet contains no tablet:clearfix class and no hover:clearfix class.
---

# Clearfix

A utility class that makes a container grow to contain its floated children.
The class name is `clearfix`, unprefixed.

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

## States

Each state is complete markup for one use of the utility. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states the CSS a class compiles to at PathAble defaults.

## The consumer owns

- Putting the class on the parent of the floats, not on a float.
- Using the class only where floats are used; a container with no floated
  children needs nothing.
- Avoiding another `::after` rule on the same element, which would replace the
  clearing one.
