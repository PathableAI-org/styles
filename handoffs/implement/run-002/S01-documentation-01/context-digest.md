# Context Digest: S01-documentation-01 (Workspace Scaffolding)

## Tasks

| Task | Description | Phase |
|------|-------------|-------|
| T001 | Update `pnpm-workspace.yaml` to include `"apps/*"` | Phase 1 Setup |
| T002 | Create `apps/docs/package.json` with `@pathable/docs`, private, deps | Phase 1 Setup |
| T003 | Create `apps/docs/tsconfig.json` with Astro strict config | Phase 1 Setup |

## Current State

| File | Current Content |
|------|----------------|
| `pnpm-workspace.yaml` | `packages:\n  - 'packages/*'\n` |
| Root `package.json` | `scripts.build: "pnpm -r build"`, `packageManager: pnpm@10.33.0` |

## Spec Requirements in This Shard

| FR | Description |
|----|-------------|
| FR-003 | `pnpm-workspace.yaml` includes `"packages/*"` and `"apps/*"` |
| FR-004 | `apps/docs/package.json`: name `@pathable/docs`, private true, dep `"@pathable/styles": "workspace:*"` |

## Key Constants

| Constant | Value |
|----------|-------|
| Workspace name | `@pathable/docs` |
| Docs dir | `apps/docs` |
| Styles package | `@pathable/styles` |
| Package manager | `pnpm@10.33.0` |
| Styles workspace dir | `packages/styles` |

## Known Boundaries

- **Must NOT touch**: `packages/styles/src/**`, `packages/styles/dist/**`, `packages/styles/package.json`, `packages/styles/README.md`, `packages/styles/BRAND_RULES.md`, `packages/styles/AGENTS.md`
- **No external dependencies**: No React, Vue, Tailwind, Storybook, Playwright (per FR-017)

## Validation Commands

```bash
cat pnpm-workspace.yaml | grep "apps/*"
node -e "const p = require('./apps/docs/package.json'); console.log(p.name, p.private, Object.keys(p.dependencies || {}))"
test -f apps/docs/tsconfig.json && echo 'tsconfig exists'
```