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

Fixtures exist for ActivityList and SrOnly so far. The planned next step, in
its own pull request, is to render the styles Storybook stories from the
fixtures. `@pathableai/react` components are held to the fixtures by
[React fixture tests](#react-fixture-tests).

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
- **Contract** fails when a folder is not named after a page in
  `packages/styles/components/`, when a `pathable-*` class in a fixture is not
  a class selector in `@pathableai/styles/dist/styles.css`, or when a
  non-default variant in the page's front matter has no fixture using its
  modifier class. It reads the page and the CSS with the same code as the
  component-page check (`packages/styles/scripts/`).
- **axe** loads each fixture into a `<main>` on a page that links
  `styles.css`, in Chromium at 1280 px and 375 px wide, and runs
  `@axe-core/playwright`. Only the page-level rules `region`,
  `landmark-one-main` and `page-has-heading-one` are off. It also fails when
  two buttons or links in a fixture share an accessible name. Any violation
  fails; there is no exceptions mechanism. It writes a JSON report to
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
`fixtures/.htmlvalidate.json` or `fixtures/package.json` selects every folder.
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
- a changed rule has a selector that names no class, such as an element
  selector, the reset, `@font-face` or a keyframe, even when other selectors
  in the same list name one (`button, .pathable-button`);
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
every folder.

Known limits: a whole rule that only moves, with the same selector and
declarations, is not seen, although moving it can change the cascade. A
class added to the markup by JavaScript is not seen, because only the
fixture HTML is read.

### The union

`node fixtures/harness/select.mjs <base>` runs both and prints the union,
plus every folder whose page `packages/styles/components/<slug>.md` changed
(the contract check reads the page's slug and variants), one folder per line, with the reasons for each on standard error. `--all` selects
every folder. In GitHub Actions it also writes the `folders` and
`fixtures_changed` step outputs and a job summary.

## In CI

[`.github/workflows/fixtures.yml`](../../.github/workflows/fixtures.yml) runs
on a pull request that changes `fixtures/**`, `packages/styles/src/**/*.scss`,
`packages/styles/components/*.md`, `pnpm-lock.yaml`, the React paths listed
under [React fixture tests in CI](#in-ci-1) or the workflow itself, and on
every push to `main`. Its `fixtures` job:

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
   when none was selected;
7. uploads the axe report as the `fixtures-axe-report` artifact.

The job summary lists each selected folder with its reasons, and says
explicitly when no folder was selected. On `main`, and on a pull request that
changes the workflow, every folder is checked. It is not a required check.

## React fixture tests

Fixture tests check that a `@pathableai/react` component renders the classes
and markup structure of a fixture. They do not test behaviour or the component
page's guarantees; stories and unit tests cover those.

### How a fixture test is written

Each fixture a React component renders has an example module beside the
component, named after the fixture's state, which default-exports the example
element:

```text
fixtures/sr-only/inline.html
packages/react/src/components/SrOnly/examples/inline.tsx
packages/react/src/components/SrOnly/__tests__/SrOnly.fixtures.test.tsx
```

An example is written as a consumer would write it, with the fixture's words,
and holds no test code. It imports the component relatively (`../SrOnly`),
because the package's own name resolves to its build output inside the
package.

The fixture test imports the example and the fixture, the fixture with Vite's
`?raw` query, and compares them:

```tsx
import inlineFixture from '@pathableai/fixtures/sr-only/inline.html?raw'
import { expectToRenderFixture } from '../../../test/fixtures'
import inlineExample from '../examples/inline'

it('renders sr-only/inline', () => {
  expectToRenderFixture(inlineExample, inlineFixture)
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
   exactly; it also renames
   `svg`, `script` and `style` elements, which `getDiffableHTML` would
   otherwise drop with their content;
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
maps fixture folders to React components, for example `sr-only` to `SrOnly`.
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
components that no folder maps to yet, as a notice, without failing. Only
`sr-only` is mapped so far.

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
