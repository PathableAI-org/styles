# Git workflow

This document owns how a change moves through Git and GitHub here: branches,
pull requests, risk tiers and merging. How a consumer need reaches a release is
in [How a consumer need flows](#how-a-consumer-need-flows). The
checks to run before committing are in [`AGENTS.md`](../../AGENTS.md#before-committing).

## How a consumer need flows

Open delivery issues in this repository are the backlog; there is no roadmap
file. An organization-level GitHub Project orders them, alongside consumer work
in other PathAble repositories.

1. **File it here.** A consumer that needs something it cannot do with the
   released packages files an issue in this repository. A consumer may file a plain issue; a
   maintainer runs `/to-spec` on it (the
   [`to-spec` skill](../../.agents/skills/to-spec/SKILL.md)) to make it a
   spec. The spec states the outcome, links the consumer's own issue or pull request, and
   proposes a [risk tier](#risk-tiers). Issues
   [#262](https://github.com/PathableAI-org/styles/issues/262) (router-aware
   links) and [#264](https://github.com/PathableAI-org/styles/issues/264)
   (blocking modal) are examples: each describes current behaviour in a named
   release, the consumer's use case, and what "done" looks like.
2. **Land it source-first.** New visual behaviour, classes, tokens and assets
   land in `packages/styles` first.
   React is deferred during the current refactor and changes only when an issue
   explicitly puts it in scope. In that separate scope, an adapter change still
   begins from the existing styles contract; a change that only adds React
   ergonomics over that contract can land in `packages/react` alone.
3. **Record the release.** A pull request that changes anything a published
   package ships carries a changeset, written with the
   [`changeset` skill](../../.agents/skills/changeset/SKILL.md).
4. **Release it.** On `main`, [`publish.yml`](../../.github/workflows/publish.yml)
   opens or updates the `ci: version packages` pull request. Once that pull
   request merges, the workflow's publish job waits in the protected `npm`
   environment, and publishes the new versions to npm when a person approves
   it. Merges that release nothing never wait for approval.
5. **Adopt it.** Renovate in the consuming repository opens the version bump.
   The consumer then uses the new contract, guided by the updated agent
   guidance.

## Cross-repository links

- Write cross-repository references as full issue or pull request URLs, not
  `owner/repo#123` shorthand, so they read the same in every tool and in
  copied text.
- In a pull request body, use `Closes <url-or-#n>` only when merging that pull
  request satisfies the issue. Otherwise use `Contributes to <url-or-#n>`.
- Because a consumer need is done only on release (see What "done" means), the pull request
  that implements it normally says `Contributes to`. Close the issue by hand
  once the release that contains it is published, and link that release.
- Link back the other way too: comment on the consumer's issue with the styles
  issue URL, and later with the released version.

## What "done" means

A consumer need is done when a published version of `@pathableai/styles` or
`@pathableai/react` contains it, not when its pull request merges. Merged but
unreleased work is invisible to consumers. The issue's Completion evidence
section names the release and the stories or checks that prove the behaviour;
adoption in the consumer repository is tracked there, not here.

## Branches

- Branch from the latest `main`. Use one branch per pull request.
- Name a branch `<type>/<short-slug>`, where `<type>` is the Conventional
  Commit type of the change (for example `fix/modal-escape`). A branch name
  assigned by an agent harness, such as `claude/<slug>`, is also fine.
- Never push to `main`. Never rewrite history on someone else's branch.

## Commits

Commits follow Conventional Commits; commitlint and lint-staged run in the
Husky hooks and must not be bypassed. Keep commits small and focused. Commit
per workspace package where that makes sense.

## Pull requests

- One pull request per independently reviewable change (see
  [Process by tier](#process-by-tier)).
- Use the [pull request template](../../.github/pull_request_template.md).
- The PR title is a Conventional Commit subject. It becomes the commit subject
  on `main`, so it is the durable history: make it say what changed for a
  reader of `git log`.
- Link issues with `Closes` or `Contributes to` as described in
  [Cross-repository links](#cross-repository-links).

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
work needs and whether the delivery issue needs a maintainer's acceptance
before implementation starts.

### Triggers

Work is **High** when any of these holds:

| Trigger                                                                                                                                                                       | Where to check                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Removes or renames a published token or CSS custom property, or changes what one means                                                                                        | `packages/styles/src/_*.scss`, `packages/styles/src/theme-default.scss`; the `pnpm lint:tokens` output                                                                                |
| Removes or renames a `.pathable-*` component, element, modifier or utility class, or a JavaScript helper                                                                      | `packages/styles/src/pathable-component-wrappers/`, `packages/styles/src/_utilities*.scss`                                                                                            |
| Removes or renames a React export, or removes, renames or narrows a public prop or its type                                                                                   | `packages/react/src/index.ts` and the components it re-exports; the generated declarations checked by `check:types`                                                                   |
| Changes package entry points                                                                                                                                                  | `exports`, `files`, `main`, `module` or `types` in `packages/styles/package.json` or `packages/react/package.json`                                                                    |
| Adds or removes a runtime or peer dependency, changes its range to a new major, or narrows a peer range                                                                       | `dependencies` or `peerDependencies` in `packages/styles/package.json` or `packages/react/package.json`                                                                               |
| Changes keyboard, focus or ARIA behaviour of an interactive component (focus trapping, Escape handling, roving focus, `aria-*` state, `inert`)                                | Component source in `packages/react/src/components/`, and the interaction stories that cover it                                                                                       |
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

Otherwise, work is **Light**: documentation, tests, stories for existing
behaviour, repository tooling, CI, dependency updates (including lockfile-only
updates and minor or patch range bumps of runtime dependencies), and refactors
or fixes that stay inside an existing contract with
no consumer-visible change (same exports and declarations and no visible rendering change). A dependency update
that changes rendering is Standard.

When it is unclear whether a trigger matches, use the higher tier.

Examples: [#264](https://github.com/PathableAI-org/styles/issues/264) (a
non-dismissible Modal with an inert background) changes focus and ARIA
behaviour, so it is High. [#262](https://github.com/PathableAI-org/styles/issues/262)
(router-aware `Link`) adds a composition point; it is Standard if the existing
props and link semantics are untouched, and High if the design changes them.

### Tiers and changesets

The changeset bump sets a minimum tier; a trigger can raise it. Changeset
rules and version semantics are in the
[`changeset` skill](../../.agents/skills/changeset/SKILL.md).

| Changeset in the pull request                               | Minimum tier |
| ----------------------------------------------------------- | ------------ |
| `major`                                                     | High         |
| `minor` marked `**Breaking change**` (packages below 1.0.0) | High         |
| `minor`                                                     | Standard     |
| `patch` with a consumer-visible change                      | Standard     |
| `patch` with no consumer-visible change                     | Light        |
| None (nothing a consumer installs changed)                  | Light        |

A High trigger does not by itself mean `major`: a compatible keyboard fix to an
interactive component is High with a `patch` changeset.

Both packages are below 1.0.0, so breaking changes currently ship as `minor`
with a breaking-change label and migration notes, as the
[`changeset` skill](../../.agents/skills/changeset/SKILL.md) defines.

### Process by tier

| Work                | Required path                                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High, new behaviour | The maintainer accepts the delivery issue's outcome, scope, contract impact, numbered claims and implementation approach before work starts; one pull request follows and a person merges it |
| High, fix           | One pull request that names its triggers and numbers its claims in the Evidence table; a person merges it                                                                                    |
| Standard            | Local code and scope review and, when the classifier requires one, visual review until clean; then one pull request with normal CI, which a person merges                                    |
| Light               | Local code and scope review and, when the classifier requires one, visual review until clean; then one pull request with normal CI, which a person merges                                    |

The delivery issue is the accepted definition of one change. If the work is
too large for one reviewable pull request, split it into separately releasable
delivery issues instead of creating an in-repository specification stack.
Each issue links the others and owns its own tier, scope, claims and evidence.

#### Visual-only styles work

Work is visual-only when every changed path is in `packages/styles`
(SCSS, tokens, fonts, icons and other assets), its styles stories,
or `apps/storybook`, and it changes no behaviour: no
JavaScript helper, no keyboard, focus or ARIA behaviour, no interaction story's
play function asserting new behaviour, and no React source or API.

- **Standard or Light.** One pull request, with the code review, scope review
  and [visual review](visual-review.md) as its evidence, and a person's
  merge.
- **High** (for example renaming or removing a token or class). One pull
  request with numbered claims in its Evidence table,
  code review, scope review, verification and visual review, and a person's merge. Migration notes go in
  the changeset as usual.

A change that adds React API for the new appearance, or any behaviour, is not
visual-only. Split the visual part out first when it can land on its own, as
source-first sequencing asks.

Evidence each tier needs, in addition to the checks in
[`AGENTS.md`](../../AGENTS.md#before-committing) for the files changed:

- **Light.** The applicable checks pass. For a refactor or fix inside
  published source, say why there is no consumer-visible change (for example
  the declarations and compiled CSS are unchanged).
- **Standard.** Everything for Light, plus:
  - a deterministic, named story for each new or changed state, in the styles
    Storybook first and then the React Storybook;
  - `pnpm test:storybook-styles` and/or `pnpm test:storybook-react`, which run
    the Storybook test-runner with rendered accessibility checks;
  - screenshots or story links in the pull request for each rendering
    change;
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
  - numbered claims, each with its result and evidence, in the pull request's
    Evidence table. For new behaviour, the claim IDs and observations must
    match the accepted delivery issue.

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
checks as clean-context subagents on local commits, before the first push.
[Orchestration](orchestration.md) owns which subagents each tier gets, the
stop points and the models.

- **Claims.** High work numbers its claims (`V-001`, `V-002`, …) in the
  delivery issue and the pull request's Evidence table. Each claim names the
  observation that distinguishes it from its violation and the evidence
  channel that can see it. [The verification harness](verification-harness.md)
  owns the channels and reply format.
- **Verification.** A verifier subagent checks the local head in its own
  detached worktree, through the Storybooks and the packed packages, and
  replies to the lead with each claim's result.
- **Review.** A code review subagent and a scope review subagent review the
  same local commits with clean contexts, the first against the owning
  documentation ([Code review](code-review.md)) and the second against the
  accepted scope in the delivery issue. A visual review subagent joins them
  when `visual-capture.mjs --classify` requires one
  ([When a visual review runs](visual-review.md#when-a-visual-review-runs)).
- **Replies only.** Every subagent replies to the lead. None posts anything on
  the pull request. The lead pushes and opens the pull request only when no code,
  visual or verification finding is open as blocking, every scope finding is
  answered and, for High work, every claim is established.
- **A person's review is the approval, at every tier.** The reviewers' replies,
  summarised in the pull request's Evidence section, are input to it, as are
  passing checks and Copilot's comments.

Standard and Light work get no verifier subagent. They get normal CI, the
checks the pull request names, a [code review subagent](code-review.md), a
scope review subagent and, when the classifier requires one, a
[visual review subagent](visual-review.md#when-a-visual-review-runs).

## Merge timing

- The repository squash-merges, with the pull request title as the commit
  subject.
- A person merges every pull request, at every tier, after approving it.
  Agents never merge: `gh pr merge`, the GitHub MCP merge tool, auto-merge,
  and the `gh api` and `curl` routes to a pull request's `merge` or
  `auto_merge` endpoints, the `mergePullRequest` mutation and the
  `enablePullRequestAutoMerge` mutation are denied in `.claude/settings.json`.
  The patterns match command text, so a person reviews any other merge route. Passing checks and bot review
  comments are not approval.
- A person may add the `hold` label to mark a pull request not to merge yet.
  Nothing an agent does reads it.
- Renovate's automerge (configured in [`renovate.json5`](../../renovate.json5))
  is the maintainer's standing exception for dependency updates. It never
  automerges major upgrades, or `react`, `react-dom`, `next` or `@uswds/uswds`,
  so High-tier dependency changes still wait for a person.
- Merging the `ci: version packages` pull request starts publishing to npm,
  which then waits for a person to approve the `npm` environment deployment.
  A person decides both, at every tier.

## Guardrail changes

A pull request that changes any of these waits for a person, whatever its
tier, because it changes the rules agents work under:

- `.claude/`, `scripts/claude/` and `.agents/skills/`
- the ESLint, stylelint, markdownlint, Prettier, lint-staged, Husky and
  commitlint configuration, `scripts/accessibility-exceptions.mjs` and any
  `tsconfig*.json`
- `.github/` (workflows, instructions and templates), `renovate.json5` and
  `.changeset/config.json`
- the guardrail write hook and the list itself: `scripts/guardrail-write.mjs`
  and `scripts/guardrail-paths.mjs`
- the root `package.json`, whose scripts name the repository's commands
- every `AGENTS.md`, `CLAUDE.md`, and the process documents in
  `docs/engineering/`

The list lives in code, in `guardrailPaths` in
[`scripts/guardrail-paths.mjs`](../../scripts/guardrail-paths.mjs); change both
together. [`.github/CODEOWNERS`](../../.github/CODEOWNERS) lists the same paths
and must change with them.

## The flow

One [lead session](orchestration.md#the-loop-by-tier) does the work and runs
the reviews as subagents, all on local commits. For single-pull-request work:

1. The lead session branches from `origin/main` and decides the change. The
   implementer subagent edits and builds it, and a fresh checker subagent runs
   the [Before committing](../../AGENTS.md#before-committing) checks and every
   check the tier's evidence list in [Process by tier](#process-by-tier)
   requires, as
   [Delegating implementation](orchestration.md#delegating-implementation)
   describes. The lead then commits.
2. On the local head it runs the code review subagent and the scope review
   subagent and, when `visual-capture.mjs --classify` requires
   [a visual review](visual-review.md#when-a-visual-review-runs), the visual
   review subagent. High work adds the verifier subagent. Each replies to
   the lead only.
3. The lead session answers every finding with a fix or a written
   justification, and runs a new local round until no code, visual or
   verification finding is open as blocking, no escalation is open, every scope
   finding is answered and, for High work, every claim is established.
4. Only then it pushes and opens the pull request, ready for review, with its
   `risk:` label. It keeps it [up to date](#keeping-up-to-date) with `main`
   and waits for CI on the head. A CI failure goes back through steps 1 to 3
   before the next push.
5. It notifies the person, who reviews and merges. The lead never merges.

## Keeping up to date

The lead session keeps its pull request current with `main` until
a person merges it. When `main` moves, it merges `origin/main` into the
branch locally and runs the checks through a checker. When the merge changes
the pull request's own diff (its patch ID, below), it runs a review round on
the merge before pushing, and it pushes only when that round is clean. It
never uses `update_pull_request_branch` or GitHub's "Update branch" button, so
every merge from `main` is made locally, checked, reviewed when the patch ID
changes and pushed only when clean. It never rebases or force-pushes. The ruleset on `main` requires branches to
be up to date.

Updating from `main` changes the head SHA. A review still covers the new head
when the commits after the reviewed SHA only merge the base branch in and the
pull request's own diff is unchanged: the patch ID of
`git diff --binary <merge-base>..<sha>` is the same at the reviewed SHA and at
the head, with the merge base taken against `origin/main` each time. A
conflict resolution, or `main` changing a line the pull request's diff carries
as context, changes the patch ID, and the lead session runs a new review
round. A verification result is an observation of one SHA and does not carry
over this way: High work that merges `main` in needs a new verification
round.

## CI checks

`ci-full.yml` and `storybook-quality.yml` run on every pull request to `main`
(and on demand), `fixtures.yml` on pull requests that change its inputs and on
pushes to `main`, and `docs-deploy.yml` on pushes to `main` only:

- `ci-full.yml`: ESLint and the repository tooling tests, Markdownlint,
  stylelint (on a pull request, only the changed `.scss` files) with the
  token lint, and Prettier. Each job but Markdownlint runs only when its
  paths change.
- `storybook-quality.yml`: the styles Storybook build only, when anything
  the HTML Storybook is built from changes. A pass proves the documentation
  builds, not that it is accessible: axe runs on the fixture HTML in
  `fixtures.yml`.
- `fixtures.yml`: every fixture check on every folder; see
  [Fixtures in CI](../testing/fixtures.md#in-ci).
- `docs-deploy.yml`: on `main`, the token lint and the styles Storybook
  build, which it publishes to GitHub Pages with the `/styles/` base path.

A few checks stay off with `if: false`, each with its reason beside it in the
workflow:

- In `storybook-quality.yml`, the component-page checks
  (`check:component-pages` and `check:component-pages:executed`) and the
  `component-pages` job, because some component pages and the compiled CSS
  still disagree on variants and most page guarantees have no test that
  cites them yet. In `docs-deploy.yml`, the accessibility test run on `main`
  and the records-cache steps it feeds stay off with them.
- In `fixtures.yml`, axe skips the folders in `AXE_DEFERRED_FOLDERS`, each
  with a maintainer's acceptance and a tracking issue.

CI does not run the `@pathableai/react` checks or the React Storybook, which
are retained but deferred (see [GLOSSARY.md](../../GLOSSARY.md)).

GitHub's required checks are the aggregate jobs `CI result` and
`Storybook result`. They treat skipped jobs as passing.

Say in the pull request's Evidence or Validation section which checks did not
run.

## Corrections

Change the current owner of the decision.

| Discovery                                         | Owner                                                     |
| ------------------------------------------------- | --------------------------------------------------------- |
| Algorithm, private implementation or story layout | The implementation pull request                           |
| Public contract or verification claim             | The delivery issue; update it before continuing           |
| Scope of the delivery issue                       | The maintainer. Stop the affected work and ask for review |

Update the delivery issue when an accepted contract, claim or scope changes,
record the decision, and rerun the affected checks and independent reviews.
Do not hide a product decision only in an implementation diff.

A merge does not renew approval or evidence. A review carries across an
update from `main` only when the pull request's own diff is unchanged, as
[Keeping up to date](#keeping-up-to-date) defines.
Otherwise repeat the affected reviews and verification. Report which
decisions changed, which public contracts are affected, and which evidence
was repeated.

## Working without GraphQL

Claude Code cloud sessions reach GitHub's REST API but not GraphQL, and `gh pr`
and `gh issue` subcommands use GraphQL, so they fail there with HTTP 403. Do
not retry them or ask for a network change. Use the replacements for the rest
of the session; every rule in this document applies to them unchanged.

| Step with GraphQL                | Replacement                                                                |
| -------------------------------- | -------------------------------------------------------------------------- |
| `gh pr view`                     | `gh api repos/{owner}/{repo}/pulls/N`, or the MCP tool `pull_request_read` |
| `gh pr create`                   | The MCP tool `create_pull_request` with `draft: false`                     |
| `gh pr edit`                     | The MCP tool `update_pull_request` (`title`, `body`, `base`)               |
| `gh issue view`, `gh issue list` | `gh api repos/{owner}/{repo}/issues/N`, or the MCP tool `issue_read`       |

A person merges every pull request, so there is no replacement for
`gh pr merge`.
