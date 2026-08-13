# Data Model: Accordion Behavior Contract Pilot

## Behavior Scenario

A named, traceable example of one shared user-observable rule.

| Field | Description | Validation |
| --- | --- | --- |
| Traceability tag | Stable contract identifier | Unique within the feature |
| Name | Product-readable behavior title | Does not expose implementation IDs |
| Initial fixture | Shared conceptual starting state | Registered by every required target |
| Actions | Keyboard or activation sequence | Expressed through shared vocabulary |
| Outcomes | State, association, visibility, and focus | Observable in a browser |

## Contract Fixture

A framework-neutral name for a deterministic initial Accordion state.

| Fixture | Required state |
| --- | --- |
| `accordion.default` | Two or more collapsed disclosures; single-open mode |
| `accordion.first-expanded` | First disclosure expanded; second collapsed; single-open mode |

Each target maps the fixture name to its own Storybook story identifier. The
feature file never contains that identifier.

## Target

A concrete implementation environment evaluated for conformance.

| Field | Description | Validation |
| --- | --- | --- |
| Name | Stable CLI/reporting name | `styles` or `react` in this pilot |
| Storybook package | Workspace providing the catalog | Must exist |
| Build commands | Ordered prerequisites | Every command must exit successfully |
| Static directory | Built catalog output | Must exist before serving |
| Port | Local isolated server port | Unique per target |
| Fixtures | Shared name to story ID mapping | All required fixtures present |
| Capabilities | Behaviors claimed by target | All required pilot capabilities present |

## Capability

A shared behavior a target claims and must execute. The pilot requires:

- `accordion.keyboard-enter`
- `accordion.keyboard-space`
- `accordion.single-open`
- `accordion.panel-association`
- `accordion.focus-retention`

Required capabilities cannot be silently skipped. A missing declaration fails
target preflight.

## Contract World

Per-scenario runtime context containing the selected target, browser context,
page, active fixture, and resolved disclosure/panel handles. Browser process
ownership is shared across scenarios in one target run; browser contexts are
isolated and closed after every scenario.

## Conformance Result

| Field | Description |
| --- | --- |
| Target | Implementation under test |
| Scenario | Product-readable scenario name |
| Status | Passed, failed, or preflight failure |
| Failure evidence | Unmet observable outcome and browser error context |

The aggregate matrix contains three scenario results for each of two targets.

## State Transitions

```text
collapsed --Enter/Space--> expanded
expanded  --Enter/Space--> collapsed

single-open:
first expanded + activate second
  -> first collapsed + second expanded
```

Every transition preserves focus on the activated disclosure and keeps
`aria-expanded`, the associated panel's availability, and rendered visibility
in agreement.
