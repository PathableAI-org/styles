# Rollout Ledger Contract (Phase 3)

This contract defines the component rollout ledger that Phase 3 introduces on
top of the Phase 1 runner and evidence contracts. It is the reviewable,
machine-readable record of each component's Styles proof and downstream-adoption
status. It lives in `packages/storybook-contracts` (see `src/rollout/rollout.ts`)
and is read by `scripts/storybook-evidence-report.mjs`.

## Purpose

One ledger answers the cross-component questions the Phase 3 completion criteria
require:

- What component has a Styles proof, and in what wave?
- Which components are shared-contract, and which are Styles-only?
- Has any framework adopted a component before its Styles proof exists?
- Is any capability claimed without a green focused run?

## Ledger entry shape

```text
RolloutEntry
├── component   (string)   stable story-id base, e.g. "components-form-controls-combobox"
├── name        (string)   human label, e.g. "ComboBox"
├── wave        ("A"|"B"|"C"|"D"|"E")
├── category    ("shared"|"styles-only")
├── status      ("not-started"|"styles-proven"|"adopted"|"unresolved")
├── capabilities (CapabilityRef[])   # shared helpers for shared components
├── fixtures     (FixtureRef[])      # deterministic starting states
├── storyId      (string)            # stable Storybook id for the focused run
└── downstream   (DownstreamAdoption[])
```

## Status rules

| Transition | Guard |
|-----------|-------|
| `not-started` → `styles-proven` | Focused Styles run passes for this component's stories (`.storybook-evidence.json` green). |
| `styles-proven` → `adopted` | A downstream target passes the *unchanged* shared helper(s) after `styles-proven` exists. |
| `not-started` → `adopted` | **Forbidden** — a component may never be adopted without a Styles proof (`FR-014`). |

## Category rules

- `shared` MUST list at least one `capabilities` entry and MUST reach
  `styles-proven` before adoption.
- `styles-only` MUST have empty `capabilities` and `downstream`; it is proven by
  deterministic states, semantics, viewport/content pressure, and Axe, not a
  shared contract (`FR-009`, `FR-012`, `FR-013`).

## Wave order

| Wave | Order | Components |
|------|-------|-----------|
| A | stateful keyboard/focus | Modal, Banner, ComboBox, DatePicker, DateRangePicker, Header, Sidenav, Search |
| B | form controls | Checkbox, Radio, Select, Input, Textarea |
| C | navigation, collections, activation | Button, ButtonGroup, Link, Pagination, Breadcrumb, Skipnav, Table, List |
| D | status, feedback, progress | Alert, SiteAlert, Toast, PageError, Loading, Skeleton, ProcessList, StepIndicator, SummaryBox, EmptyState |
| E | visual and composition-led | pattern/recipe/dashboard/discovery/interaction-control surfaces |

A component is proven one at a time within a wave (`FR-003`); parallel work is
limited to components sharing only non-overlapping infrastructure.

SegmentedControl is an approved component-scoped exception to the default wave
sequence because a downstream React package now exposes the same promise. The
exception does not relax proof order: its entry must reach `styles-proven` with
no downstream adoption before a separate React change can mark it `adopted`.

IconTile and Integration are approved component-scoped Wave E exceptions that
remain Styles-only. Their independent focused proofs do not start downstream
adoption or imply completion of unfinished Waves B-D.

## Downstream adoption contract

For each framework that adopts a shared component (`status: adopted`):

```text
DownstreamAdoption
├── package       (string)  e.g. "styles", "react", future framework
├── isolationGuard (string) how runtime isolation was proven (framework-specific)
└── provenAt      (string)  when Styles proof and adoption were recorded
```

A downstream package must invoke the *unchanged* helper (Phase 2 precedent). It
must not redefine the shared capability. The `styles` package is the first and
only executable owner of a shared behavior in this phase for a given
component until an adopting framework registers (`FR-001`..`FR-006`,
`FR-014`).

## Failure semantics

- A filtered green run that matches no ledger entry or no proven shared contract
  is an evidence-report failure, not a warning. Entries outside the latest
  focused run are reported as not covered by that run; the PR or CI run that
  advances an entry to `styles-proven` remains its durable review evidence.
- A `shared` entry referenced by a downstream target before `styles-proven` is a
  hard failure.
- A `styles-only` entry must not be reported as shared-contract adoption.
- The report never labels any aggregate WCAG certification.
