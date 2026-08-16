# Accordion shared contract

`@pathable/storybook-contracts` defines the renderer-neutral Accordion behavior
that is first proven by `packages/styles`, then reused by downstream framework
packages unchanged.

## Initial shared capabilities

The [manifest](./manifest.ts) records these six observable capabilities as the
initial shared contract:

| Capability                     | Observable assertion                                                                      |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| `accordion.keyboard-enter`     | Enter expands a collapsed disclosure.                                                     |
| `accordion.keyboard-space`     | Space collapses an expanded disclosure.                                                   |
| `accordion.single-open`        | Opening a second disclosure closes the current one.                                       |
| `accordion.panel-association`  | A disclosure resolves to its associated panel (accessible name + `aria-controls` → `id`). |
| `accordion.panel-availability` | A panel is available only while its disclosure is expanded.                               |
| `accordion.focus-retention`    | Focus stays on the disclosure after activation.                                           |

> **Activation semantics**: the shared contract states that activating a
> disclosure (Enter, Space, or pointer) toggles it and its panel. The Styles
> reference runtime loaded in the catalog binds disclosure toggling on a click
> (`@pathableai/styles/js` USWDS Accordion is click-driven), so the Styles-first
> browser proof sends an activation click — the same observable outcome asserted
> by the React `PointerToggle`/`KeyboardToggle` stories and the Cucumber
> `@SCN-ACC-001/002/003` scenarios. Keyboard-equivalent activation is exercised
> where the runtime binds it; the contract asserts the observable toggle
> outcome, not a specific DOM event.

## Reconciliation notes

This manifest reconciles the pre-existing surfaces so no currently-supported
shared assertion disappears silently:

- `behavior-contracts/features/accordion.feature` — the former top-level
  Cucumber pilot (`@SCN-ACC-001` Enter, `@SCN-ACC-002` Space, `@SCN-ACC-003`
  single-open) that was retired when the shared-contract stories proved
  equivalent behavior. Its three scenarios map 1:1 to the shared capabilities
  below; panel association and focus are asserted inside the matching helpers.
- `packages/styles/src/stories/components/Communication/Accordion.stories.ts` —
  the collapsed (`Default`) and initially-expanded (`InitiallyExpanded`)
  fixtures, matching the shared `accordion.default` and
  `accordion.first-expanded` fixtures, with `play` functions that exercise the
  helpers against the published runtime.
- `packages/react/src/stories/components/Communication/Accordion.stories.tsx` —
  the React `PointerToggle`, `KeyboardToggle`, `SingleSelectBehavior`, and focus
  interactions confirm the same observable surface.
- The published `@pathableai/styles/js` runtime that enhances the Styles
  catalog and drives Enter/Space/`aria-expanded`/panel availability.

Nothing that the pilot asserted is dropped: Enter, Space, single-open, panel
association, panel availability, and focus retention all map to a shared
capability above, proven by the Styles-first `test:storybook-styles` command.

## Package-specific (outside the shared contract)

Controlled/uncontrolled expanded ids, callbacks (`onExpandedChange`), refs, and
server rendering remain framework-specific and are **not** part of the shared
contract. They stay covered by `packages/react` package tests.

## Unresolved shared scope

Disabled disclosure behavior and multiple panels open simultaneously are
**unresolved** in the shared contract until `packages/styles` documents and
exposes the same promise. They are recorded (not silently claimed) so a later
Styles source change can promote them to initial shared capabilities.
