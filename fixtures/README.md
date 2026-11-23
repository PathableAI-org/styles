# HTML fixtures

Canonical HTML for each static `@pathableai/styles` component, one file per
state. A fixture is the reference markup a consuming application copies, so it
shows classes, structure and ARIA exactly as a well-built client application
should write them. The same fixture bytes provide the copyable snippet and
rendered example in the human product documentation, the HTML example in the
version-matched styles consumer agent guidance, and the input to the HTML,
accessibility and compiled-CSS contract checks. Do not maintain a second copy
for either documentation audience.

The retained `@pathableai/react` components are also held to fixtures by React
fixture tests, and the existing generator may require a mechanical React
example update even though React is not a current refactor target. A converted
component page takes its examples from the fixtures; see
[`components/README.md`](../components/README.md).

How the checks run, locally and in CI, is in
[docs/testing/fixtures.md](../docs/testing/fixtures.md).

A folder that the React fixture manifest maps to a component, such as
`button` if it were mapped to `Button` (no folder is mapped yet), needs a React
example for every fixture in it: adding `button/<state>.html` means adding
`packages/react/src/components/Button/examples/<state>.tsx` and its
comparison, or a "not offered in React" entry with a reason. Run
`pnpm --filter @pathableai/react test:fixtures` as well as the checks below.
See [React fixture tests](../docs/testing/fixtures.md#react-fixture-tests).

## Layout

```text
fixtures/
  .htmlvalidate.json      html-validate configuration
  folders.json            the committed list of component folders
  harness/                the checks (the only non-component folder)
  <component-slug>/       one folder per component page
    <state>.html          one fixture per state
```

- A component folder's name is the slug of a page in
  [`components/`](../components/), such as
  `button` for `button.md`. `harness/` is the only other folder
  allowed. The same holds for the other kinds of page: `utilities-<uswds slug>`
  for a utility page (`utilities-margin-and-padding`) and `tokens-<uswds path>`
  for a token page (`tokens-spacing-units`), which show unprefixed USWDS
  classes such as `margin-x-2` or `bg-primary` rather than `pathable-*`
  classes. The contract check reads only `pathable-*` classes and only the
  variants of a component page, so a utility or token folder owes no modifier
  fixtures; the component-page check still requires every class in its
  examples to be in the compiled CSS. On Storybook each fixture is a story
  under **Fixtures**; the page itself is under **Utilities** or
  **Design tokens**.
- Every component folder is listed in [`folders.json`](folders.json), and
  every listed folder exists. The contract check compares the two both ways,
  so a folder cannot disappear unnoticed: removing one means editing the list
  in the same pull request.
- Every non-default variant in the page's front matter has at least one
  fixture that uses its modifier class.
- A component folder holds only `<state>.html` files: no subfolders and no
  other files, which the checks would otherwise skip. The contract check
  fails anything else.
- Name a file after the state it shows, in kebab case: `flat.html`,
  `compact.html`, `no-actions.html`. The contract check requires
  `^[a-z][a-z0-9]*(-[a-z0-9]+)*\.html$`: lower-case letters and digits,
  starting with a letter, with single hyphens between words.

## Writing a fixture

- An HTML fragment, not a document: no `<html>`, `<head>` or `<body>`. The
  harness injects it into a `<main>` on a page that loads `styles.css`.
- Optionally start with one `<!-- description: … -->` comment: a sentence or
  two saying what the state shows. The component page prints it above the
  state's example; it is not part of the markup shown. Nothing else comes
  before the markup.
- Formatted by Prettier (`pnpm format`).
- Only markup the component page describes, plus what the page says the
  consumer owns. No demo-only wrappers, layout boxes or headings that are
  there only to frame the example.
- No `html-validate-*` directive comments. The check rejects them; fix the
  markup, or ask a person if a rule seems wrong.
- No `style` attributes. Where the page asks the consumer to adjust something,
  use a documented class, such as `pathable-margin-0`.
- Literal IDs, unique within the fixture and prefixed with the folder and
  state where they could clash, such as `activity-grouped-today`. No generated
  or placeholder IDs.
- Realistic text: names, dates and titles a real application would show, not
  "Lorem ipsum" or "Item 1".
- Prefer native elements to ARIA roles. html-validate's `prefer-native-element`
  and `no-redundant-role` rules enforce this, so a list is a `<ul>` with `<li>`
  items, not a `<div role="list">`. The one allowed redundant role is
  `role="list"` on a `<ul>`; see ARIA rule 2.

## ARIA rules

Fixtures model what a client application should write, so ARIA in them is held
to these rules:

1. **Every `aria-*` attribute and `role` traces to a source**: a consumer
   responsibility in the component page ("The consumer owns" or Composition),
   or a standard WAI-ARIA or WCAG requirement. No redundant or speculative
   ARIA: no role that repeats an element's native semantics (except the
   `role="list"` in rule 2), and no `aria-label` that replaces visible text.
2. **Lists that hold rows are lists with a name.** Use `<ul role="list">` and
   `<li>`. The `role="list"` repeats the `<ul>` element's native role on
   purpose: WebKit (Safari with VoiceOver) exposes a `<ul>` whose items draw
   no list marker as a plain group, and rows such as `pathable-activity-row`
   are flex boxes with no marker, so the explicit role keeps the list and its
   item count announced. The `<li>` keeps its native `listitem` role with no
   attribute. Give each list an accessible name:
   - a standalone list gets `aria-label` with meaningful text, such as
     `aria-label="Recent activity"`;
   - a list under a visible heading gets `aria-labelledby` pointing at that
     heading's `id`;
   - an outer container that only groups headings and nested lists takes no
     role.
3. **Decorative marks are hidden; their meaning is in text.** A status mark
   is `aria-hidden="true"`, and the visible status text is always present.
   Colour or shape is never the only cue.
4. **Repeated actions have unique accessible names.** Every fixture uses one
   pattern: the visible label, followed by hidden context in a
   `pathable-sr-only` span that names the row, with the space inside the span:

   ```html
   <button type="button" class="pathable-button pathable-button--outline">
     View<span class="pathable-sr-only"> Intake assessment</span>
   </button>
   ```

   The accessible name, "View Intake assessment", begins with the visible text,
   as WCAG 2.5.3 (Label in Name) requires, and tells "View" in one row from
   "View" in the next. This is the pattern
   the `pathable-sr-only` class exists for. Do not
   use `aria-describedby` for this: a description does not make the name
   unique. Do not use `aria-label` on these buttons.

5. **Buttons have `type="button"`** unless they submit a form.
6. **Every `aria-labelledby` and `aria-describedby` reference resolves** to an
   element in the same fixture.
7. **Nothing focusable is inside `aria-hidden`.**
8. **Live regions and other state ARIA only when the page asks.** An empty
   state is plain text unless the component page says otherwise. Announcing
   that a list became empty, for example with `role="status"`, is a client
   decision that depends on how the content changes, so no fixture models it.

## The checks

Each check takes a list of component folders and defaults to all of them.
Run them from `fixtures/` or with `pnpm --filter @pathableai/fixtures`. The
contract and axe checks need the built stylesheet:
`pnpm --filter @pathableai/styles build`.

| Script                       | What it checks                                                                                                                                                                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:html`            | html-validate with the `html-validate:recommended` and `html-validate:a11y` presets ([`harness/html.mjs`](harness/html.mjs))                                                                                                                                                                 |
| `pnpm check:contract`        | `folders.json` matches the folders on disk, each folder is a page slug, file names are kebab-case states, every `pathable-*` class is a class selector in `dist/styles.css`, and every non-default variant has a fixture using its modifier ([`harness/contract.mjs`](harness/contract.mjs)) |
| `pnpm check:axe`             | axe in Chromium, with `styles.css` loaded, at a desktop and a phone viewport; writes `.cache/axe-report.json` ([`harness/axe.mjs`](harness/axe.mjs))                                                                                                                                         |
| `pnpm check`                 | All three                                                                                                                                                                                                                                                                                    |
| `pnpm changed [base]`        | Prints the folders `git diff <base>...HEAD -- fixtures/` touched ([`harness/changed.mjs`](harness/changed.mjs)); default base `origin/main`, `--all` for every folder                                                                                                                        |
| `pnpm affected --base <ref>` | Prints, as JSON, the folders a compiled-CSS change affects and why ([`harness/affected.mjs`](harness/affected.mjs)); see [Choosing folders](../docs/testing/fixtures.md#choosing-folders)                                                                                                    |
| `pnpm select [base]`         | Prints the union of `changed`, `affected` and the folders whose component page changed ([`harness/select.mjs`](harness/select.mjs)); what CI checks on a pull request                                                                                                                        |
| `pnpm test`                  | Unit tests of the harness, and integration tests that run each check on markup that must fail (`node --test`; needs the styles build)                                                                                                                                                        |

### html-validate configuration

[`.htmlvalidate.json`](.htmlvalidate.json) extends both presets, turns no rule
off, turns one on and narrows two:

- `no-missing-references` is not in either preset. It fails an
  `aria-labelledby`, `aria-describedby` or other ID reference that names no
  element in the fixture, which ARIA rule 6 requires and axe does not catch.
- `no-redundant-role` excludes the `list` role only, so `<ul role="list">`
  passes while every other redundant role, `<li role="listitem">` included,
  still fails. The reason is WebKit's handling of lists without markers
  (ARIA rule 2). A maintainer chose this in pull request #593.
- `void-style` is set to `selfclose`, so `<input />` and `<img />` pass and the
  bare `<input>` fails. Prettier writes void elements self-closed, with no
  option to omit the slash, and lint-staged and `pnpm lint` enforce Prettier on
  `fixtures/**/*.html`, so the two tools now agree. A maintainer chose this in
  pull request #607.

html-validate is pinned to 11.4.0, the newest release whose `engines` covers
the repository's Node range (`^24.0.0 || >=26.0.0`); from 11.5.0 it needs
Node 24.8 or later. Raise it only together with the repository's Node minimum.

The harness loads this file explicitly, so a missing or moved configuration
fails the check instead of validating with no rules, and it rejects inline
`html-validate-*` directive comments, which would turn rules off inside one
fixture (`fixtures-no-directives`).

`no-inline-style` stays on. Rules that only make sense for a whole document,
such as `missing-doctype` or the initial heading rank, do not fire on these
fragments today, so none is turned off. If one ever has to be, turn off only a
rule that applies to whole documents, and add it here with the reason.

### axe configuration

Any violation fails, and so does any **incomplete** result: a rule axe ran
but could not decide, such as colour contrast over a gradient, which needs a
person to look. There is no exceptions mechanism and no allowlist. Each
violation and incomplete result is printed with its nodes, and in GitHub
Actions it is also listed in the job summary. Only these page-level
rules are off, because a fixture is a fragment of a page, not a page:

| Rule                   | Why it is off for a fragment                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `region`               | Asks that all content sit in a landmark; the page around the component owns its landmarks.           |
| `landmark-one-main`    | Asks that the page have one `<main>`; that is the application page's job, not the component's.       |
| `page-has-heading-one` | Asks that the page have an `<h1>`; a component fragment does not carry the page's top-level heading. |

Each fixture runs at 1280 px and 375 px wide, so parts shown only at one
width, such as the activity row's trailing actions on narrow screens, are
checked.

The same run adds one check of its own, reported in the JSON report as
`fixtures-unique-control-name`: it reads the fixture's accessibility tree
(Chromium's computed accessible names, through the DevTools protocol) and fails when two buttons or two links share an
accessible name, which holds ARIA rule 4. axe has no rule for it.

## What the checks do not catch

- **An `aria-label` that only repeats or replaces visible text** (rule 1), or
  ARIA a page does not call for. Review it.
- **A list without a name.** Neither tool requires a list to have an
  accessible name, so rule 2 is held by review; a dangling `aria-labelledby`
  is caught by `no-missing-references`.
- **Actions whose names are unique but do not start with the visible text**
  (WCAG 2.5.3). axe's rule for this is experimental and does not run, so
  review names against rule 4.
