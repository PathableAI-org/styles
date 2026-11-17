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
`.specify/feature.json` cannot point at a different specification. In a cloud
session, the orchestrator sets the branch when it starts the session.

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

| Trigger                                                                                                                                                                 | Where to check                                                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Removes or renames a published token or CSS custom property, or changes what one means                                                                                  | `packages/styles/src/_*.scss`, `packages/styles/src/_components-custom-properties.scss`, `packages/styles/src/theme-default.scss`; the `pnpm lint:tokens` output          |
| Removes or renames a `.pathable-*` component, element, modifier or utility class, or a JavaScript helper                                                                | `packages/styles/src/pathable-component-wrappers/`, `packages/styles/src/_utilities*.scss`, `packages/styles/src/js/`                                                     |
| Removes or renames a React export, or removes, renames or narrows a public prop or its type                                                                             | `packages/react/src/index.ts` and the components it re-exports; the generated declarations checked by `check:types`                                                       |
| Changes package entry points                                                                                                                                            | `exports`, `files`, `main`, `module` or `types` in `packages/styles/package.json` or `packages/react/package.json`                                                        |
| Adds or removes a runtime or peer dependency, changes its range to a new major, or narrows a peer range                                                                 | `dependencies` or `peerDependencies` in `packages/styles/package.json` or `packages/react/package.json`                                                                   |
| Changes keyboard, focus or ARIA behaviour of an interactive component (focus trapping, Escape handling, roving focus, `aria-*` state, `inert`)                          | Component source in `packages/react/src/components/` or `packages/styles/src/js/`, and the interaction stories that cover it                                              |
| Changes the theming API                                                                                                                                                 | `packages/react/src/theme/` (`createTheme`, `ThemeProvider`, `tokens.ts`); the overridable tokens in [`docs/theming/token-vocabulary.md`](../theming/token-vocabulary.md) |
| Changes the consumer agent guidance's contract: removes or reverses advice, or changes required imports, entry points, theming or server/client boundaries it describes | `packages/react/agent-guidance/pathable-react/`                                                                                                                           |
| Needs a major changeset                                                                                                                                                 | The `.changeset/*.md` file in the pull request                                                                                                                            |

Otherwise, work is **Standard** when it changes the public contract additively
or changes what a consumer sees:

- a new component, element, variant, modifier, prop, token, utility, export or
  JavaScript helper;
- a visible change to existing rendering, such as a token value, spacing,
  typography or layout change in an existing class (a `test:visual` snapshot
  changes);
- additive consumer agent guidance for new public API.

Otherwise, work is **Light**: documentation, tests, stories for existing
behaviour, repository tooling, CI, dependency updates (including lockfile-only
updates and minor or patch range bumps of runtime dependencies), generated Spec
Kit upgrades, and refactors or fixes that stay inside an existing contract with
no consumer-visible change (same exports and declarations, no `test:visual`
snapshot change). A dependency update that changes rendering is Standard.

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
| Standard, otherwise | One pull request with normal CI                                                                                                                                                                                   |
| Light               | One pull request with normal CI                                                                                                                                                                                   |

Each phase merges on a person's approval before the next starts (see
[Spec Kit](spec-kit.md) for the artifacts). A High feature combines
specification and plan only as the maintainer's explicit choice for a small,
coherent feature, recorded in the pull request body.

Standard work is one pull request by default, new behaviour included. It
becomes **specified** only when the maintainer asks for a specification, for
example for a new component or multi-state interactive behaviour, and records
that in the delivery issue; it then runs as a combined specification-and-plan
pull request and verified slices. An agent may suggest specifying Standard
work, but never specifies, waives or combines a phase on its own.

Evidence each tier needs, in addition to the checks in
[`AGENTS.md`](../../AGENTS.md#before-committing) for the files changed:

- **Light.** The applicable checks pass. For a refactor or fix inside
  published source, say why there is no consumer-visible change (for example
  `pnpm test:visual` with no snapshot change, and unchanged declarations).
- **Standard.** Everything for Light, plus:
  - a deterministic, named story for each new or changed state, in the styles
    Storybook first and then the React Storybook (constitution XIV);
  - `pnpm test:storybook-styles` and/or `pnpm test:storybook-react`, which run
    the Storybook test-runner with rendered accessibility checks;
  - `pnpm test:visual`, with every snapshot update reviewed and screenshots or
    story links in the pull request;
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
- Anyone, including an agent, may raise a tier at any point by recording the
  trigger that matched. Work already approved stays approved; add the evidence
  the higher tier needs.
- Only the maintainer may lower a tier, and records the reason in the issue or
  pull request. An agent never lowers a tier.

### Verification and review

High new behaviour, specified Standard work, and High fixes, run as separate
agent sessions that an orchestrator starts and briefs. [Orchestration](orchestration.md)
owns which sessions each tier gets, the stop points and the models.

- **Claims.** The specification's `verification.md` numbers the claims a
  feature makes (`V-001`, `V-002`, …), each with the observation that tells it
  apart from its violation and the evidence channel that can see it. A High
  fix numbers its claims in the pull request's Evidence table instead.
  [The verification harness](verification-harness.md) owns the channels and
  what each tier's `verification.md` holds.
- **Verification.** A verification session checks each pushed slice in its
  own detached worktree, through the Storybooks and the packed packages, and
  records a schema-checked report in a Git note on the exact pushed SHA.
- **Review.** A review session reviews the same SHA with a clean context
  against the constitution's lenses and records its findings the same way
  ([Code review session](code-review.md)).
- **Gate.** `pnpm verify:gate` passes only when the slice's latest report
  establishes its claims and its latest review has no open blocking finding.
  A Claude Code hook runs the gate on every attempt to mark a pull request
  ready, and blocks a failing one.
- **Human review is still the approval.** The reports and reviews are input to
  it, as are passing checks and Copilot's comments.

Other Standard work and Light work get none of this: normal CI, the checks
the pull request names, and human review. Every tier runs the advisory
[pre-push self-review](code-review.md#pre-push-self-review).

## Implementation slices

The plan divides implementation into slices. Each slice is one pull request:

- **One decision.** A reviewer can accept the slice without also accepting a
  later one.
- **Source first.** A slice that adds React API for new visual behaviour comes
  after, or includes, the slice that adds the `@pathableai/styles` contract and
  its styles stories (constitution I and IV).
- **About 15 hand-written files at most.** Lockfile changes, snapshots and
  generated output are listed separately. When no coherent stopping point
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
- A pull request merges only after a person has approved it. An agent merges
  only when a person has approved the pull request and explicitly asked that
  agent to merge it. Passing checks and bot review comments are not approval.
- Renovate's automerge (configured in [`renovate.json5`](../../renovate.json5))
  is the maintainer's standing exception for dependency updates. It never
  automerges major upgrades, or `react`, `react-dom`, `next` or `@uswds/uswds`,
  so High-tier dependency changes still wait for a person.
- Merging the `ci: version packages` pull request publishes to npm. A person
  decides when that happens.

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
feature's `quickstart.md` execution results. Report which decisions changed,
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
