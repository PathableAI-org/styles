# Implementation Plan: React Link and Tag Wrappers

**Branch**: `032-react-link-tag-wrappers` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/032-react-link-tag-wrappers/spec.md`

## Summary

Add `Link` and `Tag` to `packages/react` as thin semantic wrappers around the
existing `packages/styles` `pathable-link` and `pathable-tag` contracts. Link
will preserve native anchor content, destinations, and attributes while mapping
default/external presentation. Tag will preserve inline content and attributes
while mapping default/big size. Both will export through `@pathable/react` and
rely on its public entrypoint for transitive Pathable styling.

## Technical Context

**Language/Version**: JavaScript modules with React JSX, following current
`packages/react` source conventions and the repository Node engine policy.

**Primary Dependencies**: React, `prop-types`, Vite, and `@pathable/styles` as
the owning design-system contract.

**Storage**: N/A; presentational library components with no persistence.

**Testing**: React package build, React Storybook build, package-content dry
run, and manual semantic/accessibility scenarios from [quickstart.md](./quickstart.md).

**Target Platform**: Browser UI consumers importing `@pathable/react`.

**Project Type**: pnpm workspace library package with React Storybook examples.

**Performance Goals**: A developer can render both documented components in
under 5 minutes; the wrappers add no data fetching or state-management cost.

**Constraints**: Preserve native anchor behavior; keep Tag non-interactive by
default; keep `packages/styles` authoritative and `packages/react` thin; add no
wrapper CSS, tokens, navigation policy, interaction orchestration, or lint bypasses.

**Scale/Scope**: Two React components, two public exports, two Storybook story
families, README documentation, and package validation evidence.

## Constitution Check

*GATE: Must pass before Phase 0 research and again after Phase 1 design.*

- Owning source contracts exist at
  `packages/styles/src/pathable-component-wrappers/pathable-link.scss` and
  `packages/styles/src/pathable-component-wrappers/pathable-tag.scss`.
- `Link` and `Tag` follow React naming parity by removing `pathable` from the
  source contract names and using CamelCase.
- Link maps only to the implemented base and external classes; Tag maps only to
  the implemented base and big classes. The unimplemented
  `pathable-link--nav` Storybook reference is not exposed.
- Consumers continue importing only from `@pathable/react`; its public
  entrypoint already imports `@pathable/styles/dist/styles.css` and the package
  declares `@pathable/styles` as a runtime dependency.
- Link preserves consumer-owned destination and navigation attributes. Tag
  remains a presentational inline label with no wrapper-owned interaction.
- No lint rule is disabled, weakened, skipped, or silenced.
- Complexity violations: none.

**Gate Status**: PASS.

## Scope Lock (R/M/U/O)

- **R**: `styles` pnpm workspace; environment context only.
- **M**: `packages/react` component-wrapper capability; hard outer boundary.
- **U**: React `Link` wrapper aligned to `pathable-link`, and React `Tag`
  wrapper aligned to `pathable-tag`; primary planning objects.
- **O**: Bounded class mapping, native attribute forwarding, public exports,
  stories, README examples, and validation commands.

Planning locks **M + U**. Changes to `packages/styles`, unrelated React
components, navigation policy, or interactive tag behavior require a separately
justified source-contract gap or feature.

## Project Structure

### Documentation (this feature)

```text
specs/032-react-link-tag-wrappers/
├── plan.md
├── research.md
├── data-model.md
├── class-diagram.md
├── quickstart.md
├── checklists/
│   ├── requirements.md
│   └── behavior-testability.md
└── contracts/
    ├── props.md
    └── sequences.md
```

### Source Code (repository root)

```text
packages/styles/src/
├── pathable-component-wrappers/pathable-link.scss
├── pathable-component-wrappers/pathable-tag.scss
└── stories/components/Basic/
    ├── Link.stories.ts
    └── Tag.stories.ts

packages/react/
├── README.md
└── src/
    ├── index.js
    ├── components/Link/Link.jsx
    ├── components/Tag/Tag.jsx
    └── stories/components/Basic/
        ├── Link.stories.jsx
        └── Tag.stories.jsx

apps/storybook-react/package.json
```

**Structure Decision**: Add only the two React wrappers, exports, stories, and
documentation. Keep the owning styles contracts unchanged unless implementation
uncovers a genuine defect that cannot be solved by a thin wrapper.

## Phase 0 Research

Research is complete in [research.md](./research.md). Decisions:

- Use `pathable-link` and `pathable-tag` as the sole visual contracts.
- Render Link as a native anchor and Tag as a non-interactive span.
- Expose bounded `default`/`external` Link presentation and `default`/`big` Tag size.
- Preserve content, consumer classes, native attributes, and deterministic fallbacks.
- Keep destination security and new-context policy consumer-controlled.
- Validate package, Storybook, publish contents, and semantic scenarios.

## Phase 1 Design & Contracts

Generated design artifacts:

- [data-model.md](./data-model.md)
- [class-diagram.md](./class-diagram.md)
- [contracts/props.md](./contracts/props.md)
- [contracts/sequences.md](./contracts/sequences.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- `packages/styles` remains authoritative and unchanged by planned scope.
- Link and Tag map only to implemented source classes.
- Consumer content, destinations, attributes, handlers, and class names are preserved.
- Transitive styles remain anchored in `packages/react/src/index.js`.
- No wrapper CSS, new modifier, navigation policy, interaction state, token, or
  lint bypass is planned.
- The M + U scope lock remains intact.

**Gate Status**: PASS.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| none | N/A | N/A |
