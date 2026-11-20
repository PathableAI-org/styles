# @pathableai/styles

## 0.5.1

### Patch Changes

- b9ee8f7: `pathable-button--accent-warm` now renders as the accent-warm button: a Lived-In Lime fill with PathAble Blue text, as USWDS intends, instead of the filled primary button. The React `Button` `accent-warm` variant inherits the fix. USWDS hover, active and visited colors are unchanged.
- fed6fad: Focus on `pathable-button` and its filled modifiers now shows the brand focus outline, 2px of `--pathable-color-focus-ring` (Bright Blue Brooks), instead of the browser's default ring. It is the shared outline the form controls and icon button use: it also shows after a pointer click, like theirs, and uses the system `Highlight` colour under forced colors. `pathable-button--unstyled` keeps its USWDS 4px Bright Blue Brooks ring. The React `Button` inherits the fix.
- 6525a15: Fix `.pathable-button--outline` so that `pathable-button pathable-button--outline` renders as an outline button again: a transparent background, with a 2px inset border and text in the text color (`--pathable-color-text`). Before this fix the `.pathable-button` brand rule overrode the outline at equal specificity, so the outline modifier rendered as a filled primary button. The inverse outline (`pathable-button--outline pathable-button--inverse`) had the same primary fill at rest and is now transparent, as USWDS intends. Hover, active and disabled outline states are unchanged. No class is renamed or removed, and the React `Button` `outline` variant picks up the fix through the CSS.
- 9c99822: Fix `.pathable-button--unstyled` so that `pathable-button pathable-button--unstyled` renders as an unstyled button again: a transparent background with underlined link text in the link color (`--pathable-color-link`). Before this fix the `.pathable-button` brand rule overrode the unstyled modifier at equal specificity, so it rendered as a filled primary button with no padding. A disabled unstyled button (native `disabled` or `aria-disabled="true"`) also showed the filled disabled-button background on hover, on press and, with `aria-disabled`, on focus; it now stays transparent with the disabled text color, as in USWDS. Hover, active and inverse unstyled states are unchanged. No class is renamed or removed, and the React `Button` `unstyled` variant picks up the fix through the CSS.
- 1f474dd: Keyboard focus on the workflow card's action link (`.pathable-card--workflow .pathable-card__action`) and on a focusable app shell content region (`.pathable-app-shell__content`) now shows the brand focus indicator instead of the browser's default ring: a 2px solid `--pathable-color-focus-ring` outline (`Highlight` under forced colors), drawn inside the content region's edge. Both rules apply on `:focus-visible` only. No class or token changes.
- 6a60e25: A `.pathable-checkbox` root that wraps the input and its label, such as the `<label>` rendered by the React `Checkbox`, is now block-level, so the checkbox starts on its own line instead of continuing the line of an inline sibling such as a `.pathable-hint`. Its label's click target now spans the row. The class is unchanged, and a bare `<input class="pathable-checkbox">` keeps its inline layout.
- 5763cf9: Fix 25 declarations that referenced the undefined `--pathable-font-size-body-xs`
  and `--pathable-font-size-heading-xl` tokens, which the browser dropped so the
  text inherited its size.

  - Secondary and metadata text now uses `--pathable-font-size-caption-md`
    (12px): ActivityList row context, date and owner; DashboardHeader
    breadcrumb; FilterBar result count; KpiGrid card label; RecordHeader
    metadata; ResourceCard provider, metadata and source; ScheduleItem date
    time, context and meta.
  - Labels, controls and status text now use `--pathable-font-size-label-sm`
    (12px): ActivityList status text and compact row title; FilterBar sort
    select and clear action; FilterPill; KpiGrid trend and trend label;
    ScheduleItem date month and status; Table status cell text.
  - The DashboardHeader title and the KpiGrid card value now use
    `--pathable-font-size-display-lg` (32px). The existing overrides are
    unchanged: the DashboardHeader title is still 24px at viewports up to 640px,
    and the value of an unavailable KpiGrid card is still 24px.

  This text now renders at these sizes wherever it previously inherited a
  different size. No token or class is added, renamed or removed.

- f3a9c9d: Fix five declarations that referenced undefined tokens, which the browser dropped.

  - The gap between a SegmentedControl option's icon and label, the gap between
    app shell navigation items, and the gap between a bottom navigation item's
    icon and label referenced `--space-2` and rendered as 0. They now use `--space-4` (4px).
  - Workflow card status and meta text (`.pathable-card__status` and
    `.pathable-card__meta` inside `.pathable-card--workflow`) referenced
    `--usa-font-size-sm` and inherited the card's font size. They now use
    `--pathable-font-size-body-sm` (14px), so this text is visibly smaller.

  No token or class is added, renamed or removed.

- cb2f028: `.pathable-input`, `.pathable-select` and `.pathable-textarea` now show the brand focus outline (`--pathable-color-focus-ring`, Bright Blue Brooks) on focus, instead of the browser's default focus ring. On these fields the outline also shows on pointer focus, as the USWDS focus rule they were designed for does. Under `forced-colors: active` the outline uses the system `Highlight` colour. No classes were added, renamed or removed.
- c34d1c0: A `pathable-button` placed directly in a `.pathable-form-stack` now ends flush with the fields' right edge at every viewport width. Previously the USWDS button's `margin-right` (8 px) stayed once the button turned `width: auto` at the mobile-lg breakpoint, so the stack's stretched column ended the button 8 px short of the fields at tablet and desktop widths. Buttons outside a form stack, and buttons nested deeper inside one (for example in a button group), keep their margin, and a `pathable-margin-*` utility on the button still overrides the reset. No class or token changed; React `FormStack` inherits the fix.
- c5966be: Form groups in a `.pathable-form-stack` are now spaced by the stack gap alone. Direct `.pathable-form-group` children of a form stack no longer add their 24 px top margin, and a `.pathable-label` that is the first child of a `.pathable-form-group` no longer adds its own top margin, matching the USWDS reset for `.usa-label`. Forms that relied on the extra space can choose a larger gap with a `.pathable-stack--gap-*` modifier.
- 150241e: The `state-loading` interaction-state mixin (and the combined `interaction-states` mixin, used by `.is-loading`) now draws an icon-sized spinner (`1em`), vertically centred 8 px in from the control's inline end, inside the control's bounds, in the control's `currentColor`. The spinner overlays the control: it stays clear of the label when the control's inline-end padding is at least 8 px plus `1em`. Previously it drew a control-sized ellipse that spilled about 2 px past the right and bottom edges, in a border colour that can match the disabled background. The control's size is unchanged, and IconButton keeps its own centred, icon-sized spinner.
- fa4b336: `.pathable-interaction-states-demo` now sets `color: var(--pathable-color-text)`. Before this, a natively disabled `<button>` with the class took the browser's disabled text colour on top of the disabled opacity, so its label was much fainter than an `aria-disabled` one. Both now show the same text colour at the same reduced opacity. Text in every other state also changes to `--pathable-color-text`: on a `<button>` it was the browser's default button text colour, and on any other element with the class it was inherited from the parent. The interaction-state mixins themselves are unchanged. A control that includes them still sets its own `color`, as `.pathable-icon-button` and `.pathable-segmented-control` already do.
- 6bf6ba3: Place the Modal close button (`.pathable-modal__close`) in the dialog's top-right corner (top-left in right-to-left layouts), reserve room for it beside the heading, show its × in the text colour (`--pathable-color-text`) at icon size without the native button border, show a subtle `--pathable-color-bg` background on hover and press, and give it the brand focus ring (`--pathable-color-focus-ring`) on keyboard focus. No class is added, renamed or removed.
- 08c32a5: Give Modal content padding on every side. `.pathable-modal__content` now has `var(--pathable-space-4)` (`2rem`) padding on all sides, not only the top, so the heading, body text and footer buttons no longer touch the dialog's left and bottom edges. The content box uses `box-sizing: border-box` so the padding stays inside the dialog's width. No class is renamed or removed.
- 39ea147: Keep the open Modal inside the viewport and centred. `.pathable-modal-overlay` now uses border-box sizing, so it matches the viewport instead of overflowing it by its padding, and collapses the whitespace beside its centring `::before`, so a full-width dialog no longer wraps below the viewport on 320 px and 375 px screens and is centred within the overlay on desktop. The overlay also stops smooth-scrolling to focused controls. Place only the dialog inside the overlay: the overlay sets `font-size: 0` and the dialog sets its own font size. No classes were renamed or removed.
- f92c05d: Centre the retry button and navigation link in the full-page PageError (`.pathable-page-error--full-page`), so they line up with the centred icon, heading and body instead of sitting at the start edge. The compact panel keeps its start-aligned actions. No class is renamed or removed.
- 894685c: Workflow card status text (`.pathable-card__status` inside
  `.pathable-card--workflow`) now uses `--pathable-color-text-success`, the
  text-safe deep jade `#0d7a63` (5.3:1 on the white card surface), instead of
  `--pathable-color-accent`, Intelligent Jade `#1cae96` (2.8:1), which failed
  WCAG text contrast. The status text is visibly darker. A theme that overrides
  `accent` no longer recolours the status text; override `textSuccess`
  (`--pathable-color-text-success`) to change it.

  No token or class is added, renamed or removed.

## 0.5.0

### Minor Changes

- c5594e3: Render components in the exact PathAble brand palette.

  - The USWDS theme color families now use the exact brand hex values instead of the nearest USWDS system colors (for example, PathAble Blue is `#00365c`, not `#162e51`). Lighter and darker shades are derived from the brand colors. Buttons, alerts, form controls, tags and other USWDS-based components change color slightly.
  - Default text in USWDS-based components is PathAble Blue instead of near-black gray.
  - `--pathable-color-link` and the default link color are now Tech Teal (`#015a76`, 7.7:1 on white). The previous value, Bright Blue Brooks (`#4899e8`), was only 3.0:1 on white and failed WCAG AA for text.
  - `--pathable-color-focus-ring` and the USWDS focus outline are now Bright Blue Brooks (`#4899e8`, previously `#4497f5` and USWDS `#2491ff`): 3.0:1 on white and 4.2:1 on PathAble Blue.
  - The `.pathable-bg-*` and `.pathable-text-*` color utilities use the exact brand and semantic values.
  - USWDS warning and error colors now match the semantic warning (`#f5a623`) and danger (`#dc3545`) tokens.
  - `pathable-button--accent-cool` keeps its Bright Blue Brooks background, now set from `--pathable-brand-bright-blue-brooks`.
  - Components that use `--pathable-color-link` as an info color (info and progress toasts, the info icon tile and the no-data empty state icon) are now Tech Teal. Info alerts stay Bright Blue Brooks.
  - `pathable-button--accent-cool` keeps on-accent text when it is a visited link.
  - `@pathableai/react`: the default theme's `link` value is now `#015a76` and `focusRing` is `#4899e8`, matching the styles package.

## 0.4.0

### Minor Changes

- 47aaa40: Add a Styles-first OptionalFormSection disclosure and React wrapper for retaining
  optional field state and submission behavior in collapsible form sections.

## 0.3.0

### Minor Changes

- d82c526: Add the shared FilterableOptionList style contract and React component for accessible controlled or uncontrolled multi-selection with client or external filtering, native form values, and documented client-boundary usage.

## 0.2.0

### Minor Changes

- 1bcae8a: Modal open presentation now uses a styles-owned portal DOM shell: wrapper → overlay → dialog (instead of a bare dialog under `document.body`).

  **Migration**

  - If you queried `document.body > .pathable-modal` or similar direct-child selectors, update queries for the new wrapper/overlay/dialog tree.
  - If you added temporary consumer overlay CSS or custom overlay wrappers to force a backdrop, remove them after upgrading — the package now owns the dimmer. Leaving ad-hoc overlays in place can cause double backdrops / stacked dimmers.

## 0.1.0

### Minor Changes

- 7c0b34a: Add responsive form rows that align direct input, select, and textarea controls when field labels, hints, and errors have uneven content.
- 80e3074: Add a dedicated FormStack layout contract that expands supported controls to the available form width, preserves explicit control constraints, and documents Form versus FormStack usage.

## 0.0.4

### Patch Changes

- a9830f4: Emit default tokens with zero selector specificity so application-owned `:root` declarations win regardless of stylesheet order. Also clarify the packaged README's React and CSS-only guidance.
- ba07c56: Correct the published Sass and USWDS setup guidance, including the source namespace, compiler load paths, and font asset copying.

## 0.0.3

### Patch Changes

- 5841748: Make Activity List status labels visible and accessible, constrain row metadata,
  and add the typed React ActivityList wrapper.
- cd6d566: Publish the semantic Heading SCSS and typed React contracts with independent document and visual levels, tokenized level-1 weight, and verified accessibility behavior.
- aad62f4: Prevent icon tiles from shrinking below their configured size in constrained flex layouts.
- 647bcbd: Harden canonical SegmentedControl selection, focus, disabled, keyboard-reference, and constrained-layout behavior.
- 5c2505a: Consolidate all `--pathable-color-*` declarations into a single `:root` block,
  split the compiled stylesheet into `components.css`, `utilities.css`, and
  `theme-default.css`, and expose `./components`, `./utilities`, and `./theme`
  subpath exports so consumers can import component styles without also importing
  the default theme tokens.
- 7eab2bd: Add the documented IconButton loading modifier with a stable, contrast-preserving icon-sized spinner and disabled-state usage guidance.
- d755135: Add consumer-configurable AppShell landmarks, skip links, and an opt-in shared
  navigation mode that keeps all destinations available across breakpoints. Keep
  mobile navigation visible while main content scrolls, and add an accessible
  active-text token while preserving existing active-color overrides.
- c119150: Add Text typographic primitive with semantic variant (body, small, caption) and tone (default, muted, danger, success) props, plus new typography and color tokens in styles.
- c119150: Add Surface primitive with variant (default, subtle, primary), elevation, and border tone props coordinating foreground, background, border, and focus treatment, plus new token-driven SCSS modifiers.
- f8cee08: Added theming documentation: token vocabulary reference, consumer guide, and acceptance criteria verification (`docs/theming/`). Updated READMEs in both packages with cross-links to the new theming docs. Added Storybook end-to-end test asserting partial-theme color resolution via `ThemeProvider`.

## 0.0.3-alpha.4

### Patch Changes

- f8cee08: Added theming documentation: token vocabulary reference, consumer guide, and acceptance criteria verification (`docs/theming/`). Updated READMEs in both packages with cross-links to the new theming docs. Added Storybook end-to-end test asserting partial-theme color resolution via `ThemeProvider`.

## 0.0.3-alpha.3

### Patch Changes

- 7eab2bd: Add the documented IconButton loading modifier with a stable, contrast-preserving icon-sized spinner and disabled-state usage guidance.

## 0.0.3-alpha.2

### Patch Changes

- cd6d566: Publish the semantic Heading SCSS and typed React contracts with independent document and visual levels, tokenized level-1 weight, and verified accessibility behavior.
- aad62f4: Prevent icon tiles from shrinking below their configured size in constrained flex layouts.

## 0.0.3-alpha.1

### Patch Changes

- 647bcbd: Harden canonical SegmentedControl selection, focus, disabled, keyboard-reference, and constrained-layout behavior.

## 0.0.3-alpha.0

### Patch Changes

- 5841748: Make Activity List status labels visible and accessible, constrain row metadata,
  and add the typed React ActivityList wrapper.

## 0.0.2

### Patch Changes

- b0b2fe0: Fix Next.js App Router consumption by using the consumer's React runtime,
  retaining automatic styles, and packaging every compiled CSS asset.

## 0.0.1

### Patch Changes

- 2df9552: Align the basic Header markup and mobile navigation styles with the patched
  USWDS runtime, including the overlay and background scroll lock.
- fix: Release workflow with changesets
