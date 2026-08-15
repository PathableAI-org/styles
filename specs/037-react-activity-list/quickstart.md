# Quickstart: React Activity List Validation

## Prerequisites

- Use branch `038-react-activity-list`.
- Install the repository's pinned pnpm and workspace dependencies.
- Confirm `.specify/feature.json` points to
  `specs/037-react-activity-list`.
- Run all pnpm commands with `CI=true` in non-interactive environments.

The public input and markup contract is defined in
[contracts/props.md](./contracts/props.md). Formal scenario, fixture, UIF, and
assertion contracts live under [contracts/](./contracts/).

## 1. Source-First Contract Evidence

Inspect and validate the corrected source contract before relying on React:

```bash
CI=true pnpm --filter @pathableai/styles build
CI=true pnpm lint:styles
CI=true pnpm build:docs
```

Expected outcomes:

- The status marker remains decorative and retains documented and neutral
  shapes while visible status text supplies the accessible meaning.
- Date and owner text use reliable shrink/ellipsis containment; the owner label
  has an explicit owner-text child.
- Existing title/context truncation, densities, 640-pixel breakpoint, mobile
  date order, action visibility, empty state, forced colors, and reduced motion
  remain intact.
- Canonical Activity List, Dashboard Overview, and both Operational Dashboard
  story surfaces use the corrected markup.

## 2. React Type and Build Evidence

```bash
CI=true pnpm --filter @pathableai/react typecheck
CI=true pnpm --filter @pathableai/react lint
CI=true pnpm --filter @pathableai/react build
```

Expected outcomes:

- `ActivityList` and every type documented in
  [contracts/props.md](./contracts/props.md) compile and are exported.
- Flat and grouped inputs are mutually exclusive.
- The wrapper emits no private stylesheet and retains the root Styles import.
- No client directive, browser-only dependency, or owned business state is
  introduced.

## 3. Static Quality Gates

```bash
CI=true pnpm lint:js
CI=true pnpm lint:md
CI=true pnpm check:format
```

Expected outcome: all changed source, story, script, and planning artifacts pass
their normal validators without exclusions, skips, or rule suppression.

## 4. Independent Storybook and Accessibility Evidence

```bash
CI=true pnpm build:docs-react
CI=true pnpm test:storybook
```

Expected outcomes:

- Both Styles and React catalogs build and test independently.
- React fixed stories include Playground, grouped Default,
  UngroupedWithoutActions, MixedStatuses, UnknownStatus, Compact, Comfortable,
  Mobile, LongContent, and Empty.
- Browser assertions prove list/listitem semantics, supplied order, one visible
  accessible status meaning, resolving group `aria-labelledby`, omitted empty
  groups/action wrappers, and native keyboard action focus/activation.
- Rendered accessibility reports no actionable new violations.

## 5. Responsive and Visual Evidence

```bash
CI=true pnpm quality-gates
CI=true pnpm test:visual
```

Review the fixed source and React stories at 375, 768, and 1280 pixels and with
increased text. Expected outcomes by Visual Item ID:

- `VIS-001`: documented status markers and density treatments remain stable;
  unfamiliar status remains neutral and every label is visible.
- `VIS-002`: title, context, status, date, and owner text ellipsize within the
  available layout; complete values remain in DOM text; mobile date order and
  action visibility remain intact; no horizontal overflow appears.
- `VIS-003`: each heading immediately precedes its nested list and its ID
  resolves from `aria-labelledby`; empty groups are absent.
- `VIS-004`: desktop hover/focus and coarse/mobile action availability remain
  unchanged, and focus is visible and unclipped.
- `VIS-005`: empty output contains only the source empty modifier and supplied
  empty content.

L0 does not require external screenshot approval, but browser-rendered review
and the repository visual gates remain required. Do not approve unexplained
snapshot changes.

## 6. Server Compatibility Evidence

```bash
CI=true pnpm test:storybook-react-server
```

Expected outcomes:

- `ActivityList` is classified as server-default and adds no finding.
- Initial output contains complete content, status labels, group relationships,
  links, and actions.
- The advisory report may retain the repository's six unrelated baseline
  findings. Do not use strict mode as this feature's gate and do not alter the
  baseline to hide a new finding.

## 7. Packed Package and Consumer Evidence

```bash
CI=true pnpm --filter @pathableai/react check:package
CI=true pnpm --filter @pathableai/react check:types
CI=true pnpm test:next-consumer
```

Expected outcomes:

- Runtime exports and packed declarations expose `ActivityList` and its public
  types.
- Packed metadata retains the runtime `@pathableai/styles` dependency and peer
  dependencies.
- The Next App Router fixture imports only `@pathableai/react`, builds, and
  produces initial HTML containing representative grouped known/unknown status
  content and a link action.
- Required Activity List CSS reaches the consumer through the React package.

## 8. Regression and Release Metadata

```bash
CI=true pnpm test:contracts
CI=true pnpm changeset:status
git diff --check origin/main
```

Expected outcomes:

- Existing shared behavior contracts remain green; Activity List does not take
  ownership of consumer action behavior in that harness.
- Changesets describe patch-level consumer-visible changes to Styles and React.
- No versioning or publication occurs.
- The final diff contains no whitespace errors.

## Formal Contract Trace

| Scenario | Primary evidence |
| --- | --- |
| `S-001` | React Storybook roles/content plus keyboard action play coverage |
| `S-002` | No-action fixed story and absent action container assertion |
| `S-003` | UnknownStatus story and neutral marker/visible label evidence |
| `S-004` | Grouped, ungrouped, compact, and comfortable fixed stories |
| `S-005` | LongContent/Mobile browser and responsive visual review |
| `S-006` | Group heading and `aria-labelledby` accessible queries |
| `S-007` | Advisory server audit, package checks, and packed Next consumer |
| `S-008` | Empty and empty-group fixed story assertions |

## Completion Rule

Implementation is ready for review only when every applicable command reaches a
terminal passing state or a genuine product/environment blocker is documented,
the source correction precedes adapter evidence, the packed consumer succeeds,
and no quality or accessibility rule is weakened.
