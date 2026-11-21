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
      [
        default,
        primary,
        secondary,
        accent-cool,
        accent-warm,
        base,
        outline,
        unstyled,
      ]
  - axis: intent
    default: default
    values: [default, save, continue, review, low-emphasis, destructive]
  - axis: size
    default: default
    values: [default, big]
  - axis: surface
    default: default
    values: [default, inverse]
  - axis: placement
    default: default
    values: [default, back, submit]
guarantees:
  - id: box
    status: unverified
    claim: A button is an inline flex box with its label centred, 0.75rem of padding above and below and 1.25rem left and right, 0.25rem rounded corners, no border, bold (700) Nunito text at 0.99rem with a line height of 1, a 0.5rem margin on its right and no margin elsewhere.
  - id: width
    status: unverified
    claim: Below a viewport width of 30em (480 px at a 16 px root font size) a button fills the width of its container, and from 30em it is as wide as its content, unless a width class such as pathable-width-auto sets another width, which then wins at every viewport width.
  - id: touch-target
    status: unverified
    claim: At a viewport width of 39.99em or narrower, and on a device with a coarse pointer at any width, a button is at least 2.75rem (44 px at a 16 px root font size) high.
  - id: default-colour
    status: unverified
    claim: The default button has the primary action fill and text colours, and darkens to #002845 under the pointer and to #001e33 while pressed, with white text.
  - id: colours
    status: unverified
    claim: Secondary uses the secondary action fill and text colours, accent-cool a Bright Blue Brooks fill with the on-accent text colour, accent-warm a Lived-In Lime fill with PathAble Blue text, and base the page background fill with the body text colour.
  - id: outline
    status: unverified
    claim: An outline button has a transparent background, so the surface behind it shows through, a 2 px border drawn inside its edge and text in the body text colour, and the border and text darken on hover and while pressed.
  - id: inverse
    status: unverified
    claim: The inverse modifier changes the border and text to #eef0f4 only on a button that also has the outline modifier, so it is drawn on a dark surface, and on a button without the outline modifier it has no effect.
  - id: big
    status: unverified
    claim: A big button has 1rem of padding above and below, 1.5rem left and right and text at 1.49rem.
  - id: unstyled
    status: unverified
    claim: An unstyled button has no padding, border, margin or fill, and its text is underlined, left aligned, not bold and in the link colour.
  - id: destructive
    status: unverified
    claim: A destructive button has the danger colour as its fill and white text, with the same padding and shape as the default button.
  - id: intent-aliases
    status: unverified
    claim: Save looks like secondary, continue like the default button, review like accent-cool and low-emphasis like base, because each is the same rule under another name.
  - id: disabled
    status: unverified
    claim: A button with the disabled attribute or aria-disabled="true" has a #c9c9c9 fill, shows a not-allowed cursor and does not change on hover or while pressed, and a disabled outline button keeps a transparent background with a grey #c9c9c9 border and grey text.
  - id: focus-ring
    status: unverified
    claim: A focused enabled button has a 2 px solid outline in the focus ring colour of the surface it sits on, 0.25rem (4 px at a 16 px root font size) outside the button.
  - id: link
    status: unverified
    claim: A link with the button class looks the same as a button, with no underline, and its text stays the button's text colour after the link has been visited.
  - id: icon-gap
    status: unverified
    claim: An icon inside a button sits 0.5rem from the label, and the pair stays centred.
  - id: icon-no-shrink
    status: unmet
    claim: A pathable-icon inside a button keeps its 1em size however long the label is; the stylesheet does not stop the icon shrinking yet.
---

# Button

A control that starts an action, such as saving a form or moving to the next
step, drawn as a filled or outlined button in one of several colours. Put
`pathable-button` on a `<button>` or on an `<a>` that looks like one, and add
the modifiers below for colour, size and intent. The class adds no role, no
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
- the control is only an icon: use `pathable-icon-button`;
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
style and intent axes.

| axis      | value          | class                           | what it is for                                                                     |
| --------- | -------------- | ------------------------------- | ---------------------------------------------------------------------------------- |
| style     | `default`      | none                            | The main action on a page. Same look as `primary`.                                 |
| style     | `primary`      | `pathable-button--primary`      | The main action, written out. Use when a component sets the class from a prop.     |
| style     | `secondary`    | `pathable-button--secondary`    | A supporting action in the secondary colour.                                       |
| style     | `accent-cool`  | `pathable-button--accent-cool`  | A tertiary action in Bright Blue Brooks.                                           |
| style     | `accent-warm`  | `pathable-button--accent-warm`  | An attention-drawing action in Lived-In Lime.                                      |
| style     | `base`         | `pathable-button--base`         | A neutral action on the page background colour.                                    |
| style     | `outline`      | `pathable-button--outline`      | A quieter action beside a filled one, such as "Cancel".                            |
| style     | `unstyled`     | `pathable-button--unstyled`     | An action that reads as a link but must be a button.                               |
| intent    | `default`      | none                            | No workflow meaning of its own.                                                    |
| intent    | `save`         | `pathable-button--save`         | Saves work without leaving the page. Looks like `secondary`.                       |
| intent    | `continue`     | `pathable-button--continue`     | Moves to the next step. Looks like the default button.                             |
| intent    | `review`       | `pathable-button--review`       | Opens a review of the work. Looks like `accent-cool`.                              |
| intent    | `low-emphasis` | `pathable-button--low-emphasis` | An action that should not compete with the others. Looks like `base`.              |
| intent    | `destructive`  | `pathable-button--destructive`  | An action that deletes or cannot be undone, in the danger colour.                  |
| size      | `default`      | none                            | The standard size.                                                                 |
| size      | `big`          | `pathable-button--big`          | A larger button for a lone call to action.                                         |
| surface   | `default`      | none                            | A button on a light surface.                                                       |
| surface   | `inverse`      | `pathable-button--inverse`      | An outline button on a dark surface. It has an effect only with `--outline`.       |
| placement | `default`      | none                            | A button anywhere on the page.                                                     |
| placement | `back`         | `pathable-button--back`         | The back button in `pathable-wizard__actions`. It has no effect elsewhere.         |
| placement | `submit`       | `pathable-button--submit`       | The final submit button in `pathable-wizard__actions`. It has no effect elsewhere. |

The `back` and `submit` classes only mark a button's position inside the
actions region of a `pathable-wizard`. They add no colour or size, so outside
that region a button carrying either class looks the same as one without it.

Hover, pressed and focus looks come from the browser's real states. The
stylesheet has no class that forces a button into one of them.

## States

<!-- examples -->

## Tokens

| What                        | Token                                                               |
| --------------------------- | ------------------------------------------------------------------- |
| Default fill                | `--pathable-color-action-primary-bg`                                |
| Default text                | `--pathable-color-action-primary-text`                              |
| Secondary and save fill     | `--pathable-color-action-secondary-bg`                              |
| Secondary and save text     | `--pathable-color-action-secondary-text`                            |
| Accent-cool and review fill | `--pathable-brand-bright-blue-brooks`                               |
| Accent-cool and review text | `--pathable-color-on-accent`                                        |
| Accent-warm fill            | `--pathable-brand-lived-in-lime`                                    |
| Accent-warm text            | `--pathable-brand-pathable-blue`                                    |
| Base and low-emphasis fill  | `--pathable-color-bg`                                               |
| Base and low-emphasis text  | `--pathable-color-text`                                             |
| Outline text and border     | `--pathable-color-text`                                             |
| Destructive fill            | `--pathable-color-danger`                                           |
| Unstyled text               | `--pathable-color-link`                                             |
| Focus ring                  | `--pathable-surface-focus-ring`, else `--pathable-color-focus-ring` |

The accent-warm colours are fixed brand colours, so a theme does not change
them. The hover and pressed colours, the disabled colours, the padding, the
corner radius, the sizes and the inverse colours are fixed values in the
stylesheet, as is the destructive button's white text. The pixel figures on
this page are those of the default theme.

## Composition

- Put the class on a `<button>` for an action, and on an `<a href>` only when
  the control goes to another page. A link has no `type`, no `disabled` and no
  Space-key activation of its own: Enter follows the link and Space scrolls the
  page. Keyboard behaviour that a browser gives a `<button>` is not part of
  this component.
- Put the label in the element. An icon goes after the label in a
  `pathable-icon` `<svg>`, hidden from assistive technology; the button puts
  0.5rem between them and centres the pair.
- A destructive button takes `pathable-button` as well as
  `pathable-button--destructive`, like every other modifier. The touch-target
  height and the width classes are set on `pathable-button`.
- Each button has a 0.5rem margin on its right. Two buttons side by side are
  0.5rem apart with no other markup; the last button in a row leaves 0.5rem
  beyond it. Use a `pathable-button-group` to lay several buttons out, so the
  row stacks on a phone and wraps when it runs out of room.
- Set the width with a width class, such as `pathable-width-full` or
  `pathable-width-auto`. It beats the full-width rule that applies below 30em.
- An inverse outline button needs a dark surface behind it, such as
  `pathable-bg-primary`; its colours are chosen for that backing.
- Pressing a button moves nothing: the stylesheet adds no loading state and no
  spinner. Where a button starts slow work, the application shows progress.

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
is expected behaviour. One marked `status: unmet` is behaviour the component
does not have yet: do not rely on it. One marked `status: unverified` was read
from the package source, and no test checks it yet.

The `icon-no-shrink` guarantee is unmet. The stylesheet stops a USWDS icon
shrinking inside a button, but `pathable-icon` has no such rule, so in a narrow
button with a long label the icon can be squeezed below 1em.

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
  `focusable="false"`. A button that has only an icon needs a name; use
  `pathable-icon-button`.
- Colour is not the only cue. A destructive action needs words that say so.
- The dark surface behind an inverse button, and a focus ring that shows on it.
