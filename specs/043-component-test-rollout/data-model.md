# Data Model: Component Test Rollout (Phase 3)

Phase 1 defined a data model for the Accordion capability manifest, the `styles`
target, the target-aware runner, the accessibility-exception registry, and the
evidence report (see `041-component-test-infra/data-model.md`). Phase 3 keeps
that model and adds one thing: a cross-component **rollout ledger** that indexes
every component's Styles proof and downstream-adoption status, plus a small
**shared-capability taxonomy** (disclosure, overlay, composite-widget, focus)
that generalizes the single-capability helpers the stateful wave produces.

This model is renderer-neutral: it names observable capabilities, fixtures, and
proof status, never a framework's props, state model, or public API.

## Rollout Ledger

```text
RolloutLedger
├── component: string            # stable story id base, e.g. "components-form-controls-combobox"
├── name: string                 # human label, e.g. "ComboBox"
├── wave: "A" | "B" | "C" | "D" | "E"   # plan's risk-order wave
├── category: "shared" | "styles-only"  # cross-package promise present (shared) or not
├── status: "not-started" | "styles-proven" | "adopted" | "unresolved"
├── capabilities: CapabilityRef[]        # shared helpers this component proves
├── fixtures: FixtureRef[]               # deterministic starting states
├── storyId: string                      # stable Storybook id for the focused run
└── downstream: DownstreamAdoption[]     # per framework that adopts the unchanged helper
```

Rules carried by the ledger:

- **status** MAY only be `styles-proven` after that component's focused Styles
  run passes (`.storybook-evidence.json` green for its stories).
- **status** MAY only be `adopted` after a `styles-proven` entry exists and a
  downstream target passes the unchanged helper.
- A `styles-only` component has empty `capabilities` and NO `downstream`; it is
  proven by deterministic states, semantics, viewport/content pressure, and Axe,
  not by a shared contract.
- Wave order is A (stateful keyboard/focus) → B (form controls) → C (navigation,
  collections, activation) → D (status, feedback, progress) → E (visual and
  composition-led). A later-wave component is not proven ahead of its wave's
  reusable helpers unless those helpers are already green.

## Component and helper taxonomy

```text
SharedCapabilityGroup (category: "shared")
├── disclosure        # e.g. Accordion (seeded), Banner, Header, Sidenav, Search
├── overlay           # e.g. Modal, ComboBox dropdown, DatePicker calendar, Toast
├── composite-widget  # e.g. ComboBox, DateRangePicker, SegmentedControl, List grouping
└── focus             # e.g. Modal (containment/restoration), Sidenav, Skipnav

SingleCapabilityHelper (one per observable capability)
└── verify<Action><Outcome>(harness, opts?)  # never verify<Component>
```

The Accordion `disclosure` helpers (`verifyEnterExpandsDisclosure`,
`verifySpaceCollapsesDisclosure`, `verifySingleOpenBehavior`,
`verifyDisclosurePanelAssociation`, `verifyPanelAvailability`,
`verifyFocusRetention`) are the first seed of the `disclosure` group. A helper
is promoted to a shared group only when two or more components share the exact
observable promise.

## Entities

### Component Target

What a row in the rollout ledger models — a single proven-or-proofable unit.

| Field | Type | Notes |
|-------|------|-------|
| `component` | string | stable story-id base |
| `wave` | enum | A–E |
| `category` | enum | `shared` / `styles-only` |
| `status` | enum | not-started / styles-proven / adopted / unresolved |

Validation from requirements:
- `shared` requires at least one `capability` and a Styles proof (`FR-001`..`FR-006`).
- `adopted` requires `styles-proven` first (`FR-014`).
- `styles-only` has no capabilities/downstream (`FR-012`, `FR-013`).

State transition:

```text
not-started --focused styles run green--> styles-proven
styles-proven --downstream target green (unchanged helper)--> adopted
```

### Shared Capability

`category: shared` only.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | `combo-box.option-navigation` style |
| `group` | enum | disclosure / overlay / composite-widget / focus |
| `label` | string | observable behavior |

### Fixture

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | `combo-box.default` |
| `state` | enum | initial / resolved / unresolved |
| `deterministic` | boolean | always true (`FR-016`) |

### Downstream Adoption

| Field | Type | Notes |
|-------|------|-------|
| `package` | string | e.g. `styles`, `react`, future framework |
| `isolationGuard` | string | how runtime isolation was proven (framework) |
| `provenAt` | string | when Styles proof and adoption were recorded |

## Evidence report binding

`scripts/storybook-evidence-report.mjs` reads the rollout ledger, the
`.storybook-evidence.json` green-run signal, and the accessibility-exception
registry, and emits per-component evidence in three separate measures:

1. deterministic state fixtures (story presence),
2. executable behavior-contract adoption (`styles-proven` / `adopted` per
   capability), and
3. automated Axe execution.

Visual smoke and manual keyboard/focus/assistive-technology review stay separate
evidence. No aggregate is labeled WCAG certification. `FR-015` requires every
component proof to assert an initialized runtime and fail with target, story,
and capability context rather than silently skip.

## Wave coverage (from spec FR-004..FR-012)

| Wave | Components | Evidence |
|------|-----------|----------|
| A | Modal, Banner, ComboBox, DatePicker, DateRangePicker, Header, Sidenav, Search | shared (disclosure, overlay, composite-widget, focus) |
| B | Checkbox, Radio, Select, Input, Textarea | shared (form labeling/entry/keyboard/associations) |
| C | Button, ButtonGroup, Link, Pagination, Breadcrumb, Skipnav, Table, List | shared (activation, semantics); no invented interaction for static |
| D | Alert, SiteAlert, Toast, PageError, Loading, Skeleton, ProcessList, StepIndicator, SummaryBox, EmptyState | shared (roles, live/status, content, dismissal, state) |
| E | Markdown/pattern/recipe/dashboard/discovery/interaction-control surfaces | styles-only (deterministic, semantics, viewport pressure, Axe) |

A component is proven one-at-a-time within its wave (`FR-003`); parallel work is
limited to components sharing only non-overlapping infrastructure.