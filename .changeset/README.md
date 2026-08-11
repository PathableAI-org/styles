# Changesets

Changesets record user-facing changes to `@pathableai/styles` and
`@pathableai/react`. Both packages start at `0.0.0` and are versioned
independently.

Create a changeset with:

```bash
pnpm changeset
```

Select each package affected by the change, choose the appropriate semantic
version bump, and write a consumer-focused summary. Repository-only changes to
documentation, tests, or tooling do not require a changeset when they do not
alter either published package.

Inspect pending releases without changing package manifests:

```bash
pnpm changeset:status
```

Apply pending changesets to package versions and changelogs with:

```bash
pnpm version-packages
```

Do not run `pnpm release` from a feature branch. Publishing is reserved for the
repository release workflow after package builds and release changes have been
reviewed.
