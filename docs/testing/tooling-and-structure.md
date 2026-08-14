# Tooling and structure

Storybook is the primary component workbench and executable specification in
this repository. It supplies deterministic fixtures, documentation, interaction
tests, and accessibility checks for both the styles and React packages.

## Current Storybooks

| Implementation      | Story source                   | Storybook application   |
| ------------------- | ------------------------------ | ----------------------- |
| Styles and raw HTML | `packages/styles/src/stories/` | `apps/storybook/`       |
| React               | `packages/react/src/stories/`  | `apps/storybook-react/` |

React story conventions are defined in
[`packages/react/STORYBOOK_STANDARD.md`](../../packages/react/STORYBOOK_STANDARD.md).
The repository-level `AGENTS.md` also contains the required story checklist.

## Interaction-test tools

Stories import `within`, `userEvent`, `expect`, and related utilities from
`storybook/test`.

- `within(canvasElement)` scopes queries to the story.
- `getByRole`, `getByLabelText`, and `getByText` locate user-facing semantics.
- `userEvent` performs realistic keyboard and pointer interactions.
- `expect` asserts observable state.
- `step` gives an interaction a readable name in Storybook reports and the
  Interactions panel.

## Automated accessibility checks

Both Storybook applications run Axe through their test-runner configuration.
Stable stories are checked for detectable accessibility violations. Exceptions
must be narrow and documented; an exception does not make the underlying issue
conformant.

Accessibility scanning complements rather than replaces keyboard, focus, and
assistive-technology review.

## Commands

```bash
# Run both Storybook suites
pnpm test:storybook

# Run the React Storybook suite
pnpm test:storybook-react

# Build the styles Storybook
pnpm build:docs

# Build the React Storybook
pnpm build:docs-react

# Run the default repository test suite
pnpm test

# Run visual smoke tests
pnpm test:visual
```

The current Storybook test command builds each catalog, serves it locally, and
runs its stories in a browser. CI runs equivalent build, browser-test,
accessibility, and visual-smoke steps, although workflow wiring may call package
scripts directly.

## Shared validation structure

Shared behavior helpers should live in a private, framework-neutral workspace
module rather than under either implementation package. The intended structure
is:

```text
packages/
  storybook-contracts/
    src/
      accordion.ts
      modal.ts
      index.ts
```

The exact package has not yet been added. Until it exists, do not duplicate a
new cross-package behavior silently. Record the parity requirement and add the
shared module as part of the change that first needs it.

The existing top-level `behavior-contracts/` directory is a Cucumber pilot. It
builds and serves Storybook through custom orchestration and currently registers
only the styles target. The preferred direction for component-level parity is
to reuse renderer-neutral Storybook validation helpers directly from each
package's stories. Gherkin remains appropriate only when the feature files have
a distinct stakeholder-facing role that justifies the additional translation
and execution layer.

Next: [Adding tests for a component](adding-component-tests.md).
