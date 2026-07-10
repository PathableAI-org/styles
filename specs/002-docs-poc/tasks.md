# Tasks: GitHub Pages Docs PoC

**Input**: Design documents from `/specs/002-docs-poc/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/README.md, quickstart.md

**Tests**: No tests requested in this PoC (no Playwright, no visual regression). All tasks are implementation-only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Phase 1: Setup — Shared Infrastructure](#phase-1-setup--shared-infrastructure)
- [Phase 2: Foundational — Starlight Skeleton](#phase-2-foundational--starlight-skeleton)
- [Phase 3: User Story 1 — Developer views live docs site with Pathable styles (P1)](#phase-3-user-story-1--developer-views-live-docs-site-with-pathable-styles-p1)
- [Phase 4: User Story 2 — Developer navigates docs site sections (P2)](#phase-4-user-story-2--developer-navigates-docs-site-sections-p2)
- [Phase 5: User Story 3 — CI validates docs build on every PR (P2)](#phase-5-user-story-3--ci-validates-docs-build-on-every-pr-p2)
- [Phase 6: User Story 4 — Maintainer deploys docs to GitHub Pages (P3)](#phase-6-user-story-4--maintainer-deploys-docs-to-github-pages-p3)
- [Phase 7: Polish & Cross-Cutting Concerns](#phase-7-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)

---

## Phase 1: Setup — Shared Infrastructure

**Purpose**: Initialize the docs workspace and update monorepo configuration

- [x] T001 Update `pnpm-workspace.yaml` at repo root to include `"apps/*"` alongside existing `"packages/*"`
- [x] T002 Create `apps/docs/package.json` with name `@pathable/docs`, set `"private": true`, add dependencies on `astro`, `@astrojs/starlight`, and `"@pathable/styles": "workspace:*"`
- [x] T003 [P] Create `apps/docs/tsconfig.json` with Astro-compatible TypeScript configuration (extends `astro/tsconfigs/strict`)
- [x] T004 Run `pnpm install` from repo root and verify `pnpm-lock.yaml` is updated

**Checkpoint**: Docs workspace is registered and dependencies are installed.

---

## Phase 2: Foundational — Starlight Skeleton

**Purpose**: Core docs app that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `apps/docs/astro.config.mjs` with `@astrojs/starlight` integration, title "Pathable Styles", and a placeholder sidebar that will be refined by US2 tasks
- [x] T006 Run `pnpm build` from repo root and confirm both `packages/styles/dist/styles.css` and `apps/docs/dist/` are produced without errors

**Checkpoint**: Foundation ready — Starlight site builds successfully. User story implementation can now begin.

---

## Phase 3: User Story 1 — Developer views live docs site with Pathable styles (P1)

**Goal**: The deployed docs site uses Pathable brand CSS custom properties sourced from `@pathable/styles/dist/styles.css`, proving the design tokens are consumable in a real web context.

**Independent Test**: Open `apps/docs/dist/index.html` (or dev server) and inspect the page background — it uses `var(--pathable-color-bg)` and resolves to the correct Pathable brand color. DevTools shows the custom property is defined by `@pathable/styles/dist/styles.css`.

- [x] T007 [P] [US1] Create custom stylesheet at `apps/docs/src/styles/custom.css` that imports `@pathable/styles/dist/styles.css` and applies Pathable CSS custom properties (e.g., `--pathable-color-bg`, `--pathable-color-surface`, `--pathable-color-text`, `--pathable-color-accent`, `--pathable-font-body`, `--pathable-font-heading`) to Starlight theme elements
- [x] T008 [US1] Create homepage at `apps/docs/src/content/docs/index.mdx` stating in plain language: that Pathable Styles is the foundational SCSS/CSS package for Pathable brand styles; the first version documents style foundations, usage guidance, and agent-facing rules; it is not yet a complete component library; future versions may add HTML/CSS examples, React examples, Vue examples, and a component catalog

**Checkpoint**: Homepage renders with Pathable brand styles applied. Custom properties resolve from `@pathable/styles`.

---

## Phase 4: User Story 2 — Developer navigates docs site sections (P2)

**Goal**: The Starlight site has exactly four top-level nav sections (Getting Started, Foundations, For Agents, Roadmap) with short but meaningful content on each page.

**Independent Test**: Open the built site and click each nav item. `/getting-started/` shows setup guidance with GitHub dependency instructions. `/foundations/` describes style tokens. `/for-agents/` explains agent rules. `/roadmap/` lists future plans.

- [x] T009 [P] [US2] Create Getting Started page at `apps/docs/src/content/docs/getting-started/index.mdx` with brief instructions on adding `@pathable/styles` from GitHub (e.g., `"@pathable/styles": "github:PathableAI-org/styles"` in `package.json`) and local workspace consumption via `workspace:*`
- [x] T010 [P] [US2] Create Foundations page at `apps/docs/src/content/docs/foundations/index.mdx` briefly describing the style foundations available: brand colors, typography (font families, scale), spacing scale, elevation levels, and border-radius tokens
- [x] T011 [P] [US2] Create For Agents page at `apps/docs/src/content/docs/for-agents/index.mdx` explaining the agent-facing rules and how AI agents should consume the styles package (reference `AGENTS.md` and `BRAND_RULES.md` from `packages/styles`)
- [x] T012 [P] [US2] Create Roadmap page at `apps/docs/src/content/docs/roadmap/index.mdx` listing future plans: HTML/CSS examples, React examples, Vue examples, component catalog, npm publishing
- [x] T012b [US2] Update `apps/docs/astro.config.mjs` sidebar configuration to include all four nav sections in the correct order: Getting Started, Foundations, For Agents, Roadmap

**Checkpoint**: All four nav sections are visible in the sidebar and each page renders correct content.

---

## Phase 5: User Story 3 — CI validates docs build on every PR (P2)

**Goal**: Every PR runs a GitHub Actions workflow that installs dependencies, builds `@pathable/styles`, and builds `@pathable/docs`. The check must block merging if it fails. No deployment occurs on PRs.

**Independent Test**: Open a PR with the docs changes. The docs-ci.yml workflow appears in the PR checks. It runs pnpm install, builds styles, then builds docs. The check shows green on success.

- [x] T013 Create `.github/workflows/docs-ci.yml` with trigger on `pull_request` (all branches), containing steps: checkout, `pnpm/action-setup` (with version from root `package.json`), `actions/setup-node`, `pnpm install`, `pnpm --filter @pathable/styles build`, `pnpm --filter @pathable/docs build`. No deploy step.

**Checkpoint**: PR workflow runs and validates the build.

---

## Phase 6: User Story 4 — Maintainer deploys docs to GitHub Pages (P3)

**Goal**: Pushes to `main` validate the build and then deploy `apps/docs/dist` to GitHub Pages using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.

**Independent Test**: Merge a change to `main`. The docs-deploy.yml workflow runs, builds, and deploys to GitHub Pages. The live site is accessible at the Pages URL.

- [x] T014 Create `.github/workflows/docs-deploy.yml` with trigger on `push` to `main`, permissions `contents: read`, `pages: write`, `id-token: write`, environment `github-pages`. Steps: checkout, `pnpm/action-setup`, `actions/setup-node`, `pnpm install`, `pnpm --filter @pathable/styles build`, `pnpm --filter @pathable/docs build`, `actions/configure-pages`, `actions/upload-pages-artifact` with path `apps/docs/dist`, `actions/deploy-pages`

**Checkpoint**: Deploy workflow publishes to Pages on push to main.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification that everything works together end-to-end

- [x] T015 Run full build from repo root (`pnpm build`) and confirm zero errors
- [x] T016 Run quickstart.md validation path: build styles independently, build docs independently, verify nav sections in output, confirm `packages/styles` behavior is unchanged (no new files, no modified src files)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (Phase 3) and US2 (Phase 4) can proceed independently of each other once Phase 2 is done
  - US3 (Phase 5) and US4 (Phase 6) depend on the docs app being creatable but are otherwise independent
- **Polish (Phase 7)**: Depends on all phases being complete

### User Story Dependencies

| Dependency | Description |
| --- | --- |
| Phase 1 → Phase 2 | Workspace must be registered before Starlight can be configured |
| Phase 2 → Phase 3,4 | Starlight skeleton must exist before pages and styles can be added |
| Phase 2 → Phase 5,6 | Docs workspace must exist before CI/CD can reference it |
| Phase 3,4 → Phase 7 | Content must exist before full validation |

### Within Each Phase

- Setup tasks T001, T002 must complete before T004 (install)
- T003 [P] can run in parallel with T001, T002
- All US2 page tasks (T009-T012) can run in parallel
- US3 and US4 are independent of each other

### Parallel Opportunities

- T001, T002, T003 can run in parallel (different config files)
- T009, T010, T011, T012 can all run in parallel (different MDX pages)
- T013, T014 can run in parallel (different workflow files)
- US1 and US2 implementation can proceed in parallel once Phase 2 completes

---

## Parallel Example: User Story 2

```bash
# Launch all four content pages together:
Task: "Create Getting Started page in apps/docs/src/content/docs/getting-started/index.mdx"
Task: "Create Foundations page in apps/docs/src/content/docs/foundations/index.mdx"
Task: "Create For Agents page in apps/docs/src/content/docs/for-agents/index.mdx"
Task: "Create Roadmap page in apps/docs/src/content/docs/roadmap/index.mdx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (homepage with Pathable styles)
4. **STOP and VALIDATE**: Open the built site, confirm brand styles are applied
5. Proceed incrementally

### Incremental Delivery

1. Setup + Foundational → Starlight skeleton builds
2. Add US1 (styles + homepage) → Pathable-branded homepage visible (MVP!)
3. Add US2 (four nav pages) → Full nav structure visible
4. Add US3 (PR CI) → Build validated on every PR
5. Add US4 (deploy) → Live on GitHub Pages after merge to main
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Complete Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (styles + homepage)
   - Developer B: US2 (four content pages, sidebar config)
   - Developer C: US3 + US4 (CI/CD workflows)
3. Stories complete and integrate independently
4. All merge into feature branch for Phase 7 full validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Do NOT modify files in `packages/styles/` — FR-019 requires existing behavior preserved
