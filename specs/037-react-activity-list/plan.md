# Implementation Plan: React Activity List Wrapper

**Branch**: `038-react-activity-list` | **Date**: 2026-08-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/037-react-activity-list/spec.md`

## Summary

Repair the authoritative Dashboard Activity List source contract so status text
is visible and accessible and status/date/owner metadata truncates safely, then
add a typed, server-compatible `ActivityList` to `@pathableai/react`. The React
adapter accepts mutually exclusive flat or grouped records, preserves supplied
order and content, maps only documented density classes, labels grouped lists
through adjacent headings, filters empty groups, and exposes deterministic
Storybook, server, package, and packed-consumer evidence without private CSS or
owned business behavior.

## Technical Context

**Language/Version**: TypeScript 5.7 with React 18/19; SCSS compiled by the
existing `@pathableai/styles` workspace; Node.js 24 or 26 per repository policy.

**Primary Dependencies**: React and React DOM peer dependencies,
`@pathableai/styles` as the runtime design-system dependency, Vite for the React
package build, Storybook 10 for executable catalogs, and Next.js 15 for the
packed consumer fixture.

**Storage**: N/A; the component is a stateless presentation adapter with no
persistence or service data.

**Testing**: Styles/React lint, typecheck, builds, independent Storybook browser
and accessibility checks, source quality and visual gates, advisory React
server-compatibility audit, package-content and declaration checks, packed Next
consumer rendering, existing shared behavior-contract regression, and manual
responsive/focus review from [quickstart.md](./quickstart.md).

**Target Platform**: Browser and React Server Component consumers installing
the ESM npm package; modern browsers supported by the current design-system and
Storybook toolchains.

**Project Type**: Multi-package pnpm design-system library with an authoritative
framework-neutral Styles package and a downstream React adapter.

**Performance Goals**: Preserve O(n) static rendering in supplied item order,
add no network or state-management cost, and let a developer create a documented
populated list in under ten minutes.

**Constraints**: Source-first visual changes only; no new tokens, status
meanings, visual variants, wrapper CSS, client directive, data fetching,
sorting, filtering, pagination, transitions, persistence, lint bypasses, or
publication. Complete truncated values remain in rendered output.

**Scale/Scope**: One shared Activity List CSS/markup contract, four existing
source story surfaces, one React component and public type family, one React
story family, package guidance, packed-consumer coverage, and patch release
metadata for the two affected packages.

## Constitution Check

*GATE: Must pass before Phase 0 research and again after Phase 1 design.*

### Source and Package Scope

- The owning source contract is
  `packages/styles/src/pathable-component-wrappers/pathable-activity-list.scss`.
  Its visible-status and metadata-containment repair precedes React work.
- `ActivityList` is the required CamelCase mapping of
  `pathable-activity-list` after removing the `pathable` prefix.
- React preserves the corrected source classes, marker semantics, status
  meanings, density, action visibility, forced colors, reduced motion,
  breakpoint behavior, truncation, and empty treatment. No wrapper CSS exists.
- Shared source stories and every repository-owned Activity List composition
  migrate to the corrected markup before React mirrors it.

### Consumer and Publishable Validation

- The React root entrypoint retains its `@pathableai/styles` side-effect import;
  consumers do not add a separate styles import.
- Public runtime exports and generated declarations include `ActivityList` and
  every consumer-facing item, group, status, density, attribute, and prop type.
- `publint`, `attw`, package build checks, Changesets status, and a packed Next
  App Router fixture prove the consumer surface beyond workspace compilation.
- The source correction is additive, but both affected packages receive patch
  Changesets. Versioning or publication is not authorized.

### Validation, Stories, Accessibility, and Resilience

- No lint, accessibility, Storybook, visual, server, package, or contract gate
  is disabled, weakened, excluded, or converted to warning-only behavior.
- Deterministic source and React stories cover grouped default, known and
  unknown statuses, compact, comfortable, narrow/mobile, long content, no
  actions, and empty content; Playground is not the sole evidence.
- Browser assertions prefer roles and visible labels, validate adjacent
  `aria-labelledby` relationships, and exercise native consumer action focus
  and activation without transferring business behavior to the wrapper.
- Static JSX lint and rendered accessibility checks remain complementary.
  Status meaning uses visible text; decorative markers are hidden from
  assistive technology; forced-colors shapes remain intact.
- Responsive evidence covers 375, 768, and 1280 pixels, increased text,
  metadata ellipsis, mobile date ordering, horizontal containment, action
  availability, and visible unclipped focus. Reduced-motion rules remain
  unchanged.
- Both Styles and React Storybooks build and test independently because the
  shared source contract changes.

### Documentation and Visual Regression

- The canonical visual/markup facts remain in Styles SCSS and source stories.
  React Storybook documents the adapter contract; the React README documents
  package consumption; this feature directory owns planning decisions.
- Stable browser-rendered stories and existing visual/quality gates protect
  spacing, marker geometry, responsive behavior, overflow, focus, and empty
  states. Serialized DOM alone is not treated as visual proof.
- The upstream Visual Fidelity Evidence Matrix remains authoritative; Phase 1
  contracts and validation carry forward `VIS-001` through `VIS-005` without
  inventing screenshot requirements.

### Complexity and Gate Result

- No constitution violation or unjustified complexity is planned.
- Pre-design gate: **PASS**. The behavior checklist reports `Gate Status: PASS`
  and `Blocking Items: none`.

## Scope Lock (R/M/U/O)

- **R**: `styles` pnpm workspace; environment context only.
- **M**: Dashboard Activity List design-system capability across the
  authoritative Styles contract and React adapter; hard outer boundary.
- **U**: corrected shared Activity List status/metadata contract; public React
  `ActivityList` adapter and types; deterministic source/React documentation
  and consumer-validation contract.
- **O**: selector edits, markup projection, prop/class mapping, exports, story
  fixtures, assertions, package fixture updates, and validation commands.

Planning locks **M + U**. Unrelated dashboard components, workflow-preset
schemas, new variants or tokens, business data behavior, and release publishing
remain outside scope.

## Project Structure

### Documentation (this feature)

```text
specs/037-react-activity-list/
├── plan.md
├── research.md
├── data-model.md
├── class-diagram.md
├── quickstart.md
├── behavior/
│   ├── bdd.draft.feature
│   ├── behavior-scenarios.draft.json
│   ├── data-fixtures.intent.json
│   └── uif.intent.json
├── checklists/
│   ├── requirements.md
│   └── behavior-testability.md
└── contracts/
    ├── props.md
    ├── sequences.md
    ├── bdd/
    ├── behavior/
    └── uif/
```

### Source Code (repository root)

```text
packages/styles/src/
├── pathable-component-wrappers/pathable-activity-list.scss
└── stories/
    ├── dashboard/ActivityList.stories.ts
    ├── dashboard/DashboardOverview.stories.ts
    ├── recipes/OperationalDashboard.stories.ts
    └── marketing-patterns/OperationalDashboard.stories.ts

packages/react/
├── README.md
└── src/
    ├── index.ts
    ├── components/ActivityList/ActivityList.tsx
    └── stories/dashboard/ActivityList.stories.tsx

scripts/test-next-consumer.mjs
.changeset/
```

**Structure Decision**: Repair the shared CSS/HTML contract in place, then add
one React component and its public/export/documentation surfaces. Extend the
existing packed-consumer and release workflows rather than creating a new test
harness, package, or application.

## Phase 0 Research

[research.md](./research.md) resolves source markup, metadata containment,
structured props, semantics, server compatibility, fixture strategy, schema
taxonomy adaptation, visual evidence, package validation, and release metadata.
All technical unknowns are resolved.

## Phase 1 Design & Contracts

- [data-model.md](./data-model.md) defines activity, group, status, density,
  empty-state, and behavior-contract entities.
- [class-diagram.md](./class-diagram.md) captures the component/type projection
  and source-contract dependency.
- [contracts/props.md](./contracts/props.md) defines the public TypeScript,
  semantic DOM, class, fallback, and attribute contract.
- [contracts/bdd/](./contracts/bdd/) formalizes rendering, grouping, and
  packaged-consumer outcomes.
- [contracts/uif/](./contracts/uif/) formalizes observable catalog, action,
  responsive, empty, server, and package paths.
- [contracts/behavior/](./contracts/behavior/) maps scenarios to synthetic
  fixtures and assertions, with explicit workflow-schema taxonomy blockers.
- [contracts/sequences.md](./contracts/sequences.md) is intentionally minimal
  because no service, async, retry, rollback, or compensation boundary exists.
- [quickstart.md](./quickstart.md) defines executable validation and expected
  evidence.

## Post-Design Constitution Check

- All planned visual changes live first in the authoritative Styles contract;
  React consumes them without private CSS.
- The typed API preserves consumer content and attributes while owning only
  required classes, roles, and group labels.
- The component remains server-default and all meaningful initial content is
  present without browser scripting.
- Source and React Storybooks, accessibility, responsiveness, visual evidence,
  package contents, declarations, and a packed consumer are independently
  represented.
- Formal scenario taxonomy blockers document a workflow-schema limitation; no
  product failure or implementation requirement is invented, and task
  generation can implement every accepted observable outcome.
- M + U scope remains locked and no lint or quality exception is planned.

**Gate Status**: **PASS**.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| none | N/A | N/A |

## Design Artifacts

- Internal object design: [class-diagram.md](./class-diagram.md)
- Service sequences: [contracts/sequences.md](./contracts/sequences.md)
- Behavior draft: [behavior/bdd.draft.feature](./behavior/bdd.draft.feature)
- BDD contracts: [contracts/bdd/](./contracts/bdd/)
- Expected UIF contracts: [contracts/uif/](./contracts/uif/)
- Behavior contracts: [contracts/behavior/](./contracts/behavior/)
- Data model: [data-model.md](./data-model.md)
- Interface contracts: [contracts/](./contracts/)
- Validation path: [quickstart.md](./quickstart.md)

## Visual Fidelity Navigation

- Visual validation decisions and `VIS-001` through `VIS-005` carry-forward:
  [research.md](./research.md)
- Visual interaction/state contracts:
  [contracts/uif/](./contracts/uif/) and
  [contracts/behavior/](./contracts/behavior/)
- Visual flow sequences: intentionally not applicable; rationale in
  [contracts/sequences.md](./contracts/sequences.md)
- Visual proof execution: [quickstart.md](./quickstart.md)
