# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]

**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]

**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]

**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]

**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]

**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- Identify which source and artifact types change: `packages/styles`, a wrapper
  package such as `packages/react`, Storybook apps, documentation, or CI.
- If a wrapper package changes, identify the owning `packages/styles` contract
  first. Wrapper-only styles, tokens, assets, or visual semantics are not
  permitted.
- If `packages/react` adds or renames a component, confirm its exported
  component name is the CamelCase form of the equivalent `packages/styles`
  component name with any `pathable` prefix removed.
- Confirm wrapper components preserve the shared package's semantic HTML,
  accessibility behavior, class contracts, design tokens, and intended visual
  behavior.

### Consumer and Publishable Validation

- Verify consumers can install and import wrapper packages without adding a
  separate application import of `@pathable/styles`; required CSS, fonts,
  icons, JavaScript helpers, and assets must flow through the wrapper package.
- Confirm public component APIs and generated declarations are type-safe and
  suitable for consumers.
- For publishable changes, confirm the plan includes package-content validation
  (exports, included files, entry points, peer dependencies, declarations).
  A successful monorepo build alone is not proof that a package is publishable.
- Confirm any breaking changes to public APIs, markup contracts, CSS contracts,
  or package exports follow the release and change-management policy.

### Validation Gates

- Confirm the plan identifies applicable linting, formatting, type-checking,
  build, test, accessibility, and package-validation gates for the changed
  artifact types.
- Confirm the plan does not disable, weaken, skip, or remove lint checks.
  Agents must fix lint findings or report blockers; only explicit human
  approval may authorize a narrow lint-rule bypass.
- Confirm files are not silently excluded from their applicable validator
  merely to make CI pass.
- Confirm the plan does not propose warning-only configurations that create the
  appearance of enforcement for actionable violations.

### Story and Interaction Requirements

*Applicable only when the feature affects rendered component UI.*

- Confirm every meaningful supported component state has a deterministic, named
  story. A Playground story alone is not sufficient.
- For interactive components, confirm the plan includes browser-executed
  interaction coverage for critical observable behavior, including keyboard
  activation and focus management.
- Confirm Storybook tests use accessible queries (`getByRole`, `getByLabelText`)
  and observable outcomes rather than implementation details.
- Confirm stories are deterministic — no dates, random values, or live network
  calls.
- Confirm story documentation explains semantic intent, usage guidance, misuse
  warnings, and accessibility obligations.

### Accessibility

*Applicable when the feature affects rendered UI, markup, or component behavior.*

- Confirm the feature does not introduce or worsen accessibility violations.
  Required accessibility checks must block merge.
- Confirm static JSX accessibility linting and rendered accessibility testing
  are both represented; they are complementary, not interchangeable.
- For interactive components, confirm behavioral tests cover keyboard
  interaction, focus placement, focus visibility, and accessible names where
  automation cannot determine correctness.
- Confirm accessibility exceptions are narrow, story-level, and justified
  rather than broad rule disablement.
- Confirm examples and test data use synthetic, non-sensitive content.

### Responsive and Resilient States

*Applicable when the feature affects rendered component UI.*

- Confirm the plan evaluates applicable components for narrow/mobile layouts,
  long and localized-looking content, constrained containers, and increased
  text size.
- Confirm keyboard focus visibility is preserved in all supported states.
- Confirm high-contrast or forced-colors behavior is considered when supported.
- Confirm reduced motion is honored for animated behavior.
- Confirm loading, empty, error, disabled, and read-only states are covered
  when those states are part of the component contract.
- A combinatorial story for every prop, viewport, and theme is not required.
  Explicit coverage of meaningful supported contracts and historically risky
  combinations should be provided.

### Visual Regression

*Applicable when the feature affects rendered component UI or design tokens.*

- Confirm stable stories serve as deterministic visual-regression fixtures for
  meaningful component states.
- Confirm visual checks protect design tokens, typography, spacing, responsive
  behavior, focus indicators, overflow, wrapping, icon alignment, and state
  presentation where applicable.
- Confirm the plan does not rely on serialized DOM snapshots as a complete
  substitute for browser-rendered visual validation.

### Documentation Surface Ownership

- Identify which documentation surfaces are affected: Astro docs site,
  Storybook, package READMEs, contributor/agent instructions, or specs.
- Confirm the canonical source is identified for any fact that must appear on
  multiple surfaces.

### Cross-Framework Impact

*Applicable when the feature changes `packages/styles` or shared contracts.*

- Confirm the plan verifies all affected framework Storybooks build and test
  in their own framework context.
- Confirm composition into the primary catalog does not hide independent
  framework Storybook failures.

### Complexity Tracking

- Confirm any constitution violations are documented in Complexity Tracking
  with rationale and a migration path.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |