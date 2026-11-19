/**
 * The pixel visual-regression story entries for the styles Storybook, kept
 * apart from test-pixels.mjs so other scripts can read them without running
 * the suite (scripts/check-component-pages.mjs reads `covers`).
 */

/**
 * Story entries: each canonical story with baselines and its
 * renderer-independent `<component>/<state>` key (the baseline directory, not
 * derived from the story ID, so a React capture of the same state can share
 * it). One image per viewport; which stories get an entry is in the docs.
 *
 * An entry may list `covers`: the component page guarantees its images are
 * the test for, as `<page>/<guarantee-id>` (packages/styles/components/). The
 * suite itself ignores the field; pnpm check:component-pages reads it.
 */
export const STORIES = [
  {
    id: 'interaction-controls-iconbutton--all-variants',
    key: 'icon-button/all-variants',
  },
  {
    id: 'interaction-controls-icon-tile--all-variants',
    key: 'icon-tile/all-variants',
    covers: [
      'icon-tile/fixed-size',
      'icon-tile/shape',
      'icon-tile/status-colour',
    ],
  },
  // The aggregate: rest with the focus ring, selected, natively disabled and
  // aria-disabled side by side, so the two disabled forms are compared.
  {
    id: 'interaction-controls-interaction-states--all-states',
    key: 'interaction-states/all-states',
  },
  // State precedence shows rules `all-states` does not: the loading spinner's
  // size and placement inside the control, and selected styling under
  // disabled.
  {
    id: 'interaction-controls-interaction-states--state-precedence',
    key: 'interaction-states/state-precedence',
  },
  // OptionalFormSection has no aggregate story. Collapsed (`default`) shows
  // the button, its focus outline and the down indicator at every viewport.
  {
    id: 'components-form-controls-optional-form-section--default',
    key: 'optional-form-section/default',
  },
  // Expanded has rules of its own: the button's square bottom corners, the
  // rotated indicator and the content region's border and padding.
  {
    id: 'components-form-controls-optional-form-section--expanded',
    key: 'optional-form-section/expanded',
  },
  // Content pressure: a wrapping heading shows the button's gap, the
  // indicator's `flex: 0 0 auto` and `overflow-wrap`, which a one-line heading
  // does not exercise; its play function asserts only the absence of overflow.
  {
    id: 'components-form-controls-optional-form-section--narrow',
    key: 'optional-form-section/narrow',
  },
  // Button has no aggregate story yet. Outline guards the outline modifier
  // against the cascade regression in #287, beside the primary button.
  {
    id: 'components-button--outline',
    key: 'button/outline',
  },
  // Unstyled guards the unstyled modifier against the same cascade regression
  // (#304): link text with no fill or padding beside the primary button, and
  // the disabled unstyled text. The mobile image shows the touch-target
  // min-height the wrapper adds below 40em or on a coarse pointer.
  {
    id: 'components-button--unstyled',
    key: 'button/unstyled',
  },
  // Accent warm guards the accent-warm modifier against the same cascade
  // regression (#303), beside the primary button. Its colors do not change
  // with the viewport, and the outline images already show the narrow-screen
  // button rules, so one desktop image is enough.
  {
    id: 'components-button--accent-warm',
    key: 'button/accent-warm',
  },
  // SegmentedControl has no aggregate story. Single select shows the option
  // icon-to-label gap, the selected option and the container padding; the gap
  // does not change with the viewport, so one desktop image is enough.
  {
    id: 'interaction-controls-segmentedcontrol--single-select',
    key: 'segmented-control/single-select',
  },
  // The app shell has no aggregate story: the desktop shell shows the sidebar
  // and the gap between navigation items, and the mobile shell shows the
  // mobile layout with the bottom navigation and its icon-to-label gap.
  {
    id: 'application-shell-desktop-shell--default',
    key: 'app-shell/desktop',
  },
  // The capture's Tab focuses the story's focusable content region, so the
  // image also shows its inset brand focus ring (#312).
  {
    id: 'application-shell-mobile-shell--default',
    key: 'app-shell/mobile',
  },
  // The shared-navigation modifier has mobile rules the default shell does not
  // use: the sidebar navigation moved into the bottom grid row with its top
  // border and padding, and the destination row that overflows and scrolls
  // horizontally, with nowrap items of at least 44 px. The play function
  // leaves the content region scrolled to its end, so the heading and the
  // first rows are out of view; the capture's Tab focuses the skip link
  // (`.pathable-skipnav`), which covers the top bar title. Not compared: the
  // modifier's nav-item focus outline offset, and the safe-area insets, which
  // are zero in the pinned browser.
  {
    id: 'application-shell-mobile-shell--shared-navigation',
    key: 'app-shell/mobile-shared-navigation',
  },
  // The workflow card's status text has rules of its own (colour, weight and
  // font size) that no other Card story shows; its meta text, also shown by
  // `workflow-card`, is captured here alongside it. The
  // capture's Tab focuses the action link, so the image shows its brand focus
  // ring inside the card's focus-within outline (#312), and the status text in
  // the text-safe deep jade (#314).
  {
    id: 'components-card--workflow-card-with-status',
    key: 'card/workflow-with-status',
  },
  // Integration toolbar: stroke-only (fill="none") icons on the bare, subtle
  // and bordered icon-button surfaces, which the filled icons of IconButton
  // `all-variants` do not show. The play function asserts the shapes stay
  // unfilled (#278); this image adds what an assertion cannot name: stroke
  // weight, line caps, and icon size and position in each surface. The
  // full-composition story has no baseline yet: it waited on its segmented
  // control's missing gap, which #277 fixes.
  {
    id: 'interaction-controls-integration--toolbar-panel',
    key: 'integration/toolbar-panel',
  },
  // Icon aggregate: twelve filled icons from the USWDS icon set (#310). The
  // SVGs carry no width, height or fill attributes, so the image shows the
  // class's own rules: the 1em box sized to 24 px by font-size and the
  // currentColor fill in the text token colour, plus the artwork's shapes and
  // their alignment above the labels as the row wraps. The play function
  // asserts the size and fill. Not shown: the meaningful and decorative
  // stories, which differ only in ARIA.
  {
    id: 'components-layout-icon--all-icons',
    key: 'icon/all-icons',
  },
  // Input, Select and Textarea have no aggregate story. Each KeyboardFocus
  // story renders one labelled field as the only control, so the capture's Tab
  // shows its brand focus ring (#282) beside its label. Desktop only: the
  // focus rule has no viewport dependency, and the controls' mobile
  // min-height rule is outside that fix.
  {
    id: 'components-form-controls-input--keyboard-focus',
    key: 'input/keyboard-focus',
  },
  {
    id: 'components-form-controls-select--keyboard-focus',
    key: 'select/keyboard-focus',
  },
  {
    id: 'components-form-controls-textarea--keyboard-focus',
    key: 'textarea/keyboard-focus',
  },
  // FormRow aggregate: control alignment under uneven hints, side by side at
  // desktop and stacked below 1024 px, with the first control (a select)
  // showing its focus ring.
  {
    id: 'components-form-controls-form-row--default',
    key: 'form-row/default',
  },
  // FormStack has no aggregate story. Default shows the stack gap between
  // form groups and a trailing action, the first-label reset, the full-width
  // input, select and textarea and the trailing button ending flush with the
  // fields at every viewport.
  {
    id: 'components-form-controls-form-stack--default',
    key: 'form-stack/default',
  },
  // A form row inside the stack at desktop: the stack's full-width control
  // rule applied inside the row's columns, and how the row's own zeroed group
  // margins sit next to a following stack-level group. Default renders no row,
  // so neither combination appears in its images.
  {
    id: 'components-form-controls-form-stack--with-form-row',
    key: 'form-stack/with-form-row',
  },
  // Checkbox has no aggregate story. With hint and error shows the root's
  // block layout (the control on its own line between the hint and the error
  // message, #281), the unchecked box, its label and its focus ring at every
  // viewport.
  {
    id: 'components-form-controls-checkbox--with-hint-and-error',
    key: 'checkbox/with-hint-and-error',
  },
  // The disabled box and label colours, which no other baseline shows. The
  // checked box is compared through FilterableOptionList `selected`.
  {
    id: 'components-form-controls-checkbox--disabled',
    key: 'checkbox/disabled',
  },
  // Radio has no aggregate story. With hint and error shows the root's block
  // layout (each control on its own line, between the hint and the error
  // message, #329), the unchecked radios, their labels and the first radio's
  // focus ring at every viewport.
  // Not compared: the checked radio's dot, the disabled radio and label
  // colours and the `__label-description` text, because no styles story
  // renders a checked or disabled `.pathable-radio__input` or a description;
  // covering them needs such a story first.
  {
    id: 'components-form-controls-radio--with-hint-and-error',
    key: 'radio/with-hint-and-error',
  },
  // FilterableOptionList main story: the filter input (focused), the bounded
  // option region and the status line.
  {
    id: 'components-form-controls-filterable-option-list--default',
    key: 'filterable-option-list/default',
  },
  // The only canonical story with checked checkboxes outside forced colors.
  {
    id: 'components-form-controls-filterable-option-list--selected',
    key: 'filterable-option-list/selected',
  },
  // The `__empty` message rule, which no other baseline shows.
  {
    id: 'components-form-controls-filterable-option-list--empty',
    key: 'filterable-option-list/empty',
  },
  // Modal has no aggregate story. `open` shows the overlay, the centred
  // dialog, the content padding on every side, the close button in its
  // top-right corner and the outline Cancel button beside the primary action;
  // the close button is the first control, so the capture's Tab shows its
  // focus ring.
  { id: 'components-communication-modal--open', key: 'modal/open' },
  // Narrow (mobile) is the only state where the overlay's padding, not the
  // dialog's max-width, sets the dialog width; it must still fit the viewport
  // (#286). Its image also shows the stacked footer buttons touching with no
  // gap, accepted by the maintainer for #286.
  {
    id: 'components-communication-modal--narrow',
    key: 'modal/narrow',
  },
  // Long content: a dialog taller than the viewport sits at the top of the
  // scrolling overlay (padding plus dialog margin) instead of centring.
  {
    id: 'components-communication-modal--long-content',
    key: 'modal/long-content',
  },
  // PageError has no aggregate story; `full-page` is its only canonical story.
  // It shows the centred column (icon, heading, body and actions on one centre
  // line, #288), the large heading and icon sizes, the borderless transparent
  // panel and the retry button under keyboard focus with the brand focus ring
  // (#302).
  // Not compared: the compact panel's border, surface, radius and
  // start-aligned actions, the not-found and access-restricted icon colours,
  // and the max-width 480px rules.
  {
    id: 'components-feedback-pageerror--full-page',
    key: 'page-error/full-page',
  },
  // Toast has no aggregate story and `stacked` is its only canonical story:
  // info, success and warning, dismissible and plain padding, the reversed
  // stack order and the dismiss button's focus outline. Not shown: the error
  // and progress variants, `--has-action` with its action link, and the
  // max-width 480px rules; covering them needs an aggregate story first.
  { id: 'components-feedback-toast--stacked', key: 'toast/stacked' },
]
