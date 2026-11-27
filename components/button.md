---
name: Button
slug: button
kind: static
summary: A control that starts an action, such as saving a form or moving to the next step, drawn as a filled or outlined button in one of several colours.
styles-class: pathable-button
variants:
  - axis: style
    default: default
    values:
      [default, secondary, accent-cool, accent-warm, base, outline, unstyled]
  - axis: size
    default: default
    values: [default, big]
  - axis: surface
    default: default
    values: [default, inverse]
guarantees:
  - id: box
    claim: A button is an inline flex box with its label centred, 0.75rem of padding above and below and 1.25rem left and right, 0.25rem rounded corners, no border, bold (700) Nunito text at 1rem (the sm size) with a line height of 1, a 0.5rem margin on its right and no margin elsewhere.
  - id: width
    claim: Below a viewport width of 30em (480 px at a 16 px root font size) a button fills the width of its container, and from 30em it is as wide as its content, unless a width class such as width-auto sets another width, which then wins at every viewport width.
  - id: touch-target
    claim: At a viewport width of 39.99em or narrower, and on a device with a coarse pointer at any width, a button is at least 2.75rem (44 px at a 16 px root font size) high.
  - id: default-colour
    claim: The default button has the primary action fill and text colours, and darkens to #002845 under the pointer and to #001e33 while pressed, with white text.
  - id: colours
    claim: Secondary uses the secondary action fill and text colours, accent-cool a Bright Blue Brooks fill with the on-accent text colour, accent-warm a Lived-In Lime fill with PathAble Blue text, and base the page background fill with the body text colour.
  - id: outline
    claim: An outline button has a transparent background, so the surface behind it shows through, a 2 px border drawn inside its edge and text in the body text colour, and the border and text darken on hover and while pressed.
  - id: inverse
    claim: The inverse modifier, used with the outline modifier, changes the border and text to #eef0f4 so the button is drawn on a dark surface.
  - id: big
    claim: A big button has 1rem of padding above and below, 1.5rem left and right and text at 1.5rem (the lg size).
  - id: unstyled
    claim: An unstyled button has no padding, border, margin or fill, and its text is underlined, left aligned, not bold and in the link colour.
  - id: disabled
    claim: A button with the disabled attribute or aria-disabled="true" has a #c9c9c9 fill, shows a not-allowed cursor and does not change on hover or while pressed, and a disabled outline button keeps a transparent background with a grey #c9c9c9 border and grey text.
  - id: focus-ring
    claim: A focused enabled button has a 2 px solid outline in the focus ring colour of the surface it sits on, 0.25rem (4 px at a 16 px root font size) outside the button.
  - id: link
    claim: A link with the button class looks the same as a button, with no underline, and its text stays the button's text colour after the link has been visited.
  - id: icon-gap
    claim: An icon inside a button sits 0.5rem from the label, and the pair stays centred.
  - id: icon-no-shrink
    claim: A pathable-icon inside a button keeps its 1em size however long the label is.
---

# Button

A control that starts an action, such as saving a form or moving to the next
step, drawn as a filled or outlined button in one of several colours. Put
`pathable-button` on a `<button>` or on an `<a>` that looks like one, and add
the modifiers below for colour and size. The class adds no role, no
accessible name and no behaviour of its own.

## When to use

- A single action the person takes on the current page: "Save plan", "Submit
  intake", "Schedule appointment".
- A link that goes to another page but is the main action there, drawn as a
  button.
- A primary action and, beside it, a quieter one: the default button and an
  outline button.

Use something else when:

- the action is a plain link inside a sentence or a list: use a link;
- a set of related buttons needs a shared row that stacks on a phone: put them in
  a `pathable-button-group`;
- the control chooses between values or toggles a setting: use a form control
  such as a checkbox or radio.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: default -->

## Variants

The modifiers are independent of each other, apart from the ones noted below.
Use `pathable-button` on every button and add at most one modifier from the
style axis.

| Axis    | Value         | Class                          | What it is for                                                        |
| ------- | ------------- | ------------------------------ | --------------------------------------------------------------------- |
| style   | `default`     | none                           | The main action on a page.                                            |
| style   | `secondary`   | `pathable-button--secondary`   | A supporting action in the secondary colour.                          |
| style   | `accent-cool` | `pathable-button--accent-cool` | A tertiary action in Bright Blue Brooks.                              |
| style   | `accent-warm` | `pathable-button--accent-warm` | An attention-drawing action in Lived-In Lime.                         |
| style   | `base`        | `pathable-button--base`        | A neutral action on the page background colour.                       |
| style   | `outline`     | `pathable-button--outline`     | A quieter action beside a filled one, such as "Cancel".               |
| style   | `unstyled`    | `pathable-button--unstyled`    | An action that reads as a link but must be a button.                  |
| size    | `default`     | none                           | The standard size.                                                    |
| size    | `big`         | `pathable-button--big`         | A larger button for a lone call to action.                            |
| surface | `default`     | none                           | A button on a light surface.                                          |
| surface | `inverse`     | `pathable-button--inverse`     | An outline button on a dark surface, with `pathable-button--outline`. |

## States

<!-- examples -->

## Composition

| What                    | Value                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| Default fill and text   | PathAble Blue, #00365c, with white, #ffffff, text                                            |
| Secondary fill and text | Intelligent Jade, #1cae96, with #001a33 text                                                 |
| Accent-cool fill, text  | Bright Blue Brooks, #4899e8, with #001a33 text                                               |
| Accent-warm fill, text  | Lived-In Lime, #d3ff66, with PathAble Blue, #00365c, text                                    |
| Base fill and text      | Shilling Silver, #dde2e8, with PathAble Blue, #00365c, text                                  |
| Outline text and border | PathAble Blue, #00365c                                                                       |
| Unstyled text           | Tech Teal, #015a76                                                                           |
| Focus ring              | Bright Blue Brooks, #4899e8, or the surface's focus ring colour on a `pathable-bg-*` surface |

The colour names and hex values are on [tokens-color.md](tokens-color.md). The
pixel figures on this page assume a 16 px root font size.

- Put the class on a `<button>` for an action, and on an `<a href>` only when
  the control goes to another page. A link has no `type`, no `disabled` and no
  Space-key activation of its own: Enter follows the link and Space scrolls the
  page. Keyboard behaviour that a browser gives a `<button>` is not part of
  this component.
- Put the label in the element. An icon goes after the label in a
  `pathable-icon` `<svg>`, hidden from assistive technology; the button puts
  0.5rem between them and centres the pair.
- The touch-target height and the width classes are set on `pathable-button`.
- Each button has a 0.5rem margin on its right. Two buttons side by side are
  0.5rem apart with no other markup; the last button in a row leaves 0.5rem
  beyond it. Use a `pathable-button-group` to lay several buttons out, so the
  row stacks on a phone and wraps when it runs out of room.
- Set the width with a width class, such as `width-full` or
  `width-auto`. It beats the full-width rule that applies below 30em.
- An inverse outline button needs a dark surface behind it, such as
  `bg-primary`; its colours are chosen for that backing.
- Where a button starts slow work, the application shows progress.

## Guarantees

The guarantees are the list in the front matter at the top of this page.

## The consumer owns

- The element and the label. Choose `<button>` for an action and `<a>` for a
  destination, and write a label that says what happens: "Submit intake", not
  "Submit".
- The type. Give every button that does not submit a form `type="button"`; a
  button with no type inside a form submits it.
- Unique accessible names. When a label repeats in a list, add context in a
  `pathable-sr-only` span, such as `View<span class="pathable-sr-only">
Intake assessment</span>`. Do not replace the visible label with `aria-label`.
- Disabling. `disabled` removes a button from the tab order, and
  `aria-disabled="true"` keeps it focusable but only changes how it looks: the
  application has to stop the action itself.
- Icons. Hide an icon next to a label with `aria-hidden="true"` and
  `focusable="false"`. A button that has only an icon needs an accessible name.
- Colour is not the only cue. An action that deletes or cannot be undone needs
  words that say so.
- The dark surface behind an inverse button, and a focus ring that shows on it.
