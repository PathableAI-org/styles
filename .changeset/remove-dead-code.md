---
'@pathableai/styles': minor
---

**Breaking change**: Removes everything that has no component page. The package
now ships only the static components that have a component page, the tokens and
the utilities, and `dist/styles.css` is about 29% smaller. Every class a
component page names renders as before.

Removed:

- **JavaScript.** The `./js` (`dist/pathable.js`) and `./js/init`
  (`dist/pathable-init.js`) entry points and `src/js/`.
- **Components without a page.** The `.pathable-*` classes of accordion,
  activity list, app shell (and its layout and bottom navigation), banner, bento
  grid, card grid, character count, checklist, chip rail, cluster, combo box,
  container, content, dashboard header, date picker, date range picker,
  decorative background, display, embed container, empty state, file input,
  filter bar, filter pill, filterable option list, form row, form stack, graphic
  list, grid, header, heading, hero, icon button, icon tile, identifier, in-page
  navigation, inline, input mask, interaction states, KPI grid, language
  selector, layout docs, layout grid, loading, media block, modal, nav, optional
  form section, page error, range, record header, resource card, save status,
  schedule item, screenshot frame, section, segmented control, sidebar layout,
  site title, skeleton, skipnav, split, sticky panel, surface, text, text
  highlight, time picker, toast, tooltip, validation, wayfinder, wizard, wizard
  actions and workflow panel. Their Sass partials in
  `src/pathable-component-wrappers/`, and the bundle partials
  (`pathable-communication`, `pathable-dashboard`, `pathable-discovery`,
  `pathable-form-controls`, `pathable-interaction-controls`, `pathable-layout`,
  `pathable-layout-composition`, `pathable-marketing-patterns`,
  `pathable-navigation`, `pathable-structured-workflow` and
  `pathable-typography`), are removed too.
- **Undocumented modifiers and elements of kept components.**
  - Button: `pathable-button--primary`, `--continue`, `--destructive`, `--save`,
    `--review`, `--low-emphasis`, `--back` and `--submit`.
  - Card: `pathable-card--media`, and `pathable-card--workflow` with its
    `__action`, `__meta` and `__status` elements.
  - Table: `pathable-table--sortable`, `--selected`, `--has-actions`,
    `--loading`, `--empty` and `--scrollable`, and the `__cell--status`,
    `__cell-status-text`, `__row-actions` and `__empty-message` elements.
  - Step indicator: `pathable-step-indicator__step`, `__step--complete`,
    `__step--completed`, `__step--current`, `__step-label`,
    `__segment--completed`, `__segment-count`, `__body` and `__body-text`, and
    `ol.pathable-step-indicator` as the root.
- **Custom properties.** Every `--usa-*` alias of a `--pathable-*` typography or
  utility token, and the undocumented component properties:
  `--pathable-button-*`, `--pathable-alert-*`, `--pathable-card-*`,
  `--pathable-form-max-width`, `--pathable-input-padding-*`,
  `--pathable-table-cell-padding-*`, `--pathable-tag-padding-*`,
  `--pathable-footer-padding-*`, `--pathable-text-highlight-*`, and the wizard,
  workflow panel, save status, decorative background, screenshot frame, bento
  and chip rail properties, with their `--usa-*` twins.
- **Images** that no remaining rule uses: `img/loader.svg`, `img/file*.svg`,
  `img/usa-icons/add.svg`, `calendar_today.svg`, `close.svg`, `expand_less.svg`,
  `navigate_before.svg`, `navigate_far_before.svg`, `navigate_far_next.svg` and
  `remove.svg`, and `img/usa-icons-bg/check--blue-60v.svg`. The icons stay in
  `img/sprite.svg`.

**Migration**:

- Use the classes on the component pages in `components/index.md`.
- Replace `var(--usa-*)` with the `--pathable-*` name it aliased.
- Give markup that relied on a removed class its own styles, or use a component
  that has a page.
- Remove imports of `@pathableai/styles/js` and `@pathableai/styles/js/init`.
- These `@pathableai/react` components are built on removed classes and render
  without their CSS: Accordion, ActivityList, AppShell, Banner, CardGrid,
  Cluster, ComboBox, Container, DashboardHeader, DatePicker, DateRangePicker,
  EmptyState, FilterableOptionList, FormStack, Header, Heading, IconButton,
  IconTile, Inline, Loading, MediaBlock, Modal, OptionalFormSection, Page,
  PageError, Range, SegmentedControl, SidebarLayout, Skeleton, Skipnav,
  SplitLayout, Stack, Surface, Text and Toast.
- `Button` with the `destructive`, `save`, `continue`, `review` or
  `low-emphasis` variant now looks like the default button, `Card` loses its
  `workflow` variant, and `StepIndicator` no longer styles completed steps.
- The Header's mobile menu no longer has its JavaScript.
