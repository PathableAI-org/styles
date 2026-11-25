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

Fixtures exist for the official components, one folder each. `@pathableai/react`
components are held to the fixtures by
[React fixture tests](#react-fixture-tests), and converted component pages
take their examples from them ([`components/README.md`](../../components/README.md)).

Where a fixture and today's markup differ, the markup moves to the fixture.

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
  `no-redundant-role` allowing only `role="list"` on a `<ul>` and
  `void-style` requiring self-closed void elements (as Prettier writes
  them), loaded
  explicitly from `fixtures/.htmlvalidate.json`. It rejects inline
  `html-validate-*` directive comments. It is cheap, so CI runs it on every
  fixture, but only when a file under `fixtures/` or `pnpm-lock.yaml`
  changed.
- **Contract** fails when `fixtures/folders.json` and the component folders
  on disk disagree in either direction (so deleting a folder fails unless the
  list is edited in the same change), when a folder is not named after a page
  in `components/`, when a fixture's file name is not a
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

`node fixtures/harness/affected.mjs --base <ref> [--json <file>]`
selects folders from the compiled CSS alone. No component page or fixture
declares which source files it depends on.

1. It compiles `packages/styles/src/index.scss` (what becomes `styles.css`)
   at the merge base of `<ref>` and HEAD, and in the working tree, which is
   the head: its fixtures, stylesheet and dependencies all come from one
   checkout. The base compiles in a temporary git
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

So a change to a `.pathable-button` rule selects `button` and every other
folder whose fixtures use a button, and a change to a `.pathable-tag` rule
selects only the folders whose fixtures use a tag.

Declarations that only change order within a rule, such as a shorthand
moved after its longhand, count as a change to every property of the rule,
and a changed statement at-rule such as `@import` or `@layer a, b` selects
every folder. Whitespace is collapsed before comparing, except inside quoted
strings, so `content: "a  b"` or `[data-label="A  B"]` changing is seen.

Rule order is compared too. Among the rules that did not change, a rule
whose position moved relative to the others contributes its classes, or
selects every folder when it can match without a class. Markup restyled by
two rules swapping matches both, so it carries the classes of the one that
moved. A changed rule already contributes its classes. Each rule is
identified by its selector and its own declarations, so a declaration that
moves between two rules with the same selector (as Sass splits a block
around a nested rule) counts as both rules moving.

Known limit: a class added to the markup by JavaScript is not seen, because
only the fixture HTML is read.

### The union

`INPUT_GLOBS` in `select.mjs` lists every path that can change the
selection, and `fixtures/harness/workflow.test.mjs` fails when the
workflow's `pull_request.paths` misses one.

`node fixtures/harness/select.mjs <base>` lists the changed paths once,
with `affected.mjs`'s listing (working tree against the merge base, renames
as a delete and an add), and prints the union of the folders `changed.mjs`'s
`selectFolders` picks from them, the folders `affected.mjs` selects, and
every folder whose page `components/<slug>.md` changed (the
contract check reads the page's slug and variants). A change to
`packages/styles/scripts/check-component-pages.mjs` or `component-pages.mjs`,
which the selection and the contract check read selectors, CSS and pages
with, selects every folder, as a change to `fixtures/harness/` does. It
prints one folder per
line, with the reasons for each on standard error. `--all` selects
every folder. In GitHub Actions it also writes the `folders` and
`fixtures_changed` step outputs and a job summary.

## In CI

[`.github/workflows/fixtures.yml`](../../.github/workflows/fixtures.yml) runs
on a pull request that changes any input of the selection (`fixtures/**`,
`components/*.md`, the component-page scripts
`check-component-pages.mjs` and `component-pages.mjs` it reads selectors and
pages with, `packages/styles/src/**/*.scss` or `*.sass`,
`packages/styles/package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` or
`patches/**`), the React paths listed under
[React fixture tests in CI](#in-ci-1) or the workflow itself, and on every
push to `main`. Its `fixtures` job skips a pull request that changes only
files under `packages/react/`, and says so in its job summary; otherwise it:

1. builds `@pathableai/styles`;
2. runs markdownlint and Prettier on the re-enabled folders (see below),
   because CI Full's lint jobs filter on `packages/`, `apps/` and `scripts/`
   and skip a pull request that changes only `fixtures/`;
3. runs the harness tests, including the integration tests that feed
   known-bad markup through each check;
4. selects folders with `select.mjs`;
5. keeps only the selected folders that are re-enabled (see below);
6. runs html-validate, the contract check and axe on those folders, and skips
   them when none remains;
7. uploads the axe report as the `fixtures-axe-report` artifact.

The job summary lists each selected folder with its reasons, and says
explicitly when no folder was selected. On `main`, and on a pull request that
changes the workflow, every folder is selected. It is not a required check.

**Only some folders are re-enabled.** While the styles refactor catches up
([target state](../engineering/target-state.md)), the workflow checks only
the folders listed in its `REENABLED_FOLDERS` variable, currently `alert`, `breadcrumb`, `button`, `button-group`, `card`, `checkbox`, `collection`, `icon-list`, `input-prefix-suffix` and every
`tokens-*` and `utilities-*` folder: the lint step, html-validate, the contract and axe run for
those folders alone, and only when one is selected. The other folders are not
checked in CI, and the React fixture tests job stays disabled. A folder joins
the list when its contract and axe checks pass against the compiled CSS.

## React fixture tests

Fixture tests check that a `@pathableai/react` component renders the classes
and markup structure of a fixture. They do not test behaviour or the component
page's guarantees; stories and unit tests cover those.

### How a fixture test is written

Each fixture a React component renders has an example module beside the
component, named after the fixture's state, which default-exports the example
element:

```text
fixtures/button/default.html
packages/react/src/components/Button/examples/default.tsx
packages/react/src/components/Button/__tests__/Button.fixtures.test.tsx
```

An example is written as a consumer would write it, with the fixture's words,
and holds no test code. It imports the component relatively (`../Button`),
because the package's own name resolves to its build output inside the
package.

The fixture test imports the example and the fixture, the fixture with Vite's
`?raw` query, and compares them:

```tsx
import defaultFixture from '@pathableai/fixtures/button/default.html?raw'
import { expectToRenderFixture } from '../../../test/fixtures'
import defaultExample from '../examples/default'

it('renders button/default', () => {
  expectToRenderFixture(defaultExample, defaultFixture)
})
```

`expectToRenderFixture`, in
[`packages/react/src/test/fixtures.ts`](../../packages/react/src/test/fixtures.ts):

1. renders the element with `renderToStaticMarkup`;
2. parses the output and the fixture with the same HTML parser (jsdom);
3. renumbers `id` values in document order and rewrites ID references
   (`aria-labelledby`, `aria-describedby`, `for`, `aria-controls` and the
   other ID-list attributes) to match, so `useId` output compares equal while
   each reference must still point at the same element; a duplicate ID or a
   reference to a missing ID fails. A fragment link (`href="#id"`) to an
   element in the markup is rewritten too; one to an ID outside it, such as a
   skip link's target, is marked unresolved and compared as written, so it
   never matches a link that resolves;
4. collapses each run of HTML whitespace inside ordinary text to one space,
   as rendering does, so a fixture whose text Prettier wraps still matches,
   while non-breaking spaces stay distinct, even at the ends of a text node,
   and the text of `pre`, `textarea`, `script` and `style` is compared
   exactly; it also renames `svg`, `script` and `style` elements, which
   `getDiffableHTML` would otherwise drop with their content;
5. compares the two with `getDiffableHTML` from
   `@open-wc/semantic-dom-diff`, which sorts attributes and class tokens and
   normalises whitespace between elements, using Vitest's `toBe`, so a
   mismatch shows a line diff;
6. compares the readable text, with the spaces between words, because
   `getDiffableHTML` trims each text node: `Edit<span> Jordan</span>` and
   `Edit<span>Jordan</span>` read differently.

An extra wrapper element, a class on the wrong element, a `style` attribute, a
different icon or different words fail. Only comments, empty `class` and `id`
attributes, attribute and class order, the layout of whitespace and the values
of IDs are ignored.

### Coverage

[`packages/react/src/test/fixture-manifest.ts`](../../packages/react/src/test/fixture-manifest.ts)
maps fixture folders to React components, for example `button` to `Button`.
The coverage test (`src/test/__tests__/fixture-coverage.test.ts`) fails when:

- a fixture in a mapped folder has neither an example nor a "not offered in
  React" entry in the manifest with a reason;
- an example or a fixture test names a fixture that does not exist, or a
  "not offered" entry names one that does not exist or gives no reason;
- an example has no fixture test that compares it with its fixture;
- a fixture test's `expectToRenderFixture` call does not compare an import
  from `../examples/<state>` with an import from
  `@pathableai/fixtures/<folder>/<state>.html?raw` of the same state and the
  component's mapped folder.
- two manifest entries map to the same React component, or the manifest
  file lists the same folder twice;
- a fixture test passes anything other than two imported names to
  `expectToRenderFixture`, or skips a test. Commented-out calls do not count.

It reports fixture folders the manifest does not map yet, and exported React
components that no folder maps to yet, as a notice, without failing. No folder
is mapped so far.

The manifest and the example modules also feed the component docs
([`components/README.md`](../../components/README.md)). Mapping a folder gives
the component a React page in the shipped agent guidance, so before you map
one:

- convert the folder's component page in `components/` to take its examples
  from the fixtures, or `check:component-pages` and the React page build fail;
- write each example as consumer code: it ships verbatim as guidance, except
  that a relative import of the component becomes `@pathableai/react`. An
  example may import only `react`, `@pathableai/react`, or names that
  `src/index.ts` exports, by relative path; any other import fails the build;
- run `node scripts/component-docs/cli.mjs react` and commit the pages it
  writes in `packages/react/agent-guidance/pathable-react/references/components/`.
  `pnpm check:agent-guidance` fails when they are out of date.

### Running them

The fixture tests are the `fixtures` project of the React package's Vitest
configuration (`*.fixtures.test.tsx` and the helper's own tests in
`src/test/__tests__/`). `pnpm --filter @pathableai/react test:unit` runs them
with the unit tests;
`pnpm --filter @pathableai/react test:fixtures` runs them alone.

`vitest run --project fixtures --changed <base>` runs only the fixture tests
whose module graph contains a changed file: editing one fixture, one example
or one component runs that component's fixture test. This relies on the
project's environment, `src/test/fixture-environment.ts`: jsdom, but
processed by Vite's SSR environment. In Vite's client environment, which
Vitest uses for plain jsdom, a `?raw` import is recorded as `?import&raw` and
`--changed` does not connect the test to the fixture file. The coverage test
reads its inputs from disk, so `--changed` never selects it; CI runs it on
every run.

### In CI

The `react` job in
[`.github/workflows/fixtures.yml`](../../.github/workflows/fixtures.yml)
runs the fixture tests. The workflow also runs on a pull request that changes
`packages/react/src/**`, `packages/react/vitest.config.ts` or
`packages/react/package.json`. The job chooses what to run from
`git diff origin/<base>...HEAD`:

| Change in the pull request                                                                                      | What runs                                                                       |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| None (push to `main`)                                                                                           | Every fixture test                                                              |
| The workflow, `vitest.config.ts`, `packages/react/package.json`, `packages/react/src/test/` or `pnpm-lock.yaml` | Every fixture test                                                              |
| Otherwise, anything under `fixtures/` or `packages/react/src/`                                                  | `vitest run --project fixtures --changed origin/<base>`, then the coverage test |
| Nothing above, such as a SCSS-only change                                                                       | No fixture test; the job installs nothing                                       |

The job summary lists each test file that ran and each test in it. The
coverage test's list of unmapped components appears as a notice on the run.
It is not a required check.
