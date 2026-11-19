# Repository intent

This document says why this repository exists, who it serves, and how a
consumer's need becomes a released change. It owns intent and flow only. The
rules that govern the work live in the
[constitution](../../.specify/memory/constitution.md), and the process weight a
change needs lives in the [Git workflow](git-workflow.md).

## Why it exists

PathAble applications should look, read and behave as one product, and they
should be accessible without each team rebuilding the same controls. This
repository is where that shared design is defined once, verified once, and
shipped as packages that applications install rather than copy.

## Who it serves

- **Consuming applications.** Product repositories that install the published
  packages, such as Pre-ETS (`pathableai-org/pre-ets`), and future PathAble
  apps.
- **Coding agents in those applications.** They build UI from the consumer
  guidance shipped inside `@pathableai/react`, not from this repository's
  source.
- **Design.** The Figma design system is a source of names, values and intent;
  this repository turns it into reviewable code (constitution principle IX).
- **Contributors and agents working here.** They are routed by
  [`AGENTS.md`](../../AGENTS.md).

## The pipeline

Each stage consumes the one before it and must not redefine it:

1. **Styles contract** — `packages/styles`, published as `@pathableai/styles`.
   Tokens, CSS custom properties, `.pathable-*` component and utility classes,
   fonts, icons and small JavaScript helpers. This is the source of truth
   (principles I and II).
2. **React adapter** — `packages/react`, published as `@pathableai/react`.
   Framework-native components that map onto the styles contract, with
   semantic and visual parity (principles IV and V).
3. **Consumer agent guidance** —
   [`packages/react/agent-guidance/pathable-react/`](../../packages/react/agent-guidance/pathable-react/),
   shipped in the `@pathableai/react` tarball. Consuming repositories route
   their UI work to the installed copy, so it is part of the published contract.
4. **Consumers** — applications that install `@pathableai/react` (and, where
   they need plain CSS, `@pathableai/styles`) from npm.

The two Storybooks are the executable catalog for stages 1 and 2; they are how
this repository proves the contract before it ships.

## How a consumer need flows

Open delivery issues in this repository are the backlog; there is no roadmap
file. An organization-level GitHub Project orders them, alongside consumer work
in other PathAble repositories.

1. **File it here.** A consumer that needs something it cannot do with the
   released packages files an issue in this repository, using the
   [delivery template](../../.github/ISSUE_TEMPLATE/delivery.md). The issue
   states the outcome, links the consumer's own issue or pull request, and
   proposes a [risk tier](git-workflow.md#risk-tiers). Issues
   [#262](https://github.com/PathableAI-org/styles/issues/262) (router-aware
   links) and [#264](https://github.com/PathableAI-org/styles/issues/264)
   (blocking modal) are examples: each describes current behaviour in a named
   release, the consumer's use case, and what "done" looks like.
2. **Land it source-first.** New visual behaviour, classes, tokens and assets
   land in `packages/styles` before the adapter exposes them (the
   constitution's "Source-first sequencing"). A change that only adds React
   ergonomics over an existing styles contract, such as #262, can land in
   `packages/react` alone; the issue's Contract impact section says which case
   applies.
3. **Record the release.** A pull request that changes a published package's
   code carries a changeset ([`.changeset/README.md`](../../.changeset/README.md)).
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
- Because a consumer need is done only on release (below), the pull request
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

## Where the rules live

| Topic                                                       | Owner                                                                                                |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Principles, packaging, release and quality gates            | [Constitution](../../.specify/memory/constitution.md)                                                |
| Risk tiers, branches, pull requests and merging             | [Git workflow](git-workflow.md)                                                                      |
| Changesets and version bumps                                | [`.changeset/README.md`](../../.changeset/README.md)                                                 |
| When a React change must update the consumer agent guidance | [React agent guidance instructions](../../.github/instructions/react-agent-guidance.instructions.md) |
| Spec Kit templates, presets and the upgrade workflow        | [Spec Kit](spec-kit.md)                                                                              |
