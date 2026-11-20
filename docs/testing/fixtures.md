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
request: render the styles Storybook stories from the fixtures, choose the
affected fixtures from a SCSS change, and assert that `@pathableai/react`
renders the same normalised HTML as a fixture.

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
  `html-validate:a11y` presets, plus `no-missing-references`. It is cheap, so
  CI runs it on every fixture.
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
every push to `main`. It builds `@pathableai/styles`, runs the harness tests,
html-validate and the contract on everything, and axe on the folders
`changed.mjs` selects (every folder on `main`), then uploads the axe report as
the `fixtures-axe-report` artifact. It is not a required check.

A pull request that changes only `packages/styles` does not run it yet, so a
SCSS change that removes a class a fixture uses is caught on `main`, not on
the pull request. Selecting fixtures from SCSS changes is a planned step.
