# Semantic Markup Contract

## Required Structure

```html
<div class="pathable-optional-form-section">
  <h3 class="pathable-optional-form-section__heading">
    <button
      class="pathable-optional-form-section__button"
      id="generated-button-id"
      type="button"
      aria-expanded="false"
      aria-controls="generated-content-id"
    >
      <span>Additional contact details</span>
      <span
        class="pathable-optional-form-section__indicator"
        aria-hidden="true"
      ></span>
    </button>
  </h3>

  <div
    class="pathable-optional-form-section__content"
    id="generated-content-id"
    role="region"
    aria-labelledby="generated-button-id"
    hidden
  >
    <div class="pathable-form-group">
      <label class="pathable-label" for="preferred-name">
        Preferred name
      </label>
      <input
        class="pathable-input"
        id="preferred-name"
        name="preferredName"
      />
    </div>
  </div>
</div>
```

`h3` is illustrative. The consumer-required `headingLevel` selects exactly one
of `h2`, `h3`, `h4`, `h5`, or `h6`.

## Semantics

- The root is a neutral `div` with no implicit or assigned landmark role.
- The heading text is a non-empty string rendered as the native button's visible
  accessible name.
- The heading contains a native `button type="button"`; neither the heading nor
  a non-button descendant receives click or keyboard emulation.
- The button's `aria-expanded` is `true` exactly when content is expanded.
- `aria-controls` references the content ID. The content is a named region whose
  `aria-labelledby` references the button ID.
- Generated relationship IDs are opaque, hydration-stable, and collision-free.
- Collapsed content remains in the DOM and carries `hidden`; expanded content
  remains in the same DOM position without `hidden`.
- The markup does not use `details`, `summary`, `pathable-accordion`,
  `usa-accordion`, or `usa-accordion__*` enhancement selectors.

## Class Ownership

- New shared composition contract: `pathable-optional-form-section`,
  `pathable-optional-form-section__heading`,
  `pathable-optional-form-section__button`,
  `pathable-optional-form-section__indicator`, and
  `pathable-optional-form-section__content`.
- The shared contract owns layout, heading/button presentation, disclosure
  indicator, content spacing, wrapping, focus visibility, and forced-colors
  behavior.
- Existing nested controls continue using their own PathAble classes; this
  component does not restyle descendants by control type.
- React renders the shared classes without wrapper-only style rules.
- No transition or animation property is part of this contract.

## Keyboard and Focus Contract

- Tab and Shift+Tab include the disclosure button in normal document order.
- Enter and Space activate it through native button behavior.
- Toggling keeps focus on the button and preserves a visible focus indicator.
- When collapsed, descendants of the hidden content do not participate in
  sequential keyboard navigation.
- When expanded, descendants resume their native document order after the
  disclosure button.
- No arrow-key, Home, End, or roving-tabindex behavior is introduced.

## Form Contract

- The disclosure button cannot submit its ancestor form because it has
  `type="button"`.
- Nested controls keep their original `name`, value, form owner, fieldset,
  legend, label, description, and validation semantics.
- `hidden` does not make an otherwise successful control unsuccessful; collapsed
  successful controls remain part of form submission.
- The section never applies `disabled` to nested controls or conditionally
  removes them.
- Validation, automatic error reveal, and focus movement to invalid fields are
  application-owned.

## Resilience Contract

- Long/localized headings wrap without clipping text, indicators, or focus.
- Narrow containers and increased text do not cause horizontal page scrolling.
- Expanded long content remains in normal document flow.
- State and focus remain discernible in forced-colors mode.
- State changes are immediate and do not animate.
