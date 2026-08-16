import type { AccordionManifest } from './types.js'

/**
 * The Accordion capability manifest.
 *
 * Records the initial shared (renderer-neutral) Accordion contract plus the
 * deliberately package-specific behaviors and the unresolved shared scope.
 * This reconciles the retired `behavior-contracts/` Gherkin pilot, the Styles
 * fixtures, the React stories, and the component documentation into one place.
 * Refer to the attached `README.md` for the reconciliation notes.
 */
export const accordionManifest: AccordionManifest = {
  shared: [
    {
      id: 'accordion.keyboard-enter',
      label: 'Enter expands a collapsed disclosure',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'accordion.keyboard-space',
      label: 'Space collapses an expanded disclosure',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'accordion.single-open',
      label: 'Opening a second disclosure closes the current one',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'accordion.panel-association',
      label: 'A disclosure is associated with its panel',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'accordion.panel-availability',
      label: 'A panel is available only when its disclosure is expanded',
      scope: 'shared',
      state: 'initial',
    },
    {
      id: 'accordion.focus-retention',
      label: 'Focus remains on the disclosure after activation',
      scope: 'shared',
      state: 'initial',
    },
  ],
  packageSpecific: [
    'controlled/uncontrolled expanded ids',
    'callbacks (onExpandedChange)',
    'refs',
    'server rendering',
  ],
  unresolved: [
    {
      id: 'accordion.disabled',
      label: 'Disabled disclosure behavior',
      scope: 'shared',
      state: 'unresolved',
    },
    {
      id: 'accordion.multiple-open',
      label: 'Multiple panels open simultaneously',
      scope: 'shared',
      state: 'unresolved',
    },
  ],
  fixtures: [
    {
      name: 'accordion.default',
      firstExpanded: false,
    },
    {
      name: 'accordion.first-expanded',
      firstExpanded: true,
    },
  ],
}
