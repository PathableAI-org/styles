# Drift review

Per-pull-request checks see one diff at a time. Lint, the Storybook
test-runner, Copilot, the verifier and the code reviewer each judge whether a
change is acceptable, not whether an area of the design system still matches
what its owning document promises after many acceptable changes. The drift
review looks for that slow decay. It reviews one area as it stands, files what
it can verify as GitHub issues labelled `drift`, and leaves triage and fixes
to a person.

This document owns the area list, the review scope, the finding shape and the
issue format. The `drift-review` skill supplies the procedure. Drift review
is [not started yet](orchestration.md#decisions): the `drift` label, the
**Drift review log** tracking issue and any scheduled task do not exist, so
the skill can only report findings, in a `dry-run` or interactive run. When
the maintainer starts it, the intended form is a scheduled cloud task running
the skill against the default branch.

## Scope

The review reads the area's owning documents, its code, its stories and its
tests at the reviewed commit, and looks for:

| Category              | Drift it looks for                                                                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contract-drift`      | Code that no longer does what its owning document or README says, or a document that describes classes, props, tokens or behaviour the code no longer has |
| `source-first`        | React API whose visual behaviour has no `packages/styles` class, token or documented pattern behind it                                                    |
| `wrapper-styling`     | Private CSS or style objects in `packages/react` that change visual semantics outside the `@pathableai/styles` contract                                   |
| `naming-parity`       | A React component whose name no longer matches the CamelCase form of its styles component name                                                            |
| `token-usage`         | Raw values that have a semantic token, Sass variables without a published custom property, or tokens the theming vocabulary lists that no longer exist    |
| `story-contract`      | A supported state with no deterministic named story, or stories that drifted from the component's documented states                                       |
| `accessibility`       | A documented keyboard, focus or ARIA promise no interaction story exercises, or an accessibility exception whose rationale no longer applies              |
| `guidance-drift`      | Consumer agent guidance that no longer matches the public API                                                                                             |
| `duplication`         | Two helpers, tokens, constants or concepts that mean the same thing, within a package or across the styles and React packages                             |
| `complexity`          | A module whose responsibilities have grown or blurred, or options and abstractions with one caller                                                        |
| `test-meaningfulness` | A promise in the owning document that no story or test would notice breaking, or a play function that would still pass if the behaviour it names broke    |
| `readability`         | Names or structure that now mislead a maintainer because the code around them changed                                                                     |
| `correctness`         | A defect found while reviewing for the above; the review does not hunt for bugs                                                                           |

Lint, stylelint, token-lint, typecheck and test-runner findings are out of
scope. The review may read their output as context but never files one. It
does not review `docs/plans/`, which are historical.

The review is read-only. It edits no file, branch or pull request, opens no
pull request and pushes nothing. It writes only GitHub issues and issue
comments labelled `drift`.

## Findings

Findings use the same fields as the code reviewer's findings, so a person
triages both the same way:

- `severity`: `blocking` when the code reviewer would block a slice that
  introduced it today (a broken documented promise, an ownership or accessibility violation,
  a story or test that cannot fail); otherwise `advisory`
- `category` from the table above
- `file` and `line` at the reviewed commit
- `summary`: the drift in one sentence
- `failureScenario`: concrete inputs or state and the wrong outcome they
  produce, or for maintainability drift the concrete change a maintainer would
  get wrong
- `confidence`: `high` or `medium`; the review drops anything less
- `verification`: how the review confirmed the finding: what it read, traced,
  searched or ran

Every candidate is verified before it is reported, and unconfirmed candidates
are dropped. One run reports at most five findings, highest severity and
confidence first. A run with no finding is a valid result.

## Issues

Each finding is one open issue labelled `drift`, titled
`drift(<area>): <summary>`. Its body lists the finding fields and the reviewed
commit, and ends with a marker the next run uses to find it:

```text
<!-- drift-finding area=<area> category=<category> file=<file> -->
```

Before filing, the review compares each finding with the open `drift` issues
for the area and with the ones closed as not planned. When a finding matches an
open issue, the review comments on that issue with the new commit and any new
evidence instead of filing another. It does not refile a finding a person
closed as not planned unless the code has changed in a way that makes the
original decision no longer apply, and then it says why.

Every run also comments on the tracking issue, **Drift review log**, also
labelled `drift`. The comment names the area, the reviewed commit, the area's
churn since its last review, and the issues filed or updated, or says there
were no verified findings. Its first line is a marker:

```text
<!-- drift-review area=<area> sha=<full sha> -->
```

That comment is the record of the review. The next run reads the latest marker
for each area to find its last reviewed commit. Issue text holds no
credentials, tokens or session references, and names no client.

## Choosing an area

Each run reviews one area. For each area, churn is the number of commits since
the area's last reviewed commit that touch its paths, documents included; an
area never reviewed counts commits from the last 90 days. The review takes the
area with the most churn, breaking ties by the oldest review, then by the
order below. It skips an area with no commit since its last review. When every
area is unchanged, the run records that on the tracking issue and stops.

During the current static styles refactor, scheduled selection also skips
`styles-js`, `react-primitives`, `react-theming` and `react-agent-guidance`.
Review one only when the maintainer explicitly requests that deferred area.
This keeps existing code visible without allowing drift review to turn it into
active modernization work; the boundary is owned by
[Target state](target-state.md#retained-but-deferred-areas).

## Areas

Each area names its owning documents and its paths as Git pathspecs relative
to the repository root, so `git log <sha>..HEAD -- <paths>` measures its
churn. When code moves or a new owning document appears, update this list in
the same pull request.

### `tokens`

Tokens and foundations: color, typography, spacing, radius, elevation, fonts,
the semantic layer, component custom properties and the default theme.

- Owners: [`packages/styles/AGENTS.md`](../../packages/styles/AGENTS.md) and
  [`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md)
- Paths:
  - `packages/styles/AGENTS.md`
  - `packages/styles/BRAND_RULES.md`
  - `packages/styles/src/_colors.scss`
  - `packages/styles/src/_typography.scss`
  - `packages/styles/src/_spacing.scss`
  - `packages/styles/src/_radius.scss`
  - `packages/styles/src/_elevation.scss`
  - `packages/styles/src/_fonts.scss`
  - `packages/styles/src/_semantic.scss`
  - `packages/styles/src/_components-custom-properties.scss`
  - `packages/styles/src/_uswds-theme.scss`
  - `packages/styles/src/theme-default.scss`
  - `packages/styles/src/index.scss`
  - `packages/styles/scripts/lint-tokens.mjs`
  - `packages/styles/scripts/copy-fonts.mjs`
  - `packages/styles/src/stories/brand`

### `utilities`

The utility classes and their configuration.

- Owners: [`packages/styles/AGENTS.md`](../../packages/styles/AGENTS.md)
- Paths:
  - `packages/styles/AGENTS.md`
  - `packages/styles/src/_utilities.scss`
  - `packages/styles/src/_utilities-config.scss`
  - `packages/styles/src/_utilities-tokens.scss`
  - `packages/styles/src/utilities.scss`
  - `packages/styles/src/stories/utilities`
  - `packages/styles/test/selective-import.scss`

### `component-wrappers`

The `.pathable-*` component classes and their styles stories.

- Owners: [`packages/styles/AGENTS.md`](../../packages/styles/AGENTS.md),
  [`STORY_AUTHORING.md`](../../packages/styles/STORY_AUTHORING.md),
  [`packages/styles/README.md`](../../packages/styles/README.md)
- Paths:
  - `packages/styles/AGENTS.md`
  - `packages/styles/STORY_AUTHORING.md`
  - `packages/styles/README.md`
  - `packages/styles/src/pathable-component-wrappers`
  - `packages/styles/src/components.scss`
  - `packages/styles/src/stories/components`
  - `packages/styles/src/stories/recipes`
  - `packages/styles/scripts/quality-gates.mjs`
  - `packages/styles/scripts/test-visual.mjs`

### `styles-js`

The framework-neutral JavaScript helpers `@pathableai/styles` still publishes.
This is a retained, deferred area, not a current refactor target.

- Owners: [`packages/styles/README.md`](../../packages/styles/README.md) and
  [Target state](target-state.md)
- Paths:
  - `packages/styles/README.md`
  - `packages/styles/src/js`
  - `packages/styles/scripts/build-js.mjs`
  - `packages/styles/package.json`

### `react-primitives`

The `@pathableai/react` components, their internals, entry point and stories.

- Owners: [`packages/react/README.md`](../../packages/react/README.md),
  [`STORYBOOK_STANDARD.md`](../../packages/react/STORYBOOK_STANDARD.md), and
  [Component testing](../testing/README.md)
- Paths:
  - `packages/react/README.md`
  - `packages/react/STORYBOOK_STANDARD.md`
  - `packages/react/docs`
  - `packages/react/src/components`
  - `packages/react/src/internal`
  - `packages/react/src/index.ts`
  - `packages/react/src/stories`
  - `packages/react/package.json`
  - `docs/testing`

### `react-theming`

`createTheme`, `ThemeProvider` and the overridable tokens.

- Owners: [Theming consumer guide](../theming/consumer-guide.md),
  [Token vocabulary](../theming/token-vocabulary.md)
- Paths:
  - `docs/theming`
  - `packages/react/src/theme`

### `agent-guidance`

The installed styles component guidance and the planned styles package-wide
guidance.

- Owners: [Repository intent](intent.md), [Target state](target-state.md),
  [`components/README.md`](../../components/README.md)
- Paths:
  - `components`
  - `fixtures`
  - `packages/styles/AGENTS.md`
  - `packages/styles/components`
  - `scripts/component-docs`

### `react-agent-guidance`

The retained consumer guidance shipped with `@pathableai/react` and the checks
that keep it synchronized. Scheduled review of this area is deferred unless
the maintainer explicitly requests it.

- Owners:
  [`react-agent-guidance.instructions.md`](../../.github/instructions/react-agent-guidance.instructions.md),
  [Repository intent](intent.md) and [Target state](target-state.md)
- Paths:
  - `.github/instructions/react-agent-guidance.instructions.md`
  - `packages/react/agent-guidance`
  - `scripts/check-agent-guidance.mjs`
  - `scripts/check-agent-guidance-impact.mjs`
  - `scripts/check-agent-guidance.test.mjs`
  - `scripts/check-agent-guidance-impact.test.mjs`

### `storybook-infrastructure`

Both Storybook apps, the shared behaviour contracts, the test-runner
lifecycle and the accessibility exceptions.

- Owners: [Component testing](../testing/README.md) and
  [Tooling and structure](../testing/tooling-and-structure.md)
- Paths:
  - `docs/testing/tooling-and-structure.md`
  - `docs/testing/behavior-parity.md`
  - `apps/storybook`
  - `apps/storybook-react`
  - `packages/storybook-contracts`
  - `scripts/test-storybook.mjs`
  - `scripts/accessibility-exceptions.mjs`
  - `scripts/storybook-evidence-report.mjs`
  - `scripts/check-react-server-compatibility.mjs`
