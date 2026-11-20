---
name: Legend
slug: legend
kind: static
summary: The visible name of a group of form controls, styled to match a field label.
styles-class: pathable-legend
variants: []
guarantees:
  - id: block
    status: unverified
    claim: The legend is display block, so the controls of its group start on the line below it.
  - id: type
    status: unverified
    claim: The legend text is 0.99rem (15.84 px at a 16 px root), font weight 400 and line-height 1.4, in Nunito.
  - id: matches-label
    status: unverified
    claim: The legend class sets the same font size, weight, line-height, top margin and maximum width as `pathable-label`.
  - id: top-margin
    status: unverified
    claim: The class sets a 1.5rem (24 px at a 16 px root) top margin and no bottom margin.
  - id: max-width
    status: unverified
    claim: Except as a direct child of `pathable-filterable-option-list`, the legend's content box is at most 30rem (480 px at a 16 px root) wide, and text longer than that wraps at its spaces.
  - id: text-colour
    status: met
    claim: 'In the default theme, where no container sets a text colour of its own or gives the legend a coloured background to inherit from, the legend text is #00365c, PathAble Blue, the brand text colour; inside such a container, such as a dark surface or an alert, it takes the colour it inherits there.'
---

# Legend

The visible name of a group of form controls, styled to match a field label.
Put the class on a `<legend>` element as the first child of a `<fieldset>`
with `pathable-fieldset`. It is not interactive and adds no role; the
`<fieldset>` and `<legend>` elements give the group its name.

## When to use

- The question or name of a set of radios or checkboxes, such as "Employment
  goal".
- The name of a group of related fields that only make sense together, such as
  the parts of an address.

Use something else when:

- the name belongs to one control: use a `<label>` with `pathable-label`;
- the text explains how to answer: use `pathable-hint` after the legend;
- the text is a heading for a section of the page rather than a group of
  controls: use a heading element.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<fieldset class="pathable-fieldset">
  <legend class="pathable-legend">Employment goal</legend>
  <label class="pathable-radio">
    <input
      class="pathable-radio__input"
      type="radio"
      name="employment-goal"
      value="job-search"
    />
    <span class="pathable-radio__label">Job search skills</span>
  </label>
  <label class="pathable-radio">
    <input
      class="pathable-radio__input"
      type="radio"
      name="employment-goal"
      value="training"
    />
    <span class="pathable-radio__label">Skills training</span>
  </label>
</fieldset>
```

## Variants

The legend has no modifier classes. There is no larger legend for a question
that is the page's main heading.

## Tokens

`--pathable-color-text` sets the legend's text colour, so a theme that
overrides it recolours the legend. The font family, size, line-height and
margin are fixed values in the compiled stylesheet, not custom properties, so
a theme does not change them.

## Composition

- Put the legend as the first child of a `<fieldset>`. Only a legend in that
  position names the group; anywhere else it is plain text.
- Use `pathable-fieldset` on the fieldset. It removes the browser's border and
  padding, so the legend's box lines up with the controls under it. The legend
  class does not reset the browser's small inline padding on `<legend>`, so
  the legend text can sit a few pixels in from a label's.
- Browsers lay out a fieldset's first legend in a special way, and the
  legend's top margin may add no space above the group. Do not rely on it:
  space the fieldset from what comes before it with the layout.
- Follow the legend with an optional `pathable-hint`, then the controls, then
  an optional `pathable-error-message`.
- Inside `pathable-filterable-option-list`, a legend that is a direct child of
  that list is no wider than the list and breaks long words to fit.
- The legend has no element classes.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The legend sets its text colour to the brand text colour,
`var(--pathable-color-text)`, at zero specificity, so a colour utility such as
`pathable-text-white` on the legend itself wins. Inside a coloured container
the legend takes the colour it inherits from that container, as it did before
it had a default: `pathable-surface--inverse`, `pathable-surface--brand`,
`pathable-surface--tone-primary`, `pathable-section--dark`, `pathable-hero`,
`pathable-dark-background`, `pathable-alert`, `pathable-bg-accent`,
`pathable-bg-danger`, `pathable-bg-link`, `pathable-bg-primary`,
`pathable-bg-success`, and the `pathable-text-accent`, `-base`, `-link`,
`-muted`, `-primary` and `-white` utilities. A container that sets a
background but no text colour, such as `pathable-bg-primary` on its own,
leaves the legend in the browser's default black there; add a text colour
utility to that container.

The maximum width applies to the legend's content box: the legend is
content-box, so the browser's small inline padding on `<legend>` adds to it.

The pixel figures assume a 16 px root font size. The legend scales with the
root size, because every length is in `rem`.

## The consumer owns

- The structure: a real `<fieldset>` with the `<legend>` as its first child.
  Styling another element with `pathable-legend` does not group the controls
  for assistive technology.
- Legend text that makes sense when a screen reader reads it before each
  control's own label.
- Keeping the legend short; put explanations in a `pathable-hint`.
- Layout around the group and spacing between groups.
