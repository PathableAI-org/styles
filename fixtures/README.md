# HTML fixtures

Canonical HTML for each static `@pathableai/styles` component, one file per
state. A fixture is the reference markup a consuming application copies, so it
shows classes, structure and ARIA exactly as a well-built client application
should write them. The fixtures are checked on their own here; later work will
render the styles Storybook stories from them and hold the
`@pathableai/react` output to them.

How the checks run, locally and in CI, is in
[docs/testing/fixtures.md](../docs/testing/fixtures.md).

## Layout

```text
fixtures/
  .htmlvalidate.json      html-validate configuration
  harness/                the checks (the only non-component folder)
  <component-slug>/       one folder per component page
    <state>.html          one fixture per state
```

- A component folder's name is the slug of a page in
  [`packages/styles/components/`](../packages/styles/components/), such as
  `activity-list` for `activity-list.md`. `harness/` is the only other folder
  allowed.
- Every non-default variant in the page's front matter has at least one
  fixture that uses its modifier class.
- Name a file after the state it shows, in kebab case: `flat.html`,
  `compact.html`, `empty.html`.

## Writing a fixture

- An HTML fragment, not a document: no `<html>`, `<head>` or `<body>`. The
  harness injects it into a `<main>` on a page that loads `styles.css`.
- Formatted by Prettier (`pnpm format`).
- Only markup the component page describes, plus what the page says the
  consumer owns. No demo-only wrappers, layout boxes or headings that are
  there only to frame the example.
- No `style` attributes. Where the page asks the consumer to adjust something,
  use a documented class, such as `pathable-margin-0`.
- Literal IDs, unique within the fixture and prefixed with the folder and
  state where they could clash, such as `activity-grouped-today`. No generated
  or placeholder IDs.
- Realistic text: names, dates and titles a real application would show, not
  "Lorem ipsum" or "Item 1".
- Prefer native elements to ARIA roles. html-validate's `prefer-native-element`
  and `no-redundant-role` rules enforce this, so a list is a `<ul>` with `<li>`
  items, not a `<div role="list">`.

## ARIA rules

Fixtures model what a client application should write, so ARIA in them is held
to these rules:

1. **Every `aria-*` attribute and `role` traces to a source**: a consumer
   responsibility in the component page ("The consumer owns" or Composition),
   or a standard WAI-ARIA or WCAG requirement. No redundant or speculative
   ARIA: no role that repeats an element's native semantics, and no
   `aria-label` that replaces visible text.
2. **Lists that hold rows are lists with a name.** Use `<ul>` and `<li>`,
   whose native roles are `list` and `listitem`, and give each list an
   accessible name:
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
   "View" in the next. This is the pattern the
   [SrOnly page](../packages/styles/components/sr-only.md) describes. Do not
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

| Script                | What it checks                                                                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check:html`     | html-validate with the `html-validate:recommended` and `html-validate:a11y` presets ([`harness/html.mjs`](harness/html.mjs))                                                                                  |
| `pnpm check:contract` | The folder is a page slug, every `pathable-*` class is a class selector in `dist/styles.css`, and every non-default variant has a fixture using its modifier ([`harness/contract.mjs`](harness/contract.mjs)) |
| `pnpm check:axe`      | axe in Chromium, with `styles.css` loaded, at a desktop and a phone viewport; writes `.cache/axe-report.json` ([`harness/axe.mjs`](harness/axe.mjs))                                                          |
| `pnpm check`          | All three                                                                                                                                                                                                     |
| `pnpm changed [base]` | Prints the folders `git diff <base>...HEAD -- fixtures/` touched ([`harness/changed.mjs`](harness/changed.mjs)); default base `origin/main`, `--all` for every folder                                         |
| `pnpm test`           | Unit tests of the harness (`node --test`)                                                                                                                                                                     |

### html-validate configuration

[`.htmlvalidate.json`](.htmlvalidate.json) extends both presets, turns no rule
off and turns one on:

- `no-missing-references` is not in either preset. It fails an
  `aria-labelledby`, `aria-describedby` or other ID reference that names no
  element in the fixture, which ARIA rule 6 requires and axe does not catch.

`no-inline-style` stays on. Rules that only make sense for a whole document,
such as `missing-doctype` or the initial heading rank, do not fire on these
fragments today, so none is turned off. If one ever has to be, turn off only a
rule that applies to whole documents, and add it here with the reason.

### axe configuration

Any violation fails; there is no exceptions mechanism. Only these page-level
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
