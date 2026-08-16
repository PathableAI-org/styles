import type { StoryHarness } from './types.js'
import { getDisclosureButton, getAssociatedPanel } from './_lib.js'

/**
 * Shared capability: disclosure-to-panel association.
 * Verifies a disclosure button resolves to its associated panel via
 * `aria-controls` → element `id`, and both live in the rendered root.
 */
export async function verifyDisclosurePanelAssociation(
  harness: StoryHarness,
  disclosureName: string | RegExp,
) {
  const button = getDisclosureButton(harness, disclosureName)
  const panel = getAssociatedPanel(button)

  if (!harness.root.contains(button) || !harness.root.contains(panel)) {
    throw new Error(
      `Disclosure "${String(disclosureName)}" or its panel is outside the rendered root.`,
    )
  }
}
