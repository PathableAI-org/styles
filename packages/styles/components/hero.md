---
name: Hero
slug: hero
kind: static
summary: A full-width photographic banner with a dark callout panel that holds a heading, a short message and usually one call to action.
styles-class: pathable-hero
variants: []
guarantees:
  - id: background
    status: unverified
    claim: The hero paints the package's stock hero photograph as a centred background that covers its whole box, and sets its text colour to white.
  - id: callout-panel
    status: unverified
    claim: 'The callout has a #001e33 background and 2rem padding on every side, fills its container below a 40em viewport and, from 40em, has a 20rem max-width on its content box (the package leaves it content-box), so with its padding the panel is at most 24rem wide.'
  - id: heading-type
    status: unverified
    claim: 'The heading is bold Fredoka at 1.12rem with a line height of 1.2, coloured #4899e8, and has no margin of its own when it is the only child.'
  - id: heading-spacing
    status: unverified
    claim: A heading that follows another element gets a 1.5em top margin, and the element after a heading gets a 1em top margin.
  - id: callout-contrast
    status: unverified
    claim: Inside the callout, inherited body text has a contrast of at least 4.5:1 and the heading at least 4.5:1 against the callout background.
  - id: focus-ring-reset
    status: unverified
    claim: The callout resets the surface focus-ring property to its initial value, so a control inside it uses the default focus ring even when the hero sits in a surface that sets a dark ring.
---

# Hero

A full-width photographic banner with a dark callout panel that holds a
heading, a short message and usually one call to action. Put the class on a
`<section>`. It is not interactive: the class adds no role and no landmark name,
and it styles no link or button inside it.

## When to use

- The first band of a landing or marketing page, where one message and one
  action introduce the page.

Use something else when:

- the band needs a dark background but no photograph: use `pathable-section`
  with `pathable-section--dark`, or `pathable-surface--inverse`;
- the page is a working screen with a title and actions: use
  `pathable-dashboard-header`;
- the content is a lead paragraph under an ordinary heading: use
  `pathable-intro`.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

```html
<section class="pathable-hero" aria-labelledby="hero-heading">
  <div class="pathable-grid-container pathable-padding-y-4">
    <div class="pathable-hero__callout">
      <h1 class="pathable-hero__heading" id="hero-heading">
        Find work that fits
      </h1>
      <p>Plan your next step with a team that knows the local job market.</p>
      <a class="pathable-button" href="/start">Get started</a>
    </div>
  </div>
</section>
```

## Variants

The hero has no modifier classes. Change the photograph by setting
`background-image` on the hero yourself.

## Tokens

The callout declares `--pathable-surface-focus-ring` as `initial`, so controls
inside it fall back to the default focus ring colour. Nothing else in the hero
reads a theme token: the photograph, the white text, the #001e33 callout
background, the #4899e8 heading colour, the fonts, sizes and spacing are fixed
values, and a theme does not change them.

## Composition

- `pathable-hero` is the banner. It sets the body font at 0.99rem with a line
  height of 1.6, white text and the background photograph. It adds no padding
  and no height of its own: its height is its content's.
- Put a `pathable-grid-container` inside to centre the callout in the page
  width, and add vertical padding to it (for example `pathable-padding-y-4`),
  or the callout touches the top and bottom of the photograph.
- `pathable-hero__callout` is the dark panel that keeps text readable over the
  photograph. Put the heading, the message and the action inside it. From
  40em it is at most 24rem wide: 20rem of content plus its 2rem padding on
  each side, because the package leaves it content-box. An application that
  sets `box-sizing: border-box` on it gets a 20rem panel with 16rem of content.
- `pathable-hero__heading` is the panel's heading. Use a real heading element
  at the right level for the page, usually `<h1>`.
- Paragraphs and other content in the callout inherit the white text; the
  hero gives them no other styling.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source and no test checks it yet.

The contrast guarantee covers the callout only. Text placed on the photograph
outside the callout has no contrast guarantee.

## The consumer owns

- Links and buttons in the callout. The hero does not style them. Use
  `pathable-button` for the call to action. A plain link keeps the browser's
  default link colour, which is far below 3:1 on the dark callout; give it
  `pathable-text-white` or use a button.
- Accessibility: a landmark name for the section (`aria-labelledby` on the
  heading), the heading level, and keeping text inside the callout.
- The photograph. The stock image is a placeholder; set `background-image` to
  your own, and treat it as decorative.
- Vertical padding and the page-width container around the callout.
