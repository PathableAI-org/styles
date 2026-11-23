# Repository intent

This document says why this repository exists, what it currently produces, who
those products serve, and how a consumer's need becomes a released change. It
owns intent and flow only. The current refactor boundary lives in
[Target state](target-state.md), and the process weight a change needs lives in
the [Git workflow](git-workflow.md). Package and testing rules live in the
owning documents routed from [`AGENTS.md`](../../AGENTS.md).

## Why it exists

PathAble applications should look and read as one product, and their shared UI
should begin from accessible markup and styles without each application
rebuilding the same foundation. This repository defines that shared design,
checks it, and publishes artifacts that applications install rather than copy.

## Who it serves

- **People building with the design system.** They use the human product
  documentation to understand the supported catalog, see it rendered and copy
  canonical HTML.
- **Applications consuming `@pathableai/styles`.** They import the compiled CSS
  and assets rather than configuring USWDS or copying repository source.
- **Coding agents in consuming applications.** They read consumer agent
  guidance from the installed npm version, not contributor instructions from
  this repository.
- **Design and maintainers.** Design supplies brand names, values and intent;
  contributors and their agents turn them into reviewable, tested and
  releasable package contracts.

## Documentation terms

Use these names consistently:

- **Human product documentation** is the styles Storybook published at
  `https://pathableai-org.github.io/styles/`. It explains when to use each
  supported component and shows rendered examples with copyable HTML.
- **Consumer agent guidance** is human-readable, auditable Markdown shipped in
  the installed npm package. It helps agents choose and compose the installed
  version's components, tokens and utilities.
- **Contributor agent guidance** is repository-local material for changing this
  project: `AGENTS.md`, engineering documents, skills and role instructions.

Do not use the unqualified phrase "agent-facing docs" when the audience could
be either consumers or contributors.

## Current deliverables

The active `@pathableai/styles` work produces three deliverables from shared
sources:

1. **Human product documentation.** The styles Storybook is the visual catalog
   hosted on GitHub Pages. It contains semantic guidance, rendered examples and
   the canonical snippets.
2. **Compiled CSS.** The `@pathableai/styles` npm package starts from USWDS,
   applies PathAble brand settings and narrowly justified fixes, and exposes
   the supported static component, token and utility contract without requiring
   a consuming project to configure USWDS.
3. **Consumer agent guidance.** The same npm package already contains generated
   component prose and examples. The target adds a dedicated routing entry point
   plus package-wide selection and bug-reporting guidance. Shipping all of it
   with the CSS keeps the guidance tied to the installed version instead of the
   rolling website.

The shared sources are:

- [`components/`](../../components/README.md), whose pages are the product
  specifications: purpose, variants, composition, guarantees and consumer
  responsibilities;
- [`fixtures/`](../../fixtures/README.md), whose HTML is the canonical example
  markup used by documentation snippets, rendered examples, accessibility
  checks and CSS-contract checks; and
- `packages/styles/src/`, whose SCSS and assets produce the installed CSS.

Generated human or consumer documentation must not create a second semantic or
markup source. Target-specific navigation and framing may differ, but component
meaning comes from the page and example HTML comes from the fixture.

## Current scope boundary

The supported component catalog currently covers components whose defining
behavior needs no design-system JavaScript. Native HTML controls remain in
scope; a component that requires package JavaScript to provide its defining
behavior does not. The exact catalog is owned by
[`components/README.md`](../../components/README.md#catalog-scope).

`packages/react/`, the React Storybook and React consumer guidance,
`packages/styles/src/js/`, the styles package's existing JavaScript exports,
and legacy custom or JavaScript-dependent wrappers remain in the repository.
They are retained to avoid accidental breaking changes but are not current
refactor targets. Their presence is not permission to broaden static component
work, modernize them opportunistically or delete them. Shared generators and
existing checks may still require mechanical output updates.

The current package layout is hybrid: generated component Markdown already
ships in `@pathableai/styles`, while the dedicated routing and package-wide
consumer guidance still lives under the React package. The target is dedicated
styles consumer guidance in `@pathableai/styles`; React guidance is not a
substitute for it.

## Bug reporting intent

Consumer agents and contributor agents should describe a styles defect the
same way. They search existing issues, confirm the problem against a released
package version or base SHA, use the repository's
[bug template](../../.github/ISSUE_TEMPLATE/bug.md), name the broken component
page guarantee when one exists, and keep unrelated defects out of the current
change. A styles bug carries `bug` and `package:styles`; a component defect also
identifies its component slug so it can receive the component label the
repository defines. The exact label automation and downstream submission flow
remain product work rather than something an agent invents ad hoc.

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
   land in `packages/styles` first.
   React is deferred during the current refactor and changes only when an issue
   explicitly puts it in scope. In that separate scope, an adapter change still
   begins from the existing styles contract; a change that only adds React
   ergonomics over that contract can land in `packages/react` alone.
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

| Topic                                                       | Owner                                                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Product intent and source-first package ownership           | This document, [Target state](target-state.md), and the owning package documentation                           |
| Release process and quality gates                           | [Git workflow](git-workflow.md), [Changesets](../../.changeset/README.md), and [Testing](../testing/README.md) |
| Current styles product and consumer-guidance direction      | [Target state](target-state.md) and [`components/README.md`](../../components/README.md)                       |
| Risk tiers, branches, pull requests and merging             | [Git workflow](git-workflow.md)                                                                                |
| Changesets and version bumps                                | [`.changeset/README.md`](../../.changeset/README.md)                                                           |
| When an explicitly scoped React change updates its guidance | [React agent guidance instructions](../../.github/instructions/react-agent-guidance.instructions.md)           |
