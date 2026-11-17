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
- Never push to `main`. Never rewrite history on someone else's branch.

## Commits

Commits follow Conventional Commits; commitlint and lint-staged run in the
Husky hooks and must not be bypassed. Keep commits small and focused. Commit
per workspace package where that makes sense (constitution, "Commit
discipline").

## Pull requests

- One pull request per change. High-tier new behaviour starts with a separate
  specification pull request (see [Process by tier](#process-by-tier)).
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

| Changeset in the pull request            | Minimum tier |
| ---------------------------------------- | ------------ |
| `major`                                  | High         |
| `minor`                                  | Standard     |
| `patch` with a consumer-visible change   | Standard     |
| `patch` with no consumer-visible change  | Light        |
| None (no published package code changed) | Light        |

A High trigger does not by itself mean `major`: a compatible keyboard fix to an
interactive component is High with a `patch` changeset.

### Process by tier

| Work                | Pull requests                                                                                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High, new behaviour | A specification pull request first (Spec Kit `spec.md` and `plan.md`, see [Spec Kit](spec-kit.md)), merged on the maintainer's approval; then the implementation pull request |
| High, fix           | One pull request that names its triggers and numbers its claims in the Evidence table                                                                                         |
| Standard            | One pull request. The maintainer may ask for a specification first for a large new component                                                                                  |
| Light               | One pull request with normal CI                                                                                                                                               |

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
  - numbered claims in the Evidence table, each with its result and evidence.

### Recording and changing a tier

- The delivery issue's **Risk tier** section names the tier and every trigger
  that matched, or the condition that makes the work Standard or Light. An
  agent drafting the issue proposes the tier; the maintainer sets it.
- Each pull request states its tier and triggers in its **Tier** section.
- Anyone, including an agent, may raise a tier at any point by recording the
  trigger that matched. Work already approved stays approved; add the evidence
  the higher tier needs.
- Only the maintainer may lower a tier, and records the reason in the issue or
  pull request. An agent never lowers a tier.

### Verification and review

Not yet defined. Dedicated verification and review sessions, and how they use
the numbered claims above, will be added here.

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
