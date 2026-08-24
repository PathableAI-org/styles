# SegmentedControl shared contract

`@pathable/storybook-contracts` defines the renderer-neutral
SegmentedControl behavior that is proven by the canonical Styles reference
fixtures before any framework package adopts the helpers unchanged.

## Initial shared capabilities

| Capability                                | Observable assertion                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `segmented-control.single-selection`      | A named radiogroup exposes multiple radio options with exactly one selected roving tab stop. |
| `segmented-control.arrow-navigation`      | Arrow navigation wraps focus and selection between enabled radio options.                    |
| `segmented-control.disabled-option-skip`  | A disabled radio is exposed as disabled and skipped during Arrow navigation.                 |
| `segmented-control.vertical-navigation`   | A vertical radiogroup exposes its orientation and supports ArrowUp/ArrowDown navigation.     |
| `segmented-control.multi-selection`       | A named group exposes native toggle buttons with independent `aria-pressed` state.           |
| `segmented-control.multi-keyboard-toggle` | Space or Enter toggles one focused option without changing the other options.                |
| `segmented-control.static-single-option`  | A one-option presentation remains visible without button, radio, or group semantics.         |

## Styles reference runtime

`@pathableai/styles` publishes the visual CSS contract, not SegmentedControl
behavior JavaScript. The canonical Styles stories install deterministic,
story-owned reference handlers for selection and keyboard behavior before
calling these helpers. That fixture runtime demonstrates the consumer behavior
required by the contract; it is not shipped as package runtime.

## Package-specific scope

The shared helpers do not assert CSS classes, computed appearance, overflow
dimensions, forced-colors behavior, or reduced motion. Those remain Styles-owned
visual evidence.

React props, controlled-state mechanics, callback payloads and ordering,
callback-free read-only behavior, invalid and empty-string values, and native
attribute forwarding remain React-specific. They must not be inferred from or
added to these renderer-neutral helpers.

## Fixtures

Both renderers provide deterministic equivalents for single selection, multi
selection, vertical navigation, disabled-option navigation, and static
one-option presentation. Fixture markup and state ownership may differ as long
as the accessible observable outcomes remain the same.
