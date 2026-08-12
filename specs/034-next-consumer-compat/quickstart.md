# Quickstart: Validate Next Consumer Compatibility

## Prerequisites

- Use the repository-declared Node and pnpm versions.
- Install workspace dependencies before running consumer validation.
- Keep the existing generated Changesets worktree changes in place.

## Focused validation

```bash
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/react build
pnpm test:next-consumer
```

Expected outcomes:

- Both packages pack successfully.
- Packed manifest, runtime, and CSS asset assertions pass.
- The temporary Next.js 15/React 18 application builds and serves all representative component text.
- No registry publication occurs.

## Package quality gates

```bash
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react check:package
pnpm --filter @pathableai/react check:types
```

## Repository gates

```bash
pnpm test:storybook-react
pnpm check:format
pnpm changeset:status
git diff --check
```

Changesets status should project patch releases newer than `0.0.1` for both packages. Do not run `pnpm release` or `changeset publish` as part of this feature.
