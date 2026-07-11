# Research: Structured Wizard and Guided Workflow Compositions

## Decisions

### Decision 1: Composition Naming Convention

- **Decision**: Use `pathable-wizard`, `pathable-workflow-panel`, `pathable-save-status`, and `pathable-wizard-actions` as the component names, with `pathable-structured-workflow` as the bundle that forwards all of them.
- **Rationale**: Follows the existing pattern set by `pathable-dashboard` (which forwards `pathable-dashboard-header`, `pathable-kpi-grid`, etc.) and `pathable-layout-composition` (which forwards `pathable-container`, `pathable-stack`, etc.). The `pathable-` prefix matches all existing component wrappers. Class naming follows BEM: `.pathable-wizard`, `.pathable-wizard__footer`, `.pathable-wizard__step`, `.pathable-workflow-panel`, `.pathable-workflow-panel__header`, `.pathable-workflow-panel__input`, etc.
- **Alternatives considered**: Using a `pathable-compositions` namespace. Rejected because it would conflate unrelated patterns. The wizard and workflow panel serve distinct use cases, and keeping them independently importable aligns with the selective-import requirement (FR-027).

### Decision 2: USWDS Component Reuse

- **Decision**: The wizard composition wraps `usa-step-indicator` (existing `pathable-step-indicator` wrapper) for the step context and uses `pathable-button` variants for actions. The workflow panel is a pure CSS composition with no USWDS equivalent — it uses `pathable-surface`, `pathable-stack`, `pathable-cluster`, and `pathable-sticky-panel` as structural primitives.
- **Rationale**: The step indicator already exists in the project with completed/current/upcoming states. Reusing it maintains consistency with the rest of the design system. The workflow panel has no USWDS analog, so it is built from layout primitives — consistent with how `pathable-dashboard` composes `pathable-dashboard-header`, `pathable-kpi-grid`, and `pathable-activity-list`.
- **Alternatives considered**: Creating a custom step indicator from scratch. Rejected because `pathable-step-indicator` already provides the correct semantic structure and multi-state support required by FR-001 and FR-002.

### Decision 3: SCSS Architecture and Bundle Strategy

- **Decision**: Each composition component gets its own SCSS partial: `pathable-wizard.scss`, `pathable-wizard-actions.scss`, `pathable-workflow-panel.scss`, `pathable-save-status.scss`. A bundle file `pathable-structured-workflow.scss` forwards all four. The bundle is added to `pathable-all.scss` so all-in-one consumers get it automatically. Selective consumers import individual partials directly.
- **Rationale**: This mirrors the exact structure of `pathable-layout-composition.scss` (forwards 7 individual primitives) and `pathable-dashboard.scss` (forwards 5 dashboard components). It ensures FR-027 (selective imports compile) and FR-028 (all-in-one imports compile) are both satisfied.
- **Alternatives considered**: Putting everything in a single `pathable-wizard-workflow.scss`. Rejected because the wizard and workflow panel are independently useful and should be selectively importable per FR-027.

### Decision 4: State Management for Workflow Panel

- **Decision**: The workflow panel defines CSS classes for six visual states: `pathable-workflow-panel--loading`, `pathable-workflow-panel--saving`, `pathable-workflow-panel--saved`, `pathable-workflow-panel--offline`, `pathable-workflow-panel--validation-error`, and `pathable-workflow-panel--completed`. The consuming application applies these modifier classes.
- **Rationale**: Matches the existing pattern in the codebase (e.g., `pathable-kpi-card--loading`, `pathable-kpi-card--unavailable`, `pathable-table--empty`). The composition provides the visual contract only — state management is explicitly out of scope per the issue's non-goals section.
- **Alternatives considered**: Using `data-*` attributes instead of modifier classes. Rejected for consistency with the rest of the codebase which uses BEM modifier classes throughout.

### Decision 5: Mobile Step Indicator Behavior

- **Decision**: The wizard composition renders a full `pathable-step-indicator` on viewports >= 768px, and a compact summary (showing only the current step label with a "Step N of M" indicator) on smaller viewports. This is achieved via a media query in `pathable-wizard.scss`.
- **Rationale**: FR-007 requires a compact mobile presentation when the full horizontal stepper would overflow. The 768px breakpoint matches the existing USWDS `tablet` breakpoint (`$theme-tablet-grid-breakpoint`). The USWDS step-indicator already has a `usa-step-indicator--counters-sm` variant for compact display, which `.pathable-step-indicator` extends.
- **Alternatives considered**: Hiding the step indicator entirely on mobile (rejected — loses step context). Using a select/dropdown for mobile steps (heavy; the compact summary is simpler and accessible).

### Decision 6: Save Status Indicator

- **Decision**: `pathable-save-status` is broken out as a separate partial from `pathable-workflow-panel` because save-status indicators (loading -> saving -> saved) are potentially reusable outside the workflow panel context (e.g., in form wizards, settings pages).
- **Rationale**: Separation of concerns. The wizard's action footer may also display save-status messaging. A standalone component ensures it can be imported independently by consumers who only need the save-status pattern without the full workflow panel layout.
- **Alternatives considered**: Inlining save-status inside `pathable-workflow-panel.scss` (rejected — reduces reusability and violates the "independently testable" principle from the spec).