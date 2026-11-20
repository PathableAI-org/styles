# HTML fixtures

The top-level [`fixtures/`](../../fixtures/) workspace package
(`@pathableai/fixtures`, private) holds canonical HTML for static
`@pathableai/styles` components: one folder per component page, one file per
state. A fixture is the reference markup a consuming application copies, so
it models classes, structure and ARIA exactly as a well-built client
application should write them.

How to write a fixture, and the ARIA rules fixtures are held to, are in
[`fixtures/README.md`](../../fixtures/README.md). This page covers how the
fixtures are checked.

Fixtures exist for ActivityList so far. Planned next steps, each its own pull
request: add React fixture tests that check a JSX snippet renders the same normalised HTML as a fixture,
and generate component docs from the fixtures.

Where a fixture and today's markup differ, the markup moves to the fixture.
The ActivityList fixtures use `<ul role="list">` and `<li>`, while the
component page, its styles stories and the React `ActivityList` still use
`<div role="list">`. A styles list reset for ActivityList and a React
`ActivityList` that renders `ul role="list"`/`li` are planned, so the React
fixture tests can hold React to these fixtures.

## The checks

Each check takes a list of component folders and defaults to every folder.

| Check         | Command                                             | Runs on                      |
| ------------- | --------------------------------------------------- | ---------------------------- |
| html-validate | `pnpm --filter @pathableai/fixtures check:html`     | Every fixture                |
| Contract      | `pnpm --filter @pathableai/fixtures check:contract` | Selected folders in CI       |
| axe           | `pnpm --filter @pathableai/fixtures check:axe`      | Selected folders in CI       |
| Harness tests | `pnpm --filter @pathableai/fixtures test`           | The harness's own unit tests |
| All three     | `pnpm --filter @pathableai/fixtures check`          | Every folder                 |

- **html-validate** uses the `html-validate:recommended` and
  `html-validate:a11y` presets, plus `no-missing-references`, with
  `no-redundant-role` allowing only `role="list"` on a `<ul>`, loaded
  explicitly from `fixtures/.htmlvalidate.json`. It rejects inline
  `html-validate-*` directive comments. It is cheap, so CI runs it on every
  fixture, but only when a file under `fixtures/` or `pnpm-lock.yaml`
  changed.
- **Contract** fails when `fixtures/folders.json` and the component folders
  on disk disagree in either direction (so deleting a folder fails unless the
  list is edited in the same change), when a folder is not named after a page
  in `packages/styles/components/`, when a fixture's file name is not a
  kebab-case state name (`^[a-z][a-z0-9]*(-[a-z0-9]+)*\.html$`), when a
  `pathable-*` class in a fixture is not a class selector in
  `@pathableai/styles/dist/styles.css`, or when a non-default variant in the
  page's front matter has no fixture using its modifier class. Classes are
  read by parsing each fixture, so only element `class` attributes count, not
  `data-class` and the like or markup inside comments. It reads the page and
  the CSS with the same code as the component-page check
  (`packages/styles/scripts/`).
- **axe** loads each fixture into a `<main>` on a page that links
  `styles.css`, in Chromium at 1280 px and 375 px wide, and runs
  `@axe-core/playwright`. Only the page-level rules `region`,
  `landmark-one-main` and `page-has-heading-one` are off. It also fails when
  two buttons or links in a fixture share an accessible name. Any violation
  fails, and so does any axe "incomplete" result; there is no exceptions
  mechanism or allowlist. Each is listed with its nodes in the output and in
  the GitHub job summary. It writes a JSON report to
  `fixtures/.cache/axe-report.json`, or to `FIXTURES_AXE_REPORT`.

The contract and axe checks need the built stylesheet, so run
`pnpm --filter @pathableai/styles build` first.

## Choosing folders

Two scripts choose folders, and CI checks their union together with the
folders whose component page changed.

### Folders whose files changed

`node fixtures/harness/changed.mjs [base]` prints the component folders that
`git diff --name-only <base>...HEAD -- fixtures/` touched, one per line;
`base` defaults to `origin/main`. A change to `fixtures/harness/`,
`fixtures/.htmlvalidate.json`, `fixtures/folders.json` or `fixtures/package.json`
selects every folder.
`--all` prints every folder. Pass the output to a check:

```sh
cd fixtures && node harness/axe.mjs $(node harness/changed.mjs)
```

### Folders a stylesheet change affects

`node fixtures/harness/affected.mjs --base <ref> [--head <ref>] [--json <file>]`
selects folders from the compiled CSS alone. No component page or fixture
declares which source files it depends on.

1. It compiles `packages/styles/src/index.scss` (what becomes `styles.css`)
   at the merge base of `<ref>` and the head, and at the head (the working
   tree when `--head` is not given). The base compiles in a temporary git
   worktree with the head's `node_modules`, so there is no second install.
2. It parses both with PostCSS and pairs up rules by at-rule context (such as
   a media query) and selector, comparing their declarations property by
   property.
3. A changed, added or removed rule contributes the classes in its selector
   (read with the component-page check's `classesInSelector`).
4. A changed custom property contributes the classes of every rule that reads
   it through `var()`, followed through custom properties defined from it:
   a change to `--a` reaches `.x { color: var(--b) }` when `--b: var(--a)`.
5. A folder is selected when one of its fixtures uses one of those classes in
   a `class` attribute, or names one of those custom properties.

Every folder is selected when the change cannot be narrowed to classes:

- `pnpm-lock.yaml`, `pnpm-workspace.yaml` or `patches/` changed, or the
  `@uswds/uswds` range in `packages/styles/package.json` changed, because the
  two sides would not compile with the same packages;
- a changed rule has a selector that can match markup without any of the
  classes it names, even when other selectors in the same list name one
  (`button, .pathable-button`). That covers an element selector, the reset,
  `@font-face`, a keyframe, and a class only inside `:not()`, `:has()` or
  another pseudo-class (`:not(.x)`, `div:has(.x)`). An `:is()` or `:where()`
  counts as needing a class only when every argument needs one, so
  `:where(.x)` narrows to `.x` and `:is(button, .x)` selects every folder;
- a custom property changed on a rule with no class (such as `:root`) and,
  in the end, no rule reads it, directly or through other custom properties;
- a changed custom property is read by such a rule.

When no stylesheet source changed, it compiles nothing and selects nothing.
It prints JSON: `all`, `allReasons`, and per folder the selected `files` and
`reasons`. Each reason names the class or custom property, why it changed,
the selector, and the source file and line from the Sass source map, such as
`packages/styles/src/pathable-component-wrappers/pathable-dashboard.scss:13`.

So a change to an `.pathable-activity-row` rule in `pathable-dashboard.scss`
selects `activity-list`, a change to `.pathable-button` selects it through the
buttons in its fixtures, and a change to `.pathable-tag` does not select it.

Declarations that only change order within a rule, such as a shorthand
moved after its longhand, count as a change to every property of the rule,
and a changed statement at-rule such as `@import` or `@layer a, b` selects
every folder. Whitespace is collapsed before comparing, except inside quoted
strings, so `content: "a  b"` or `[data-label="A  B"]` changing is seen.

Rule order is compared too. Among the rules that did not change, a rule
whose position moved relative to the others contributes its classes, or
selects every folder when it can match without a class. Markup restyled by
two rules swapping matches both, so it carries the classes of the one that
moved. A changed rule already contributes its classes.

Known limit: a class added to the markup by JavaScript is not seen, because
only the fixture HTML is read.

### The union

`INPUT_GLOBS` in `select.mjs` lists every path that can change the
selection, and `fixtures/harness/workflow.test.mjs` fails when the
workflow's `pull_request.paths` misses one.

`node fixtures/harness/select.mjs <base>` runs both and prints the union,
plus every folder whose page `packages/styles/components/<slug>.md` changed
(the contract check reads the page's slug and variants), one folder per line, with the reasons for each on standard error. `--all` selects
every folder. In GitHub Actions it also writes the `folders` and
`fixtures_changed` step outputs and a job summary.

## In CI

[`.github/workflows/fixtures.yml`](../../.github/workflows/fixtures.yml) runs
on a pull request that changes any input of the selection (`fixtures/**`,
`packages/styles/components/*.md`, `packages/styles/src/**/*.scss` or
`*.sass`, `packages/styles/package.json`, `pnpm-lock.yaml`,
`pnpm-workspace.yaml` or `patches/**`) or the workflow itself, and on every push to `main`. It:

1. builds `@pathableai/styles`;
2. runs ESLint, markdownlint and Prettier on `fixtures/`, because CI Full's
   lint jobs filter on `packages/`, `apps/` and `scripts/` and skip a pull
   request that changes only `fixtures/`;
3. runs the harness tests, including the integration tests that feed
   known-bad markup through each check;
4. selects folders with `select.mjs`;
5. runs html-validate on every fixture when a file under `fixtures/` or
   `pnpm-lock.yaml` changed (the lockfile can change the html-validate
   version), and skips it otherwise;
6. runs the contract check and axe on the selected folders, and skips them
   when none was selected, except that the contract also runs, on every
   folder, when a file under `fixtures/` changed, so its `folders.json`
   check catches a deleted folder;
7. uploads the axe report as the `fixtures-axe-report` artifact.

The job summary lists each selected folder with its reasons, and says
explicitly when no folder was selected. On `main`, and on a pull request that
changes the workflow, every folder is checked. It is not a required check.
