# PathAble Styles

The PathAble design system: brand tokens, CSS and component classes, a React
component library, and a Storybook for each. It is a pnpm workspace.

## Packages

| Package                                                         | What it is                                                                                                                                                                    |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@pathableai/styles`](packages/styles/)                        | The source of truth for PathAble visual design: tokens, fonts, icons, compiled CSS, `.pathable-*` component and utility classes built on USWDS, and small JavaScript helpers. |
| [`@pathableai/react`](packages/react/)                          | React components that wrap `@pathableai/styles`. It depends on the styles package and loads its CSS, so consumers install and import only `@pathableai/react`.                |
| [`packages/storybook-contracts`](packages/storybook-contracts/) | Private, renderer-neutral behavior checks shared by both Storybooks.                                                                                                          |
| [`fixtures`](fixtures/)                                         | Private canonical HTML for each static styles component, one file per state, and the checks that validate it.                                                                 |

Both published packages are versioned independently with
[Changesets](.changeset/README.md).

## Storybooks

| App                                             | Shows                                             | Local port |
| ----------------------------------------------- | ------------------------------------------------- | ---------- |
| [`apps/storybook`](apps/storybook/)             | `@pathableai/styles` component pages and fixtures | 6006       |
| [`apps/storybook-react`](apps/storybook-react/) | `@pathableai/react` components                    | 6007       |

The styles Storybook shows the generated component pages and one story per
HTML fixture, both built from `components/` and `fixtures/`; it has no
hand-written stories. It is deployed to GitHub Pages from `main`.

## Getting started

Requirements: Node.js 24 or 26+ and pnpm 12 (the version is pinned in
`package.json` under `packageManager`).

```bash
pnpm install
pnpm build
```

## Common commands

Run these from the repository root.

| Command                      | What it does                                                            |
| ---------------------------- | ----------------------------------------------------------------------- |
| `pnpm docs`                  | Build the styles package and start the styles Storybook.                |
| `pnpm docs:react`            | Build the styles package and start the React Storybook.                 |
| `pnpm build`                 | Build every workspace package.                                          |
| `pnpm lint`                  | ESLint, stylelint, markdownlint, the token lint and the Prettier check. |
| `pnpm format`                | Format the repository with Prettier.                                    |
| `pnpm typecheck`             | Type-check `@pathableai/react`.                                         |
| `pnpm test:storybook-styles` | Build, serve and test the styles Storybook.                             |
| `pnpm test:storybook-react`  | Build, serve and test the React Storybook.                              |
| `pnpm check:agent-guidance`  | Validate the `@pathableai/react` consumer guidance for agents.          |
| `pnpm test:tooling`          | Test repository tooling such as the Claude Code hook.                   |
| `pnpm changeset`             | Record a change to a published package.                                 |

## Contributing

- The [constitution](.specify/memory/constitution.md) holds the project's
  governing principles.
- [AGENTS.md](AGENTS.md) routes each kind of change to the document that owns
  its rules, and lists the checks to run before committing. It applies to
  people as well as coding agents.
- CI temporarily skips the package lint and the component-page checks for the
  component reset (PR #607); `pnpm lint` still runs locally.
- Commits follow Conventional Commits and are checked by commitlint.
- New features are specified with Spec Kit under `specs/`; those folders and
  `docs/plans/` are historical records. Current behaviour is documented in
  `docs/` and the package READMEs.

## License

Public domain (the Unlicense); see [LICENSE](LICENSE).
