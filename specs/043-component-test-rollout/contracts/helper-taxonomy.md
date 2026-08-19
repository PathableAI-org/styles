# Shared Capability Helper Contract (Phase 3)

This contract defines the small, shared capability taxonomy that Phase 3
generalizes from the Phase 1 Accordion helpers. It descends from the Phase 1
runner/evidence contracts and preserves the rule that helpers exercise **one
capability each** and never become a second framework.

## Purpose

As the stateful Wave A components are proven, extract genuinely
cross-component validators into a small named set of shared capability groups.
A helper is promoted to a shared group only when two or more components share
the exact observable promise. This limits the helper set and prevents
`packages/storybook-contracts` from becoming a framework (Phase 3's primary
risk, per the plan).

## Single-capability rule

Each exported helper:

- is named for exactly one observable capability, e.g. `verifyEnterExpandsDisclosure`,
  not `verifyAccordion` and not `verifyComponent`.
- accepts an `HTMLElement`/`StoryHarness` (or the smallest structural
  interface) plus per-helper options.
- never accepts React props, Storybook renderer context types, CSS selectors,
  or package internals.
- asserts an observable semantic outcome using accessible roles, names, ARIA
  state, focus, and panel/overlay availability.

A broken helper makes **every** adopting target fail together; a component's own
regression fails only that component's contract.

## Shared capability groups

| Group | Observable promises (examples) | First seed |
|-------|--------------------------------|------------|
| `disclosure` | activation toggles an associated region; panel availability ties to state; single-open; focus retention | Accordion helpers (already shared) |
| `overlay` | open/close; accessible name; initial focus; Escape; focus containment and restoration | Modal, ComboBox dropdown, DatePicker calendar, Toast |
| `composite-widget` | option navigation/selection; input and calendar synchronization; range rules; validation | ComboBox, DateRangePicker, SegmentedControl, List grouping |
| `focus` | focus enters on open; focus is contained; focus returns on close | Modal, Sidenav, Skipnav |

## Helper naming

```text
verify<Action><Outcome>(harness, options)
```

Examples (illustrative, one per capability):

- `verifyEnterExpandsDisclosure` (existing)
- `verifySpaceCollapsesDisclosure` (existing)
- `verifyEscapeClosesOverlay` (overlay)
- `verifyInitialFocusPlaced` (overlay/focus)
- `verifyFocusContainedWhileOpen` (focus)
- `verifyFocusRestoredOnClose` (focus)
- `verifyOptionNavigable` / `verifyOptionSelectable` (composite-widget)

## Promotion rule

A capability group MAY host a new helper only when the observable promise is
shared by at least two components. Styles-only surfaces stay fixtures and must
not gain shared helpers until a downstream package exposes the same promise
(`FR-013`). No helper is invented for a purely static structure (`FR-009`).

## Compliance with Phase 1 contracts

- Helpers remain renderer-neutral (Phase 1 runner contract).
- The rollout ledger references helpers as `CapabilityRef`, so the evidence
  report can attribute a proven capability to the components that proved it.
- No shared helper, manifest, or ledger is included in any publishable package's
  npm payload; `packages/storybook-contracts` stays private.