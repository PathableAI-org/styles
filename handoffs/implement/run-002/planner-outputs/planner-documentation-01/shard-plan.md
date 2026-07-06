# Shard Plan: Docs PoC Documentation

**vertical_capability**: documentation
**feature**: 002-docs-poc
**branch**: 002-docs-poc
**date**: 2026-07-04

## Shard Overview

Three shards sequenced by dependency order. Shards 2 and 3 can execute in parallel after Shard 1 completes.

---

## Shard 1: Workspace Scaffolding

| Field | Value |
|-------|-------|
| **shard_id** | `S01-documentation-01` |
| **task_ids** | T001, T002, T003 |
| **lifecycle_stage** | worker_execution |

### Tasks

- **T001** — Update `pnpm-workspace.yaml` at repo root to include `"apps/*"` alongside existing `"packages/*"`
- **T002** — Create `apps/docs/package.json` with name `@pathable/docs`, `"private": true`, deps on `astro`, `@astrojs/starlight`, `"@pathable/styles": "workspace:*"`
- **T003** [P] — Create `apps/docs/tsconfig.json` with Astro-compatible TypeScript config (extends `astro/tsconfigs/strict`)

### Write paths

- `pnpm-workspace.yaml` (modify)
- `apps/docs/package.json` (create)
- `apps/docs/tsconfig.json` (create)

### Conflict analysis

No write conflicts — all three tasks modify/create different files. Can be executed in parallel within the shard.

### Dependencies

- **depends_on**: none (no other shards needed first)
- **provides_to**: Shard 2, Shard 3 (creates workspace registration, package.json, and tsconfig)

### Validation

- Verify `pnpm-workspace.yaml` contains `"apps/*"`
- Verify `apps/docs/package.json` exists with correct name, private flag, and dependencies
- Verify `apps/docs/tsconfig.json` exists with Astro strict config

---

## Shard 2: Starlight Configuration & US1 Implementation

| Field | Value |
|-------|-------|
| **shard_id** | `S01-documentation-02` |
| **task_ids** | T005, T012b, T007, T008 |
| **lifecycle_stage** | worker_execution |

### Tasks

- **T005 (+T012b merged)** — Create `apps/docs/astro.config.mjs` with `@astrojs/starlight` integration, title "Pathable Styles", and the COMPLETE four-section sidebar (Getting Started, Foundations, For Agents, Roadmap). Merges T005 (placeholder sidebar) and T012b (full sidebar) into a single file creation to avoid write conflict.
- **T007** [P] [US1] — Create custom stylesheet at `apps/docs/src/styles/custom.css` that imports `@pathable/styles/dist/styles.css` and applies Pathable CSS custom properties to Starlight theme elements
- **T008** [US1] — Create homepage at `apps/docs/src/content/docs/index.mdx`

### Write paths

- `apps/docs/astro.config.mjs` (create — with full sidebar, no placeholder needed)
- `apps/docs/src/styles/custom.css` (create)
- `apps/docs/src/content/docs/index.mdx` (create)

### Conflict analysis

**One conflict resolved within shard**: T005 and T012b both write to `apps/docs/astro.config.mjs`. By merging them into a single pass that creates the config with the complete sidebar, the conflict is eliminated. No other write conflicts — all other files are distinct.

### Dependencies

- **depends_on**: Shard 1 (needs workspace registration, package.json, and tsconfig.json to exist)
- **provides_to**: Shard 3 (Starlight site must be configured before content pages are validated end-to-end, though content pages are structurally independent)

### Validation

- `apps/docs/astro.config.mjs` has Starlight with title "Pathable Styles" and sidebar with 4 sections
- `apps/docs/src/styles/custom.css` imports `@pathable/styles/dist/styles.css` and uses `--pathable-*` custom properties
- `apps/docs/src/content/docs/index.mdx` states PoC nature, no component library, future plans
- Build: `pnpm --filter @pathable/styles build && pnpm --filter @pathable/docs build`

---

## Shard 3: US2 Content Pages

| Field | Value |
|-------|-------|
| **shard_id** | `S01-documentation-03` |
| **task_ids** | T009, T010, T011, T012 |
| **lifecycle_stage** | worker_execution |

### Tasks

- **T009** [P] [US2] — Create Getting Started page at `apps/docs/src/content/docs/getting-started/index.mdx` with GitHub dependency instructions and workspace consumption guidance
- **T010** [P] [US2] — Create Foundations page at `apps/docs/src/content/docs/foundations/index.mdx` describing brand colors, typography, spacing, elevation, and radius tokens
- **T011** [P] [US2] — Create For Agents page at `apps/docs/src/content/docs/for-agents/index.mdx` explaining agent-facing rules and how AI agents should consume the styles package
- **T012** [P] [US2] — Create Roadmap page at `apps/docs/src/content/docs/roadmap/index.mdx` listing future plans

### Write paths

- `apps/docs/src/content/docs/getting-started/index.mdx` (create)
- `apps/docs/src/content/docs/foundations/index.mdx` (create)
- `apps/docs/src/content/docs/for-agents/index.mdx` (create)
- `apps/docs/src/content/docs/roadmap/index.mdx` (create)

### Conflict analysis

No write conflicts — all four MDX pages are independent files. Tasks can be executed in parallel.

### Dependencies

- **depends_on**: Shard 1 (needs workspace to exist and package.json to define deps)
- **parallel with**: Shard 2 (both need Shard 1 but don't need each other's outputs; content pages are just .mdx files that Starlight picks up at build time)

### Validation

- Each MDX file exists at the correct path
- Content matches spec requirements (FR-008 through FR-012)
- Build succeeds: `pnpm --filter @pathable/docs build`

---

## Dependency Graph

```
Shard 1 (T001, T002, T003)
    ├──→ Shard 2 (T005+T012b, T007, T008)
    └──→ Shard 3 (T009, T010, T011, T012)

Shard 2 and Shard 3 can execute in parallel after Shard 1 completes.
```

## Task Assignment Summary

| Task | Shard | Worker Agent |
|------|-------|-------------|
| T001 | S01-documentation-01 | executor |
| T002 | S01-documentation-01 | executor |
| T003 | S01-documentation-01 | executor |
| T005+T012b | S01-documentation-02 | executor |
| T007 | S01-documentation-02 | executor |
| T008 | S01-documentation-02 | executor |
| T009 | S01-documentation-03 | executor |
| T010 | S01-documentation-03 | executor |
| T011 | S01-documentation-03 | executor |
| T012 | S01-documentation-03 | executor |