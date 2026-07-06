# Context Digest: S04-integration-01 (CI/CD Workflows)

## Tasks

| Task | Description | Phase |
|------|-------------|-------|
| T013 | Create `.github/workflows/docs-ci.yml` - PR validation workflow | Phase 5 (US3) |
| T014 | Create `.github/workflows/docs-deploy.yml` - deploy to Pages on push to main | Phase 6 (US4) |

## Spec Requirements

| FR | Description |
|----|-------------|
| FR-014 | PR workflow validates build, no deploy |
| FR-015 | Deploy workflow builds + deploys to Pages on push to main |
| FR-016 | Deploy uses pnpm/action-setup and actions/setup-node |
| FR-017 | Workflows must not add React, Vue, Storybook, etc. |

## Existing Workflow Patterns (from .github/workflows/)

Both `lint.yml` and `format.yml` use:
- `actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` (v7 commit SHA)
- `pnpm/action-setup@0ebf47130e4866e96fce0953f49152a61190b271` (v6 commit SHA)
- `actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e` (v6 commit SHA) with `node-version: 23`, `cache: 'pnpm'`
- `pnpm install --frozen-lockfile`

## Key Constants

| Constant | Value |
|----------|-------|
| Docs workspace | `@pathable/docs` |
| Docs dir | `apps/docs` |
| Package manager | `pnpm@10.33.0` |
| Root build cmd | `pnpm build` |

## Validation Commands

```bash
test -f .github/workflows/docs-ci.yml && echo 'CI workflow exists'
test -f .github/workflows/docs-deploy.yml && echo 'deploy workflow exists'
grep -q 'pull_request' .github/workflows/docs-ci.yml
grep -q 'deploy-pages' .github/workflows/docs-deploy.yml
```