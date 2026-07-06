# Context Digest: S05-integration-01 (Build Verification)

## Tasks

| Task | Description | Phase | Prerequisite |
|------|-------------|-------|-------------|
| T004 | Run `pnpm install` and verify lockfile | Phase 1 | T001-T003 |
| T006 | Run `pnpm build` and verify both styles and docs output | Phase 2 | T005, T007-T012b |
| T015 | Full build zero errors | Phase 7 | All prior |
| T016 | Quickstart validation path | Phase 7 | All prior |

## Spec Requirements

| FR | Description |
|----|-------------|
| FR-003 | pnpm-workspace.yaml includes `apps/*` |
| FR-004 | apps/docs/package.json correctly configured |
| FR-013 | Root `pnpm build` builds all workspaces in order |
| FR-018 | Build output at apps/docs/dist |
| FR-019 | packages/styles untouched |

## Quickstart Validation Commands (from quickstart.md)

```bash
# Step 1: pnpm install
pnpm install

# Step 2: Build styles independently
pnpm --filter @pathable/styles build
ls packages/styles/dist/styles.css

# Step 3: Build docs independently
pnpm --filter @pathable/docs build
ls apps/docs/dist/index.html

# Step 4: Full root build
pnpm build && echo "Exit: $?"

# Step 5: Verify nav sections
ls apps/docs/dist/getting-started/index.html
ls apps/docs/dist/foundations/index.html
ls apps/docs/dist/for-agents/index.html
ls apps/docs/dist/roadmap/index.html

# Step 6: Confirm packages/styles untouched
git status packages/styles/
```