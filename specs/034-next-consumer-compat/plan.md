# Implementation Plan: Next Consumer Compatibility

**Branch**: `034-next-consumer-compat` | **Date**: 2026-08-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/034-next-consumer-compat/spec.md`

## Summary

Correct the publishable `@pathableai/react` and `@pathableai/styles` contracts so a Next.js 15 App Router application using React 18 can build and server-render representative components. Keep all React runtime entrypoints external, preserve the constitutional automatic-style contract through the React public entrypoint, copy USWDS assets to the package-root paths already encoded in compiled CSS, and add a packed-tarball consumer smoke test. Prepare patch Changesets for both packages without publishing or overwriting the current generated 0.0.1 release output.

## Technical Context

**Language/Version**: TypeScript and ECMAScript modules on Node.js `^24.0.0 || >=26.0.0`  
**Primary Dependencies**: Vite 6 library mode, React/React DOM peer dependencies, `@pathableai/styles`, Sass, USWDS, Next.js 15.5.22 and React 18.3.1 for consumer validation  
**Storage**: N/A; package artifacts and temporary test fixtures only  
**Testing**: Node assertion smoke script, pnpm pack, Next production build/start, publint, Are the Types Wrong, ESLint, TypeScript, Storybook test-runner, Prettier  
**Target Platform**: npm-compatible ESM packages consumed by Next.js 15 App Router on Node.js  
**Project Type**: pnpm workspace with two independently published library packages  
**Performance Goals**: Packed consumer validation completes in one local command; package entry import adds no bundled React implementation  
**Constraints**: Preserve user-owned Changesets-generated worktree changes; no npm publication; no downstream webpack workaround; avoid registry access during smoke execution where practical  
**Scale/Scope**: Two package build/distribution contracts, one README, one root smoke-test command, one Changeset, and feature artifacts

## Constitution Check

*GATE: Must pass before implementation and again after design.*

- `packages/styles` remains the authoritative owner of CSS, font, image, and component-class assets.
- React remains a thin adapter and consumes styling automatically through its public entrypoint.
- CSS and all local URL targets remain usable without Sass in a downstream application.
- Publishable artifacts are tested after packing, not inferred from workspace builds.
- React and React DOM remain consumer-owned peer runtimes; no wrapper-only runtime fork is introduced.
- Both changed public contracts receive patch release intent through Changesets.
- Applicable lint, type, format, Storybook, and package gates remain enforced.
- No component visual, semantic, accessibility, responsive, or Storybook state contract changes.
- Complexity violations: none.

**Gate Status**: PASS

## Scope Lock (R/M/U/O)

- **R**: `styles` pnpm repository; environment only.
- **M**: Publishable package consumption and release-preparation capability; hard outer boundary.
- **U**: React runtime/styling entry contract, styles asset layout contract, packed Next consumer validation, and patch Changeset.
- **O**: External module list, public CSS import, asset copy destinations, tarball assertions, fixture generation, README wording, and validation commands.

Planning locks **M + U**. Component APIs, component markup, visual tokens, Storybook states, npm publication, and downstream application source changes are out of scope.

## Project Structure

### Documentation (this feature)

```text
specs/034-next-consumer-compat/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/requirements.md
└── contracts/
    ├── package-contract.md
    └── sequences.md
```

### Source Code (repository root)

```text
packages/react/
├── package.json
├── vite.config.ts
├── README.md
└── src/index.ts

packages/styles/
├── package.json
└── scripts/
    ├── copy-icons.mjs
    └── copy-fonts.mjs

scripts/
└── test-next-consumer.mjs

.changeset/
└── <generated-name>.md
```

**Structure Decision**: Keep package fixes within their owning workspaces. Put the cross-package packed-consumer smoke at the repository root because it validates both tarballs as one downstream installation. Generate its application fixture under a temporary directory so no consumer implementation is maintained as production source.

## Phase 0 Research

Research decisions are recorded in [research.md](./research.md):

- Preserve automatic CSS by leaving the styles package root import as an external side-effect import in the React entry bundle.
- Externalize React, React DOM, and both JSX runtime entrypoints explicitly.
- Preserve the compiled CSS URL contract and publish referenced USWDS images/fonts at package-root `img/` and `fonts/` paths.
- Test packed tarballs in a generated Next.js 15/React 18 application, using repository-installed validation dependencies and an offline install after the dependency graph is present.
- Add a fresh patch Changeset rather than editing generated 0.0.1 changelogs or restoring consumed Changeset files.

## Phase 1 Design & Contracts

- [data-model.md](./data-model.md) defines the publishable package, stylesheet asset, and temporary consumer fixture validation entities.
- [contracts/package-contract.md](./contracts/package-contract.md) defines the observable React, CSS, manifest, and tarball contracts.
- [contracts/sequences.md](./contracts/sequences.md) defines build, pack, install, render, and release-preparation order.
- [quickstart.md](./quickstart.md) defines the runnable validation path.

## Post-Design Constitution Check

- The owning styles contract remains in `packages/styles`; React only imports and exposes it.
- All package assertions inspect consumer-visible tarballs and installed output.
- The automatic styling contract is restored rather than weakened to a manual downstream import.
- No new visual behavior, wrapper styling, component API, accessibility exception, or lint bypass is introduced.
- Patch release intent covers both changed package contracts, and publication remains explicitly excluded.
- The M + U scope lock remains intact.

**Gate Status**: PASS

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| none | N/A | N/A |
