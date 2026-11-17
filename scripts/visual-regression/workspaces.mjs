/**
 * Per-workspace configuration for the pixel visual-regression suites.
 *
 * Each workspace has its own Storybook, story list, rollout list, baselines
 * and CI job, and is compared only with its own baselines. Everything else
 * comes from the shared harness in `harness.mjs`.
 *
 * - `stories` maps a canonical story ID to a renderer-independent
 *   `<component>/<state>` key and the conditions it is captured under. The
 *   key names the baseline directory and is chosen so that the styles and
 *   React captures of the same state can later be paired; it is not derived
 *   from the story ID, because story IDs differ between workspaces.
 * - `rollout` is the reviewed list of components whose baselines are
 *   enforced. The suite compares only these components and reports how many
 *   canonical stories it does not compare.
 *
 * Which conditions apply to a story follows the rule in
 * docs/testing/visual-regression.md. Note the reason next to each entry.
 */

import { CANONICAL_STORIES } from '../../packages/styles/scripts/quality-gates.mjs'

export const WORKSPACES = {
  styles: {
    name: 'styles',
    staticDirectory: 'apps/storybook/storybook-static',
    resultsDirectory: 'apps/storybook/test-results/pixels',
    port: 6014,
    canonicalStories: CANONICAL_STORIES,
    stories: [
      {
        id: 'interaction-controls-iconbutton--all-variants',
        key: 'icon-button/all-variants',
        // forced-colors: the variants are told apart by colour, background
        // and border, and the component has forced-colors rules.
        // focus-visible: interactive control with a focus ring.
        // Not text-200: icon-only, sized in px, so text size cannot change it.
        // Not reduced-motion: its only motion rule removes transitions, which
        // a still capture never shows.
        conditions: ['default', 'forced-colors', 'focus-visible'],
      },
    ],
    rollout: ['icon-button'],
  },
}

export function getWorkspace(name) {
  const workspace = WORKSPACES[name]
  if (!workspace) {
    throw new Error(
      `Unknown visual-regression workspace "${name ?? ''}". Expected one of: ${Object.keys(WORKSPACES).join(', ')}`,
    )
  }
  return workspace
}
