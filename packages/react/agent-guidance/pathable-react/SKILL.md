---
name: pathable-react
description: Build or revise React interfaces that use @pathableai/react, including component selection, accessibility, theming, styling, and React Server Component boundaries.
---

# PathAble React

Use `@pathableai/react` as the first choice for PathAble application UI. Prefer
an existing component or composition primitive over recreating its markup with
raw HTML and `usa-*` or `pathable-*` classes.

## Work from the installed contract

- Import only from the public `@pathableai/react` entry point. Do not import
  private `src/*` or `dist/*` paths.
- Inspect the installed package's public declaration entry when exact exports
  or props matter. Use the package [README](../../README.md) for examples and
  detailed prop documentation.
- Do not infer an exhaustive component catalog from this guide. The installed
  declarations are the version-aligned source of truth.
- If documentation and runtime types disagree, follow the installed runtime
  and types, then report the documentation drift.

## Choose components by intent

- Structure pages with layout and composition components such as `Stack`,
  `Inline`, `Cluster`, `Container`, `Surface`, `Page`, `SplitLayout`,
  `SidebarLayout`, `CardGrid`, and `AppShell`.
- Build forms from `Form`, `FormGroup`, `FormStack`, `Fieldset`,
  `OptionalFormSection`, `Label`, `Hint`, `ErrorMessage`, and the supplied
  control wrappers.
- Use `Form` for short, linear forms and `FormStack` for wider multi-field or
  multi-section forms. Both render `<form>` by default, so do not nest them;
  use `FormStack as="div"` when an existing form owns submission.
- Use communication and feedback components such as `Alert`, `Banner`,
  `Modal`, `Toast`, `Loading`, `EmptyState`, `PageError`, `Skeleton`,
  `SiteAlert`, `StepIndicator`, `SummaryBox`, `ProcessList`, and `Accordion`.
- Use dedicated navigation components such as `Header`, `Breadcrumb`,
  `Pagination`, `Sidenav`, and `Skipnav` when they match the interaction.
- Use `SegmentedControl` only for two to five short choices, not for navigation
  or a large option set.

## Preserve accessibility

- Give every interactive control an accessible name.
- Compose one `Input`, `Select`, `Textarea`, or `Range` directly with `Label`,
  `Hint`, and `ErrorMessage` inside `FormGroup` to receive stable IDs and
  associations automatically. Explicit non-empty IDs and ARIA attributes are
  preserved. A non-empty `aria-labelledby` opts out of automatic Label wiring;
  an explicit `aria-describedby`, including an empty string, opts out of
  automatic description wiring.
- Wire standalone controls, custom wrappers, and composite controls explicitly
  with labels and `aria-describedby`. Keep `aria-invalid`, validation state,
  and announcement timing consumer-owned.
- Use `Fieldset` for related controls that need a shared group name;
  `FormGroup` does not create group semantics and does not auto-wire multiple
  direct controls, including a supported control mixed with a native control or
  a PathAble composite such as `Checkbox`, `Radio`, `ComboBox`, `DatePicker`, or
  `DateRangePicker`.
- Use `OptionalFormSection` to disclose optional fields while retaining their
  values and normal form submission. Supply a heading level that fits the page,
  place `FormGroup` or `Fieldset` inside its body, and keep hidden-field
  validation recovery application-owned. Use `Accordion` for non-form content.
- Preserve native element semantics, visible focus indicators, keyboard
  behavior, and non-color cues.
- Give informative images meaningful alternative text and decorative images
  `alt=""`.

## Route to focused guidance

- For React Server Components, state, callbacks, portals, or USWDS browser
  JavaScript, read [server and client boundaries](references/server-and-client.md).
- For stylesheet imports, theme tokens, semantic props, or custom classes, read
  [styling and theming](references/styling-and-theming.md).
