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
| Contract      | `pnpm --filter @pathableai/fixtures check:contract` | Every folder                 |
| axe           | `pnpm --filter @pathableai/fixtures check:axe`      | Every folder                 |
| Harness tests | `pnpm --filter @pathableai/fixtures test`           | The harness's own unit tests |
| All three     | `pnpm --filter @pathableai/fixtures check`          | Every folder                 |

Run locally, axe also checks any folders CI defers (see [In CI](#in-ci)); none
are deferred now, so any violation or incomplete result is a real failure.

- **html-validate** uses the `html-validate:recommended` and
  `html-validate:a11y` presets, plus `no-missing-references`, with
  `no-redundant-role` allowing only `role="list"` on a `<ul>` and
  `void-style` requiring self-closed void elements (as Prettier writes
  them), loaded
  explicitly from `fixtures/.htmlvalidate.json`. It rejects inline
  `html-validate-*` directive comments. It is cheap, so CI runs it on every
  fixture.
- **Contract** fails when a folder is not named after a page
  in `components/`, when a fixture's file name is not a
  kebab-case state name (`^[a-z][a-z0-9]*(-[a-z0-9]+)*\.html$`), when a
  `pathable-*` class in a fixture is not a class selector in
  `@pathableai/styles/dist/styles.css`, when a `pathable-` utility class in a
  fixture (one in `dist/utilities.css`, such as `hover:pathable-bg-link`) is
  not declared by the `classes` front matter of any page, or when a non-default variant in the
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

## In CI

[`.github/workflows/fixtures.yml`](../../.github/workflows/fixtures.yml) runs
on a pull request that changes `fixtures/**`, `components/*.md`,
`packages/styles/scripts/check-component-pages.mjs` or `component-pages.mjs`,
`packages/styles/src/**`, `packages/styles/package.json`, `pnpm-lock.yaml`,
`pnpm-workspace.yaml`, `patches/**`, `.github/actions/setup/**` or the
workflow itself, and on every push to `main`. Its `fixtures` job:

1. builds `@pathableai/styles`;
2. runs markdownlint and Prettier on `fixtures/`, because CI Full's Prettier
   job does not cover HTML;
3. runs the harness tests, including the integration tests that feed
   known-bad markup through each check;
4. runs html-validate and the contract check on every folder;
5. runs axe on every folder except those in `AXE_DEFERRED_FOLDERS`, which
   currently lists no folder;
6. uploads the axe report as the `fixtures-axe-report` artifact.

A folder joins `AXE_DEFERRED_FOLDERS` only with a maintainer's acceptance and
a tracking issue. It is not a required check.

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
reads its inputs from disk, so `--changed` never selects it.

### In CI

CI does not run the React fixture tests. React is deferred, so they run
locally only.
