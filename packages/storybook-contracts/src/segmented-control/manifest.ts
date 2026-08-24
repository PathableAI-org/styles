import type { SegmentedControlManifest } from './types.js'

/** Renderer-neutral SegmentedControl behavior proven by Styles first. */
export const segmentedControlManifest: SegmentedControlManifest = {
  shared: [
    {
      id: 'segmented-control.single-selection',
      label: 'A named radiogroup exposes exactly one selected radio option',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'segmented-control.arrow-navigation',
      label: 'Arrow navigation wraps focus and selection between radio options',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'segmented-control.disabled-option-skip',
      label: 'Arrow navigation skips a disabled radio option',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'segmented-control.vertical-navigation',
      label: 'A vertical radiogroup supports vertical Arrow navigation',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'segmented-control.multi-selection',
      label: 'A named group exposes independently pressed toggle buttons',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'segmented-control.multi-keyboard-toggle',
      label:
        'Keyboard activation toggles one option without changing the others',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'segmented-control.static-single-option',
      label: 'A one-option presentation has no interactive group semantics',
      scope: 'shared',
      state: 'initial',
    },
  ],
  packageSpecific: [
    'styles: selected, disabled, focus, forced-colors, reduced-motion, and overflow visuals',
    'styles: selected modifier class and ARIA selector equivalence',
    'react: controlled value and values props',
    'react: callback payloads and ordering',
    'react: missing-callback read-only policy',
    'react: invalid-value and empty-string handling',
    'react: root and option attribute forwarding',
  ],
  unresolved: [],
  fixtures: [
    { name: 'segmented-control.single-select' },
    { name: 'segmented-control.multi-select' },
    { name: 'segmented-control.vertical' },
    { name: 'segmented-control.disabled-option' },
    { name: 'segmented-control.static-single-option' },
  ],
}
