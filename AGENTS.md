# Agent Instructions

This repository is the PathAble design system: the `@pathableai/styles` CSS
package, the `@pathableai/react` component package, and a Storybook for each.
See [README.md](README.md) for setup and commands.

This file is a routing table. Read the owning document for the task in front of
you, and only when it is relevant; do not load every document up front. When an
owning document and this file disagree, the owning document wins for its topic,
and the constitution wins over both.

## Where the rules live

| When you are…                                                                                                                                                      | Read                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Making any architectural, packaging, release or quality-gate decision                                                                                              | [`.specify/memory/constitution.md`](.specify/memory/constitution.md)                                                                                  |
| Deciding why a change belongs here, who it serves, or how a consumer need becomes a release                                                                        | [`docs/engineering/intent.md`](docs/engineering/intent.md)                                                                                            |
| Choosing a risk tier, branching, opening or merging a pull request                                                                                                 | [`docs/engineering/git-workflow.md`](docs/engineering/git-workflow.md)                                                                                |
| Orchestrating a feature across specification, plan, implementation, verification and review sessions, or choosing a role's model and effort                        | [`docs/engineering/orchestration.md`](docs/engineering/orchestration.md) and the `orchestrate-stack` skill                                            |
| Verifying a slice, writing `verification.md` claims, or recording a verification report                                                                            | [`docs/engineering/verification-harness.md`](docs/engineering/verification-harness.md) and the `verification-harness` skill                           |
| Reviewing a pushed slice as the review session, or running the pre-push self-review                                                                                | [`docs/engineering/code-review.md`](docs/engineering/code-review.md) and the `code-reviewer` skill                                                    |
| Running a drift review of one area of the design system                                                                                                            | [`docs/engineering/drift-review.md`](docs/engineering/drift-review.md) and the `drift-review` skill                                                   |
| Filing a delivery issue or writing a pull request body                                                                                                             | [`.github/ISSUE_TEMPLATE/delivery.md`](.github/ISSUE_TEMPLATE/delivery.md) and [`.github/pull_request_template.md`](.github/pull_request_template.md) |
| Editing tokens, SCSS, CSS, component classes, utilities or brand-facing UI                                                                                         | [`packages/styles/AGENTS.md`](packages/styles/AGENTS.md) and [`packages/styles/BRAND_RULES.md`](packages/styles/BRAND_RULES.md)                       |
| Writing or changing `@pathableai/styles` Storybook stories                                                                                                         | [`packages/styles/STORY_AUTHORING.md`](packages/styles/STORY_AUTHORING.md)                                                                            |
| Changing `@pathableai/react` components or their public API                                                                                                        | [`packages/react/README.md`](packages/react/README.md)                                                                                                |
| Writing or changing `@pathableai/react` stories                                                                                                                    | [`packages/react/STORYBOOK_STANDARD.md`](packages/react/STORYBOOK_STANDARD.md)                                                                        |
| Using `@pathableai/react` as a consumer, or checking what its consumer guidance says                                                                               | [`packages/react/agent-guidance/pathable-react/`](packages/react/agent-guidance/pathable-react/)                                                      |
| Deciding whether a React change must update that consumer guidance                                                                                                 | [`.github/instructions/react-agent-guidance.instructions.md`](.github/instructions/react-agent-guidance.instructions.md)                              |
| Adding or changing component tests, behavior contracts or parity checks                                                                                            | [`docs/testing/README.md`](docs/testing/README.md)                                                                                                    |
| Working on theming, `createTheme`, `ThemeProvider` or overridable tokens                                                                                           | [`docs/theming/consumer-guide.md`](docs/theming/consumer-guide.md) and [`docs/theming/token-vocabulary.md`](docs/theming/token-vocabulary.md)         |
| Changing code in `@pathableai/styles` or `@pathableai/react` (changesets are for code changes only; docs-only changes need none, even docs shipped in the package) | [`.changeset/README.md`](.changeset/README.md)                                                                                                        |
| Specifying, planning or implementing a feature with Spec Kit                                                                                                       | The `speckit-*` skills in [`.agents/skills/`](.agents/skills/) and the constitution above                                                             |
| Changing Spec Kit templates or presets, reviewing a Spec Kit upgrade, or checking which Spec Kit steps to skip                                                     | [`docs/engineering/spec-kit.md`](docs/engineering/spec-kit.md)                                                                                        |

## Where current behaviour is documented

- `specs/<n>-<slug>/` folders are the historic record of one feature: what was
  asked, planned and decided at the time. They are not updated afterwards and
  may be stale. Do not treat an old spec, or a requirement ID such as `FR-008`
  from one, as the current rule.
- `docs/plans/` is also historical; see [`docs/plans/README.md`](docs/plans/README.md).
- Current behaviour and rules belong in `docs/`, the package READMEs and the
  package `AGENTS.md`/guidance files listed above. When a feature changes
  behaviour, update those documents as part of the change; do not leave the
  spec as the only description.
- Do not move or rename existing specs or plans.
- Spec Kit has a step that must be skipped here (the `speckit-plan` "agent
  context update") and generated files that must not be hand-edited; see
  [`docs/engineering/spec-kit.md`](docs/engineering/spec-kit.md).

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
  workflows, the hook itself and `.claude/settings.json`.
- Force pushes, `--no-verify`, `HUSKY=0`, `git reset --hard`, `git clean -f`,
  environment dumps, `.env` reads and publishing commands are denied.
- Merging a pull request (`gh pr merge`) asks first. Day-to-day git work
  (`add`, `commit`, `checkout`, `switch`, `merge`, `pull`, `stash`, `tag` and
  non-force `push`), read-only git and `gh` commands and the check scripts
  below run without a prompt. Force pushes and `--no-verify` remain denied.

Other agents (Codex, OpenCode, Cursor) are not covered by these settings, but
the rules apply to them all the same.

### Spec Kit files and the upgrade workflow

The weekly Spec Kit upgrade owns most of `.specify/` and `.agents/skills/`, and
`.claude/skills/speckit-*` are symlinks into `.agents/skills/`. What is
generated, where project customisations live, and what to do before installing
the `claude` integration are in
[`docs/engineering/spec-kit.md`](docs/engineering/spec-kit.md).

## Before committing

Run the checks that cover what you changed, from the repository root:

| Check                                       | When                                                                                                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`                                 | Always. Runs ESLint, stylelint, markdownlint, the token lint and the Prettier check.                                                                                        |
| `pnpm typecheck`                            | Any TypeScript change in `packages/react`.                                                                                                                                  |
| `pnpm build`                                | Any change to package source, build scripts or package entry points.                                                                                                        |
| `pnpm test:storybook-styles`                | Changes to `packages/styles`, its stories or `packages/storybook-contracts`.                                                                                                |
| `pnpm test:pixels-styles`                   | Changes to `packages/styles` or `apps/storybook` that can affect rendering. Needs Docker on a Linux host; see [Pixel visual regression](docs/testing/visual-regression.md). |
| `pnpm test:storybook-react`                 | Changes to `packages/react`, its stories or `packages/storybook-contracts`.                                                                                                 |
| `pnpm --filter @pathableai/react test:unit` | Changes to `packages/react` source.                                                                                                                                         |
| `pnpm check:agent-guidance`                 | Changes to `packages/react` public API or `packages/react/agent-guidance/`.                                                                                                 |
| `pnpm test:tooling`                         | Changes to `scripts/claude/`.                                                                                                                                               |
| `pnpm changeset`                            | Code changes to a published package (`@pathableai/styles` or `@pathableai/react`). Not for documentation-only changes, even docs that ship in the package.                  |

Commit messages follow Conventional Commits; commitlint and lint-staged run in
the Husky hooks. Do not bypass them.
