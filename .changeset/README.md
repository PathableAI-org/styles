# Changesets

A changeset records one consumer-visible change to `@pathableai/styles` or
`@pathableai/react` and becomes that change's entry in the package's
`CHANGELOG.md`. The two packages are versioned independently.

In short:

- A pull request that changes anything a package ships (its code, its
  consumer agent guidance or its other shipped documentation) carries a
  changeset. Tests, stories, the Storybook site, `docs/` and tooling do not.
- Both packages are below 1.0.0, so a breaking change is a `minor` marked
  `**Breaking change**`, with migration steps; additions are `minor`; fixes,
  visual changes and documentation are `patch`.
- The summary is written for someone upgrading the package, not for a
  reviewer.

The full rules (the public contract, the bump table and how to write the
summary) are in the [`changeset` skill](../.agents/skills/changeset/SKILL.md),
which agents follow and people can read too.

## Commands

Create a changeset:

```bash
pnpm changeset
```

Inspect pending releases without changing package manifests:

```bash
pnpm changeset:status
```

Apply pending changesets to package versions and changelogs:

```bash
pnpm version-packages
```

Do not run `pnpm release` from a feature branch. Publishing is reserved for the
repository release workflow after package builds and release changes have been
reviewed.
