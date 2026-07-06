# Shard Plan: Integration Vertical Capability

**Feature**: 002-docs-poc | **Capability**: Integration | **Date**: 2026-07-04

## Tasks Assigned

| ID | Description | Phase |
|----|-------------|-------|
| T004 | Run `pnpm install` and verify lockfile | Phase 1 Setup |
| T006 | Run `pnpm build` and verify outputs | Phase 2 Foundational |
| T013 | Create `.github/workflows/docs-ci.yml` | Phase 5 US3 (CI) |
| T014 | Create `.github/workflows/docs-deploy.yml` | Phase 6 US4 (Deploy) |
| T015 | Run full build and confirm zero errors | Phase 7 Polish |
| T016 | Run quickstart.md validation path | Phase 7 Polish |

## Shard Breakdown

### Shard A: CI/CD Workflows
**Tasks**: T013, T014
**Owner**: Integration (CI/CD) worker
**Type**: File creation

Creates two GitHub Actions workflow YAML files. These are independent of each other (different files, different triggers) and can be executed in parallel or sequentially.

- **T013** — `docs-ci.yml`: PR validation workflow. Trigger on `pull_request` to any branch. Steps: checkout, pnpm/action-setup, actions/setup-node, pnpm install, pnpm --filter @pathable/styles build, pnpm --filter @pathable/docs build. No deploy step. Follow existing conventions from `.github/workflows/lint.yml` and `format.yml` (same pnpm/action-setup and setup-node patterns).
- **T014** — `docs-deploy.yml`: Deploy workflow. Trigger on `push` to `main`. Permissions: `contents: read`, `pages: write`, `id-token: write`. Environment: `github-pages`. Steps: checkout, pnpm/action-setup, actions/setup-node, pnpm install, pnpm --filter @pathable/styles build, pnpm --filter @pathable/docs build, actions/configure-pages, actions/upload-pages-artifact (path: apps/docs/dist), actions/deploy-pages.

**Dependencies on other capabilities**: Both workflows reference `@pathable/docs` workspace — the docs workspace (package.json, astro config) must exist before these workflows can be tested, but the YAML files themselves can be authored independently.

**Parallelism**: T013 and T014 can be written in parallel since they are separate files with no conflicts.

---

### Shard B: Build Verification
**Tasks**: T004, T006, T015, T016
**Owner**: Integration (Verification) worker
**Type**: Sequential verification

Runs the project through its build lifecycle at each phase boundary to catch integration failures early.

| Step | Task | Prerequisite | Command | Expected Outcome |
|------|------|-------------|---------|------------------|
| 1 | T004 | Phase 1 setup (T001+T002+T003 complete) | `pnpm install` | `pnpm-lock.yaml` updated, exit 0 |
| 2 | T006 | Phase 2 foundational (T005 complete) | `pnpm build` | `packages/styles/dist/styles.css` AND `apps/docs/dist/` exist, exit 0 |
| 3 | T015 | All Phases 1-6 complete | `pnpm build` | Zero errors, exit 0 |
| 4 | T016 | All prior steps green | See quickstart.md | Build styles independently, build docs independently, verify 4 nav sections, confirm `packages/styles` untouched |

**Dependencies on other capabilities**:
- T004 requires Setup tasks (T001, T002, T003) to be complete
- T006 requires Foundational task (T005, T007-T012b) to be complete
- T015 requires CI/CD workflows (T013, T014) plus all content tasks to be complete
- T016 requires everything to be done

**Sequential constraint**: These steps MUST run in order — each verifies the output of a phase before the next can proceed.

**State to preserve**: Before and after verification, confirm `packages/styles/` files are unchanged (FR-019). Take note of modification timestamps or use `git status` on `packages/styles/`.

---

## Execution Order

```
[Other capabilities: Setup (T001-T003), Foundational (T005), Pages (T007-T012b)]
         │
         ▼
Shard B Step 1 ── T004: pnpm install verification
         │
[Other capabilities complete their work]
         │
         ▼
Shard B Step 2 ── T006: pnpm build verification
         │
         ▼
Shard A ────────── T013 + T014: Create CI/CD workflows (parallel)
         │
         ▼
Shard B Step 3 ── T015: Full build verification
         │
         ▼
Shard B Step 4 ── T016: Quickstart validation
```

**Shard A** (CI/CD workflows) can technically be authored at any point once the docs workspace is conceptually defined. It is shown running after T006 because the workflows reference `@pathable/docs`, but the files can be created earlier if the worker has context about the expected workspace structure.

---

## Files to Create

| File | Task | Content Source |
|------|------|---------------|
| `.github/workflows/docs-ci.yml` | T013 | spec.md FR-014, plan.md structure, existing lint.yml patterns |
| `.github/workflows/docs-deploy.yml` | T014 | spec.md FR-015/FR-016, plan.md structure, existing format.yml patterns |

## Files to Verify Exist (but not create)

| Path | Verified By | Notes |
|------|-------------|-------|
| `apps/docs/package.json` | T004 | Must exist before install |
| `apps/docs/astro.config.mjs` | T006 | Must exist before build |
| `apps/docs/src/content/docs/index.mdx` | T015, T016 | Content from US1/US2 |
| `apps/docs/src/content/docs/getting-started/index.mdx` | T016 | Nav section verification |
| `apps/docs/src/content/docs/foundations/index.mdx` | T016 | Nav section verification |
| `apps/docs/src/content/docs/for-agents/index.mdx` | T016 | Nav section verification |
| `apps/docs/src/content/docs/roadmap/index.mdx` | T016 | Nav section verification |
| `apps/docs/src/styles/custom.css` | T015, T016 | Style integration |

## Commands to Run During Verification

```bash
# T004
pnpm install                                          # Install all workspace deps

# T006, T015
pnpm build                                            # Build all workspaces in order

# T016 — Step 2: Build styles independently
pnpm --filter @pathable/styles build
ls packages/styles/dist/styles.css

# T016 — Step 3: Build docs independently
pnpm --filter @pathable/docs build
ls apps/docs/dist/index.html

# T016 — Step 4: Full root build
pnpm build && echo "Exit: $?"

# T016 — Step 5: Verify nav sections in output
ls apps/docs/dist/getting-started/index.html
ls apps/docs/dist/foundations/index.html
ls apps/docs/dist/for-agents/index.html
ls apps/docs/dist/roadmap/index.html

# T016 — Confirm packages/styles is untouched
git status packages/styles/
```