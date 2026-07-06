# Context Digest Draft: Integration Vertical Capability

**Feature**: 002-docs-poc | **Capability**: Integration | **Date**: 2026-07-04

---

## 1. Vertical Capability Summary

This capability handles **integration** concerns for the GitHub Pages Docs PoC:
- Creating CI/CD workflows (docs-ci.yml for PRs, docs-deploy.yml for main branch)
- Verifying builds work at each phase boundary
- Running full build validation and quickstart validation

---

## 2. Tasks

### T004 — pnpm install verification (Phase 1)
- **Command**: `pnpm install` from repo root
- **Prerequisite**: T001, T002, T003 must be complete (pnpm-workspace.yaml updated, package.json created, tsconfig.json created)
- **Verification**: `pnpm-lock.yaml` is updated; exit code 0
- **FRs satisfied**: FR-003 (workspace includes apps/*), FR-004 (docs workspace registered)

### T006 — pnpm build verification (Phase 2)
- **Command**: `pnpm build` from repo root
- **Prerequisite**: T005 must be complete (astro.config.mjs created). All content (T007-T012b) should also be done.
- **Verification**: Both `packages/styles/dist/styles.css` AND `apps/docs/dist/` exist; no errors
- **FRs satisfied**: FR-013 (root build command builds all workspaces), FR-018 (output at apps/docs/dist)

### T013 — docs-ci.yml (Phase 5, US3)
- **Path**: `.github/workflows/docs-ci.yml`
- **Trigger**: `pull_request` (all branches)
- **Steps**: checkout → pnpm/action-setup → actions/setup-node → pnpm install → pnpm --filter @pathable/styles build → pnpm --filter @pathable/docs build
- **No deploy step**
- **FRs satisfied**: FR-014, FR-017
- **Reference patterns**: See `.github/workflows/lint.yml` and `format.yml` for existing pnpm/action-setup and setup-node conventions (commit pins, node version 23, cache: pnpm)

### T014 — docs-deploy.yml (Phase 6, US4)
- **Path**: `.github/workflows/docs-deploy.yml`
- **Trigger**: `push` to `main`
- **Permissions**: `contents: read`, `pages: write`, `id-token: write`
- **Environment**: `github-pages`
- **Steps**: checkout → pnpm/action-setup → actions/setup-node → pnpm install → pnpm --filter @pathable/styles build → pnpm --filter @pathable/docs build → actions/configure-pages → actions/upload-pages-artifact (path: apps/docs/dist) → actions/deploy-pages
- **FRs satisfied**: FR-015, FR-016, FR-017

### T015 — Full build validation (Phase 7)
- **Command**: `pnpm build` from repo root
- **Prerequisite**: All T001-T014 tasks complete
- **Verification**: Zero errors, exit 0
- **FRs satisfied**: FR-013, SC-001

### T016 — Quickstart validation (Phase 7)
- **Commands from quickstart.md**:
  1. `pnpm --filter @pathable/styles build` + verify `packages/styles/dist/styles.css` exists
  2. `pnpm --filter @pathable/docs build` + verify `apps/docs/dist/index.html` exists
  3. `pnpm build` (full) → exit 0
  4. Verify nav sections in output: `apps/docs/dist/getting-started/index.html`, `/foundations/`, `/for-agents/`, `/roadmap/` all exist
  5. Confirm `packages/styles` behavior is unchanged — `git status packages/styles/` shows no modifications
- **FRs satisfied**: FR-019, SC-002, SC-007

---

## 3. Context Index Constants

| Constant | Value |
|----------|-------|
| workspace_name | `@pathable/docs` |
| docs_dir | `apps/docs` |
| styles_package | `@pathable/styles` |
| styles_workspace_dir | `packages/styles` |
| workspace_yaml | `pnpm-workspace.yaml` |
| pr_workflow | `.github/workflows/docs-ci.yml` |
| deploy_workflow | `.github/workflows/docs-deploy.yml` |
| astro_config | `apps/docs/astro.config.mjs` |
| package_manager | `pnpm@10.33.0` |
| root_build_cmd | `pnpm build` |

---

## 4. Spec Requirements (FRs in Scope)

| FR | Description | Relevant Tasks |
|----|-------------|---------------|
| FR-003 | pnpm-workspace.yaml includes `apps/*` | T004 |
| FR-004 | apps/docs/package.json has name @pathable/docs, private, workspace:* dep | T004 |
| FR-013 | Root `pnpm build` builds all workspaces in order | T006, T015 |
| FR-014 | PR workflow validates build, no deploy | T013 |
| FR-015 | Deploy workflow builds + deploys to Pages on push to main | T014 |
| FR-016 | Deploy workflow uses pnpm/action-setup and actions/setup-node | T014 |
| FR-017 | Workflows must not add React, Vue, Storybook, etc. | T013, T014 |
| FR-018 | Build output at apps/docs/dist | T006, T015 |
| FR-019 | packages/styles untouched | T016 |

---

## 5. Existing Workflow Patterns (Reference)

Both `.github/workflows/lint.yml` and `format.yml` use:
- `actions/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0` (v7.0.0 commit SHA)
- `pnpm/action-setup@0ebf47130e4866e96fce0953f49152a61190b271` (v6 commit SHA)
- `actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e` (v6.4.0 commit SHA) with `node-version: 23`, `cache: 'pnpm'`
- `pnpm install --frozen-lockfile` for dependency install

---

## 6. Capability Boundaries

### Owns (creates)
- `.github/workflows/docs-ci.yml`
- `.github/workflows/docs-deploy.yml`

### Must Not Touch
All files under `packages/styles/` (src, dist, package.json, README.md, BRAND_RULES.md, AGENTS.md) per FR-019.

### Depends On
- Setup: T001 (pnpm-workspace.yaml), T002 (package.json), T003 (tsconfig.json)
- Foundational: T005 (astro.config.mjs)
- Content: T007 (custom.css), T008 (index.mdx), T009-T012b (nav pages + sidebar config)

---

## 7. Execution Strategy

The tasks must be executed in dependency order:

```
T004 ──► T006 ──► T013 + T014 ──► T015 ──► T016
(verify   (verify   (create CI/CD   (full     (quickstart
 install)  build)     workflows)      build)    validation)
```

T013 and T014 can be written in parallel (different files). T004 must run after Setup (T001-T003). T006 must run after Foundational (T005) and ideally after content (T007-T012b). T015/T016 must run after everything else.

---

## 8. Verification Commands

```bash
# T004
pnpm install

# T006, T015
pnpm build

# T016 — Step 2: Build styles independently
pnpm --filter @pathable/styles build
ls packages/styles/dist/styles.css

# T016 — Step 3: Build docs independently
pnpm --filter @pathable/docs build
ls apps/docs/dist/index.html

# T016 — Step 5: Verify nav sections in output
ls apps/docs/dist/getting-started/index.html
ls apps/docs/dist/foundations/index.html
ls apps/docs/dist/for-agents/index.html
ls apps/docs/dist/roadmap/index.html

# T016 — Confirm packages/styles untouched
git status packages/styles/
```

---

## 9. Context Gaps

None identified. All requirements and execution paths are clearly specified.

---

## 10. Forbidden Actions

- Editing `tasks.md`
- Touching any file under `packages/styles/`
- Dispatching sub-workers
- Writing the final `handoff-manifest.json`
- Adding deploy, publish, or additional dependency steps to workflows
- Adding React, Vue, Storybook, Tailwind, or Playwright