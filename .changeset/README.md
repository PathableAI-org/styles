# Changesets

Changesets record user-facing changes to `@pathableai/styles` and
`@pathableai/react`. Both packages start at `0.0.0` and are versioned
independently.

Create a changeset with:

```bash
pnpm changeset
```

Select each package affected by the change, choose the appropriate semantic
version bump, and write a consumer-focused summary.

Changesets are only for code changes to a published package: source, styles,
build output, entry points, types or other runtime behaviour of
`@pathableai/styles` or `@pathableai/react`. Documentation-only changes do not
need a changeset, even when the documentation ships inside the package tarball
(for example `README.md`, `AGENTS.md` or `BRAND_RULES.md`). Changes to tests,
stories or repository tooling do not need one either.

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
