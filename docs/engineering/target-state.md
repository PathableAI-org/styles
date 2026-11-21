# Target state of `@pathableai/styles`

This document owns the direction of the `@pathableai/styles` refactor: where
the package is going, how far the code is from it, and what CI is expected to
show on the way. It is current-state documentation, written as of 2026-11-21
with `main` at `b643e6e`. Update it as the refactor progresses; delete the
sections that stop being true.

The [constitution](../../.specify/memory/constitution.md) wins over this
document and does not yet state the target. Amending it is a separate human
decision. Where a package document describes the old model, this document wins
for the direction of the styles package.

## Goal

The target, set by the owner. Treat each bullet as normative for the finished
state.

`@pathableai/styles` returns to its roots: a thin wrapper around USWDS that
encapsulates that dependency. Consumers get the same components, with the
`usa-` prefix replaced by `pathable-` and the default settings matching the
PathAble brand guide.

- The package MUST expose every USWDS component under the `pathable-` prefix
  (`pathable-button`, `pathable-alert__body`). No `usa-` class is part of the
  public contract.
- USWDS design tokens and utility classes that have no `usa-` prefix MUST be
  re-exported under the same name: `grid-container`, `margin-top-2`,
  `text-bold`. They are not renamed to `pathable-margin-top-2`.
- Documentation MAY refer to USWDS. A consuming CSS project MUST NOT need USWDS
  naming conventions, and MUST NOT need to install or configure USWDS. It uses
  `pathable-` names.
- The npm package MUST ship compiled CSS and be reasonably bundler friendly.
  An application can pull in the whole bundle or only what it needs, such as
  individual components.
- Default settings MUST match the PathAble brand guide. An unconfigured
  component looks like PathAble.
- [`fixtures/`](../../fixtures/README.md) holds the canonical examples of the
  CSS used in HTML with the default settings. Today they power the
  documentation. Eventually they become the foundation for accessibility and
  HTML linting.
- The immediate goal is documentation first: the human-facing and agent-facing
  documentation MUST represent the target correctly. Agent-facing means agents
  that consume the package, through the shipped docs and
  [`packages/react/agent-guidance/`](../../packages/react/agent-guidance/pathable-react/).
- The refactor MUST leave the repository simpler than it found it.

## What counts as a defect

The docs and fixtures describe the target. Any difference between them and the
code is a defect in the code.

- Do not change a fixture, a component page in `components/`, or a documented
  class name back toward what the SCSS does today.
- Fix the SCSS, build or React code instead, or leave it for the catch-up step
  below and say so in the pull request.
- If a fixture looks wrong against the target, that is a question for the
  owner; see [Open questions](#open-questions).

## Current state

As of 2026-11-21, `main` at `b643e6e`:

- **Dependency.** `packages/styles/package.json` declares `@uswds/uswds`
  `^3.0.0`. The lockfile resolves 3.13.0, and
  `patches/@uswds__uswds@3.13.0.patch` pins that version. The patch mostly
  changes JavaScript (JS class strings and `prefix: "pathable"`). It also
  changes three `uswds-core` SCSS files (`rem-to-user-em.scss`,
  `layout-grid.scss` and `_grid-container.scss`) to module-qualified Sass
  built-ins. It renames no selectors.
- **Prefix is a hybrid.** `packages/styles/src/pathable-component-wrappers/`
  holds 129 `.scss` files. About 68 of them `@use 'usa-…'` and about 63
  `@extend .usa-…` (62 do both), so the compiled CSS holds `.usa-*` beside
  `.pathable-*`. The rest are PathAble components with no USWDS counterpart, plus
  index and mixin helpers; examples are activity-list, app-shell, bento-grid,
  toast and wizard. No count of those custom components has been verified.
- **Custom properties** are emitted twice, as `--pathable-*` and `--usa-*`.
- **Utilities** are generated as `.pathable-*` classes (for example
  `pathable-margin-top-2`), not as USWDS same-name utilities.
- **JavaScript** components (modal, combo-box, validation and others) require
  `.usa-*` on the DOM, and `pathable-init.ts` adds `usa-js-loading`.
  `@pathableai/react` still emits some `usa-*` classes.
- **Brand defaults.** `src/_uswds-theme.scss` passes brand values into
  `@use 'uswds-core' with (...)`. This already matches the target.
- **Package shape.** Exports are `.` (`dist/styles.css`), `./components`,
  `./utilities`, `./theme` (`theme-default.css`), `./js`, `./js/init`,
  `./dist/*` and `./src/*`. There is no per-component compiled CSS; selective
  use works only through the SCSS sources.
- **Fixtures** (`fixtures/`): 26 folders in `folders.json`, covering the USWDS
  static components from alert to text-input, with 116 HTML fragments.
  They contain no `usa-` classes and are the target markup. The harness in
  `fixtures/harness/` runs html-validate, a contract check against
  `dist/styles.css`, and axe.
- **Component pages.** The 26 pages in `components/<slug>.md` are the single
  source. `scripts/component-docs/` renders them into the styles package, the
  committed React agent guidance and Storybook.
- **Trajectory.** [#593](https://github.com/PathableAI-org/styles/pull/593)
  (ActivityList fixtures), then
  [#597](https://github.com/PathableAI-org/styles/pull/597),
  [#599](https://github.com/PathableAI-org/styles/pull/599) and
  [#601](https://github.com/PathableAI-org/styles/pull/601) (component pages
  from one source), then
  [#607](https://github.com/PathableAI-org/styles/pull/607) (baseline pages and
  fixtures for the USWDS static components, merged with Fixtures red on
  purpose).

## Known divergences

| Area                        | Target                                                  | Today                                                                       | Where                                                                                      |
| --------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Component selectors         | `pathable-*` only                                       | `.pathable-*` extends `.usa-*`; both are in the CSS                         | `packages/styles/src/pathable-component-wrappers/`                                         |
| Class names fixtures expect | Every class in `fixtures/` exists in the CSS            | 98 contract problems, such as `.pathable-input--2xl` missing                | `fixtures/`, `dist/styles.css`                                                             |
| Utilities and tokens        | USWDS names re-exported unchanged (`margin-top-2`)      | `pathable-margin-top-2` generated; no same-name utilities                   | `packages/styles/src/`                                                                     |
| Custom properties           | One namespace consumers need                            | Dual `--pathable-*` and `--usa-*`                                           | `packages/styles/src/`                                                                     |
| JavaScript and DOM          | No `usa-*` needed on the DOM                            | JS selects `.usa-*`; `pathable-init.ts` adds `usa-js-loading`               | `packages/styles/src/`, `patches/`                                                         |
| React                       | Emits `pathable-*` only                                 | About 19 `.tsx` files still emit some `usa-*` classes                       | `packages/react/`                                                                          |
| Entry points                | Whole bundle or single components as compiled CSS       | One bundle plus SCSS sources                                                | `packages/styles/package.json`                                                             |
| Consumer setup              | Install the package, import CSS                         | README asks consumers to install `@uswds/uswds` and sass and `@use 'uswds'` | `packages/styles/README.md`                                                                |
| Consumer docs               | Describe the target                                     | Describe dual-classing, `usa-` mapping, `--usa-*` alternatives              | `packages/styles/AGENTS.md`, `packages/styles/BRAND_RULES.md`, `packages/styles/README.md` |
| Shipped agent guidance      | No `usa-*` classes or "USWDS JavaScript bundle" wording | `SKILL.md` mentions `usa-*` classes; `server-and-client.md` mentions USWDS  | `packages/react/agent-guidance/pathable-react/`                                            |
| Component pages             | Describe the target and match the code                  | Describe the target; `check:component-pages` fails by design                | `components/`, `scripts/component-docs/`                                                   |

## Expected CI state during the refactor

CI is expected to be partly red while the target is captured in the published
docs and fixtures. The owner's bar is that the published GitHub Pages site
correctly describes the goal; while it does, these expected reds are
acceptable:

- the `Fixtures` workflow's contract step, and the axe step it causes to be
  skipped;
- the jobs and steps gated `if: false` (package lint and the component-page
  checks in CI), except that the `stylelint` job runs again on changed SCSS
  files, and the `Fixtures` job runs for the `tokens-color-theme-tokens` and
  `tokens-color-system-tokens` folders only (the other folders stay unchecked
  until the SCSS catches up);
- `check:component-pages`, which fails by design when run locally.

Nothing else is excused. A new failure that a change introduces is not
acceptable, and suppressing or loosening a check is never allowed.

What publishes to Pages:
[`docs-deploy.yml`](../../.github/workflows/docs-deploy.yml) runs on every push
to `main`. It builds the styles package, then the main Storybook (which holds
the component pages), then the React Storybook, and uploads
`apps/storybook/storybook-static` with the React Storybook copied to `/react`.
The build job also runs the Storybook coverage check, the Storybook
accessibility tests and the visual smoke tests, and the deploy job needs the
build job. If one of those steps fails, nothing is deployed. The token lint
step in that workflow is gated `if: false`.

State on `main` at `b643e6e`:

- The only red job is the `Fixtures` workflow
  ([`fixtures.yml`](../../.github/workflows/fixtures.yml)), step
  `Contract (selected folders)`: `26 folder(s) checked; 98 problem(s)`, for
  example `.pathable-input--2xl is not a class selector in dist/styles.css`.
  It is deterministic: the fixtures name target `pathable-*` classes the SCSS
  does not have yet. The axe step after it is skipped, so it never runs.
- The `html-validate (every fixture)` step and the `React fixture tests` job
  passed on that run (Fixtures run 43, push of `b643e6e`).
- `fixtures.yml` has no aggregate job, so GitHub's required checks (`CI result`
  and `Storybook result`) do not include it. `pnpm merge:gate` is stricter: it
  reads every check run on the head, so a red Fixtures run blocks agent merge
  and a person has to merge; see
  [Git workflow](git-workflow.md#the-merge-gate).
- The package lint (ESLint, markdownlint, token lint, Prettier) and the
  component-page checks are gated `if: false` in the workflows and skipped;
  stylelint runs again on changed SCSS files.
  `check:component-pages` fails by design when run locally.
- `ci-full.yml` and `storybook-quality.yml` run on pull requests and on `workflow_dispatch`, not on pushes to `main`.

What agents do:

- Do not chase unrelated red checks, and do not "fix" the Fixtures contract job
  by editing fixtures or pages back toward the SCSS.
- Never suppress a check or loosen configuration to get green; the rules in
  [`AGENTS.md`](../../AGENTS.md#no-check-suppressions) still apply.
- Still run `pnpm lint` locally and fix every problem in the files you touched.
- Report red checks in the pull request's Evidence or Validation section
  honestly, and say which reds were already on `main` and which your change
  introduced. A new red is a defect in your change.

## Order of work

1. **Docs and fixtures describe the target.** The baseline is in place: the 26
   component pages in [`components/`](../../components/README.md) and the
   [`fixtures/`](../../fixtures/README.md) already describe the target (#607),
   and refinement continues. The internal agent docs are updated with this
   document. Next: the consumer-facing docs that still describe the old `usa-`
   model, namely
   [`packages/styles/README.md`](../../packages/styles/README.md),
   [`packages/styles/BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md) and
   [`packages/react/agent-guidance/`](../../packages/react/agent-guidance/pathable-react/)
   (`SKILL.md` and `references/server-and-client.md`), plus the documentation of
   utilities and tokens under their unprefixed names.
2. **SCSS and the build catch up.** Rename selectors to `pathable-*`, re-export
   unprefixed tokens and utilities, add per-component compiled CSS, and remove
   `usa-*` from React. Delete code the thin wrapper makes unnecessary.
3. **Restore the gates.** Re-enable the checks gated `if: false`, make the
   fixtures contract and axe checks merge-gating, and retire the temporary notes
   in the workflow docs and `README.md`.

## Open questions

Recorded for the owner. Do not decide them in a pull request.

- What happens to the custom components with no USWDS counterpart (activity
  list, app shell, bento grid, toast, wizard and others) under a "thin wrapper"
  model: keep, move or remove?
- Can the JavaScript drop its `.usa-*` DOM requirements? That means renaming
  selectors in the USWDS Sass and JavaScript, not only in the patch.
- What shape does the per-component compiled CSS entry point take?
- Open questions from [#607](https://github.com/PathableAI-org/styles/pull/607):
  where the checkbox and radio tile modifiers go, the nested alert in
  site-alert, alert tints, `--back` and `--submit` buttons only inside
  `pathable-wizard__actions`, the `pathable-card--media` alias, and
  `pathable-link--nav` having no CSS.
