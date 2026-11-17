# Agent Instructions

This repository is the PathAble design system: the `@pathableai/styles` CSS
package, the `@pathableai/react` component package, and a Storybook for each.
See [README.md](README.md) for setup and commands.

This file is a routing table. Read the owning document for the task in front of
you, and only when it is relevant; do not load every document up front. When an
owning document and this file disagree, the owning document wins for its topic,
and the constitution wins over both.

## Where the rules live

| When you are…                                                                        | Read                                                                                                                                               |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Making any architectural, packaging, release or quality-gate decision                | [`.specify/memory/constitution.md`](.specify/memory/constitution.md)                                                                               |
| Editing tokens, SCSS, CSS, component classes, utilities or brand-facing UI           | [`packages/styles/AGENTS.md`](packages/styles/AGENTS.md) and [`packages/styles/BRAND_RULES.md`](packages/styles/BRAND_RULES.md)                    |
| Writing or changing `@pathableai/styles` Storybook stories                           | [`packages/styles/STORY_AUTHORING.md`](packages/styles/STORY_AUTHORING.md)                                                                         |
| Changing `@pathableai/react` components or their public API                          | [`packages/react/README.md`](packages/react/README.md)                                                                                             |
| Writing or changing `@pathableai/react` stories                                      | [`packages/react/STORYBOOK_STANDARD.md`](packages/react/STORYBOOK_STANDARD.md)                                                                     |
| Using `@pathableai/react` as a consumer, or checking what its consumer guidance says | [`packages/react/agent-guidance/pathable-react/`](packages/react/agent-guidance/pathable-react/)                                                   |
| Deciding whether a React change must update that consumer guidance                   | [`.github/instructions/react-agent-guidance.instructions.md`](.github/instructions/react-agent-guidance.instructions.md)                           |
| Adding or changing component tests, behavior contracts or parity checks              | [`docs/testing/README.md`](docs/testing/README.md)                                                                                                 |
| Working on theming, `createTheme`, `ThemeProvider` or overridable tokens             | [`docs/theming/consumer-guide.md`](docs/theming/consumer-guide.md) and [`docs/theming/token-vocabulary.md`](docs/theming/token-vocabulary.md)      |
| Changing anything published in `@pathableai/styles` or `@pathableai/react`           | [`.changeset/README.md`](.changeset/README.md)                                                                                                     |
| Specifying, planning or implementing a feature with Spec Kit                         | The `speckit-*` skills in [`.agents/skills/`](.agents/skills/) (also exposed to Claude Code through `.claude/skills/`), and the constitution above |

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
- This file intentionally has no `SPECKIT START`/`SPECKIT END` plan pointer,
  and the Spec Kit `agent-context` hooks are disabled in
  `.specify/extensions.yml`. When the `speckit-plan` skill reaches its "agent
  context update" step, skip it: do not add the markers or a plan pointer back.

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
- Pushing and merging ask first. Read-only git and `gh` commands and the check
  scripts below run without a prompt.

Other agents (Codex, OpenCode, Cursor) are not covered by these settings, but
the rules apply to them all the same.

## Before committing

Run the checks that cover what you changed, from the repository root:

| Check                                       | When                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm lint`                                 | Always. Runs ESLint, stylelint, markdownlint, the token lint and the Prettier check.      |
| `pnpm typecheck`                            | Any TypeScript change in `packages/react`.                                                |
| `pnpm build`                                | Any change to package source, build scripts or package entry points.                      |
| `pnpm test:storybook-styles`                | Changes to `packages/styles`, its stories or `packages/storybook-contracts`.              |
| `pnpm test:storybook-react`                 | Changes to `packages/react`, its stories or `packages/storybook-contracts`.               |
| `pnpm --filter @pathableai/react test:unit` | Changes to `packages/react` source.                                                       |
| `pnpm check:agent-guidance`                 | Changes to `packages/react` public API or `packages/react/agent-guidance/`.               |
| `pnpm test:tooling`                         | Changes to `scripts/claude/`.                                                             |
| `pnpm changeset`                            | Any change that alters a published package (`@pathableai/styles` or `@pathableai/react`). |

Commit messages follow Conventional Commits; commitlint and lint-staged run in
the Husky hooks. Do not bypass them.
