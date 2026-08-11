---
goal: Enable versioned npm publishing for @pathable/styles and @pathable/react
version: 1.0
date_created: 2026-08-11
last_updated: 2026-08-11
owner: PathAble maintainers
status: 'Planned'
tags:
  - process
  - npm
  - changesets
  - release
  - supply-chain
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan converts `@pathable/styles` and `@pathable/react` from private
workspace packages into independently versioned public npm packages managed by
Changesets. It includes package-contract hardening, a reviewable release-PR
loop, protected npm publishing through trusted publishing, and first-release
bootstrap steps.

The repository is not currently publish-ready. The audit on 2026-08-11 found:

| Area               | Current state                                                                                                          | Required state                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Changesets         | No `.changeset/` directory, CLI dependency, scripts, or workflow                                                       | Changesets 3 CLI and Changesets Action 2 release flow                                        |
| `@pathable/styles` | `private: true`; no `version`; `npm pack --dry-run` fails with `Invalid package, must have name and version`           | Public package with a valid baseline version and complete metadata                           |
| `@pathable/react`  | `private: true`; placeholder `0.0.0`; no publish metadata                                                              | Public package with a valid baseline version and complete metadata                           |
| npm registry       | Both package lookups return npm `E404`                                                                                 | First public versions published under the npm `@pathable` organization                       |
| Runtime            | Workflows use Node 23, which is EOL; Changesets 3 does not support Node 23                                             | Node 24 LTS for local policy and all workflows                                               |
| Styles artifact    | Build outputs are generated and ignored; no package validation script                                                  | Reproducible build plus manifest and tarball checks                                          |
| React artifact     | The current Vite output extracts `dist/index.css` without exporting or importing it and bundles React JSX runtime code | Published JS imports the styles dependency and leaves all React runtime entrypoints external |
| Automation         | PR CI validates React packaging but there is no release-PR or publish workflow                                         | Separate version and publish capabilities with least-privilege permissions                   |
| Authentication     | No repository-owned npm publishing contract                                                                            | One-time bootstrap publish followed by npm trusted publishing with OIDC                      |

## 1. Requirements & Constraints

- **REQ-001**: Publish exactly `@pathable/styles` and `@pathable/react`; keep
  `@pathable/storybook`, `@pathable/storybook-react`, and the workspace root
  private and non-publishable.
- **REQ-002**: Initialize both publishable package manifests at version
  `0.0.0` and preserve that version for the first public release. Record the
  Changesets setup with an empty changeset so preparation does not create an
  unintended version bump.
- **REQ-003**: Version the two packages independently. Keep `fixed` and
  `linked` empty because `@pathable/styles` owns the styling contract while
  `@pathable/react` is a dependent package with its own API release cadence.
- **REQ-004**: Declare `@pathable/styles` from `@pathable/react` as
  `workspace:^` so pnpm rewrites the packed dependency to a compatible caret
  range, such as `^0.0.0` for the initial release.
- **REQ-005**: Generate and review package changelogs through Changesets. Every
  user-visible package change MUST include a changeset; repository-only docs,
  test, workflow, and tooling changes MAY omit one.
- **REQ-006**: The release workflow MUST open or update a version PR while
  changeset files exist and MUST publish only after that version PR is merged.
- **REQ-007**: Release output MUST create package-specific Git tags and GitHub
  releases using Changesets defaults after a successful npm publish.
- **REQ-008**: Both packages MUST be public scoped npm packages with
  `publishConfig.access` set to `public`.
- **REQ-009**: Both package manifests MUST declare the Unlicense, the exact
  public repository URL `git+https://github.com/PathableAI-org/styles.git`, and
  their package directory.
- **REQ-010**: The release build MUST start from a clean checkout, install with
  `pnpm install --frozen-lockfile`, rebuild all publishable output, validate both
  manifests, inspect both tarballs, and smoke-test installation before publish.
- **REQ-011**: Importing `@pathable/react` MUST retain the documented automatic
  import of `@pathable/styles/dist/styles.css`; consumers MUST NOT need to find
  an unexported `dist/index.css` artifact.
- **REQ-012**: The React package MUST externalize `react`, `react-dom`, and all
  of their runtime subpaths so peer dependencies are not bundled.
- **REQ-013**: `@pathable/styles` MUST publish compiled CSS, source SCSS,
  JavaScript helpers, required USWDS icons, fonts, and package documentation;
  generated source maps MAY be included only after their source paths are
  reviewed for portability.
- **REQ-014**: The repository MUST standardize on Node 24 LTS. Add a root
  `engines.node` range compatible with Node 24 and replace every workflow
  `node-version: 23` with `node-version: 24`.
- **SEC-001**: After the bootstrap release, npm publishing MUST use npm trusted
  publishing with GitHub Actions OIDC; do not retain a long-lived npm write
  token in repository secrets.
- **SEC-002**: The publish job MUST run on a GitHub-hosted runner and have
  `id-token: write`. Non-publish jobs MUST NOT have that permission.
- **SEC-003**: Do not configure `registry-url` or an empty npm auth-token entry
  in the OIDC publish job because that can prevent npm CLI OIDC discovery.
- **SEC-004**: Pin every third-party action to a full commit SHA with a version
  comment. Pin Changesets Action 2.0.0 to
  `22ccf9aa43179fe9e27dc62e575971d28cce197c`.
- **SEC-005**: Use a protected GitHub environment named `npm` for the publish
  job. Configure required reviewers before enabling unattended publication.
- **CON-001**: The npm `@pathable` organization, package ownership, billing
  policy, and maintainer access are external prerequisites and cannot be
  configured from this repository.
- **CON-002**: npm trusted publishers are configured per package. The first
  version must exist before its package settings can be used to bind the
  repository workflow.
- **CON-003**: The trusted publisher repository value MUST be
  `PathableAI-org/styles`, the workflow filename MUST exactly match
  `release.yml`, the environment MUST be `npm`, and the allowed operation MUST
  include `npm publish`.
- **CON-004**: The installed `@changesets/cli@3.0.0` requires Node
  `^22.11 || ^24 || >=26`, npm `>=10.9.0`, and pnpm `>=10.0.0`.
- **GUD-001**: Do not make the two packages fixed or linked merely because one
  depends on the other. Let Changesets calculate dependent releases when a new
  styles version falls outside the React dependency range.
- **GUD-002**: Use an empty setup changeset so both manifests remain at
  `0.0.0`. Begin semantic version bumps with the first package change after the
  initial publication.
- **PAT-001**: Keep release stages ordered as version intent, reviewable version
  PR, clean build and pack, protected publish, registry verification.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Make both package manifests valid and make the built artifacts
  match the public consumption contracts before adding publish credentials.

| Task     | Description                                                                                                                                                                                                                                                                                                                                                                                                  | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ---- |
| TASK-001 | In root `package.json`, add `engines.node: ">=24 <25"`; add `@changesets/cli: "^3.0.0"` to `devDependencies`; add scripts `changeset`, `version-packages`, `release:build`, `release:check`, and `release`. Define `release` as the ordered execution of package build, package checks, and `changeset publish`.                                                                                             |           |      |
| TASK-002 | Update `pnpm-lock.yaml` with pnpm 11.11.0 after TASK-001. Run the install under Node 24 and keep the exact root `packageManager` value unchanged.                                                                                                                                                                                                                                                            |           |      |
| TASK-003 | In `packages/styles/package.json`, add `version: "0.0.0"`, remove `private`, and add `description`, `license: "Unlicense"`, `repository` with URL and `directory: "packages/styles"`, `homepage`, `bugs`, `keywords`, `sideEffects: ["*.css", "dist/*.css"]`, and `publishConfig: { "access": "public" }`. Keep the existing files and exports contract unless tarball validation proves a missing artifact. |           |      |
| TASK-004 | In `packages/react/package.json`, remove `private`; retain baseline `version: "0.0.0"`; add the same publication metadata with `directory: "packages/react"`; add `sideEffects` for the transitive CSS import; add `publishConfig.access: "public"`; change `@pathable/styles` to `workspace:^`.                                                                                                             |           |      |
| TASK-005 | In `packages/react/vite.config.ts`, replace the exact external list with logic that externalizes `react`, `react-dom`, `react/*`, `react-dom/*`, `@pathable/styles`, and `@pathable/styles/*`. Confirm rebuilt `dist/index.js` retains `import '@pathable/styles/dist/styles.css'`, contains no bundled React license/runtime block, and does not produce an orphaned `dist/index.css`.                      |           |      |
| TASK-006 | Add `check:package` and `pack:check` scripts to `packages/styles/package.json` using the existing root `publint` dependency and `pnpm pack --dry-run --json`. Extend the React package check to assert its tarball includes all declarations referenced from `dist/index.d.ts`.                                                                                                                              |           |      |
| TASK-007 | Repair `packages/styles/README.md` package-facing Markdown: close the installation fence, place SCSS in a separate fenced block, and replace repository-relative links that will not exist in the tarball with public repository URLs or included documents. Review `packages/react/README.md` against the rebuilt styles-loading behavior.                                                                  |           |      |
| TASK-008 | Add isolated consumer smoke fixtures under `scripts/package-smoke/` that install the two generated tarballs in a temporary directory and verify: styles CSS/JS exports resolve; React ESM and types resolve; React peer dependencies remain external; the packed React manifest contains a registry-safe `@pathable/styles` range with no `workspace:` protocol.                                             |           |      |

### Implementation Phase 2

- GOAL-002: Establish Changesets policy, contributor commands, and a
  reviewable initial `0.0.0` release baseline.

| Task     | Description                                                                                                                                                                                                                                                                                                                                           | Completed | Date       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- |
| TASK-009 | Create `.changeset/config.json` with `changelog: "@changesets/cli/changelog"`, `commit: false`, `fixed: []`, `linked: []`, `access: "public"`, `baseBranch: "main"`, `updateInternalDependencies: "patch"`, `bumpVersionsWithWorkspaceProtocolOnly: true`, and `ignore: []`.                                                                          |           |            |
| TASK-010 | Create `.changeset/README.md` documenting package selection and semver policy. Require patch for compatible fixes, minor for backward-compatible features, major for breaking changes, and explain pre-1.0 judgment explicitly. Document that repository-only work may use an empty changeset decision rather than a fabricated package bump.         |           |            |
| TASK-011 | Add a checked-in empty changeset describing the Changesets setup without assigning a release to either package. Verify `changeset status --output` reports an empty `releases` array and leaves both manifests at `0.0.0`.                                                                                                                            | ✅        | 2026-08-11 |
| TASK-012 | Update root `README.md` with contributor and maintainer commands: `pnpm changeset`, `pnpm changeset status`, `pnpm version-packages`, package tarball validation, and the release-PR lifecycle. Do not document direct routine publication from a workstation.                                                                                        |           |            |
| TASK-013 | Add a pull-request Changesets status job using `changesets/action/pr-status` pinned to the SHA in SEC-004. Surface the generated status without requiring a release changeset for repository-only changes. If a PR comment is enabled, grant only `pull-requests: write` to the comment job and never use `pull_request_target` to run checkout code. |           |            |

### Implementation Phase 3

- GOAL-003: Add least-privilege release automation that versions on `main` and
  publishes only reviewed release commits.

| Task     | Description                                                                                                                                                                                                                                                                                                         | Completed | Date |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-014 | Replace every `node-version: 23` in `.github/workflows/*.yml` with `node-version: 24`. Validate existing CI before introducing publication so runtime migration failures are isolated.                                                                                                                              |           |      |
| TASK-015 | Create `.github/workflows/release.yml` triggered by pushes to `main` with concurrency group `release-${{ github.ref }}` and `cancel-in-progress: false`. Use Changesets Action 2.0.0 sub-actions, not the combined action, so OIDC permission exists only in the publish job.                                       |           |      |
| TASK-016 | Add a `mode` job with `contents: read` that checks out the full repository, sets up pnpm and Node 24 without `registry-url`, installs frozen dependencies, and runs `changesets/action/select-mode`. Export its `mode` and `publish-plan-artifact-id`.                                                              |           |      |
| TASK-017 | Add a `version` job gated on mode `version`, with only `contents: write` and `pull-requests: write`. Run `changesets/action/version` with script `pnpm version-packages`, PR title `chore: version packages`, commit message `chore: version packages`, and base branch `main`.                                     |           |      |
| TASK-018 | Add a `build-and-pack` job gated on mode `publish`, with `contents: read` only. Perform frozen install, complete package builds, lint/type/package validations, tarball assertions, and consumer smoke tests, then run `changesets/action/pack` using the publish-plan artifact. Export its `pack-dir-artifact-id`. |           |      |
| TASK-019 | Add a `publish` job gated on successful `build-and-pack`, assigned to the protected `npm` environment, with `contents: write` and `id-token: write`. Do not set `NODE_AUTH_TOKEN` and do not set `registry-url`. Run `changesets/action/publish` with the pack artifact and enable GitHub releases and tags.        |           |      |
| TASK-020 | In GitHub repository settings, enable Actions to create pull requests and protect the `npm` environment with required reviewers. Confirm branch protection does not prevent the version action from updating its dedicated release PR.                                                                              |           |      |

### Implementation Phase 4

- GOAL-004: Bootstrap ownership safely, enable OIDC for both packages, and
  prove the steady-state release loop end to end.

| Task     | Description                                                                                                                                                                                                                                                                                                                                           | Completed | Date |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---- |
| TASK-021 | Before merging the implementation, verify that the npm `@pathable` organization exists, the intended maintainer has publish rights, public scoped packages are allowed, and both registry names still return `E404`. Record the maintainer and recovery owner in private operations documentation, not in repository secrets.                         |           |      |
| TASK-022 | Merge the implementation and review the release-preparation PR that consumes the empty setup changeset. Require both manifests to remain at `0.0.0`, the React packed dependency to resolve to `@pathable/styles: ^0.0.0`, and all CI checks to pass before publication.                                                                              |           |      |
| TASK-023 | Bootstrap the first publication with a short-lived granular npm token scoped only to `@pathable/styles` and `@pathable/react`, or an interactive maintainer publish with required npm 2FA. Use the exact tarballs produced and validated from the reviewed release commit; publish styles before React. Revoke the token immediately if one was used. |           |      |
| TASK-024 | In npm settings for each new package, configure GitHub Actions trusted publishing with organization `PathableAI-org`, repository `styles`, workflow `release.yml`, environment `npm`, and allowed action `npm publish`.                                                                                                                               |           |      |
| TASK-025 | Trigger a no-op release workflow and verify mode `none` performs no publish. Then merge one controlled patch changeset, review the version PR, and verify OIDC publishes the patch, creates package tags/releases, and reports provenance.                                                                                                            |           |      |
| TASK-026 | Verify `npm view @pathable/styles version dist-tags repository --json` and `npm view @pathable/react version dist-tags dependencies repository --json`; install both from the public registry in a clean temporary consumer; run the same CSS, ESM, and TypeScript smoke tests; attach results to the release record.                                 |           |      |

## 3. Alternatives

- **ALT-001**: Use one fixed version for both packages. Rejected because styles
  and React expose different contracts and should not publish unchanged
  packages for every release.
- **ALT-002**: Publish directly on every merge to `main` without a version PR.
  Rejected because version, changelog, and internal dependency changes would not
  receive focused review.
- **ALT-003**: Keep a long-lived npm automation token in GitHub Secrets.
  Rejected for steady state because npm trusted publishing provides
  workflow-bound short-lived credentials. A tightly scoped temporary token is
  allowed only for the first-package bootstrap.
- **ALT-004**: Publish `@pathable/react` with bundled CSS and bundled React JSX
  runtime. Rejected because it contradicts peer dependency semantics and the
  documented `@pathable/styles` ownership contract.
- **ALT-005**: Start at `1.0.0`. Rejected for the initial plan because the
  repository currently labels React `0.0.0` and has not yet established public
  compatibility expectations. Promotion to `1.0.0` requires an explicit API
  stability review after real consumer validation.
- **ALT-006**: Use Changesets Action 1 with Changesets CLI 2. Rejected because
  the current release line is Action 2 with CLI 3 and supplies separate
  least-privilege version, pack, and publish sub-actions.

## 4. Dependencies

- **DEP-001**: `@changesets/cli@^3.0.0`.
- **DEP-002**: `changesets/action@2.0.0`, pinned to commit
  `22ccf9aa43179fe9e27dc62e575971d28cce197c`.
- **DEP-003**: Node 24 LTS and pnpm 11.11.0.
- **DEP-004**: Existing `publint`, `@arethetypeswrong/cli`, TypeScript, Vite,
  and package build scripts.
- **DEP-005**: npm `@pathable` organization administration and publisher rights.
- **DEP-006**: GitHub repository Actions permission to create pull requests and
  a protected `npm` deployment environment.

## 5. Files

- **FILE-001**: `package.json` — runtime policy, Changesets dependency, and
  release scripts.
- **FILE-002**: `pnpm-lock.yaml` — locked Changesets dependency graph.
- **FILE-003**: `.changeset/config.json` — versioning and publishing policy.
- **FILE-004**: `.changeset/README.md` — contributor semver workflow.
- **FILE-005**: `.changeset/<generated-id>.md` — empty initial `0.0.0` release
  preparation intent.
- **FILE-006**: `packages/styles/package.json` — public package manifest and
  package checks.
- **FILE-007**: `packages/react/package.json` — public package manifest,
  dependency range, and side-effect contract.
- **FILE-008**: `packages/react/vite.config.ts` — peer and styles externalization.
- **FILE-009**: `packages/styles/README.md` — package-safe installation guidance.
- **FILE-010**: `packages/react/README.md` — verified consumption guidance.
- **FILE-011**: `scripts/package-smoke/**` — tarball and clean-consumer checks.
- **FILE-012**: `.github/workflows/release.yml` — version, pack, and publish flow.
- **FILE-013**: `.github/workflows/ci-full.yml` — package validation and Node 24.
- **FILE-014**: `.github/workflows/docs-ci.yml` — Node 24.
- **FILE-015**: `.github/workflows/docs-deploy.yml` — Node 24.
- **FILE-016**: `.github/workflows/format.yml` — Node 24 and Changesets paths.
- **FILE-017**: `.github/workflows/lint.yml` — Node 24 and Changesets paths.
- **FILE-018**: `.github/workflows/storybook-quality.yml` — Node 24.
- **FILE-019**: `README.md` — contributor and maintainer release documentation.

## 6. Testing

- **TEST-001**: `pnpm install --frozen-lockfile` succeeds under Node 24 from a
  clean checkout.
- **TEST-002**: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and the existing
  Storybook quality gates pass under Node 24.
- **TEST-003**: `pnpm --filter @pathable/styles pack --dry-run --json` succeeds
  and contains every required CSS, JS, icon, font, SCSS, and documentation file.
- **TEST-004**: `pnpm --filter @pathable/react check:package` and
  `check:types` pass against a clean rebuilt `dist`.
- **TEST-005**: React tarball inspection finds no `workspace:` dependency and
  records a caret range for `@pathable/styles`.
- **TEST-006**: React bundle inspection finds the styles import and no embedded
  React JSX runtime implementation.
- **TEST-007**: A temporary ESM consumer imports both packages from tarballs and
  resolves all declared exports.
- **TEST-008**: A temporary TypeScript consumer typechecks imports for every
  symbol exported from `packages/react/src/index.ts`.
- **TEST-009**: `pnpm changeset status --output` reports no version bump for the
  empty setup changeset and calculates dependent releases correctly in fixtures
  for later styles patch, minor, and major changes.
- **TEST-010**: Release workflow mode tests prove changesets select `version`, a
  merged version PR selects `publish`, and a fully published commit selects
  `none`.
- **TEST-011**: First registry installation verifies CSS asset URLs, JavaScript
  helper exports, React runtime imports, React types, and peer dependency
  behavior.
- **TEST-012**: `git diff --check` and `pnpm check:format` pass for the complete
  implementation range.

## 7. Risks & Assumptions

- **RISK-001**: npm names returning `E404` can mean either unpublished or not
  visible to the current credentials. Recheck while authenticated as the npm
  organization maintainer immediately before bootstrap.
- **RISK-002**: A malformed first tarball cannot be overwritten at the same
  version. Require tarball installation tests before any irreversible publish.
- **RISK-003**: Node 24 migration may expose independent build or dependency
  issues. Land and validate the runtime migration before enabling the publish
  job.
- **RISK-004**: The React package currently has locally stale generated output
  because local build validation was blocked by a pnpm modules-layout purge
  prompt after the workstation switched to Node 26. Treat only a clean Node 24
  build as release evidence.
- **RISK-005**: `workspace:*` would publish an exact styles dependency and make
  compatible patch adoption unnecessarily rigid. TASK-004 intentionally
  changes this to `workspace:^` before the initial release.
- **RISK-006**: Changesets Action and npm trusted publishing behavior is
  evolving. Pin the audited action commit and validate the workflow in a
  protected environment before removing the bootstrap fallback.
- **RISK-007**: npm provenance links require the manifest repository URL to
  match the GitHub repository exactly; forks cannot safely publish these
  manifests through the configured trusted publisher.
- **ASSUMPTION-001**: Both packages are intended to be public and licensed under
  the repository's existing Unlicense.
- **ASSUMPTION-002**: `0.0.0` is the desired first public compatibility level.
- **ASSUMPTION-003**: Package releases should be independent and use the npm
  `latest` dist-tag for stable releases; prerelease channels are out of scope.
- **ASSUMPTION-004**: The `@pathable` npm organization can authorize
  `PathableAI-org/styles` and the `release.yml` workflow for trusted publishing.

## 8. Related Specifications / Further Reading

- [Current React wrapper implementation plan](../specs/032-react-link-tag-wrappers/plan.md)
- [Changesets configuration](https://changesets.dev/guide/config)
- [Changesets versioning and publishing](https://changesets.dev/guide/versioning-and-publishing)
- [Changesets Action 2](https://github.com/changesets/action/tree/v2)
- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)
- [pnpm workspace publishing](https://pnpm.io/workspaces#publishing-workspace-packages)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
