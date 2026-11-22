# Git workflow

This document owns how a change moves through Git and GitHub here: branches,
pull requests, risk tiers and merging. Why the repository exists and how a
consumer need reaches a release is in [Repository intent](intent.md). The
checks to run before committing are in [`AGENTS.md`](../../AGENTS.md#before-committing).

## Branches

- Branch from the latest `main`. Use one branch per pull request.
- Name a branch `<type>/<short-slug>`, where `<type>` is the Conventional
  Commit type of the change (for example `fix/modal-escape`). A branch name
  assigned by an agent harness, such as `claude/<slug>`, is also fine.
- Spec Kit feature work uses [feature branch names](#feature-branches)
  instead, because the verification gate reads the feature and slice from them.
- Never push to `main`. Never rewrite history on someone else's branch.

### Feature branches

Spec Kit allocates the feature number and creates the specification branch as
`{number}-{slug}`, matching `specs/{number}-{slug}/`. Later branches keep the
same number:

| Branch                         | Holds                                                            |
| ------------------------------ | ---------------------------------------------------------------- |
| `{number}-{slug}`              | The specification, or the combined specification and plan        |
| `{number}-{slug}-plan`         | The plan (High new behaviour only)                               |
| `{number}-{slug}-impl`         | The first implementation slice                                   |
| `{number}-{slug}-impl-<slice>` | Each further slice, using the lower-case slice ID from `plan.md` |

Do not put the GitHub issue number in the branch name; issue numbers and Spec
Kit numbers are different sequences. Name the issue in the pull request title
and body. Before planning, tasks or implementation, set
`SPECIFY_FEATURE_DIRECTORY` to `specs/{number}-{slug}`, so a missing or stale
`.specify/feature.json` cannot point at a different specification.

## Commits

Commits follow Conventional Commits; commitlint and lint-staged run in the
Husky hooks and must not be bypassed. Keep commits small and focused. Commit
per workspace package where that makes sense (constitution, "Commit
discipline").

## Pull requests

- One pull request per change, or per phase and slice for High new behaviour
  and specified Standard work (see [Process by tier](#process-by-tier)).
- Use the [pull request template](../../.github/pull_request_template.md).
- The PR title is a Conventional Commit subject. It becomes the commit subject
  on `main`, so it is the durable history: make it say what changed for a
  reader of `git log`.
- Link issues with `Closes` or `Contributes to` as described in
  [Cross-repository links](intent.md#cross-repository-links).

### Decisions for the reviewer

The first section of every pull request body. It lists what the reviewer has
to decide or accept, so they do not have to dig it out of the evidence:

- Three to five bullets, each labelled **Tradeoff**, **Contract change**,
  **Accepted limitation**, **Beyond scope**, **Evidence substitution** or
  **Outstanding manual check**.
- Every limitation, workaround, check that was not run or did not pass, and
  pending manual check mentioned anywhere else in the body must also appear
  here.
- With nothing to decide, write:
  `None: stays inside the stated contract, with no limitations.`

## Risk tiers

Process weight follows risk. Each delivery issue and each pull request has one
tier: **High**, **Standard** or **Light**. The tier decides what evidence the
work needs and whether new behaviour needs a specification pull request first.

### Triggers

Work is **High** when any of these holds:

| Trigger                                                                                                                                                                       | Where to check                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Removes or renames a published token or CSS custom property, or changes what one means                                                                                        | `packages/styles/src/_*.scss`, `packages/styles/src/_components-custom-properties.scss`, `packages/styles/src/theme-default.scss`; the `pnpm lint:tokens` output                      |
| Removes or renames a `.pathable-*` component, element, modifier or utility class, or a JavaScript helper                                                                      | `packages/styles/src/pathable-component-wrappers/`, `packages/styles/src/_utilities*.scss`, `packages/styles/src/js/`                                                                 |
| Removes or renames a React export, or removes, renames or narrows a public prop or its type                                                                                   | `packages/react/src/index.ts` and the components it re-exports; the generated declarations checked by `check:types`                                                                   |
| Changes package entry points                                                                                                                                                  | `exports`, `files`, `main`, `module` or `types` in `packages/styles/package.json` or `packages/react/package.json`                                                                    |
| Adds or removes a runtime or peer dependency, changes its range to a new major, or narrows a peer range                                                                       | `dependencies` or `peerDependencies` in `packages/styles/package.json` or `packages/react/package.json`                                                                               |
| Changes keyboard, focus or ARIA behaviour of an interactive component (focus trapping, Escape handling, roving focus, `aria-*` state, `inert`)                                | Component source in `packages/react/src/components/` or `packages/styles/src/js/`, and the interaction stories that cover it                                                          |
| Changes the theming API                                                                                                                                                       | `packages/react/src/theme/` (`createTheme`, `ThemeProvider`, `tokens.ts`); the overridable tokens in [`docs/theming/token-vocabulary.md`](../theming/token-vocabulary.md)             |
| Changes a package's consumer agent guidance contract: removes or reverses advice, or changes required imports, entry points, theming or server/client boundaries it describes | Source pages in `components/` that build `packages/styles/components/`, the future committed styles guidance entry point, or retained `packages/react/agent-guidance/pathable-react/` |
| Needs a major changeset                                                                                                                                                       | The `.changeset/*.md` file in the pull request                                                                                                                                        |

Otherwise, work is **Standard** when it changes the public contract additively
or changes what a consumer sees:

- a new component, element, variant, modifier, prop, token, utility, export or
  JavaScript helper;
- a visible change to existing rendering, such as a token value, spacing,
  typography or layout change in an existing class;
- additive consumer agent guidance for new public API.

A change to a committed [pixel visual-regression](../testing/visual-regression.md)
baseline in either Storybook workspace is a visible rendering change, so it
makes work Standard rather than Light. The converse holds only as far as the
baselines reach, which is only the stories listed under
[Coverage today](../testing/visual-regression.md#coverage-today). A rendering
change that shows only in other stories updates no baseline, so judge it from
the change itself.

Otherwise, work is **Light**: documentation, tests, stories for existing
behaviour, repository tooling, CI, dependency updates (including lockfile-only
updates and minor or patch range bumps of runtime dependencies), generated Spec
Kit upgrades, and refactors or fixes that stay inside an existing contract with
no consumer-visible change (same exports and declarations, no baseline change,
and no visible rendering change outside baseline coverage). A dependency update
that changes rendering is Standard.

When it is unclear whether a trigger matches, use the higher tier.

Examples: [#264](https://github.com/PathableAI-org/styles/issues/264) (a
non-dismissible Modal with an inert background) changes focus and ARIA
behaviour, so it is High. [#262](https://github.com/PathableAI-org/styles/issues/262)
(router-aware `Link`) adds a composition point; it is Standard if the existing
props and link semantics are untouched, and High if the design changes them.

### Tiers and changesets

The changeset bump sets a minimum tier; a trigger can raise it. Changeset
rules themselves are in [`.changeset/README.md`](../../.changeset/README.md),
and version semantics in constitution principle XIII.

| Changeset in the pull request                               | Minimum tier |
| ----------------------------------------------------------- | ------------ |
| `major`                                                     | High         |
| `minor` marked `**Breaking change**` (packages below 1.0.0) | High         |
| `minor`                                                     | Standard     |
| `patch` with a consumer-visible change                      | Standard     |
| `patch` with no consumer-visible change                     | Light        |
| None (no published package code changed)                    | Light        |

A High trigger does not by itself mean `major`: a compatible keyboard fix to an
interactive component is High with a `patch` changeset.

Both packages are below 1.0.0, so breaking changes currently ship as `minor`
with a breaking-change label (constitution principle XIII).

### Process by tier

| Work                | Pull requests                                                                                                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High, new behaviour | A specification pull request (`spec.md`, `verification.md`), then a plan pull request (`plan.md` with its slice table, `quickstart.md`), then one pull request per [implementation slice](#implementation-slices) |
| High, fix           | One pull request that names its triggers and numbers its claims in the Evidence table                                                                                                                             |
| Standard, specified | One combined specification-and-plan pull request, then one pull request per implementation slice                                                                                                                  |
| Standard, otherwise | One pull request with normal CI, a code review subagent and, when it touches a rendering path, a visual review subagent; it merges under [agent merge](#agent-merge)                                              |
| Light               | One pull request with normal CI, a code review subagent and, when it touches a rendering path, a visual review subagent; it merges under [agent merge](#agent-merge)                                              |

Each specification, plan or combined phase merges on a person's approval
before the next starts (see [Spec Kit](spec-kit.md) for the artifacts).
Standard and Light implementation pull requests then merge under
[agent merge](#agent-merge); High ones on a person's approval. A High feature combines
specification and plan only as the maintainer's explicit choice for a small,
coherent feature, recorded in the pull request body.

Standard work is one pull request by default, new behaviour included. It
becomes **specified** only when the maintainer asks for a specification, for
example for a new component or multi-state interactive behaviour, and records
that in the delivery issue; it then runs as a combined specification-and-plan
pull request and verified slices. An agent may suggest specifying Standard
work, but never specifies, waives or combines a phase on its own.

#### Visual-only styles work

Specifications are for behaviour, not appearance. Work that only changes how
`@pathableai/styles` looks never gets a Spec Kit specification, plan or slices,
at any tier. It is visual-only when every changed path is in `packages/styles`
(SCSS, tokens, fonts, icons and other assets), its styles stories,
`apps/storybook` or `visual-baselines/`, and it changes no behaviour: no
JavaScript helper, no keyboard, focus or ARIA behaviour, no interaction story's
play function asserting new behaviour, and no React source or API.

- **Standard or Light.** One pull request, with the code review and the
  [visual review](visual-review.md) as its evidence, merged under
  [agent merge](#agent-merge).
- **High** (for example renaming or removing a token or class). One pull
  request that runs like a High fix: numbered claims in its Evidence table,
  code review, verification and visual review, and a person's merge. Migration notes go in
  the changeset as usual.

A change that adds React API for the new appearance, or any behaviour, is not
visual-only. Split the visual part out first when it can land on its own, as
source-first sequencing asks.

Evidence each tier needs, in addition to the checks in
[`AGENTS.md`](../../AGENTS.md#before-committing) for the files changed:

- **Light.** The applicable checks pass. For a refactor or fix inside
  published source, say why there is no consumer-visible change (for example
  the pixel visual-regression suites pass with no baseline change, every
  state the change can affect has baselines, and the declarations are
  unchanged).
- **Standard.** Everything for Light, plus:
  - a deterministic, named story for each new or changed state, in the styles
    Storybook first and then the React Storybook (constitution XIV);
  - `pnpm test:storybook-styles` and/or `pnpm test:storybook-react`, which run
    the Storybook test-runner with rendered accessibility checks;
  - `pnpm test:visual`, and the pixel visual-regression suites with every
    baseline update reviewed in the pull request's file diff; for a rendering
    change the baselines do not cover, screenshots or story links in the pull
    request;
  - for `packages/react`: `pnpm --filter @pathableai/react test:unit`,
    `pnpm build`, `pnpm --filter @pathableai/react check:package` and
    `pnpm --filter @pathableai/react check:types`;
  - `pnpm check:agent-guidance` when public API changed, with the guidance
    updated where
    [the review rule](../../.github/instructions/react-agent-guidance.instructions.md)
    requires it;
  - a changeset.
- **High.** Everything for Standard, plus:
  - interaction stories that exercise the changed keyboard, focus and ARIA
    behaviour with accessible queries, for every affected component;
  - `pnpm test:next-consumer` when entry points, dependencies or
    server/client boundaries change;
  - a package-content check (`pnpm pack --dry-run` or the `check:package` and
    `check:types` scripts) when entry points or files change;
  - migration notes in the changeset for any removal or rename;
  - numbered claims, each with its result and evidence: from `verification.md`
    for new behaviour, or in the Evidence table for a fix.

### Recording and changing a tier

- The delivery issue's **Risk tier** section names the tier and every trigger
  that matched, or the condition that makes the work Standard or Light. An
  agent drafting the issue proposes the tier; the maintainer sets it.
- Each pull request states its tier and triggers in its **Tier** section.
- Each delivery issue and each pull request carries exactly one label:
  `risk:high`, `risk:standard` or `risk:light`. The label is the filterable
  copy of the tier; the body records the triggers and reasons. When a tier
  changes, change the label in the same step.
- Each issue labelled `bug` also carries exactly one package label,
  `package:styles` or `package:react`, for the package the defect is in. A bug
  that affects both packages is filed as two issues, one per package, each
  linking the other. A bug in neither package, such as repository tooling,
  carries neither label.
- Anyone, including an agent, may raise a tier at any point by recording the
  trigger that matched. Work already approved stays approved; add the evidence
  the higher tier needs.
- Only the maintainer may lower a tier, and records the reason in the issue or
  pull request. An agent never lowers a tier.

### Verification and review

Every delivery issue runs in one lead session, which runs the independent
checks as clean-context subagents. [Orchestration](orchestration.md) owns
which subagents each tier gets, the stop points and the models.

- **Claims.** The specification's `verification.md` numbers the claims a
  feature makes (`V-001`, `V-002`, …), each with the observation that tells it
  apart from its violation and the evidence channel that can see it. A High
  fix numbers its claims in the pull request's Evidence table instead.
  [The verification harness](verification-harness.md) owns the channels and
  what each tier's `verification.md` holds.
- **Verification.** A verifier subagent checks each pushed slice in its
  own detached worktree, through the Storybooks and the packed packages, and
  records a schema-checked report in a Git note on the exact pushed SHA.
- **Review.** A code review subagent reviews the same SHA with a clean context
  against the constitution's lenses and records its findings the same way
  ([Code review](code-review.md)).
- **Gate.** `pnpm verify:gate` passes only when the slice's latest report
  establishes its claims and its latest review has no open blocking finding.
  A Claude Code hook runs the gate on every attempt to mark a pull request
  ready, and blocks a failing one.
- **For High work, human review is still the approval.** The reports and
  reviews are input to it, as are passing checks and Copilot's comments.
- **For Standard and Light work, the reviews replace it.** Specified Standard
  slices also get a [visual review](visual-review.md), and merge under
  [agent merge](#agent-merge).

Other Standard work and Light work get no verifier subagent and no
`verification.md`. They get normal CI, the checks the pull request names, a
[code review subagent](code-review.md) and, when they touch a rendering path,
a [visual review subagent](visual-review.md), and then merge under
[agent merge](#agent-merge). Every tier runs the advisory
[pre-push self-review](code-review.md#pre-push-self-review).

## Implementation slices

The plan divides implementation into slices. Each slice is one pull request:

- **One decision.** A reviewer can accept the slice without also accepting a
  later one.
- **Source first.** A slice that adds React API for new visual behaviour comes
  after, or includes, the slice that adds the `@pathableai/styles` contract and
  its styles stories (constitution I and IV).
- **About 15 hand-written files at most.** Lockfile changes, visual
  baselines and generated output are listed separately. When no coherent stopping point
  exists below that size, the plan and the pull request body say why.
- **Vertical.** Each slice passes CI on its own. A public contract lands with
  its first consumer, its stories and its evidence, not ahead of them.
- **Verified.** A slice is marked ready only after its latest verification
  report and review pass [the gate](verification-harness.md#gate-and-escalation).

Slices are sequential. While slice N's pull request is open, slice N+1 may
branch from N's branch and target it as its base; after N merges, GitHub
retargets N+1 to `main`, and its session merges `origin/main` into it. Agents
cannot force-push here, so a correction moves upward by merging the lower
branch into the upper one, never by rebasing a pushed branch. The repository
squash-merges, so the merge commits never reach `main`. This repository does
not use the `gh stack` extension or GitHub's native stacks, as
[Orchestration](orchestration.md#decisions) records.

If the planned slices cannot meet these rules, change the plan's slices
through the [corrections](#corrections) path rather than letting one slice
grow.

## Merge timing

- The repository squash-merges, with the pull request title as the commit
  subject.
- Standard and Light pull requests merge under [agent merge](#agent-merge):
  the lead session merges its own pull request, without a person's
  approval, once the merge gate passes.
- Every other pull request merges only after a person has approved it, and an
  agent merges one only when a person has approved it and explicitly asked
  that agent to merge it. That covers High work, specification, plan and
  combined pull requests, [guardrail changes](#guardrail-changes), a pull
  request labelled `hold`, and any escalated pull request. Passing checks and
  bot review comments are not approval.
- Renovate's automerge (configured in [`renovate.json5`](../../renovate.json5))
  is the maintainer's standing exception for dependency updates. It never
  automerges major upgrades, or `react`, `react-dom`, `next` or `@uswds/uswds`,
  so High-tier dependency changes still wait for a person.
- Merging the `ci: version packages` pull request starts publishing to npm,
  which then waits for a person to approve the `npm` environment deployment.
  A person decides both, at every tier.

## Agent merge

This repository lets agents carry work that is not High from issue to `main`
without a person in the loop. A person can still read, comment on, label
`hold` or revert anything an agent merges. What replaces their approval is two
independent reviews with clean contexts, recorded and checked by a gate:

- a [code review subagent](code-review.md), on a different model from the
  implementation, for every agent-merged pull request
- a [visual review subagent](visual-review.md), for every agent-merged pull
  request that can change what the Storybooks render

### Which pull requests

An agent may merge a pull request when all of these hold:

- It is labelled `risk:standard` or `risk:light`, and the tier is right under
  [Triggers](#triggers). When in doubt the tier is High, as always, and an
  agent never lowers a tier.
- It is single-pull-request work, or an implementation slice of specified
  Standard work. Specification, plan and combined pull requests are decisions,
  and a person approves them.
- It changes no [guardrail file](#guardrail-changes).
- It is not the `ci: version packages` release pull request.
- It is not labelled `hold`, has no unresolved escalation, and no person has
  left a review requesting changes on it.

A person stops agent merge on one pull request by adding the `hold` label, and
resumes it by removing the label. A person's review that requests changes
also stops it until that person approves or dismisses the review.

### Guardrail changes

A pull request that changes any of these waits for a person, whatever its
tier, because it changes the rules agents work under:

- `.claude/`, `scripts/claude/` and `.agents/skills/`
- the ESLint, stylelint, markdownlint, Prettier, lint-staged, Husky and
  commitlint configuration, `scripts/accessibility-exceptions.mjs` and any
  `tsconfig*.json`
- `.github/` (workflows, instructions and templates), `renovate.json5` and
  `.changeset/config.json`
- the gates, their commands and their notes tooling: `scripts/merge-gate.mjs`,
  `scripts/merge-hook.mjs`, `scripts/ready-hook.mjs`,
  `scripts/guardrail-write.mjs`, `scripts/verification.mjs`,
  `scripts/verification/`,
  `scripts/review-findings.mjs`, `scripts/review-findings/`,
  `scripts/visual-review.mjs`, `scripts/visual-review/`,
  `scripts/note-sync.mjs`, `scripts/note-sync/`, `scripts/note-store.mjs`,
  `scripts/schema-checks.mjs`, `scripts/git-access.mjs`,
  `scripts/github-access.mjs`, `scripts/cli.mjs`, and the CLIs
  `scripts/merge.mjs`, `scripts/verify.mjs`, `scripts/review.mjs`,
  `scripts/visual.mjs` and `scripts/notes.mjs`
- the root `package.json`, whose scripts name those commands
- `.specify/memory/constitution.md`, every `AGENTS.md`, `CLAUDE.md`, and the
  process documents in `docs/engineering/`

The list lives in code, in `guardrailPaths` in
[`scripts/merge-gate.mjs`](../../scripts/merge-gate.mjs); change both
together. [`.github/CODEOWNERS`](../../.github/CODEOWNERS) lists the same paths
and must change with them.

### The flow

One [lead session](orchestration.md#the-loop-by-tier) does the work and runs
the reviews as subagents. For single-pull-request work:

1. The lead session branches from `origin/main`, implements, runs
   the [Before committing](../../AGENTS.md#before-committing) checks and the
   [pre-push self-review](code-review.md#pre-push-self-review), and pushes a
   draft pull request with its `risk:` label.
2. On each push it runs the code review subagent and, when the pull request
   touches a [rendering path](visual-review.md#when-a-visual-review-runs),
   the visual review subagent, both on the same SHA, with slice ID `fix` for
   the code review.
3. The lead session answers every finding with a fix or a written
   justification, and pushes a new round until neither review has an open
   blocking finding or escalation.
4. It marks the pull request ready, keeps it [up to date](#keeping-up-to-date)
   with `main`, and waits for CI on the head.
5. When `pnpm merge:gate` passes, it merges with the GitHub MCP tool
   `merge_pull_request` and `merge_method: squash`, and notifies the person.

Implementation slices of specified Standard work follow the same steps, with
the verifier subagent as well: the slice is reviewed, visually reviewed
and verified, and the [verification gate](verification-harness.md#gate-and-escalation)
must pass at the head.

### Keeping up to date

The lead session keeps its pull request current with `main` until
it merges. When `main` moves, it merges `origin/main` into the branch, or uses
the GitHub MCP tool `update_pull_request_branch`, and pushes. It never rebases
or force-pushes. The ruleset on `main` requires branches to be up to date, and
the merge gate checks it too.

Updating from `main` changes the head SHA. A code review or visual review
still covers the new head when the commits after the reviewed SHA only merge
the base branch in and the pull request's own diff is unchanged: the patch ID
of `git diff --binary <merge-base>..<sha>` is the same at the reviewed SHA and
at the head, with the merge base taken against `origin/main` each time. A
conflict resolution, or `main` changing a line the pull request's diff carries
as context, changes the patch ID, and the lead session requests a
new round. A verification report is an observation of one SHA and does not
carry over this way: a slice that merges `main` in needs a new verification
round.

### The merge gate

`pnpm merge:gate <pr>` syncs the pull request's note comments and passes only
when all of these hold:

- the pull request is open, not a draft, targets `main` and is eligible under
  [Which pull requests](#which-pull-requests)
- its head is not behind `main`
- every check run and commit status on the head has finished, at least one
  exists, and none failed, timed out or was cancelled; a skipped or neutral
  check passes
- the latest code review covers the head, as above, with no open blocking
  finding or escalation; for single-pull-request work its slice ID is `fix`
- when the pull request touches a rendering path, the latest visual review
  covers the head with no open blocking finding or escalation
- for an implementation slice, `pnpm verify:gate` passes at the head

A Claude Code `PreToolUse` hook runs the gate whenever a session tries to
merge a pull request:

- the GitHub MCP tool `merge_pull_request`: the hook approves the merge when
  the gate passes, blocks it with every failing reason when the pull request
  is eligible but the gate fails, and asks the person when the pull request is
  not eligible for agent merge, so a person's explicit request still works
- `gh pr merge` and a `gh api` or `curl` call to a pull request's `merge`
  route: the hook asks the person for a pull request that is not eligible, and
  otherwise blocks and names the MCP tool, so the gate approves exactly one
  action
- the GitHub MCP tool `enable_pr_auto_merge` and `gh pr merge --auto`: always
  blocked, because GitHub's auto-merge would merge later without the gate

Known limits: the hook covers Claude Code sessions only. It cannot see a
person's merge in the web interface, another HTTP client or another GitHub MCP
server name. The workflows expose two aggregate checks, `CI result` and
`Storybook result`, meant to be the ruleset's required checks. Until a
maintainer requires them in the ruleset on `main`, GitHub itself would merge a
pull request with failing checks, and the gate is what stops an agent from
doing so.

Temporarily, for the `@pathableai/styles` refactor described in
[Target state](target-state.md) (it began with the component reset,
[PR #607][reset-pr]), the repository is in a refactor, planning and
documentation phase, and CI checks only two things: that the Markdown lints
(`pnpm lint:md`, the `Markdownlint` job in `ci-full.yml`) and that the styles
Storybook builds (the `Build styles Storybook` job in `storybook-quality.yml`,
and the build in `docs-deploy.yml`, which publishes it to GitHub Pages from
`main`). Everything else is gated with `if: false` in the workflows, not
deleted, and skipped:

- In `ci-full.yml`: `js-lint` (ESLint and the repository tooling tests),
  `format` (Prettier), `react-typecheck`, `react-build`, `next-consumer` and
  `agent-guidance-impact`. The `stylelint` job (including the token lint) is
  enabled again: on a pull request it lints only the changed `.scss` files.
- In `storybook-quality.yml`: the accessibility tests (styles and React),
  `visual-smoke`, `pixels-styles`, `coverage`, `quality-gates` and
  `component-pages`. The build no longer builds `@pathableai/react` or the
  React Storybook.
- In `docs-deploy.yml`: the token lint, Storybook coverage, the accessibility
  tests, the component-page records cache and the visual smoke tests. The
  deploy builds only the styles Storybook, once, with the `/styles/` base path.
- In `fixtures.yml`: the `React fixture tests` job. The `Fixtures` job runs
  only for the `alert`, `breadcrumb`, `button`, `button-group`, `tokens-*` and `utilities-*` folders (the `REENABLED_FOLDERS` variable); see
  [Fixtures in CI](../testing/fixtures.md#in-ci).

The reason is that the component pages describe target `pathable-*` classes
the SCSS does not have yet, so most checks would fail or test code being
replaced. The Storybook is documentation of the components being defined: it
has no `React` reference and no `Fixtures` section, and its component pages
show HTML and CSS only. The fixture stories that back the page previews still
exist but are hidden from the sidebar.

This does not contradict the gate's "none failed" rule. GitHub's required
checks are the aggregate jobs `CI result` and `Storybook result`. They treat
skipped jobs as passing, so they are green when Markdownlint and the Storybook
build pass. `pnpm merge:gate` reads every check run and commit status on the
head and also accepts skipped ones, so the disabled jobs do not block it.

Say in the pull request's Evidence or Validation section which checks did not
run. Re-enable the gated jobs and steps when the refactor lands.

[reset-pr]: https://github.com/PathableAI-org/styles/pull/607

## Corrections

Change the earliest phase that owns the decision.

| Discovery                                                  | Owner                                           |
| ---------------------------------------------------------- | ----------------------------------------------- |
| Algorithm, private implementation or story layout          | Implementation                                  |
| Component class, token, prop, export, entry point or slice | Plan                                            |
| Claim, observation or evidence channel                     | Specification                                   |
| Scope of the delivery issue                                | The maintainer. Stop the affected feature work. |

When the owning pull request is still open, fix that branch, merge it upward
into each open branch above it, rerun the affected checks, and ask for review
where a decision changed. When the owning phase is already on `main`, open a
corrective pull request for that phase, merge it on approval, and merge
`origin/main` into the open slice branches. Do not hide the correction inside
an implementation branch.

A merge does not renew approval, and by itself does not renew evidence. A
slice keeps its verification report and review only when
[the gate](verification-harness.md#gate-and-escalation) finds that the diff
from the verified or reviewed commit to the new head changes nothing but the
feature's `quickstart.md` execution results. The one exception is the
[merge gate](#the-merge-gate), which keeps a code review or visual review
across an update from `main` that leaves the pull request's own diff
unchanged, as [Keeping up to date](#keeping-up-to-date) defines. Report which decisions changed,
which public contracts are affected, and which evidence must be repeated.

## Working without GraphQL

Claude Code cloud sessions reach GitHub's REST API but not GraphQL, and `gh pr`
and `gh issue` subcommands use GraphQL, so they fail there with HTTP 403. Do
not retry them or ask for a network change. Use the replacements for the rest
of the session; every gate in this document applies to them unchanged.

| Step with GraphQL                | Replacement                                                                                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `gh pr view`                     | `gh api repos/{owner}/{repo}/pulls/N`, or the MCP tool `pull_request_read`                                                    |
| `gh pr create --draft`           | The MCP tool `create_pull_request` with `draft: true`                                                                         |
| `gh pr edit`                     | The MCP tool `update_pull_request` (`title`, `body`, `base`)                                                                  |
| `gh pr ready`                    | The MCP tool `update_pull_request` with `draft: false`, or `gh api -X POST repos/{owner}/{repo}/pulls/N/ccr/ready_for_review` |
| `gh pr ready --undo`             | `update_pull_request` with `draft: true`, or `gh api -X POST repos/{owner}/{repo}/pulls/N/ccr/convert_to_draft`               |
| `gh pr merge`                    | The MCP tool `merge_pull_request` with `merge_method: squash`, under [Merge timing](#merge-timing)                            |
| `gh issue view`, `gh issue list` | `gh api repos/{owner}/{repo}/issues/N`, or the MCP tool `issue_read`                                                          |

The ready hook gates the MCP update and the REST route exactly as it gates
`gh pr ready`; see [the verification gate](verification-harness.md#gate-and-escalation).
The `ccr/` routes are the cloud proxy's and have not yet been exercised from
this repository; confirm them on first use.
