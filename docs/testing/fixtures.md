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

Fixtures exist for ActivityList and SrOnly so far. Planned next steps, each its own pull
request: render the styles Storybook stories from the fixtures and choose the
affected fixtures from a SCSS change. `@pathableai/react` components are held
to the fixtures by [React fixture tests](#react-fixture-tests).

## The checks

Each check takes a list of component folders and defaults to every folder.

| Check         | Command                                             | Runs on                      |
| ------------- | --------------------------------------------------- | ---------------------------- |
| html-validate | `pnpm --filter @pathableai/fixtures check:html`     | Every fixture                |
| Contract      | `pnpm --filter @pathableai/fixtures check:contract` | Every folder                 |
| axe           | `pnpm --filter @pathableai/fixtures check:axe`      | Changed folders in CI        |
| Harness tests | `pnpm --filter @pathableai/fixtures test`           | The harness's own unit tests |
| All three     | `pnpm --filter @pathableai/fixtures check`          | Every folder                 |

- **html-validate** uses the `html-validate:recommended` and
  `html-validate:a11y` presets, plus `no-missing-references`, with
  `no-redundant-role` allowing only `role="list"` on a `<ul>`, loaded
  explicitly from `fixtures/.htmlvalidate.json`. It rejects inline
  `html-validate-*` directive comments. It is cheap, so CI runs it on every
  fixture.
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

`node fixtures/harness/changed.mjs [base]` prints the component folders that
`git diff --name-only <base>...HEAD -- fixtures/` touched, one per line;
`base` defaults to `origin/main`. A change to `fixtures/harness/`,
`fixtures/.htmlvalidate.json` or `fixtures/package.json` selects every folder.
`--all` prints every folder. Pass the output to a check:

```sh
cd fixtures && node harness/axe.mjs $(node harness/changed.mjs)
```

## In CI

[`.github/workflows/fixtures.yml`](../../.github/workflows/fixtures.yml) runs
on a pull request that changes `fixtures/**` or the workflow itself, and on
every push to `main`. It:

1. builds `@pathableai/styles`;
2. runs ESLint, markdownlint and Prettier on `fixtures/`, because CI Full's
   lint jobs filter on `packages/`, `apps/` and `scripts/` and skip a pull
   request that changes only `fixtures/`;
3. runs the harness tests, including the integration tests that feed
   known-bad markup through each check;
4. runs html-validate and the contract on every folder;
5. runs axe on the folders `changed.mjs` selects, or on every folder on
   `main` and when the workflow itself changed, so a workflow edit is
   exercised before it merges;
6. uploads the axe report as the `fixtures-axe-report` artifact.

It is not a required check.

A pull request that changes only `packages/styles` does not run it yet, so a
SCSS change that removes a class a fixture uses is caught on `main`, not on
the pull request. Selecting fixtures from SCSS changes is a planned step.

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
   reference to a missing ID fails;
4. compares the two with `getDiffableHTML` from
   `@open-wc/semantic-dom-diff`, which sorts attributes and class tokens and
   normalises whitespace between elements, using Vitest's `toBe`, so a
   mismatch shows a line diff;
5. compares the readable text, with the spaces between words, because
   `getDiffableHTML` trims each text node: `Edit<span> Jordan</span>` and
   `Edit<span>Jordan</span>` read differently.

Nothing is ignored: an extra wrapper element, a class on the wrong element, a
`style` attribute or different words fail.

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

It reports exported React components that no folder maps to yet as a notice,
without failing. Only `sr-only` is mapped so far.

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
