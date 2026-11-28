# Agent Instructions

This repository is the PathAble design system. Current delivery work centers
on the `@pathableai/styles` CSS package, its human product documentation and
the consumer agent guidance that ships with it and is being completed. The existing
`@pathableai/react` package and React Storybook remain in the repository but
are not current refactor targets. See [README.md](README.md) for setup and
commands.

This file is a routing table. Read the owning document for the task in front of
you, and only when it is relevant; do not load every document up front. When an
owning document and this file disagree, the owning document wins for its topic.

## Current refactor: three `@pathableai/styles` deliverables

The active refactor produces three things:

1. **Human product documentation** in the styles Storybook published at
   `https://pathableai-org.github.io/styles/`.
2. **Compiled CSS** in the `@pathableai/styles` npm package: a thin,
   PathAble-branded wrapper around the static portion of USWDS.
3. **Consumer agent guidance** in that same npm package, so its prose and
   examples match the installed CSS version.

Do not call both kinds of agent documentation "agent-facing docs."
**Contributor agent guidance** is the repository-local `AGENTS.md`, engineering
documentation, skills and role instructions used to change this repository.
**Consumer agent guidance** is auditable Markdown for agents using the
installed package.

The component pages in `components/` are the shared product specifications and
the HTML in `fixtures/` is the canonical example markup. The fixtures feed the
human documentation, the installed component pages and the accessibility and
CSS-contract checks. A difference between those sources and an in-scope static
component's CSS is a defect in the CSS; never change the page or fixture back
to match legacy SCSS.

The current catalog is limited to components whose defining behavior needs no
design-system JavaScript, and `@pathableai/styles` ships no JavaScript.
`packages/react/`, the React Storybook and consumer guidance are **retained
but deferred**. Unless a task explicitly puts one in scope, do not modernize,
expand or remove it, and do not use its current behavior to redefine the
styles target. A shared-source change may still require a mechanical
generated React-guidance update or an existing check to pass; that does not
make React behavior part of the change.

## Where the rules live

| When you are…                                                                                                                    | Read                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Making an architectural or packaging decision                                                                                    | [`GLOSSARY.md`](GLOSSARY.md) and the owning package documentation                                                                                                              |
| Making a release or quality-gate decision                                                                                        | [`docs/engineering/git-workflow.md`](docs/engineering/git-workflow.md), [`changeset` skill](.agents/skills/changeset/), and [`docs/testing/README.md`](docs/testing/README.md) |
| Deciding why a change belongs here, who it serves, or how a consumer need becomes a release                                      | [`docs/engineering/git-workflow.md`](docs/engineering/git-workflow.md)                                                                                                         |
| Defining, naming or using a design-system term                                                                                   | [`GLOSSARY.md`](GLOSSARY.md) and the `domain-modeling` skill                                                                                                                   |
| Choosing a risk tier, branching, opening or merging a pull request                                                               | [`docs/engineering/git-workflow.md`](docs/engineering/git-workflow.md)                                                                                                         |
| Leading a delivery issue through implementation and its review and verification subagents, or choosing a role's model and effort | [`docs/engineering/orchestration.md`](docs/engineering/orchestration.md) and the `orchestrate` skill                                                                           |
| Defining High-risk claims or verifying them as the `verifier` subagent                                                           | [`docs/engineering/verification-harness.md`](docs/engineering/verification-harness.md) and the `verification-harness` skill                                                    |
| Reviewing local commits as the `code-reviewer` subagent                                                                          | [`docs/engineering/code-review.md`](docs/engineering/code-review.md) and the `code-reviewer` skill                                                                             |
| Reviewing what local commits render as the `visual-reviewer` subagent                                                            | [`docs/engineering/visual-review.md`](docs/engineering/visual-review.md) and the `visual-reviewer` skill                                                                       |
| Running a drift review of one area of the design system                                                                          | [`docs/engineering/drift-review.md`](docs/engineering/drift-review.md) and the `drift-review` skill                                                                            |
| Filing a delivery issue or writing a pull request body                                                                           | the `to-spec` skill (and `to-tickets` for a spec needing more than one pull request), and [`.github/pull_request_template.md`](.github/pull_request_template.md)               |
| Planning a change or stress-testing a plan by interview, before `/to-spec`                                                       | the `grill-me` skill, then `/to-spec` (and `grill-with-docs` when terms or decisions need recording in their owning documents)                                                 |
| Filing a confirmed defect                                                                                                        | [`.github/ISSUE_TEMPLATE/bug.md`](.github/ISSUE_TEMPLATE/bug.md) and [`docs/engineering/orchestration.md`](docs/engineering/orchestration.md)                                  |
| Editing tokens, SCSS, CSS, component classes, utilities or brand-facing UI                                                       | [`packages/styles/AGENTS.md`](packages/styles/AGENTS.md) and [`packages/styles/BRAND_RULES.md`](packages/styles/BRAND_RULES.md)                                                |
| Writing or changing HTML fixtures in `fixtures/`                                                                                 | [`fixtures/README.md`](fixtures/README.md)                                                                                                                                     |
| Writing or changing component pages in `components/`, or the docs built from them                                                | [`components/README.md`](components/README.md)                                                                                                                                 |
| Changing `@pathableai/react` components or their public API                                                                      | [`packages/react/README.md`](packages/react/README.md)                                                                                                                         |
| Writing or changing `@pathableai/react` stories                                                                                  | [`packages/react/STORYBOOK_STANDARD.md`](packages/react/STORYBOOK_STANDARD.md)                                                                                                 |
| Using `@pathableai/react` as a consumer, or checking what its consumer guidance says                                             | [`packages/react/agent-guidance/pathable-react/`](packages/react/agent-guidance/pathable-react/)                                                                               |
| Deciding whether a React change must update that consumer guidance                                                               | [`.github/instructions/react-agent-guidance.instructions.md`](.github/instructions/react-agent-guidance.instructions.md)                                                       |
| Adding or changing component tests, behavior contracts or parity checks                                                          | [`docs/testing/README.md`](docs/testing/README.md)                                                                                                                             |
| Working on theming, `createTheme`, `ThemeProvider` or overridable tokens                                                         | [`docs/theming/consumer-guide.md`](docs/theming/consumer-guide.md) and [`docs/theming/token-vocabulary.md`](docs/theming/token-vocabulary.md)                                  |
| Changing anything shipped in `@pathableai/styles` or `@pathableai/react`, or writing or reviewing a changeset                    | the [`changeset` skill](.agents/skills/changeset/)                                                                                                                             |

## Where current behaviour is documented

- Current behaviour and rules belong in `docs/`, the package READMEs and the
  package `AGENTS.md`/guidance files listed above. When behaviour changes,
  update its current owner as part of the change.
- Delivery issues and pull requests record the accepted scope, decisions and
  evidence for one change. They are history, not a second current source.

## No check suppressions

Agents must never disable or suppress a lint, format or type check. That
includes, but is not limited to:

- `eslint-disable` and `eslint-disable-next-line` comments
- `stylelint-disable` and `stylelint-disable-next-line` comments
- `prettier-ignore` comments
- `markdownlint-disable` comments
- `@ts-ignore`, `@ts-expect-error` and `@ts-nocheck` directives
- any other comment, directive, ignore-file entry or configuration change
  whose purpose is to silence a check rather than satisfy it

When a check fails, fix the root cause by changing the code so it satisfies the
rule. Only a human may decide that a rule is wrong, too broad, or should be
suppressed in a specific place. If you think that is the case, stop and ask;
do not loosen `eslint.config.js`, stylelint, markdownlint, Prettier,
lint-staged, commitlint, Husky, TypeScript or accessibility-exception
configuration to get a green run.

## Enforced agent guardrails

Some of these rules are enforced for Claude Code by
[`.claude/settings.json`](.claude/settings.json):

- A `PreToolUse` hook,
  [`scripts/claude/no-suppressions-hook.mjs`](scripts/claude/no-suppressions-hook.mjs),
  blocks `Edit`, `Write` and `MultiEdit` calls that newly add any of the
  suppression comments listed above. It only looks at text being added. If it
  blocks you, fix the underlying problem or ask a human. Its tests run with
  `pnpm test:tooling`.
- Editing check configuration asks a human first: ESLint, stylelint,
  markdownlint, Prettier, lint-staged, Husky and commitlint configuration,
  `scripts/accessibility-exceptions.mjs`, any `tsconfig*.json`, GitHub
  workflows, the hook itself, `scripts/guardrail-paths.mjs` and
  `.claude/settings.json`. The `Edit(...)`
  rules cover the `Write` and `MultiEdit` tools too.
- A hook on `Bash`,
  [`scripts/claude/guardrail-write-hook.mjs`](scripts/claude/guardrail-write-hook.mjs)
  (logic in `scripts/guardrail-write.mjs`), catches shell writes to the
  [guardrail paths](docs/engineering/git-workflow.md#guardrail-changes) listed
  in [`scripts/guardrail-paths.mjs`](scripts/guardrail-paths.mjs), which
  are wider than the `Edit(...)` rules above. Before a command runs
  (`PreToolUse`), it asks a person when the command names a guardrail path, or
  for deletes and copies a directory holding one, together with a redirection,
  `tee`, `sed -i`, `perl -i`, `cp`, `mv`, `rm`, `install`, `chmod`, `curl -o`,
  `find -delete`, `git apply`, `git checkout … --` or `git restore`, or runs
  inline interpreter code (`python -c`, `node -e`, a heredoc to an interpreter)
  that names one and calls something write-like. That check reads the command
  text, so an obfuscated command can evade it. After the command, whether it
  succeeded or failed (`PostToolUse` and `PostToolUseFailure`), the hook
  compares the guardrail files Git reports as changed, ignored ones included,
  and the commits the command made, with a record taken just before it ran. If
  the command changed one it was not asked about, the hook tells the agent to
  stop and ask the person to review the change. Not reported: changes made
  before the command (by an approved edit, a person or a background command);
  paths and globs the person approved in the ask; content already seen in the
  session and not reported before, such as changes brought back by
  `git stash pop`; untracked files `git stash` put away; content restored to
  the old HEAD's, as by `git reset`; unchanged files in an amended commit;
  files a merge the command started left conflicted or auto-merged while they
  still hold what Git wrote, a merge commit's Git-made result, and files
  `git merge --abort` removes; Husky shims an install creates; and
  whitespace-only reformatting of Markdown, including lint-staged's inside
  `git commit`. Known
  limits: a guardrail file changed by another process while a command runs is
  reported as that command's change, including `.claude/settings.local.json`
  when a person chooses not to be asked again for a command (the message says
  so); a rebase, cherry-pick or revert that changes a guardrail file is
  reported; and the after-check does not see what a background command writes
  once it has started. If the hook stops you, leave the files as they are and
  ask a human. Its tests run with `pnpm test:tooling`.
- Force pushes, `--no-verify`, `HUSKY=0`, `git reset --hard`, `git clean -f`,
  environment dumps, `.env` reads and publishing commands are denied.
- Agents may merge a pull request when a person has asked them to. `gh pr merge`,
  the GitHub MCP `merge_pull_request` tool and the `gh api` and `curl` routes to a
  pull request's `merge` endpoint and the `mergePullRequest` mutation are no
  longer denied in [`.claude/settings.json`](.claude/settings.json). Auto-merge
  (`enable_pr_auto_merge`, the `auto_merge` endpoints and the
  `enablePullRequestAutoMerge` mutation) remains denied. Never merge on your own
  initiative or before a person has approved the pull request. Day-to-day git work
  (`add`, `commit`, `checkout`, `switch`, `merge`, `pull`, `stash`, `tag` and
  non-force `push`), read-only git and `gh` commands and the check scripts
  below run without a prompt. Force pushes and `--no-verify` remain denied.

Other agents (Codex, OpenCode, Cursor) are not covered by these settings, but
the rules apply to them all the same.

## Before committing

Run the checks that cover what you changed, from the repository root:

| Check                                       | When                                                                                                                                                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`                                 | Always. Runs ESLint, stylelint, markdownlint, the token lint and the Prettier check.                                                                                                                                        |
| `pnpm typecheck`                            | Any TypeScript change in `packages/react`.                                                                                                                                                                                  |
| `pnpm build`                                | Any change to package source, build scripts or package entry points.                                                                                                                                                        |
| `pnpm test:storybook-styles`                | Changes to `packages/styles`, its stories or `packages/storybook-contracts`.                                                                                                                                                |
| `pnpm test:storybook-react`                 | Changes to `packages/react`, its stories or `packages/storybook-contracts`.                                                                                                                                                 |
| `pnpm --filter @pathableai/react test:unit` | Changes to `packages/react` source.                                                                                                                                                                                         |
| `pnpm check:agent-guidance`                 | Changes to `packages/react` public API, `packages/react/agent-guidance/`, `components/`, `fixtures/` or `scripts/component-docs/` (it fails when the committed React component pages are stale).                            |
| `pnpm test:tooling`                         | Changes to `scripts/claude/`, `scripts/tests/` or the scripts they test, including `packages/styles/scripts/lint-tokens.mjs`.                                                                                               |
| The `fixtures/` checks                      | Changes to `fixtures/`, `packages/styles/src/**/*.scss`, `components/*.md` or `pnpm-lock.yaml`: `pnpm --filter @pathableai/fixtures check` and `test`, after the styles build ([Fixture checks](docs/testing/fixtures.md)). |
| Component page checks                       | Changes to `components/`, `fixtures/` or `scripts/component-docs/`: `pnpm --filter @pathableai/styles test:component-pages` and `check:component-pages`, after `pnpm --filter @pathableai/styles build`.                    |
| `pnpm changeset`                            | Changes to anything a published package ships: code, consumer agent guidance or documentation ([`changeset` skill](.agents/skills/changeset/)).                                                                             |

Commit messages follow Conventional Commits; commitlint and lint-staged run in
the Husky hooks. Do not bypass them.
