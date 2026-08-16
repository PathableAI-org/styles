# Feature Specification: React Dashboard Overview Composition Page

**Feature Branch**: `040-react-dashboard-overview`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "Add the Dashboard > Dashboard Overview page to the react storybook to match the one for the packages/styles."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dashboard Overview pattern composes real dashboard primitives (Priority: P1)

As a PathAble product designer, I open the React Storybook and navigate to the
`Dashboard` section where I find a `Dashboard Overview` entry at
`Dashboard/Dashboard Overview`. This entry renders a single cohesive "program
overview" page exactly like the one shown in the `packages/styles` Storybook:
a `DashboardHeader` with breadcrumb, title, context, and action buttons atop a
KPI summary and a grouped activity list. I can inspect the composition, confirm
the design tokens and spacing match the styles catalog, and use it as the
reference for how these primitives are composed on a real overview page.

**Why this priority**: Seeing the composed overview page is the primary value.
It proves that the React primitives (`DashboardHeader`, activity list, and the
documented KPI region) compose cleanly and resolve to the same visual design as
the styles package. This is the baseline pattern the other states build upon.

**Independent Test**: Open the React Storybook at `Dashboard/Dashboard Overview`
and verify it renders the header, KPI region, and activity list with the same
content and layout as the styles `Dashboard Overview` story.

**Acceptance Scenarios**:

1. **Given** the React Storybook is running, **When** I open
   `Dashboard/Dashboard Overview`, **Then** I see a composed overview page with
   a dashboard header, KPI region, and activity list.
2. **Given** the overview page, **When** I compare it to the styles
   `Dashboard Overview` story, **Then** the sections, headings, labels, and
   layout match visually.
3. **Given** the overview header, **When** I trigger the action controls,
   **Then** the buttons are keyboard-focusable and activatable.

---

### User Story 2 - Loading state of the overview page (Priority: P2)

As a PathAble product designer, I want to preview the overview page while its
data and KPIs are loading, so I can verify the loading treatment matches the
styles catalog and communicates that content is being fetched.

**Why this priority**: The loading state is a supported, documented
presentation used across the product; mirroring it in the React Storybook
guards against drift between the two catalogs. It is secondary to the
populated overview.

**Independent test**: Open the `Dashboard Overview` loading story and verify the
header title renders with a "loading" description and the KPI region shows
placeholder skeletons.

**Acceptance Scenarios**:

1. **Given** the loading dashboard overview story, **When** it renders,
   **Then** the header shows the page title with loading copy.
2. **Given** the loading dashboard overview story, **When** it renders,
   **Then** the KPI region shows placeholder loading cards without text values.

---

### User Story 3 - Empty state of the overview page (Priority: P3)

As a PathAble product designer, I want to preview the empty overview page (no
program data yet) so I can verify the empty header, unavailable KPI values, and
empty activity table match the styles catalog.

**Why this priority**: The empty state is an important resilience case, but less
central than the populated overview and loading state for most review
workflows.

**Independent Test**: Open the `Dashboard Overview` empty story and verify it
renders an unavailable KPI region, an empty activity table with an empty
message, and a header with a "no data" description and an action.

**Acceptance Scenarios**:

1. **Given** the empty dashboard overview story, **When** it renders, **Then**
   the header shows the title, a "no data" description, and an action button.
2. **Given** the empty dashboard overview story, **When** it renders, **Then**
   the KPI region shows unavailable values and the activity table shows an
   empty message.

---

### Edge Cases

- When the composition renders at a narrow mobile viewport, the header actions
  and KPI grid wrap or stack per the styles breakpoint contract instead of
  overflowing horizontally.
- When long or localized title/description strings are present in the header,
  the header and KPI region wrap correctly without clipping.
- When the KPI region is present, the created story must not introduce a new
  production API in any way (no new component or prop — see Assumptions).
- When a consumer action is the final element in the header row, it remains
  keyboard-focusable and visible.

## Out of Scope

- Creating a new React `KpiGrid` / `KpiCard` wrapper component. The KPI region is
  rendered via its documented `pathable-kpi-*` styles-contract classes within
  the composition story. A dedicated `KpiGrid` React wrapper is tracked by the
  separate in-flight feature and is out of scope for this story.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The React `storybook` MUST provide a `Dashboard` top-level section
  containing a `Dashboard Overview` entry, matching the styles Storybook's
  section and title.
- **FR-002**: The `Dashboard Overview` story MUST be a pattern/composition entry
  that composes existing React dashboard primitives (dashboard header and
  activity list) into a cohesive overview page, rendering the KPI region with
  the documented `pathable-kpi-*` styles-contract classes. It MUST NOT create a
  new production wrapper component or new prop API.
- **FR-003**: The composition MUST reproduce the three deterministic states the
  styles catalog exposes: `Populated`, `Loading`, and `Empty`, each as a fixed
  named story with deterministic content (no current dates, random values, or
  live network calls).
- **FR-004**: The composed page MUST preserve the shared package's semantic HTML
  and accessibility behavior: the header title is a `heading` level `h1`, the
  activity list rows are keyboard-operable `listitem`s, and action controls
  carry native button/link semantics.
- **FR-005**: The composition MUST demonstrate realistic integration using the
  components that are exported from the React package's public entrypoint (the
  same set consumers install and import).
- **FR-006**: The overview page MUST reference the required
  `@pathable/styles` compiled CSS, fonts, and assets automatically through the
  React package entrypoint, without a separate consumer-side import.

### Story and Interaction Requirements

- **FR-007**: Every supported state (`Populated`, `Loading`, `Empty`) MUST have a
  deterministic, named React story, and a `Playground` (Controls) story MAY
  support reconciliation exploration without replacing the fixed stories.
- **FR-008**: For interactive composition, the story MUST include a browser
  interaction test that verifies an action button or activity-list action is
  keyboard-reachable and activatable (focus and Enter/Space activation).
- **FR-009**: Interaction tests MUST prefer accessible queries (`getByRole`,
  `getByLabelText`, `getByText`) and observable outcomes over implementation
  details such as `data-testid` attributes or CSS selectors.
- **FR-010**: Story descriptions MUST explain semantic intent (what the
  composed overview page is for, when to use it) and note that it composes
  existing primitives rather than defining a new API, honoring the pattern
  story purpose.

### Accessibility Requirements

- **FR-011**: The composed page MUST contain exactly one primary `h1` heading
  (the header title) and use appropriate region/structure so assistive
  technology can traverse the header, KPI region, and activity list.
- **FR-012**: Header action controls and activity list actions MUST be native
  buttons/links that receive visible keyboard focus and open with a clear
  focus indicator (inherited from the styles contract).
- **FR-013**: KPI trend values and activity status MUST communicate their
  meaning to assistive technology (e.g., trend direction is not conveyed by
  color or glyph alone).
- **FR-014**: Static JSX accessibility linting and rendered accessibility
  testing MUST both pass; no broad rule disablement is permitted. Any narrow
  story-level exception requires documented justification.

### Responsive and Resilient State Requirements

- **FR-015**: A narrow/mobile viewport story MUST render the composed page with
  the header, KPI grid, and activity list wrapping/stacking per the styles
  contract (the header stacks at ≤640px) without horizontal overflow.
- **FR-016**: Long content (long title, long description) MUST wrap and the page
  MUST remain readable and not clip.
- **FR-017**: The `Loading` and `Empty` states MUST be covered as supported
  resilient state presentations on the overview page.

### Visual Regression Requirements

- **FR-018**: The fixed named stories (`Populated`, `Loading`, `Empty`, and the
  mobile view) MUST serve as deterministic visual-regression fixtures for the
  composed page, protecting typography, spacing, wrapping, responsive behavior,
  focus indicators, and state presentation.

### Lint and Validation

- **FR-019**: The change MUST pass the package's lint (eslint with
  `--max-warnings=0`), type-check, React Storybook build, and Storybook
  test-runner gates. No lint rule MUST be disabled, weakened, skipped, or
  silenced; files must not be silently excluded to pass CI.

### Key Entities *(include if feature involves data)*

- **Dashboard Overview page**: A composition pattern (not a new data entity)
  that groups a Dashboard header, a KPI region, and an Activity list. It has no
  persistent state; it is a presentational arrangement of existing primitives.
- **Dashboard header**: page title, breadcrumb, context, description, actions.
- **KPI region**: a set of metric cards (value, label, optional trend). Rendered
  via the documented `pathable-kpi-*` classes for this story.
- **Activity list**: ordered activity records with status, context, date, owner,
  and optional actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can open the React Storybook and reach the
  `Dashboard/Dashboard Overview` entry in the `Dashboard` section.
- **SC-002**: The overview page renders the header, KPI region, and activity
  list with the same visual layout, typography, and spacing as the styles
  `Dashboard Overview` story.
- **SC-003**: The three supported states (`Populated`, `Loading`, `Empty`) are
  each covered by a deterministic named story, plus a mobile/narrow view.
- **SC-004**: The interaction tests pass for keyboard focus and activation of the
  page's actions, with zero storybook accessibility rule violations.
- **SC-005**: The React Storybook builds and its test-runner passes with no
  lint or type‑check errors.

## Assumptions

- The `Dashboard Overview` entry is a **pattern/composition** story, not a new
  component; it composes existing React primitives and documented
  `pathable-kpi-*` classes rather than introducing a production API, per
  constitution Principle XIV.
- A dedicated React `KpiGrid`/`KpiCard` wrapper is out of scope for this Story
  and is delivered by the follow-up feature. Until then, the composition places
  the KPI region via the styles-contract classes it documented.
- The composition mirrors the three states present in the styles
  `Dashboard Overview` catalogs (`Populated`, `Loading`, `Empty`) with
  deterministic fixture content.
- The React Storybook is independently buildable and testable via the package's
  existing scripts; no new tooling or dependency additions are assumed.
- Interaction-test conventions follow the Storybook standard documented in
  `packages/react/STORYBOOK_STANDARD.md`.